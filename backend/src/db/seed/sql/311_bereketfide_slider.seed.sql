-- =============================================================
-- FILE: 311_bereketfide_slider.seed.sql
-- Bereket Fide — Home Hero Slider (TR/EN)
-- Drizzle şeması ile birebir uyumlu, idempotent seed
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- ================= PARENT SEED (slider) ======================
INSERT INTO `slider`
(`uuid`, `image_url`, `image_asset_id`, `site_id`, `featured`, `is_active`, `display_order`, `created_at`, `updated_at`)
VALUES
(
  'bf-slider-001',
  '/uploads/gallery/bereket-fide-hero-01.jpg',
  'sa-news-0002', -- Referencing one of the storage assets we created
  'bereketfide',
  1, 1, 1,
  NOW(3), NOW(3)
),
(
  'bf-slider-002',
  '/uploads/gallery/bereket-fide-hero-02.jpg',
  'sa-news-0001',
  'bereketfide',
  0, 1, 2,
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `image_url`      = VALUES(`image_url`),
  `image_asset_id` = VALUES(`image_asset_id`),
  `site_id`        = VALUES(`site_id`),
  `featured`       = VALUES(`featured`),
  `is_active`      = VALUES(`is_active`),
  `display_order`  = VALUES(`display_order`),
  `updated_at`     = VALUES(`updated_at`);

-- ================= I18N SEED — TR ===========================
INSERT INTO `slider_i18n`
(`slider_id`, `locale`, `name`, `slug`, `description`, `alt`, `button_text`, `button_link`)
VALUES
(
  (SELECT `id` FROM `slider` WHERE `uuid` = 'bf-slider-001'),
  'tr',
  'Bereketli Hasatlar İçin Kaliteli Fide',
  'kaliteli-fide-uretimi',
  '2006’dan beri modern seralarımızda en kaliteli aşılı ve normal fideleri üretiyoruz.',
  'Bereket Fide Modern Sera',
  'Ürünlerimizi İnceleyin',
  '/urunler'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = 'bf-slider-002'),
  'tr',
  'Modern Tarım Teknolojileriyle Üretim',
  'modern-tarim-teknolojileri',
  'Antalya Aksu’daki 32.000 m² tesisimizde bilgisayar kontrollü modern seralarla fide üretiminde öncüyüz.',
  'Bereket Fide Tesisleri',
  'Kurumsal',
  '/hakkimizda'
)
ON DUPLICATE KEY UPDATE
  `name`        = VALUES(`name`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `alt`         = VALUES(`alt`),
  `button_text` = VALUES(`button_text`),
  `button_link` = VALUES(`button_link`);

-- ================= I18N SEED — EN ===========================
INSERT INTO `slider_i18n`
(`slider_id`, `locale`, `name`, `slug`, `description`, `alt`, `button_text`, `button_link`)
VALUES
(
  (SELECT `id` FROM `slider` WHERE `uuid` = 'bf-slider-001'),
  'en',
  'Quality Seedlings for Bountiful Harvests',
  'quality-seedling-production',
  'Since 2006, we have been producing the highest quality grafted and normal seedlings in our modern greenhouses.',
  'Bereket Fide Modern Greenhouse',
  'Explore Products',
  '/products'
),
(
  (SELECT `id` FROM `slider` WHERE `uuid` = 'bf-slider-002'),
  'en',
  'Production with Modern Agricultural Technologies',
  'modern-agricultural-technologies',
  'We are pioneers in seedling production with computer-controlled modern greenhouses in our 32,000 m² facility in Aksu, Antalya.',
  'Bereket Fide Facilities',
  'Corporate',
  '/about-us'
)
ON DUPLICATE KEY UPDATE
  `name`        = VALUES(`name`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `alt`         = VALUES(`alt`),
  `button_text` = VALUES(`button_text`),
  `button_link` = VALUES(`button_link`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
