# API — Teint d'Afrique Cosmétiques

Backend PHP + MySQL du site et du panneau d'administration (API en PHP natif, sans framework ni Composer), pensé pour un hébergement mutualisé sans Node.js ni accès SSH.

## Démarrage local

Prérequis : PHP 8+ avec les extensions `pdo_mysql` et `gd`, et un serveur MySQL/MariaDB (le projet a été mis en place avec XAMPP/Laragon).

```bash
# 1. Créer la base et les tables
mysql -u root < api/scripts/migrate.sql

#    Base déjà installée avant la migration 002 (réinitialisation du mot de passe) :
mysql -u root teint_afrique_cms < api/scripts/migrate_002_password_resets.sql
#    puis migration 003 (brouillons de contenu) :
mysql -u root teint_afrique_cms < api/scripts/migrate_003_content_drafts.sql

# 2. Copier la config et l'adapter si besoin
cp api/config.php.example api/config.php

# 3. Peupler le contenu initial (gammes, produits, réglages, blocs de contenu)
#    et créer le premier compte admin s'il n'en existe aucun.
#    ADMIN_EMAIL / ADMIN_PASSWORD permettent de choisir les identifiants.
php api/scripts/seed.php            # ajoute ce qui manque
php api/scripts/seed.php --force    # réécrit les textes des gammes et leurs produits

# 4. Lancer un serveur PHP de développement
php -S localhost:8000 -t api
```

`api/config.php` n'est jamais commité (voir `.gitignore`) : chaque environnement a le sien.

## Format des réponses

```json
{ "success": true, "data": ... }
{ "success": false, "error": "code_erreur" }
```

Codes HTTP : `200` OK, `201` créé, `204` supprimé / préflight CORS, `400` requête invalide, `401` non authentifié, `403` CSRF invalide, `404` introuvable, `405` méthode non autorisée, `409` conflit (média encore utilisé, dernière gamme, compte protégé…), `410` jeton de réinitialisation expiré ou déjà utilisé, `422` validation échouée, `429` trop de tentatives, `500` erreur interne (aucun détail technique renvoyé au client, voir les logs serveur), `503` email non envoyé (`email_failed`).

## Authentification

- Session PHP côté serveur (cookie `HttpOnly`, `SameSite` configurable), pas de JWT.
- Après connexion, un jeton CSRF est renvoyé une fois et doit être rejoué dans le header `X-CSRF-Token` sur **toute** requête de modification (`POST`).
- `GET /api/auth/session.php` vérifie si une session est active et renvoie le jeton CSRF au chargement de l'admin.
- Quand l'API répond `unauthorized`, le client admin considère la session expirée et réaffiche l'écran de connexion.

| Méthode | URL | Auth | Body | Réponse |
|---|---|---|---|---|
| POST | `/api/auth/login.php` | non | `{email, password}` | `{email, csrfToken}` |
| POST | `/api/auth/logout.php` | oui | — | `null` |
| GET | `/api/auth/session.php` | non | — | `{authenticated, email?, csrfToken?}` |
| POST | `/api/auth/password.php` | admin + CSRF | `{currentPassword, newPassword}` | `{updated: true}` |
| POST | `/api/auth/request-reset.php` | non | `{email}` | `{sent: true}` |
| POST | `/api/auth/reset.php` | non (jeton) | `{token, password}` | `{reset: true}` |

`newPassword` doit contenir **au moins 12 caractères** et être différent du mot de passe actuel (`weak_password`, `password_unchanged`, `invalid_current_password`). Le changement régénère l'identifiant de session et efface les échecs de connexion mémorisés pour l'e-mail.

### Mot de passe oublié

1. `request-reset.php` crée un jeton aléatoire de 32 octets (seul son SHA-256 est stocké dans `password_resets`), valable **1 heure**, et l'envoie par email avec le lien `<APP_URL>/admin?reset=<jeton>`.
2. La réponse est identique (`{sent: true}`) lorsque l'adresse est inconnue : impossible de savoir si un compte existe. Limite : 3 demandes par compte et par quart d'heure.
3. Si l'adresse correspond à un compte mais que l'email ne part pas, la route répond `503 email_failed` (configuration `mail` à vérifier dans `api/config.php`).
4. `reset.php` applique le mot de passe, marque le jeton comme utilisé et invalide les autres jetons du compte (`invalid_token`, HTTP 410, si le lien est expiré ou déjà servi).

