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
$order = $body['order'] ?? null;
if (!is_array($order) || $order === []) {
    json_error('invalid_order', 422);
}

$pdo = db();
$pdo->beginTransaction();
$stmt = $pdo->prepare('UPDATE gammes SET position = ? WHERE id = ?');
try {
    foreach (array_values($order) as $index => $id) {
        if (!is_string($id) || $id === '') {
            throw new InvalidArgumentException('invalid_order');
        }
        $stmt->execute([$index, $id]);
    }
    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    json_error('invalid_order', 422);
}

json_success(fetch_gammes_full(), 200);
