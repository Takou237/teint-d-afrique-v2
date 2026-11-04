<?php
/**
 * Met à jour le texte alternatif d'une image déjà téléversée
 * (utile pour l'accessibilité et le référencement, sans re-téléverser le fichier).
 */

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('method_not_allowed', 405);
}

require_admin();
require_csrf();

$body = read_json_body();
$id = filter_var($body['id'] ?? null, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    json_error('invalid_id', 422);
}

$altText = sanitize_plain_text((string)($body['altText'] ?? ''));
if (mb_strlen($altText) > 255) {
    json_error('alt_text_too_long', 422);
}

$pdo = db();
$exists = $pdo->prepare('SELECT 1 FROM media WHERE id = ?');
$exists->execute([$id]);
if ($exists->fetchColumn() === false) {
    json_error('not_found', 404);
}

$pdo->prepare('UPDATE media SET alt_text = ? WHERE id = ?')->execute([$altText, $id]);

json_success(['id' => $id, 'altText' => $altText]);
