<?php
/**
 * Routeur du serveur PHP intégré (php -S), exécuté à chaque requête.
 *
 * Sur Railway le dossier api/ est la racine web, mais le front (Vercel) appelle
 * les routes avec le préfixe /api/ (voir src/lib/config.ts) : on retire ce préfixe
 * et on exécute le fichier .php correspondant. Les ressources statiques (uploads/...)
 * sont laissées au serveur intégré (return false).
 *
 * Réutilisable avec Apache+mod_php via .htaccess (rewrite ^api/(.*)$ /$1) :
 * ce routeur n'est utilisé que par php -S.
 */

$uri = $_SERVER['REQUEST_URI'] ?? '/';
$path = rawurldecode((string)parse_url($uri, PHP_URL_PATH));

// Bibliothèques internes et scripts d'installation : jamais servis par le serveur de développement
// (l'équivalent existe dans .htaccess pour Apache).
if (strpos($path, '/lib/') === 0 || strpos($path, '/scripts/') === 0) {
    http_response_code(404);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'error' => 'not_found'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if (strpos($path, '/api/') === 0) {
    $docRoot = __DIR__;
    $relative = ltrim(substr($path, 4), '/');
    $target = $docRoot . '/' . $relative;

    $real = realpath($target);
    // lib/ contient des bibliothèques internes : jamais servies directement.
    $isInternal = strpos('/' . $relative, '/lib/') === 0;
    if (
        $real !== false
        && !$isInternal
        && is_file($real)
        && !is_dir($real)
        && substr($real, -4) === '.php'
        && strpos($real, $docRoot) === 0
    ) {
        require $real;
        exit;
    }

    http_response_code(404);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'error' => 'not_found'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Autres chemins (fichiers statiques, .php sans préfixe /api) : laisser php -S servir.
return false;
