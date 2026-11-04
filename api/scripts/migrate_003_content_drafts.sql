-- Teint d'Afrique Cosmétiques — migration 003 : brouillons de contenu
-- À exécuter sur une base déjà installée :
--   mysql -u root teint_afrique_cms < api/scripts/migrate_003_content_drafts.sql
-- Script idempotent : il peut être rejoué sans risque.

USE teint_afrique_cms;

-- Modifications en attente de publication. Même forme que `page_content` :
-- une ligne ici signifie « ce bloc a été modifié mais n'est pas encore en ligne ».
CREATE TABLE IF NOT EXISTS content_drafts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page VARCHAR(50) NOT NULL,
  block_key VARCHAR(100) NOT NULL,
  block_type ENUM('text', 'richtext', 'image') NOT NULL DEFAULT 'text',
  value_fr MEDIUMTEXT NOT NULL,
  value_en MEDIUMTEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_draft_block (page, block_key)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
