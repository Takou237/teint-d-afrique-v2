<?php
declare(strict_types=1);

require_once __DIR__ . '/../gammes/helpers.php';

function fetch_product(int $id): ?array
{
    $stmt = db()->prepare(
        'SELECT p.*, m.filename AS image_file
         FROM produits p
         LEFT JOIN media m ON m.id = p.image_id
         WHERE p.id = ?'
    );
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row === false ? null : product_row_to_api($row);
}

function assert_media_exists(int $mediaId): void
{
    $check = db()->prepare('SELECT 1 FROM media WHERE id = ?');
    $check->execute([$mediaId]);
    if ($check->fetchColumn() === false) {
        json_error('media_not_found', 422);
    }
}