L'écran `ResetPasswordPage` du panneau lit directement `?reset=` dans l'URL, puis retire le paramètre après usage.

## Comptes administrateurs

| Méthode | URL | Auth | Body | Réponse |
|---|---|---|---|---|
| GET | `/api/admins/list.php` | admin | — | `{id, email, createdAt, lastLoginAt, isSelf}[]` |
| POST | `/api/admins/create.php` | admin + CSRF | `{email, password}` | `{id, email}` (201) |
| POST | `/api/admins/delete.php` | admin + CSRF | `{id}` | `null` (204) |

- `password` : 12 caractères minimum (`weak_password`), 200 maximum.
- `create.php` refuse une adresse déjà utilisée (`409 email_already_used`).
- `delete.php` refuse de supprimer son propre compte (`409 cannot_delete_self`) et le dernier compte restant (`409 last_admin`).
- Il n'y a pas de rôles : tout compte administrateur a les mêmes droits.

## Gammes (lecture publique, écriture admin)

| Méthode | URL | Auth | Body | Réponse |
|---|---|---|---|---|
| GET | `/api/gammes/list.php` | non | — | tableau de gammes avec leurs `products` |
| GET | `/api/gammes/get.php?id=eclat` | non | — | une gamme |
| POST | `/api/gammes/update.php` | admin + CSRF | `{id, ...champs}` | la gamme à jour |
| POST | `/api/gammes/create.php` | admin + CSRF | `{nom, tagline?, ingredients?, description?, ingredientsDetail?, heroLead?, heroAccent?, heroCopy?, heroAlt?}` | la gamme créée (201) |
| POST | `/api/gammes/delete.php` | admin + CSRF | `{id}` | `null` (204) |
| POST | `/api/gammes/reorder.php` | admin + CSRF | `{order: [ids...]}` | toutes les gammes réordonnées |

