<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('method_not_allowed', 405);
}

require_admin();
require_csrf();

$body = read_json_body();
$currentPassword = (string)($body['currentPassword'] ?? '');
$newPassword = (string)($body['newPassword'] ?? '');

if ($currentPassword === '' || $newPassword === '') {
    json_error('missing_password', 422);
}
if (mb_strlen($newPassword) < 12) {
    json_error('weak_password', 422);
}
if (mb_strlen($newPassword) > 200) {
    json_error('password_too_long', 422);
}
if ($currentPassword === $newPassword) {
    json_error('password_unchanged', 422);
}

$pdo = db();
$stmt = $pdo->prepare('SELECT id, email, password_hash FROM admin_users WHERE id = ? LIMIT 1');
$stmt->execute([(int)$_SESSION['admin_id']]);
$user = $stmt->fetch();
if ($user === false) {
    // Compte supprimé pendant la session : on force la reconnexion.
    session_destroy();
    json_error('unauthorized', 401);
}

if (!password_verify($currentPassword, $user['password_hash'])) {
    json_error('invalid_current_password', 401);
}

$pdo->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?')
    ->execute([password_hash($newPassword, PASSWORD_DEFAULT), $user['id']]);

// Les échecs de connexion mémorisés pour cet e-mail ne doivent pas bloquer la nouvelle session.
$pdo->prepare('DELETE FROM login_attempts WHERE email = ?')->execute([$user['email']]);

// Nouveau cookie de session pour invalider l'ancien identifiant ; le jeton CSRF reste valide.
session_regenerate_id(true);

json_success(['updated' => true]);
