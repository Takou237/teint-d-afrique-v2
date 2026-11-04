<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $statements = [
            'CREATE TABLE IF NOT EXISTS admin_users (
              id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              email VARCHAR(190) NOT NULL UNIQUE,
              password_hash VARCHAR(255) NOT NULL,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              last_login_at DATETIME NULL
            ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',

            'CREATE TABLE IF NOT EXISTS login_attempts (
              id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              email VARCHAR(190) NOT NULL,
              success TINYINT(1) NOT NULL,
              attempted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              INDEX idx_login_attempts_email_time (email, attempted_at)
            ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',

            'CREATE TABLE IF NOT EXISTS password_resets (
              id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              admin_id INT UNSIGNED NOT NULL,
              token_hash CHAR(64) NOT NULL,
              expires_at DATETIME NOT NULL,
              used_at DATETIME NULL,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              UNIQUE KEY uniq_password_resets_token (token_hash),
              INDEX idx_password_resets_admin (admin_id, created_at),
              CONSTRAINT fk_password_resets_admin FOREIGN KEY (admin_id) REFERENCES admin_users (id) ON DELETE CASCADE
            ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',

            'CREATE TABLE IF NOT EXISTS media (
              id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              filename VARCHAR(255) NOT NULL,
              original_name VARCHAR(255) NOT NULL,
              mime_type VARCHAR(100) NOT NULL,
              size_bytes INT UNSIGNED NOT NULL,
              alt_text VARCHAR(255) NOT NULL DEFAULT \'\',
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',

            'CREATE TABLE IF NOT EXISTS gammes (
              id VARCHAR(32) PRIMARY KEY,
              nom JSON NOT NULL,
              tagline JSON NOT NULL,
              ingredients JSON NOT NULL,
              description JSON NOT NULL,
              ingredients_detail JSON NOT NULL,
              hero_lead JSON NOT NULL,
              hero_accent JSON NOT NULL,
              hero_copy JSON NOT NULL,
              hero_alt JSON NOT NULL,
              color CHAR(7) NOT NULL,
              color_light CHAR(7) NOT NULL,
              color_dark CHAR(7) NOT NULL,
              image_id INT UNSIGNED NULL,
              main_image_id INT UNSIGNED NULL,
              hero_image_id INT UNSIGNED NULL,
              hero_image_small_id INT UNSIGNED NULL,
              position INT NOT NULL DEFAULT 0,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              CONSTRAINT fk_gammes_image FOREIGN KEY (image_id) REFERENCES media (id) ON DELETE SET NULL,
              CONSTRAINT fk_gammes_main_image FOREIGN KEY (main_image_id) REFERENCES media (id) ON DELETE SET NULL,
              CONSTRAINT fk_gammes_hero_image FOREIGN KEY (hero_image_id) REFERENCES media (id) ON DELETE SET NULL,
              CONSTRAINT fk_gammes_hero_image_small FOREIGN KEY (hero_image_small_id) REFERENCES media (id) ON DELETE SET NULL
            ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',

            'CREATE TABLE IF NOT EXISTS produits (
              id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              gamme_id VARCHAR(32) NOT NULL,
              type JSON NOT NULL,
              poids VARCHAR(50) NOT NULL,
              symbol VARCHAR(10) NOT NULL,
              description JSON NOT NULL,
              details JSON NULL,
              image_id INT UNSIGNED NULL,
              position INT NOT NULL DEFAULT 0,
              CONSTRAINT fk_produits_gamme FOREIGN KEY (gamme_id) REFERENCES gammes (id) ON DELETE CASCADE,
              CONSTRAINT fk_produits_image FOREIGN KEY (image_id) REFERENCES media (id) ON DELETE SET NULL
            ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',

            'CREATE TABLE IF NOT EXISTS page_content (
              id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              page VARCHAR(50) NOT NULL,
              block_key VARCHAR(100) NOT NULL,
              block_type ENUM(\'text\', \'richtext\', \'image\') NOT NULL DEFAULT \'text\',
              value_fr MEDIUMTEXT NOT NULL,
              value_en MEDIUMTEXT NOT NULL,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              UNIQUE KEY uniq_page_block (page, block_key)
            ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',

            'CREATE TABLE IF NOT EXISTS content_drafts (
              id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              page VARCHAR(50) NOT NULL,
              block_key VARCHAR(100) NOT NULL,
              block_type ENUM(\'text\', \'richtext\', \'image\') NOT NULL DEFAULT \'text\',
              value_fr MEDIUMTEXT NOT NULL,
              value_en MEDIUMTEXT NOT NULL,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              UNIQUE KEY uniq_draft_block (page, block_key)
            ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',

            'CREATE TABLE IF NOT EXISTS settings (
              `key` VARCHAR(100) PRIMARY KEY,
              `value` VARCHAR(500) NOT NULL DEFAULT \'\'
            ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',

            'CREATE TABLE IF NOT EXISTS contact_messages (
              id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(190) NOT NULL,
              email VARCHAR(190) NOT NULL,
              phone VARCHAR(50) NOT NULL DEFAULT \'\',
              message TEXT NOT NULL,
              ip_address VARCHAR(45) NOT NULL DEFAULT \'\',
              is_read TINYINT(1) NOT NULL DEFAULT 0,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              INDEX idx_contact_messages_created (created_at DESC)
            ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
        ];

        foreach ($statements as $statement) {
            DB::statement($statement);
        }
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        foreach ([
            'contact_messages',
            'settings',
            'content_drafts',
            'page_content',
            'produits',
            'gammes',
            'media',
            'password_resets',
            'login_attempts',
            'admin_users',
        ] as $table) {
            DB::statement('DROP TABLE IF EXISTS ' . $table);
        }
        Schema::enableForeignKeyConstraints();
    }
};
