<?php
/**
 * Liste paginée des messages de contact.
 *
 * Paramètres : q (recherche), filter=all|unread, page (1 par défaut), perPage (20, max 50).
 * Réponse : {items, total, page, perPage, unread} — "unread" compte les non-lus de toute la base.
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
$filter = (string)($_GET['filter'] ?? 'all') === 'unread' ? 'unread' : 'all';
$page = max(1, (int)($_GET['page'] ?? 1));
$perPage = (int)($_GET['perPage'] ?? 20);
$perPage = $perPage < 1 ? 20 : min($perPage, 50);

$where = [];
$params = [];
if ($q !== '') {
    $where[] = '(name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)';
    $like = '%' . addcslashes($q, '%_\\') . '%';
    $params = [$like, $like, $like, $like];
}
if ($filter === 'unread') {
    $where[] = 'is_read = 0';
}
$whereSql = $where === [] ? '' : ' WHERE ' . implode(' AND ', $where);

$count = $pdo->prepare('SELECT COUNT(*) FROM contact_messages' . $whereSql);
$count->execute($params);
$total = (int)$count->fetchColumn();

$unread = (int)$pdo->query('SELECT COUNT(*) FROM contact_messages WHERE is_read = 0')->fetchColumn();

$rows = $pdo->prepare(
    'SELECT id, name, email, phone, message, is_read, created_at
     FROM contact_messages' . $whereSql . '
     ORDER BY created_at DESC, id DESC
     LIMIT ' . $perPage . ' OFFSET ' . (($page - 1) * $perPage)
);
$rows->execute($params);

$items = array_map(static function (array $row): array {
    return [
        'id' => (int)$row['id'],
        'name' => $row['name'],
        'email' => $row['email'],
        'phone' => $row['phone'],
        'message' => $row['message'],
        'isRead' => (bool)$row['is_read'],
        'createdAt' => $row['created_at'],
    ];
}, $rows->fetchAll());

json_success([
    'items' => $items,
    'total' => $total,
    'page' => $page,
    'perPage' => $perPage,
    'unread' => $unread,
]);
