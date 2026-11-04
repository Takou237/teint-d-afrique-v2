<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('method_not_allowed', 405);
}

require_admin();
require_csrf();

$body = read_json_body();
$email = strtolower(sanitize_plain_text((string)($body['email'] ?? '')));
$password = (string)($body['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) {
    json_error('invalid_email', 422);
}
if (mb_strlen($password) < 12) {
    json_error('weak_password', 422);
}
if (mb_strlen($password) > 200) {
    json_error('password_too_long', 422);
}

$pdo = db();
$exists = $pdo->prepare('SELECT 1 FROM admin_users WHERE email = ? LIMIT 1');
$exists->execute([$email]);
if ($exists->fetchColumn() !== false) {
    json_error('email_already_used', 409);
}

$pdo->prepare('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)')
    ->execute([$email, password_hash($password, PASSWORD_DEFAULT)]);

json_success([
    'id' => (int)$pdo->lastInsertId(),
    'email' => $email,
], 201);
