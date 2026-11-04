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

$stmt = db()->prepare('DELETE FROM produits WHERE id = ?');
$stmt->execute([$id]);
if ($stmt->rowCount() === 0) {
    json_error('not_found', 404);
}

json_success(null, 204);
