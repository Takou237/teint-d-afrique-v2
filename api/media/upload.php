<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('method_not_allowed', 405);
}

require_admin();
require_csrf();

if (!isset($_FILES['file']) || !is_array($_FILES['file']) || ($_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    json_error('missing_file', 422);
}

$file = $_FILES['file'];
if ((int)$file['size'] > 5 * 1024 * 1024) {
    json_error('file_too_large', 422);
}

$info = @getimagesize($file['tmp_name']);
if ($info === false) {
    json_error('invalid_image', 422);
}

$mime = $info['mime'] ?? '';
$allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
if (!in_array($mime, $allowed, true)) {
    json_error('unsupported_image_type', 422);
}

$source = null;
switch ($mime) {
    case 'image/jpeg':
        $source = @imagecreatefromjpeg($file['tmp_name']);
        break;
    case 'image/png':
        $source = @imagecreatefrompng($file['tmp_name']);
        break;
    case 'image/webp':
        $source = @imagecreatefromwebp($file['tmp_name']);
        break;
    case 'image/gif':
        $source = @imagecreatefromgif($file['tmp_name']);
        break;
}

if ($source === false || $source === null) {
    json_error('invalid_image', 422);
}

$width = imagesx($source);
$height = imagesy($source);
$maxDimension = 2000;
if ($width > $maxDimension || $height > $maxDimension) {
    $ratio = min($maxDimension / $width, $maxDimension / $height);
    $newWidth = max(1, (int)round($width * $ratio));
    $newHeight = max(1, (int)round($height * $ratio));
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

$uploadsDir = __DIR__ . '/../uploads';
if (!is_dir($uploadsDir) && !mkdir($uploadsDir, 0775, true) && !is_dir($uploadsDir)) {
    imagedestroy($source);
    json_error('upload_directory_unavailable', 500);
}

$destination = $uploadsDir . '/' . $filename;
$written = false;
switch ($outputMime) {
    case 'image/png':
        $written = imagepng($source, $destination, 8);
        break;
    case 'image/webp':
        $written = imagewebp($source, $destination, 85);
        break;
    default:
        $written = imagejpeg($source, $destination, 85);
        break;
}
imagedestroy($source);

if (!$written) {
    json_error('upload_failed', 500);
}

$size = (int)(filesize($destination) ?: 0);
$altText = sanitize_plain_text((string)($_POST['altText'] ?? ''));
$originalName = sanitize_plain_text((string)($file['name'] ?? $filename));

$stmt = db()->prepare(
    'INSERT INTO media (filename, original_name, mime_type, size_bytes, alt_text) VALUES (?, ?, ?, ?, ?)'
);
$stmt->execute([$filename, $originalName, $outputMime, $size, $altText]);
$id = (int)db()->lastInsertId();

json_success([
    'id' => $id,
    'filename' => $filename,
    'url' => '/uploads/' . $filename,
    'originalName' => $originalName,
    'mimeType' => $outputMime,
    'sizeBytes' => $size,
    'altText' => $altText,
], 201);
