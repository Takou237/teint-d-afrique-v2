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
$id = trim((string)($body['id'] ?? ''));
if ($id === '') {
    json_error('missing_id', 422);
}

$pdo = db();
$exists = $pdo->prepare('SELECT 1 FROM gammes WHERE id = ?');
$exists->execute([$id]);
if ($exists->fetchColumn() === false) {
    json_error('not_found', 404);
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

$sets = [];
$params = [];

foreach ($localizedFields as $inputKey => $column) {
    if (!array_key_exists($inputKey, $body)) {
        continue;
    }
    $allowEmpty = $inputKey !== 'nom';
    $value = sanitize_localized($body[$inputKey], $inputKey, $allowEmpty);
    $sets[] = "$column = ?";
    $params[] = json_encode($value, JSON_UNESCAPED_UNICODE);
}

foreach ($colorFields as $inputKey => $column) {
    if (!array_key_exists($inputKey, $body)) {
        continue;
    }
    $value = (string)$body[$inputKey];
    if (!preg_match('/^#[0-9a-fA-F]{6}$/', $value)) {
        json_error("invalid_color:$inputKey", 422);
    }
    $sets[] = "$column = ?";
    $params[] = $value;
}

foreach ($imageFields as $inputKey => $column) {
    if (!array_key_exists($inputKey, $body)) {
        continue;
    }
    $raw = $body[$inputKey];
    if ($raw === null || $raw === '') {
        $sets[] = "$column = NULL";
        continue;
    }
    $mediaId = filter_var($raw, FILTER_VALIDATE_INT);
    if ($mediaId === false || $mediaId <= 0) {
        json_error("invalid_image_id:$inputKey", 422);
    }
    $check = $pdo->prepare('SELECT 1 FROM media WHERE id = ?');
    $check->execute([$mediaId]);
    if ($check->fetchColumn() === false) {
        json_error("media_not_found:$inputKey", 422);
    }
    $sets[] = "$column = ?";
    $params[] = $mediaId;
}

if ($sets === []) {
    json_error('nothing_to_update', 422);
}

$params[] = $id;
$stmt = $pdo->prepare('UPDATE gammes SET ' . implode(', ', $sets) . ' WHERE id = ?');
$stmt->execute($params);

$gammes = fetch_gammes_full($id);
json_success($gammes[0]);
