-- =============================================================
-- FILE: 310_bereketfide_news.seed.sql
-- Bereket Fide — Haberler / News (custom_pages) + i18n (TR/EN)
-- module_key = 'news'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================
-- 1) CUSTOM PAGES (BASE)
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
  -- Röportaj: Tolkan Mimarlık (Röportajlar kategorisi)
  ('nw010001-5001-4001-9001-nnnnnnnn0001', 'news', 1, 1, 10, 10,
   '/uploads/news/tolgahan-sahin-tolkan-mimarlik.jpg', 'sa-news-0001-0001-0001-000000000001',
   '/uploads/news/tolgahan-sahin-tolkan-mimarlik.jpg', 'sa-news-0001-0001-0001-000000000001',
   JSON_ARRAY('/uploads/news/tolgahan-sahin-tolkan-mimarlik.jpg', '/uploads/news/tolkan-mimarlik-ofis-projesi.jpg', '/uploads/news/tolkan-mimarlik-roportaj-dergi.jpg'),
   JSON_ARRAY('sa-news-0001-0001-0001-000000000001', 'sa-news-0002-0002-0002-000000000002', 'sa-news-0003-0003-0003-000000000003'),
   'nccc0001-4001-4001-8001-nncccccc0001', NULL),
  -- Proje Haberleri
  ('nw010002-5002-4002-9002-nnnnnnnn0002', 'news', 1, 1, 20, 20,
   '/uploads/news/istanbul-levent-ofis-kulesi.jpg', 'sa-news-0004-0004-0004-000000000004',
   '/uploads/news/istanbul-levent-ofis-kulesi.jpg', 'sa-news-0004-0004-0004-000000000004', '[]', '[]',
   'nccc0003-4003-4003-8003-nncccccc0003', NULL),
  -- Sektör Haberleri
  ('nw010003-5003-4003-9003-nnnnnnnn0003', 'news', 1, 0, 30, 30,
   '/uploads/news/depreme-dayanikli-yapi.jpg', 'sa-news-0005-0005-0005-000000000005',
   '/uploads/news/depreme-dayanikli-yapi.jpg', 'sa-news-0005-0005-0005-000000000005', '[]', '[]',
   'nccc0002-4002-4002-8002-nncccccc0002', NULL),
  -- Teknoloji
  ('nw010004-5004-4004-9004-nnnnnnnn0004', 'news', 1, 0, 40, 40,
   '/uploads/news/akilli-sehir-altyapi.jpg', 'sa-news-0006-0006-0006-000000000006',
   '/uploads/news/akilli-sehir-altyapi.jpg', 'sa-news-0006-0006-0006-000000000006', '[]', '[]',
   'nccc0004-4004-4004-8004-nncccccc0004', NULL),
  -- Sürdürülebilirlik
  ('nw010005-5005-4005-9005-nnnnnnnn0005', 'news', 1, 1, 50, 50,
   '/uploads/news/moduler-yapi-sistemleri.jpg', 'sa-news-0007-0007-0007-000000000007',
   '/uploads/news/moduler-yapi-sistemleri.jpg', 'sa-news-0007-0007-0007-000000000007', '[]', '[]',
   'nccc0005-4005-4005-8005-nncccccc0005', NULL)
