<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;

class ContentSeeder
{
    public function seed(bool $force = false): array
    {
        $data = require database_path('seeders' . DIRECTORY_SEPARATOR . 'seed_data.php');
        $json = static fn (array $value): string => json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $lines = [];

        DB::transaction(function () use ($data, $force, $json, &$lines): void {
            foreach ($data['settings'] as $key => $value) {
                DB::table('settings')->insertOrIgnore(['key' => $key, 'value' => $value]);
            }

            foreach ($data['content'] as $page => $blocks) {
                foreach ($blocks as $block) {
                    DB::table('page_content')->insertOrIgnore([
                        'page' => $page,
                        'block_key' => $block['key'],
                        'block_type' => $block['type'],
                        'value_fr' => $block['fr'],
                        'value_en' => $block['en'],
                    ]);
                }
            }

            foreach ($data['gammes'] as $position => $gamme) {
                $exists = DB::table('gammes')->where('id', $gamme['id'])->exists();

                if ($exists && !$force) {
                    $lines[] = "- {$gamme['id']} : deja present, ignore (utilisez --force pour reecrire).";
                    continue;
                }

                DB::statement(
                    'INSERT INTO gammes
                      (id, nom, tagline, ingredients, description, ingredients_detail,
                       hero_lead, hero_accent, hero_copy, hero_alt, color, color_light, color_dark, position)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE
                       nom = VALUES(nom), tagline = VALUES(tagline), ingredients = VALUES(ingredients),
                       description = VALUES(description), ingredients_detail = VALUES(ingredients_detail),
                       hero_lead = VALUES(hero_lead), hero_accent = VALUES(hero_accent),
                       hero_copy = VALUES(hero_copy), hero_alt = VALUES(hero_alt),
                       color = VALUES(color), color_light = VALUES(color_light), color_dark = VALUES(color_dark)',
                    [
                        $gamme['id'],
                        $json($gamme['nom']),
                        $json($gamme['tagline']),
                        $json($gamme['ingredients']),
                        $json($gamme['description']),
                        $json($gamme['ingredientsDetail']),
                        $json($gamme['heroLead']),
                        $json($gamme['heroAccent']),
                        $json($gamme['heroCopy']),
                        $json($gamme['heroAlt']),
                        $gamme['color'],
                        $gamme['colorLight'],
                        $gamme['colorDark'],
                        $position,
                    ]
                );

                DB::table('produits')->where('gamme_id', $gamme['id'])->delete();

                foreach ($gamme['products'] as $productPosition => $product) {
                    DB::table('produits')->insert([
                        'gamme_id' => $gamme['id'],
                        'type' => $json($product['type']),
                        'poids' => $product['poids'],
                        'symbol' => $product['symbol'],
                        'description' => $json($product['description']),
                        'details' => isset($product['details']) ? $json($product['details']) : null,
                        'position' => $productPosition,
                    ]);
                }

                $lines[] = "+ {$gamme['id']} : gamme et " . count($gamme['products']) . ' produits enregistres.';
            }

            if (DB::table('admin_users')->count() === 0) {
                $email = env('ADMIN_EMAIL') ?: (getenv('ADMIN_EMAIL') ?: 'admin@teintdafrique.com');
                $password = env('ADMIN_PASSWORD') ?: (getenv('ADMIN_PASSWORD') ?: 'TeintAdmin2026!');
                DB::table('admin_users')->insert([
                    'email' => $email,
                    'password_hash' => password_hash($password, PASSWORD_DEFAULT),
                ]);
                $lines[] = "Compte administrateur cree : {$email} / {$password}";
                $lines[] = 'Changez ce mot de passe apres la premiere connexion.';
            } else {
                $lines[] = 'Compte administrateur : deja configure.';
            }
        });

        return $lines;
    }
}
