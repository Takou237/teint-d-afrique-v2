<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\ApiException;
use App\Support\ApiResponse;
use App\Support\Payload;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MediaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));
        $q = mb_substr($q, 0, 100);
        $page = max(1, (int) $request->query('page', 1));
        $perPage = (int) $request->query('perPage', 24);
        $perPage = $perPage < 1 ? 24 : min($perPage, 100);

        $base = DB::table('media');

        if ($q !== '') {
            $like = '%' . addcslashes($q, '%_\\') . '%';
            $base->where(static function ($query) use ($like): void {
                $query->where('original_name', 'like', $like)
                    ->orWhere('alt_text', 'like', $like);
            });
        }

        $total = (clone $base)->count();

        $rows = (clone $base)
            ->select('id', 'filename', 'original_name', 'mime_type', 'size_bytes', 'alt_text', 'created_at')
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get();

        $items = $rows->map(static fn ($row): array => [
            'id' => (int) $row->id,
            'filename' => $row->filename,
            'url' => '/uploads/' . $row->filename,
            'originalName' => $row->original_name,
            'mimeType' => $row->mime_type,
            'sizeBytes' => (int) $row->size_bytes,
            'altText' => $row->alt_text,
            'createdAt' => $row->created_at,
        ])->all();

        return ApiResponse::success([
            'items' => $items,
            'total' => $total,
            'page' => $page,
            'perPage' => $perPage,
        ]);
    }

    public function upload(Request $request): JsonResponse
    {
        $file = $request->file('file');

        if ($file === null || !$file->isValid() || $file->getError() !== UPLOAD_ERR_OK) {
            throw new ApiException('missing_file', 422);
        }
        if ($file->getSize() > 5 * 1024 * 1024) {
            throw new ApiException('file_too_large', 422);
        }

        $tmpPath = $file->getRealPath();
        $info = @getimagesize((string) $tmpPath);
        if ($info === false) {
            throw new ApiException('invalid_image', 422);
        }

        $mime = $info['mime'] ?? '';
        $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!in_array($mime, $allowed, true)) {
            throw new ApiException('unsupported_image_type', 422);
        }

        $source = match ($mime) {
            'image/jpeg' => @imagecreatefromjpeg($tmpPath),
            'image/png' => @imagecreatefrompng($tmpPath),
            'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($tmpPath) : false,
            'image/gif' => @imagecreatefromgif($tmpPath),
            default => false,
        };

        if ($source === false || $source === null) {
            throw new ApiException('invalid_image', 422);
        }

        $width = imagesx($source);
        $height = imagesy($source);
        $maxDimension = 2000;
        if ($width > $maxDimension || $height > $maxDimension) {
            $ratio = min($maxDimension / $width, $maxDimension / $height);
            $newWidth = max(1, (int) round($width * $ratio));
            $newHeight = max(1, (int) round($height * $ratio));
            $resized = imagecreatetruecolor($newWidth, $newHeight);
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
            imagecopyresampled($resized, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            imagedestroy($source);
            $source = $resized;
        }

        $outputMime = in_array($mime, ['image/png', 'image/webp'], true) ? $mime : 'image/jpeg';
        $extension = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'][$outputMime];
        $filename = bin2hex(random_bytes(16)) . '.' . $extension;

        $uploadsDir = public_path('uploads');
        if (!is_dir($uploadsDir) && !mkdir($uploadsDir, 0775, true) && !is_dir($uploadsDir)) {
            imagedestroy($source);

            throw new ApiException('upload_directory_unavailable', 500);
        }

        $destination = $uploadsDir . DIRECTORY_SEPARATOR . $filename;
        $written = match ($outputMime) {
            'image/png' => imagepng($source, $destination, 8),
            'image/webp' => imagewebp($source, $destination, 85),
            default => imagejpeg($source, $destination, 85),
        };
        imagedestroy($source);

        if (!$written) {
            throw new ApiException('upload_failed', 500);
        }

        $size = (int) (filesize($destination) ?: 0);
        $altText = Payload::plainText((string) $request->input('altText', ''));
        $originalName = Payload::plainText((string) $file->getClientOriginalName());

        $id = DB::table('media')->insertGetId([
            'filename' => $filename,
            'original_name' => $originalName !== '' ? $originalName : $filename,
            'mime_type' => $outputMime,
            'size_bytes' => $size,
            'alt_text' => $altText,
        ]);

        return ApiResponse::success([
            'id' => (int) $id,
            'filename' => $filename,
            'url' => '/uploads/' . $filename,
            'originalName' => $originalName !== '' ? $originalName : $filename,
            'mimeType' => $outputMime,
            'sizeBytes' => $size,
            'altText' => $altText,
        ], 201);
    }

    public function update(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $id = filter_var($body['id'] ?? null, FILTER_VALIDATE_INT);
        if ($id === false || $id <= 0) {
            throw new ApiException('invalid_id', 422);
        }

        $altText = Payload::plainText((string) ($body['altText'] ?? ''));
        if (mb_strlen($altText) > 255) {
            throw new ApiException('alt_text_too_long', 422);
        }
        if (!DB::table('media')->where('id', $id)->exists()) {
            throw new ApiException('not_found', 404);
        }

        DB::table('media')->where('id', $id)->update(['alt_text' => $altText]);

        return ApiResponse::success(['id' => $id, 'altText' => $altText]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $body = Payload::json($request);
        $id = filter_var($body['id'] ?? null, FILTER_VALIDATE_INT);
        if ($id === false || $id <= 0) {
            throw new ApiException('invalid_id', 422);
        }

        $filename = DB::table('media')->where('id', $id)->value('filename');
        if ($filename === null) {
            throw new ApiException('not_found', 404);
        }

        $inGamme = DB::table('gammes')
            ->where(static function ($query) use ($id): void {
                $query->where('image_id', $id)
                    ->orWhere('main_image_id', $id)
                    ->orWhere('hero_image_id', $id)
                    ->orWhere('hero_image_small_id', $id);
            })
            ->exists();
        $inProduit = DB::table('produits')->where('image_id', $id)->exists();
        $idString = (string) $id;
        $inPage = DB::table('page_content')
            ->where('block_type', 'image')
            ->where(static function ($query) use ($idString): void {
                $query->where('value_fr', $idString)->orWhere('value_en', $idString);
            })
            ->exists();
        $inDraft = DB::table('content_drafts')
            ->where('block_type', 'image')
            ->where(static function ($query) use ($idString): void {
                $query->where('value_fr', $idString)->orWhere('value_en', $idString);
            })
            ->exists();

        if ($inGamme || $inProduit || $inPage || $inDraft) {
            throw new ApiException('media_in_use', 409);
        }

        DB::table('media')->where('id', $id)->delete();

        $path = public_path('uploads' . DIRECTORY_SEPARATOR . $filename);
        if (is_file($path)) {
            @unlink($path);
        }

        return ApiResponse::success(null);
    }
}
