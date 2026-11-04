<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;

class Gammes
{
    public static function mediaPath(?string $filename): ?string
    {
        return ($filename === null || $filename === '') ? null : '/uploads/' . $filename;
    }

    public static function productRow(array|object $row): array
    {
        $row = (array) $row;

        return [
            'id' => (int) $row['id'],
            'gammeId' => $row['gamme_id'],
            'type' => Payload::localizeStored($row['type']),
            'poids' => $row['poids'],
            'symbol' => $row['symbol'],
            'description' => Payload::localizeStored($row['description']),
            'details' => Payload::jsonField($row['details']),
            'imageId' => $row['image_id'] !== null ? (int) $row['image_id'] : null,
            'image' => self::mediaPath($row['image_file'] ?? null),
            'position' => (int) $row['position'],
        ];
    }

    public static function fetchFull(?string $id = null): array
    {
        $query = DB::table('gammes as g')
            ->leftJoin('media as mi', 'mi.id', '=', 'g.image_id')
            ->leftJoin('media as mmi', 'mmi.id', '=', 'g.main_image_id')
            ->leftJoin('media as mhi', 'mhi.id', '=', 'g.hero_image_id')
            ->leftJoin('media as mhsi', 'mhsi.id', '=', 'g.hero_image_small_id')
            ->select(
                'g.*',
                'mi.filename as image_file',
                'mmi.filename as main_image_file',
                'mhi.filename as hero_image_file',
                'mhsi.filename as hero_image_small_file'
            );

        if ($id !== null) {
            $query->where('g.id', $id);
        }

        $gammes = $query->orderBy('g.position')->orderBy('g.id')->get()->all();

        if ($gammes === []) {
            return [];
        }

        $ids = array_map(static fn ($gamme): string => (string) ((array) $gamme)['id'], $gammes);

        $products = DB::table('produits as p')
            ->leftJoin('media as m', 'm.id', '=', 'p.image_id')
            ->whereIn('p.gamme_id', $ids)
            ->select('p.*', 'm.filename as image_file')
            ->orderBy('p.position')
            ->orderBy('p.id')
            ->get();

        $productsByGamme = [];
        foreach ($products as $product) {
            $product = (array) $product;
            $productsByGamme[$product['gamme_id']][] = self::productRow($product);
        }

        return array_map(static function ($gamme) use ($productsByGamme): array {
            $g = (array) $gamme;

            return [
                'id' => $g['id'],
                'nom' => Payload::localizeStored($g['nom']),
                'tagline' => Payload::localizeStored($g['tagline']),
                'ingredients' => Payload::localizeStored($g['ingredients']),
                'description' => Payload::localizeStored($g['description']),
                'ingredientsDetail' => Payload::localizeStored($g['ingredients_detail']),
                'heroLead' => Payload::localizeStored($g['hero_lead']),
                'heroAccent' => Payload::localizeStored($g['hero_accent']),
                'heroCopy' => Payload::localizeStored($g['hero_copy']),
                'heroAlt' => Payload::localizeStored($g['hero_alt']),
                'color' => $g['color'],
                'colorLight' => $g['color_light'],
                'colorDark' => $g['color_dark'],
                'imageId' => $g['image_id'] !== null ? (int) $g['image_id'] : null,
                'image' => self::mediaPath($g['image_file']),
                'mainImageId' => $g['main_image_id'] !== null ? (int) $g['main_image_id'] : null,
                'mainImage' => self::mediaPath($g['main_image_file']),
                'heroImageId' => $g['hero_image_id'] !== null ? (int) $g['hero_image_id'] : null,
                'heroImage' => self::mediaPath($g['hero_image_file']),
                'heroImageSmallId' => $g['hero_image_small_id'] !== null ? (int) $g['hero_image_small_id'] : null,
                'heroImageSmall' => self::mediaPath($g['hero_image_small_file']),
                'position' => (int) $g['position'],
                'products' => $productsByGamme[$g['id']] ?? [],
            ];
        }, $gammes);
    }

    public static function fetchProduct(int $id): ?array
    {
        $row = DB::table('produits as p')
            ->leftJoin('media as m', 'm.id', '=', 'p.image_id')
            ->where('p.id', $id)
            ->select('p.*', 'm.filename as image_file')
            ->first();

        return $row === null ? null : self::productRow($row);
    }

    public static function assertMediaExists(int $mediaId): void
    {
        if (!DB::table('media')->where('id', $mediaId)->exists()) {
            throw new ApiException('media_not_found', 422);
        }
    }
}
