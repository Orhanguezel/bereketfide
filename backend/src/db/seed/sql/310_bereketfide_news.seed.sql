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
  -- Haber 1: Bügem GMY İhsan Emiralioğlu ziyareti
  ('nw010001-5001-4001-9001-nnnnnnnn0001', 'news', 1, 1, 10, 10,
   '/uploads/news/bugem.jpeg', 'bf-news-img-0001',
   '/uploads/news/bugem.jpeg', 'bf-news-img-0001',
   JSON_ARRAY('/uploads/news/bugem.jpeg', '/uploads/news/bugem2.jpeg'),
   JSON_ARRAY('bf-news-img-0001', 'bf-news-img-0002'),
   'nccc0001-4001-4001-8001-nncccccc0001', NULL),
  -- Haber 2: Türktob Başkanı Kayhan Yıldırım ziyareti
  ('nw010002-5002-4002-9002-nnnnnnnn0002', 'news', 1, 1, 20, 20,
   '/uploads/news/bugem2.jpeg', 'bf-news-img-0002',
   '/uploads/news/bugem2.jpeg', 'bf-news-img-0002',
   JSON_ARRAY('/uploads/news/bugem2.jpeg', '/uploads/news/bugem.jpeg'),
   JSON_ARRAY('bf-news-img-0002', 'bf-news-img-0001'),
   'nccc0003-4003-4003-8003-nncccccc0003', NULL),
  -- Haber 3: Antalya Valiliği / Aksu ziyareti
  ('nw010006-5006-4006-9006-nnnnnnnn0006', 'news', 1, 1, 25, 25,
   '/uploads/news/aksu.jpeg', 'bf-news-img-0003',
   '/uploads/news/aksu.jpeg', 'bf-news-img-0003',
   JSON_ARRAY('/uploads/news/aksu.jpeg','/uploads/news/aksu2.jpeg','/uploads/news/aksu3.jpeg','/uploads/news/aksu4.jpeg','/uploads/news/aksu5.jpeg'),
   JSON_ARRAY('bf-news-img-0003','bf-news-img-0004','bf-news-img-0005','bf-news-img-0006','bf-news-img-0007'),
   'nccc0003-4003-4003-8003-nncccccc0003', NULL),
  -- Haber 4: Samsun Valisi ziyareti
  ('nw010007-5007-4007-9007-nnnnnnnn0007', 'news', 1, 1, 27, 27,
   '/uploads/news/samsun.jpeg', 'bf-news-img-0008',
   '/uploads/news/samsun.jpeg', 'bf-news-img-0008',
   JSON_ARRAY('/uploads/news/samsun.jpeg','/uploads/news/samsun2.jpeg','/uploads/news/samsun3.jpeg','/uploads/news/samsun4.jpeg','/uploads/news/samsun8.jpeg'),
   JSON_ARRAY('bf-news-img-0008','bf-news-img-0009','bf-news-img-0010','bf-news-img-0011','bf-news-img-0015'),
   'nccc0003-4003-4003-8003-nncccccc0003', NULL),
  -- Haber 5: Aksu Protokolü ziyareti
  ('nw010008-5008-4008-9008-nnnnnnnn0008', 'news', 1, 1, 28, 28,
   '/uploads/news/aksuj.jpeg', 'bf-news-img-0016',
   '/uploads/news/aksuj.jpeg', 'bf-news-img-0016',
   JSON_ARRAY('/uploads/news/aksuj.jpeg','/uploads/news/aksuj2.jpeg','/uploads/news/aksuj3.jpeg'),
   JSON_ARRAY('bf-news-img-0016','bf-news-img-0017','bf-news-img-0018'),
   'nccc0003-4003-4003-8003-nncccccc0003', NULL),
  -- Haber 6: Tarla günleri
  ('nw010003-5003-4003-9003-nnnnnnnn0003', 'news', 1, 0, 30, 30,
   '/uploads/products/23.28.37 (3).jpeg', 'bf-prd-img-0075',
   '/uploads/products/23.28.37 (3).jpeg', 'bf-prd-img-0075',
   JSON_ARRAY('/uploads/products/23.28.37 (3).jpeg'),
   JSON_ARRAY('bf-prd-img-0075'),
   'nccc0002-4002-4002-8002-nncccccc0002', NULL),
  -- Haber 4: Kapasite / lojistik yatırımı
  ('nw010004-5004-4004-9004-nnnnnnnn0004', 'news', 1, 0, 40, 40,
   '/uploads/products/23.28.37 (1).jpeg', 'bf-prd-img-0073',
   '/uploads/products/23.28.37 (1).jpeg', 'bf-prd-img-0073',
   JSON_ARRAY('/uploads/products/23.28.37 (1).jpeg'),
   JSON_ARRAY('bf-prd-img-0073'),
   'nccc0004-4004-4004-8004-nncccccc0004', NULL),
  -- Haber 5: Genç Çiftçiler
  ('nw010005-5005-4005-9005-nnnnnnnn0005', 'news', 1, 1, 50, 50,
   '/uploads/products/23.28.37 (3).jpeg', 'bf-prd-img-0075',
   '/uploads/products/23.28.37 (3).jpeg', 'bf-prd-img-0075',
   JSON_ARRAY('/uploads/products/23.28.37 (3).jpeg'),
   JSON_ARRAY('bf-prd-img-0075'),
   'nccc0005-4005-4005-8005-nncccccc0005', NULL)
