<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\ApiException;
use App\Support\ApiResponse;
use App\Support\Payload;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SettingsController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success($this->settingsMap());
    }

    public function update(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        if ($body === []) {
            throw new ApiException('nothing_to_update', 422);
        }

        if (isset($body['key']) && is_string($body['key']) && array_key_exists('value', $body)) {
            $body = [$body['key'] => $body['value']];
        }

        $allowedKeys = [
            'site_name', 'tagline_fr', 'tagline_en', 'email', 'phone', 'whatsapp_number',
            'address_fr', 'address_en', 'hours_fr', 'hours_en',
            'instagram_url', 'facebook_url', 'tiktok_url', 'youtube_url',
        ];
        $urlKeys = ['instagram_url', 'facebook_url', 'tiktok_url', 'youtube_url'];

        try {
            DB::transaction(static function () use ($body, $allowedKeys, $urlKeys): void {
                foreach ($body as $key => $value) {
                    if (!is_string($key) || !in_array($key, $allowedKeys, true)) {
                        throw new \InvalidArgumentException('invalid_setting_key');
                    }
                    if (!is_scalar($value) && $value !== null) {
                        throw new \InvalidArgumentException('invalid_setting_value');
                    }

                    $text = Payload::plainText((string) ($value ?? ''));

                    if (mb_strlen($text) > 500) {
                        throw new \InvalidArgumentException('setting_value_too_long');
                    }
                    if ($key === 'email' && $text !== '' && !filter_var($text, FILTER_VALIDATE_EMAIL)) {
                        throw new \InvalidArgumentException('invalid_email');
                    }
                    if (in_array($key, $urlKeys, true) && $text !== '' && !Payload::isHttpUrl($text)) {
                        throw new \InvalidArgumentException('invalid_url');
                    }
                    if ($key === 'whatsapp_number' && $text !== '' && !preg_match('/^\d{6,15}$/', $text)) {
                        throw new \InvalidArgumentException('invalid_whatsapp_number');
                    }

                    DB::statement(
                        'INSERT INTO settings (`key`, `value`) VALUES (?, ?)
                         ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
                        [$key, $text]
                    );
                }
            });
        } catch (\Throwable $e) {
            $code = $e instanceof \InvalidArgumentException ? $e->getMessage() : 'invalid_setting_value';

            throw new ApiException($code, 422);
        }

        return ApiResponse::success($this->settingsMap());
    }

    private function settingsMap(): array
    {
        $rows = DB::table('settings')->select('key', 'value')->orderBy('key')->get();

        $data = [];
        foreach ($rows as $row) {
            $data[$row->key] = $row->value;
        }

        return $data;
    }
}
