<?php
/**
 * Médiathèque paginée.
 * Paramètres : q (recherche sur le nom du fichier et le texte alternatif), page, perPage (24, max 100).
 * Réponse : {items, total, page, perPage}.
 */

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('method_not_allowed', 405);
}

require_admin();

$pdo = db();

$q = trim((string)($_GET['q'] ?? ''));
$q = mb_substr($q, 0, 100);
$page = max(1, (int)($_GET['page'] ?? 1));
$perPage = (int)($_GET['perPage'] ?? 24);
$perPage = $perPage < 1 ? 24 : min($perPage, 100);

$where = '';
$params = [];
if ($q !== '') {
    $where = ' WHERE original_name LIKE ? OR alt_text LIKE ?';
    $like = '%' . addcslashes($q, '%_\\') . '%';
    $params = [$like, $like];
}

$count = $pdo->prepare('SELECT COUNT(*) FROM media' . $where);
$count->execute($params);
$total = (int)$count->fetchColumn();

$rows = $pdo->prepare(
    'SELECT id, filename, original_name, mime_type, size_bytes, alt_text, created_at
     FROM media' . $where . '
     ORDER BY created_at DESC, id DESC
     LIMIT ' . $perPage . ' OFFSET ' . (($page - 1) * $perPage)
);
$rows->execute($params);

$items = array_map(static function (array $row): array {
    return [
        'id' => (int)$row['id'],
        'filename' => $row['filename'],
        'url' => '/uploads/' . $row['filename'],
        'originalName' => $row['original_name'],
        'mimeType' => $row['mime_type'],
        'sizeBytes' => (int)$row['size_bytes'],
        'altText' => $row['alt_text'],
        'createdAt' => $row['created_at'],
    ];
}, $rows->fetchAll());

json_success([
    'items' => $items,
    'total' => $total,
    'page' => $page,
    'perPage' => $perPage,
]);
