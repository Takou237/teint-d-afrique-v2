<?php
/**
 * Applique un nouveau mot de passe à partir du jeton reçu par email.
 * Route publique : le jeton (64 caractères hexadécimaux, 1 heure, usage unique) tient lieu
 * d'authentification, il n'y a donc ni session ni jeton CSRF à exiger ici.
 */

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('method_not_allowed', 405);
}

$body = read_json_body();
$token = strtolower(trim((string)($body['token'] ?? '')));
$password = (string)($body['password'] ?? '');

if (preg_match('/^[a-f0-9]{64}$/', $token) !== 1) {
    json_error('invalid_token', 410);
}
if (mb_strlen($password) < 12) {
    json_error('weak_password', 422);
}
if (mb_strlen($password) > 200) {
    json_error('password_too_long', 422);
}

$pdo = db();
$stmt = $pdo->prepare(
    'SELECT pr.id, pr.admin_id, u.email
     FROM password_resets pr
     JOIN admin_users u ON u.id = pr.admin_id
     WHERE pr.token_hash = ? AND pr.used_at IS NULL AND pr.expires_at > NOW()
     LIMIT 1'
);
$stmt->execute([hash('sha256', $token)]);
$reset = $stmt->fetch();
if ($reset === false) {
    json_error('invalid_token', 410);
}

$pdo->beginTransaction();
try {
    $pdo->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?')
        ->execute([password_hash($password, PASSWORD_DEFAULT), (int)$reset['admin_id']]);

    // Le jeton est consommé, et tous les autres jetons du compte deviennent inutilisables.
    $pdo->prepare('UPDATE password_resets SET used_at = NOW() WHERE admin_id = ? AND used_at IS NULL')
        ->execute([(int)$reset['admin_id']]);

    // Un mot de passe oublié après plusieurs essais ratés ne doit pas rester bloqué.
    $pdo->prepare('DELETE FROM login_attempts WHERE email = ?')->execute([$reset['email']]);

    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    throw $e;
}

json_success(['reset' => true]);
