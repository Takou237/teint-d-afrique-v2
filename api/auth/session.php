<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('method_not_allowed', 405);
}

if (empty($_SESSION['admin_id'])) {
    json_success(['authenticated' => false]);
}

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

json_success([
    'authenticated' => true,
    'email' => $_SESSION['admin_email'] ?? '',
    'csrfToken' => $_SESSION['csrf_token'],
]);
