<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\ApiException;
use App\Support\ApiResponse;
use App\Support\Gammes;
use App\Support\Payload;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GammeController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(Gammes::fetchFull());
    }

    public function show(Request $request): JsonResponse
    {
        $id = trim((string) $request->query('id', ''));
        if ($id === '') {
            throw new ApiException('missing_id', 422);
        }

        $gammes = Gammes::fetchFull($id);
        if ($gammes === []) {
            throw new ApiException('not_found', 404);
        }

        return ApiResponse::success($gammes[0]);
    }

    public function store(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $nom = Payload::sanitizeLocalized($body['nom'] ?? '', 'nom');

        $slug = Payload::slugify($nom['fr']);
        if ($slug === '') {
            throw new ApiException('invalid_slug', 422);
        }
        if (DB::table('gammes')->where('id', $slug)->exists()) {
            throw new ApiException('gamme_already_exists', 409);
        }

        $optionalLocalized = static function (string $key) use ($body): array {
            if (!array_key_exists($key, $body)) {
                return ['fr' => '', 'en' => ''];
            }

            return Payload::sanitizeLocalized($body[$key], $key, true);
        };

        $position = (int) DB::selectOne('SELECT COALESCE(MAX(position), -1) + 1 AS next_position FROM gammes')->next_position;

        DB::table('gammes')->insert([
            'id' => $slug,
            'nom' => json_encode($nom, JSON_UNESCAPED_UNICODE),
            'tagline' => json_encode($optionalLocalized('tagline'), JSON_UNESCAPED_UNICODE),
            'ingredients' => json_encode($optionalLocalized('ingredients'), JSON_UNESCAPED_UNICODE),
            'description' => json_encode($optionalLocalized('description'), JSON_UNESCAPED_UNICODE),
            'ingredients_detail' => json_encode($optionalLocalized('ingredientsDetail'), JSON_UNESCAPED_UNICODE),
            'hero_lead' => json_encode($optionalLocalized('heroLead'), JSON_UNESCAPED_UNICODE),
            'hero_accent' => json_encode($optionalLocalized('heroAccent'), JSON_UNESCAPED_UNICODE),
            'hero_copy' => json_encode($optionalLocalized('heroCopy'), JSON_UNESCAPED_UNICODE),
            'hero_alt' => json_encode($optionalLocalized('heroAlt'), JSON_UNESCAPED_UNICODE),
            'color' => '#C9971A',
            'color_light' => '#F2E8DA',
            'color_dark' => '#A85E0F',
            'position' => $position,
        ]);

        $gammes = Gammes::fetchFull($slug);

        return ApiResponse::success($gammes[0], 201);
    }

    public function update(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $id = trim((string) ($body['id'] ?? ''));
        if ($id === '') {
            throw new ApiException('missing_id', 422);
        }
        if (!DB::table('gammes')->where('id', $id)->exists()) {
            throw new ApiException('not_found', 404);
        }

        $localizedFields = [
            'nom' => 'nom',
            'tagline' => 'tagline',
            'ingredients' => 'ingredients',
            'description' => 'description',
            'ingredientsDetail' => 'ingredients_detail',
            'heroLead' => 'hero_lead',
            'heroAccent' => 'hero_accent',
            'heroCopy' => 'hero_copy',
            'heroAlt' => 'hero_alt',
        ];
        $colorFields = ['color' => 'color', 'colorLight' => 'color_light', 'colorDark' => 'color_dark'];
        $imageFields = [
            'imageId' => 'image_id',
            'mainImageId' => 'main_image_id',
            'heroImageId' => 'hero_image_id',
            'heroImageSmallId' => 'hero_image_small_id',
        ];

        $update = [];

        foreach ($localizedFields as $inputKey => $column) {
            if (!array_key_exists($inputKey, $body)) {
                continue;
            }
            $value = Payload::sanitizeLocalized($body[$inputKey], $inputKey, $inputKey !== 'nom');
            $update[$column] = json_encode($value, JSON_UNESCAPED_UNICODE);
        }

        foreach ($colorFields as $inputKey => $column) {
            if (!array_key_exists($inputKey, $body)) {
                continue;
            }
            $value = (string) $body[$inputKey];
            if (!preg_match('/^#[0-9a-fA-F]{6}$/', $value)) {
                throw new ApiException("invalid_color:$inputKey", 422);
            }
            $update[$column] = $value;
        }

        foreach ($imageFields as $inputKey => $column) {
            if (!array_key_exists($inputKey, $body)) {
                continue;
            }
            $raw = $body[$inputKey];
            if ($raw === null || $raw === '') {
                $update[$column] = null;
                continue;
            }
            $mediaId = filter_var($raw, FILTER_VALIDATE_INT);
            if ($mediaId === false || $mediaId <= 0) {
                throw new ApiException("invalid_image_id:$inputKey", 422);
            }
            if (!DB::table('media')->where('id', $mediaId)->exists()) {
                throw new ApiException("media_not_found:$inputKey", 422);
            }
            $update[$column] = $mediaId;
        }

        if ($update === []) {
            throw new ApiException('nothing_to_update', 422);
        }

        DB::table('gammes')->where('id', $id)->update($update);

        $gammes = Gammes::fetchFull($id);

        return ApiResponse::success($gammes[0]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $id = trim((string) ($body['id'] ?? ''));
        if ($id === '') {
            throw new ApiException('missing_id', 422);
        }
        if (DB::table('gammes')->count() <= 1) {
            throw new ApiException('last_gamme', 409);
        }

        $deleted = DB::table('gammes')->where('id', $id)->delete();
        if ($deleted === 0) {
            throw new ApiException('not_found', 404);
        }

        return ApiResponse::success(null);
    }

    public function reorder(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $order = $body['order'] ?? null;
        if (!is_array($order) || $order === []) {
            throw new ApiException('invalid_order', 422);
        }

        try {
            DB::transaction(static function () use ($order): void {
                foreach (array_values($order) as $index => $id) {
                    if (!is_string($id) || $id === '') {
                        throw new \InvalidArgumentException('invalid_order');
                    }
                    DB::table('gammes')->where('id', $id)->update(['position' => $index]);
                }
            });
        } catch (\Throwable $e) {
            throw new ApiException('invalid_order', 422);
        }

        return ApiResponse::success(Gammes::fetchFull());
    }
}
