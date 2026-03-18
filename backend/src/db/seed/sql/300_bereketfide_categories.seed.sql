-- =============================================================
-- FILE: 300_bereketfide_categories.seed.sql
-- Bereket Fide — Proje kategorileri + i18n (TR/EN)
-- module_key = 'bereketfide'
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
  ('cccc0001-4001-4001-8001-cccccccc0001', 'bereketfide', NULL, NULL, NULL, NULL, 1, 1, 10),
  ('cccc0002-4002-4002-8002-cccccccc0002', 'bereketfide', NULL, NULL, NULL, NULL, 1, 1, 20),
  ('cccc0003-4003-4003-8003-cccccccc0003', 'bereketfide', NULL, NULL, NULL, NULL, 1, 1, 30),
  ('cccc0004-4004-4004-8004-cccccccc0004', 'bereketfide', NULL, NULL, NULL, NULL, 1, 1, 40),
  ('cccc0005-4005-4005-8005-cccccccc0005', 'bereketfide', NULL, NULL, NULL, NULL, 1, 1, 50),
  ('cccc0006-4006-4006-8006-cccccccc0006', 'bereketfide', NULL, NULL, NULL, NULL, 1, 1, 60),
  ('cccc0007-4007-4007-8007-cccccccc0007', 'bereketfide', NULL, NULL, NULL, NULL, 1, 1, 70)
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
  ('cccc0001-4001-4001-8001-cccccccc0001', 'tr', 'Domates Fideleri', 'domates-fideleri', 'Yüksek verimli, hastalıklara dayanıklı normal ve aşılı domates fideleri.'),
  ('cccc0002-4002-4002-8002-cccccccc0002', 'tr', 'Biber Fideleri', 'biber-fideleri', 'Acı, tatlı, dolmalık ve sivri biber çeşitleri için kaliteli fideler.'),
  ('cccc0003-4003-4003-8003-cccccccc0003', 'tr', 'Salatalık Fideleri', 'salatalik-fideleri', 'Sera ve açık alan yetiştiriciliğine uygun salatalık fideleri.'),
  ('cccc0004-4004-4004-8004-cccccccc0004', 'tr', 'Patlıcan Fideleri', 'patlican-fideleri', 'Güçlü kök yapısına sahip, yüksek verimli patlıcan fideleri.'),
  ('cccc0005-4005-4005-8005-cccccccc0005', 'tr', 'Kavun Fideleri', 'kavun-fideleri', 'Tat ve aroma kalitesi yüksek kavun fidesi çeşitleri.'),
  ('cccc0006-4006-4006-8006-cccccccc0006', 'tr', 'Karpuz Fideleri', 'karpuz-fideleri', 'Erkenci ve yüksek şeker oranlı karpuz fideleri.'),
  ('cccc0007-4007-4007-8007-cccccccc0007', 'tr', 'Kabak Fideleri', 'kabak-fideleri', 'Verimli ve kaliteli kabak fidesi üretimi.')
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
  ('cccc0001-4001-4001-8001-cccccccc0001', 'en', 'Tomato Seedlings', 'tomato-seedlings', 'High-yield, disease-resistant normal and grafted tomato seedlings.'),
  ('cccc0002-4002-4002-8002-cccccccc0002', 'en', 'Pepper Seedlings', 'pepper-seedlings', 'Quality seedlings for hot, sweet, bell, and long pepper varieties.'),
  ('cccc0003-4003-4003-8003-cccccccc0003', 'en', 'Cucumber Seedlings', 'cucumber-seedlings', 'Cucumber seedlings suitable for greenhouse and open field cultivation.'),
  ('cccc0004-4004-4004-8004-cccccccc0004', 'en', 'Eggplant Seedlings', 'eggplant-seedlings', 'High-yield eggplant seedlings with strong root structures.'),
  ('cccc0005-4005-4005-8005-cccccccc0005', 'en', 'Melon Seedlings', 'melon-seedlings', 'Melon seedling varieties with high taste and aroma quality.'),
  ('cccc0006-4006-4006-8006-cccccccc0006', 'en', 'Watermelon Seedlings', 'watermelon-seedlings', 'Early and high-sugar content watermelon seedlings.'),
  ('cccc0007-4007-4007-8007-cccccccc0007', 'en', 'Squash Seedlings', 'squash-seedlings', 'Productive and quality squash seedling production.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
