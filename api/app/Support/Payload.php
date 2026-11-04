<?php

namespace App\Support;

use Illuminate\Http\Request;

class Payload
{
    public static function json(Request $request): array
    {
        $data = json_decode((string) $request->getContent(), true);
        if (!is_array($data)) {
            throw new ApiException('invalid_json_body', 400);
        }

        return $data;
    }

    public static function plainText(string $value): string
    {
        return trim(strip_tags($value));
    }

    public static function richText(string $value): string
    {
        $value = preg_replace('#<(script|style)\b[^>]*>.*?</\1>#is', '', $value) ?? $value;
        $clean = strip_tags($value, '<p><strong><em><br><ul><li><a>');

        $clean = preg_replace_callback(
            '/<a\s+[^>]*href\s*=\s*["\']([^"\']*)["\'][^>]*>/i',
            static function (array $matches): string {
                $href = $matches[1];
                $isSafe = preg_match('#^(https?:)?//#i', $href) === 1 || stripos($href, 'mailto:') === 0;
                if (!$isSafe) {
                    return '<a>';
                }

                return '<a href="' . htmlspecialchars($href, ENT_QUOTES) . '" target="_blank" rel="noopener noreferrer">';
            },
            $clean
        );

        $clean = preg_replace('/<(p|strong|em|br|ul|li)\s+[^>]*>/i', '<$1>', $clean);

        return trim((string) $clean);
    }

    public static function localizedInput(mixed $value): array
    {
        if (is_string($value)) {
            return ['fr' => $value, 'en' => $value];
        }
        if (!is_array($value)) {
            throw new ApiException('invalid_localized_value', 422);
        }

        $fr = $value['fr'] ?? null;
        $en = $value['en'] ?? null;
        if (!is_string($fr) || !is_string($en)) {
            throw new ApiException('invalid_localized_value', 422);
        }

        return ['fr' => $fr, 'en' => $en];
    }

    public static function localizeStored(mixed $stored): array
    {
        if (is_array($stored)) {
            return ['fr' => (string) ($stored['fr'] ?? ''), 'en' => (string) ($stored['en'] ?? '')];
        }

        $decoded = json_decode((string) $stored, true);
        if (is_array($decoded)) {
            return ['fr' => (string) ($decoded['fr'] ?? ''), 'en' => (string) ($decoded['en'] ?? '')];
        }

        return ['fr' => (string) $stored, 'en' => (string) $stored];
    }

    public static function jsonField(mixed $stored): mixed
    {
        if (is_array($stored) || $stored === null) {
            return $stored;
        }

        $decoded = json_decode((string) $stored, true);

        return is_array($decoded) ? $decoded : null;
    }

    public static function sanitizeLocalized(mixed $value, string $field, bool $allowEmpty = false): array
    {
        $localized = self::localizedInput($value);
        $clean = [];
        foreach (['fr', 'en'] as $lang) {
            $text = self::plainText($localized[$lang]);
            if ($text === '' && !$allowEmpty) {
                throw new ApiException("empty_value:$field:$lang", 422);
            }
            $clean[$lang] = $text;
        }

        return $clean;
    }

    public static function sanitizeLocalizedList(mixed $value, string $field, bool $allowEmpty = true): array
    {
        $localized = self::localizedInput($value);
        $clean = [];
        foreach (['fr', 'en'] as $lang) {
            $items = $localized[$lang];
            if (!is_array($items)) {
                throw new ApiException("invalid_list:$field:$lang", 422);
            }
            $list = [];
            foreach ($items as $item) {
                if (!is_string($item)) {
                    throw new ApiException("invalid_list_item:$field:$lang", 422);
                }
                $text = self::plainText($item);
                if ($text !== '') {
                    $list[] = $text;
                }
            }
            if ($list === [] && !$allowEmpty) {
                throw new ApiException("empty_list:$field:$lang", 422);
            }
            $clean[$lang] = array_slice($list, 0, 10);
        }

        return $clean;
    }

    public static function sanitizeProductDetails(mixed $value): ?array
    {
        if ($value === null || $value === '') {
            return null;
        }
        if (!is_array($value)) {
            throw new ApiException('invalid_details', 422);
        }

        $details = [
            'promesses' => self::sanitizeLocalizedList($value['promesses'] ?? ['fr' => [], 'en' => []], 'promesses', true),
        ];
        foreach (['nom', 'actifs', 'proprietes', 'ingredients', 'modeEmploi', 'precautions'] as $field) {
            $details[$field] = self::sanitizeLocalized($value[$field] ?? '', $field, $field !== 'nom');
        }

        return $details;
    }

    public static function slugify(string $value): string
    {
        $ascii = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value);
        $ascii = $ascii === false ? $value : $ascii;
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $ascii) ?? '');

        return trim($slug, '-');
    }

    public static function contentPages(): array
    {
        return [
            'accueil', 'boutique', 'histoire', 'fondatrice', 'vision', 'engagements', 'valeurs',
            'nos-produits', 'gamme', 'types', 'vos-besoins', 'expertise', 'vlogs',
            'contact', 'localisation', 'distributeurs', 'produit', 'global',
        ];
    }

    public static function isHttpUrl(string $value): bool
    {
        if (preg_match('#^https?://#i', $value) !== 1) {
            return false;
        }
        $parts = parse_url($value);

        return is_array($parts) && !empty($parts['host']);
    }
}
