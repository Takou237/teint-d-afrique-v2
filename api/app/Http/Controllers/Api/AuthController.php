<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Mailer;
use App\Support\ApiException;
use App\Support\ApiResponse;
use App\Support\Payload;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function session(Request $request): JsonResponse
    {
        $session = $request->session();

        if (empty($session->get('admin_id'))) {
            return ApiResponse::success(['authenticated' => false]);
        }

        if (empty($session->get('csrf_token'))) {
            $session->put('csrf_token', bin2hex(random_bytes(32)));
        }

        return ApiResponse::success([
            'authenticated' => true,
            'email' => $session->get('admin_email', ''),
            'csrfToken' => $session->get('csrf_token'),
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $email = strtolower(Payload::plainText((string) ($body['email'] ?? '')));
        $password = (string) ($body['password'] ?? '');

        if ($email === '' || $password === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new ApiException('invalid_credentials', 422);
        }

        $attempts = DB::table('login_attempts')
            ->where('email', $email)
            ->where('success', 0)
            ->whereRaw('attempted_at > (NOW() - INTERVAL 5 MINUTE)')
            ->count();

        if ($attempts >= 5) {
            throw new ApiException('too_many_attempts', 429);
        }

        $user = DB::table('admin_users')
            ->select('id', 'email', 'password_hash')
            ->where('email', $email)
            ->first();

        $valid = $user !== null && password_verify($password, $user->password_hash);

        DB::table('login_attempts')->insert([
            'email' => $email,
            'success' => $valid ? 1 : 0,
        ]);

        if (!$valid) {
            throw new ApiException('invalid_credentials', 401);
        }

        if (password_needs_rehash($user->password_hash, PASSWORD_DEFAULT)) {
            DB::table('admin_users')->where('id', $user->id)->update([
                'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            ]);
        }

        DB::table('admin_users')->where('id', $user->id)->update([
            'last_login_at' => DB::raw('NOW()'),
        ]);
        DB::table('login_attempts')->where('email', $email)->where('success', 1)->delete();

        $session = $request->session();
        $session->migrate(true);
        $session->put('admin_id', (int) $user->id);
        $session->put('admin_email', $user->email);
        $csrfToken = bin2hex(random_bytes(32));
        $session->put('csrf_token', $csrfToken);

        return ApiResponse::success([
            'email' => $user->email,
            'csrfToken' => $csrfToken,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $session = $request->session();

        if (!empty($session->get('admin_id'))) {
            $expected = (string) $session->get('csrf_token', '');
            $provided = (string) $request->header('X-CSRF-Token', '');
            if ($expected === '' || $provided === '' || !hash_equals($expected, $provided)) {
                throw new ApiException('invalid_csrf_token', 403);
            }
        }

        $session->flush();
        $session->invalidate();

        return ApiResponse::success(null);
    }

    public function password(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $currentPassword = (string) ($body['currentPassword'] ?? '');
        $newPassword = (string) ($body['newPassword'] ?? '');

        if ($currentPassword === '' || $newPassword === '') {
            throw new ApiException('missing_password', 422);
        }
        if (mb_strlen($newPassword) < 12) {
            throw new ApiException('weak_password', 422);
        }
        if (mb_strlen($newPassword) > 200) {
            throw new ApiException('password_too_long', 422);
        }
        if ($currentPassword === $newPassword) {
            throw new ApiException('password_unchanged', 422);
        }

        $session = $request->session();
        $user = DB::table('admin_users')
            ->select('id', 'email', 'password_hash')
            ->where('id', (int) $session->get('admin_id'))
            ->first();

        if ($user === null) {
            $session->invalidate();
            throw new ApiException('unauthorized', 401);
        }

        if (!password_verify($currentPassword, $user->password_hash)) {
            throw new ApiException('invalid_current_password', 401);
        }

        DB::table('admin_users')->where('id', $user->id)->update([
            'password_hash' => password_hash($newPassword, PASSWORD_DEFAULT),
        ]);
        DB::table('login_attempts')->where('email', $user->email)->delete();

        $session->migrate(true);

        return ApiResponse::success(['updated' => true]);
    }

    public function requestReset(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $email = strtolower(Payload::plainText((string) ($body['email'] ?? '')));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) {
            throw new ApiException('invalid_email', 422);
        }

        $throttle = DB::table('password_resets as pr')
            ->join('admin_users as u', 'u.id', '=', 'pr.admin_id')
            ->where('u.email', $email)
            ->whereRaw('pr.created_at > (NOW() - INTERVAL 15 MINUTE)')
            ->count();

        if ($throttle >= 3) {
            return ApiResponse::success(['sent' => true]);
        }

        $user = DB::table('admin_users')->select('id', 'email')->where('email', $email)->first();

        if ($user === null) {
            return ApiResponse::success(['sent' => true]);
        }

        $token = bin2hex(random_bytes(32));
        DB::table('password_resets')
            ->where('admin_id', $user->id)
            ->where(static function ($query): void {
                $query->whereNotNull('used_at')->orWhereRaw('expires_at < NOW()');
            })
            ->delete();

        DB::table('password_resets')->insert([
            'admin_id' => $user->id,
            'token_hash' => hash('sha256', $token),
            'expires_at' => DB::raw('(NOW() + INTERVAL 1 HOUR)'),
        ]);

        if (!Mailer::sendPasswordReset($user->email, $token)) {
            throw new ApiException('email_failed', 503);
        }

        return ApiResponse::success(['sent' => true]);
    }

    public function reset(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $token = strtolower(trim((string) ($body['token'] ?? '')));
        $password = (string) ($body['password'] ?? '');

        if (preg_match('/^[a-f0-9]{64}$/', $token) !== 1) {
            throw new ApiException('invalid_token', 410);
        }
        if (mb_strlen($password) < 12) {
            throw new ApiException('weak_password', 422);
        }
        if (mb_strlen($password) > 200) {
            throw new ApiException('password_too_long', 422);
        }

        $reset = DB::table('password_resets as pr')
            ->join('admin_users as u', 'u.id', '=', 'pr.admin_id')
            ->select('pr.id', 'pr.admin_id', 'u.email')
            ->where('pr.token_hash', hash('sha256', $token))
            ->whereNull('pr.used_at')
            ->whereRaw('pr.expires_at > NOW()')
            ->first();

        if ($reset === null) {
            throw new ApiException('invalid_token', 410);
        }

        DB::transaction(static function () use ($reset, $password): void {
            DB::table('admin_users')->where('id', $reset->admin_id)->update([
                'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            ]);

            DB::table('password_resets')
                ->where('admin_id', $reset->admin_id)
                ->whereNull('used_at')
                ->update(['used_at' => DB::raw('NOW()')]);

            DB::table('login_attempts')->where('email', $reset->email)->delete();
        });

        return ApiResponse::success(['reset' => true]);
    }
}
