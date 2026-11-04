<?php
declare(strict_types=1);

/** URL publique d'un média à partir de la valeur stockée dans un bloc image. */
function content_media_url(string $value): ?string
{
    $id = filter_var($value, FILTER_VALIDATE_INT);
    if ($id === false || $id <= 0) {
        return null;
    }
    $stmt = db()->prepare('SELECT filename FROM media WHERE id = ?');
    $stmt->execute([$id]);
    $filename = $stmt->fetchColumn();
    return $filename === false ? null : '/uploads/' . $filename;
}

/**
 * Met en forme une ligne de `page_content` ou de `content_drafts` pour l'API.
 * Pour un bloc image, `valueFr` / `valueEn` contiennent l'URL du média.
 */
function content_block_payload(array $row, string $lang = 'fr'): array
{
    $valueFr = (string)$row['value_fr'];
    $valueEn = (string)$row['value_en'];
    $imageIdFr = null;
    $imageIdEn = null;
    $imageUrlFr = null;
    $imageUrlEn = null;

    if ($row['block_type'] === 'image') {
        $imageIdFr = filter_var($valueFr, FILTER_VALIDATE_INT) ?: null;
        $imageIdEn = filter_var($valueEn, FILTER_VALIDATE_INT) ?: null;
        $imageUrlFr = content_media_url($valueFr);
        $imageUrlEn = content_media_url($valueEn);
        $valueFr = $imageUrlFr;
        $valueEn = $imageUrlEn;
    }

    return [
        'page' => $row['page'],
        'blockKey' => $row['block_key'],
        'blockType' => $row['block_type'],
        'value' => $lang === 'en' ? $valueEn : $valueFr,
        'valueFr' => $valueFr,
        'valueEn' => $valueEn,
        'imageIdFr' => $imageIdFr,
        'imageIdEn' => $imageIdEn,
        'imageUrlFr' => $imageUrlFr,
        'imageUrlEn' => $imageUrlEn,
        'updatedAt' => $row['updated_at'],
    ];
}