ON DUPLICATE KEY UPDATE
  `module_key`   = VALUES(`module_key`),
  `is_published` = VALUES(`is_published`),
  `featured`     = VALUES(`featured`),
  `display_order`= VALUES(`display_order`),
  `featured_image` = VALUES(`featured_image`),
  `image_url` = VALUES(`image_url`),
  `images`       = VALUES(`images`),
  `category_id`  = VALUES(`category_id`);

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
    'nw020001-6001-4001-a001-nnnnnnnn0001',
    'nw010001-5001-4001-9001-nnnnnnnn0001',
    'tr',
    'Modern Seralarımızda Güneş Enerjisi ile Sürdürülebilir Üretim',
    'gunes-enerjisi-ile-surdurulebilir-fide-uretimi',
    JSON_OBJECT('html', '<p>Bereket Fide olarak doğaya olan sorumluluğumuzun bilincindeyiz. Antalya Aksu’daki tesisimizde enerji ihtiyacımızı güneşten karşılıyoruz.</p>'),
    'Güneş enerjisi ile çevreci fide üretimi.',
    'Güneş Enerjisi | Bereket Fide',
    'Modern seralarımızda güneş enerjisi kullanımı.',
    'sürdürülebilir tarım, güneş enerjisi'
  ),
  (
    'nw020002-6002-4002-a002-nnnnnnnn0002',
    'nw010002-5002-4002-9002-nnnnnnnn0002',
    'tr',
    '2025 Sezonu Aşılı Fide Dikim Rehberi',
    '2025-asili-fide-dikim-rehberi',
    JSON_OBJECT('html', '<p>Aşılı fidelerden maksimum verim alabilmek için dikim rehberimizi inceleyin.</p>'),
    'Aşılı fide dikim teknikleri.',
    'Dikim Rehberi 2025 | Bereket Fide',
    'Aşılı fide dikim ve bakım önerileri.',
    'aşılı fide, dikim rehberi'
  ),
  (
    'nw020003-6003-4003-a003-nnnnnnnn0003',
    'nw010003-5003-4003-9003-nnnnnnnn0003',
    'tr',
    'Fide Kalitesini Artıran İnovatif Yaklaşımlar',
    'fide-kalitesi-inovasyon',
    JSON_OBJECT('html', '<p>Üretim kalitemizi artırmak için en son teknolojileri kullanıyoruz.</p>'),
    'Kaliteli fide üretimi için inovasyon.',
    'İnovatif Fide Üretimi | Bereket Fide',
    'Fide üretiminde kullanılan modern teknolojiler.',
    'inovasyon, kaliteli fide'
  ),
  (
    'nw020004-6004-4004-a004-nnnnnnnn0004',
    'nw010004-5004-4004-9004-nnnnnnnn0004',
    'tr',
    'Yıllık Üretim Kapasitemizi 35 Milyona Çıkardık',
    'uretim-kapasitesi-artisi',
    JSON_OBJECT('html', '<p>Büyüyen tesislerimizle yıllık 35 milyon fide üretim kapasitesine ulaştık.</p>'),
    'Bereket Fide büyüme haberleri.',
    '35 Milyon Kapasite | Bereket Fide',
    'Üretim kapasitesi ve tesis büyüme haberleri.',
    'kapasite, büyüme'
  ),
  (
    'nw020005-6005-4005-a005-nnnnnnnn0005',
    'nw010005-5005-4005-9005-nnnnnnnn0005',
    'tr',
    'Geleceğin Tarımı İçin Genç Çiftçilere Destek',
    'genc-ciftci-destek-projeleri',
    JSON_OBJECT('html', '<p>Tarımın geleceği için genç üreticilerimizin yanındayız.</p>'),
    'Genç çiftçi destek projelerimiz.',
    'Genç Çiftçilere Destek | Bereket Fide',
    'Tarımın geleceği ve çiftçi destek projeleri.',
    'genç çiftçi, tarım geleceği'
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
    'nw020006-6006-4006-a006-nnnnnnnn0006',
    'nw010001-5001-4001-9001-nnnnnnnn0001',
    'en',
    'Sustainable Production with Solar Energy',
    'sustainable-production-with-solar-energy',
    JSON_OBJECT('html', '<p>We meet our energy needs from the sun at our facility in Antalya Aksu.</p>'),
    'Eco-friendly seedling production with solar energy.',
    'Solar Energy | Bereket Fide',
    'Solar energy use in our greenhouses.',
    'sustainable agriculture, solar energy'
  ),
  (
    'nw020007-6007-4007-a007-nnnnnnnn0007',
    'nw010002-5002-4002-9002-nnnnnnnn0002',
    'en',
    '2025 Season Grafted Seedling Planting Guide',
    '2025-grafted-seedling-planting-guide',
    JSON_OBJECT('html', '<p>Check out our guide to get maximum yield from grafted seedlings.</p>'),
    'Grafted seedling planting techniques.',
    'Planting Guide 2025 | Bereket Fide',
    'Grafted seedling planting and maintenance suggestions.',
    'grafted seedling, planting guide'
  ),
  (
    'nw020008-6008-4008-a008-nnnnnnnn0008',
    'nw010003-5003-4003-9003-nnnnnnnn0003',
    'en',
    'Innovative Approaches Enhancing Seedling Quality',
    'seedling-quality-innovation',
    JSON_OBJECT('html', '<p>We use the latest technologies to increase our production quality.</p>'),
    'Innovation for quality seedling production.',
    'Innovative Seedling Production | Bereket Fide',
    'Modern technologies used in seedling production.',
    'innovation, quality seedling'
  ),
  (
    'nw020009-6009-4009-a009-nnnnnnnn0009',
    'nw010004-5004-4004-9004-nnnnnnnn0004',
    'en',
    'We Increased Annual Production Capacity to 35 Million',
    'increased-production-capacity',
    JSON_OBJECT('html', '<p>We reached an annual production capacity of 35 million seedlings.</p>'),
    'Bereket Fide growth news.',
    '35 Million Capacity | Bereket Fide',
    'Production capacity and facility growth news.',
    'capacity, growth'
  ),
  (
    'nw020010-6010-4010-a010-nnnnnnnn0010',
    'nw010005-5005-4005-9005-nnnnnnnn0005',
    'en',
    'Support for Young Farmers for Future of Agriculture',
    'support-for-young-farmers',
    JSON_OBJECT('html', '<p>We stand by our young producers for the future of agriculture.</p>'),
    'Our young farmer support projects.',
    'Support for Young Farmers | Bereket Fide',
    'Future of agriculture and farmer support projects.',
    'young farmer, future of agriculture'
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
