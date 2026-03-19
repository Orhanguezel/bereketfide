INSERT INTO `references` (
  `id`,
  `is_published`,
  `is_featured`,
  `display_order`,
  `featured_image`,
  `website_url`,
  `category_id`
) VALUES
  (
    'c1000001-1111-4111-8111-c10000000001',
    1,
    1,
    10,
    '/brands/grohe.svg',
    'https://www.grohe.com/',
    NULL
  ),
  (
    'c1000002-1111-4111-8111-c10000000002',
    1,
    1,
    20,
    '/brands/rehau.svg',
    'https://www.rehau.com/',
    NULL
  ),
  (
    'c1000003-1111-4111-8111-c10000000003',
    1,
    1,
    30,
    '/brands/siemens.svg',
    'https://www.siemens.com/',
    NULL
  ),
  (
    'c1000004-1111-4111-8111-c10000000004',
    1,
    1,
    40,
    '/brands/kone.svg',
    'https://www.kone.com/',
    NULL
  ),
  (
    'c1000005-1111-4111-8111-c10000000005',
    1,
    1,
    50,
    '/brands/daikin.svg',
    'https://www.daikin.com/',
    NULL
  ),
  (
    'c1000006-1111-4111-8111-c10000000006',
    1,
    1,
    60,
    '/brands/villeroy-boch.svg',
    'https://www.villeroy-boch.com/',
    NULL
  )
ON DUPLICATE KEY UPDATE
  `is_published` = VALUES(`is_published`),
  `is_featured` = VALUES(`is_featured`),
  `display_order` = VALUES(`display_order`),
  `featured_image` = VALUES(`featured_image`),
  `website_url` = VALUES(`website_url`),
  `category_id` = VALUES(`category_id`);

