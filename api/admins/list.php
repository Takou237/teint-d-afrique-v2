<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('method_not_allowed', 405);
}

require_admin();

$rows = db()->query(
    'SELECT id, email, created_at, last_login_at FROM admin_users ORDER BY created_at ASC, id ASC'
)->fetchAll();

$selfId = (int)($_SESSION['admin_id'] ?? 0);

$data = array_map(static function (array $row) use ($selfId): array {
    return [
        'id' => (int)$row['id'],
        'email' => $row['email'],
        'createdAt' => $row['created_at'],
        'lastLoginAt' => $row['last_login_at'],
        'isSelf' => (int)$row['id'] === $selfId,
    ];
}, $rows);

json_success($data);
