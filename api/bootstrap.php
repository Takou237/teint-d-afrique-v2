<?php
/**
 * Point d'entrée commun à toutes les routes de l'API.
 * Charge la config, ouvre la session admin, applique les en-têtes CORS/JSON,
 * et expose les helpers utilisés par les routes (db(), json_success(), require_admin()...).
 */

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0'); // ne jamais laisser fuir une trace PHP au client

/**
 * Charge la config : api/config.php s'il existe (développement, hébergement mutualisé),
 * sinon construit la config depuis des variables d'environnement (ex. Railway/Render).
 *
 * Variables d'environnement reconnues :
 *   DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS
 *   CORS_ORIGINS        (liste d'origines séparées par des virgules)
 *   SESSION_NAME, SESSION_SAME_SITE, SESSION_SECURE (true/false)
 *   APP_URL             (origine publique du site, pour les liens des emails)
 *   MAIL_TRANSPORT, MAIL_HOST, MAIL_PORT, MAIL_ENCRYPTION, MAIL_USER, MAIL_PASS,
 *   MAIL_FROM, MAIL_FROM_NAME, MAIL_NOTIFY_TO (voir api/lib/mailer.php)
 */
function load_config(): array
{
    $configPath = __DIR__ . '/config.php';
    if (is_file($configPath)) {
        return require $configPath;
    }

    $env = static function (string $key, string $default = ''): string {
        $value = getenv($key);
        return ($value !== false && $value !== '') ? (string)$value : $default;
    };

    $sameSite = $env('SESSION_SAME_SITE', 'Strict');
    $cors = array_values(array_filter(array_map('trim', explode(',', $env('CORS_ORIGINS', '')))));

    return [
        'db' => [
            'host' => $env('DB_HOST', '127.0.0.1'),
            'port' => (int)$env('DB_PORT', '3306'),
            'name' => $env('DB_NAME', 'teint_afrique_cms'),
            'user' => $env('DB_USER', 'root'),
            'pass' => $env('DB_PASS', ''),
            'charset' => 'utf8mb4',
        ],
        'cors_origins' => $cors,
        'session_name' => $env('SESSION_NAME', 'tda_admin_session'),
        'session_same_site' => $sameSite,
        'session_secure' => $env('SESSION_SECURE', 'false') === 'true' || $sameSite === 'None',
    ];
}

$config = load_config();

/**
 * Complète le bloc "mail" (et l'URL publique) avec des variables d'environnement.
 * Les valeurs de api/config.php restent prioritaires.
 */
function mail_env(string $key, $default = '')
{
    $value = getenv($key);
    return ($value !== false && $value !== '') ? (string)$value : $default;
}

$config['mail'] = array_merge([
    'transport' => mail_env('MAIL_TRANSPORT', 'smtp'),
    'host' => mail_env('MAIL_HOST', ''),
    'port' => (int)mail_env('MAIL_PORT', 587),
    'encryption' => mail_env('MAIL_ENCRYPTION', 'tls'),
    'user' => mail_env('MAIL_USER', ''),
    'pass' => mail_env('MAIL_PASS', ''),
    'from_email' => mail_env('MAIL_FROM', ''),
    'from_name' => mail_env('MAIL_FROM_NAME', "Teint d'Afrique Cosmétiques"),
    'notify_to' => mail_env('MAIL_NOTIFY_TO', ''),
], is_array($config['mail'] ?? null) ? $config['mail'] : []);

// Origine publique du site : sert à construire les liens des emails (réinitialisation...).
$config['app_url'] = rtrim((string)($config['app_url'] ?? mail_env('APP_URL', '')), '/');

