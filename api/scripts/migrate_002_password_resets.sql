-- Teint d'Afrique Cosmétiques — migration 002 : réinitialisation du mot de passe
-- À exécuter sur une base déjà installée (phpMyAdmin > Importer, ou mysql en CLI) :
--   mysql -u root teint_afrique_cms < api/scripts/migrate_002_password_resets.sql
-- Le script est idempotent : il peut être rejoué sans risque.

USE teint_afrique_cms;

-- Jetons de réinitialisation. Seul le SHA-256 du jeton est stocké : une fuite de la
-- base ne permet donc pas de réinitialiser un compte.
CREATE TABLE IF NOT EXISTS password_resets (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id INT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_password_resets_token (token_hash),
  INDEX idx_password_resets_admin (admin_id, created_at),
  CONSTRAINT fk_password_resets_admin FOREIGN KEY (admin_id) REFERENCES admin_users (id) ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
