-- =============================================================
-- FILE: 306_bereketfide_products.seed.sql
-- Bereket Fide — Ürün verileri (TR/EN)
-- item_type = 'bereketfide'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- 1) CLEANUP EXISTING PRODUCTS
-- =========================
DELETE FROM `products` WHERE `item_type` = 'bereketfide';

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
  -- Aşısız Düz Domates (cccc0001)
  ('bf-prd-0001', 'bereketfide', 'cccc0001-4001-4001-8001-cccccccc0001', NULL, 0.00,
   '/uploads/products/23.27.59.jpeg', 'bf-prd-img-0005',
   JSON_ARRAY('/uploads/products/23.27.59.jpeg','/uploads/products/23.27.59 (1).jpeg','/uploads/products/23.28.00.jpeg','/uploads/products/23.28.01.jpeg'),
   JSON_ARRAY(), 1, 1, 10, 'BF-DOM-001', 0, 5.00, 0),
  -- Aşılı Domates (cccc0001)
  ('bf-prd-0002', 'bereketfide', 'cccc0001-4001-4001-8001-cccccccc0001', NULL, 0.00,
   '/uploads/products/23.28.04.jpeg', 'bf-prd-img-0008',
   JSON_ARRAY('/uploads/products/23.28.04.jpeg','/uploads/products/23.28.05.jpeg','/uploads/products/23.28.06.jpeg','/uploads/products/23.28.06 (1).jpeg'),
   JSON_ARRAY(), 1, 1, 20, 'BF-DOM-A01', 0, 5.00, 0),
  -- Biber (cccc0002)
  ('bf-prd-0003', 'bereketfide', 'cccc0002-4002-4002-8002-cccccccc0002', NULL, 0.00,
   '/uploads/products/23.28.07.jpeg', 'bf-prd-img-0015',
   JSON_ARRAY('/uploads/products/23.28.07.jpeg','/uploads/products/23.28.07 (1).jpeg','/uploads/products/23.28.07 (2).jpeg','/uploads/products/23.28.07 (3).jpeg'),
   JSON_ARRAY(), 1, 1, 30, 'BF-BIB-001', 0, 5.00, 0),
  -- Aşılı Biber (cccc0002)
  ('bf-prd-0004', 'bereketfide', 'cccc0002-4002-4002-8002-cccccccc0002', NULL, 0.00,
   '/uploads/products/23.28.08.jpeg', 'bf-prd-img-0019',
   JSON_ARRAY('/uploads/products/23.28.08.jpeg','/uploads/products/23.28.08 (1).jpeg','/uploads/products/23.28.08 (2).jpeg','/uploads/products/23.28.08 (3).jpeg','/uploads/products/23.28.09.jpeg','/uploads/products/23.28.09 (1).jpeg','/uploads/products/23.28.09 (2).jpeg'),
   JSON_ARRAY(), 1, 0, 40, 'BF-BIB-A01', 0, 5.00, 0),
  -- Salatalık (cccc0003)
  ('bf-prd-0005', 'bereketfide', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00,
   '/uploads/products/23.28.13.jpeg', 'bf-prd-img-0024',
   JSON_ARRAY('/uploads/products/23.28.13.jpeg','/uploads/products/23.28.13 (1).jpeg','/uploads/products/23.28.14.jpeg','/uploads/products/23.28.14 (1).jpeg'),
   JSON_ARRAY(), 1, 1, 50, 'BF-SAL-001', 0, 5.00, 0),
  -- Hıyar (cccc0003)
  ('bf-prd-0006', 'bereketfide', 'cccc0003-4003-4003-8003-cccccccc0003', NULL, 0.00,
   '/uploads/products/23.28.15.jpeg', 'bf-prd-img-0033',
   JSON_ARRAY('/uploads/products/23.28.15.jpeg','/uploads/products/23.28.15 (1).jpeg','/uploads/products/23.28.15 (2).jpeg','/uploads/products/23.28.15 (3).jpeg','/uploads/products/23.28.15 (4).jpeg','/uploads/products/23.28.15 (5).jpeg','/uploads/products/23.28.15 (6).jpeg'),
   JSON_ARRAY(), 1, 1, 55, 'BF-HIY-001', 0, 5.00, 0),
  -- Kavun (cccc0005)
  ('bf-prd-0007', 'bereketfide', 'cccc0005-4005-4005-8005-cccccccc0005', NULL, 0.00,
   '/uploads/products/23.28.16.jpeg', 'bf-prd-img-0036',
   JSON_ARRAY('/uploads/products/23.28.16.jpeg','/uploads/products/23.28.16 (1).jpeg','/uploads/products/23.28.16 (2).jpeg','/uploads/products/23.28.17.jpeg','/uploads/products/23.28.17 (1).jpeg','/uploads/products/23.28.17 (2).jpeg','/uploads/products/23.28.17 (3).jpeg'),
   JSON_ARRAY(), 1, 1, 60, 'BF-KAV-001', 0, 5.00, 0),
  -- Aşılı Karpuz (cccc0006)
  ('bf-prd-0008', 'bereketfide', 'cccc0006-4006-4006-8006-cccccccc0006', NULL, 0.00,
   '/uploads/products/23.28.20.jpeg', 'bf-prd-img-0041',
   JSON_ARRAY('/uploads/products/23.28.20.jpeg','/uploads/products/23.28.22.jpeg','/uploads/products/23.28.22 (1).jpeg','/uploads/products/23.28.22 (2).jpeg','/uploads/products/23.28.23.jpeg'),
   JSON_ARRAY(), 1, 1, 70, 'BF-KAR-A01', 0, 5.00, 0)
