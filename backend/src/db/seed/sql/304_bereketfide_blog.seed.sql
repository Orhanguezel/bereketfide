-- =============================================================
-- FILE: 304_bereketfide_blog.seed.sql
-- Bereket Fide — Blog / haber yazıları (custom_pages) + i18n (TR/EN)
-- module_key = 'bereketfide_blog'
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
  ('bb010001-5001-4001-9001-bbbbbbbb0001', 'bereketfide_blog', 1, 1, 10, 10, '/media/blog-placeholder.svg', NULL, '/media/blog-placeholder.svg', NULL, '[]', '[]', NULL, NULL),
  ('bb010002-5002-4002-9002-bbbbbbbb0002', 'bereketfide_blog', 1, 1, 20, 20, '/media/blog-placeholder.svg', NULL, '/media/blog-placeholder.svg', NULL, '[]', '[]', NULL, NULL),
  ('bb010003-5003-4003-9003-bbbbbbbb0003', 'bereketfide_blog', 1, 0, 30, 30, '/media/blog-placeholder.svg', NULL, '/media/blog-placeholder.svg', NULL, '[]', '[]', NULL, NULL),
  ('bb010004-5004-4004-9004-bbbbbbbb0004', 'bereketfide_blog', 1, 0, 40, 40, '/media/blog-placeholder.svg', NULL, '/media/blog-placeholder.svg', NULL, '[]', '[]', NULL, NULL)
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
    'Fide Bakımı ve Sulama Teknikleri Rehberi',
    'fide-bakimi-ve-sulama-teknikleri',
    JSON_OBJECT('html', '<p>Sağlıklı bir hasat için fidenin ilk günlerdeki bakımı kritiktir. Doğru sulama ve iklimlendirme verimin temelidir.</p><h2>Doğru Sulama Zamanı</h2><p>Fideler güneşin en tepede olduğu saatlerde sulanmamalıdır. Sabahın erken saatleri veya akşam serinliği en ideal zamanlardır.</p><h2>Nem Kontrolü</h2><p>Sera içerisindeki nem oranının dengelenmesi, mantari hastalıkların önlenmesi için hayati önem taşır. Havalandırma pencerelerinin doğru kullanımı bu dengeyi sağlar.</p>'),
    'Fideleriniz için doğru sulama periyotları ve nem kontrolü hakkında pratik bilgiler.',
    'Fide Bakımı ve Sulama Rehberi | Bereket Fide Bilgi Bankası',
    'Fidelerin sağlıklı büyümesi için sulama teknikleri, nem kontrolü ve bakım önerileri.',
    'fide bakımı, sulama, tarım rehberi'
  ),
  (
    'bb020002-6002-4002-a002-bbbbbbbb0002',
    'bb010002-5002-4002-9002-bbbbbbbb0002',
    'tr',
    'Neden Aşılı Fide Tercih Etmelisiniz?',
    'neden-asili-fide-tercih-etmelisiniz',
    JSON_OBJECT('html', '<p>Aşılı fide kullanımı, modern tarımda verimliliği artıran en önemli unsurlardan biridir. Peki avantajları nelerdir?</p><h2>Toprak Hastalıklarına Direnç</h2><p>Aşılı fideler, topraktan bulaşabilecek nematod ve fusarium gibi hastalıklara karşı doğal dirence sahiptir.</p><h2>Yüksek Verim ve Güçlü Kök</h2><p>Daha güçlü kök yapısı sayesinde bitki topraktaki besin elementlerini daha iyi emerek %30-50 arasında verim artışı sağlar.</p>'),
    'Aşılı fidenin sağladığı hastalık direnci ve verim artışı gibi temel avantajlar.',
    'Aşılı Fide Avantajları | Bereket Fide Bilgi Bankası',
    'Neden aşılı fide kullanmalıyız? Hastalık direnci, verim artışı ve güçlü kök yapısı hakkında bilgiler.',
    'aşılı fide avantajları, dirençli fide, yüksek verim'
  ),
  (
    'bb020003-6003-4003-a003-bbbbbbbb0003',
    'bb010003-5003-4003-9003-bbbbbbbb0003',
    'tr',
    'Sera ve Tarlada Zararlı Mücadelesi',
    'sera-ve-tarlada-zararli-mucadelesi',
    JSON_OBJECT('html', '<p>Zararlılarla mücadelede biyolojik ve teknik önlemler bitki sağlığı için vazgeçilmezdir. İşte en iyi yöntemler.</p><h2>Biyolojik Mücadele</h2><p>Kimyasal ilaç kullanımını azaltmak için faydalı böceklerin ve biyolojik tuzakların kullanımı sürdürülebilir tarım için kritiktir.</p><h2>Gözlem ve Erken Teşhis</h2><p>Fidelerin düzenli kontrolü, zararlıların yayılmadan tespit edilmesini sağlar. Yapışkan tuzakların kullanımı bu süreçte yardımcı olur.</p>'),
    'Sebze üretiminde karşılaşılan zararlılar ve doğal mücadele yöntemleri.',
    'Zararlı Mücadelesi Rehberi | Bereket Fide Bilgi Bankası',
    'Fide ve sebze gelişiminde zararlı kontrolü, biyolojik mücadele ve koruma yöntemleri.',
    'zararlı mücadelesi, biyolojik tarım, sera koruma'
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
    'Seedling Care and Irrigation Techniques Guide',
    'seedling-care-and-irrigation-techniques',
    JSON_OBJECT('html', '<p>Caring for seedlings in the first few days is critical for a healthy harvest. Correct irrigation and air conditioning are the basis of yield.</p><h2>Right Irrigation Time</h2><p>Seedlings should not be watered during the hours when the sun is at its highest. Early morning or evening cool are the ideal times.</p><h2>Humidity Control</h2><p>Balancing the humidity level in the greenhouse is vital to prevent fungal diseases. Correct use of ventilation windows provides this balance.</p>'),
    'Practical information about the correct irrigation periods and humidity control for your seedlings.',
    'Seedling Care and Irrigation Guide | Bereket Fide Knowledge Base',
    'Irrigation techniques, humidity control, and care suggestions for healthy growth of seedlings.',
    'seedling care, irrigation, agricultural guide'
  ),
  (
    'bb020006-6006-4006-a006-bbbbbbbb0006',
    'bb010002-5002-4002-9002-bbbbbbbb0002',
    'en',
    'Why Should You Choose Grafted Seedlings?',
    'why-choose-grafted-seedlings',
    JSON_OBJECT('html', '<p>The use of grafted seedlings is one of the most important factors increasing productivity in modern agriculture. So what are the advantages?</p><h2>Resistance to Soil Diseases</h2><p>Grafted seedlings have natural resistance against diseases such as nematodes and fusarium that can be transmitted from the soil.</p><h2>High Yield and Strong Roots</h2><p>Thanks to the stronger root structure, the plant absorbs the nutrient elements in the soil better and provides a yield increase between 30-50%.</p>'),
    'Key advantages of grafted seedlings such as disease resistance and yield increase.',
    'Advantages of Grafted Seedlings | Bereket Fide Knowledge Base',
    'Why use grafted seedlings? Information about disease resistance, yield increase, and strong root structure.',
    'grafted seedling advantages, resistant seedling, high yield'
  ),
  (
    'bb020007-6007-4007-a007-bbbbbbbb0007',
    'bb010003-5003-4003-9003-bbbbbbbb0003',
    'en',
    'Pest Control in Greenhouses and Fields',
    'pest-control-in-greenhouses-and-fields',
    JSON_OBJECT('html', '<p>Biological and technical measures are indispensable for plant health in pest control. Here are the best methods.</p><h2>Biyolojik Mücadele</h2><p>The use of beneficial insects and biological traps is critical for sustainable agriculture to reduce the use of chemical pesticides.</p><h2>Observation and Early Diagnosis</h2><p>Regular checking of seedlings allows pests to be detected before they spread. The use of sticky traps helps in this process.</p>'),
    'Pests encountered in vegetable production and natural control methods.',
    'Pest Control Guide | Bereket Fide Knowledge Base',
    'Pest control, biological control, and protection methods in seedling and vegetable development.',
    'pest control, biological farming, greenhouse protection'
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
