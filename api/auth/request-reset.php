<?php
/**
 * Demande de réinitialisation du mot de passe : envoie un lien à usage unique.
 *
 * Route publique. La réponse ne révèle jamais si l'email existe (pas d'énumération
 * de comptes) : elle est identique pour une adresse inconnue.
 */

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../lib/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('method_not_allowed', 405);
}

$body = read_json_body();
$email = strtolower(sanitize_plain_text((string)($body['email'] ?? '')));
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) {
    json_error('invalid_email', 422);
}

$pdo = db();

// Trois demandes par compte et par quart d'heure : au-delà, on répond pareil sans rien envoyer.
$throttle = $pdo->prepare(
    'SELECT COUNT(*) FROM password_resets pr
     JOIN admin_users u ON u.id = pr.admin_id
     WHERE u.email = ? AND pr.created_at > (NOW() - INTERVAL 15 MINUTE)'
);
$throttle->execute([$email]);
if ((int)$throttle->fetchColumn() >= 3) {
    json_success(['sent' => true]);
}

$stmt = $pdo->prepare('SELECT id, email FROM admin_users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user === false) {
    json_success(['sent' => true]);
}

$token = bin2hex(random_bytes(32));
$pdo->prepare('DELETE FROM password_resets WHERE admin_id = ? AND (used_at IS NOT NULL OR expires_at < NOW())')
    ->execute([(int)$user['id']]);
$pdo->prepare(
    'INSERT INTO password_resets (admin_id, token_hash, expires_at)
     VALUES (?, ?, (NOW() + INTERVAL 1 HOUR))'
)->execute([(int)$user['id'], hash('sha256', $token)]);

if (!send_password_reset_mail($user['email'], $token)) {
    // Le compte existe mais l'email n'est pas parti : mieux vaut le dire que laisser
    // la personne attendre un lien qui n'arrivera jamais.
    json_error('email_failed', 503);
}

json_success(['sent' => true]);
