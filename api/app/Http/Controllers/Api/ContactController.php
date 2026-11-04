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

class ContactController extends Controller
{
    public function submit(Request $request): JsonResponse
    {
        $body = Payload::json($request);

        $name = Payload::plainText((string) ($body['name'] ?? ''));
        $email = strtolower(Payload::plainText((string) ($body['email'] ?? '')));
        $phone = Payload::plainText((string) ($body['phone'] ?? ''));
        $message = trim(strip_tags((string) ($body['message'] ?? '')));

        if ($name === '' || mb_strlen($name) > 190) {
            throw new ApiException('invalid_name', 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) {
            throw new ApiException('invalid_email', 422);
        }
        if (mb_strlen($phone) > 50) {
            throw new ApiException('invalid_phone', 422);
        }
        if ($message === '' || mb_strlen($message) > 5000) {
            throw new ApiException('invalid_message', 422);
        }

        $ip = substr((string) $request->ip(), 0, 45);

        $recent = DB::table('contact_messages')
            ->where('ip_address', $ip)
            ->whereRaw('created_at > (NOW() - INTERVAL 10 MINUTE)')
            ->count();

        if ($recent >= 5) {
            throw new ApiException('too_many_messages', 429);
        }

        $id = DB::table('contact_messages')->insertGetId([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'message' => $message,
            'ip_address' => $ip,
        ]);

        Mailer::notifyNewContactMessage([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'message' => $message,
        ]);

        return ApiResponse::success(['id' => (int) $id], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));
        $q = mb_substr($q, 0, 100);
        $filter = (string) $request->query('filter', 'all') === 'unread' ? 'unread' : 'all';
        $page = max(1, (int) $request->query('page', 1));
        $perPage = (int) $request->query('perPage', 20);
        $perPage = $perPage < 1 ? 20 : min($perPage, 50);

        $base = DB::table('contact_messages');

        if ($q !== '') {
            $like = '%' . addcslashes($q, '%_\\') . '%';
            $base->where(static function ($query) use ($like): void {
                $query->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhere('phone', 'like', $like)
                    ->orWhere('message', 'like', $like);
            });
        }

        if ($filter === 'unread') {
            $base->where('is_read', 0);
        }

        $total = (clone $base)->count();
        $unread = DB::table('contact_messages')->where('is_read', 0)->count();

        $rows = (clone $base)
            ->select('id', 'name', 'email', 'phone', 'message', 'is_read', 'created_at')
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get();

        $items = $rows->map(static fn ($row): array => [
            'id' => (int) $row->id,
            'name' => $row->name,
            'email' => $row->email,
            'phone' => $row->phone,
            'message' => $row->message,
            'isRead' => (bool) $row->is_read,
            'createdAt' => $row->created_at,
        ])->all();

        return ApiResponse::success([
            'items' => $items,
            'total' => $total,
            'page' => $page,
            'perPage' => $perPage,
            'unread' => $unread,
        ]);
    }

    public function manage(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $id = filter_var($body['id'] ?? null, FILTER_VALIDATE_INT);
        if ($id === false || $id <= 0) {
            throw new ApiException('invalid_id', 422);
        }
        if (!DB::table('contact_messages')->where('id', $id)->exists()) {
            throw new ApiException('not_found', 404);
        }

        if (!empty($body['delete'])) {
            DB::table('contact_messages')->where('id', $id)->delete();

            return ApiResponse::success(null);
        }

        $isRead = !empty($body['isRead']) ? 1 : 0;
        DB::table('contact_messages')->where('id', $id)->update(['is_read' => $isRead]);

        return ApiResponse::success(['id' => $id, 'isRead' => (bool) $isRead]);
    }
}
