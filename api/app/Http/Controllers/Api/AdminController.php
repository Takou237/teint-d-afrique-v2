<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\ApiException;
use App\Support\ApiResponse;
use App\Support\Payload;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $selfId = (int) $request->session()->get('admin_id');
        $rows = DB::table('admin_users')
            ->select('id', 'email', 'created_at', 'last_login_at')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();

        $data = $rows->map(static fn ($row): array => [
            'id' => (int) $row->id,
            'email' => $row->email,
            'createdAt' => $row->created_at,
            'lastLoginAt' => $row->last_login_at,
            'isSelf' => (int) $row->id === $selfId,
        ])->all();

        return ApiResponse::success($data);
    }

    public function store(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $email = strtolower(Payload::plainText((string) ($body['email'] ?? '')));
        $password = (string) ($body['password'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) {
            throw new ApiException('invalid_email', 422);
        }
        if (mb_strlen($password) < 12) {
            throw new ApiException('weak_password', 422);
        }
        if (mb_strlen($password) > 200) {
            throw new ApiException('password_too_long', 422);
        }
        if (DB::table('admin_users')->where('email', $email)->exists()) {
            throw new ApiException('email_already_used', 409);
        }

        $id = DB::table('admin_users')->insertGetId([
            'email' => $email,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
        ]);

        return ApiResponse::success(['id' => (int) $id, 'email' => $email], 201);
    }

    public function destroy(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $id = filter_var($body['id'] ?? null, FILTER_VALIDATE_INT);

        if ($id === false || $id <= 0) {
            throw new ApiException('invalid_id', 422);
        }
        if ($id === (int) $request->session()->get('admin_id')) {
            throw new ApiException('cannot_delete_self', 409);
        }
        if (!DB::table('admin_users')->where('id', $id)->exists()) {
            throw new ApiException('not_found', 404);
        }
        if (DB::table('admin_users')->count() <= 1) {
            throw new ApiException('last_admin', 409);
        }

        DB::table('admin_users')->where('id', $id)->delete();

        return ApiResponse::success(null);
    }
}
