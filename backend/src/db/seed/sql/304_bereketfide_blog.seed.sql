-- =============================================================
-- FILE: 304_bereketfide_blog.seed.sql
-- Bereket Fide — Blog / haber yazıları (custom_pages) + i18n (TR/EN)
-- module_key = 'blog'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================
-- 1) CLEANUP EXISTING BLOG POSTS
-- =========================
DELETE FROM `custom_pages` WHERE `module_key` IN ('blog', 'bereketfide_blog');

-- =========================
-- 2) CUSTOM PAGES (BASE)
-- =========================
INSERT INTO `custom_pages`
(
  `id`,
  `module_key`,
  `is_published`,
  `featured`,
  `display_order`,
  `order_num`,
  `featured_image`,
  `featured_image_asset_id`,
  `image_url`,
  `storage_asset_id`,
  `images`,
  `storage_image_ids`,
  `category_id`,
  `sub_category_id`
)
VALUES
  ('bb010001-5001-4001-9001-bbbbbbbb0001', 'blog', 1, 1, 10, 10, '/uploads/products/23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0', '/uploads/products/23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0', '[]', '[]', NULL, NULL),
  ('bb010002-5002-4002-9002-bbbbbbbb0002', 'blog', 1, 1, 20, 20, '/uploads/products/23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315', '/uploads/products/23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315', '[]', '[]', NULL, NULL),
  ('bb010003-5003-4003-9003-bbbbbbbb0003', 'blog', 1, 0, 30, 30, '/uploads/products/23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0', '/uploads/products/23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0', '[]', '[]', NULL, NULL),
  ('bb010004-5004-4004-9004-bbbbbbbb0004', 'blog', 1, 0, 40, 40, '/uploads/products/23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315', '/uploads/products/23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315', '[]', '[]', NULL, NULL)
ON DUPLICATE KEY UPDATE
  `module_key`   = VALUES(`module_key`),
  `is_published` = VALUES(`is_published`),
  `featured`     = VALUES(`featured`),
  `display_order`= VALUES(`display_order`),
  `featured_image` = VALUES(`featured_image`),
  `image_url` = VALUES(`image_url`);

