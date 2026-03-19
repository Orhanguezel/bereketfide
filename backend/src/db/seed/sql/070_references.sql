CREATE TABLE IF NOT EXISTS `references` (
  `id` char(36) NOT NULL,
  `is_published` tinyint NOT NULL DEFAULT 0,
  `is_featured` tinyint NOT NULL DEFAULT 0,
  `display_order` int NOT NULL DEFAULT 0,
  `featured_image` varchar(500) DEFAULT NULL,
  `featured_image_asset_id` char(36) DEFAULT NULL,
  `website_url` varchar(500) DEFAULT NULL,
  `category_id` char(36) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `references_created_idx` (`created_at`),
  KEY `references_updated_idx` (`updated_at`),
  KEY `references_published_idx` (`is_published`),
  KEY `references_featured_idx` (`is_featured`),
  KEY `references_display_order_idx` (`display_order`),
  KEY `references_featured_asset_idx` (`featured_image_asset_id`),
  KEY `references_category_id_idx` (`category_id`),
  CONSTRAINT `fk_references_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `references_i18n` (
  `id` char(36) NOT NULL,
  `reference_id` char(36) NOT NULL,
  `locale` varchar(10) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `summary` longtext DEFAULT NULL,
  `content` longtext NOT NULL,
  `featured_image_alt` varchar(255) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_references_i18n_parent_locale` (`reference_id`, `locale`),
  UNIQUE KEY `ux_references_i18n_locale_slug` (`locale`, `slug`),
  KEY `references_i18n_locale_idx` (`locale`),
  KEY `references_i18n_slug_idx` (`slug`),
  CONSTRAINT `fk_references_i18n_parent`
    FOREIGN KEY (`reference_id`) REFERENCES `references` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `reference_images` (
  `id` char(36) NOT NULL,
  `reference_id` char(36) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `storage_asset_id` char(36) DEFAULT NULL,
  `is_featured` tinyint NOT NULL DEFAULT 0,
  `display_order` int NOT NULL DEFAULT 0,
  `is_published` tinyint NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `reference_images_reference_idx` (`reference_id`),
  KEY `reference_images_asset_idx` (`storage_asset_id`),
  KEY `reference_images_published_idx` (`is_published`),
  KEY `reference_images_order_idx` (`display_order`),
  CONSTRAINT `fk_reference_images_parent`
    FOREIGN KEY (`reference_id`) REFERENCES `references` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `reference_images_i18n` (
  `id` char(36) NOT NULL,
  `image_id` char(36) NOT NULL,
  `locale` varchar(10) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_reference_images_i18n_parent_locale` (`image_id`, `locale`),
  KEY `reference_images_i18n_locale_idx` (`locale`),
  CONSTRAINT `fk_reference_images_i18n_parent`
    FOREIGN KEY (`image_id`) REFERENCES `reference_images` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);
