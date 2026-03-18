-- =============================================================
-- FILE: 305_bereketfide_pages.seed.sql
-- Bereket Fide — Kurumsal + Yasal custom page içerikleri
-- module_key = 'bereketfide_about' | 'bereketfide_legal'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

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
  ('bc010001-5001-4001-9001-cccccccc0001', 'bereketfide_about', 1, 0, 10, 10, '/uploads/projects/vista-insaat-proje-01.jpeg', NULL, '/uploads/projects/vista-insaat-proje-01.jpeg', NULL, '[]', '[]', NULL, NULL),
  ('bc010002-5002-4002-9002-cccccccc0002', 'bereketfide_legal', 1, 0, 20, 20, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL),
  ('bc010003-5003-4003-9003-cccccccc0003', 'bereketfide_legal', 1, 0, 30, 30, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL),
  ('bc010004-5004-4004-9004-cccccccc0004', 'bereketfide_legal', 1, 0, 40, 40, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL),
  ('bc010005-5005-4005-9005-cccccccc0005', 'bereketfide_legal', 1, 0, 50, 50, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL)
ON DUPLICATE KEY UPDATE
  `module_key` = VALUES(`module_key`),
  `is_published` = VALUES(`is_published`),
  `featured` = VALUES(`featured`),
  `display_order` = VALUES(`display_order`),
  `order_num` = VALUES(`order_num`),
  `featured_image` = VALUES(`featured_image`),
  `image_url` = VALUES(`image_url`);

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
    'bc020001-6001-4001-a001-cccccccc0001',
    'bc010001-5001-4001-9001-cccccccc0001',
    'tr',
    'Hakkımızda',
    'about',
    JSON_OBJECT('html', '<h2>Bereket Fide Hakkında</h2><p>Bereket Fide, 2006 yılında Antalya ili Aksu ilçesi Çamköy’de bölgedeki hazır fide ihtiyacını karşılamak amacıyla kurulmuştur. Bugün itibarıyla 32.000 m² toplam arazi üzerinde, 24.000 m² modern ve bilgisayar kontrollü seralarda üretim yapmaktadır.</p><p>Yıllık 16-17 milyon aşılı fide ve 18-20 milyon normal fide üretim kapasitesine sahip olan tesisimiz, bölgenin en modern üretim merkezlerinden biridir.</p><h2>Teknoloji ve Üretim</h2><p>Üretim süreçlerimizin tamamı bilgisayar kontrollü sulama, gübreleme, ısıtma ve nemlendirme sistemleri ile yönetilmektedir. Ayrıca, çevreye duyarlı üretim anlayışımızla tüm tesisimizin enerji ihtiyacı kendi güneş panellerimizden (yenilenebilir enerji) karşılanmaktadır.</p><h2>Kalite Politikamız</h2><p>Sürekli değişen müşteri taleplerini, teknoloji ve inovasyon odaklı satış stratejisi ile takip ederek müşteri memnuniyetini en üst düzeyde tutmayı hedefliyoruz. Tedarikçilerimiz ve çalışanlarımızla iş birliği içerisinde, sosyal sorumluluk ve çevre bilinci yüksek bir marka olma yolunda gelişmeye devam ediyoruz.</p>'),
    '2006 yılında kurulan Bereket Fide, Antalya Aksu’da 24.000 m² modern seralarda kaliteli fide üretimi yapmaktadır.',
    'Hakkımızda | Bereket Fide',
    'Bereket Fide hakkında: Antalya Aksu’da 2006’dan beri modern seralarda aşılı ve normal fide üretimi.',
    'bereket fide, hakkımızda, fide üretimi, antalya fide, aşılı fide'
  ),
  (
    'bc020002-6002-4002-a002-cccccccc0002',
    'bc010002-5002-4002-9002-cccccccc0002',
    'tr',
    'Gizlilik Politikası',
    'privacy',
    JSON_OBJECT('html', '<p>Bereket Fide olarak web sitemiz üzerinden paylaştığınız kişisel verilerin gizliliğini ve güvenliğini önemsiyoruz. Toplanan bilgiler yalnızca müşteri taleplerinin yönetilmesi ve bilgilendirme amaçlı kullanılır.</p>'),
    'Bereket Fide gizlilik politikası ve veri güvenliği.',
    'Gizlilik Politikası | Bereket Fide',
    'Bereket Fide gizlilik politikası ve kişisel veri işleme esasları.',
    'gizlilik politikası, bereket fide'
  ),
  (
    'bc020003-6003-4003-a003-cccccccc0003',
    'bc010003-5003-4003-9003-cccccccc0003',
    'tr',
    'Kullanım Koşulları',
    'terms',
    JSON_OBJECT('html', '<p>Bu web sitesini kullanan tüm ziyaretçiler kullanım koşullarını kabul etmiş sayılırlar. Sitedeki içerikler bilgilendirme amaçlıdır.</p>'),
    'Bereket Fide web sitesi kullanım şartları.',
    'Kullanım Koşulları | Bereket Fide',
    'Bereket Fide web sitesi kullanım koşulları.',
    'kullanım koşulları, bereket fide'
  ),
  (
    'bc020004-6004-4004-a004-cccccccc0004',
    'bc010004-5004-4004-9004-cccccccc0004',
    'tr',
    'KVKK Aydınlatma Metni',
    'kvkk-aydinlatma-metni',
    JSON_OBJECT('html', '<p>6698 sayılı KVKK kapsamında kişisel verilerinizin işlenme amaçları ve haklarınız hakkında bilgilendirme.</p>'),
    'Bereket Fide KVKK aydınlatma metni.',
    'KVKK Aydınlatma Metni | Bereket Fide',
    'Bereket Fide kişisel verilerin korunması kanunu bilgilendirmesi.',
    'kvkk, aydınlatma metni, bereket fide'
  ),
  (
    'bc020005-6005-4005-a005-cccccccc0005',
    'bc010005-5005-4005-9005-cccccccc0005',
    'tr',
    'Çerez Politikası',
    'cookies',
    JSON_OBJECT('html', '<p>Web sitemizde kullanıcı deneyimini artırmak amacıyla çerezler kullanılmaktadır.</p>'),
    'Bereket Fide çerez politikası.',
    'Çerez Politikası | Bereket Fide',
    'Bereket Fide çerez politikası ve kullanımı.',
    'çerezler, bereket fide'
  ),
  (
    'bc020006-6006-4006-a006-cccccccc0006',
    'bc010001-5001-4001-9001-cccccccc0001',
    'en',
    'About Us',
    'about',
    JSON_OBJECT('html', '<h2>About Bereket Fide</h2><p>Bereket Fide was established in 2006 in Aksu, Antalya, to meet the growing demand for ready-made seedlings. Today, it operates on a total area of 32,000 m², with 24,000 m² of modern and computer-controlled greenhouses.</p><p>With an annual production capacity of 16-17 million grafted seedlings and 18-20 million normal seedlings, our facility is one of the most modern production centers in the region.</p><h2>Technology and Production</h2><p>All of our production processes are managed by computer-controlled irrigation, fertilization, heating, and humidification systems. Furthermore, with our environment-friendly production approach, the energy needs of our entire facility are met by our own solar panels (renewable energy).</p><h2>Our Quality Policy</h2><p>We aim to keep customer satisfaction at the highest level by following constantly changing customer demands with a technology and innovation-oriented sales strategy. In cooperation with our suppliers and employees, we continue to develop as a brand with high social responsibility and environmental awareness.</p>'),
    'Founded in 2006, Bereket Fide produces high-quality seedlings in 24,000 m² modern greenhouses in Antalya Aksu.',
    'About Us | Bereket Fide',
    'About Bereket Fide: Modern greenhouse seedling production in Antalya Aksu since 2006.',
    'bereket fide, about us, seedling production, grafted seedlings'
  ),
  (
    'bc020007-6007-4007-a007-cccccccc0007',
    'bc010002-5002-4002-9002-cccccccc0002',
    'en',
    'Privacy Policy',
    'privacy',
    JSON_OBJECT('html', '<p>At Bereket Fide, we prioritize the privacy and security of your personal data shared through our website.</p>'),
    'Bereket Fide privacy policy and data security.',
    'Privacy Policy | Bereket Fide',
    'Bereket Fide website privacy policy.',
    'privacy policy, bereket fide'
  ),
  (
    'bc020008-6008-4008-a008-cccccccc0008',
    'bc010003-5003-4003-9003-cccccccc0003',
    'en',
    'Terms of Use',
    'terms',
    JSON_OBJECT('html', '<p>All visitors using this website are deemed to have accepted the terms of use.</p>'),
    'Bereket Fide website terms of use.',
    'Terms of Use | Bereket Fide',
    'Bereket Fide website terms and conditions.',
    'terms of use, bereket fide'
  ),
  (
    'bc020009-6009-4009-a009-cccccccc0009',
    'bc010004-5004-4004-9004-cccccccc0004',
    'en',
    'PDPL Information Notice',
    'pdpl-information-notice',
    JSON_OBJECT('html', '<p>Information regarding your rights and processing of your personal data under PDPL.</p>'),
    'Bereket Fide PDPL information notice.',
    'PDPL Information Notice | Bereket Fide',
    'Bereket Fide personal data protection law notice.',
    'pdpl, kvkk, bereket fide'
  ),
  (
    'bc020010-6010-4010-a010-cccccccc0010',
    'bc010005-5005-4005-9005-cccccccc0005',
    'en',
    'Cookie Policy',
    'cookies',
    JSON_OBJECT('html', '<p>Cookies are used on our website to improve user experience.</p>'),
    'Bereket Fide cookie policy.',
    'Cookie Policy | Bereket Fide',
    'Bereket Fide cookie usage and policy.',
    'cookies, bereket fide'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `content` = VALUES(`content`),
  `summary` = VALUES(`summary`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `tags` = VALUES(`tags`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
