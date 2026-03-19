-- =============================================================
-- SEED: Bereket Fide Services (6 hizmet, TR + EN i18n)
-- Resimler: mevcut dosyalar + products klasöründen
-- =============================================================

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM services_i18n WHERE service_id IN (
  'sv010001-0001-4001-9001-000000000001','sv010001-0001-4001-9001-000000000002',
  'sv010001-0001-4001-9001-000000000003','sv010001-0001-4001-9001-000000000004',
  'sv010001-0001-4001-9001-000000000005','sv010001-0001-4001-9001-000000000006'
);
DELETE FROM services WHERE id IN (
  'sv010001-0001-4001-9001-000000000001','sv010001-0001-4001-9001-000000000002',
  'sv010001-0001-4001-9001-000000000003','sv010001-0001-4001-9001-000000000004',
  'sv010001-0001-4001-9001-000000000005','sv010001-0001-4001-9001-000000000006'
);

-- 1) Aşılı Fide Üretimi (mevcut resim)
INSERT INTO services (id, module_key, is_active, is_featured, display_order, image_url, storage_asset_id)
VALUES ('sv010001-0001-4001-9001-000000000001', 'bereketfide', 1, 1, 1, '/uploads/products/WhatsApp%20Image%202026-03-17%20at%2023.28.07%20(1).jpeg', NULL);

INSERT INTO services_i18n (service_id, locale, title, slug, description, content, alt, tags, meta_title, meta_description)
VALUES
('sv010001-0001-4001-9001-000000000001', 'tr', 'Aşılı Fide Üretimi', 'asili-fide-uretimi',
 'Yüksek verimli, hastalıklara dayanıklı ve güçlü kök yapısına sahip aşılı fide üretimi.',
 '<p>Bereket Fide olarak, domates, patlıcan, karpuz ve kavun gibi ürünlerde uzman kadromuzla aşılı fide üretimi gerçekleştiriyoruz. Aşılı fidelerimiz, toprak kökenli hastalıklara karşı direnç sağlar ve verimliliği artırır.</p>',
 'Bereket Fide aşılı fide üretimi', '["aşılı fide", "domates", "patlıcan", "karpuz", "verim"]',
 'Aşılı Fide Üretimi | Bereket Fide', 'Yüksek verimli ve hastalıklara dayanıklı aşılı fide üretimi hizmetleri.'),
('sv010001-0001-4001-9001-000000000001', 'en', 'Grafted Seedling Production', 'grafted-seedling-production',
 'Production of high-yield, disease-resistant grafted seedlings with strong root structures.',
 '<p>As Bereket Fide, we produce grafted seedlings for products such as tomato, eggplant, watermelon, and melon. Our grafted seedlings provide resistance against soil-borne diseases and increase productivity.</p>',
 'Bereket Fide grafted seedling production', '["grafted seedling", "tomato", "eggplant", "watermelon", "yield"]',
 'Grafted Seedling Production | Bereket Fide', 'High-yield and disease-resistant grafted seedling production services.');

-- 2) Standart Fide Üretimi (mevcut resim)
INSERT INTO services (id, module_key, is_active, is_featured, display_order, image_url, storage_asset_id)
VALUES ('sv010001-0001-4001-9001-000000000002', 'bereketfide', 1, 1, 2, '/uploads/products/WhatsApp%20Image%202026-03-17%20at%2023.28.08%20(3).jpeg', NULL);

INSERT INTO services_i18n (service_id, locale, title, slug, description, content, alt, tags, meta_title, meta_description)
VALUES
('sv010001-0001-4001-9001-000000000002', 'tr', 'Standart Fide Üretimi', 'standart-fide-uretimi',
 'Modern seralarımızda bilgisayar kontrollü sistemlerle kaliteli standart fide üretimi.',
 '<p>Domates, biber, hıyar ve marul gibi sebze gruplarında en seçkin tohumlarla sağlıklı standart fide üretimi yapıyoruz. Steril ortamda yetiştirilen fidelerimiz hızlı adaptasyon sağlar.</p>',
 'Bereket Fide standart fide üretimi', '["fide", "sebze", "biber", "hıyar", "marul"]',
 'Standart Fide Üretimi | Bereket Fide', 'Sağlıklı ve kaliteli standart sebze fidesi üretimi.'),
