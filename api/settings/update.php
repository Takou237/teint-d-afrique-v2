<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('method_not_allowed', 405);
}

require_admin();
require_csrf();

$body = read_json_body();
if (!is_array($body) || $body === []) {
    json_error('nothing_to_update', 422);
}

// Accepte soit une carte {clé: valeur, ...}, soit un seul {key, value}.
if (isset($body['key']) && is_string($body['key']) && array_key_exists('value', $body)) {
    $body = [$body['key'] => $body['value']];
}

/** Clés éditables par le panneau (toute autre clé est refusée). */
$allowedKeys = [
    'site_name', 'tagline_fr', 'tagline_en', 'email', 'phone', 'whatsapp_number',
    'address_fr', 'address_en', 'hours_fr', 'hours_en',
    'instagram_url', 'facebook_url', 'tiktok_url', 'youtube_url',
];
$urlKeys = ['instagram_url', 'facebook_url', 'tiktok_url', 'youtube_url'];

$pdo = db();
$stmt = $pdo->prepare(
    'INSERT INTO settings (`key`, `value`) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)'
);

$pdo->beginTransaction();
try {
    foreach ($body as $key => $value) {
        if (!is_string($key) || !in_array($key, $allowedKeys, true)) {
            throw new InvalidArgumentException('invalid_setting_key');
        }
        if (!is_scalar($value) && $value !== null) {
            throw new InvalidArgumentException('invalid_setting_value');
        }
        $text = sanitize_plain_text((string)($value ?? ''));
        if (mb_strlen($text) > 500) {
            throw new InvalidArgumentException('setting_value_too_long');
        }
        if ($key === 'email' && $text !== '' && !filter_var($text, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('invalid_email');
        }
        if (in_array($key, $urlKeys, true) && $text !== '' && !is_http_url($text)) {
            throw new InvalidArgumentException('invalid_url');
        }
        if ($key === 'whatsapp_number' && $text !== '' && !preg_match('/^\d{6,15}$/', $text)) {
            throw new InvalidArgumentException('invalid_whatsapp_number');
        }
        $stmt->execute([$key, $text]);
    }
    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    $code = $e instanceof InvalidArgumentException ? $e->getMessage() : 'invalid_setting_value';
    json_error($code, 422);
}

/** Une URL de réseau social doit être absolue et http(s). */
function is_http_url(string $value): bool
{
    if (preg_match('#^https?://#i', $value) !== 1) {
        return false;
    }
    $parts = parse_url($value);
    return is_array($parts) && !empty($parts['host']);
}

$rows = $pdo->query('SELECT `key`, `value` FROM settings ORDER BY `key` ASC')->fetchAll();
$data = [];
foreach ($rows as $row) {
    $data[$row['key']] = $row['value'];
}

json_success($data);
