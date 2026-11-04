<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('method_not_allowed', 405);
}

require_admin();
require_csrf();

$body = read_json_body();
$page = trim((string)($body['page'] ?? ''));
$blockKey = trim((string)($body['blockKey'] ?? ''));

if ($page === '' || !in_array($page, content_pages(), true)) {
    json_error('invalid_page', 422);
}
if (!preg_match('/^[a-z0-9_-]{1,100}$/i', $blockKey)) {
    json_error('invalid_block_key', 422);
}

$pdo = db();
$stmt = $pdo->prepare('DELETE FROM page_content WHERE page = ? AND block_key = ?');
$stmt->execute([$page, $blockKey]);
$deleted = $stmt->rowCount();

// Un bloc peut n'exister qu'en brouillon (créé mais jamais publié) : on nettoie aussi le brouillon.
$draft = $pdo->prepare('DELETE FROM content_drafts WHERE page = ? AND block_key = ?');
$draft->execute([$page, $blockKey]);

if ($deleted === 0 && $draft->rowCount() === 0) {
    json_error('not_found', 404);
}

json_success(null, 204);
