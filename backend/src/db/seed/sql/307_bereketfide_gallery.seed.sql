-- =============================================================
-- FILE: 307_bereketfide_gallery.seed.sql
-- Bereket Fide — Örnek galeri verileri (TR/EN)
-- module_key = 'bereketfide'
-- source_type = 'project'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================
-- 1) CLEANUP EXISTING GALLERIES
-- =========================
DELETE FROM `galleries` WHERE `module_key` = 'bereketfide';

INSERT INTO `galleries`
(
  `id`,
  `module_key`,
  `source_id`,
  `source_type`,
  `is_active`,
  `is_featured`,
  `display_order`
)
VALUES
  ('kg010001-8001-4001-9001-eeeeeeee0001', 'bereketfide', NULL, 'other', 1, 1, 10),
  ('kg010002-8002-4002-9002-eeeeeeee0002', 'bereketfide', NULL, 'other', 1, 1, 20)
ON DUPLICATE KEY UPDATE
  `module_key` = VALUES(`module_key`),
  `is_active` = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`);

INSERT INTO `gallery_i18n`
(
  `gallery_id`,
  `locale`,
  `title`,
  `slug`,
  `description`,
  `meta_title`,
  `meta_description`
)
VALUES
  -- Galeri 1 — Modern Seralarımız
  ('kg010001-8001-4001-9001-eeeeeeee0001', 'tr',
   'Modern Seralarımız ve Üretim Teknolojilerimiz',
   'modern-seralarimiz-galeri',
   'Antalya Aksu’daki modern ve bilgisayar kontrollü seralarımızdan kesitler.',
   'Modern Sera Galerisi | Bereket Fide',
   'Bereket Fide modern üretim tesisleri ve sera fotoğrafları.'),
  ('kg010001-8001-4001-9001-eeeeeeee0001', 'en',
   'Our Modern Greenhouses & Production Tech',
   'modern-greenhouses-gallery',
   'Sections from our modern and computer-controlled greenhouses in Aksu, Antalya.',
   'Modern Greenhouse Gallery | Bereket Fide',
   'Bereket Fide modern production facilities and greenhouse photos.'),
  -- Galeri 2 — Fide Çeşitleri
  ('kg010002-8002-4002-9002-eeeeeeee0002', 'tr',
   'Sağlıklı ve Bereketli Fide Çeşitleri',
   'fide-cesitleri-galeri',
   'Üretimini yaptığımız aşılı ve normal fide çeşitlerine ait fotoğraflar.',
   'Fide Çeşitleri Galerisi | Bereket Fide',
   'Domates, biber, patlıcan ve diğer fide çeşitlerimizin fotoğrafları.'),
  ('kg010002-8002-4002-9002-eeeeeeee0002', 'en',
   'Healthy & Bountiful Seedling Varieties',
   'seedling-varieties-gallery',
   'Photographs of the grafted and normal seedling varieties we produce.',
   'Seedling Varieties Gallery | Bereket Fide',
   'Photos of our tomato, pepper, eggplant, and other seedling varieties.')
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`);

-- =========================
-- GALLERY IMAGES (Using existing media/news files as placeholders)
-- =========================
INSERT INTO `gallery_images`
(`id`, `gallery_id`, `storage_asset_id`, `image_url`, `display_order`, `is_cover`)
VALUES
  ('gi-g1-0001', 'kg010001-8001-4001-9001-eeeeeeee0001', 'd0829871-469a-46ae-b243-b537aff49ec0', '/uploads/products/23.28.37 (3).jpeg', 1, 1),
  ('gi-g1-0002', 'kg010001-8001-4001-9001-eeeeeeee0001', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315', '/uploads/products/23.28.37 (1).jpeg', 2, 0),
  ('gi-g2-0001', 'kg010002-8002-4002-9002-eeeeeeee0002', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315', '/uploads/products/23.28.37 (1).jpeg', 1, 1)
ON DUPLICATE KEY UPDATE
  `image_url` = VALUES(`image_url`),
  `display_order` = VALUES(`display_order`),
  `is_cover` = VALUES(`is_cover`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
