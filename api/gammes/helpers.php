<?php
declare(strict_types=1);

/** Construit l'URL publique d'un média à partir de son nom de fichier. */
function media_path(?string $filename): ?string
{
    return ($filename === null || $filename === '') ? null : '/uploads/' . $filename;
}

/** Transforme une ligne SQL produit en objet JSON attendu par le front. */
function product_row_to_api(array $row): array
{
    return [
        'id' => (int)$row['id'],
        'gammeId' => $row['gamme_id'],
        'type' => localized_decode($row['type']),
        'poids' => $row['poids'],
        'symbol' => $row['symbol'],
        'description' => localized_decode($row['description']),
        'details' => json_decode_field($row['details']),
        'imageId' => $row['image_id'] !== null ? (int)$row['image_id'] : null,
        'image' => media_path($row['image_file']),
        'position' => (int)$row['position'],
    ];
}

/**
 * Récupère les gammes (avec leurs produits) depuis la base.
 * Si $id est fourni, ne renvoie que cette gamme.
 */
function fetch_gammes_full(?string $id = null): array
{
    $pdo = db();

    $sql = 'SELECT g.*,
                   mi.filename AS image_file,
                   mmi.filename AS main_image_file,
                   mhi.filename AS hero_image_file,
                   mhsi.filename AS hero_image_small_file
            FROM gammes g
            LEFT JOIN media mi ON mi.id = g.image_id
            LEFT JOIN media mmi ON mmi.id = g.main_image_id
            LEFT JOIN media mhi ON mhi.id = g.hero_image_id
            LEFT JOIN media mhsi ON mhsi.id = g.hero_image_small_id';
    $params = [];
    if ($id !== null) {
        $sql .= ' WHERE g.id = ?';
        $params[] = $id;
    }
    $sql .= ' ORDER BY g.position ASC, g.id ASC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $gammes = $stmt->fetchAll();

    if ($gammes === []) {
        return [];
    }

    $ids = array_column($gammes, 'id');
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $productStmt = $pdo->prepare(
        "SELECT p.*, m.filename AS image_file
         FROM produits p
         LEFT JOIN media m ON m.id = p.image_id
         WHERE p.gamme_id IN ($placeholders)
         ORDER BY p.position ASC, p.id ASC"
    );
    $productStmt->execute($ids);

    $productsByGamme = [];
    foreach ($productStmt->fetchAll() as $product) {
        $productsByGamme[$product['gamme_id']][] = product_row_to_api($product);
    }

    return array_map(static function (array $g) use ($productsByGamme): array {
        return [
            'id' => $g['id'],
            'nom' => localized_decode($g['nom']),
            'tagline' => localized_decode($g['tagline']),
            'ingredients' => localized_decode($g['ingredients']),
            'description' => localized_decode($g['description']),
            'ingredientsDetail' => localized_decode($g['ingredients_detail']),
            'heroLead' => localized_decode($g['hero_lead']),
            'heroAccent' => localized_decode($g['hero_accent']),
            'heroCopy' => localized_decode($g['hero_copy']),
            'heroAlt' => localized_decode($g['hero_alt']),
            'color' => $g['color'],
            'colorLight' => $g['color_light'],
            'colorDark' => $g['color_dark'],
            'imageId' => $g['image_id'] !== null ? (int)$g['image_id'] : null,
            'image' => media_path($g['image_file']),
            'mainImageId' => $g['main_image_id'] !== null ? (int)$g['main_image_id'] : null,
            'mainImage' => media_path($g['main_image_file']),
            'heroImageId' => $g['hero_image_id'] !== null ? (int)$g['hero_image_id'] : null,
            'heroImage' => media_path($g['hero_image_file']),
            'heroImageSmallId' => $g['hero_image_small_id'] !== null ? (int)$g['hero_image_small_id'] : null,
            'heroImageSmall' => media_path($g['hero_image_small_file']),
            'position' => (int)$g['position'],
            'products' => $productsByGamme[$g['id']] ?? [],
        ];
    }, $gammes);
}