('sv010001-0001-4001-9001-000000000002', 'en', 'Standard Seedling Production', 'standard-seedling-production',
 'Quality standard seedling production with computer-controlled systems in our modern greenhouses.',
 '<p>We produce healthy standard seedlings with the most distinguished seeds in vegetable groups such as tomato, pepper, cucumber, and lettuce.</p>',
 'Bereket Fide standard seedling production', '["seedling", "vegetable", "pepper", "cucumber", "lettuce"]',
 'Standard Seedling Production | Bereket Fide', 'Healthy and quality standard vegetable seedling production.');

-- 3) Teknik Destek ve Danışmanlık (ürün resmi kullan)
INSERT INTO services (id, module_key, is_active, is_featured, display_order, image_url, storage_asset_id)
VALUES ('sv010001-0001-4001-9001-000000000003', 'bereketfide', 1, 0, 3, '/uploads/products/23.28.33.jpeg', NULL);

INSERT INTO services_i18n (service_id, locale, title, slug, description, content, alt, tags, meta_title, meta_description)
VALUES
('sv010001-0001-4001-9001-000000000003', 'tr', 'Teknik Destek ve Danışmanlık', 'teknik-destek-danismanlik',
 'Dikimden hasada kadar üreticilerimize sunduğumuz uzman ziraat mühendisliği desteği.',
 '<p>Çiftçilerimizin fide dikim süreci, gübreleme programları ve hastalık yönetimi konularında profesyonel danışmanlık sağlıyoruz. Sahadaki uzman ekibimizle verimliliğinizi koruyoruz.</p>',
 'Bereket Fide teknik destek hizmetleri', '["danışmanlık", "ziraat", "mühendislik", "teknik destek"]',
 'Teknik Destek | Bereket Fide', 'Üreticiler için ziraat mühendisliği desteği ve tarımsal danışmanlık.'),
('sv010001-0001-4001-9001-000000000003', 'en', 'Technical Support & Consulting', 'technical-support-consulting',
 'Expert agricultural engineering support for our producers from planting to harvest.',
 '<p>We provide professional consulting to our farmers on seedling planting processes, fertilization programs, and disease management.</p>',
 'Bereket Fide technical support services', '["consulting", "agricultural", "engineering", "technical support"]',
 'Technical Support | Bereket Fide', 'Agricultural engineering support and consulting for producers.');

-- 4) Lojistik ve Güvenli Teslimat (ürün resmi kullan)
INSERT INTO services (id, module_key, is_active, is_featured, display_order, image_url, storage_asset_id)
VALUES ('sv010001-0001-4001-9001-000000000004', 'bereketfide', 1, 1, 4, '/uploads/products/23.28.34.jpeg', NULL);

INSERT INTO services_i18n (service_id, locale, title, slug, description, content, alt, tags, meta_title, meta_description)
VALUES
('sv010001-0001-4001-9001-000000000004', 'tr', 'Lojistik ve Güvenli Teslimat', 'lojistik-guvenli-teslimat',
 'Fidelerinizin tazeliğini koruyarak özel araçlarımızla kapınıza kadar teslimatı.',
 '<p>Üretilen fideleri, uygun iklim koşullarına sahip özel nakliye araçlarımızla Türkiye''nin her yerine güvenle ulaştırıyoruz.</p>',
 'Bereket Fide lojistik hizmetleri', '["lojistik", "teslimat", "nakliye", "güvenli"]',
 'Lojistik ve Teslimat | Bereket Fide', 'Fideler için güvenli nakliye ve zamanında teslimat çözümleri.'),
