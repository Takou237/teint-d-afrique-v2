<?php
/**
 * Publie les brouillons d'une page : recopie chaque bloc en attente dans `page_content`
 * puis vide la table de brouillons pour cette page.
 */

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('method_not_allowed', 405);
}

require_admin();
require_csrf();

$body = read_json_body();
$page = trim((string)($body['page'] ?? ''));

if ($page === '' || !in_array($page, content_pages(), true)) {
    json_error('invalid_page', 422);
}

$pdo = db();

$pdo->beginTransaction();
try {
    $select = $pdo->prepare(
        'SELECT block_key, block_type, value_fr, value_en FROM content_drafts WHERE page = ?'
    );
    $select->execute([$page]);
    $drafts = $select->fetchAll();

    if ($drafts === []) {
        $pdo->rollBack();
        json_error('nothing_to_publish', 422);
    }

    $upsert = $pdo->prepare(
        'INSERT INTO page_content (page, block_key, block_type, value_fr, value_en)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           block_type = VALUES(block_type),
           value_fr = VALUES(value_fr),
           value_en = VALUES(value_en)'
    );
    foreach ($drafts as $draft) {
        $upsert->execute([$page, $draft['block_key'], $draft['block_type'], $draft['value_fr'], $draft['value_en']]);
    }

    $pdo->prepare('DELETE FROM content_drafts WHERE page = ?')->execute([$page]);

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    throw $e;
}

json_success(['published' => count($drafts)]);
