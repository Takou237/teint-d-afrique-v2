<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

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

$total = (int)$pdo->query('SELECT COUNT(*) FROM gammes')->fetchColumn();
if ($total <= 1) {
    json_error('last_gamme', 409);
}

$stmt = $pdo->prepare('DELETE FROM gammes WHERE id = ?');
$stmt->execute([$id]);
if ($stmt->rowCount() === 0) {
    json_error('not_found', 404);
}

json_success(null, 204);
