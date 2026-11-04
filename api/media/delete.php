<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

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

$pdo = db();
$stmt = $pdo->prepare('SELECT filename FROM media WHERE id = ?');
$stmt->execute([$id]);
$row = $stmt->fetch();
if ($row === false) {
    json_error('not_found', 404);
}

// Refus tant que l'image est utilisée : les FK des gammes/produits feraient un SET NULL
// silencieux, et un bloc de page garderait un id mort (page_content n'a pas de FK).
$checks = [
    'SELECT 1 FROM gammes WHERE image_id = ? OR main_image_id = ? OR hero_image_id = ? OR hero_image_small_id = ? LIMIT 1' => [$id, $id, $id, $id],
    'SELECT 1 FROM produits WHERE image_id = ? LIMIT 1' => [$id],
    'SELECT 1 FROM page_content WHERE block_type = \'image\' AND (value_fr = ? OR value_en = ?) LIMIT 1' => [(string)$id, (string)$id],
    'SELECT 1 FROM content_drafts WHERE block_type = \'image\' AND (value_fr = ? OR value_en = ?) LIMIT 1' => [(string)$id, (string)$id],
];
foreach ($checks as $sql => $params) {
    $check = $pdo->prepare($sql);
    $check->execute($params);
    if ($check->fetchColumn() !== false) {
        json_error('media_in_use', 409);
    }
}

$pdo->prepare('DELETE FROM media WHERE id = ?')->execute([$id]);

$path = __DIR__ . '/../uploads/' . $row['filename'];
if (is_file($path)) {
    @unlink($path);
}

json_success(null, 204);
