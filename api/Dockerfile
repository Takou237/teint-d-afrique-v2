FROM php:8.2-apache

# Activer l'écriture d'URL Apache
RUN a2enmod rewrite

# Extensions PHP : MySQL + GD (réencodage des images de la médiathèque)
RUN docker-php-ext-install pdo pdo_mysql mysqli gd

COPY . /var/www/html/
RUN chown -R www-data:www-data /var/www/html
EXPOSE 80
