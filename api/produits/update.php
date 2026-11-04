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
$id = filter_var($body['id'] ?? null, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    json_error('invalid_id', 422);
}
if (fetch_product($id) === null) {
    json_error('not_found', 404);
}

$sets = [];
$params = [];

if (array_key_exists('type', $body)) {
    $sets[] = 'type = ?';
    $params[] = json_encode(sanitize_localized($body['type'], 'type'), JSON_UNESCAPED_UNICODE);
}
if (array_key_exists('description', $body)) {
    $sets[] = 'description = ?';
    $params[] = json_encode(sanitize_localized($body['description'], 'description', true), JSON_UNESCAPED_UNICODE);
}
if (array_key_exists('details', $body)) {
    $details = sanitize_product_details($body['details']);
    $sets[] = 'details = ?';
    $params[] = $details === null ? null : json_encode($details, JSON_UNESCAPED_UNICODE);
}
if (array_key_exists('poids', $body)) {
    $poids = sanitize_plain_text((string)$body['poids']);
    if ($poids === '') {
        json_error('missing_poids', 422);
    }
    $sets[] = 'poids = ?';
    $params[] = $poids;
}
if (array_key_exists('symbol', $body)) {
    $sets[] = 'symbol = ?';
    $params[] = sanitize_plain_text((string)$body['symbol']);
}
if (array_key_exists('imageId', $body)) {
    $raw = $body['imageId'];
    if ($raw === null || $raw === '') {
        $sets[] = 'image_id = NULL';
    } else {
        $mediaId = filter_var($raw, FILTER_VALIDATE_INT);
        if ($mediaId === false || $mediaId <= 0) {
            json_error('invalid_image_id', 422);
        }
        assert_media_exists($mediaId);
        $sets[] = 'image_id = ?';
        $params[] = $mediaId;
    }
}

if ($sets === []) {
    json_error('nothing_to_update', 422);
}

$params[] = $id;
$stmt = db()->prepare('UPDATE produits SET ' . implode(', ', $sets) . ' WHERE id = ?');
$stmt->execute($params);

json_success(fetch_product($id));
