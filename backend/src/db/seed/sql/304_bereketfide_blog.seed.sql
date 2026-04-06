-- =============================================================
-- FILE: 304_bereketfide_blog.seed.sql
-- Bereket Fide — Blog / haber yazıları (custom_pages) + i18n (TR/EN/DE)
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
  ('bb010001-5001-4001-9001-bbbbbbbb0001', 'blog', 1, 1, 10, 10, '/uploads/products/23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0', '/uploads/products/23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0', JSON_ARRAY('/uploads/products/23.28.37 (3).jpeg', '/uploads/products/23.28.37 (1).jpeg'), JSON_ARRAY('d0829871-469a-46ae-b243-b537aff49ec0', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315'), NULL, NULL),
  ('bb010002-5002-4002-9002-bbbbbbbb0002', 'blog', 1, 1, 20, 20, '/uploads/products/23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315', '/uploads/products/23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315', JSON_ARRAY('/uploads/products/23.28.37 (1).jpeg', '/uploads/products/23.28.37 (3).jpeg'), JSON_ARRAY('33bfb1c6-6eeb-44a0-a351-1ed0ffab0315', 'd0829871-469a-46ae-b243-b537aff49ec0'), NULL, NULL),
  ('bb010003-5003-4003-9003-bbbbbbbb0003', 'blog', 1, 0, 30, 30, '/uploads/products/23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0', '/uploads/products/23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0', JSON_ARRAY('/uploads/products/23.28.37 (3).jpeg'), JSON_ARRAY('d0829871-469a-46ae-b243-b537aff49ec0'), NULL, NULL),
  ('bb010004-5004-4004-9004-bbbbbbbb0004', 'blog', 1, 0, 40, 40, '/uploads/products/23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315', '/uploads/products/23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315', JSON_ARRAY('/uploads/products/23.28.37 (1).jpeg', '/uploads/products/23.28.37 (3).jpeg'), JSON_ARRAY('33bfb1c6-6eeb-44a0-a351-1ed0ffab0315', 'd0829871-469a-46ae-b243-b537aff49ec0'), NULL, NULL)
ON DUPLICATE KEY UPDATE
  `module_key`   = VALUES(`module_key`),
  `is_published` = VALUES(`is_published`),
  `featured`     = VALUES(`featured`),
  `display_order`= VALUES(`display_order`),
  `featured_image` = VALUES(`featured_image`),
  `image_url` = VALUES(`image_url`),
  `images` = VALUES(`images`),
  `storage_image_ids` = VALUES(`storage_image_ids`);

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
    JSON_OBJECT('html', '<p>Bereket Fide olarak üretimde sürdürülebilirliği yalnızca bir hedef değil, günlük operasyonlarımızın doğal parçası olarak görüyoruz.</p><h2>Enerji Verimliliği Odaklı Sera Altyapısı</h2><p>Modern seralarımızda iklim kontrolü, sulama ve üretim süreçleri enerji verimliliğini destekleyecek şekilde planlanır. Bu yaklaşım hem üretim kalitesini korur hem de kaynak kullanımını dengeler.</p><h2>Güneş Enerjisi ile Desteklenen Üretim</h2><p>Tesislerimizde kullanılan yenilenebilir enerji yaklaşımı sayesinde çevresel etkileri azaltmayı ve daha istikrarlı bir üretim modeli oluşturmayı hedefliyoruz. Böylece yüksek kaliteli fide üretimini daha sorumlu bir altyapı ile sürdürüyoruz.</p><p>Çeşit ve sera planlaması için <strong>info@bereketfide.com.tr</strong> üzerinden teknik ekibimize ulaşabilirsiniz.</p>'),
    'Güneş enerjisi ile çevreci fide üretimi.',
    'Sürdürülebilir Üretim | Bereket Fide Blog',
    'Antalya Aksu tesislerimizde güneş enerjisi ve sürdürülebilir fide üretimi; teknik danışmanlık için iletişim.',
    'sürdürülebilir üretim, güneş enerjisi, sera teknolojisi'
  ),
  (
    'bb020002-6002-4002-a002-bbbbbbbb0002',
    'bb010002-5002-4002-9002-bbbbbbbb0002',
    'tr',
    '2025 Sezonu Aşılı Fide Dikim Rehberi',
    '2025-sezonu-asili-fide-dikim-rehberi',
    JSON_OBJECT('html', '<p>Aşılı fide ile yüksek performanslı üretim hedefleyen yetiştiriciler için dikim öncesi planlama kritik önemdedir.</p><h2>Dikim Öncesi Hazırlık</h2><p>Toprak yapısının kontrol edilmesi, sulama planının hazırlanması ve sera ya da tarla koşullarının fideye uygun hale getirilmesi sezon başlangıcında büyük fark yaratır.</p><h2>Sağlıklı Başlangıç, Dengeli Gelişim</h2><p>Aşılı fidelerin güçlü kök yapısından en iyi şekilde yararlanmak için dikim sıklığı, ilk sulama ve adaptasyon dönemi dikkatle yönetilmelidir. Doğru başlangıç, sezon boyunca daha istikrarlı gelişim sağlar.</p><p>Bölgenize ve çeşide özel dikim takvimi için uzmanlarımızla görüşmekten çekinmeyin.</p>'),
    'Aşılı fide dikim teknikleri.',
    'Aşılı Fide Dikim Rehberi 2025 | Bereket Fide Blog',
    '2025 sezonu aşılı fide dikimi: hazırlık, sulama ve adaptasyon; Bereket Fide teknik destek.',
    'aşılı fide, dikim rehberi, 2025 sezonu'
  ),
  (
    'bb020003-6003-4003-a003-bbbbbbbb0003',
    'bb010003-5003-4003-9003-bbbbbbbb0003',
    'tr',
    'Fide Kalitesini Artıran İnovatif Yaklaşımlar',
    'fide-kalitesini-artiran-inovatif-yaklasimlar',
    JSON_OBJECT('html', '<p>Kaliteli fide üretimi, yalnızca iyi tohum seçimiyle değil; süreç boyunca uygulanan yenilikçi yöntemlerle mümkün olur.</p><h2>Kontrollü Üretim Süreçleri</h2><p>Isı, nem, sulama ve besleme parametrelerinin kontrollü şekilde yönetilmesi, gelişim sürecinde daha homojen ve güçlü fideler elde edilmesini sağlar.</p><h2>Veri ve Gözleme Dayalı İyileştirme</h2><p>Üretim sahasında yapılan düzenli gözlemler ve performans takibi, kaliteyi artıran kararların daha hızlı alınmasına yardımcı olur. Bu yaklaşım, sezon boyunca daha güçlü ve güvenilir sonuçlar üretir.</p><p>Toptan alım ve çeşit güvencesi hakkında teklif formumuzdan bize yazabilirsiniz.</p>'),
    'Kaliteli fide üretimi için inovasyon.',
    'İnovatif Fide Üretimi | Bereket Fide Blog',
    'Kontrollü sera süreçleri ve kaliteli fide; Bereket Fide üretim yaklaşımı.',
    'fide kalitesi, inovasyon, üretim teknolojisi'
  ),
  (
    'bb020004-6004-4004-a004-bbbbbbbb0004',
    'bb010004-5004-4004-9004-bbbbbbbb0004',
    'tr',
    'Fide Dikim Öncesi Toprak Hazırlığı',
    'fide-dikim-oncesi-toprak-hazirligi',
    JSON_OBJECT('html', '<p>Tarlanın fide dikimine hazırlanması, köklerin tutunma başarısını doğrudan etkiler. Adım adım hazırlık süreci.</p><h2>Toprak Analizi</h2><p>Dikim öncesi mutlaka toprak analizi yaptırılmalı ve ihtiyaç duyulan elementler belirlenmelidir.</p><h2>Gübreleme ve İşleme</h2><p>Toprağın havalandırılması ve organik madde miktarının artırılması, fidenin yeni yerine adaptasyonunu hızlandırır.</p><p>pH, tuzluluk ve drenaj konularında yerel koşullara göre öneri almak, ilk haftalardaki stresi azaltır.</p>'),
    'Toprak analizi, gübreleme ve havalandırma ile dikim öncesi hazırlık.',
    'Toprak Hazırlığı Rehberi | Bereket Fide Bilgi Bankası',
    'Fide dikim öncesi toprak analizi, gübreleme ve işleme; adaptasyon ipuçları.',
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
    JSON_OBJECT('html', '<p>At Bereket Fide, we treat sustainability as a practical part of daily production rather than a separate initiative.</p><h2>Energy-Efficient Greenhouse Infrastructure</h2><p>Climate control, irrigation and production systems in our modern greenhouses are planned to support efficient resource use while maintaining stable product quality.</p><h2>Renewable Energy Supported Production</h2><p>By integrating a renewable energy approach into our facilities, we aim to reduce environmental impact and build a more resilient production model for high quality seedlings.</p><p>For variety and greenhouse planning, contact our technical team at <strong>info@bereketfide.com.tr</strong>.</p>'),
    'Eco-friendly seedling production with solar energy.',
    'Sustainable Production | Bereket Fide Blog',
    'Solar-backed sustainable seedling production in Antalya; technical advice via Bereket Fide.',
    'sustainable production, solar energy, greenhouse systems'
  ),
  (
    'bb020006-6006-4006-a006-bbbbbbbb0006',
    'bb010002-5002-4002-9002-bbbbbbbb0002',
    'en',
    '2025 Season Grafted Seedling Planting Guide',
    '2025-season-grafted-seedling-planting-guide',
    JSON_OBJECT('html', '<p>For growers targeting high performance production with grafted seedlings, planning before planting is essential.</p><h2>Preparation Before Planting</h2><p>Checking soil structure, preparing irrigation planning and aligning greenhouse or field conditions with the crop helps the season start in a stronger way.</p><h2>Healthy Start, Balanced Development</h2><p>To benefit from the strong root structure of grafted seedlings, planting density, first irrigation and the adaptation period should be managed carefully from day one.</p><p>Ask our agronomy team for a planting calendar suited to your region and variety mix.</p>'),
    'Grafted seedling planting techniques.',
    '2025 Grafted Seedling Planting Guide | Bereket Fide Blog',
    'Grafted seedling planting in 2025: soil, irrigation, adaptation; Bereket Fide support.',
    'grafted seedlings, planting guide, 2025 season'
  ),
  (
    'bb020007-6007-4007-a007-bbbbbbbb0007',
    'bb010003-5003-4003-9003-bbbbbbbb0003',
    'en',
    'Innovative Approaches That Improve Seedling Quality',
    'innovative-approaches-that-improve-seedling-quality',
    JSON_OBJECT('html', '<p>High quality seedling production depends not only on seed selection but also on the innovative practices applied throughout the production cycle.</p><h2>Controlled Production Processes</h2><p>Managing temperature, humidity, irrigation and nutrition in a controlled way helps deliver more uniform and stronger seedlings.</p><h2>Observation and Data Driven Improvement</h2><p>Regular monitoring in the production area makes it easier to take timely quality decisions and maintain reliable results across the season.</p><p>Use our quote form for bulk orders and variety availability.</p>'),
    'Innovation for quality seedling production.',
    'Innovative Seedling Production | Bereket Fide Blog',
    'Controlled greenhouse processes for consistent seedling quality at Bereket Fide.',
    'seedling quality, innovation, production methods'
  ),
  (
    'bb020008-6008-4008-a008-bbbbbbbb0008',
    'bb010004-5004-4004-9004-bbbbbbbb0004',
    'en',
    'Soil Preparation Before Seedling Planting',
    'soil-preparation-before-planting',
    JSON_OBJECT('html', '<p>Preparing the field for seedling planting directly affects the success of the roots. Step-by-step preparation process.</p><h2>Soil Analysis</h2><p>Soil analysis should definitely be performed before planting and the required elements should be determined.</p><h2>Fertilization and Processing</h2><p>Aerating the soil and increasing the amount of organic matter accelerates the adaptation of the seedling to its new place.</p><p>Review pH, salinity and drainage with local conditions in mind to reduce early-season stress.</p>'),
    'Soil analysis, fertilization, and aeration before planting.',
    'Soil Preparation Guide | Bereket Fide Knowledge Base',
    'Pre-plant soil analysis, fertilization and tillage for better seedling establishment.',
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

-- =========================
-- 4) CUSTOM PAGES I18N — DE
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
    'bb020009-6009-4009-a009-bbbbbbbb0009',
    'bb010001-5001-4001-9001-bbbbbbbb0001',
    'de',
    'Nachhaltige Produktion mit Solarenergie in unseren modernen Gewächshäusern',
    'nachhaltige-produktion-solarenergie-gewaechshaeuser',
    JSON_OBJECT('html', '<p>Bei Bereket Fide ist Nachhaltigkeit kein separates Projekt, sondern Teil des täglichen Produktionsalltags.</p><h2>Energieeffiziente Gewächshausinfrastruktur</h2><p>Klima, Bewässerung und Abläufe in unseren modernen Gewächshäusern sind so geplant, dass Ressourcen effizient genutzt und gleichzeitig eine stabile Produktqualität erhalten bleibt.</p><h2>Erneuerbare Energie in der Produktion</h2><p>Durch den Einsatz erneuerbarer Energie in unseren Anlagen wollen wir die Umweltbelastung verringern und ein widerstandsfähigeres Modell für hochwertige Jungpflanzen aufbauen.</p><p>Für Sorten- und Gewächshausplanung erreichen Sie unser Technikteam unter <strong>info@bereketfide.com.tr</strong>.</p>'),
    'Umweltfreundliche Jungpflanzenproduktion mit Solarenergie.',
    'Nachhaltige Produktion | Bereket Fide Blog',
    'Nachhaltige Jungpflanzenproduktion mit Solarenergie in Antalya; Beratung bei Bereket Fide.',
    'nachhaltige Produktion, Solarenergie, Gewächshaus'
  ),
  (
    'bb020010-6010-4010-a010-bbbbbbbb0010',
    'bb010002-5002-4002-9002-bbbbbbbb0002',
    'de',
    'Pflanzleitfaden für veredelte Jungpflanzen — Saison 2025',
    'pflanzleitfaden-veredelte-jungpflanzen-2025',
    JSON_OBJECT('html', '<p>Für Betriebe mit hohen Erwartungen an veredelte Jungpflanzen ist die Planung vor der Pflanzung entscheidend.</p><h2>Vorbereitung vor der Pflanzung</h2><p>Bodenstruktur prüfen, Bewässerung planen und Feld- oder Gewächshausbedingungen an die Kultur anpassen — so startet die Saison robuster.</p><h2>Gesunder Start, ausgewogene Entwicklung</h2><p>Um die starke Wurzelstruktur veredelter Jungpflanzen optimal zu nutzen, sollten Pflanzdichte, erste Bewässerung und die Eingewöhnungsphase von Anfang an sorgfältig geführt werden.</p><p>Unser Agrarteam erstellt gern einen Pflanzkalender passend zu Region und Sortiment.</p>'),
    'Techniken für die Pflanzung veredelter Jungpflanzen.',
    'Pflanzleitfaden 2025 | Bereket Fide Blog',
    'Veredelte Jungpflanzen 2025: Vorbereitung, Bewässerung, Eingewöhnung; Bereket Fide.',
    'veredelte Jungpflanzen, Pflanzleitfaden, Saison 2025'
  ),
  (
    'bb020011-6011-4011-a011-bbbbbbbb0011',
    'bb010003-5003-4003-9003-bbbbbbbb0003',
    'de',
    'Innovative Ansätze zur Verbesserung der Jungpflanzenqualität',
    'innovative-ansaetze-jungpflanzenqualitaet',
    JSON_OBJECT('html', '<p>Hochwertige Jungpflanzen entstehen nicht nur durch die Saatgutwahl, sondern durch durchgängige, innovative Praxis im Produktionszyklus.</p><h2>Kontrollierte Produktionsprozesse</h2><p>Die gezielte Steuerung von Temperatur, Luftfeuchte, Bewässerung und Ernährung führt zu gleichmäßigeren und kräftigeren Jungpflanzen.</p><h2>Verbesserung durch Beobachtung und Daten</h2><p>Regelmäßige Kontrolle im Produktionsbereich erleichtert rechtzeitige Qualitätsentscheidungen und zuverlässige Ergebnisse über die Saison.</p><p>Für Mengenbestellungen und Sortenverfügbarkeit nutzen Sie unser Angebotsformular.</p>'),
    'Innovation für qualitativ hochwertige Jungpflanzen.',
    'Innovative Jungpflanzenproduktion | Bereket Fide Blog',
    'Kontrollierte Gewächshausprozesse für gleichbleibende Jungpflanzenqualität.',
    'Jungpflanzenqualität, Innovation, Produktion'
  ),
  (
    'bb020012-6012-4012-a012-bbbbbbbb0012',
    'bb010004-5004-4004-9004-bbbbbbbb0004',
    'de',
    'Bodenvorbereitung vor der Jungpflanzenkultur',
    'bodenvorbereitung-vor-jungpflanzenkultur',
    JSON_OBJECT('html', '<p>Die Vorbereitung des Feldes vor der Jungpflanzenkultur beeinflusst direkt das Anwachsen der Wurzeln. Schritt für Schritt.</p><h2>Bodenanalyse</h2><p>Vor der Pflanzung sollte eine Bodenanalyse erfolgen; fehlende Nährstoffe werden so gezielt ergänzt.</p><h2>Düngung und Bearbeitung</h2><p>Lockern des Bodens und mehr organischer Substanz beschleunigen die Eingewöhnung der Jungpflanze am neuen Standort.</p><p>pH, Salzgehalt und Drainage sollten standortspezifisch geprüft werden, um Stress in den ersten Wochen zu reduzieren.</p>'),
    'Bodenanalyse, Düngung und Lockerung für erfolgreichere Pflanzung.',
    'Bodenvorbereitung | Bereket Fide Wissensbasis',
    'Vor der Jungpflanzenkultur: Analyse, Düngung, Bearbeitung; Eingewöhnung.',
    'Bodenvorbereitung, Jungpflanzen, Düngung'
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