-- =========================
-- 2) CUSTOM PAGES I18N — TR
-- =========================
INSERT INTO `custom_pages_i18n`
(
  `id`,
  `page_id`,
  `locale`,
  `title`,
  `slug`,
  `content`,
  `summary`,
  `meta_title`,
  `meta_description`,
  `tags`
)
VALUES
  (
    'bb020001-6001-4001-a001-bbbbbbbb0001',
    'bb010001-5001-4001-9001-bbbbbbbb0001',
    'tr',
    'Modern Seralarımızda Güneş Enerjisi ile Sürdürülebilir Üretim',
    'modern-seralarimizda-gunes-enerjisi-ile-surdurulebilir-uretim',
    JSON_OBJECT('html', '<p>Bereket Fide olarak üretimde sürdürülebilirliği yalnızca bir hedef değil, günlük operasyonlarımızın doğal parçası olarak görüyoruz.</p><h2>Enerji Verimliliği Odaklı Sera Altyapısı</h2><p>Modern seralarımızda iklim kontrolü, sulama ve üretim süreçleri enerji verimliliğini destekleyecek şekilde planlanır. Bu yaklaşım hem üretim kalitesini korur hem de kaynak kullanımını dengeler.</p><h2>Güneş Enerjisi ile Desteklenen Üretim</h2><p>Tesislerimizde kullanılan yenilenebilir enerji yaklaşımı sayesinde çevresel etkileri azaltmayı ve daha istikrarlı bir üretim modeli oluşturmayı hedefliyoruz. Böylece yüksek kaliteli fide üretimini daha sorumlu bir altyapı ile sürdürüyoruz.</p>'),
    'Güneş enerjisi ile çevreci fide üretimi.',
    'Sürdürülebilir Üretim | Bereket Fide Blog',
    'Modern seralarımızda güneş enerjisi ve sürdürülebilir üretim yaklaşımımız.',
    'sürdürülebilir üretim, güneş enerjisi, sera teknolojisi'
  ),
  (
    'bb020002-6002-4002-a002-bbbbbbbb0002',
    'bb010002-5002-4002-9002-bbbbbbbb0002',
    'tr',
    '2025 Sezonu Aşılı Fide Dikim Rehberi',
    '2025-sezonu-asili-fide-dikim-rehberi',
    JSON_OBJECT('html', '<p>Aşılı fide ile yüksek performanslı üretim hedefleyen yetiştiriciler için dikim öncesi planlama kritik önemdedir.</p><h2>Dikim Öncesi Hazırlık</h2><p>Toprak yapısının kontrol edilmesi, sulama planının hazırlanması ve sera ya da tarla koşullarının fideye uygun hale getirilmesi sezon başlangıcında büyük fark yaratır.</p><h2>Sağlıklı Başlangıç, Dengeli Gelişim</h2><p>Aşılı fidelerin güçlü kök yapısından en iyi şekilde yararlanmak için dikim sıklığı, ilk sulama ve adaptasyon dönemi dikkatle yönetilmelidir. Doğru başlangıç, sezon boyunca daha istikrarlı gelişim sağlar.</p>'),
    'Aşılı fide dikim teknikleri.',
    'Aşılı Fide Dikim Rehberi 2025 | Bereket Fide Blog',
    '2025 sezonunda aşılı fide dikimi için temel hazırlık ve uygulama önerileri.',
    'aşılı fide, dikim rehberi, 2025 sezonu'
  ),
  (
    'bb020003-6003-4003-a003-bbbbbbbb0003',
    'bb010003-5003-4003-9003-bbbbbbbb0003',
    'tr',
    'Fide Kalitesini Artıran İnovatif Yaklaşımlar',
    'fide-kalitesini-artiran-inovatif-yaklasimlar',
    JSON_OBJECT('html', '<p>Kaliteli fide üretimi, yalnızca iyi tohum seçimiyle değil; süreç boyunca uygulanan yenilikçi yöntemlerle mümkün olur.</p><h2>Kontrollü Üretim Süreçleri</h2><p>Isı, nem, sulama ve besleme parametrelerinin kontrollü şekilde yönetilmesi, gelişim sürecinde daha homojen ve güçlü fideler elde edilmesini sağlar.</p><h2>Veri ve Gözleme Dayalı İyileştirme</h2><p>Üretim sahasında yapılan düzenli gözlemler ve performans takibi, kaliteyi artıran kararların daha hızlı alınmasına yardımcı olur. Bu yaklaşım, sezon boyunca daha güçlü ve güvenilir sonuçlar üretir.</p>'),
    'Kaliteli fide üretimi için inovasyon.',
    'İnovatif Fide Üretimi | Bereket Fide Blog',
    'Fide kalitesini artıran inovatif üretim ve kontrol yaklaşımları.',
    'fide kalitesi, inovasyon, üretim teknolojisi'
  ),
  (
    'bb020004-6004-4004-a004-bbbbbbbb0004',
    'bb010004-5004-4004-9004-bbbbbbbb0004',
    'tr',
    'Fide Dikim Öncesi Toprak Hazırlığı',
    'fide-dikim-oncesi-toprak-hazirligi',
    JSON_OBJECT('html', '<p>Tarlanın fide dikimine hazırlanması, köklerin tutunma başarısını doğrudan etkiler. Adım adım hazırlık süreci.</p><h2>Toprak Analizi</h2><p>Dikim öncesi mutlaka toprak analizi yaptırılmalı ve ihtiyaç duyulan elementler belirlenmelidir.</p><h2>Gübreleme ve İşleme</h2><p>Toprağın havalandırılması ve organik madde miktarının artırılması, fidenin yeni yerine adaptasyonunu hızlandırır.</p>'),
    'Daha başarılı bir dikim için toprak analizi, gübreleme ve havalandırma önerileri.',
    'Toprak Hazırlığı Rehberi | Bereket Fide Bilgi Bankası',
    'Fide dikiminden önce yapılması gereken toprak analizi ve hazırlık aşamaları.',
    'toprak hazırlığı, fide dikimi, gübreleme'
  )
ON DUPLICATE KEY UPDATE
  `title`            = VALUES(`title`),
  `slug`             = VALUES(`slug`),
  `content`          = VALUES(`content`),
  `summary`          = VALUES(`summary`),
  `meta_title`       = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `tags`             = VALUES(`tags`);

