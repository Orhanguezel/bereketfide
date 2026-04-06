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
  ('bc010005-5005-4005-9005-cccccccc0005', 'bereketfide_legal', 1, 0, 50, 50, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL),
  ('bc010006-5006-4006-9006-cccccccc0006', 'bereketfide_legal', 1, 0, 60, 60, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL),
  ('bc010007-5007-4007-9007-cccccccc0007', 'bereketfide_legal', 1, 0, 70, 70, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL),
  ('bc010008-5008-4008-9008-cccccccc0008', 'bereketfide_about', 1, 0, 15, 15, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL)
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
    JSON_OBJECT('html', '<p><strong>Kaliteli ve yüksek verimli fide üretimi</strong> için modern seralarımızda aşılı ve standart fide üretimi yapıyoruz; sürdürülebilir üretimde tesis enerjimizi güneş panellerimizle karşılıyoruz.</p><h2>Bereket Fide Hakkında</h2><p>Bereket Fide, 2006 yılında Antalya ili Aksu ilçesi Çamköy’de bölgedeki hazır fide ihtiyacını karşılamak amacıyla kurulmuştur. Bugün itibarıyla 32.000 m² toplam arazi üzerinde, 24.000 m² modern ve bilgisayar kontrollü seralarda üretim yapmaktadır.</p><p>Yıllık 16-17 milyon aşılı fide ve 18-20 milyon normal fide üretim kapasitesine sahip olan tesisimiz, bölgenin en modern üretim merkezlerinden biridir.</p><h2>Teknoloji ve Üretim</h2><p>Üretim süreçlerimizin tamamı bilgisayar kontrollü sulama, gübreleme, ısıtma ve nemlendirme sistemleri ile yönetilmektedir. Ayrıca, çevreye duyarlı üretim anlayışımızla tüm tesisimizin enerji ihtiyacı kendi güneş panellerimizden (yenilenebilir enerji) karşılanmaktadır.</p><h2>Kalite Politikamız</h2><p>Sürekli değişen müşteri taleplerini, teknoloji ve inovasyon odaklı satış stratejisi ile takip ederek müşteri memnuniyetini en üst düzeyde tutmayı hedefliyoruz. Tedarikçilerimiz ve çalışanlarımızla iş birliği içerisinde, sosyal sorumluluk ve çevre bilinci yüksek bir marka olma yolunda gelişmeye devam ediyoruz.</p>'),
    'Kaliteli ve yüksek verimli fide: modern seralarda aşılı ve standart üretim; Antalya Aksu’da 24.000 m² bilgisayar kontrollü tesis ve yenilenebilir enerji.',
    'Hakkımızda | Bereket Fide',
    'Bereket Fide: kaliteli fide üretimi, modern seralar ve sürdürülebilir enerji. Antalya Aksu’da 2006’dan beri aşılı ve normal fide.',
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
    JSON_OBJECT('html', '<h2>KVKK Aydınlatma Metni</h2><p>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, veri sorumlusu Bereket Fide Tarım San. ve Tic. Ltd. Şti. olarak kişisel verilerinizin işlenmesi hakkında sizi bilgilendiriyoruz.</p><h3>İşlenen veriler ve amaçlar</h3><p>İletişim formları, teklif talepleri ve sipariş süreçleri kapsamında kimlik, iletişim ve talebe ilişkin veriler; talebin karşılanması, sözleşmenin ifası, müşteri ilişkilerinin yürütülmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenir.</p><h3>Hukuki sebep ve aktarım</h3><p>Verileriniz KVKK md. 5/2 kapsamında sözleşmenin kurulması veya ifası, hukuki yükümlülük ve meşru menfaat gereklilikleri çerçevesinde işlenebilir; yasal zorunluluk ve hizmet sağlayıcılarla sınırlı paylaşım yapılabilir.</p><h3>Haklarınız</h3><p>KVKK md. 11 kapsamında verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep etme, işlemenin kısıtlanmasını isteme, veri taşınabilirliği ve itiraz haklarına sahipsiniz.</p><h3>Başvuru</h3><p>Taleplerinizi <strong>info@bereketfide.com.tr</strong> adresine iletebilirsiniz.</p><p><em>Son güncelleme: Nisan 2026</em></p>'),
    'Bereket Fide KVKK aydınlatma metni — işleme amaçları ve haklar.',
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
    JSON_OBJECT('html', '<h2>Çerez Politikası</h2><p>Bu politika, <strong>www.bereketfide.com.tr</strong> sitesinde çerezlerin nasıl kullanıldığını açıklar.</p><h3>Çerez nedir?</h3><p>Çerezler, tarayıcınızda saklanan küçük metin dosyalarıdır; site performansını ölçmek, tercihlerinizi hatırlamak ve güvenliği desteklemek için kullanılabilir.</p><h3>Kullandığımız çerez türleri</h3><ul><li><strong>Zorunlu:</strong> sitenin temel işlevleri için gerekli</li><li><strong>Tercih / işlevsel:</strong> dil veya form tercihleri gibi</li><li><strong>İstatistik (varsa):</strong> anonim veya toplu kullanım analizi</li></ul><h3>Yönetim</h3><p>Tarayıcı ayarlarından çerezleri silebilir veya engelleyebilirsiniz; bazı özellikler kısıtlanabilir.</p><h3>İletişim</h3><p>Sorularınız için <strong>info@bereketfide.com.tr</strong></p><p><em>Son güncelleme: Nisan 2026</em></p>'),
    'Bereket Fide çerez kullanımı ve yönetim bilgisi.',
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
    JSON_OBJECT('html', '<p>We focus on <strong>high-quality, high-yield seedling production</strong>, growing grafted and standard seedlings in modern greenhouses, with renewable energy from our solar panels.</p><h2>About Bereket Fide</h2><p>Bereket Fide was established in 2006 in Aksu, Antalya, to meet the growing demand for ready-made seedlings. Today, it operates on a total area of 32,000 m², with 24,000 m² of modern and computer-controlled greenhouses.</p><p>With an annual production capacity of 16-17 million grafted seedlings and 18-20 million normal seedlings, our facility is one of the most modern production centers in the region.</p><h2>Technology and Production</h2><p>All of our production processes are managed by computer-controlled irrigation, fertilization, heating, and humidification systems. Furthermore, with our environment-friendly production approach, the energy needs of our entire facility are met by our own solar panels (renewable energy).</p><h2>Our Quality Policy</h2><p>We aim to keep customer satisfaction at the highest level by following constantly changing customer demands with a technology and innovation-oriented sales strategy. In cooperation with our suppliers and employees, we continue to develop as a brand with high social responsibility and environmental awareness.</p>'),
    'Quality seedlings in modern greenhouses: grafted and standard production; 24,000 m² computer-controlled facility in Antalya Aksu with renewable energy.',
    'About Us | Bereket Fide',
    'Bereket Fide: quality seedling production, modern greenhouses and solar-powered operations in Antalya Aksu since 2006.',
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
    JSON_OBJECT('html', '<h2>Personal Data Protection Law Notice</h2><p>Under Law No. 6698 on the Protection of Personal Data (PDPL / KVKK), Bereket Fide Tarım San. ve Tic. Ltd. Şti. informs you about the processing of your personal data.</p><h3>Data and purposes</h3><p>Identity, contact and request-related data collected through contact forms, quote requests and order processes may be processed to respond to requests, perform contracts, manage customer relations and comply with legal obligations.</p><h3>Legal basis and transfers</h3><p>Processing may rely on contract performance, legal obligation and legitimate interests under PDPL; limited sharing may occur with service providers or authorities where required by law.</p><h3>Your rights</h3><p>You may request information, correction, deletion, restriction of processing, data portability and object to processing in line with PDPL Article 11.</p><h3>Contact</h3><p>Please contact <strong>info@bereketfide.com.tr</strong> for requests.</p><p><em>Last updated: April 2026</em></p>'),
    'Bereket Fide PDPL notice — processing purposes and your rights.',
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
    JSON_OBJECT('html', '<h2>Cookie Policy</h2><p>This policy explains how cookies are used on <strong>www.bereketfide.com.tr</strong>.</p><h3>What are cookies?</h3><p>Cookies are small text files stored in your browser. They may be used to measure site performance, remember preferences and support security.</p><h3>Types we may use</h3><ul><li><strong>Strictly necessary:</strong> required for core site functionality</li><li><strong>Functional / preference:</strong> e.g. language or form state</li><li><strong>Analytics (if enabled):</strong> aggregated or anonymised usage insights</li></ul><h3>Managing cookies</h3><p>You can delete or block cookies in your browser settings; some features may be limited.</p><h3>Contact</h3><p><strong>info@bereketfide.com.tr</strong></p><p><em>Last updated: April 2026</em></p>'),
    'Bereket Fide cookie usage and how to manage preferences.',
    'Cookie Policy | Bereket Fide',
    'Bereket Fide cookie usage and policy.',
    'cookies, bereket fide'
  ),
  (
    'bc020011-6011-4011-a011-cccccccc0011',
    'bc010006-5006-4006-9006-cccccccc0006',
    'tr',
    'Kalite Politikamız',
    'kalite-politikasi',
    JSON_OBJECT('html', '<h2>Kalite Politikamız</h2><p>Bereket Fide olarak sebze fidesi üretiminde müşteri beklentilerini, yasal mevzuatı ve sürdürülebilir tarım ilkelerini esas alıyoruz.</p><h3>Hedeflerimiz</h3><ul><li>Sağlıklı fide, tutarlı çeşit performansı ve zamanında teslimat</li><li>Üretim süreçlerinde izlenebilirlik ve kayıt tutma</li><li>Çalışan eğitimi ve sürekli iyileştirme</li><li>Çevreye duyarlı üretim (örnekleme, girdi yönetimi, atık minimizasyonu)</li></ul><h3>Uygulama</h3><p>Kalite anlayışımız; tohumdan fideye kadar üretim adımlarında kontrol noktaları, hijyen ve teknik standartlarla desteklenir. İyileştirme önerileri müşteri geri bildirimi ve iç denetimlerle değerlendirilir.</p><p><em>Son güncelleme: Nisan 2026</em></p>'),
    'Bereket Fide kalite politikası: sağlıklı fide, izlenebilir üretim ve müşteri memnuniyeti.',
    'Kalite Politikası | Bereket Fide',
    'Bereket Fide kalite politikası ve üretim taahhütleri.',
    'kalite politikası, fide üretimi, bereket fide'
  ),
  (
    'bc020012-6012-4012-a012-cccccccc0012',
    'bc010006-5006-4006-9006-cccccccc0006',
    'en',
    'Quality Policy',
    'quality-policy',
    JSON_OBJECT('html', '<h2>Quality Policy</h2><p>At Bereket Fide we align vegetable seedling production with customer expectations, applicable regulations, and sustainable agriculture principles.</p><h3>Objectives</h3><ul><li>Healthy seedlings, consistent variety performance, and on-time delivery</li><li>Traceability and record-keeping across production steps</li><li>Staff training and continuous improvement</li><li>Environmentally responsible production (inputs, sampling, waste minimization)</li></ul><h3>Implementation</h3><p>Our approach is supported by control points from seed to seedling, hygiene, and technical standards. Improvements are reviewed through customer feedback and internal checks.</p><p><em>Last updated: April 2026</em></p>'),
    'Bereket Fide quality policy: healthy seedlings, traceable production, customer focus.',
    'Quality Policy | Bereket Fide',
    'Bereket Fide quality policy and production commitments.',
    'quality policy, seedling production, bereket fide'
  ),
  (
    'bc020013-6013-4013-a013-cccccccc0013',
    'bc010006-5006-4006-9006-cccccccc0006',
    'de',
    'Qualitätspolitik',
    'qualitaetspolitik',
    JSON_OBJECT('html', '<h2>Qualitätspolitik</h2><p>Bei Bereket Fide richten wir die Produktion von Gemüsepflanzen an Kundenerwartungen, geltenden Vorschriften und Grundsätzen nachhaltiger Landwirtschaft aus.</p><h3>Ziele</h3><ul><li>Gesunde Pflanzen, gleichbleibende Sortenleistung und termingerechte Lieferung</li><li>Rückverfolgbarkeit und Dokumentation in der Produktion</li><li>Schulung der Mitarbeitenden und kontinuierliche Verbesserung</li><li>Umweltbewusste Produktion (Einsatzstoffe, Probenahme, Abfallminimierung)</li></ul><h3>Umsetzung</h3><p>Unser Ansatz stützt sich auf Kontrollpunkte vom Saatgut bis zur Pflanze, Hygiene und technische Standards. Verbesserungen werden über Kundenfeedback und interne Prüfungen bewertet.</p><p><em>Stand: April 2026</em></p>'),
    'Qualitätspolitik von Bereket Fide: gesunde Pflanzen, rückverfolgbare Produktion.',
    'Qualitätspolitik | Bereket Fide',
    'Qualitätspolitik und Produktionsverpflichtungen von Bereket Fide.',
    'qualitätspolitik, gemüsepflanzen, bereket fide'
  ),
  (
    'bc020014-6014-4014-a014-cccccccc0014',
    'bc010007-5007-4007-9007-cccccccc0007',
    'tr',
    'Hizmet Politikamız',
    'hizmet-politikasi',
    JSON_OBJECT('html', '<h2>Hizmet Politikamız</h2><p>Müşterilerimize açık iletişim, şeffaf süreç ve teknik destek sunmayı hedefliyoruz.</p><h3>Teklif ve sipariş</h3><p>Teklif talepleri değerlendirilir; nihai koşullar yazılı teyit ile netleşir. Üretim ve sevkiyat planlaması müşteri ihtiyacına ve mevsim dinamiklerine göre yapılır.</p><h3>Destek</h3><p>Çeşit seçimi, dikim önerileri ve teslimat ile ilgili sorularda ekiplerimizle iletişime geçebilirsiniz.</p><h3>Şikâyet ve geri bildirim</h3><p>Geri bildirimlerinizi <strong>info@bereketfide.com.tr</strong> üzerinden iletmenizi rica ederiz; kayıt altına alınır ve ilgili birimlere yönlendirilir.</p><p><em>Son güncelleme: Nisan 2026</em></p>'),
    'Bereket Fide hizmet politikası: iletişim, teklif süreci ve müşteri desteği.',
    'Hizmet Politikası | Bereket Fide',
    'Bereket Fide hizmet politikası ve müşteri süreçleri.',
    'hizmet politikası, müşteri hizmetleri, bereket fide'
  ),
  (
    'bc020015-6015-4015-a015-cccccccc0015',
    'bc010007-5007-4007-9007-cccccccc0007',
    'en',
    'Service Policy',
    'service-policy',
    JSON_OBJECT('html', '<h2>Service Policy</h2><p>We aim to provide clear communication, transparent processes, and technical support to our customers.</p><h3>Quotes and orders</h3><p>Quote requests are evaluated; final conditions are confirmed in writing. Production and shipment planning follows customer needs and seasonal dynamics.</p><h3>Support</h3><p>Contact our teams for variety selection, planting guidance, and delivery-related questions.</p><h3>Feedback</h3><p>Please send feedback to <strong>info@bereketfide.com.tr</strong>; it is logged and routed to the relevant teams.</p><p><em>Last updated: April 2026</em></p>'),
    'Bereket Fide service policy: communication, quoting, and customer support.',
    'Service Policy | Bereket Fide',
    'Bereket Fide service policy and customer processes.',
    'service policy, customer support, bereket fide'
  ),
  (
    'bc020016-6016-4016-a016-cccccccc0016',
    'bc010007-5007-4007-9007-cccccccc0007',
    'de',
    'Servicepolitik',
    'servicepolitik',
    JSON_OBJECT('html', '<h2>Servicepolitik</h2><p>Wir möchten unseren Kundinnen und Kunden klare Kommunikation, transparente Abläufe und technische Unterstützung bieten.</p><h3>Angebote und Bestellungen</h3><p>Anfragen werden geprüft; endgültige Bedingungen werden schriftlich bestätigt. Produktion und Versandplanung richten sich nach Kundenbedarf und Saisondynamik.</p><h3>Support</h3><p>Wenden Sie sich an unsere Teams bei Sortenwahl, Anbauhinweisen und Fragen zur Lieferung.</p><h3>Feedback</h3><p>Feedback senden Sie bitte an <strong>info@bereketfide.com.tr</strong>; es wird erfasst und weitergeleitet.</p><p><em>Stand: April 2026</em></p>'),
    'Servicepolitik von Bereket Fide: Kommunikation, Angebote und Support.',
    'Servicepolitik | Bereket Fide',
    'Servicepolitik und Kundenprozesse bei Bereket Fide.',
    'servicepolitik, kundenservice, bereket fide'
  ),
  (
    'bc020017-6017-4017-a017-cccccccc0017',
    'bc010008-5008-4008-9008-cccccccc0008',
    'tr',
    'İnsan Kaynakları',
    'insan-kaynaklari',
    JSON_OBJECT('html', '<h2>İnsan Kaynakları</h2><p>Bereket Fide, üretim ve operasyon süreçlerinde görev alacak adayları; güven, sürekli öğrenme ve ekip çalışması değerleriyle bir araya getirmeyi hedefler.</p><p>Güncel iş ilanları ve başvuru süreçleri için iletişim kanallarımızdan bize ulaşabilir veya <strong>info@bereketfide.com.tr</strong> adresine özgeçmişinizi iletebilirsiniz.</p>'),
    'Bereket Fide insan kaynakları ve başvuru bilgileri.',
    'İnsan Kaynakları | Bereket Fide',
    'Bereket Fide iş başvurusu ve kariyer iletişim bilgileri.',
    'insan kaynakları, kariyer, iş başvurusu, bereket fide'
  ),
  (
    'bc020018-6018-4018-a018-cccccccc0018',
    'bc010008-5008-4008-9008-cccccccc0008',
    'en',
    'Careers',
    'careers',
    JSON_OBJECT('html', '<h2>Careers</h2><p>Bereket Fide brings together people who want to grow with us in production and operations, guided by trust, continuous learning and teamwork.</p><p>For open roles and applications, please reach us through our contact channels or send your CV to <strong>info@bereketfide.com.tr</strong>.</p>'),
    'Careers at Bereket Fide — how to apply.',
    'Careers | Bereket Fide',
    'Careers and job applications at Bereket Fide.',
    'careers, jobs, human resources, bereket fide'
  ),
  (
    'bc020019-6019-4019-a019-cccccccc0019',
    'bc010008-5008-4008-9008-cccccccc0008',
    'de',
    'Karriere',
    'karriere',
    JSON_OBJECT('html', '<h2>Karriere</h2><p>Bereket Fide sucht Menschen für Produktion und Betrieb, die mit uns wachsen möchten — auf Basis von Vertrauen, kontinuierlichem Lernen und Teamarbeit.</p><p>Für offene Stellen und Bewerbungen erreichen Sie uns über die Kontaktwege oder senden Sie Ihre Unterlagen an <strong>info@bereketfide.com.tr</strong>.</p>'),
    'Karriere bei Bereket Fide — Bewerbung.',
    'Karriere | Bereket Fide',
    'Karriere und Bewerbungen bei Bereket Fide.',
    'karriere, jobs, personal, bereket fide'
  ),
  (
    'bc020020-6020-4020-a020-cccccccc0020',
    'bc010001-5001-4001-9001-cccccccc0001',
    'de',
    'Über uns',
    'about',
    JSON_OBJECT('html', '<p>Unser Schwerpunkt liegt auf <strong>qualitativ hochwertiger und ertragreicher Jungpflanzenproduktion</strong>: veredelte und Standard-Jungpflanzen in modernen Gewächshäusern, mit erneuerbarer Energie aus eigenen Solarmodulen.</p><h2>Über Bereket Fide</h2><p>Bereket Fide wurde 2006 in Çamköy, Aksu (Antalya), gegründet, um den regionalen Bedarf an Jungpflanzen zu decken. Heute produzieren wir auf insgesamt 32.000 m² Fläche, davon 24.000 m² in modernen, computergesteuerten Gewächshäusern.</p><p>Mit einer jährlichen Kapazität von 16–17 Millionen veredelten und 18–20 Millionen unveredelten Jungpflanzen zählt unser Standort zu den modernsten Produktionszentren der Region.</p><h2>Technologie und Produktion</h2><p>Sämtliche Abläufe werden über computergesteuerte Bewässerung, Düngung, Heizung und Befeuchtung geführt. Im Einklang mit umweltbewusster Produktion decken wir den Energiebedarf der Anlage über eigene Solarmodule (erneuerbare Energie).</p><h2>Unsere Qualitätspolitik</h2><p>Wir wollen Kundenzufriedenheit auf hohem Niveau halten, indem wir sich wandelnde Anforderungen mit einer technologie- und innovationsorientierten Vertriebsstrategie begleiten. Gemeinsam mit Lieferanten und Team entwickeln wir uns weiter – mit hohem sozialen Verantwortungsbewusstsein und Umweltbewusstsein.</p>'),
    'Hochwertige Jungpflanzen in modernen Gewächshäusern; 24.000 m² computergesteuerte Produktion in Antalya Aksu mit erneuerbarer Energie.',
    'Über uns | Bereket Fide',
    'Bereket Fide: Qualität, moderne Gewächshäuser und Solarstrom in Antalya Aksu seit 2006.',
    'bereket fide, über uns, jungpflanzen, antalya, veredelung'
  ),
  (
    'bc020021-6021-4021-a021-cccccccc0021',
    'bc010002-5002-4002-9002-cccccccc0002',
    'de',
    'Datenschutzerklärung',
    'privacy',
    JSON_OBJECT('html', '<h2>Datenschutzerklärung</h2><p>Bereket Fide Tarım San. ve Tic. Ltd. Şti. (<strong>Bereket Fide</strong>) verpflichtet sich zum Schutz personenbezogener Daten, die über <strong>www.bereketfide.com.tr</strong> erhoben werden. Diese Erklärung beschreibt, welche Daten wir erheben, wofür wir sie nutzen und wie wir sie schützen.</p><h3>1. Erhobene Daten</h3><p>Beim Besuch der Website und bei Formularnutzung können folgende Daten anfallen:</p><ul><li><strong>Identität:</strong> Vor- und Nachname, Firmenname</li><li><strong>Kontakt:</strong> E-Mail, Telefon, Adresse</li><li><strong>Anfragen:</strong> Produktpräferenzen, Mengen und Lieferhinweise aus dem Angebotsformular</li><li><strong>Technisch:</strong> IP-Adresse, Browsertyp, besuchte Seiten, Cookie-Daten</li></ul><h3>2. Zwecke</h3><ul><li>Bearbeitung und Beantwortung von Angebotsanfragen</li><li>Abwicklung von Bestellungen und Logistikplanung</li><li>Information über Produkte und Dienstleistungen</li><li>Verbesserung und Analyse der Website</li><li>Erfüllung gesetzlicher Pflichten</li></ul><h3>3. Weitergabe</h3><p>Eine Weitergabe an Dritte erfolgt ohne Ihre ausdrückliche Zustimmung nicht, ausgenommen gesetzliche Pflichten oder eingeschränkt an Dienstleister (Hosting, E-Mail, Logistik).</p><h3>4. Sicherheit</h3><p>Wir setzen SSL-Verschlüsselung, Firewalls und regelmäßige Updates ein; technische und organisatorische Maßnahmen schützen vor unbefugtem Zugriff.</p><h3>5. Cookies</h3><p>Wir verwenden Cookies zur Verbesserung der Nutzung. Details finden Sie in unserer Cookie-Richtlinie.</p><h3>6. Ihre Rechte</h3><p>Nach türkischem Datenschutzrecht (KVKK Nr. 6698) haben Sie unter anderem Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch.</p><h3>7. Kontakt</h3><p>Fragen zum Datenschutz: <strong>info@bereketfide.com.tr</strong></p><p><em>Stand: April 2026</em></p>'),
    'Datenschutz bei Bereket Fide: Erhebung, Nutzung und Schutz personenbezogener Daten.',
    'Datenschutz | Bereket Fide',
    'Datenschutzerklärung und Grundsätze der Datenverarbeitung bei Bereket Fide.',
    'datenschutz, kvkk, personenbezogene daten, bereket fide'
  ),
  (
    'bc020022-6022-4022-a022-cccccccc0022',
    'bc010003-5003-4003-9003-cccccccc0003',
    'de',
    'Nutzungsbedingungen',
    'terms',
    JSON_OBJECT('html', '<h2>Nutzungsbedingungen</h2><p>Mit der Nutzung von <strong>www.bereketfide.com.tr</strong> (<strong>Website</strong>) erkennen Sie die folgenden Bedingungen an.</p><h3>1. Allgemeines</h3><p>Die Website wird von Bereket Fide Tarım San. ve Tic. Ltd. Şti. betrieben. Sämtliche Inhalte (Texte, Bilder, Logos, Grafiken, Videos) sind Eigentum von Bereket Fide und urheberrechtlich geschützt.</p><h3>2. Geistiges Eigentum</h3><p>Vervielfältigung, Verbreitung oder Veränderung ohne Zustimmung ist untersagt und kann rechtliche Schritte nach sich ziehen.</p><h3>3. Produktinformationen</h3><p>Angaben zu Produkten, Preisen und Technik dienen der Information; Änderungen sind vorbehalten. Für verbindliche Preise und Verfügbarkeit kontaktieren Sie uns bitte direkt.</p><h3>4. Angebote und Bestellungen</h3><p>Anfragen über die Website sind unverbindlich; Bestellungen werden erst nach schriftlicher Bestätigung wirksam.</p><h3>5. Haftung</h3><ul><li>Wir bemühen uns um richtige Angaben, übernehmen jedoch keine Gewähr für Vollständigkeit.</li><li>Für Inhalte externer Links sind wir nicht verantwortlich.</li><li>Keine Haftung für vorübergehende Nichterreichbarkeit (Wartung, technische Störungen, höhere Gewalt).</li></ul><h3>6. Anwendbares Recht</h3><p>Es gilt das Recht der Republik Türkei; für Streitigkeiten sind die Gerichte und Vollstreckungsstellen in Antalya zuständig.</p><h3>7. Kontakt</h3><p><strong>info@bereketfide.com.tr</strong></p><p><em>Stand: April 2026</em></p>'),
    'Nutzungsbedingungen der Website Bereket Fide.',
    'Nutzungsbedingungen | Bereket Fide',
    'Nutzungsbedingungen, Urheberrecht und rechtliche Hinweise.',
    'nutzungsbedingungen, recht, bereket fide'
  ),
  (
    'bc020023-6023-4023-a023-cccccccc0023',
    'bc010004-5004-4004-9004-cccccccc0004',
    'de',
    'Hinweis zum Datenschutz (KVKK)',
    'kvkk-aydinlatma-metni',
    JSON_OBJECT('html', '<h2>Hinweis zum Datenschutz</h2><p>Gemäß dem türkischen Gesetz Nr. 6698 zum Schutz personenbezogener Daten (KVKK) informiert Sie Bereket Fide Tarım San. ve Tic. Ltd. Şti. als verantwortliche Stelle über die Verarbeitung Ihrer Daten.</p><h3>Daten und Zwecke</h3><p>Im Rahmen von Kontaktformularen, Angebotsanfragen und Bestellprozessen verarbeitete Identitäts-, Kontakt- und anfragebezogene Daten dienen der Bearbeitung Ihrer Anfragen, Vertragserfüllung, Kundenbetreuung und gesetzlichen Pflichten.</p><h3>Rechtsgrundlage und Weitergabe</h3><p>Die Verarbeitung kann auf Vertragserfüllung, gesetzliche Pflicht und berechtigtes Interesse gestützt sein; eine Weitergabe erfolgt eingeschränkt an Dienstleister oder Behörden, sofern gesetzlich erforderlich.</p><h3>Ihre Rechte</h3><p>Sie haben nach KVKK unter anderem Auskunfts-, Berichtigungs-, Löschungs- und Widerspruchsrechte sowie Rechte auf Datenübertragbarkeit und Einschränkung der Verarbeitung.</p><h3>Kontakt</h3><p><strong>info@bereketfide.com.tr</strong></p><p><em>Stand: April 2026</em></p>'),
    'KVKK-Datenschutzhinweis: Zwecke und Betroffenenrechte.',
    'Datenschutzhinweis (KVKK) | Bereket Fide',
    'Information zur Verarbeitung personenbezogener Daten nach türkischem KVKK.',
    'kvkk, datenschutz, personenbezogene daten, bereket fide'
  ),
  (
    'bc020024-6024-4024-a024-cccccccc0024',
    'bc010005-5005-4005-9005-cccccccc0005',
    'de',
    'Cookie-Richtlinie',
    'cookies',
    JSON_OBJECT('html', '<h2>Cookie-Richtlinie</h2><p>Diese Richtlinie erläutert den Einsatz von Cookies auf <strong>www.bereketfide.com.tr</strong>.</p><h3>Was sind Cookies?</h3><p>Cookies sind kleine Textdateien in Ihrem Browser; sie können zur Messung der Nutzung, zur Speicherung von Einstellungen und zur Unterstützung der Sicherheit dienen.</p><h3>Arten</h3><ul><li><strong>Notwendig:</strong> für grundlegende Funktionen der Website</li><li><strong>Funktional / Präferenz:</strong> z. B. Sprache oder Formularzustand</li><li><strong>Statistik (falls aktiv):</strong> anonymisierte oder aggregierte Auswertungen</li></ul><h3>Verwaltung</h3><p>Sie können Cookies in den Browsereinstellungen löschen oder blockieren; einige Funktionen können eingeschränkt sein.</p><h3>Kontakt</h3><p><strong>info@bereketfide.com.tr</strong></p><p><em>Stand: April 2026</em></p>'),
    'Cookie-Nutzung und Verwaltung bei Bereket Fide.',
    'Cookie-Richtlinie | Bereket Fide',
    'Cookies auf der Website von Bereket Fide.',
    'cookies, datenschutz, bereket fide'
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