- Les champs localisés sont des objets `{"fr": "...", "en": "..."}` ; `nom` est obligatoire dans les deux langues.
- Champs modifiables via `update.php` : `nom`, `tagline`, `ingredients`, `description`, `ingredientsDetail`, `heroLead`, `heroAccent`, `heroCopy`, `heroAlt`, `color`, `colorLight`, `colorDark` (format `#RRGGBB`), `imageId`, `mainImageId`, `heroImageId`, `heroImageSmallId` (id d'un média existant, ou `null`).
- À la création, l'`id` est dérivé du nom français (`slugify`) : `gamme_already_exists` renvoyé si le slug est déjà pris.
- La suppression est refusée avec `409 last_gamme` s'il ne reste qu'une gamme, et supprime en cascade ses produits.

Forme d'une gamme :

```json
{
  "id": "eclat",
  "nom": { "fr": "ÉCLAT NATUREL", "en": "NATURAL RADIANCE" },
  "tagline": { "fr": "...", "en": "..." },
  "ingredients": { "fr": "Curcuma & Carotte", "en": "Turmeric & Carrot" },
  "description": { "fr": "...", "en": "..." },
  "ingredientsDetail": { "fr": "...", "en": "..." },
  "heroLead": { "fr": "...", "en": "..." },
  "heroAccent": { "fr": "...", "en": "..." },
  "heroCopy": { "fr": "...", "en": "..." },
  "heroAlt": { "fr": "...", "en": "..." },
  "color": "#C9971A",
  "colorLight": "#FDF4DA",
  "colorDark": "#7A5600",
  "imageId": null, "image": null,
  "mainImageId": null, "mainImage": null,
  "heroImageId": null, "heroImage": null,
  "heroImageSmallId": null, "heroImageSmall": null,
  "position": 0,
  "products": [
    { "id": 1, "type": { "fr": "Savon", "en": "Soap" }, "poids": "180 g", "symbol": "◼", "description": { "fr": "...", "en": "..." }, "details": null, "imageId": null, "image": null, "position": 0 }
  ]
}
```

Les URL d'images valent `null` tant qu'aucune photo n'est associée. Les produits sont triés par `position` croissante.

## Produits (écriture admin — la lecture passe par les gammes)

| Méthode | URL | Auth | Body | Réponse |
|---|---|---|---|---|
| POST | `/api/produits/create.php` | admin + CSRF | `{gammeId, type, poids?, symbol?, description, details?, imageId?}` | produit créé (201) |
| POST | `/api/produits/update.php` | admin + CSRF | `{id, type?, poids?, symbol?, description?, details?, imageId?}` | produit à jour |
| POST | `/api/produits/delete.php` | admin + CSRF | `{id}` | `null` (204) |
| POST | `/api/produits/reorder.php` | admin + CSRF | `{gammeId, order: [ids...]}` | la gamme réordonnée |

`details` reprend la forme `ProductDetails` du front (`nom`, `promesses`, `actifs`, `proprietes`, `ingredients`, `modeEmploi`, `precautions`) ou `null` pour un produit sans fiche détaillée. Le nouveau produit est placé en fin de liste.

## Contenu de pages (lecture publique, écriture admin)

| Méthode | URL | Auth | Body | Réponse |
|---|---|---|---|---|
| GET | `/api/content/list.php?page=accueil&lang=fr` | non | — | tableau de blocs **publiés** |
| GET | `/api/content/drafts.php?page=accueil` | admin | — | tableau de blocs en **brouillon** |
| POST | `/api/content/update.php` | admin + CSRF | `{page, blockKey, blockType, valueFr, valueEn}` | le brouillon enregistré |
| POST | `/api/content/publish.php` | admin + CSRF | `{page}` | `{published: n}` |
| POST | `/api/content/discard.php` | admin + CSRF | `{page, blockKey}` | `null` (204) |
| POST | `/api/content/delete.php` | admin + CSRF | `{page, blockKey}` | `null` (204) |

### Brouillon puis publication

`update.php` n'écrit **plus** dans `page_content` : il enregistre le bloc dans `content_drafts`. Le site public continue donc d'afficher la version en ligne jusqu'à l'appel de `publish.php`, qui recopie tous les brouillons de la page dans `page_content` (transaction) puis les supprime. `nothing_to_publish` (422) si la page n'a rien en attente.

`discard.php` abandonne le brouillon d'un bloc : le contenu publié redevient la référence. `delete.php` supprime le bloc publié **et** son brouillon ; la suppression est immédiate et ne passe pas par un brouillon (un bloc qui n'existe qu'en brouillon est simplement retiré de la file).

- Pages acceptées : `accueil`, `boutique`, `histoire`, `fondatrice`, `vision`, `engagements`, `valeurs`, `nos-produits`, `gamme`, `types`, `vos-besoins`, `expertise`, `vlogs`, `contact`, `localisation`, `distributeurs`, `produit`, `global`.
- `blockKey` doit matcher `^[a-z0-9_-]{1,100}$` (insensible à la casse). `update.php` crée le bloc s'il n'existe pas, sinon il le met à jour (y compris son `blockType`).
- `blockType` : `text` (texte simple, balises retirées), `richtext` (HTML filtré : `<p> <strong> <em> <br> <ul> <li> <a>` uniquement, liens `http(s)`/`mailto`), `image`.
- Pour un bloc `image`, `valueFr` / `valueEn` contiennent l'**id d'un média** (ou une chaîne vide). `list.php` renvoie en plus `imageIdFr`, `imageIdEn`, `imageUrlFr`, `imageUrlEn` et la valeur dans la langue demandée.
- `delete.php` supprime le bloc : le site réaffiche alors son texte ou son image de repli.
- Une image référencée uniquement par un brouillon est protégée de la suppression (`media_in_use`).

## Messages de contact

| Méthode | URL | Auth | Body | Réponse |
|---|---|---|---|---|
| POST | `/api/contact/submit.php` | **public** | `{name, email, phone?, message}` | `{id}` (201) |
| GET | `/api/contact/list.php` | admin | `?q=&filter=all\|unread&page=1&perPage=20` | `{items, total, page, perPage, unread}` |
| POST | `/api/contact/manage.php` | admin + CSRF | `{id, isRead}` ou `{id, delete: true}` | `{id, isRead}` / `null` |

`submit.php` est le seul endpoint public d'écriture : limité à **5 messages par IP et par tranche de 10 minutes** (`429 too_many_messages` au-delà), champs validés et nettoyés.

Chaque message inséré déclenche une **notification email** au responsable du site (adresse du réglage `email`, ou `MAIL_NOTIFY_TO`). Un échec d'envoi est journalisé mais ne fait pas échouer la requête : le message reste visible dans le panneau.

`list.php` accepte aussi la recherche (`q` porte sur le nom, l'email, le téléphone et le contenu) et le filtre `unread`. `total` compte les résultats filtrés, `unread` les non-lus de toute la base (badge du panneau), `perPage` est plafonné à 50.

## Réglages — identité, coordonnées, réseaux sociaux

| Méthode | URL | Auth | Body | Réponse |
|---|---|---|---|---|
| GET | `/api/settings/list.php` | non | — | carte `{clé: valeur}` de tous les réglages |
| POST | `/api/settings/update.php` | admin + CSRF | `{key, value}` ou `{clé: valeur, ...}` | tous les réglages à jour |

Clés éditables (toute autre clé est refusée avec `invalid_setting_key`) :

`site_name`, `tagline_fr`, `tagline_en`, `email`, `phone`, `whatsapp_number`, `address_fr`, `address_en`, `hours_fr`, `hours_en`, `instagram_url`, `facebook_url`, `tiktok_url`, `youtube_url`.

Validation : email valide (`invalid_email`), URL absolue `http(s)` pour les réseaux sociaux (`invalid_url`), `whatsapp_number` composé de 6 à 15 chiffres (`invalid_whatsapp_number`), 500 caractères maximum par valeur (`setting_value_too_long`).

## Médiathèque (admin uniquement)

| Méthode | URL | Auth | Body | Réponse |
|---|---|---|---|---|
| GET | `/api/media/list.php` | admin | `?q=&page=1&perPage=24` | `{items, total, page, perPage}` |
| POST | `/api/media/upload.php` | admin + CSRF | `multipart/form-data` : `file` (≤ 5 Mo, jpeg/png/webp/gif) + `altText` optionnel | `{id, url, ...}` (201) |
| POST | `/api/media/update.php` | admin + CSRF | `{id, altText}` | `{id, altText}` |
| POST | `/api/media/delete.php` | admin + CSRF | `{id}` | `null` (204) |

`q` porte sur le nom du fichier et le texte alternatif ; `perPage` est plafonné à 100. `update.php` permet de corriger le texte alternatif d'une image déjà en ligne sans la re-téléverser (255 caractères maximum, `alt_text_too_long`).

Les images sont réencodées côté serveur (adieu métadonnées EXIF et payloads cachés) et stockées sous un nom aléatoire dans `api/uploads/`.

La suppression est refusée avec `409 media_in_use` tant que l'image est référencée par une gamme (4 emplacements), un produit ou un bloc de page — il faut d'abord la retirer de son emplacement.

## Emails (notifications et mot de passe oublié)

`api/lib/mailer.php` envoie les emails sans dépendance (pas de Composer, pas de PHPMailer) :

- transport `smtp` (recommandé) : client SMTP natif, STARTTLS (`587`), SSL (`465`) ou sans chiffrement (`25`), AUTH LOGIN ;
- transport `mail` : fonction `mail()` du serveur, utile quand l'hébergeur la gère correctement.

Configuration dans le bloc `mail` de `api/config.php` (voir `config.php.example`) ou via les variables d'environnement `MAIL_TRANSPORT`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_ENCRYPTION`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`, `MAIL_FROM_NAME`, `MAIL_NOTIFY_TO`. `APP_URL` (ou `app_url` dans la config) doit pointer vers l'origine du site pour que les liens de réinitialisation soient corrects.

L'adresse `MAIL_FROM` doit appartenir au domaine du site, sinon les messages partent en spam. Les deux emails envoyés sont : la notification d'un nouveau message de contact (avec `Reply-To` du visiteur) et le lien de réinitialisation (valable 1 heure).

Échec d'envoi : journalisé dans les logs PHP (`error_log`), jamais renvoyé au visiteur sous forme de trace.

## Sécurité — ce qui est en place

- Requêtes préparées PDO partout (aucune concaténation SQL).
- Mots de passe admin hashés (`password_hash` / `password_verify`), rehash automatique.
- Verrou anti brute-force : 5 échecs par e-mail et par tranche de 5 minutes (table `login_attempts`).
- Jetons de réinitialisation stockés uniquement hachés (SHA-256), usage unique, expiration 1 heure, 3 demandes par quart d'heure.
- CSRF obligatoire sur toutes les routes de modification.
- CORS restreint aux origines listées dans la configuration (pas de wildcard avec cookies).
- Upload : type MIME réel vérifié (pas l'extension), taille limitée, réencodage systématique, nom aléatoire.
- Nettoyage systématique des entrées (`strip_tags`) et liste blanche de balises pour le `richtext`.
- Aucune trace d'erreur PHP renvoyée au client (`display_errors` désactivé, journalisation serveur).
