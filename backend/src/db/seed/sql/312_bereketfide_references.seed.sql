-- =============================================================
-- 312_bereketfide_references.seed.sql
-- Bereket Fide - Is Birligi Firmalari (Tohum & Fide Markalari)
-- Logo path: /uploads/brand_references/<dosya>
-- =============================================================

INSERT INTO `references` (
  `id`, `is_published`, `is_featured`, `display_order`,
  `featured_image`, `website_url`, `category_id`
) VALUES
  ('c1000001-1111-4111-8111-c10000000001', 1, 1, 10, '/uploads/brand_references/enzazaden.jpg',     'https://www.enzazaden.com',         NULL),
  ('c1000002-1111-4111-8111-c10000000002', 1, 1, 20, '/uploads/brand_references/rijkzwaan.jpg',     'https://www.rijkzwaan.com',         NULL),
  ('c1000003-1111-4111-8111-c10000000003', 1, 1, 30, '/uploads/brand_references/seminis.jpg',       'https://www.seminis.com',           NULL),
  ('c1000004-1111-4111-8111-c10000000004', 1, 1, 40, '/uploads/brand_references/sakata.png',        'https://www.sakata.com',            NULL),
  ('c1000005-1111-4111-8111-c10000000005', 1, 1, 50, '/uploads/brand_references/nunhems.png',       'https://www.nunhems.com',           NULL),
  ('c1000006-1111-4111-8111-c10000000006', 1, 1, 60, '/uploads/brand_references/hmclause.png',      'https://www.hmclause.com',          NULL),
  ('c1000007-1111-4111-8111-c10000000007', 1, 1, 70, '/uploads/brand_references/genetika.png',      'https://www.genetikatohum.com',     NULL),
  ('c1000008-1111-4111-8111-c10000000008', 1, 1, 80, '/uploads/brand_references/yukseltohum.jpg',   'https://www.yukseltohum.com.tr',    NULL),
  ('c1000009-1111-4111-8111-c10000000009', 1, 1, 90, '/uploads/brand_references/anamas.jpeg',       'https://www.anamas.com.tr',         NULL),
  ('c1000010-1111-4111-8111-c10000000010', 1, 1,100, '/uploads/brand_references/vistaseed_logo_black.png','https://www.vistaseeds.com.tr',     NULL)
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
  -- TR
  ('c2000001-1111-4111-8111-c20000000001','c1000001-1111-4111-8111-c10000000001','tr','Enza Zaden',    'enza-zaden',    'Sebze tohumu alaninda dunya lideri Hollandali uretici firma.',                    JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'Enza Zaden logosu',    'Enza Zaden referansi',    'Bereket Fide is birlikleri.'),
  ('c2000002-1111-4111-8111-c20000000002','c1000002-1111-4111-8111-c10000000002','tr','Rijk Zwaan',    'rijk-zwaan',    'Yuksek kaliteli hibrit sebze tohumcusu olarak tercih ettigimiz marka.',           JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'Rijk Zwaan logosu',    'Rijk Zwaan referansi',    'Bereket Fide is birlikleri.'),
  ('c2000003-1111-4111-8111-c20000000003','c1000003-1111-4111-8111-c10000000003','tr','Seminis',       'seminis',       'Bayer buyumesi altinda faaliyet gosteren kuresel sebze tohumu markasidir.',        JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'Seminis logosu',       'Seminis referansi',       'Bereket Fide is birlikleri.'),
  ('c2000004-1111-4111-8111-c20000000004','c1000004-1111-4111-8111-c10000000004','tr','Sakata',        'sakata',        'Japonya kokenli, dunya genelinde taninmis sebze ve cicek tohumcusu.',             JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'Sakata logosu',        'Sakata referansi',        'Bereket Fide is birlikleri.'),
  ('c2000005-1111-4111-8111-c20000000005','c1000005-1111-4111-8111-c10000000005','tr','Nunhems',       'nunhems',       'BASF bunyesindeki uretici, sebze islah alaninda one cikan is birligimiz.',         JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'Nunhems logosu',       'Nunhems referansi',       'Bereket Fide is birlikleri.'),
  ('c2000006-1111-4111-8111-c20000000006','c1000006-1111-4111-8111-c10000000006','tr','HM.Clause',     'hmclause',      'Limagrain grubu ureticisi, Akdeniz iklim kusagi icin ozel cesitler sunar.',        JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'HM.Clause logosu',     'HM.Clause referansi',     'Bereket Fide is birlikleri.'),
  ('c2000007-1111-4111-8111-c20000000007','c1000007-1111-4111-8111-c10000000007','tr','Genetika',      'genetika',      'Tumuyle yerli islah calismalariyla one cikan Turk tohum firmasidir.',              JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'Genetika logosu',      'Genetika referansi',      'Bereket Fide is birlikleri.'),
  ('c2000008-1111-4111-8111-c20000000008','c1000008-1111-4111-8111-c10000000008','tr','Yuksel Tohum',  'yuksel-tohum',  'Turkiye kokenli, sebze ve sanayi bitkisi tohumculugunda lider is birligimiz.',     JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'Yuksel Tohum logosu',  'Yuksel Tohum referansi',  'Bereket Fide is birlikleri.'),
  ('c2000009-1111-4111-8111-c20000000009','c1000009-1111-4111-8111-c10000000009','tr','Anamas',        'anamas',        'Akdeniz bolgesi baslangiclı, kaliteli sebze tohumu uretimi yapan firma.',          JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'Anamas logosu',        'Anamas referansi',        'Bereket Fide is birlikleri.'),
  ('c2000010-1111-4111-8111-c20000000010','c1000010-1111-4111-8111-c10000000010','tr','VistaSeed',     'vistaseed',     'Ekosistem icerisindeki stratejik tohum partnerimiz, yuksek verimli cesitler.',     JSON_OBJECT('html','<p>Cozum ortaklarimizdan biridir.</p>'),'VistaSeed logosu',     'VistaSeed referansi',     'Bereket Fide is birlikleri.'),
  -- EN
  ('c2000011-1111-4111-8111-c20000000011','c1000001-1111-4111-8111-c10000000001','en','Enza Zaden',    'enza-zaden',    'World-leading Dutch vegetable seed producer and key solution partner.',            JSON_OBJECT('html','<p>One of our solution partners.</p>'),'Enza Zaden logo',      'Enza Zaden reference',    'Bereket Fide collaborations.'),
  ('c2000012-1111-4111-8111-c20000000012','c1000002-1111-4111-8111-c10000000002','en','Rijk Zwaan',    'rijk-zwaan',    'Premium hybrid vegetable seed brand trusted for consistent quality.',              JSON_OBJECT('html','<p>One of our solution partners.</p>'),'Rijk Zwaan logo',      'Rijk Zwaan reference',    'Bereket Fide collaborations.'),
  ('c2000013-1111-4111-8111-c20000000013','c1000003-1111-4111-8111-c10000000003','en','Seminis',       'seminis',       'Global vegetable seed brand operating under the Bayer group.',                    JSON_OBJECT('html','<p>One of our solution partners.</p>'),'Seminis logo',         'Seminis reference',       'Bereket Fide collaborations.'),
  ('c2000014-1111-4111-8111-c20000000014','c1000004-1111-4111-8111-c10000000004','en','Sakata',        'sakata',        'Japanese-origin global producer of vegetable and flower seeds.',                   JSON_OBJECT('html','<p>One of our solution partners.</p>'),'Sakata logo',          'Sakata reference',        'Bereket Fide collaborations.'),
  ('c2000015-1111-4111-8111-c20000000015','c1000005-1111-4111-8111-c10000000005','en','Nunhems',       'nunhems',       'BASF subsidiary known for advanced vegetable breeding programs.',                  JSON_OBJECT('html','<p>One of our solution partners.</p>'),'Nunhems logo',         'Nunhems reference',       'Bereket Fide collaborations.'),
  ('c2000016-1111-4111-8111-c20000000016','c1000006-1111-4111-8111-c10000000006','en','HM.Clause',     'hmclause',      'Limagrain group producer offering varieties tailored for Mediterranean climates.', JSON_OBJECT('html','<p>One of our solution partners.</p>'),'HM.Clause logo',       'HM.Clause reference',     'Bereket Fide collaborations.'),
  ('c2000017-1111-4111-8111-c20000000017','c1000007-1111-4111-8111-c10000000007','en','Genetika',      'genetika',      'Turkish seed company focused entirely on domestic breeding research.',             JSON_OBJECT('html','<p>One of our solution partners.</p>'),'Genetika logo',        'Genetika reference',      'Bereket Fide collaborations.'),
  ('c2000018-1111-4111-8111-c20000000018','c1000008-1111-4111-8111-c10000000008','en','Yuksel Tohum',  'yuksel-tohum',  'Turkish seed industry leader in vegetable and industrial crop varieties.',         JSON_OBJECT('html','<p>One of our solution partners.</p>'),'Yuksel Tohum logo',    'Yuksel Tohum reference',  'Bereket Fide collaborations.'),
  ('c2000019-1111-4111-8111-c20000000019','c1000009-1111-4111-8111-c10000000009','en','Anamas',        'anamas',        'Mediterranean-based quality vegetable seed producer and our trusted partner.',    JSON_OBJECT('html','<p>One of our solution partners.</p>'),'Anamas logo',          'Anamas reference',        'Bereket Fide collaborations.'),
  ('c2000020-1111-4111-8111-c20000000020','c1000010-1111-4111-8111-c10000000010','en','VistaSeed',     'vistaseed',     'Strategic seed partner within our ecosystem, offering high-yield varieties.',      JSON_OBJECT('html','<p>One of our solution partners.</p>'),'VistaSeed logo',       'VistaSeed reference',     'Bereket Fide collaborations.')
ON DUPLICATE KEY UPDATE
  `title`              = VALUES(`title`),
  `slug`               = VALUES(`slug`),
  `summary`            = VALUES(`summary`),
  `content`            = VALUES(`content`),
  `featured_image_alt` = VALUES(`featured_image_alt`),
  `meta_title`         = VALUES(`meta_title`),
  `meta_description`   = VALUES(`meta_description`);