ON DUPLICATE KEY UPDATE
  `module_key`              = VALUES(`module_key`),
  `is_published`            = VALUES(`is_published`),
  `featured`                = VALUES(`featured`),
  `display_order`           = VALUES(`display_order`),
  `featured_image`          = VALUES(`featured_image`),
  `featured_image_asset_id` = VALUES(`featured_image_asset_id`),
  `image_url`               = VALUES(`image_url`),
  `storage_asset_id`        = VALUES(`storage_asset_id`),
  `images`                  = VALUES(`images`),
  `storage_image_ids`       = VALUES(`storage_image_ids`),
  `category_id`             = VALUES(`category_id`);

-- =========================
-- 3) CUSTOM PAGES I18N — TR
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
    'Tarım Bakanlığı BÜGEM GMY İhsan Emiralioğlu Bereket Fide''yi Ziyaret Etti',
    'bugem-gmy-ihsan-emiralioglu-bereketfide-ziyareti',
    JSON_OBJECT('html', '<p>Tarım ve Orman Bakanlığı Bitkisel Üretim Genel Müdürlüğü (BÜGEM) Genel Müdür Yardımcısı İhsan Emiralioğlu, Bereket Fide tesislerimizi ziyaret etti. Misafirimize modern fide üretim süreçlerimizi, bilgisayar kontrollü seralarımızı ve sektöre katkılarımızı tanıttık.</p><p>Ziyaret kapsamında yerli tohum ve fide üretiminin güçlendirilmesi, üretici destekleri ve sektörel iş birliği olanakları üzerine verimli bir görüşme gerçekleştirildi. Değerli ziyaretleri için Sayın Emiralioğlu''na teşekkür ederiz.</p>'),
    'BÜGEM Genel Müdür Yardımcısı İhsan Emiralioğlu, Bereket Fide üretim tesislerini ziyaret etti.',
    'BÜGEM GMY İhsan Emiralioğlu Ziyareti | Bereket Fide',
    'Tarım Bakanlığı BÜGEM Genel Müdür Yardımcısı İhsan Emiralioğlu''nun Bereket Fide ziyareti ve sektörel değerlendirmeleri.',
    'bügem, tarım bakanlığı, ihsan emiralioğlu, ziyaret, bereket fide, fide üretimi'
  ),
  (
    'nw020002-6002-4002-a002-nnnnnnnn0002',
    'nw010002-5002-4002-9002-nnnnnnnn0002',
    'tr',
    'Türktob Başkanı Kayhan Yıldırım ile Sektör Değerlendirmesi',
    'turktob-baskani-kayhan-yildirim-bereketfide-ziyareti',
    JSON_OBJECT('html', '<p>Türkiye Tohumcular Birliği (Türktob) Başkanı Kayhan Yıldırım, Bereket Fide''yi ziyaret etti. Türk tohumculuk sektörünün gündemine ilişkin görüşler paylaşıldı; yerli üretimin büyümesi, ihracat fırsatları ve sektörün karşılaştığı yapısal meseleler değerlendirildi.</p><p>Birliğin çalışmaları ve sektöre yönelik politika önerileri kapsamında gerçekleştirilen bu buluşmadan memnuniyet duyduk. Değerli ziyaretleri için Sayın Yıldırım''a teşekkür ederiz.</p>'),
    'Türktob Başkanı Kayhan Yıldırım Bereket Fide ile bir araya gelerek sektörü değerlendirdi.',
    'Türktob Başkanı Kayhan Yıldırım Ziyareti | Bereket Fide',
    'Türkiye Tohumcular Birliği Başkanı Kayhan Yıldırım''ın Bereket Fide ziyareti ve tohumculuk sektörü değerlendirmesi.',
    'türktob, kayhan yıldırım, tohumculuk, ziyaret, bereket fide, sektör'
  ),
  (
    'nw020016-6016-4016-a016-nnnnnnnn0016',
    'nw010006-5006-4006-9006-nnnnnnnn0006',
    'tr',
    'Bereket Fide''ye Ziyaret ve Sektörel Değerlendirme',
    'antalya-valiligi-aksu-bereketfide-ziyareti',
    JSON_OBJECT('html', '<p>Antalya Valimiz, Aksu Kaymakamımız, Aksu Belediye Başkanımız, İl Tarım ve Orman Müdürümüz ile İlçe Tarım ve Orman Müdürümüz ve beraberindeki heyet, Bereket Fide bünyesinde hizmete giren yeni işletme binamıza ziyarette bulunmuştur.</p><p>Gerçekleştirilen nazik ziyaret kapsamında, sektörümüzde karşılaşılan güncel sorunlar ve çözüm önerileri hakkında görüş alışverişinde bulunulmuş, aynı zamanda taleplerimiz ilgili yetkililere iletilmiştir. Program çerçevesinde üretim tesisimizde kısa bir tanıtım ve bilgilendirme gezisi de gerçekleştirilmiştir.</p><p>Ziyaretlerinden dolayı tüm sayın yetkililere teşekkür ederiz.</p>'),
    'Antalya Valimiz ve Aksu yöneticileri, yeni işletme binamızı ziyaret ederek sektörel değerlendirmelerde bulundu.',
    'Antalya Valiliği Ziyareti | Bereket Fide',
    'Antalya Valisi, Aksu Kaymakamı, Aksu Belediye Başkanı ve Tarım Orman Müdürlerinin Bereket Fide yeni binası ziyareti.',
    'antalya, valilik, aksu, ziyaret, bereket fide, sektör değerlendirme'
  ),
  (
    'nw020022-6022-4022-a022-nnnnnnnn0022',
    'nw010008-5008-4008-9008-nnnnnnnn0008',
    'tr',
    'Aksu Protokolünden Bereket Fide''ye Ziyaret',
    'aksu-protokolu-bereketfide-ziyareti',
    JSON_OBJECT('html', '<p>Aksu Kaymakamımız Sayın Ahmet Hikmet Şahin, Aksu İlçe Komutanı Jandarma Teğmen Hulusi Mehmet Müdük ve Aksu İlçe Tarım ve Orman Müdürü İhsan İnal, işletmemizi ziyaret etmiştir.</p><p>Gerçekleştirilen nazik ziyaret dolayısıyla kendilerine teşekkür ederiz.</p>'),
    'Aksu Kaymakamı, İlçe Komutanı ve Tarım Müdürü, Bereket Fide işletmesini ziyaret etti.',
    'Aksu Protokolü Ziyareti | Bereket Fide',
    'Aksu Kaymakamı Ahmet Hikmet Şahin ve Aksu protokolünün Bereket Fide ziyareti.',
    'aksu, kaymakamlık, jandarma, tarım orman müdürü, ziyaret, bereket fide'
  ),
  (
    'nw020019-6019-4019-a019-nnnnnnnn0019',
    'nw010007-5007-4007-9007-nnnnnnnn0007',
    'tr',
    'Samsun Heyetinden Bereket Fide''ye Ziyaret',
    'samsun-valisi-heyeti-bereketfide-ziyareti',
    JSON_OBJECT('html', '<p>Samsun Valimiz Sayın Doç. Dr. Zülkif Dağlı, beraberinde Bafra Kaymakamı Cevdet Ertürkmen, Bafra Belediye Başkanı Hamit Kılıç, Bafra Ticaret ve Sanayi Odası, Bafra Ticaret Borsası, Bafra Ziraat Odası, Bafra Sera OSB yöneticileri ile Antalya İl Tarım ve Orman Müdürlüğü İl Müdür Yardımcısı Gökhan Karaca, Aksu İlçe Tarım ve Orman Müdürü İhsan İnal ve emniyet mensuplarından oluşan heyet, Bereket Fide üretim tesisimizi ziyaret etmiştir.</p><p>Gerçekleştirilen ziyaret kapsamında, genel yetiştiricilik faaliyetlerimiz ve ihracat çalışmalarımız hakkında karşılıklı bilgi alışverişinde bulunulmuş, sektörün mevcut durumu üzerine istişareler yapılmıştır.</p><p>Nazik ziyaretlerinden dolayı kendilerine teşekkür ederiz.</p>'),
    'Samsun Valisi Doç. Dr. Zülkif Dağlı ve Bafra heyeti, Bereket Fide üretim tesisini ziyaret ederek sektörel istişarelerde bulundu.',
    'Samsun Valisi Ziyareti | Bereket Fide',
    'Samsun Valisi Zülkif Dağlı ve Bafra heyetinin Bereket Fide üretim tesisi ziyareti ve sektörel değerlendirmesi.',
    'samsun, valilik, bafra, ziyaret, bereket fide, ihracat, sera osb'
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
-- 4) CUSTOM PAGES I18N — EN
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
    'BÜGEM Deputy Director General İhsan Emiralioğlu Visits Bereket Fide',
    'bugem-deputy-director-ihsan-emiralioglu-bereketfide-visit',
    JSON_OBJECT('html', '<p>İhsan Emiralioğlu, Deputy Director General of the Directorate General of Plant Production (BÜGEM) under the Ministry of Agriculture and Forestry, visited Bereket Fide. We presented our modern seedling production processes, computer-controlled greenhouses and contributions to the sector.</p><p>The meeting covered strengthening domestic seed and seedling production, producer support schemes, and opportunities for sectoral cooperation. We thank Mr. Emiralioğlu for his valuable visit.</p>'),
    'BÜGEM Deputy Director General İhsan Emiralioğlu visited Bereket Fide production facilities.',
    'BÜGEM Deputy Director Emiralioğlu Visit | Bereket Fide',
    'Visit of Ministry of Agriculture BÜGEM Deputy Director General İhsan Emiralioğlu to Bereket Fide and sectoral assessments.',
    'bügem, ministry of agriculture, ihsan emiralioglu, visit, bereket fide, seedling production'
  ),
  (
    'nw020007-6007-4007-a007-nnnnnnnn0007',
    'nw010002-5002-4002-9002-nnnnnnnn0002',
    'en',
    'Türktob President Kayhan Yıldırım and Bereket Fide on the Sector',
    'turktob-president-kayhan-yildirim-bereketfide-visit',
    JSON_OBJECT('html', '<p>Kayhan Yıldırım, President of the Turkish Seedsmen Association (Türktob), visited Bereket Fide. Views were shared on the agenda of the Turkish seed sector, including the growth of domestic production, export opportunities and structural challenges facing the industry.</p><p>We were pleased to host this meeting in the context of the association''s work and policy recommendations for the sector. We thank Mr. Yıldırım for his valuable visit.</p>'),
    'Türktob President Kayhan Yıldırım met with Bereket Fide to assess the seedsmen sector.',
    'Türktob President Kayhan Yıldırım Visit | Bereket Fide',
    'Visit of Turkish Seedsmen Association President Kayhan Yıldırım to Bereket Fide and seed sector assessment.',
    'türktob, kayhan yildirim, seed sector, visit, bereket fide'
  ),
  (
    'nw020017-6017-4017-a017-nnnnnnnn0017',
    'nw010006-5006-4006-9006-nnnnnnnn0006',
    'en',
    'A Visit to Bereket Fide and Sectoral Assessment',
    'antalya-governorship-aksu-bereketfide-visit',
    JSON_OBJECT('html', '<p>The Governor of Antalya, the District Governor of Aksu, the Mayor of Aksu, the Provincial and District Directors of Agriculture and Forestry, and their accompanying delegation visited our new headquarters building that has recently entered service at Bereket Fide.</p><p>During the courtesy visit, opinions were exchanged on current challenges facing our sector and proposed solutions, and our requests were conveyed to the relevant authorities. As part of the programme, a brief introductory tour of our production facility was also conducted.</p><p>We sincerely thank all distinguished officials for their visit.</p>'),
    'The Governor of Antalya and Aksu officials visited our new headquarters and assessed the sector.',
    'Antalya Governorship Visit | Bereket Fide',
    'Visit of the Governor of Antalya, District Governor of Aksu, Mayor of Aksu and Agriculture Directors to the new Bereket Fide building.',
    'antalya, governorship, aksu, visit, bereket fide, sector assessment'
  ),
  (
    'nw020023-6023-4023-a023-nnnnnnnn0023',
    'nw010008-5008-4008-9008-nnnnnnnn0008',
    'en',
    'A Visit from Aksu Protocol to Bereket Fide',
    'aksu-protocol-bereketfide-visit',
    JSON_OBJECT('html', '<p>Aksu District Governor Ahmet Hikmet Şahin, Aksu District Commander Gendarmerie Lieutenant Hulusi Mehmet Müdük, and Aksu District Director of Agriculture and Forestry İhsan İnal visited our facility.</p><p>We sincerely thank all distinguished guests for their kind visit.</p>'),
    'Aksu District Governor, District Commander and Agriculture Director visited Bereket Fide.',
    'Aksu Protocol Visit | Bereket Fide',
    'Visit of Aksu District Governor Ahmet Hikmet Şahin and the Aksu protocol delegation to Bereket Fide.',
    'aksu, district governor, gendarmerie, agriculture director, visit, bereket fide'
  ),
  (
    'nw020020-6020-4020-a020-nnnnnnnn0020',
    'nw010007-5007-4007-9007-nnnnnnnn0007',
    'en',
    'A Delegation from Samsun Visits Bereket Fide',
    'samsun-governor-delegation-bereketfide-visit',
    JSON_OBJECT('html', '<p>Governor of Samsun Assoc. Prof. Dr. Zülkif Dağlı, accompanied by District Governor of Bafra Cevdet Ertürkmen, Mayor of Bafra Hamit Kılıç, the boards of the Bafra Chamber of Commerce and Industry, Bafra Commodity Exchange, Bafra Chamber of Agriculture, Bafra Greenhouse OSB, as well as the Deputy Provincial Director of Agriculture and Forestry of Antalya Gökhan Karaca, District Director of Agriculture and Forestry of Aksu İhsan İnal, and security personnel, visited our Bereket Fide production facility.</p><p>During the visit, information was exchanged on our cultivation activities and export efforts, and consultations were held on the current state of the sector.</p><p>We sincerely thank all distinguished guests for their kind visit.</p>'),
    'Governor of Samsun Assoc. Prof. Dr. Zülkif Dağlı and the Bafra delegation visited Bereket Fide and consulted on sector developments.',
    'Samsun Governor Visit | Bereket Fide',
    'Visit of Samsun Governor Zülkif Dağlı and the Bafra delegation to Bereket Fide production facility and sectoral assessment.',
    'samsun, governorship, bafra, visit, bereket fide, export, greenhouse osb'
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
-- 5) CUSTOM PAGES I18N — DE
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
    'BÜGEM-Vizedirektor İhsan Emiralioğlu besucht Bereket Fide',
    'bugem-vizedirektor-ihsan-emiralioglu-bereketfide-besuch',
    JSON_OBJECT('html', '<p>İhsan Emiralioğlu, Vizedirektor der Generaldirektion für pflanzliche Produktion (BÜGEM) im türkischen Landwirtschaftsministerium, besuchte Bereket Fide. Wir stellten unsere modernen Jungpflanzenproduktionsprozesse, computergesteuerten Gewächshäuser und Beiträge zum Sektor vor.</p><p>Im Mittelpunkt des Gesprächs standen die Stärkung der inländischen Samen- und Jungpflanzenproduktion, Erzeugerförderprogramme sowie Möglichkeiten der sektoralen Zusammenarbeit. Wir danken Herrn Emiralioğlu für seinen wertvollen Besuch.</p>'),
    'BÜGEM-Vizedirektor İhsan Emiralioğlu besuchte die Produktionsstätten von Bereket Fide.',
    'BÜGEM-Besuch Emiralioğlu | Bereket Fide',
    'Besuch des BÜGEM-Vizedirektors İhsan Emiralioğlu bei Bereket Fide und sektorale Einschätzungen.',
    'bügem, Landwirtschaftsministerium, ihsan emiralioglu, Besuch, bereket fide, Jungpflanzen'
  ),
  (
    'nw020012-6012-4012-a012-nnnnnnnn0012',
    'nw010002-5002-4002-9002-nnnnnnnn0002',
    'de',
    'Türktob-Präsident Kayhan Yıldırım und Bereket Fide zur Branchenlage',
    'turktob-praesident-kayhan-yildirim-bereketfide-besuch',
    JSON_OBJECT('html', '<p>Kayhan Yıldırım, Präsident des Türkischen Saatgutverbandes (Türktob), besuchte Bereket Fide. Es wurden Ansichten zur Agenda der türkischen Saatgutbranche ausgetauscht, darunter das Wachstum der Inlandsproduktion, Exportchancen und strukturelle Herausforderungen des Sektors.</p><p>Wir freuten uns, dieses Treffen im Rahmen der Verbandsarbeit und der politischen Empfehlungen für den Sektor zu empfangen. Wir danken Herrn Yıldırım für seinen wertvollen Besuch.</p>'),
    'Türktob-Präsident Kayhan Yıldırım traf Bereket Fide zur Bewertung der Saatgutbranche.',
    'Türktob-Präsident Yıldırım Besuch | Bereket Fide',
    'Besuch des Türktob-Präsidenten Kayhan Yıldırım bei Bereket Fide und Einschätzung der Saatgutbranche.',
    'türktob, kayhan yildirim, Saatgutbranche, Besuch, bereket fide'
  ),
  (
    'nw020018-6018-4018-a018-nnnnnnnn0018',
    'nw010006-5006-4006-9006-nnnnnnnn0006',
    'de',
    'Besuch bei Bereket Fide und sektorale Bewertung',
    'antalya-regierung-aksu-bereketfide-besuch',
    JSON_OBJECT('html', '<p>Der Gouverneur von Antalya, der Bezirksgouverneur von Aksu, der Bürgermeister von Aksu, die Leitungen der Provinz- und Bezirkslandwirtschaftsämter sowie ihre Delegation besuchten unser neues Verwaltungsgebäude, das bei Bereket Fide seinen Betrieb aufgenommen hat.</p><p>Im Rahmen des freundlichen Besuchs wurden aktuelle Herausforderungen der Branche und Lösungsvorschläge erörtert; gleichzeitig wurden unsere Anliegen an die zuständigen Behörden übermittelt. Im Programm war auch ein kurzer Informationsrundgang durch unsere Produktionsanlage enthalten.</p><p>Wir danken allen geschätzten Offiziellen herzlich für ihren Besuch.</p>'),
    'Der Gouverneur von Antalya und die Verwaltung Aksu besuchten unsere neue Zentrale und bewerteten die Branchenlage.',
    'Besuch der Antalya-Regierung | Bereket Fide',
    'Besuch des Gouverneurs von Antalya, des Bezirksgouverneurs von Aksu, des Bürgermeisters von Aksu und der Landwirtschaftsdirektoren im neuen Bereket Fide Gebäude.',
    'Antalya, Regierung, Aksu, Besuch, Bereket Fide, Branchenbewertung'
  ),
  (
    'nw020024-6024-4024-a024-nnnnnnnn0024',
    'nw010008-5008-4008-9008-nnnnnnnn0008',
    'de',
    'Besuch des Aksu-Protokolls bei Bereket Fide',
    'aksu-protokoll-bereketfide-besuch',
    JSON_OBJECT('html', '<p>Der Bezirksgouverneur von Aksu, Ahmet Hikmet Şahin, der Bezirkskommandant der Gendarmerie Leutnant Hulusi Mehmet Müdük und der Bezirksdirektor für Landwirtschaft und Forsten von Aksu, İhsan İnal, besuchten unseren Betrieb.</p><p>Wir danken allen geschätzten Gästen herzlich für ihren freundlichen Besuch.</p>'),
    'Bezirksgouverneur, Bezirkskommandant und Landwirtschaftsdirektor von Aksu besuchten Bereket Fide.',
    'Besuch des Aksu-Protokolls | Bereket Fide',
    'Besuch des Aksu-Bezirksgouverneurs Ahmet Hikmet Şahin und des Aksu-Protokolls bei Bereket Fide.',
    'Aksu, Bezirksgouverneur, Gendarmerie, Landwirtschaftsdirektor, Besuch, Bereket Fide'
  ),
  (
    'nw020021-6021-4021-a021-nnnnnnnn0021',
    'nw010007-5007-4007-9007-nnnnnnnn0007',
    'de',
    'Eine Delegation aus Samsun besucht Bereket Fide',
    'samsun-gouverneur-delegation-bereketfide-besuch',
    JSON_OBJECT('html', '<p>Der Gouverneur von Samsun, Doz. Dr. Zülkif Dağlı, besuchte zusammen mit dem Bezirksgouverneur von Bafra Cevdet Ertürkmen, dem Bürgermeister von Bafra Hamit Kılıç, den Vorständen der Bafra Industrie- und Handelskammer, der Bafra Warenbörse, der Bafra Landwirtschaftskammer, der Bafra Gewächshaus-OSB sowie dem stellvertretenden Provinzdirektor für Landwirtschaft und Forsten in Antalya, Gökhan Karaca, dem Bezirksdirektor für Landwirtschaft und Forsten in Aksu, İhsan İnal, und Sicherheitspersonal unsere Produktionsanlage bei Bereket Fide.</p><p>Im Rahmen des Besuchs wurden Informationen über unsere Anbauaktivitäten und Exportbemühungen ausgetauscht sowie Beratungen zur aktuellen Lage des Sektors durchgeführt.</p><p>Wir danken allen geschätzten Gästen herzlich für ihren freundlichen Besuch.</p>'),
    'Samsun-Gouverneur Doz. Dr. Zülkif Dağlı und die Bafra-Delegation besuchten Bereket Fide und berieten über Sektorentwicklungen.',
    'Besuch des Samsun-Gouverneurs | Bereket Fide',
    'Besuch des Samsun-Gouverneurs Zülkif Dağlı und der Bafra-Delegation in der Bereket Fide Produktionsstätte.',
    'Samsun, Gouverneur, Bafra, Besuch, Bereket Fide, Export, Gewächshaus-OSB'
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
