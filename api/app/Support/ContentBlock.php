<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;

class ContentBlock
{
    private static array $mediaCache = [];

    public static function payload(array $row, string $lang = 'fr'): array
    {
        $valueFr = (string) $row['value_fr'];
        $valueEn = (string) $row['value_en'];
        $imageIdFr = null;
        $imageIdEn = null;
        $imageUrlFr = null;
        $imageUrlEn = null;

        if ($row['block_type'] === 'image') {
            $imageIdFr = filter_var($valueFr, FILTER_VALIDATE_INT) ?: null;
            $imageIdEn = filter_var($valueEn, FILTER_VALIDATE_INT) ?: null;
            $imageUrlFr = self::mediaUrl($valueFr);
            $imageUrlEn = self::mediaUrl($valueEn);
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

    public static function mediaUrl(string $value): ?string
    {
        $id = filter_var($value, FILTER_VALIDATE_INT);
        if ($id === false || $id <= 0) {
            return null;
        }

        if (!array_key_exists($id, self::$mediaCache)) {
            self::$mediaCache[$id] = DB::table('media')->where('id', $id)->value('filename');
        }
        $filename = self::$mediaCache[$id];

        return $filename === null ? null : '/uploads/' . $filename;
    }
}