INSERT INTO `references_i18n` (
  `id`,
  `reference_id`,
  `locale`,
  `title`,
  `slug`,
  `summary`,
  `content`,
  `featured_image_alt`,
  `meta_title`,
  `meta_description`
) VALUES
  (
    'c2000001-1111-4111-8111-c20000000001',
    'c1000001-1111-4111-8111-c10000000001',
    'tr',
    'Grohe',
    'grohe',
    'Sulama ve altyapi tedariklerinde is birligi yaptigimiz global marka.',
    JSON_OBJECT('html', '<p>Bereket Fide üretim ve altyapı süreçlerinde birlikte çalıştığımız çözüm ortaklarımızdan biridir.</p>'),
    'Grohe logosu',
    'Grohe referansı',
    'Bereket Fide iş birlikleri arasında yer alan Grohe referansı.'
  ),
  (
    'c2000002-1111-4111-8111-c20000000002',
    'c1000002-1111-4111-8111-c10000000002',
    'tr',
    'Rehau',
    'rehau',
    'Teknik altyapi ve sera uygulamalarinda kullandigimiz çözüm ortağı.',
    JSON_OBJECT('html', '<p>Bereket Fide’nin farklı üretim alanlarında çözüm ortaklığı kurduğu markalardan biridir.</p>'),
    'Rehau logosu',
    'Rehau referansı',
    'Bereket Fide iş birlikleri arasında yer alan Rehau referansı.'
  ),
  (
    'c2000003-1111-4111-8111-c20000000003',
    'c1000003-1111-4111-8111-c10000000003',
    'tr',
    'Siemens',
    'siemens',
    'Otomasyon ve kontrol sistemlerinde öne çıkan partnerlerimizden biri.',
    JSON_OBJECT('html', '<p>Bereket Fide teknoloji ve otomasyon tarafında birlikte çalıştığı markaları referans alan kurumsal bir yapıya sahiptir.</p>'),
    'Siemens logosu',
    'Siemens referansı',
    'Bereket Fide iş birlikleri arasında yer alan Siemens referansı.'
  ),
  (
    'c2000004-1111-4111-8111-c20000000004',
    'c1000004-1111-4111-8111-c10000000004',
    'tr',
    'Kone',
    'kone',
    'Lojistik ve yapisal cozum alanlarinda birlikte calisilan marka.',
    JSON_OBJECT('html', '<p>Bereket Fide saha ve tesis çözümlerinde güvenilir markalarla birlikte çalışır.</p>'),
    'Kone logosu',
    'Kone referansı',
    'Bereket Fide iş birlikleri arasında yer alan Kone referansı.'
  ),
  (
    'c2000005-1111-4111-8111-c20000000005',
    'c1000005-1111-4111-8111-c10000000005',
    'tr',
    'Daikin',
    'daikin',
    'Iklimlendirme ve sera dengeleme tarafinda tercih edilen cozum ortağı.',
    JSON_OBJECT('html', '<p>Bereket Fide tesislerinde verimlilik ve süreklilik için güçlü iş ortaklıkları kurar.</p>'),
    'Daikin logosu',
    'Daikin referansı',
    'Bereket Fide iş birlikleri arasında yer alan Daikin referansı.'
  ),
  (
    'c2000006-1111-4111-8111-c20000000006',
    'c1000006-1111-4111-8111-c10000000006',
    'tr',
    'Villeroy & Boch',
    'villeroy-boch',
    'Kurumsal tedarik ağımızdaki güvenilir markalardan biri.',
    JSON_OBJECT('html', '<p>Bereket Fide üretim kalitesini destekleyen farklı çözüm ortaklıklarıyla çalışır.</p>'),
    'Villeroy & Boch logosu',
    'Villeroy & Boch referansı',
    'Bereket Fide iş birlikleri arasında yer alan Villeroy & Boch referansı.'
  ),
  (
    'c2000011-1111-4111-8111-c20000000011',
    'c1000001-1111-4111-8111-c10000000001',
    'en',
    'Grohe',
    'grohe',
    'A global partner brand we collaborate with in irrigation and infrastructure.',
    JSON_OBJECT('html', '<p>One of the solution partners that supports Bereket Fide production and infrastructure operations.</p>'),
    'Grohe logo',
    'Grohe reference',
    'Grohe is one of the brands featured in Bereket Fide collaborations.'
  ),
  (
    'c2000012-1111-4111-8111-c20000000012',
    'c1000002-1111-4111-8111-c10000000002',
    'en',
    'Rehau',
    'rehau',
    'A solution partner used in technical infrastructure and greenhouse applications.',
    JSON_OBJECT('html', '<p>One of the brands Bereket Fide works with across multiple production environments.</p>'),
    'Rehau logo',
    'Rehau reference',
    'Rehau is one of the brands featured in Bereket Fide collaborations.'
  ),
  (
    'c2000013-1111-4111-8111-c20000000013',
    'c1000003-1111-4111-8111-c10000000003',
    'en',
    'Siemens',
    'siemens',
    'A key partner in automation and control systems.',
    JSON_OBJECT('html', '<p>Bereket Fide works with trusted brands for technology and automation infrastructure.</p>'),
    'Siemens logo',
    'Siemens reference',
    'Siemens is one of the brands featured in Bereket Fide collaborations.'
  ),
  (
    'c2000014-1111-4111-8111-c20000000014',
    'c1000004-1111-4111-8111-c10000000004',
    'en',
    'Kone',
    'kone',
    'A trusted brand we cooperate with in logistics and structural solutions.',
    JSON_OBJECT('html', '<p>Bereket Fide prefers reliable solution partners across facility and field operations.</p>'),
    'Kone logo',
    'Kone reference',
    'Kone is one of the brands featured in Bereket Fide collaborations.'
  ),
  (
    'c2000015-1111-4111-8111-c20000000015',
    'c1000005-1111-4111-8111-c10000000005',
    'en',
    'Daikin',
    'daikin',
    'A preferred partner for climate control and greenhouse balance systems.',
    JSON_OBJECT('html', '<p>Bereket Fide builds strong partnerships to maintain productivity and operational continuity.</p>'),
    'Daikin logo',
    'Daikin reference',
    'Daikin is one of the brands featured in Bereket Fide collaborations.'
  ),
  (
    'c2000016-1111-4111-8111-c20000000016',
    'c1000006-1111-4111-8111-c10000000006',
    'en',
    'Villeroy & Boch',
    'villeroy-boch',
    'One of the reliable brands in our corporate supply network.',
    JSON_OBJECT('html', '<p>Bereket Fide works with strong partners that support production quality and continuity.</p>'),
    'Villeroy & Boch logo',
    'Villeroy & Boch reference',
    'Villeroy & Boch is one of the brands featured in Bereket Fide collaborations.'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `summary` = VALUES(`summary`),
  `content` = VALUES(`content`),
  `featured_image_alt` = VALUES(`featured_image_alt`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);
