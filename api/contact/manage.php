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
$exists = $pdo->prepare('SELECT 1 FROM contact_messages WHERE id = ?');
$exists->execute([$id]);
if ($exists->fetchColumn() === false) {
    json_error('not_found', 404);
}

if (!empty($body['delete'])) {
    $pdo->prepare('DELETE FROM contact_messages WHERE id = ?')->execute([$id]);
    json_success(null, 204);
}

$isRead = !empty($body['isRead']) ? 1 : 0;
$pdo->prepare('UPDATE contact_messages SET is_read = ? WHERE id = ?')->execute([$isRead, $id]);

json_success(['id' => $id, 'isRead' => (bool)$isRead]);
