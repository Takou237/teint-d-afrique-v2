<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(mixed $data = null, int $status = 200): JsonResponse
    {
        return response()->json(
            ['success' => true, 'data' => $data],
            $status,
            [],
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        )->header('Content-Type', 'application/json; charset=utf-8');
    }

    public static function error(string $code, int $status = 400): JsonResponse
    {
        return response()->json(
            ['success' => false, 'error' => $code],
            $status,
            [],
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        )->header('Content-Type', 'application/json; charset=utf-8');
    }
}
