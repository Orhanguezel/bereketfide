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
-- 1) CLEANUP EXISTING NEWS
-- =========================
DELETE FROM `custom_pages` WHERE `module_key` = 'news';

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
  -- Haber 1: Güneş Enerjisi
  ('nw010001-5001-4001-9001-nnnnnnnn0001', 'news', 1, 1, 10, 10,
   '/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0',
   '/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0',
   JSON_ARRAY('/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (3).jpeg', '/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (1).jpeg'),
   JSON_ARRAY('d0829871-469a-46ae-b243-b537aff49ec0', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315'),
   'nccc0001-4001-4001-8001-nncccccc0001', NULL),
  -- Haber 2: Dikim Rehberi
  ('nw010002-5002-4002-9002-nnnnnnnn0002', 'news', 1, 1, 20, 20,
   '/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315',
   '/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315',
   JSON_ARRAY('/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (1).jpeg'), JSON_ARRAY('33bfb1c6-6eeb-44a0-a351-1ed0ffab0315'),
   'nccc0003-4003-4003-8003-nncccccc0003', NULL),
  -- Haber 3: İnovasyon
  ('nw010003-5003-4003-9003-nnnnnnnn0003', 'news', 1, 0, 30, 30,
   '/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0',
   '/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0',
   JSON_ARRAY('/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (3).jpeg'), JSON_ARRAY('d0829871-469a-46ae-b243-b537aff49ec0'),
   'nccc0002-4002-4002-8002-nncccccc0002', NULL),
  -- Haber 4: Üretim Kapasitesi
  ('nw010004-5004-4004-9004-nnnnnnnn0004', 'news', 1, 0, 40, 40,
   '/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315',
   '/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315',
   JSON_ARRAY('/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (1).jpeg'), JSON_ARRAY('33bfb1c6-6eeb-44a0-a351-1ed0ffab0315'),
   'nccc0004-4004-4004-8004-nncccccc0004', NULL),
  -- Haber 5: Genç Çiftçiler
  ('nw010005-5005-4005-9005-nnnnnnnn0005', 'news', 1, 1, 50, 50,
   '/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0',
   '/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0',
   JSON_ARRAY('/uploads/products/WhatsApp Image 2026-03-17 at 23.28.37 (3).jpeg'), JSON_ARRAY('d0829871-469a-46ae-b243-b537aff49ec0'),
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
    '2025 İlkbahar Sipariş Planlama Takvimi Yayında',
    '2025-ilkbahar-siparis-planlama-takvimi',
    JSON_OBJECT('html', '<p>Yeni sezon için sipariş planlama takvimimizi üreticilerimizle paylaşıyoruz. Bölgesel sevkiyat ve teslim süreçleri belirli periyotlarla ilerleyecektir.</p>'),
    'Yeni sezon sipariş ve sevkiyat planlama duyurusu.',
    'Sipariş Takvimi 2025 | Bereket Fide',
    '2025 ilkbahar sezonu sipariş planlama ve teslim süreci duyurusu.',
    'sipariş takvimi, sezon duyurusu, fide teslimatı'
  ),
  (
    'nw020002-6002-4002-a002-nnnnnnnn0002',
    'nw010002-5002-4002-9002-nnnnnnnn0002',
    'tr',
    'Antalya Aksu Tesisimizde Sera Modernizasyonu Tamamlandı',
    'antalya-aksu-sera-modernizasyonu-tamamlandi',
    JSON_OBJECT('html', '<p>Üretim altyapımızı güçlendirmek amacıyla planlanan sera modernizasyon çalışmaları tamamlandı. Yeni sistemler ile iklim ve sulama kontrolü daha verimli hale getirildi.</p>'),
    'Sera modernizasyon sürecimiz tamamlandı.',
    'Sera Modernizasyonu | Bereket Fide',
    'Antalya Aksu tesisimizde tamamlanan sera modernizasyon duyurusu.',
    'sera modernizasyonu, tesis yatırımı, üretim altyapısı'
  ),
  (
    'nw020003-6003-4003-a003-nnnnnnnn0003',
    'nw010003-5003-4003-9003-nnnnnnnn0003',
    'tr',
    'Bereket Fide Tarla Günleri Bu Ay Başlıyor',
    'bereket-fide-tarla-gunleri-basliyor',
    JSON_OBJECT('html', '<p>Üreticilerimizle sahada bir araya geleceğimiz tarla günü programımız bu ay başlıyor. Program kapsamında çeşit performansları ve sezon uygulamaları paylaşılacak.</p>'),
    'Tarla günü etkinlik programı başlıyor.',
    'Tarla Günleri | Bereket Fide',
    'Üreticilerimizle sahada buluşacağımız tarla günü etkinlik duyurusu.',
    'tarla günleri, etkinlik, üretici buluşması'
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
    '2025 Spring Order Planning Calendar Is Now Available',
    '2025-spring-order-planning-calendar',
    JSON_OBJECT('html', '<p>We are sharing our new season planning calendar with growers. Regional shipment and delivery operations will proceed according to scheduled periods.</p>'),
    'New season order and shipment planning announcement.',
    'Order Calendar 2025 | Bereket Fide',
    'Announcement for the 2025 spring season order planning and delivery process.',
    'order calendar, season announcement, seedling delivery'
  ),
  (
    'nw020007-6007-4007-a007-nnnnnnnn0007',
    'nw010002-5002-4002-9002-nnnnnnnn0002',
    'en',
    'Greenhouse Modernization Completed at Our Antalya Aksu Facility',
    'greenhouse-modernization-completed-at-antalya-aksu',
    JSON_OBJECT('html', '<p>The greenhouse modernization program designed to strengthen our production infrastructure has been completed. New systems have improved climate and irrigation control efficiency.</p>'),
    'Our greenhouse modernization process has been completed.',
    'Greenhouse Modernization | Bereket Fide',
    'Announcement for the completed greenhouse modernization at our Antalya Aksu facility.',
    'greenhouse modernization, facility investment, production infrastructure'
  ),
  (
    'nw020008-6008-4008-a008-nnnnnnnn0008',
    'nw010003-5003-4003-9003-nnnnnnnn0003',
    'en',
    'Bereket Fide Field Days Start This Month',
    'bereket-fide-field-days-start-this-month',
    JSON_OBJECT('html', '<p>Our field day program, where we meet growers on site, starts this month. Variety performance and seasonal practices will be shared during the program.</p>'),
    'Our field day event schedule is starting.',
    'Field Days | Bereket Fide',
    'Announcement for our field day events with growers.',
    'field days, event, grower meeting'
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
