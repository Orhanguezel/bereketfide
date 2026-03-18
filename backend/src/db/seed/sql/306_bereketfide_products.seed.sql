-- =============================================================
-- FILE: 306_bereketfide_products.seed.sql
-- Bereket Fide — Örnek proje verileri (TR/EN)
-- item_type = 'bereketfide'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

INSERT INTO `products`
(
  `id`,
  `item_type`,
  `category_id`,
  `sub_category_id`,
  `price`,
  `image_url`,
  `storage_asset_id`,
  `images`,
  `storage_image_ids`,
  `is_active`,
  `is_featured`,
  `order_num`,
  `product_code`,
  `stock_quantity`,
  `rating`,
  `review_count`
)
VALUES
  -- Domates
  ('bf-prd-0001', 'bereketfide', 'cccc0001-4001-4001-8001-cccccccc0001', NULL, 0.00, '/uploads/products/domates-normal.jpg', NULL, JSON_ARRAY(), JSON_ARRAY(), 1, 1, 10, 'BF-DOM-001', 0, 5.00, 0),
  ('bf-prd-0002', 'bereketfide', 'cccc0001-4001-4001-8001-cccccccc0001', NULL, 0.00, '/uploads/products/domates-asili.jpg', NULL, JSON_ARRAY(), JSON_ARRAY(), 1, 1, 20, 'BF-DOM-A01', 0, 5.00, 0),
  -- Biber
  ('bf-prd-0003', 'bereketfide', 'cccc0002-4002-4002-8002-cccccccc0002', NULL, 0.00, '/uploads/products/biber-normal.jpg', NULL, JSON_ARRAY(), JSON_ARRAY(), 1, 1, 30, 'BF-BIB-001', 0, 5.00, 0),
  ('bf-prd-0004', 'bereketfide', 'cccc0002-4002-4002-8002-cccccccc0002', NULL, 0.00, '/uploads/products/biber-asili.jpg', NULL, JSON_ARRAY(), JSON_ARRAY(), 1, 0, 40, 'BF-BIB-A01', 0, 5.00, 0),
  -- Salatalık
  ('bf-prd-0005', 'bereketfide', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00, '/uploads/products/salatalik-normal.jpg', NULL, JSON_ARRAY(), JSON_ARRAY(), 1, 1, 50, 'BF-SAL-001', 0, 5.00, 0)
ON DUPLICATE KEY UPDATE
  `item_type` = VALUES(`item_type`),
  `category_id` = VALUES(`category_id`),
  `price` = VALUES(`price`),
  `image_url` = VALUES(`image_url`),
  `images` = VALUES(`images`),
  `is_active` = VALUES(`is_active`),
  `is_featured` = VALUES(`is_featured`),
  `order_num` = VALUES(`order_num`),
  `product_code` = VALUES(`product_code`);

INSERT INTO `product_i18n`
(
  `product_id`,
  `locale`,
  `title`,
  `slug`,
  `description`,
  `alt`,
  `tags`,
  `specifications`,
  `meta_title`,
  `meta_description`
)
VALUES
  -- Domates Normal TR
  ('bf-prd-0001', 'tr', 'Normal Domates Fidesi', 'normal-domates-fidesi',
   '<p>Bereket Fide kalite standartlarında üretilen, yüksek verimli ve güçlü adaptasyon yeteneğine sahip normal domates fidesi. Her türlü toprak yapısına uygun, hastalıklara dayanıklı çeşitlerden üretilmektedir.</p>',
   'Normal Domates Fidesi — Bereket Fide',
   JSON_ARRAY('domates', 'fide', 'normal üretim'),
   JSON_OBJECT('tip', 'Normal', 'kategori', 'Domates', 'verim', 'Yüksek'),
   'Normal Domates Fidesi | Bereket Fide',
   'Yüksek verimli ve kaliteli normal domates fideleri. Bereket Fide güvencesiyle.'),
  -- Domates Normal EN
  ('bf-prd-0001', 'en', 'Normal Tomato Seedling', 'normal-tomato-seedling',
   '<p>Normal tomato seedlings produced to Bereket Fide quality standards, offering high yield and strong adaptation capabilities. Produced from disease-resistant varieties suitable for all soil types.</p>',
   'Normal Tomato Seedling — Bereket Fide',
   JSON_ARRAY('tomato', 'seedling', 'normal production'),
   JSON_OBJECT('type', 'Normal', 'category', 'Tomato', 'yield', 'High'),
   'Normal Tomato Seedling | Bereket Fide',
   'High-yield and quality normal tomato seedlings. Assured by Bereket Fide.'),
  -- Domates Aşılı TR
  ('bf-prd-0002', 'tr', 'Aşılı Domates Fidesi', 'asili-domates-fidesi',
   '<p>Özel anaçlar üzerine aşılanmış, toprak kökenli hastalıklara karşı tam dayanıklı ve meyve kalitesi maksimize edilmiş aşılı domates fidesi. Uzun üretim sezonu için idealdir.</p>',
   'Aşılı Domates Fidesi — Bereket Fide',
   JSON_ARRAY('aşılı', 'domates', 'yüksek verim'),
   JSON_OBJECT('tip', 'Aşılı', 'kategori', 'Domates', 'dayanıklılık', 'Maksimum'),
   'Aşılı Domates Fidesi | Bereket Fide',
   'Toprak kökenli hastalıklara dayanıklı, yüksek kaliteli aşılı domates fideleri.'),
  -- Domates Aşılı EN
  ('bf-prd-0002', 'en', 'Grafted Tomato Seedling', 'grafted-tomato-seedling',
   '<p>Grafted tomato seedlings on special rootstocks, fully resistant to soil-borne diseases with maximized fruit quality. Ideal for long production seasons.</p>',
   'Grafted Tomato Seedling — Bereket Fide',
   JSON_ARRAY('grafted', 'tomato', 'high yield'),
   JSON_OBJECT('type', 'Grafted', 'category', 'Tomato', 'resistance', 'Maximum'),
   'Grafted Tomato Seedling | Bereket Fide',
   'Soil-borne disease resistant, high-quality grafted tomato seedlings.'),
  -- Biber TR
  ('bf-prd-0003', 'tr', 'Normal Biber Fidesi', 'normal-biber-fidesi',
   '<p>Tatlı, acı, dolmalık ve sivri biber çeşitlerinde en iyi verimi sunan normal biber fideleri.</p>',
   'Normal Biber Fidesi — Bereket Fide',
   JSON_ARRAY('biber', 'fide'),
   JSON_OBJECT('tip', 'Normal', 'kategori', 'Biber'),
   'Normal Biber Fidesi | Bereket Fide',
   'Kaliteli ve verimli normal biber fideleri.'),
  -- Biber EN
  ('bf-prd-0003', 'en', 'Normal Pepper Seedling', 'normal-pepper-seedling',
   '<p>Normal pepper seedlings offering the best yield in sweet, hot, bell, and long pepper varieties.</p>',
   'Normal Pepper Seedling — Bereket Fide',
   JSON_ARRAY('pepper', 'seedling'),
   JSON_OBJECT('type', 'Normal', 'category', 'Pepper'),
   'Normal Pepper Seedling | Bereket Fide',
   'Quality and productive normal pepper seedlings.')
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`),
  `alt` = VALUES(`alt`),
  `tags` = VALUES(`tags`),
  `specifications` = VALUES(`specifications`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
