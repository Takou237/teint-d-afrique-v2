#!/bin/sh
set -e

echo "==> [Teint d'Afrique API] Initialisation du conteneur..."

# 1. Configurer le port d'ecoute Nginx dynamiquement selon Railway ($PORT)
PORT="${PORT:-8080}"
echo "==> [Teint d'Afrique API] Port d'ecoute Nginx configure sur : ${PORT}"
sed -i "s/listen [0-9]\+;/listen ${PORT};/" /etc/nginx/conf.d/default.conf

# 2. Creer les dossiers de cache, sessions et uploads avec les permissions www-data
mkdir -p /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/views \
         /var/www/html/storage/framework/cache/data \
         /var/www/html/storage/logs \
         /var/www/html/bootstrap/cache \
         /var/www/html/public/uploads

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/uploads
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/uploads

# 3. Verifier la presence de APP_KEY
if [ -z "$APP_KEY" ]; then
    echo "==> [Teint d'Afrique API] [ATTENTION] APP_KEY manquante, generation d'une cle temporaire..."
    export APP_KEY=$(php artisan key:generate --show)
fi

# 4. Executer les migrations et le seed initial (compte admin par defaut)
echo "==> [Teint d'Afrique API] Execution des migrations..."
php artisan migrate --force || echo "==> [Teint d'Afrique API] [WARN] Les migrations n'ont pas pu s'executer (verifiez la connexion MySQL)."

echo "==> [Teint d'Afrique API] Execution du seed initial..."
php artisan teint:seed || echo "==> [Teint d'Afrique API] [WARN] Le seed n'a pas pu s'executer."

# 5. Lancer php-fpm en arriere-plan
echo "==> [Teint d'Afrique API] Demarrage de php-fpm..."
php-fpm -D

sleep 1

# 6. Demarrer nginx au premier plan
echo "==> [Teint d'Afrique API] Demarrage de Nginx..."
exec nginx -g "daemon off;"
