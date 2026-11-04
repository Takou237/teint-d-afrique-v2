<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('method_not_allowed', 405);
}

$page = trim((string)($_GET['page'] ?? ''));
if ($page === '' || !in_array($page, content_pages(), true)) {
    json_error('invalid_page', 422);
}

$lang = (string)($_GET['lang'] ?? 'fr');
if (!in_array($lang, ['fr', 'en'], true)) {
    $lang = 'fr';
}

$stmt = db()->prepare(
    'SELECT page, block_key, block_type, value_fr, value_en, updated_at
     FROM page_content WHERE page = ? ORDER BY block_key ASC'
);
$stmt->execute([$page]);

$blocks = array_map(
    static fn (array $row): array => content_block_payload($row, $lang),
    $stmt->fetchAll()
);

json_success($blocks);
