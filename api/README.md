# Teint d'Afrique API

API back-office du site Teint d'Afrique, réécrite en **Laravel 12** à partir de
l'ancienne API PHP native. Le contrat HTTP est conservé : mêmes URLs, mêmes
noms de champs JSON, même cookie de session (`tda_admin_session`) et même base
MySQL (`teint_afrique_cms`).

Le front React (Vite) n'a pas été modifié et continue d'appeler les URLs
`/api/*.php`.

## Stack

- PHP 8.2+ / Laravel 12
- MySQL 8 (utf8mb4)
- Sessions fichier + CSRF par en-tête `X-CSRF-Token`
- Aucune dépendance JavaScript dans ce dossier

## Démarrage local

```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
```

Configurer ensuite la base dans `.env` :

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=teint_afrique_cms
DB_USERNAME=root
DB_PASSWORD=
```

Créer le schéma puis les données de départ :

```bash
php artisan migrate
php artisan teint:seed
```

Si aucun administrateur n'existe, le seed crée
`admin@teintdafrique.com` avec le mot de passe `TeintAdmin2026!`. Définir
`ADMIN_EMAIL` / `ADMIN_PASSWORD` avant le premier seed en production, puis
changer ce mot de passe après la première connexion.

Lancer l'API sur le port attendu par le proxy Vite :

```bash
php artisan serve --host=127.0.0.1 --port=8080
```

Le front tourne séparément (`npm run dev`, port 3115) et proxifie `/api` et
`/uploads` vers `http://127.0.0.1:8080` (`VITE_API_PROXY`).

### Ancien fichier `config.php`

L'ancien format de configuration reste supporté. Copier
`config.php.example` vers `config.php` (fichier ignoré par git) pour définir la
base, le cookie de session, le CORS, l'URL publique et le mail. Les valeurs
absentes de `config.php` sont lues depuis `.env`.

Noms de variables historiques également acceptés : `DB_NAME`, `DB_USER`,
`DB_PASS`, `SESSION_NAME`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`,
`MAIL_NOTIFY_TO`.

## Commandes utiles

```bash
php artisan migrate                 # crée les tables si nécessaire
php artisan teint:seed             # insère les données si elles sont absentes
php artisan teint:seed --force     # réinsère les données de seed
php artisan route:list --path=api  # vérifie les routes
php artisan test                   # tests de compatibilité (voir ci-dessous)
```

## Tests

Les tests utilisent une base MySQL dédiée, `teint_afrique_cms_test` :

```bash
mysql -uroot -e "CREATE DATABASE IF NOT EXISTS teint_afrique_cms_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
cd api
php artisan test
```

`phpunit.xml` force cette base et `LegacyConfigServiceProvider` est désactivé
en environnement `testing`, donc les données locales ne sont jamais touchées.
La suite couvre l'authentification, le CSRF, les erreurs 404/405, les réponses
`{success,data}`, les CRUD gammes/admins/contenus/contacts et les réglages.

## Contrat API

- Succès : `{"success":true,"data":...}`
- Erreur : `{"success":false,"error":"code"}`
- Les opérations sans résultat renvoient `200` avec `data: null` (l'ancienne
  API renvoyait parfois `204`).
- Codes utilisés : `400` JSON invalide, `401` non authentifié/identifiants,
  `403` CSRF, `404` introuvable, `405` méthode, `409` conflit, `410` jeton de
  réinitialisation invalide, `422` validation, `429` trop de tentatives,
  `500` erreur interne, `503` mail indisponible.

### Authentification

- `GET  /api/auth/session.php`
- `POST /api/auth/login.php`
- `POST /api/auth/logout.php`
- `POST /api/auth/password.php`
- `POST /api/auth/request-reset.php`
- `POST /api/auth/reset.php`

Le login renvoie `email` et `csrfToken`. Les écritures protégées exigent le
cookie de session et l'en-tête `X-CSRF-Token`.

### Ressources

```text
GET  /api/admins/list.php
POST /api/admins/create.php
POST /api/admins/delete.php

GET  /api/gammes/list.php
GET  /api/gammes/get.php?id=...
POST /api/gammes/create.php
POST /api/gammes/update.php
POST /api/gammes/delete.php
POST /api/gammes/reorder.php

POST /api/produits/create.php
POST /api/produits/update.php
POST /api/produits/delete.php
POST /api/produits/reorder.php

GET  /api/content/list.php?page=...&lang=fr|en
GET  /api/content/drafts.php
POST /api/content/update.php
POST /api/content/publish.php
POST /api/content/discard.php
POST /api/content/delete.php

POST /api/contact/submit.php
GET  /api/contact/list.php
POST /api/contact/manage.php

GET  /api/settings/list.php
POST /api/settings/update.php

GET  /api/media/list.php
POST /api/media/upload.php
POST /api/media/update.php
POST /api/media/delete.php
```

Les médias sont stockés dans `public/uploads` et servis sous `/uploads/...`.

## Déploiement

Le dossier contient un `Dockerfile` (Apache + PHP 8.2) et un `railway.toml`.
Le build doit être lancé avec `api` comme contexte/racine du service.

Variables minimales en production :

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:...
APP_URL=https://api.example.com
DB_HOST=...
DB_PORT=3306
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...
SESSION_DRIVER=file
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=none   # si le front et l'API sont sur des domaines differents
MAIL_MAILER=smtp
MAIL_HOST=...
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_FROM_ADDRESS=contact@teintdafrique.com
CORS_ORIGINS=https://teintdafrique.com,https://www.teintdafrique.com
```

Au démarrage, `docker-entrypoint.sh` écoute sur `$PORT` (80 par défaut),
exécute `php artisan migrate --force` puis `php artisan teint:seed`, et lance
Apache. `railway.toml` appelle ce script.

Points d'attention :

- `public/uploads` doit être un volume persistant, sinon les images sont
  perdues à chaque redéploiement.
- Avec plusieurs instances, utiliser un `SESSION_DRIVER` partagé (base/redis)
  pour que les cookies de session fonctionnent sur toutes les instances.
- Servir le site en HTTPS et définir `SESSION_SECURE_COOKIE=true` (et
  `SESSION_SAME_SITE=none` si nécessaire pour le CORS cross-site).

## Structure

```text
app/Http/Controllers/Api/   endpoints
app/Http/Middleware/        authentification et CSRF
app/Support/                réponses JSON, validation, transformations
app/Services/Mailer.php     notifications et reset de mot de passe
routes/web.php              URLs compatibles avec l'ancienne API
database/migrations/        schéma identique à l'ancienne base
database/seeders/           données de départ
public/uploads/             médias
tests/Feature/              tests de compatibilité HTTP
```
