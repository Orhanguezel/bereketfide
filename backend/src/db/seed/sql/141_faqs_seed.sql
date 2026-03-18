-- =============================================================
-- 141_faqs_seed.sql
-- Bereket Fide – Multilingual FAQs seed (faqs + faqs_i18n)
--  - Şema 140_faqs.sql içinde tanımlı olmalı (DROP/CREATE yok)
--  - Burada sadece INSERT / ON DUPLICATE KEY UPDATE var
--  - TR + EN + DE (şimdilik)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- =============================================================
-- SEED: PARENT KAYITLAR (faqs)
-- =============================================================
INSERT INTO `faqs`
(`id`,                                `is_active`, `display_order`, `created_at`,                `updated_at`)
VALUES
('11111111-1111-1111-1111-111111111111', 1, 1, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('22222222-2222-2222-2222-222222222222', 1, 2, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('33333333-3333-3333-3333-333333333333', 1, 3, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('44444444-4444-4444-4444-444444444444', 1, 4, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('55555555-5555-5555-5555-555555555555', 1, 5, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('66666666-6666-6666-6666-666666666666', 1, 6, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('77777777-7777-7777-7777-777777777777', 1, 7, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),
('88888888-8888-8888-8888-888888888888', 1, 8, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `is_active`     = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`),
  `updated_at`    = VALUES(`updated_at`);

-- =============================================================
-- SEED: I18N KAYITLAR (faqs_i18n) – TR + EN + DE
-- =============================================================
INSERT INTO `faqs_i18n`
(`id`,
 `faq_id`,
 `locale`,
 `question`,
 `answer`,
 `slug`,
 `created_at`,
 `updated_at`)
VALUES

-- ========================================================-- =============================================================
-- 1) Aşılı Fide ve Teslimat FAQ
-- =============================================================
('fa01tr00-0000-0000-0000-000000000001',
 '11111111-1111-1111-1111-111111111111',
 'tr',
 'Aşılı fide ile normal fide arasındaki fark nedir?',
 'Aşılı fideler, hastalıklara daha dayanıklı bir anaç üzerine aşılanmış çeşitlerdir. Daha güçlü kök yapısı ve yüksek verim sağlarlar.',
 'asili-ve-normal-fide-farki',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa01en00-0000-0000-0000-000000000002',
 '11111111-1111-1111-1111-111111111111',
 'en',
 'What is the difference between grafted and normal seedlings?',
 'Grafted seedlings are varieties grafted onto more disease-resistant rootstock. They provide stronger root structures and higher yields.',
 'difference-between-grafted-and-normal-seedlings',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- =============================================================
-- 2) Teslimat Şartları
-- =============================================================
('fa02tr00-0000-0000-0000-000000000004',
 '22222222-2222-2222-2222-222222222222',
 'tr',
 'Fide teslimatlarını nasıl yapıyorsunuz?',
 'Fidelerimizi, iklimlendirme sistemine sahip özel araçlarımızla Türkiye’nin her yerine tazeliğini koruyarak ulaştırıyoruz.',
 'fide-teslimat-sartlari',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa02en00-0000-0000-0000-000000000005',
 '22222222-2222-2222-2222-222222222222',
 'en',
 'How do you deliver the seedlings?',
 'We deliver our seedlings all over Turkey using our special vehicles with climate control systems, preserving their freshness.',
 'seedling-delivery-terms',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- =============================================================
-- 3) Üretim Tesisi ve Güneş Enerjisi
-- =============================================================
('fa03tr00-0000-0000-0000-000000000007',
 '33333333-3333-3333-3333-333333333333',
 'tr',
 'Üretimde neden güneş enerjisi kullanıyorsunuz?',
 'Sürdürülebilirlik ilkemiz gereği, Antalya’daki tesisimizin enerji ihtiyacını güneşten karşılayarak karbon ayak izimizi azaltıyor ve doğayı koruyoruz.',
 'uretimde-gunes-enerjisi-kullanimi',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa03en00-0000-0000-0000-000000000008',
 '33333333-3333-3333-3333-333333333333',
 'en',
 'Why do you use solar energy in production?',
 'As per our sustainability principle, we meet the energy needs of our Antalya facility from the sun to reduce our carbon footprint and protect nature.',
 'solar-energy-in-production',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- =============================================================
-- 4) Sipariş ve Kapasite
-- =============================================================
('fa04tr00-0000-0000-0000-000000000010',
 '44444444-4444-4444-4444-444444444444',
 'tr',
 'Yıllık üretim kapasiteniz ne kadardır?',
 'Antalya Aksu’daki 32.000 m² modern seralarımızda yıllık toplam 35 milyon adet fide üretim kapasitesine sahibiz.',
 'yillik-uretim-kapasitesi',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('fa04en00-0000-0000-0000-000000000011',
 '44444444-4444-4444-4444-444444444444',
 'en',
 'What is your annual production capacity?',
 'We have an annual production capacity of 35 million seedlings in our 32,000 m² modern greenhouses in Antalya Aksu.',
 'annual-production-capacity',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000')

ON DUPLICATE KEY UPDATE
  `question`   = VALUES(`question`),
  `answer`     = VALUES(`answer`),
  `slug`       = VALUES(`slug`),
  `updated_at` = VALUES(`updated_at`);

COMMIT;
