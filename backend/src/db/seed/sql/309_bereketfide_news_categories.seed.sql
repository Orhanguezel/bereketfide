-- =============================================================
-- FILE: 309_bereketfide_news_categories.seed.sql
-- Bereket Fide — Haber kategorileri + i18n (TR/EN)
-- module_key = 'news'
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
  `image_url`,
  `storage_asset_id`,
  `alt`,
  `icon`,
  `is_active`,
  `is_featured`,
  `display_order`
)
VALUES
  ('nccc0001-4001-4001-8001-nncccccc0001', 'news', NULL, NULL, NULL, NULL, 1, 1, 10),
  ('nccc0002-4002-4002-8002-nncccccc0002', 'news', NULL, NULL, NULL, NULL, 1, 1, 20),
  ('nccc0003-4003-4003-8003-nncccccc0003', 'news', NULL, NULL, NULL, NULL, 1, 0, 30),
  ('nccc0004-4004-4004-8004-nncccccc0004', 'news', NULL, NULL, NULL, NULL, 1, 0, 40),
  ('nccc0005-4005-4005-8005-nncccccc0005', 'news', NULL, NULL, NULL, NULL, 1, 0, 50)
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
  ('nccc0001-4001-4001-8001-nncccccc0001', 'tr', 'Çiftçi Röportajları', 'ciftci-roportajlari', 'Üreticilerimizle tarım ve fide üzerine söyleşiler'),
  ('nccc0002-4002-4002-8002-nncccccc0002', 'tr', 'Tarım Haberleri', 'tarim-haberleri', 'Tarım sektöründen güncel gelişmeler ve haberler'),
  ('nccc0003-4003-4003-8003-nncccccc0003', 'tr', 'Üretim Güncellemeleri', 'uretim-guncellemeleri', 'Seralarımızdan en son üretim haberleri'),
  ('nccc0004-4004-4004-8004-nncccccc0004', 'tr', 'Tarım Teknolojileri', 'tarim-teknolojileri', 'Modern tarım teknikleri ve teknolojik inovasyonlar'),
  ('nccc0005-4005-4005-8005-nncccccc0005', 'tr', 'Sürdürülebilir Tarım', 'surdurulebilir-tarim', 'Çevreci ve sürdürülebilir tarım uygulamaları')
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
  ('nccc0001-4001-4001-8001-nncccccc0001', 'en', 'Farmer Interviews', 'farmer-interviews', 'Interviews and conversations with producers'),
  ('nccc0002-4002-4002-8002-nncccccc0002', 'en', 'Agricultural News', 'agricultural-news', 'Current news from the agriculture industry'),
  ('nccc0003-4003-4003-8003-nncccccc0003', 'en', 'Production Updates', 'production-updates', 'Latest production news from our greenhouses'),
  ('nccc0004-4004-4004-8004-nncccccc0004', 'en', 'Agricultural Tech', 'agricultural-tech', 'Modern farming techniques and technological innovations'),
  ('nccc0005-4005-4005-8005-nncccccc0005', 'en', 'Sustainable Farming', 'sustainable-farming', 'Eco-friendly and sustainable agricultural practices')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
