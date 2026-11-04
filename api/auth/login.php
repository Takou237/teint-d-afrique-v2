<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('method_not_allowed', 405);
}

$body = read_json_body();
$email = strtolower(sanitize_plain_text((string)($body['email'] ?? '')));
$password = (string)($body['password'] ?? '');

if ($email === '' || $password === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_error('invalid_credentials', 422);
}

$pdo = db();

$attempts = $pdo->prepare(
    'SELECT COUNT(*) FROM login_attempts
     WHERE email = ? AND success = 0 AND attempted_at > (NOW() - INTERVAL 5 MINUTE)'
);
$attempts->execute([$email]);
if ((int)$attempts->fetchColumn() >= 5) {
    json_error('too_many_attempts', 429);
}

$stmt = $pdo->prepare('SELECT id, email, password_hash FROM admin_users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

$valid = $user !== false && password_verify($password, $user['password_hash']);

$log = $pdo->prepare('INSERT INTO login_attempts (email, success) VALUES (?, ?)');
$log->execute([$email, $valid ? 1 : 0]);

if (!$valid) {
    json_error('invalid_credentials', 401);
}

if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
    $rehash = $pdo->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?');
    $rehash->execute([password_hash($password, PASSWORD_DEFAULT), $user['id']]);
}

$pdo->prepare('UPDATE admin_users SET last_login_at = NOW() WHERE id = ?')->execute([$user['id']]);
$pdo->prepare('DELETE FROM login_attempts WHERE email = ? AND success = 1')->execute([$email]);

session_regenerate_id(true);
$_SESSION['admin_id'] = (int)$user['id'];
$_SESSION['admin_email'] = $user['email'];
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

json_success([
    'email' => $user['email'],
    'csrfToken' => $_SESSION['csrf_token'],
]);
