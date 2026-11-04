<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\ApiException;
use App\Support\ApiResponse;
use App\Support\ContentBlock;
use App\Support\Payload;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = trim((string) $request->query('page', ''));
        if ($page === '' || !in_array($page, Payload::contentPages(), true)) {
            throw new ApiException('invalid_page', 422);
        }

        $lang = (string) $request->query('lang', 'fr');
        if (!in_array($lang, ['fr', 'en'], true)) {
            $lang = 'fr';
        }

        $rows = DB::table('page_content')
            ->select('page', 'block_key', 'block_type', 'value_fr', 'value_en', 'updated_at')
            ->where('page', $page)
            ->orderBy('block_key')
            ->get();

        $blocks = $rows->map(static fn ($row): array => ContentBlock::payload((array) $row, $lang))->all();

        return ApiResponse::success($blocks);
    }

    public function drafts(Request $request): JsonResponse
    {
        $page = trim((string) $request->query('page', ''));
        if ($page !== '' && !in_array($page, Payload::contentPages(), true)) {
            throw new ApiException('invalid_page', 422);
        }

        $query = DB::table('content_drafts')
            ->select('page', 'block_key', 'block_type', 'value_fr', 'value_en', 'updated_at');

        if ($page !== '') {
            $query->where('page', $page);
        }

        $rows = $query->orderBy('page')->orderBy('block_key')->get();

        $drafts = $rows->map(static fn ($row): array => ContentBlock::payload((array) $row))->all();

        return ApiResponse::success($drafts);
    }

    public function store(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $page = trim((string) ($body['page'] ?? ''));
        $blockKey = trim((string) ($body['blockKey'] ?? ''));
        $blockType = (string) ($body['blockType'] ?? 'text');

        if ($page === '' || !in_array($page, Payload::contentPages(), true)) {
            throw new ApiException('invalid_page', 422);
        }
        if (!preg_match('/^[a-z0-9_-]{1,100}$/i', $blockKey)) {
            throw new ApiException('invalid_block_key', 422);
        }
        if (!in_array($blockType, ['text', 'richtext', 'image'], true)) {
            throw new ApiException('invalid_block_type', 422);
        }

        $valueFr = (string) ($body['valueFr'] ?? '');
        $valueEn = (string) ($body['valueEn'] ?? '');

        if ($blockType === 'text') {
            $valueFr = Payload::plainText($valueFr);
            $valueEn = Payload::plainText($valueEn);
        } elseif ($blockType === 'richtext') {
            $valueFr = Payload::richText($valueFr);
            $valueEn = Payload::richText($valueEn);
        } else {
            foreach ([['fr', $valueFr], ['en', $valueEn]] as [$lang, $value]) {
                if ($value === '') {
                    continue;
                }
                $mediaId = filter_var($value, FILTER_VALIDATE_INT);
                if ($mediaId === false || $mediaId <= 0) {
                    throw new ApiException("invalid_image_id:value" . ucfirst($lang), 422);
                }
                if (!DB::table('media')->where('id', $mediaId)->exists()) {
                    throw new ApiException("media_not_found:value" . ucfirst($lang), 422);
                }
                if ($lang === 'fr') {
                    $valueFr = (string) $mediaId;
                } else {
                    $valueEn = (string) $mediaId;
                }
            }
        }

        DB::statement(
            'INSERT INTO content_drafts (page, block_key, block_type, value_fr, value_en)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE block_type = VALUES(block_type), value_fr = VALUES(value_fr), value_en = VALUES(value_en)',
            [$page, $blockKey, $blockType, $valueFr, $valueEn]
        );

        $row = DB::table('content_drafts')
            ->select('page', 'block_key', 'block_type', 'value_fr', 'value_en', 'updated_at')
            ->where('page', $page)
            ->where('block_key', $blockKey)
            ->first();

        return ApiResponse::success(ContentBlock::payload((array) $row));
    }

    public function destroy(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $page = trim((string) ($body['page'] ?? ''));
        $blockKey = trim((string) ($body['blockKey'] ?? ''));

        if ($page === '' || !in_array($page, Payload::contentPages(), true)) {
            throw new ApiException('invalid_page', 422);
        }
        if (!preg_match('/^[a-z0-9_-]{1,100}$/i', $blockKey)) {
            throw new ApiException('invalid_block_key', 422);
        }

        $deleted = DB::table('page_content')->where('page', $page)->where('block_key', $blockKey)->delete();
        $draftDeleted = DB::table('content_drafts')->where('page', $page)->where('block_key', $blockKey)->delete();

        if ($deleted === 0 && $draftDeleted === 0) {
            throw new ApiException('not_found', 404);
        }

        return ApiResponse::success(null);
    }

    public function publish(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $page = trim((string) ($body['page'] ?? ''));

        if ($page === '' || !in_array($page, Payload::contentPages(), true)) {
            throw new ApiException('invalid_page', 422);
        }

        $published = DB::transaction(static function () use ($page): int {
            $drafts = DB::table('content_drafts')
                ->select('block_key', 'block_type', 'value_fr', 'value_en')
                ->where('page', $page)
                ->get()
                ->all();

            if ($drafts === []) {
                throw new ApiException('nothing_to_publish', 422);
            }

            foreach ($drafts as $draft) {
                DB::statement(
                    'INSERT INTO page_content (page, block_key, block_type, value_fr, value_en)
                     VALUES (?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE
                       block_type = VALUES(block_type),
                       value_fr = VALUES(value_fr),
                       value_en = VALUES(value_en)',
                    [$page, $draft->block_key, $draft->block_type, $draft->value_fr, $draft->value_en]
                );
            }

            DB::table('content_drafts')->where('page', $page)->delete();

            return count($drafts);
        });

        return ApiResponse::success(['published' => $published]);
    }

    public function discard(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $page = trim((string) ($body['page'] ?? ''));
        $blockKey = trim((string) ($body['blockKey'] ?? ''));

        if ($page === '' || !in_array($page, Payload::contentPages(), true)) {
            throw new ApiException('invalid_page', 422);
        }
        if (!preg_match('/^[a-z0-9_-]{1,100}$/i', $blockKey)) {
            throw new ApiException('invalid_block_key', 422);
        }

        $deleted = DB::table('content_drafts')->where('page', $page)->where('block_key', $blockKey)->delete();
        if ($deleted === 0) {
            throw new ApiException('not_found', 404);
        }

        return ApiResponse::success(null);
    }
}