ON DUPLICATE KEY UPDATE
  `item_type` = VALUES(`item_type`),
  `category_id` = VALUES(`category_id`),
  `price` = VALUES(`price`),
  `image_url` = VALUES(`image_url`),
  `storage_asset_id` = VALUES(`storage_asset_id`),
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
  -- ===================== Aşısız Düz Domates (bf-prd-0001) =====================
  ('bf-prd-0001', 'tr', 'Aşısız Düz Domates Fidesi', 'asisiz-duz-domates-fidesi',
   '<p>Bereket Fide kalite standartlarında üretilen, yüksek verimli aşısız düz domates fidesi. Açık tarla ve sera yetiştiriciliğine uygun, güçlü kök yapısına sahip, erken hasat imkanı sunan çeşitlerden üretilmektedir.</p>',
   'Aşısız Düz Domates Fidesi — Bereket Fide',
   JSON_ARRAY('domates', 'fide', 'aşısız', 'düz domates'),
   JSON_OBJECT('tip', 'Aşısız / Düz', 'kategori', 'Domates', 'verim', 'Yüksek', 'üretim', 'Açık tarla & Sera'),
   'Aşısız Düz Domates Fidesi | Bereket Fide',
   'Yüksek verimli, hastalıklara dayanıklı aşısız düz domates fideleri. Bereket Fide güvencesiyle.'),
  ('bf-prd-0001', 'en', 'Standard Tomato Seedling', 'standard-tomato-seedling',
   '<p>Standard (non-grafted) tomato seedlings produced to Bereket Fide quality standards. Suitable for open-field and greenhouse cultivation, with strong root systems and early harvest potential.</p>',
   'Standard Tomato Seedling — Bereket Fide',
   JSON_ARRAY('tomato', 'seedling', 'non-grafted', 'standard'),
   JSON_OBJECT('type', 'Non-grafted / Standard', 'category', 'Tomato', 'yield', 'High', 'production', 'Open field & Greenhouse'),
   'Standard Tomato Seedling | Bereket Fide',
   'High-yield, disease-resistant standard tomato seedlings. Assured by Bereket Fide.'),

  -- ===================== Aşılı Domates (bf-prd-0002) =====================
  ('bf-prd-0002', 'tr', 'Aşılı Domates Fidesi', 'asili-domates-fidesi',
   '<p>Özel anaçlar üzerine aşılanmış, toprak kökenli hastalıklara karşı tam dayanıklı ve meyve kalitesi maksimize edilmiş aşılı domates fidesi. Uzun üretim sezonu boyunca yüksek verim sağlar, kök yapısı güçlü olduğundan stres koşullarına karşı dayanıklıdır.</p>',
   'Aşılı Domates Fidesi — Bereket Fide',
   JSON_ARRAY('aşılı', 'domates', 'yüksek verim', 'dayanıklı'),
   JSON_OBJECT('tip', 'Aşılı', 'kategori', 'Domates', 'dayanıklılık', 'Maksimum', 'anaç', 'Özel seleksiyon'),
   'Aşılı Domates Fidesi | Bereket Fide',
   'Toprak kökenli hastalıklara dayanıklı, uzun sezon yüksek kaliteli aşılı domates fideleri.'),
  ('bf-prd-0002', 'en', 'Grafted Tomato Seedling', 'grafted-tomato-seedling',
   '<p>Grafted tomato seedlings on special rootstocks, fully resistant to soil-borne diseases with maximized fruit quality. Provides high yield throughout the long production season with strong root structure for stress resilience.</p>',
   'Grafted Tomato Seedling — Bereket Fide',
   JSON_ARRAY('grafted', 'tomato', 'high yield', 'resistant'),
   JSON_OBJECT('type', 'Grafted', 'category', 'Tomato', 'resistance', 'Maximum', 'rootstock', 'Special selection'),
   'Grafted Tomato Seedling | Bereket Fide',
   'Soil-borne disease resistant, long-season high-quality grafted tomato seedlings.'),

  -- ===================== Biber (bf-prd-0003) =====================
  ('bf-prd-0003', 'tr', 'Biber Fidesi', 'biber-fidesi',
   '<p>Tatlı, acı, dolmalık ve sivri biber çeşitlerinde en iyi verimi sunan biber fideleri. Sera ve açık tarla koşullarına uygun, güçlü bitki yapısı ve yüksek meyve kalitesi ile öne çıkar.</p>',
   'Biber Fidesi — Bereket Fide',
   JSON_ARRAY('biber', 'fide', 'tatlı biber', 'acı biber', 'dolmalık'),
   JSON_OBJECT('tip', 'Çeşitli', 'kategori', 'Biber', 'çeşitler', 'Tatlı, Acı, Dolmalık, Sivri'),
   'Biber Fidesi | Bereket Fide',
   'Kaliteli ve verimli biber fideleri. Tatlı, acı, dolmalık ve sivri biber çeşitleri.'),
  ('bf-prd-0003', 'en', 'Pepper Seedling', 'pepper-seedling',
   '<p>Pepper seedlings offering the best yield in sweet, hot, bell, and long pepper varieties. Suitable for greenhouse and open-field conditions, standing out with strong plant structure and high fruit quality.</p>',
   'Pepper Seedling — Bereket Fide',
   JSON_ARRAY('pepper', 'seedling', 'sweet pepper', 'hot pepper', 'bell pepper'),
   JSON_OBJECT('type', 'Various', 'category', 'Pepper', 'varieties', 'Sweet, Hot, Bell, Long'),
   'Pepper Seedling | Bereket Fide',
   'Quality and productive pepper seedlings. Sweet, hot, bell and long pepper varieties.'),

  -- ===================== Aşılı Biber (bf-prd-0004) =====================
  ('bf-prd-0004', 'tr', 'Aşılı Biber Fidesi', 'asili-biber-fidesi',
   '<p>Güçlü anaçlar üzerine aşılanan biber fideleri, toprak kaynaklı hastalıklara karşı üstün dayanıklılık sağlar. Daha uzun hasat dönemi ve daha yüksek verim için idealdir.</p>',
   'Aşılı Biber Fidesi — Bereket Fide',
   JSON_ARRAY('aşılı', 'biber', 'dayanıklı', 'yüksek verim'),
   JSON_OBJECT('tip', 'Aşılı', 'kategori', 'Biber', 'dayanıklılık', 'Yüksek'),
   'Aşılı Biber Fidesi | Bereket Fide',
   'Toprak hastalıklarına dayanıklı, yüksek verimli aşılı biber fideleri.'),
  ('bf-prd-0004', 'en', 'Grafted Pepper Seedling', 'grafted-pepper-seedling',
   '<p>Pepper seedlings grafted onto strong rootstocks provide superior resistance to soil-borne diseases. Ideal for longer harvest periods and higher yields.</p>',
   'Grafted Pepper Seedling — Bereket Fide',
   JSON_ARRAY('grafted', 'pepper', 'resistant', 'high yield'),
   JSON_OBJECT('type', 'Grafted', 'category', 'Pepper', 'resistance', 'High'),
   'Grafted Pepper Seedling | Bereket Fide',
   'Soil-disease resistant, high-yield grafted pepper seedlings.'),

  -- ===================== Salatalık (bf-prd-0005) =====================
  ('bf-prd-0005', 'tr', 'Salatalık Fidesi', 'salatalik-fidesi',
   '<p>Sofralık ve turşuluk çeşitlerde üretilen salatalık fideleri. Yüksek verim kapasitesi, düzgün meyve yapısı ve hastalıklara dayanıklılığı ile dikkat çeker.</p>',
   'Salatalık Fidesi — Bereket Fide',
   JSON_ARRAY('salatalık', 'fide', 'sofralık', 'turşuluk'),
   JSON_OBJECT('tip', 'Normal', 'kategori', 'Salatalık', 'çeşitler', 'Sofralık, Turşuluk'),
   'Salatalık Fidesi | Bereket Fide',
   'Sofralık ve turşuluk salatalık fideleri. Yüksek verim, düzgün meyve yapısı.'),
  ('bf-prd-0005', 'en', 'Cucumber Seedling', 'cucumber-seedling',
   '<p>Cucumber seedlings produced in table and pickling varieties. Noted for high yield capacity, uniform fruit structure, and disease resistance.</p>',
   'Cucumber Seedling — Bereket Fide',
   JSON_ARRAY('cucumber', 'seedling', 'table', 'pickling'),
   JSON_OBJECT('type', 'Standard', 'category', 'Cucumber', 'varieties', 'Table, Pickling'),
   'Cucumber Seedling | Bereket Fide',
   'Table and pickling cucumber seedlings. High yield, uniform fruit structure.'),

  -- ===================== Hıyar (bf-prd-0006) =====================
  ('bf-prd-0006', 'tr', 'Hıyar Fidesi', 'hiyar-fidesi',
   '<p>Sera ve açık tarla koşullarına uygun hıyar fideleri. İnce kabuklu, çıtır ve lezzetli meyve yapısıyla sofralık tüketime idealdir. Erken hasat imkanı ve yüksek verim potansiyeli sunar.</p>',
   'Hıyar Fidesi — Bereket Fide',
   JSON_ARRAY('hıyar', 'fide', 'sera', 'sofralık'),
   JSON_OBJECT('tip', 'Normal', 'kategori', 'Hıyar', 'kullanım', 'Sofralık', 'yetiştiriclik', 'Sera & Açık tarla'),
   'Hıyar Fidesi | Bereket Fide',
   'Sera ve açık tarla için uygun, yüksek verimli hıyar fideleri. Bereket Fide güvencesiyle.'),
  ('bf-prd-0006', 'en', 'Snack Cucumber Seedling', 'snack-cucumber-seedling',
   '<p>Snack cucumber seedlings suitable for greenhouse and open-field conditions. With thin skin, crispy and flavorful fruit structure, ideal for fresh consumption. Offers early harvest and high yield potential.</p>',
   'Snack Cucumber Seedling — Bereket Fide',
   JSON_ARRAY('snack cucumber', 'seedling', 'greenhouse', 'table'),
   JSON_OBJECT('type', 'Standard', 'category', 'Snack Cucumber', 'usage', 'Fresh consumption', 'cultivation', 'Greenhouse & Open field'),
   'Snack Cucumber Seedling | Bereket Fide',
   'High-yield snack cucumber seedlings for greenhouse and open field. Assured by Bereket Fide.'),

  -- ===================== Kavun (bf-prd-0007) =====================
  ('bf-prd-0007', 'tr', 'Kavun Fidesi', 'kavun-fidesi',
   '<p>Aromatik ve tatlı kavun çeşitlerinden üretilen kavun fideleri. Güçlü kök yapısı, erken olgunlaşma ve yüksek şeker oranı ile öne çıkar. Açık tarla yetiştiriciliğine en uygun fide çeşitleri.</p>',
   'Kavun Fidesi — Bereket Fide',
   JSON_ARRAY('kavun', 'fide', 'tatlı kavun', 'açık tarla'),
   JSON_OBJECT('tip', 'Normal', 'kategori', 'Kavun', 'lezzet', 'Yüksek şeker oranı', 'yetiştiriclik', 'Açık tarla'),
   'Kavun Fidesi | Bereket Fide',
   'Aromatik, tatlı ve yüksek verimli kavun fideleri. Bereket Fide kalitesiyle.'),
  ('bf-prd-0007', 'en', 'Melon Seedling', 'melon-seedling',
   '<p>Melon seedlings produced from aromatic and sweet melon varieties. Distinguished by strong root structure, early maturation and high sugar content. Best suited for open-field cultivation.</p>',
   'Melon Seedling — Bereket Fide',
   JSON_ARRAY('melon', 'seedling', 'sweet melon', 'open field'),
   JSON_OBJECT('type', 'Standard', 'category', 'Melon', 'flavor', 'High sugar content', 'cultivation', 'Open field'),
   'Melon Seedling | Bereket Fide',
   'Aromatic, sweet and high-yield melon seedlings. Bereket Fide quality assured.'),

  -- ===================== Aşılı Karpuz (bf-prd-0008) =====================
  ('bf-prd-0008', 'tr', 'Aşılı Karpuz Fidesi', 'asili-karpuz-fidesi',
   '<p>Özel kabak anaçları üzerine aşılanan karpuz fideleri, fusarium solgunluğuna ve toprak kökenli hastalıklara karşı tam dayanıklılık sağlar. Büyük meyve boyutu, yüksek şeker oranı ve uzun raf ömrü sunar. Profesyonel sera ve açık tarla üreticileri için idealdir.</p>',
   'Aşılı Karpuz Fidesi — Bereket Fide',
   JSON_ARRAY('aşılı', 'karpuz', 'dayanıklı', 'büyük meyve', 'fusarium'),
   JSON_OBJECT('tip', 'Aşılı', 'kategori', 'Karpuz', 'dayanıklılık', 'Fusarium & Toprak hastalıkları', 'anaç', 'Kabak anacı'),
   'Aşılı Karpuz Fidesi | Bereket Fide',
   'Fusarium ve toprak hastalıklarına dayanıklı, büyük meyveli aşılı karpuz fideleri.'),
  ('bf-prd-0008', 'en', 'Grafted Watermelon Seedling', 'grafted-watermelon-seedling',
   '<p>Watermelon seedlings grafted onto special squash rootstocks provide full resistance to fusarium wilt and soil-borne diseases. Offers large fruit size, high sugar content and long shelf life. Ideal for professional greenhouse and open-field growers.</p>',
   'Grafted Watermelon Seedling — Bereket Fide',
   JSON_ARRAY('grafted', 'watermelon', 'resistant', 'large fruit', 'fusarium'),
   JSON_OBJECT('type', 'Grafted', 'category', 'Watermelon', 'resistance', 'Fusarium & Soil diseases', 'rootstock', 'Squash rootstock'),
   'Grafted Watermelon Seedling | Bereket Fide',
   'Fusarium and soil-disease resistant, large-fruited grafted watermelon seedlings.')
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
