-- =============================================================
-- FILE: 305_bereketfide_pages.seed.sql
-- Bereket Fide — Kurumsal + Yasal custom page içerikleri
-- module_key = 'bereketfide_about' | 'bereketfide_legal'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- 1) CLEANUP EXISTING PAGES
-- =========================
DELETE FROM `custom_pages` WHERE `module_key` IN ('bereketfide_about', 'bereketfide_legal');

-- =========================
-- 2) CUSTOM PAGES (BASE)
-- =========================
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
  ('bc010001-5001-4001-9001-cccccccc0001', 'bereketfide_about', 1, 0, 10, 10, '/uploads/products/23.28.30.jpeg', NULL, '/uploads/products/23.28.30.jpeg', NULL, '[]', '[]', NULL, NULL),
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
    JSON_OBJECT('html', '<h2>Gizlilik Politikası</h2><p>Bereket Fide Tarım San. ve Tic. Ltd. Şti. ("Bereket Fide") olarak, <strong>www.bereketfide.com.tr</strong> web sitesi üzerinden toplanan kişisel verilerin gizliliğini ve güvenliğini en üst düzeyde korumayı taahhüt ediyoruz. Bu Gizlilik Politikası, hangi verilerin toplandığını, nasıl kullanıldığını ve korunduğunu açıklamaktadır.</p><h3>1. Toplanan Veriler</h3><p>Web sitemizi ziyaret ettiğinizde ve formlarımızı doldurduğunuzda aşağıdaki veriler toplanabilir:</p><ul><li><strong>Kimlik bilgileri:</strong> Ad, soyad, firma adı</li><li><strong>İletişim bilgileri:</strong> E-posta adresi, telefon numarası, adres</li><li><strong>Talep bilgileri:</strong> Teklif formu üzerinden ilettiğiniz ürün tercihleri, miktar ve teslimat bilgileri</li><li><strong>Teknik veriler:</strong> IP adresi, tarayıcı türü, ziyaret edilen sayfalar, çerez verileri</li></ul><h3>2. Verilerin Kullanım Amacı</h3><p>Toplanan kişisel veriler aşağıdaki amaçlarla kullanılmaktadır:</p><ul><li>Müşteri teklif taleplerinin değerlendirilmesi ve yanıtlanması</li><li>Sipariş süreçlerinin yönetimi ve lojistik planlaması</li><li>Ürün ve hizmetlerimiz hakkında bilgilendirme yapılması</li><li>Web sitesi deneyiminin iyileştirilmesi ve analiz edilmesi</li><li>Yasal yükümlülüklerin yerine getirilmesi</li></ul><h3>3. Verilerin Paylaşımı</h3><p>Kişisel verileriniz, açık rızanız olmaksızın üçüncü kişilerle paylaşılmaz. Ancak yasal zorunluluklar, resmi kurum talepleri veya hizmet sağlayıcılarımızla (hosting, e-posta, lojistik) sınırlı kapsamda paylaşılabilir.</p><h3>4. Veri Güvenliği</h3><p>Verileriniz SSL şifreleme, güvenlik duvarları ve düzenli güvenlik güncellemeleri ile korunmaktadır. Yetkisiz erişime karşı teknik ve idari tedbirler alınmaktadır.</p><h3>5. Çerezler</h3><p>Web sitemizde kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanılmaktadır. Çerezler hakkında detaylı bilgi için Çerez Politikamızı inceleyebilirsiniz.</p><h3>6. Haklarınız</h3><p>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aşağıdaki haklara sahipsiniz:</p><ul><li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li><li>Verilerin düzeltilmesini veya silinmesini talep etme</li><li>İşlemenin kısıtlanmasını isteme</li><li>Veri taşınabilirliği hakkı</li><li>İtiraz hakkı</li></ul><h3>7. İletişim</h3><p>Gizlilik politikamız hakkında sorularınız için <strong>info@bereketfide.com.tr</strong> adresinden bizimle iletişime geçebilirsiniz.</p><p><em>Son güncelleme: Mart 2026</em></p>'),
    'Bereket Fide gizlilik politikası — kişisel verilerin toplanması, kullanımı ve korunması hakkında detaylı bilgilendirme.',
    'Gizlilik Politikası | Bereket Fide',
    'Bereket Fide gizlilik politikası ve kişisel veri işleme esasları. KVKK kapsamında haklarınız.',
    'gizlilik politikası, kvkk, kişisel veri, bereket fide'
  ),
  (
    'bc020003-6003-4003-a003-cccccccc0003',
    'bc010003-5003-4003-9003-cccccccc0003',
    'tr',
    'Kullanım Koşulları',
    'terms',
    JSON_OBJECT('html', '<h2>Kullanım Koşulları</h2><p><strong>www.bereketfide.com.tr</strong> web sitesini ("Site") kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. Lütfen bu koşulları dikkatlice okuyunuz.</p><h3>1. Genel Hükümler</h3><p>Bu Site, Bereket Fide Tarım San. ve Tic. Ltd. Şti. ("Bereket Fide") tarafından işletilmektedir. Sitedeki tüm içerikler (metin, görsel, logo, grafik, video) Bereket Fide''nin mülkiyetinde olup, telif hakları yasaları ile korunmaktadır.</p><h3>2. Fikri Mülkiyet</h3><p>Sitede yer alan tüm içerikler, tasarımlar, logolar, görseller ve yazılımlar Bereket Fide''ye aittir. Bu içeriklerin izinsiz kopyalanması, çoğaltılması, dağıtılması veya değiştirilmesi yasaktır ve yasal işlem başlatılabilir.</p><h3>3. Ürün ve Hizmet Bilgileri</h3><p>Sitedeki ürün açıklamaları, fiyatlar ve teknik bilgiler bilgilendirme amaçlıdır. Bereket Fide, bu bilgilerde önceden haber vermeksizin değişiklik yapma hakkını saklı tutar. Kesin fiyat ve stok bilgisi için doğrudan iletişime geçmeniz önerilir.</p><h3>4. Teklif ve Sipariş</h3><p>Site üzerinden gönderilen teklif talepleri bağlayıcı sipariş niteliği taşımaz. Her teklif, Bereket Fide tarafından değerlendirildikten sonra müşteriye ayrıca iletilir. Sipariş ancak karşılıklı yazılı onay ile kesinleşir.</p><h3>5. Sorumluluk Sınırlaması</h3><ul><li>Bereket Fide, sitedeki bilgilerin doğruluğu konusunda azami özen gösterir ancak hata olasılığını tamamen ortadan kaldıramaz.</li><li>Site üzerindeki dış bağlantıların (linkler) içeriklerinden Bereket Fide sorumlu değildir.</li><li>Teknik arızalar, bakım çalışmaları veya mücbir sebepler nedeniyle sitenin geçici olarak erişilemez olmasından dolayı sorumluluk kabul edilmez.</li></ul><h3>6. Gizlilik</h3><p>Kişisel verilerinizin işlenmesi hakkında detaylı bilgi için <a href="/tr/legal/privacy">Gizlilik Politikamızı</a> inceleyebilirsiniz.</p><h3>7. Uygulanacak Hukuk</h3><p>Bu kullanım koşulları Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda Antalya Mahkemeleri ve İcra Daireleri yetkilidir.</p><h3>8. Değişiklikler</h3><p>Bereket Fide, bu kullanım koşullarını herhangi bir zamanda güncelleme hakkını saklı tutar. Güncel versiyon her zaman bu sayfada yayınlanır.</p><h3>9. İletişim</h3><p>Kullanım koşulları hakkında sorularınız için <strong>info@bereketfide.com.tr</strong> adresinden bizimle iletişime geçebilirsiniz.</p><p><em>Son güncelleme: Mart 2026</em></p>'),
    'Bereket Fide web sitesi kullanım koşulları — fikri mülkiyet, sorumluluk sınırlaması ve yasal hükümler.',
    'Kullanım Koşulları | Bereket Fide',
    'Bereket Fide web sitesi kullanım koşulları, fikri mülkiyet hakları ve yasal bilgilendirme.',
    'kullanım koşulları, yasal, fikri mülkiyet, bereket fide'
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
    JSON_OBJECT('html', '<h2>Privacy Policy</h2><p>Bereket Fide Tarım San. ve Tic. Ltd. Şti. ("Bereket Fide") is committed to protecting the privacy and security of personal data collected through <strong>www.bereketfide.com.tr</strong>. This Privacy Policy explains what data is collected, how it is used, and how it is protected.</p><h3>1. Data Collected</h3><p>When you visit our website and fill in our forms, the following data may be collected:</p><ul><li><strong>Identity information:</strong> Name, surname, company name</li><li><strong>Contact information:</strong> Email address, phone number, address</li><li><strong>Request information:</strong> Product preferences, quantity, and delivery details submitted via the quote form</li><li><strong>Technical data:</strong> IP address, browser type, pages visited, cookie data</li></ul><h3>2. Purpose of Data Use</h3><p>Collected personal data is used for the following purposes:</p><ul><li>Evaluating and responding to customer quote requests</li><li>Managing order processes and logistics planning</li><li>Providing information about our products and services</li><li>Improving and analyzing website experience</li><li>Fulfilling legal obligations</li></ul><h3>3. Data Sharing</h3><p>Your personal data will not be shared with third parties without your explicit consent. However, it may be shared in limited scope with legal requirements, official authorities, or our service providers (hosting, email, logistics).</p><h3>4. Data Security</h3><p>Your data is protected with SSL encryption, firewalls, and regular security updates. Technical and administrative measures are taken against unauthorized access.</p><h3>5. Your Rights</h3><p>Under the Personal Data Protection Law (KVKK No. 6698), you have the right to:</p><ul><li>Learn whether your personal data is being processed</li><li>Request correction or deletion of your data</li><li>Request restriction of processing</li><li>Data portability</li><li>Object to processing</li></ul><h3>6. Contact</h3><p>For questions about our privacy policy, please contact us at <strong>info@bereketfide.com.tr</strong>.</p><p><em>Last updated: March 2026</em></p>'),
    'Bereket Fide privacy policy — detailed information about collection, use and protection of personal data.',
    'Privacy Policy | Bereket Fide',
    'Bereket Fide privacy policy and personal data processing principles.',
    'privacy policy, personal data, gdpr, bereket fide'
  ),
  (
    'bc020008-6008-4008-a008-cccccccc0008',
    'bc010003-5003-4003-9003-cccccccc0003',
    'en',
    'Terms of Use',
    'terms',
    JSON_OBJECT('html', '<h2>Terms of Use</h2><p>By using the <strong>www.bereketfide.com.tr</strong> website ("Site"), you agree to the following terms and conditions. Please read these terms carefully.</p><h3>1. General Provisions</h3><p>This Site is operated by Bereket Fide Tarım San. ve Tic. Ltd. Şti. ("Bereket Fide"). All content on the Site (text, images, logos, graphics, video) is the property of Bereket Fide and is protected by copyright laws.</p><h3>2. Intellectual Property</h3><p>All content, designs, logos, visuals, and software on the Site belong to Bereket Fide. Unauthorized copying, reproduction, distribution, or modification of this content is prohibited and may result in legal action.</p><h3>3. Product and Service Information</h3><p>Product descriptions, prices, and technical information on the Site are for informational purposes. Bereket Fide reserves the right to make changes without prior notice. For exact pricing and stock information, please contact us directly.</p><h3>4. Quotes and Orders</h3><p>Quote requests submitted through the Site do not constitute binding orders. Each quote is evaluated by Bereket Fide and separately communicated to the customer. Orders are finalized only with mutual written confirmation.</p><h3>5. Limitation of Liability</h3><ul><li>Bereket Fide takes maximum care regarding the accuracy of information on the Site but cannot completely eliminate the possibility of errors.</li><li>Bereket Fide is not responsible for the content of external links on the Site.</li><li>No liability is accepted for temporary inaccessibility of the Site due to technical failures, maintenance, or force majeure.</li></ul><h3>6. Governing Law</h3><p>These terms of use are governed by the laws of the Republic of Turkey. Antalya Courts and Enforcement Offices have jurisdiction in disputes.</p><h3>7. Contact</h3><p>For questions about these terms, please contact us at <strong>info@bereketfide.com.tr</strong>.</p><p><em>Last updated: March 2026</em></p>'),
    'Bereket Fide website terms of use — intellectual property, liability limitations and legal provisions.',
    'Terms of Use | Bereket Fide',
    'Bereket Fide website terms of use, intellectual property rights and legal information.',
    'terms of use, legal, intellectual property, bereket fide'
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
