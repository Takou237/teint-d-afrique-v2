<?php
/**
 * Installe le contenu initial (gammes, produits, réglages, compte admin).
 *
 * Usage : php api/scripts/seed.php [--force]
 *   --force  réécrit les champs éditoriaux des gammes et leurs produits
 *            (les images déjà téléversées et les blocs de contenu sont conservés).
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    echo "Ce script s'exécute uniquement en ligne de commande.\n";
    exit(1);
}

$configPath = __DIR__ . '/../config.php';
if (!is_file($configPath)) {
    fwrite(STDERR, "api/config.php introuvable. Copiez config.php.example et adaptez-le.\n");
    exit(1);
}

$config = require $configPath;
$c = $config['db'];
$dsn = "mysql:host={$c['host']};port={$c['port']};dbname={$c['name']};charset={$c['charset']}";

try {
    $pdo = new PDO($dsn, $c['user'], $c['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    fwrite(STDERR, "Connexion MySQL impossible : {$e->getMessage()}\n");
    exit(1);
}

$force = in_array('--force', $argv, true);
$data = require __DIR__ . '/seed_data.php';

$json = static fn (array $value): string => json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$pdo->beginTransaction();
try {
    // Réglages : insérés une seule fois, jamais écrasés.
    $settingStmt = $pdo->prepare('INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)');
    foreach ($data['settings'] as $key => $value) {
        $settingStmt->execute([$key, $value]);
    }

    // Blocs de contenu : insérés une seule fois, jamais écrasés.
    $contentStmt = $pdo->prepare(
        'INSERT IGNORE INTO page_content (page, block_key, block_type, value_fr, value_en)
         VALUES (?, ?, ?, ?, ?)'
    );
    foreach ($data['content'] as $page => $blocks) {
        foreach ($blocks as $block) {
            $contentStmt->execute([$page, $block['key'], $block['type'], $block['fr'], $block['en']]);
        }
    }

    $gammeStmt = $pdo->prepare(
        'INSERT INTO gammes
          (id, nom, tagline, ingredients, description, ingredients_detail,
           hero_lead, hero_accent, hero_copy, hero_alt, color, color_light, color_dark, position)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           nom = VALUES(nom), tagline = VALUES(tagline), ingredients = VALUES(ingredients),
           description = VALUES(description), ingredients_detail = VALUES(ingredients_detail),
           hero_lead = VALUES(hero_lead), hero_accent = VALUES(hero_accent),
           hero_copy = VALUES(hero_copy), hero_alt = VALUES(hero_alt),
           color = VALUES(color), color_light = VALUES(color_light), color_dark = VALUES(color_dark)'
    );

    $productStmt = $pdo->prepare(
        'INSERT INTO produits (gamme_id, type, poids, symbol, description, details, position)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    $existsStmt = $pdo->prepare('SELECT 1 FROM gammes WHERE id = ?');
    $deleteProducts = $pdo->prepare('DELETE FROM produits WHERE gamme_id = ?');

    foreach ($data['gammes'] as $position => $gamme) {
        $existsStmt->execute([$gamme['id']]);
        $exists = $existsStmt->fetchColumn() !== false;

        if ($exists && !$force) {
            echo "- {$gamme['id']} : déjà présent, ignoré (utilisez --force pour réécrire).\n";
            continue;
        }

        $gammeStmt->execute([
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
        ]);

        $deleteProducts->execute([$gamme['id']]);
        foreach ($gamme['products'] as $productPosition => $product) {
            $productStmt->execute([
                $gamme['id'],
                $json($product['type']),
                $product['poids'],
                $product['symbol'],
                $json($product['description']),
                isset($product['details']) ? $json($product['details']) : null,
                $productPosition,
            ]);
        }

        echo "+ {$gamme['id']} : gamme et " . count($gamme['products']) . " produits enregistrés.\n";
    }

    $adminCount = (int)$pdo->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
    if ($adminCount === 0) {
        $email = getenv('ADMIN_EMAIL') ?: 'admin@teintdafrique.com';
        $password = getenv('ADMIN_PASSWORD') ?: 'TeintAdmin2026!';
        $insertAdmin = $pdo->prepare('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)');
        $insertAdmin->execute([$email, password_hash($password, PASSWORD_DEFAULT)]);
        echo "\nCompte administrateur créé :\n  e-mail   : $email\n  mot de passe : $password\n";
        echo "Changez ce mot de passe après la première connexion.\n";
    } else {
        echo "\nCompte administrateur : déjà configuré.\n";
    }

    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    fwrite(STDERR, "Échec du seed : {$e->getMessage()}\n");
    exit(1);
}

echo "\nSeed terminé.\n";
