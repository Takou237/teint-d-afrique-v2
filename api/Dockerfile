FROM php:8.2-fpm

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libwebp-dev \
        libonig-dev \
        unzip \
        nginx \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" pdo pdo_mysql mysqli gd mbstring \
    && rm -rf /var/lib/apt/lists/*

RUN printf "upload_max_filesize=10M\npost_max_size=12M\nmax_file_uploads=5\n" > /usr/local/etc/php/conf.d/uploads.ini

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . /var/www/html

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

RUN mkdir -p /var/www/html/storage/framework/sessions \
             /var/www/html/storage/framework/views \
             /var/www/html/storage/framework/cache/data \
             /var/www/html/storage/logs \
             /var/www/html/bootstrap/cache \
             /var/www/html/public/uploads \
             /usr/local/etc/php-fpm.d \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/uploads

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/www.conf /usr/local/etc/php-fpm.d/www.conf
COPY docker/docker-entrypoint.sh /var/www/html/docker/docker-entrypoint.sh
RUN chmod +x /var/www/html/docker/docker-entrypoint.sh /var/www/html/docker-entrypoint.sh 2>/dev/null || true

EXPOSE 8080

CMD ["sh", "/var/www/html/docker/docker-entrypoint.sh"]
