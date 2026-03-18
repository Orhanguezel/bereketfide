-- ============================================================
-- 240_services_schema.sql
-- Bereket Fide hizmet modülü
-- ============================================================

CREATE TABLE IF NOT EXISTS `services` (
  `id`                CHAR(36)      NOT NULL,
  `module_key`        VARCHAR(50)   NOT NULL DEFAULT 'bereketfide',
  `category_id`       CHAR(36)      NULL,

  `is_active`         TINYINT       NOT NULL DEFAULT 1,
  `is_featured`       TINYINT       NOT NULL DEFAULT 0,
  `display_order`     INT           NOT NULL DEFAULT 0,

  `image_url`         LONGTEXT      NULL,
  `storage_asset_id`  CHAR(36)      NULL,

  `created_at`        DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`        DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  INDEX `services_module_key_idx`  (`module_key`),
  INDEX `services_active_idx`      (`is_active`),
  INDEX `services_featured_idx`    (`is_featured`),
  INDEX `services_order_idx`       (`display_order`),
  INDEX `services_category_idx`    (`category_id`),
  INDEX `services_asset_idx`       (`storage_asset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `services_i18n` (
  `service_id`        CHAR(36)     NOT NULL,
  `locale`            VARCHAR(8)   NOT NULL DEFAULT 'tr',

  `title`             VARCHAR(255) NOT NULL,
  `slug`              VARCHAR(255) NOT NULL,

  `description`       TEXT         NULL,
  `content`           LONGTEXT     NULL,
  `alt`               VARCHAR(255) NULL,

  `tags`              JSON         DEFAULT (JSON_ARRAY()),

  `meta_title`        VARCHAR(255) NULL,
  `meta_description`  VARCHAR(500) NULL,

  `created_at`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`service_id`, `locale`),
  UNIQUE KEY `services_i18n_locale_slug_uq` (`locale`, `slug`),
  INDEX `services_i18n_locale_idx` (`locale`),
  CONSTRAINT `fk_services_i18n_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `service_images` (
  `id`                CHAR(36)     NOT NULL,
  `service_id`        CHAR(36)     NOT NULL,
  `storage_asset_id`  CHAR(36)     NULL,
  `image_url`         VARCHAR(500) NULL,

  `display_order`     INT          NOT NULL DEFAULT 0,
  `is_active`         TINYINT      NOT NULL DEFAULT 1,

  `created_at`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  INDEX `service_images_service_id_idx` (`service_id`),
  INDEX `service_images_order_idx`      (`service_id`, `display_order`),
  CONSTRAINT `fk_service_images_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `service_images_i18n` (
  `id`         CHAR(36)     NOT NULL,
  `image_id`   CHAR(36)     NOT NULL,
  `locale`     VARCHAR(8)   NOT NULL DEFAULT 'tr',

  `title`      VARCHAR(255) NULL,
  `alt`        VARCHAR(255) NULL,
  `caption`    VARCHAR(500) NULL,

  `created_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY `service_images_i18n_image_locale_uq` (`image_id`, `locale`),
  INDEX `service_images_i18n_locale_idx` (`locale`),
  CONSTRAINT `fk_service_images_i18n_image` FOREIGN KEY (`image_id`) REFERENCES `service_images` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
