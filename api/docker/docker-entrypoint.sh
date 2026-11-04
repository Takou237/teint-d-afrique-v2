#!/bin/sh
set -e

echo "==> [Teint d'Afrique API] Initialisation du conteneur..."

# 1. Configurer le port d'ecoute Nginx dynamiquement selon Railway ($PORT)
PORT="${PORT:-8080}"
echo "==> [Teint d'Afrique API] Port d'ecoute Nginx configure sur : ${PORT}"
sed -i "s/listen [0-9]\+;/listen ${PORT};/" /etc/nginx/conf.d/default.conf

# 2. Creer les dossiers de cache, sessions et uploads
mkdir -p /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/views \
         /var/www/html/storage/framework/cache/data \
         /var/www/html/storage/logs \
         /var/www/html/bootstrap/cache \
         /var/www/html/public/uploads

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/uploads
chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/uploads

# 3. Generer le fichier .env a partir des variables Railway pour garantir leur disponibilite
echo "==> [Teint d'Afrique API] Synchronisation des variables d'environnement..."

TARGET_KEY="${APP_KEY}"
if [ -z "$TARGET_KEY" ]; then
    echo "==> [Teint d'Afrique API] Generation d'une cle APP_KEY..."
    TARGET_KEY=$(php artisan key:generate --show)
fi

DB_HOST_FINAL="${DB_HOST:-${MYSQLHOST:-127.0.0.1}}"
DB_PORT_FINAL="${DB_PORT:-${MYSQLPORT:-3306}}"
DB_DATABASE_FINAL="${DB_DATABASE:-${DB_NAME:-${MYSQLDATABASE:-teint_afrique_cms}}}"
DB_USERNAME_FINAL="${DB_USERNAME:-${DB_USER:-${MYSQLUSER:-root}}}"
DB_PASSWORD_FINAL="${DB_PASSWORD:-${DB_PASS:-${MYSQLPASSWORD:-}}}"

cat <<EOF > /var/www/html/.env
APP_NAME="${APP_NAME:-Teint d'Afrique API}"
APP_ENV="${APP_ENV:-production}"
APP_KEY="${TARGET_KEY}"
APP_DEBUG="${APP_DEBUG:-false}"
APP_URL="${APP_URL:-https://teintdafrique.com}"
LOG_CHANNEL="${LOG_CHANNEL:-stderr}"

DB_CONNECTION="${DB_CONNECTION:-mysql}"
DB_HOST="${DB_HOST_FINAL}"
DB_PORT="${DB_PORT_FINAL}"
DB_DATABASE="${DB_DATABASE_FINAL}"
DB_USERNAME="${DB_USERNAME_FINAL}"
DB_PASSWORD="${DB_PASSWORD_FINAL}"

SESSION_DRIVER="${SESSION_DRIVER:-database}"
SESSION_LIFETIME="${SESSION_LIFETIME:-120}"
SESSION_SAME_SITE="${SESSION_SAME_SITE:-none}"
SESSION_SECURE_COOKIE="${SESSION_SECURE_COOKIE:-true}"

ADMIN_EMAIL="${ADMIN_EMAIL:-admin@teintdafrique.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-TeintAdmin2026!}"

CORS_ORIGINS="${CORS_ORIGINS:-}"
EOF

chown www-data:www-data /var/www/html/.env
chmod 664 /var/www/html/.env

# 4. Executer les migrations et le seed initial (compte admin par defaut)
echo "==> [Teint d'Afrique API] Execution des migrations..."
php artisan migrate --force || echo "==> [Teint d'Afrique API] [WARN] Les migrations n'ont pas pu s'executer."

echo "==> [Teint d'Afrique API] Execution du seed initial..."
php artisan teint:seed || echo "==> [Teint d'Afrique API] [WARN] Le seed n'a pas pu s'executer."

# 5. Lancer php-fpm en arriere-plan
echo "==> [Teint d'Afrique API] Demarrage de php-fpm..."
php-fpm -D

sleep 1

# 6. Demarrer nginx au premier plan
echo "==> [Teint d'Afrique API] Demarrage de Nginx..."
exec nginx -g "daemon off;"
