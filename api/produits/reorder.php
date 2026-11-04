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
$gammeId = trim((string)($body['gammeId'] ?? ''));
$order = $body['order'] ?? null;
if ($gammeId === '' || !is_array($order) || $order === []) {
    json_error('invalid_order', 422);
}

$pdo = db();
$pdo->beginTransaction();
$stmt = $pdo->prepare('UPDATE produits SET position = ? WHERE id = ? AND gamme_id = ?');
try {
    foreach (array_values($order) as $index => $id) {
        $productId = filter_var($id, FILTER_VALIDATE_INT);
        if ($productId === false || $productId <= 0) {
            throw new InvalidArgumentException('invalid_order');
        }
        $stmt->execute([$index, $productId, $gammeId]);
    }
    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    json_error('invalid_order', 422);
}

$gammes = fetch_gammes_full($gammeId);
json_success($gammes[0] ?? null);
