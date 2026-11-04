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

class ProduitController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $gammeId = trim((string) ($body['gammeId'] ?? ''));
        if ($gammeId === '') {
            throw new ApiException('missing_gamme_id', 422);
        }
        if (!DB::table('gammes')->where('id', $gammeId)->exists()) {
            throw new ApiException('gamme_not_found', 404);
        }

        $type = Payload::sanitizeLocalized($body['type'] ?? '', 'type');
        $poids = Payload::plainText((string) ($body['poids'] ?? ''));
        if ($poids === '') {
            throw new ApiException('missing_poids', 422);
        }
        $symbol = Payload::plainText((string) ($body['symbol'] ?? ''));
        $description = array_key_exists('description', $body)
            ? Payload::sanitizeLocalized($body['description'], 'description', true)
            : ['fr' => '', 'en' => ''];
        $details = Payload::sanitizeProductDetails($body['details'] ?? null);

        $imageId = null;
        if (!empty($body['imageId'])) {
            $imageId = filter_var($body['imageId'], FILTER_VALIDATE_INT);
            if ($imageId === false || $imageId <= 0) {
                throw new ApiException('invalid_image_id', 422);
            }
            Gammes::assertMediaExists($imageId);
        }

        $position = (int) DB::selectOne(
            'SELECT COALESCE(MAX(position), -1) + 1 AS next_position FROM produits WHERE gamme_id = ?',
            [$gammeId]
        )->next_position;

        $id = DB::table('produits')->insertGetId([
            'gamme_id' => $gammeId,
            'type' => json_encode($type, JSON_UNESCAPED_UNICODE),
            'poids' => $poids,
            'symbol' => $symbol,
            'description' => json_encode($description, JSON_UNESCAPED_UNICODE),
            'details' => $details === null ? null : json_encode($details, JSON_UNESCAPED_UNICODE),
            'image_id' => $imageId,
            'position' => $position,
        ]);

        return ApiResponse::success(Gammes::fetchProduct((int) $id), 201);
    }

    public function update(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $id = filter_var($body['id'] ?? null, FILTER_VALIDATE_INT);
        if ($id === false || $id <= 0) {
            throw new ApiException('invalid_id', 422);
        }
        if (Gammes::fetchProduct($id) === null) {
            throw new ApiException('not_found', 404);
        }

        $update = [];

        if (array_key_exists('type', $body)) {
            $update['type'] = json_encode(Payload::sanitizeLocalized($body['type'], 'type'), JSON_UNESCAPED_UNICODE);
        }
        if (array_key_exists('description', $body)) {
            $update['description'] = json_encode(
                Payload::sanitizeLocalized($body['description'], 'description', true),
                JSON_UNESCAPED_UNICODE
            );
        }
        if (array_key_exists('details', $body)) {
            $details = Payload::sanitizeProductDetails($body['details']);
            $update['details'] = $details === null ? null : json_encode($details, JSON_UNESCAPED_UNICODE);
        }
        if (array_key_exists('poids', $body)) {
            $poids = Payload::plainText((string) $body['poids']);
            if ($poids === '') {
                throw new ApiException('missing_poids', 422);
            }
            $update['poids'] = $poids;
        }
        if (array_key_exists('symbol', $body)) {
            $update['symbol'] = Payload::plainText((string) $body['symbol']);
        }
        if (array_key_exists('imageId', $body)) {
            $raw = $body['imageId'];
            if ($raw === null || $raw === '') {
                $update['image_id'] = null;
            } else {
                $mediaId = filter_var($raw, FILTER_VALIDATE_INT);
                if ($mediaId === false || $mediaId <= 0) {
                    throw new ApiException('invalid_image_id', 422);
                }
                Gammes::assertMediaExists($mediaId);
                $update['image_id'] = $mediaId;
            }
        }

        if ($update === []) {
            throw new ApiException('nothing_to_update', 422);
        }

        DB::table('produits')->where('id', $id)->update($update);

        return ApiResponse::success(Gammes::fetchProduct($id));
    }

    public function destroy(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $id = filter_var($body['id'] ?? null, FILTER_VALIDATE_INT);
        if ($id === false || $id <= 0) {
            throw new ApiException('invalid_id', 422);
        }

        $deleted = DB::table('produits')->where('id', $id)->delete();
        if ($deleted === 0) {
            throw new ApiException('not_found', 404);
        }

        return ApiResponse::success(null);
    }

    public function reorder(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $gammeId = trim((string) ($body['gammeId'] ?? ''));
        $order = $body['order'] ?? null;
        if ($gammeId === '' || !is_array($order) || $order === []) {
            throw new ApiException('invalid_order', 422);
        }

        try {
            DB::transaction(static function () use ($order, $gammeId): void {
                foreach (array_values($order) as $index => $id) {
                    $productId = filter_var($id, FILTER_VALIDATE_INT);
                    if ($productId === false || $productId <= 0) {
                        throw new \InvalidArgumentException('invalid_order');
                    }
                    DB::table('produits')
                        ->where('id', $productId)
                        ->where('gamme_id', $gammeId)
                        ->update(['position' => $index]);
                }
            });
        } catch (\Throwable $e) {
            throw new ApiException('invalid_order', 422);
        }

        $gammes = Gammes::fetchFull($gammeId);

        return ApiResponse::success($gammes[0] ?? null);
    }
}
