<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('method_not_allowed', 405);
}

require_admin();
require_csrf();

$body = read_json_body();
$gammeId = trim((string)($body['gammeId'] ?? ''));
if ($gammeId === '') {
    json_error('missing_gamme_id', 422);
}

$pdo = db();
$gamme = $pdo->prepare('SELECT 1 FROM gammes WHERE id = ?');
$gamme->execute([$gammeId]);
if ($gamme->fetchColumn() === false) {
    json_error('gamme_not_found', 404);
}

$type = sanitize_localized($body['type'] ?? '', 'type');
$poids = sanitize_plain_text((string)($body['poids'] ?? ''));
if ($poids === '') {
    json_error('missing_poids', 422);
}
$symbol = sanitize_plain_text((string)($body['symbol'] ?? ''));
$description = array_key_exists('description', $body)
    ? sanitize_localized($body['description'], 'description', true)
    : ['fr' => '', 'en' => ''];
$details = sanitize_product_details($body['details'] ?? null);

$imageId = null;
if (!empty($body['imageId'])) {
    $imageId = filter_var($body['imageId'], FILTER_VALIDATE_INT);
    if ($imageId === false || $imageId <= 0) {
        json_error('invalid_image_id', 422);
    }
    assert_media_exists($imageId);
}

$positionStmt = $pdo->prepare('SELECT COALESCE(MAX(position), -1) + 1 FROM produits WHERE gamme_id = ?');
$positionStmt->execute([$gammeId]);
$position = (int)$positionStmt->fetchColumn();

$stmt = $pdo->prepare(
    'INSERT INTO produits (gamme_id, type, poids, symbol, description, details, image_id, position)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
);
$stmt->execute([
    $gammeId,
    json_encode($type, JSON_UNESCAPED_UNICODE),
    $poids,
    $symbol,
    json_encode($description, JSON_UNESCAPED_UNICODE),
    $details === null ? null : json_encode($details, JSON_UNESCAPED_UNICODE),
    $imageId,
    $position,
]);

$product = fetch_product((int)$pdo->lastInsertId());
json_success($product, 201);
