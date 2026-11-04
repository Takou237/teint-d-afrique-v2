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
$nom = sanitize_localized($body['nom'] ?? '', 'nom');

$slug = slugify($nom['fr']);
if ($slug === '') {
    json_error('invalid_slug', 422);
}

$pdo = db();
$exists = $pdo->prepare('SELECT 1 FROM gammes WHERE id = ?');
$exists->execute([$slug]);
if ($exists->fetchColumn() !== false) {
    json_error('gamme_already_exists', 409);
}

$optionalLocalized = static function (string $key, array $body) use ($nom): array {
    if (!array_key_exists($key, $body)) {
        return ['fr' => '', 'en' => ''];
    }
    return sanitize_localized($body[$key], $key, true);
};

$position = (int)$pdo->query('SELECT COALESCE(MAX(position), -1) + 1 FROM gammes')->fetchColumn();

$stmt = $pdo->prepare(
    'INSERT INTO gammes
      (id, nom, tagline, ingredients, description, ingredients_detail,
       hero_lead, hero_accent, hero_copy, hero_alt,
       color, color_light, color_dark, position)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
$stmt->execute([
    $slug,
    json_encode($nom, JSON_UNESCAPED_UNICODE),
    json_encode($optionalLocalized('tagline', $body), JSON_UNESCAPED_UNICODE),
    json_encode($optionalLocalized('ingredients', $body), JSON_UNESCAPED_UNICODE),
    json_encode($optionalLocalized('description', $body), JSON_UNESCAPED_UNICODE),
    json_encode($optionalLocalized('ingredientsDetail', $body), JSON_UNESCAPED_UNICODE),
    json_encode($optionalLocalized('heroLead', $body), JSON_UNESCAPED_UNICODE),
    json_encode($optionalLocalized('heroAccent', $body), JSON_UNESCAPED_UNICODE),
    json_encode($optionalLocalized('heroCopy', $body), JSON_UNESCAPED_UNICODE),
    json_encode($optionalLocalized('heroAlt', $body), JSON_UNESCAPED_UNICODE),
    '#C9971A',
    '#F2E8DA',
    '#A85E0F',
    $position,
]);

$gammes = fetch_gammes_full($slug);
json_success($gammes[0], 201);
