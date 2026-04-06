-- =============================================================
-- FILE: 310_bereketfide_news.seed.sql
-- Bereket Fide — Haberler / News (custom_pages) + i18n (TR/EN/DE)
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
  -- Haber 1: Özbekistan Tarım Bakanlığı ziyareti (canli site ile hizali baslik/icerik)
  ('nw010001-5001-4001-9001-nnnnnnnn0001', 'news', 1, 1, 10, 10,
   '/uploads/products/23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0',
   '/uploads/products/23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0',
   JSON_ARRAY('/uploads/products/23.28.37 (3).jpeg', '/uploads/products/23.28.37 (1).jpeg'),
   JSON_ARRAY('d0829871-469a-46ae-b243-b537aff49ec0', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315'),
   'nccc0001-4001-4001-8001-nncccccc0001', NULL),
  -- Haber 2: Antalya Valiligi / kurumsal ziyaret (yeni isletme binasi)
  ('nw010002-5002-4002-9002-nnnnnnnn0002', 'news', 1, 1, 20, 20,
   '/uploads/products/23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315',
   '/uploads/products/23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315',
   JSON_ARRAY('/uploads/products/23.28.37 (1).jpeg'), JSON_ARRAY('33bfb1c6-6eeb-44a0-a351-1ed0ffab0315'),
   'nccc0003-4003-4003-8003-nncccccc0003', NULL),
  -- Haber 3: Tarla gunleri
  ('nw010003-5003-4003-9003-nnnnnnnn0003', 'news', 1, 0, 30, 30,
   '/uploads/products/23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0',
   '/uploads/products/23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0',
   JSON_ARRAY('/uploads/products/23.28.37 (3).jpeg'), JSON_ARRAY('d0829871-469a-46ae-b243-b537aff49ec0'),
   'nccc0002-4002-4002-8002-nncccccc0002', NULL),
  -- Haber 4: Kapasite / lojistik yatirimi
  ('nw010004-5004-4004-9004-nnnnnnnn0004', 'news', 1, 0, 40, 40,
   '/uploads/products/23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315',
   '/uploads/products/23.28.37 (1).jpeg', '33bfb1c6-6eeb-44a0-a351-1ed0ffab0315',
   JSON_ARRAY('/uploads/products/23.28.37 (1).jpeg'), JSON_ARRAY('33bfb1c6-6eeb-44a0-a351-1ed0ffab0315'),
   'nccc0004-4004-4004-8004-nncccccc0004', NULL),
  -- Haber 5: Genç Çiftçiler
  ('nw010005-5005-4005-9005-nnnnnnnn0005', 'news', 1, 1, 50, 50,
   '/uploads/products/23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0',
   '/uploads/products/23.28.37 (3).jpeg', 'd0829871-469a-46ae-b243-b537aff49ec0',
   JSON_ARRAY('/uploads/products/23.28.37 (3).jpeg'), JSON_ARRAY('d0829871-469a-46ae-b243-b537aff49ec0'),
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
    'Özbekistan Tarım Bakanlığı Heyetinin Bereket Fide Ziyareti',
    'ozbekistan-tarim-bakanligi-heyetinin-bereket-fide-ziyareti',
    JSON_OBJECT('html', '<p>Özbekistan Tarım Bakanlığı heyetinin Bereket Fidemizi ziyaret etmesinden dolayı teşekkür ederiz. İki ülke tarımı arasında bilgi paylaşımı ve iş birliği fırsatlarını değerlendirdiğimiz verimli bir görüşme gerçekleştirdik.</p><p>Ziyaret kapsamında modern fide üretim tesislerimizde sürdürülebilir üretim ve kalite süreçlerimiz hakkında karşılıklı fikir alışverişi yapıldı.</p>'),
    'Özbekistan Tarım Bakanlığı heyetine nazik ziyaretleri için teşekkürler.',
    'Özbekistan Heyeti Ziyareti | Bereket Fide',
    'Özbekistan Tarım Bakanlığı heyetinin Bereket Fide tesislerini ziyareti ve tarımsal iş birliği.',
    'özbekistan, tarım bakanlığı, ziyaret, bereket fide, uluslararası iş birliği'
  ),
  (
    'nw020002-6002-4002-a002-nnnnnnnn0002',
    'nw010002-5002-4002-9002-nnnnnnnn0002',
    'tr',
    'Antalya Valiliğinden Merkez Ofisimize Nazik Ziyaret',
    'antalya-valiliginden-merkez-ofisimize-ziyaret',
    JSON_OBJECT('html', '<p>Antalya Valimiz, Aksu Kaymakamımız, Aksu Belediye Başkanımız, İl Tarım ve Orman Müdürümüz, İlçe Tarım ve Orman Müdürümüz ve değerli ekiplerinin Bereket Fide bünyesinde yer alan yeni işletme binamıza gerçekleştirdikleri nazik ziyaret için teşekkür ederiz.</p><p>Misafirlerimize üretim planlarımız ve bölge tarımına katkılarımız hakkında bilgi sunduk; açık iletişim için teşekkür ederiz.</p>'),
    'Vali, kaymakam, belediye ve tarım müdürlüklerinin yeni binamıza ziyareti.',
    'Antalya Valiliği Ziyareti | Bereket Fide',
    'Antalya Valiliği ve ilgili kurumların Bereket Fide merkez ofis ziyareti duyurusu.',
    'antalya, valilik, ziyaret, bereket fide, kurumsal'
  ),
  (
    'nw020003-6003-4003-a003-nnnnnnnn0003',
    'nw010003-5003-4003-9003-nnnnnnnn0003',
    'tr',
    'Bereket Fide Tarla Günleri Bu Ay Başlıyor',
    'bereket-fide-tarla-gunleri-basliyor',
    JSON_OBJECT('html', '<p>Üreticilerimizle sahada bir araya geleceğimiz tarla günü programımız bu ay başlıyor. Etkinliklerde çeşit performansı, sulama ve besleme stratejileri ile mevsimsel risklere karşı öneriler paylaşılacak.</p><p>Katılım ve tarih bilgisi için bölge sorumlularımız veya <strong>info@bereketfide.com.tr</strong> üzerinden iletişime geçebilirsiniz.</p>'),
    'Sahada üretici buluşmaları: tarla günleri bu ay başlıyor.',
    'Tarla Günleri | Bereket Fide',
    'Bereket Fide tarla günleri: çeşit performansı ve sezon uygulamaları ile saha buluşmaları.',
    'tarla günleri, etkinlik, üretici buluşması, fide'
  ),
  (
    'nw020004-6004-4004-a004-nnnnnnnn0004',
    'nw010004-5004-4004-9004-nnnnnnnn0004',
    'tr',
    'Üretim Hatlarımızı Genişlettik: Kapasite ve Lojistik Güçlendi',
    'uretim-hatlari-genisleme-kapasite-lojistik',
    JSON_OBJECT('html', '<p>Antalya Aksu tesislerimizde yürütülen yatırımlarla üretim hatlarımızı ve depolama altyapımızı genişlettik. Bilgisayar kontrollü seralarımızda operasyonlarımız, on milyonlarca fideyi kapsayacak ölçekte sürdürülmektedir.</p><p>Sevkiyat planlaması ve sipariş yoğunluğu dönemlerinde daha esnek hizmet sunmayı hedefliyoruz; güncel teslim süreleri için satış ekibimizle iletişime geçebilirsiniz.</p>'),
    'Tesis yatırımı ile kapasite ve lojistikte güçlenme.',
    'Kapasite ve Yatırım | Bereket Fide',
    'Bereket Fide üretim hatları ve lojistik altyapısındaki genişleme duyurusu.',
    'kapasite, yatırım, lojistik, fide üretimi'
  ),
  (
    'nw020005-6005-4005-a005-nnnnnnnn0005',
    'nw010005-5005-4005-9005-nnnnnnnn0005',
    'tr',
    'Geleceğin Tarımı İçin Genç Çiftçilere Destek',
    'genc-ciftci-destek-projeleri',
    JSON_OBJECT('html', '<p>Tarımın sürdürülebilirliği için genç üreticilerin bilgiye ve güvenilir fide kaynağına erişimini önemsiyoruz. Programlarımız kapsamında çeşit seçimi, dikim takvimi ve ilk sezon yönetimi konularında yönlendirme sunuyoruz.</p><p>Genç çiftçi girişimleri ve kooperatif iş birlikleri için özel iletişim hattımız üzerinden taleplerinizi iletebilirsiniz.</p>'),
    'Genç üreticilere çeşit ve sezon danışmanlığı.',
    'Genç Çiftçilere Destek | Bereket Fide',
    'Genç çiftçilere fide üreticisi olarak teknik ve çeşit desteği.',
    'genç çiftçi, tarım geleceği, danışmanlık'
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
    'Delegation from Uzbekistan Ministry of Agriculture Visits Bereket Fide',
    'uzbekistan-agriculture-ministry-delegation-visits-bereket-fide',
    JSON_OBJECT('html', '<p>We thank the delegation from the Ministry of Agriculture of Uzbekistan for visiting Bereket Fide. We held a productive meeting to exchange knowledge and explore cooperation between our agricultural communities.</p><p>During the visit we shared insights on sustainable seedling production and quality processes at our modern facilities.</p>'),
    'Thanking the Uzbekistan Ministry of Agriculture delegation for their visit.',
    'Uzbekistan Delegation Visit | Bereket Fide',
    'Visit of the Uzbekistan Ministry of Agriculture delegation to Bereket Fide and agricultural cooperation.',
    'uzbekistan, agriculture ministry, visit, bereket fide, international cooperation'
  ),
  (
    'nw020007-6007-4007-a007-nnnnnnnn0007',
    'nw010002-5002-4002-9002-nnnnnnnn0002',
    'en',
    'Courtesy Visit from Antalya Governorship to Our Headquarters',
    'antalya-governorship-visits-bereket-fide-headquarters',
    JSON_OBJECT('html', '<p>We thank the Governor of Antalya, the District Governor of Aksu, the Mayor of Aksu, our provincial and district directors of agriculture and forestry, and their teams for their kind visit to our new headquarters building within Bereket Fide.</p><p>We presented our production plans and contributions to regional agriculture; we appreciate the open dialogue.</p>'),
    'Governor, district governor, mayor and agriculture directors visited our new building.',
    'Antalya Governorship Visit | Bereket Fide',
    'Courtesy visit by Antalya Governorship and related institutions to Bereket Fide headquarters.',
    'antalya, governorship, visit, bereket fide, corporate'
  ),
  (
    'nw020008-6008-4008-a008-nnnnnnnn0008',
    'nw010003-5003-4003-9003-nnnnnnnn0003',
    'en',
    'Bereket Fide Field Days Start This Month',
    'bereket-fide-field-days-start-this-month',
    JSON_OBJECT('html', '<p>Our field day program, where we meet growers on site, starts this month. We will share variety performance, irrigation and nutrition strategies, and seasonal risk management tips.</p><p>Contact your regional representative or <strong>info@bereketfide.com.tr</strong> for dates and attendance details.</p>'),
    'On-farm meetings with growers: field days start this month.',
    'Field Days | Bereket Fide',
    'Bereket Fide field days: variety performance and seasonal practices with growers.',
    'field days, event, grower meeting, seedlings'
  ),
  (
    'nw020009-6009-4009-a009-nnnnnnnn0009',
    'nw010004-5004-4004-9004-nnnnnnnn0004',
    'en',
    'We Expanded Production Lines: Capacity and Logistics Strengthened',
    'production-lines-expanded-capacity-logistics',
    JSON_OBJECT('html', '<p>Investments at our Antalya Aksu facility have expanded our production lines and storage infrastructure. Operations in our computer-controlled greenhouses continue at a scale serving tens of millions of seedlings per year.</p><p>We aim to offer more flexible service during peak order periods; contact our sales team for current lead times.</p>'),
    'Facility investment strengthens capacity and logistics.',
    'Capacity and Investment | Bereket Fide',
    'Bereket Fide announces expanded production and logistics capacity.',
    'capacity, investment, logistics, seedling production'
  ),
  (
    'nw020010-6010-4010-a010-nnnnnnnn0010',
    'nw010005-5005-4005-9005-nnnnnnnn0005',
    'en',
    'Support for Young Farmers for the Future of Agriculture',
    'support-for-young-farmers',
    JSON_OBJECT('html', '<p>We care that young growers access knowledge and reliable seedling sources for sustainable agriculture. Through our programs we provide guidance on variety selection, planting calendars and first-season management.</p><p>Young farmer initiatives and cooperative partnerships can reach us through our dedicated contact channel.</p>'),
    'Guidance on varieties and the growing season for young producers.',
    'Support for Young Farmers | Bereket Fide',
    'Bereket Fide support for young farmers: technical and variety advice.',
    'young farmer, future of agriculture, advisory'
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
    'nw020011-6011-4011-a011-nnnnnnnn0011',
    'nw010001-5001-4001-9001-nnnnnnnn0001',
    'de',
    'Besuch einer Delegation des usbekischen Landwirtschaftsministeriums bei Bereket Fide',
    'usbekistan-landwirtschaftsministerium-besuch-bereket-fide',
    JSON_OBJECT('html', '<p>Wir danken der Delegation des Landwirtschaftsministeriums Usbekistans für den Besuch bei Bereket Fide. In einem produktiven Gespräch tauschten wir Erfahrungen aus und sprachen über Kooperationsmöglichkeiten im Agrarsektor.</p><p>Im Mittelpunkt standen nachhaltige Jungpflanzenproduktion und Qualitätsprozesse in unseren modernen Anlagen.</p>'),
    'Dank an die Delegation des usbekischen Landwirtschaftsministeriums.',
    'Besuch Usbekistan | Bereket Fide',
    'Besuch einer Delegation des usbekischen Landwirtschaftsministeriums bei Bereket Fide.',
    'Usbekistan, Landwirtschaftsministerium, Besuch, Bereket Fide, Kooperation'
  ),
  (
    'nw020012-6012-4012-a012-nnnnnnnn0012',
    'nw010002-5002-4002-9002-nnnnnnnn0002',
    'de',
    'Höflicher Besuch der Provinzregierung Antalya in unserer neuen Zentrale',
    'antalya-regierungsbesuch-hauptquartier-bereket-fide',
    JSON_OBJECT('html', '<p>Wir danken dem Gouverneur von Antalya, dem Bezirksgouverneur von Aksu, dem Bürgermeister von Aksu, den Leitungen der Provinz- und Bezirkslandwirtschaftsämter sowie ihren Teams für den freundlichen Besuch in unserem neuen Verwaltungsgebäude von Bereket Fide.</p><p>Wir informierten über Produktionsplanung und unseren Beitrag zur regionalen Landwirtschaft.</p>'),
    'Besuch von Gouverneur, Bezirksverwaltung, Gemeinde und Landwirtschaftsämtern.',
    'Besuch Antalya | Bereket Fide',
    'Höflicher Besuch der Provinzregierung Antalya und weiterer Institutionen bei Bereket Fide.',
    'Antalya, Regierung, Besuch, Bereket Fide, Unternehmen'
  ),
  (
    'nw020013-6013-4013-a013-nnnnnnnn0013',
    'nw010003-5003-4003-9003-nnnnnnnn0003',
    'de',
    'Bereket Fide Feldtage starten in diesem Monat',
    'bereket-fide-feldtage-start',
    JSON_OBJECT('html', '<p>Unser Feldtag-Programm, bei dem wir Betriebe vor Ort treffen, beginnt in diesem Monat. Wir teilen Sortenleistung, Bewässerungs- und Düngestrategien sowie Hinweise zum saisonalen Risikomanagement.</p><p>Termine und Teilnahme erfragen Sie bei Ihrem Regionalansprechpartner oder unter <strong>info@bereketfide.com.tr</strong>.</p>'),
    'Feldtage mit Produzenten starten in diesem Monat.',
    'Feldtage | Bereket Fide',
    'Bereket Fide Feldtage: Sortenleistung und Saisonpraxis vor Ort.',
    'Feldtage, Veranstaltung, Betriebstreffen, Jungpflanzen'
  ),
  (
    'nw020014-6014-4014-a014-nnnnnnnn0014',
    'nw010004-5004-4004-9004-nnnnnnnn0004',
    'de',
    'Produktionslinien erweitert: Kapazität und Logistik gestärkt',
    'produktionslinien-erweiterung-kapazitaet-logistik',
    JSON_OBJECT('html', '<p>Investitionen am Standort Antalya Aksu haben unsere Produktionslinien und Lagerinfrastruktur erweitert. Der Betrieb in unseren computergesteuerten Gewächshäusern erfolgt in einem Umfang von vielen Millionen Jungpflanzen pro Jahr.</p><p>In Spitzenzeiten der Nachfrage wollen wir flexibler liefern; aktuelle Lieferzeiten erhalten Sie vom Vertrieb.</p>'),
    'Anlageninvestition stärkt Kapazität und Logistik.',
    'Kapazität und Investition | Bereket Fide',
    'Bereket Fide meldet erweiterte Produktions- und Logistikkapazität.',
    'Kapazität, Investition, Logistik, Jungpflanzenproduktion'
  ),
  (
    'nw020015-6015-4015-a015-nnnnnnnn0015',
    'nw010005-5005-4005-9005-nnnnnnnn0005',
    'de',
    'Unterstützung junger Landwirte für die Zukunft der Landwirtschaft',
    'unterstuetzung-junge-landwirte',
    JSON_OBJECT('html', '<p>Uns ist wichtig, dass junge Betriebe Wissen und zuverlässige Jungpflanzen-Quellen für eine nachhaltige Landwirtschaft finden. In unseren Programmen beraten wir zu Sortenwahl, Pflanzkalender und Management in der ersten Saison.</p><p>Initiativen junger Landwirte und Genossenschaftspartnerschaften können uns über den dafür vorgesehenen Kontakt erreichen.</p>'),
    'Beratung zu Sorten und Saison für junge Produzenten.',
    'Unterstützung junger Landwirte | Bereket Fide',
    'Bereket Fide unterstützt junge Landwirte mit Fach- und Sortenberatung.',
    'junger Landwirt, Zukunft Landwirtschaft, Beratung'
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
