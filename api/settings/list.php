<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('method_not_allowed', 405);
}

$rows = db()->query('SELECT `key`, `value` FROM settings ORDER BY `key` ASC')->fetchAll();

$data = [];
foreach ($rows as $row) {
    $data[$row['key']] = $row['value'];
}

json_success($data);
