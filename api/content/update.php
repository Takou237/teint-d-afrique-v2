<?php
/**
 * Enregistre un bloc en **brouillon** : le contenu publié (page_content) n'est pas modifié
 * tant que /api/content/publish.php n'a pas été appelé.
 */

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('method_not_allowed', 405);
}

require_admin();
require_csrf();

$body = read_json_body();
$page = trim((string)($body['page'] ?? ''));
$blockKey = trim((string)($body['blockKey'] ?? ''));
$blockType = (string)($body['blockType'] ?? 'text');

if ($page === '' || !in_array($page, content_pages(), true)) {
    json_error('invalid_page', 422);
}
if (!preg_match('/^[a-z0-9_-]{1,100}$/i', $blockKey)) {
    json_error('invalid_block_key', 422);
}
if (!in_array($blockType, ['text', 'richtext', 'image'], true)) {
    json_error('invalid_block_type', 422);
}

$valueFr = (string)($body['valueFr'] ?? '');
$valueEn = (string)($body['valueEn'] ?? '');

if ($blockType === 'text') {
    $valueFr = sanitize_plain_text($valueFr);
    $valueEn = sanitize_plain_text($valueEn);
} elseif ($blockType === 'richtext') {
    $valueFr = sanitize_richtext($valueFr);
    $valueEn = sanitize_richtext($valueEn);
} else {
    foreach (['valueFr' => $valueFr, 'valueEn' => $valueEn] as $field => $value) {
        if ($value === '') {
            continue;
        }
        $mediaId = filter_var($value, FILTER_VALIDATE_INT);
        if ($mediaId === false || $mediaId <= 0) {
            json_error("invalid_image_id:$field", 422);
        }
        $check = db()->prepare('SELECT 1 FROM media WHERE id = ?');
        $check->execute([$mediaId]);
        if ($check->fetchColumn() === false) {
            json_error("media_not_found:$field", 422);
        }
        $valueFr = $field === 'valueFr' ? (string)$mediaId : $valueFr;
        $valueEn = $field === 'valueEn' ? (string)$mediaId : $valueEn;
    }
}

db()->prepare(
    'INSERT INTO content_drafts (page, block_key, block_type, value_fr, value_en)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE block_type = VALUES(block_type), value_fr = VALUES(value_fr), value_en = VALUES(value_en)'
)->execute([$page, $blockKey, $blockType, $valueFr, $valueEn]);

$read = db()->prepare(
    'SELECT page, block_key, block_type, value_fr, value_en, updated_at
     FROM content_drafts WHERE page = ? AND block_key = ?'
);
$read->execute([$page, $blockKey]);
$row = $read->fetch();

json_success(content_block_payload($row));
