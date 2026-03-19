-- =============================================================
-- FILE: 304.1_bereketfide_blog_categories.seed.sql
-- Bereket Fide — Blog kategorileri + i18n (TR/EN)
-- module_key = 'blog'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================
-- 1) CATEGORIES (BASE)
-- =========================
INSERT INTO `categories`
(
  `id`,
  `module_key`,
  `is_active`,
  `is_featured`,
  `display_order`
)
VALUES
  ('bccc0001-4001-4001-8001-bbcccccc0001', 'blog', 1, 1, 10),
  ('bccc0002-4002-4002-8002-bbcccccc0002', 'blog', 1, 1, 20),
  ('bccc0003-4003-4003-8003-bbcccccc0003', 'blog', 1, 1, 30)
ON DUPLICATE KEY UPDATE
  `module_key` = VALUES(`module_key`),
  `is_active` = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`);

-- =========================
-- 2) CATEGORY I18N — TR
-- =========================
INSERT INTO `category_i18n`
(
  `category_id`,
  `locale`,
  `name`,
  `slug`,
  `description`
)
VALUES
  ('bccc0001-4001-4001-8001-bbcccccc0001', 'tr', 'Üretim Rehberleri', 'uretim-rehberleri', 'Fide üretimi ve bakımı hakkında teknik rehberler'),
  ('bccc0002-4002-4002-8002-bbcccccc0002', 'tr', 'Tarımsal İnovasyon', 'tarimsal-inovasyon', 'Modern tarım teknikleri ve yenilikçi yaklaşımlar'),
  ('bccc0003-4003-4003-8003-bbcccccc0003', 'tr', 'Bilgilendirme', 'bilgilendirme', 'Genel tarımsal bilgiler ve duyurular')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`);

-- =========================
-- 3) CATEGORY I18N — EN
-- =========================
INSERT INTO `category_i18n`
(
  `category_id`,
  `locale`,
  `name`,
  `slug`,
  `description`
)
VALUES
  ('bccc0001-4001-4001-8001-bbcccccc0001', 'en', 'Production Guides', 'production-guides', 'Technical guides for seedling production and care'),
  ('bccc0002-4002-4002-8002-bbcccccc0002', 'en', 'Agricultural Innovation', 'agricultural-innovation', 'Modern farming techniques and innovative approaches'),
  ('bccc0003-4003-4003-8003-bbcccccc0003', 'en', 'Information', 'information', 'General agricultural info and announcements')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`);

-- =========================
-- 4) ASSIGN TO BLOG POSTS
-- =========================
UPDATE `custom_pages` SET `category_id` = 'bccc0002-4002-4002-8002-bbcccccc0002' WHERE `id` = 'bb010001-5001-4001-9001-bbbbbbbb0001'; -- Güneş Enerjisi -> İnovasyon
UPDATE `custom_pages` SET `category_id` = 'bccc0001-4001-4001-8001-bbcccccc0001' WHERE `id` = 'bb010002-5002-4002-9002-bbbbbbbb0002'; -- Dikim Rehberi -> Rehberler
UPDATE `custom_pages` SET `category_id` = 'bccc0002-4002-4002-8002-bbcccccc0002' WHERE `id` = 'bb010003-5003-4003-9003-bbbbbbbb0003'; -- İnovatif Yaklaşımlar -> İnovasyon
UPDATE `custom_pages` SET `category_id` = 'bccc0001-4001-4001-8001-bbcccccc0001' WHERE `id` = 'bb010004-5004-4004-9004-bbbbbbbb0004'; -- Toprak Hazırlığı -> Rehberler

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
