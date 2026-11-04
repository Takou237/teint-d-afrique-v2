<?php
/**
 * Brouillons en attente de publication.
 * `?page=accueil` limite à une page ; sans paramètre, renvoie toutes les pages
 * (sert au compteur affiché dans la navigation).
 */

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('method_not_allowed', 405);
}

require_admin();

$page = trim((string)($_GET['page'] ?? ''));
if ($page !== '' && !in_array($page, content_pages(), true)) {
    json_error('invalid_page', 422);
}

$sql = 'SELECT page, block_key, block_type, value_fr, value_en, updated_at FROM content_drafts';
$params = [];
if ($page !== '') {
    $sql .= ' WHERE page = ?';
    $params[] = $page;
}
$sql .= ' ORDER BY page ASC, block_key ASC';

$stmt = db()->prepare($sql);
$stmt->execute($params);

$drafts = array_map(
    static fn (array $row): array => content_block_payload($row),
    $stmt->fetchAll()
);

json_success($drafts);
