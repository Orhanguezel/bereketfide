-- =============================================================
-- 312_bereketfide_references.seed.sql
-- Bereket Fide - Is Birligi Firmalari
-- Logo path: /uploads/brand_references/<slug>.png
-- =============================================================

INSERT INTO `references` (
  `id`, `is_published`, `is_featured`, `display_order`,
  `featured_image`, `website_url`, `category_id`
) VALUES
  ('c1000001-1111-4111-8111-c10000000001', 1, 1, 10, '/uploads/brand_references/grohe.png',        'https://www.grohe.com/',        NULL),
  ('c1000002-1111-4111-8111-c10000000002', 1, 1, 20, '/uploads/brand_references/rehau.png',        'https://www.rehau.com/',        NULL),
  ('c1000003-1111-4111-8111-c10000000003', 1, 1, 30, '/uploads/brand_references/siemens.png',       'https://www.siemens.com/',      NULL),
  ('c1000004-1111-4111-8111-c10000000004', 1, 1, 40, '/uploads/brand_references/kone.png',         'https://www.kone.com/',         NULL),
  ('c1000005-1111-4111-8111-c10000000005', 1, 1, 50, '/uploads/brand_references/daikin.png',       'https://www.daikin.com/',       NULL),
  ('c1000006-1111-4111-8111-c10000000006', 1, 1, 60, '/uploads/brand_references/villeroy-boch.png','https://www.villeroy-boch.com/',NULL)
ON DUPLICATE KEY UPDATE
  `is_published`  = VALUES(`is_published`),
  `is_featured`   = VALUES(`is_featured`),
  `display_order` = VALUES(`display_order`),
  `featured_image`= VALUES(`featured_image`),
  `website_url`   = VALUES(`website_url`),
  `category_id`   = VALUES(`category_id`);

INSERT INTO `references_i18n` (
  `id`, `reference_id`, `locale`, `title`, `slug`,
  `summary`, `content`, `featured_image_alt`, `meta_title`, `meta_description`
) VALUES
  ('c2000001-1111-4111-8111-c20000000001','c1000001-1111-4111-8111-c10000000001','tr','Grohe',         'grohe',         'Sulama ve altyapi tedariklerinde is birligi yaptigimiz global marka.',  JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'Grohe logosu',         'Grohe referansi',         'Bereket Fide is birlikleri.'),
  ('c2000002-1111-4111-8111-c20000000002','c1000002-1111-4111-8111-c10000000002','tr','Rehau',         'rehau',         'Teknik altyapi ve sera uygulamalarinda kullandigimiz cozum ortagi.',    JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'Rehau logosu',         'Rehau referansi',         'Bereket Fide is birlikleri.'),
  ('c2000003-1111-4111-8111-c20000000003','c1000003-1111-4111-8111-c10000000003','tr','Siemens',       'siemens',       'Otomasyon ve kontrol sistemlerinde one cikan partnerlerimizden biri.',  JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'Siemens logosu',       'Siemens referansi',       'Bereket Fide is birlikleri.'),
  ('c2000004-1111-4111-8111-c20000000004','c1000004-1111-4111-8111-c10000000004','tr','Kone',          'kone',          'Lojistik ve yapisal cozum alanlarinda birlikte calisilan marka.',       JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'Kone logosu',          'Kone referansi',          'Bereket Fide is birlikleri.'),
  ('c2000005-1111-4111-8111-c20000000005','c1000005-1111-4111-8111-c10000000005','tr','Daikin',        'daikin',        'Iklimlendirme ve sera dengeleme tarafinda tercih edilen cozum ortagi.',  JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'Daikin logosu',        'Daikin referansi',        'Bereket Fide is birlikleri.'),
  ('c2000006-1111-4111-8111-c20000000006','c1000006-1111-4111-8111-c10000000006','tr','Villeroy Boch', 'villeroy-boch', 'Kurumsal tedarik agimızdaki guvenilir markalardan biri.',               JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'Villeroy Boch logosu', 'Villeroy Boch referansi', 'Bereket Fide is birlikleri.'),
  ('c2000011-1111-4111-8111-c20000000011','c1000001-1111-4111-8111-c10000000001','en','Grohe',         'grohe',         'A global partner in irrigation and infrastructure.',                    JSON_OBJECT('html','<p>One of our solution partners.</p>'),'Grohe logo',           'Grohe reference',         'Bereket Fide collaborations.'),
  ('c2000012-1111-4111-8111-c20000000012','c1000002-1111-4111-8111-c10000000002','en','Rehau',         'rehau',         'A solution partner in technical infrastructure and greenhouse projects.', JSON_OBJECT('html','<p>One of our solution partners.</p>'),'Rehau logo',           'Rehau reference',         'Bereket Fide collaborations.'),
  ('c2000013-1111-4111-8111-c20000000013','c1000003-1111-4111-8111-c10000000003','en','Siemens',       'siemens',       'A key partner in automation and control systems.',                      JSON_OBJECT('html','<p>One of our solution partners.</p>'),'Siemens logo',         'Siemens reference',       'Bereket Fide collaborations.'),
  ('c2000014-1111-4111-8111-c20000000014','c1000004-1111-4111-8111-c10000000004','en','Kone',          'kone',          'A trusted brand in logistics and structural solutions.',                 JSON_OBJECT('html','<p>One of our solution partners.</p>'),'Kone logo',            'Kone reference',          'Bereket Fide collaborations.'),
  ('c2000015-1111-4111-8111-c20000000015','c1000005-1111-4111-8111-c10000000005','en','Daikin',        'daikin',        'A preferred partner for climate control and greenhouse systems.',         JSON_OBJECT('html','<p>One of our solution partners.</p>'),'Daikin logo',          'Daikin reference',        'Bereket Fide collaborations.'),
  ('c2000016-1111-4111-8111-c20000000016','c1000006-1111-4111-8111-c10000000006','en','Villeroy Boch', 'villeroy-boch', 'A reliable brand in our corporate supply network.',                      JSON_OBJECT('html','<p>One of our solution partners.</p>'),'Villeroy Boch logo',   'Villeroy Boch reference',  'Bereket Fide collaborations.')
ON DUPLICATE KEY UPDATE
  `title`              = VALUES(`title`),
  `slug`               = VALUES(`slug`),
  `summary`            = VALUES(`summary`),
  `content`            = VALUES(`content`),
  `featured_image_alt` = VALUES(`featured_image_alt`),
  `meta_title`         = VALUES(`meta_title`),
  `meta_description`   = VALUES(`meta_description`);