session_name($config['session_name']);
session_set_cookie_params([
    'httponly' => true,
    'samesite' => $config['session_same_site'] ?? 'Strict',
    'secure' => $config['session_secure'] ?? false,
]);
session_start();

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if ($origin !== '' && in_array($origin, $config['cors_origins'], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token, X-Requested-With');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
}
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function json_response(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_success($data = null, int $status = 200): void
{
    json_response(['success' => true, 'data' => $data], $status);
}

function json_error(string $message, int $status = 400): void
{
    json_response(['success' => false, 'error' => $message], $status);
}

function require_admin(): void
{
    if (empty($_SESSION['admin_id'])) {
        json_error('unauthorized', 401);
    }
}

function require_csrf(): void
{
    $header = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN'] : '';
    if (empty($_SESSION['csrf_token']) || $header === '' || !hash_equals($_SESSION['csrf_token'], $header)) {
        json_error('invalid_csrf_token', 403);
    }
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        global $config;
        $c = $config['db'];
        $dsn = "mysql:host={$c['host']};port={$c['port']};dbname={$c['name']};charset={$c['charset']}";
        $pdo = new PDO($dsn, $c['user'], $c['pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    return $pdo;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode((string)$raw, true);
    if (!is_array($data)) {
        json_error('invalid_json_body', 400);
    }
    return $data;
}

function sanitize_plain_text(string $value): string
{
    return trim(strip_tags($value));
}

function sanitize_richtext(string $value): string
{
    $value = preg_replace('#<(script|style)\b[^>]*>.*?</\1>#is', '', $value) ?? $value;
    $allowedTags = '<p><strong><em><br><ul><li><a>';
    $clean = strip_tags($value, $allowedTags);

    $clean = preg_replace_callback('/<a\s+[^>]*href\s*=\s*["\']([^"\']*)["\'][^>]*>/i', function (array $m): string {
        $href = $m[1];
        $isSafe = preg_match('#^(https?:)?//#i', $href) === 1 || stripos($href, 'mailto:') === 0;
        if (!$isSafe) {
            return '<a>';
        }
        return '<a href="' . htmlspecialchars($href, ENT_QUOTES) . '" target="_blank" rel="noopener noreferrer">';
    }, $clean);

    $clean = preg_replace('/<(p|strong|em|br|ul|li)\s+[^>]*>/i', '<$1>', $clean);

    return trim((string)$clean);
}

/**
 * Normalise une valeur localisée reçue du client : soit un objet {"fr":"...","en":"..."},
 * soit une chaîne simple (dupliquée en FR et EN pour compatibilité).
 * Renvoie toujours un tableau avec les clés fr et en.
 */
function localized_input($value): array
{
    if (is_string($value)) {
        return ['fr' => $value, 'en' => $value];
    }
    if (!is_array($value)) {
        json_error('invalid_localized_value', 422);
    }
    $fr = $value['fr'] ?? null;
    $en = $value['en'] ?? null;
    if (!is_string($fr) || !is_string($en)) {
        json_error('invalid_localized_value', 422);
    }
    return ['fr' => $fr, 'en' => $en];
}

/** Décode un champ JSON localisé venant de la base (tolère les anciennes valeurs texte). */
function localized_decode($stored): array
{
    if (is_array($stored)) {
        return ['fr' => (string)($stored['fr'] ?? ''), 'en' => (string)($stored['en'] ?? '')];
    }
    $decoded = json_decode((string)$stored, true);
    if (is_array($decoded)) {
        return ['fr' => (string)($decoded['fr'] ?? ''), 'en' => (string)($decoded['en'] ?? '')];
    }
    return ['fr' => (string)$stored, 'en' => (string)$stored];
}

/** Décode un champ JSON quelconque (details, promesses...). */
function json_decode_field($stored): mixed
{
    if (is_array($stored) || $stored === null) {
        return $stored;
    }
    $decoded = json_decode((string)$stored, true);
    return is_array($decoded) ? $decoded : null;
}

/** Nettoie et valide un champ localisé texte. */
function sanitize_localized($value, string $field, bool $allowEmpty = false): array
{
    $localized = localized_input($value);
    $clean = [];
    foreach (['fr', 'en'] as $lang) {
        $text = sanitize_plain_text($localized[$lang]);
        if ($text === '' && !$allowEmpty) {
            json_error("empty_value:$field:$lang", 422);
        }
        $clean[$lang] = $text;
    }
    return $clean;
}

/** Nettoie une liste localisée de chaînes : {"fr": [...], "en": [...]}. */
function sanitize_localized_list($value, string $field, bool $allowEmpty = true): array
{
    $localized = localized_input($value);
    $clean = [];
    foreach (['fr', 'en'] as $lang) {
        $items = $localized[$lang];
        if (!is_array($items)) {
            json_error("invalid_list:$field:$lang", 422);
        }
        $list = [];
        foreach ($items as $item) {
            if (!is_string($item)) {
                json_error("invalid_list_item:$field:$lang", 422);
            }
            $text = sanitize_plain_text($item);
            if ($text !== '') {
                $list[] = $text;
            }
        }
        if ($list === [] && !$allowEmpty) {
            json_error("empty_list:$field:$lang", 422);
        }
        $clean[$lang] = array_slice($list, 0, 10);
    }
    return $clean;
}

/**
 * Valide et nettoie l'objet ProductDetails du front, ou renvoie null pour un produit sans détails.
 * Forme attendue :
 * {"nom":{fr,en},"promesses":{fr:[],en:[]},"actifs":{fr,en},"proprietes":{fr,en},
 *  "ingredients":{fr,en},"modeEmploi":{fr,en},"precautions":{fr,en}}
 */
function sanitize_product_details($value): ?array
{
    if ($value === null || $value === '') {
        return null;
    }
    if (!is_array($value)) {
        json_error('invalid_details', 422);
    }

    $details = ['promesses' => sanitize_localized_list($value['promesses'] ?? ['fr' => [], 'en' => []], 'promesses', true)];
    foreach (['nom', 'actifs', 'proprietes', 'ingredients', 'modeEmploi', 'precautions'] as $field) {
        $details[$field] = sanitize_localized($value[$field] ?? '', $field, $field !== 'nom');
    }

    return $details;
}

/** Transforme un libellé en identifiant URL : "Huile d'Argan" -> "huile-d-argan". */
function slugify(string $value): string
{
    $ascii = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value);
    $ascii = $ascii === false ? $value : $ascii;
    $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $ascii) ?? '');
    return trim($slug, '-');
}

/** Pages dont les blocs de contenu sont éditables depuis l'admin. */
function content_pages(): array
{
    return [
        'accueil', 'boutique', 'histoire', 'fondatrice', 'vision', 'engagements', 'valeurs',
        'nos-produits', 'gamme', 'types', 'vos-besoins', 'expertise', 'vlogs',
        'contact', 'localisation', 'distributeurs', 'produit', 'global',
    ];
}

set_exception_handler(function (Throwable $e): void {
    error_log($e->getMessage() . "\n" . $e->getTraceAsString());
    json_error('internal_error', 500);
});
