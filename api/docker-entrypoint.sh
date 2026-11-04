#!/bin/sh
set -e

PORT="${PORT:-80}"

sed -ri "s/^Listen 80$/Listen ${PORT}/" /etc/apache2/ports.conf
sed -ri "s/:80>/:${PORT}>/g" /etc/apache2/sites-available/*.conf

php artisan migrate --force
php artisan teint:seed

chown -R www-data:www-data storage bootstrap/cache public/uploads

exec apache2-foreground