('sv010001-0001-4001-9001-000000000004', 'en', 'Logistics & Secure Delivery', 'logistics-secure-delivery',
 'Delivery of your seedlings to your door with our special vehicles, preserving their freshness.',
 '<p>We safely deliver the produced seedlings all over Turkey with our special transport vehicles equipped with suitable climate conditions.</p>',
 'Bereket Fide logistics services', '["logistics", "delivery", "transport", "secure"]',
 'Logistics & Delivery | Bereket Fide', 'Secure transport and timely delivery solutions for seedlings.');

-- 5) Sözleşmeli Üretim (ürün resmi kullan)
INSERT INTO services (id, module_key, is_active, is_featured, display_order, image_url, storage_asset_id)
VALUES ('sv010001-0001-4001-9001-000000000005', 'bereketfide', 1, 0, 5, '/uploads/products/23.28.35.jpeg', NULL);

INSERT INTO services_i18n (service_id, locale, title, slug, description, content, alt, tags, meta_title, meta_description)
VALUES
('sv010001-0001-4001-9001-000000000005', 'tr', 'Sözleşmeli Üretim', 'sozlesmeli-uretim',
 'Büyük ölçekli tarım işletmeleri için planlı ve programlı sözleşmeli fide üretimi çözümleri.',
 '<p>İşletmenizin ihtiyaç duyduğu fide miktarını ve çeşidini önceden planlayarak, en uygun maliyet ve en yüksek kalite standartlarında üretim yapıyoruz.</p>',
 'Bereket Fide sözleşmeli üretim', '["sözleşmeli", "üretim", "planlama", "tarım"]',
 'Sözleşmeli Üretim | Bereket Fide', 'Tarım işletmeleri için profesyonel sözleşmeli fide üretimi hizmetleri.'),
('sv010001-0001-4001-9001-000000000005', 'en', 'Contract Manufacturing', 'contract-manufacturing',
 'Planned and programmed contract seedling production solutions for large-scale agricultural enterprises.',
 '<p>By planning the quantity and variety of seedlings required by your business in advance, we produce at the most affordable cost and highest quality standards.</p>',
 'Bereket Fide contract manufacturing', '["contract", "manufacturing", "planning", "agricultural"]',
 'Contract Manufacturing | Bereket Fide', 'Professional contract seedling production services for agricultural enterprises.');

-- 6) Özel Çeşit Denemeleri ve Islah (ürün resmi kullan)
INSERT INTO services (id, module_key, is_active, is_featured, display_order, image_url, storage_asset_id)
VALUES ('sv010001-0001-4001-9001-000000000006', 'bereketfide', 1, 0, 6, '/uploads/products/23.28.36.jpeg', NULL);

INSERT INTO services_i18n (service_id, locale, title, slug, description, content, alt, tags, meta_title, meta_description)
VALUES
('sv010001-0001-4001-9001-000000000006', 'tr', 'Özel Çeşit Denemeleri', 'ozel-cesit-denemeleri',
 'Yeni tohum çeşitlerinin bölge şartlarına uyumu için gerçekleştirdiğimiz bilimsel deneme üretimi.',
 '<p>Tohum firmaları ve üreticilerle iş birliği yaparak, yeni geliştirilen çeşitlerin verim ve direnç performanslarını modern seralarımızda test ediyoruz.</p>',
 'Bereket Fide özel çeşit denemeleri', '["deneme", "islah", "tohum", "inovasyon"]',
 'Özel Çeşit Denemeleri | Bereket Fide', 'Yeni sebze çeşitleri için deneme üretimi ve ıslah çalışmaları.'),
('sv010001-0001-4001-9001-000000000006', 'en', 'Variety Trials & Breeding', 'variety-trials-breeding',
 'Scientific trial production for local adaptation of new seed varieties.',
 '<p>By collaborating with seed companies and producers, we test the yield and resistance performance of newly developed varieties in our modern greenhouses.</p>',
 'Bereket Fide variety trials', '["trials", "breeding", "seed", "innovation"]',
 'Variety Trials & Breeding | Bereket Fide', 'Trial production and breeding studies for new vegetable varieties.');

SET FOREIGN_KEY_CHECKS = 1;
