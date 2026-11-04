<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../lib/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('method_not_allowed', 405);
}

$body = read_json_body();

$name = sanitize_plain_text((string)($body['name'] ?? ''));
$email = strtolower(sanitize_plain_text((string)($body['email'] ?? '')));
$phone = sanitize_plain_text((string)($body['phone'] ?? ''));
$message = trim(strip_tags((string)($body['message'] ?? '')));

if ($name === '' || mb_strlen($name) > 190) {
    json_error('invalid_name', 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) {
    json_error('invalid_email', 422);
}
if (mb_strlen($phone) > 50) {
    json_error('invalid_phone', 422);
}
if ($message === '' || mb_strlen($message) > 5000) {
    json_error('invalid_message', 422);
}

$pdo = db();
$ip = substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45);

$recent = $pdo->prepare(
    'SELECT COUNT(*) FROM contact_messages
     WHERE ip_address = ? AND created_at > (NOW() - INTERVAL 10 MINUTE)'
);
$recent->execute([$ip]);
if ((int)$recent->fetchColumn() >= 5) {
    json_error('too_many_messages', 429);
}

$stmt = $pdo->prepare(
    'INSERT INTO contact_messages (name, email, phone, message, ip_address) VALUES (?, ?, ?, ?, ?)'
);
$stmt->execute([$name, $email, $phone, $message, $ip]);
$id = (int)$pdo->lastInsertId();

// Notification au responsable du site : un échec d'envoi ne doit pas perdre le message,
// qui reste de toute façon visible dans l'onglet Messages du panneau.
notify_new_contact_message([
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'message' => $message,
]);

json_success(['id' => $id], 201);
