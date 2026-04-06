-- =============================================================
-- FILE: 012_sub_categories.sql
-- Bereket Fide — sub_categories + sub_category_i18n tabloları (şema only)
-- Eski Vista/soğutma omurgasına ait toplu INSERT'ler kaldırıldı.
-- Kategori verisi: 300_bereketfide_categories.seed.sql (module_key bereketfide).
-- Alt kategori içeriği gerektiğinde ayrı seed veya admin üzerinden eklenir.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

CREATE TABLE IF NOT EXISTS `sub_categories` (
  `id`               CHAR(36)      NOT NULL,
  `category_id`      CHAR(36)      NOT NULL,

  `image_url`        VARCHAR(1024) NULL,
  `storage_asset_id` CHAR(36)      NULL,

  `alt`              VARCHAR(255)  NULL,
  `icon`             VARCHAR(255)  NULL,

  `is_active`        TINYINT(1)    NOT NULL DEFAULT 1,
  `is_featured`      TINYINT(1)    NOT NULL DEFAULT 0,
  `display_order`    INT           NOT NULL DEFAULT 0,

  `created_at`       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_sub_categories_category_id` (`category_id`),
  KEY `idx_sub_categories_active_order` (`is_active`, `display_order`),

  CONSTRAINT `fk_sub_categories_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sub_category_i18n` (
  `sub_category_id` CHAR(36)      NOT NULL,
  `locale`          VARCHAR(10)   NOT NULL,

  `name`            VARCHAR(255)  NOT NULL,
  `slug`            VARCHAR(255)  NOT NULL,
  `description`     TEXT          NULL,
  `alt`             VARCHAR(255)  NULL,

  `created_at`      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`sub_category_id`, `locale`),
  UNIQUE KEY `uq_sub_category_i18n_locale_slug` (`locale`, `slug`),
  KEY `idx_sub_category_i18n_locale` (`locale`),

  CONSTRAINT `fk_sub_category_i18n_sub_category`
    FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