-- =========================
-- 3) CUSTOM PAGES I18N — EN
-- =========================
INSERT INTO `custom_pages_i18n`
(
  `id`,
  `page_id`,
  `locale`,
  `title`,
  `slug`,
  `content`,
  `summary`,
  `meta_title`,
  `meta_description`,
  `tags`
)
VALUES
  (
    'bb020005-6005-4005-a005-bbbbbbbb0005',
    'bb010001-5001-4001-9001-bbbbbbbb0001',
    'en',
    'Sustainable Production with Solar Energy in Our Modern Greenhouses',
    'sustainable-production-with-solar-energy-in-our-modern-greenhouses',
    JSON_OBJECT('html', '<p>At Bereket Fide, we treat sustainability as a practical part of daily production rather than a separate initiative.</p><h2>Energy-Efficient Greenhouse Infrastructure</h2><p>Climate control, irrigation and production systems in our modern greenhouses are planned to support efficient resource use while maintaining stable product quality.</p><h2>Renewable Energy Supported Production</h2><p>By integrating a renewable energy approach into our facilities, we aim to reduce environmental impact and build a more resilient production model for high quality seedlings.</p>'),
    'Eco-friendly seedling production with solar energy.',
    'Sustainable Production | Bereket Fide Blog',
    'Our approach to sustainable seedling production with solar energy and modern greenhouse systems.',
    'sustainable production, solar energy, greenhouse systems'
  ),
  (
    'bb020006-6006-4006-a006-bbbbbbbb0006',
    'bb010002-5002-4002-9002-bbbbbbbb0002',
    'en',
    '2025 Season Grafted Seedling Planting Guide',
    '2025-season-grafted-seedling-planting-guide',
    JSON_OBJECT('html', '<p>For growers targeting high performance production with grafted seedlings, planning before planting is essential.</p><h2>Preparation Before Planting</h2><p>Checking soil structure, preparing irrigation planning and aligning greenhouse or field conditions with the crop helps the season start in a stronger way.</p><h2>Healthy Start, Balanced Development</h2><p>To benefit from the strong root structure of grafted seedlings, planting density, first irrigation and the adaptation period should be managed carefully from day one.</p>'),
    'Grafted seedling planting techniques.',
    '2025 Grafted Seedling Planting Guide | Bereket Fide Blog',
    'Core preparation and application notes for grafted seedling planting in the 2025 season.',
    'grafted seedlings, planting guide, 2025 season'
  ),
  (
    'bb020007-6007-4007-a007-bbbbbbbb0007',
    'bb010003-5003-4003-9003-bbbbbbbb0003',
    'en',
    'Innovative Approaches That Improve Seedling Quality',
    'innovative-approaches-that-improve-seedling-quality',
    JSON_OBJECT('html', '<p>High quality seedling production depends not only on seed selection but also on the innovative practices applied throughout the production cycle.</p><h2>Controlled Production Processes</h2><p>Managing temperature, humidity, irrigation and nutrition in a controlled way helps deliver more uniform and stronger seedlings.</p><h2>Observation and Data Driven Improvement</h2><p>Regular monitoring in the production area makes it easier to take timely quality decisions and maintain reliable results across the season.</p>'),
    'Innovation for quality seedling production.',
    'Innovative Seedling Production | Bereket Fide Blog',
    'Innovative production and control methods that improve seedling quality.',
    'seedling quality, innovation, production methods'
  ),
  (
    'bb020008-6008-4008-a008-bbbbbbbb0008',
    'bb010004-5004-4004-9004-bbbbbbbb0004',
    'en',
    'Soil Preparation Before Seedling Planting',
    'soil-preparation-before-planting',
    JSON_OBJECT('html', '<p>Preparing the field for seedling planting directly affects the success of the roots. Step-by-step preparation process.</p><h2>Soil Analysis</h2><p>Soil analysis should definitely be performed before planting and the required elements should be determined.</p><h2>Fertilization and Processing</h2><p>Aerating the soil and increasing the amount of organic matter accelerates the adaptation of the seedling to its new place.</p>'),
    'Soil analysis, fertilization, and aeration suggestions for a more successful planting.',
    'Soil Preparation Guide | Bereket Fide Knowledge Base',
    'Soil analysis and preparation stages that should be done before seedling planting.',
    'soil preparation, seedling planting, fertilization'
  )
ON DUPLICATE KEY UPDATE
  `title`            = VALUES(`title`),
  `slug`             = VALUES(`slug`),
  `content`          = VALUES(`content`),
  `summary`          = VALUES(`summary`),
  `meta_title`       = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `tags`             = VALUES(`tags`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
