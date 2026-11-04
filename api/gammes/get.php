<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('method_not_allowed', 405);
}

$id = trim((string)($_GET['id'] ?? ''));
if ($id === '') {
    json_error('missing_id', 422);
}

$gammes = fetch_gammes_full($id);
if ($gammes === []) {
    json_error('not_found', 404);
}

json_success($gammes[0]);
