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

// Se supprimer soi-même couperait la session en cours ; le panneau le refuse.
if ($id === (int)($_SESSION['admin_id'] ?? 0)) {
    json_error('cannot_delete_self', 409);
}

$pdo = db();
$exists = $pdo->prepare('SELECT 1 FROM admin_users WHERE id = ?');
$exists->execute([$id]);
if ($exists->fetchColumn() === false) {
    json_error('not_found', 404);
}

// Il doit toujours rester au moins un compte pour se connecter.
if ((int)$pdo->query('SELECT COUNT(*) FROM admin_users')->fetchColumn() <= 1) {
    json_error('last_admin', 409);
}

$pdo->prepare('DELETE FROM admin_users WHERE id = ?')->execute([$id]);

json_success(null, 204);
