-- =============================================================
-- 231_projects_seed.sql
-- Bereket Fide referans proje kayıtları (parent tablo)
-- Konut, ticari, karma kullanım, restorasyon, altyapı, kamu projeleri
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

-- -------------------------------------------------------------
-- UUID tanımları (referans olarak — i18n dosyalarında tekrar kullanılır)
-- Proje prefix: 33333xxx-00NN-4333-8333-333300000NNN
-- -------------------------------------------------------------

INSERT INTO `projects`
(
  id,
  is_published, is_featured, display_order,
  featured_image, featured_image_asset_id,
  category, product_type, location, client_name,
  unit_count, fan_count,
  start_date, complete_date, completion_time_label,
  services, website_url, youtube_url, techs,
  created_at, updated_at
)
VALUES

-- ============================================================
-- 1. Boğaz Manzaralı Rezidans — İstanbul, Beşiktaş
-- ============================================================
(
  '33333001-0001-4333-8333-333300000001',
  1, 1, 10,
  '/uploads/projects/vista-insaat-proje-01.jpeg', NULL,
  'Konut', 'Lüks Rezidans', 'İstanbul, Beşiktaş', NULL,
  18, NULL,
  '2022-06-01', '2024-03-01', '18 bağımsız bölüm · 6 kat',
  '["Konut inşaatı","İç mimari tasarım","Peyzaj düzenleme","Akıllı ev sistemleri"]',
  NULL, NULL,
  '["Betonarme","Konut","Rezidans","Lüks","Boğaz Manzara"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 2. Levent Ofis Kulesi — İstanbul, Levent
-- ============================================================
(
  '33333001-0002-4333-8333-333300000002',
  1, 1, 20,
  '/uploads/projects/vista-insaat-proje-05.jpeg', NULL,
  'Ticari', 'A Sınıfı Ofis', 'İstanbul, Levent', NULL,
  NULL, NULL,
  '2021-09-01', '2023-12-01', '12 katlı yeşil sertifikalı ofis',
  '["Ticari inşaat","Çelik konstrüksiyon","Cam cephe sistemleri","LEED sertifikasyonu"]',
  NULL, NULL,
  '["Çelik","Cam Cephe","Ticari","Ofis","LEED","Yeşil Bina"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 3. Kadıköy Karma Yapı Kompleksi — İstanbul, Kadıköy
-- ============================================================
(
  '33333001-0003-4333-8333-333300000003',
  1, 1, 30,
  '/uploads/projects/vista-insaat-proje-10.jpeg', NULL,
  'Karma Kullanım', 'Konut + Ticari', 'İstanbul, Kadıköy', NULL,
  64, NULL,
  '2024-01-01', NULL, '64 konut + 3 kat ticari alan',
  '["Karma kullanım inşaat","Konut inşaatı","Ticari alan yapımı","Otopark inşaatı"]',
  NULL, NULL,
  '["Betonarme","Karma Kullanım","Konut","Ticari"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 4. Tarihi Han Restorasyon — İstanbul, Eminönü
-- ============================================================
(
  '33333001-0004-4333-8333-333300000004',
  1, 1, 40,
  '/uploads/projects/vista-insaat-proje-15.jpeg', NULL,
  'Restorasyon', 'Tarihi Yapı Restorasyonu', 'İstanbul, Eminönü', NULL,
  NULL, NULL,
  '2020-03-01', '2022-08-01', '19. yüzyıl han · özgün doku korunumu',
  '["Restorasyon","Tarihi yapı güçlendirme","Ahşap onarım","Taş restorasyon"]',
  NULL, NULL,
  '["Yığma Taş","Ahşap","Restorasyon","Tarihi Yapı","Koruma"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 5. Gebze Lojistik Merkezi — Kocaeli, Gebze
-- ============================================================
(
  '33333001-0005-4333-8333-333300000005',
  1, 0, 50,
  '/uploads/projects/vista-insaat-proje-20.jpeg', NULL,
  'Endüstriyel', 'Lojistik Depo', 'Kocaeli, Gebze', NULL,
  NULL, NULL,
  '2023-02-01', '2024-06-01', '8.000 m² prefabrik çelik yapı',
  '["Endüstriyel inşaat","Prefabrik çelik yapı","Depo inşaatı","Zemin güçlendirme"]',
  NULL, NULL,
  '["Prefabrik Çelik","Endüstriyel","Lojistik","Depo"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 6. Beşiktaş Sahil Rezidans — İstanbul, Beşiktaş
-- ============================================================
(
  '33333001-0006-4333-8333-333300000006',
  1, 0, 60,
  '/uploads/projects/vista-insaat-proje-25.jpeg', NULL,
  'Konut', 'Modern Rezidans', 'İstanbul, Beşiktaş', NULL,
  24, NULL,
  '2024-03-01', NULL, '24 daireli sahil rezidans',
  '["Konut inşaatı","Cephe kaplama","Peyzaj","Havuz inşaatı"]',
  NULL, NULL,
  '["Betonarme","Konut","Rezidans","Sahil","Modern"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 7. Ankara Kamu Hizmet Binası — Ankara, Çankaya
-- ============================================================
(
  '33333001-0007-4333-8333-333300000007',
  1, 1, 70,
  '/uploads/projects/vista-insaat-proje-30.jpeg', NULL,
  'Kamu', 'Hizmet Binası', 'Ankara, Çankaya', NULL,
  NULL, NULL,
  '2021-05-01', '2023-10-01', 'Bakanlık hizmet binası · 7 kat',
  '["Kamu binası inşaat","Cam cephe","Deprem güçlendirme","Mekanik tesisat"]',
  NULL, NULL,
  '["Betonarme","Cam Cephe","Kamu","Hizmet Binası"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 8. Bursa Altyapı ve Çevre Düzenlemesi — Bursa, Nilüfer
-- ============================================================
(
  '33333001-0008-4333-8333-333300000008',
  1, 0, 80,
  '/uploads/projects/vista-insaat-proje-35.jpeg', NULL,
  'Altyapı', 'Altyapı Yenileme', 'Bursa, Nilüfer', NULL,
  NULL, NULL,
  '2023-04-01', '2024-09-01', 'OSB altyapı yenileme · 45.000 m²',
  '["Altyapı yenileme","Çevre düzenleme","Yol yapımı","Kanalizasyon"]',
  NULL, NULL,
  '["Beton","Asfalt","Altyapı","Çevre Düzenleme"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 9. Antalya Boutique Otel — Antalya, Kaleiçi
-- ============================================================
(
  '33333001-0009-4333-8333-333300000009',
  1, 0, 90,
  '/uploads/projects/vista-insaat-proje-40.jpeg', NULL,
  'Turizm', 'Boutique Otel', 'Antalya, Kaleiçi', NULL,
  32, NULL,
  '2024-06-01', NULL, '32 odalı butik otel · tarihi doku',
  '["Otel inşaatı","Restorasyon","Ahşap işçiliği","Taş duvar"]',
  NULL, NULL,
  '["Yığma Taş","Ahşap","Turizm","Otel","Tarihi Doku"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 10. İzmir Teknoloji Kampüsü — İzmir, Bayraklı
-- ============================================================
(
  '33333001-0010-4333-8333-333300000010',
  1, 1, 100,
  '/uploads/projects/vista-insaat-proje-45.jpeg', NULL,
  'Ticari', 'Teknoloji Kampüsü', 'İzmir, Bayraklı', NULL,
  NULL, NULL,
  '2022-10-01', '2024-11-01', 'Sürdürülebilir ofis kampüsü · 32.000 m²',
  '["Ticari inşaat","Çelik konstrüksiyon","Cam cephe","Peyzaj"]',
  NULL, NULL,
  '["Çelik","Cam Cephe","Ticari","Teknoloji","Sürdürülebilir"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 11. Ümraniye Konut Projesi — İstanbul, Ümraniye
-- ============================================================
(
  '33333001-0011-4333-8333-333300000011',
  1, 0, 110,
  '/uploads/projects/vista-insaat-proje-03.jpeg', NULL,
  'Konut', 'Toplu Konut', 'İstanbul, Ümraniye', NULL,
  120, NULL,
  '2021-01-01', '2023-06-01', '120 daireli toplu konut',
  '["Toplu konut inşaat","Çevre düzenleme","Otopark","Sosyal tesis"]',
  NULL, NULL,
  '["Betonarme","Konut","Toplu Konut","Sosyal Tesis"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 12. Taksim Otel Renovasyon — İstanbul, Beyoğlu
-- ============================================================
(
  '33333001-0012-4333-8333-333300000012',
  1, 0, 120,
  '/uploads/projects/vista-insaat-proje-08.jpeg', NULL,
  'Turizm', 'Otel Renovasyon', 'İstanbul, Beyoğlu', NULL,
  85, NULL,
  '2022-11-01', '2024-02-01', '85 odalı otel renovasyonu',
  '["Otel renovasyon","İç mekan yenileme","Tesisat yenileme","Cephe yenileme"]',
  NULL, NULL,
  '["Betonarme","Turizm","Otel","Renovasyon"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 13. Eskişehir Üniversite Kampüsü — Eskişehir
-- ============================================================
(
  '33333001-0013-4333-8333-333300000013',
  1, 1, 130,
  '/uploads/projects/vista-insaat-proje-12.jpeg', NULL,
  'Kamu', 'Eğitim Yapısı', 'Eskişehir', NULL,
  NULL, NULL,
  '2020-08-01', '2023-01-01', 'Kampüs ek bina · 15.000 m²',
  '["Eğitim yapısı inşaat","Laboratuvar","Amfi","Kütüphane"]',
  NULL, NULL,
  '["Betonarme","Kamu","Eğitim","Kampüs","Üniversite"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 14. Mersin Serbest Bölge Depo — Mersin
-- ============================================================
(
  '33333001-0014-4333-8333-333300000014',
  1, 0, 140,
  '/uploads/projects/vista-insaat-proje-18.jpeg', NULL,
  'Endüstriyel', 'Serbest Bölge Depo', 'Mersin', NULL,
  NULL, NULL,
  '2023-07-01', '2024-12-01', 'Soğuk hava deposu · 12.000 m²',
  '["Depo inşaatı","Soğuk hava deposu","Çelik yapı","İzolasyon"]',
  NULL, NULL,
  '["Prefabrik Çelik","Endüstriyel","Depo","Soğuk Hava","Serbest Bölge"]',
  NOW(3), NOW(3)
),

-- ============================================================
-- 15. Bodrum Villa Projesi — Muğla, Bodrum
-- ============================================================
(
  '33333001-0015-4333-8333-333300000015',
  1, 0, 150,
  '/uploads/projects/vista-insaat-proje-22.jpeg', NULL,
  'Konut', 'Villa', 'Muğla, Bodrum', NULL,
  8, NULL,
  '2023-03-01', '2024-10-01', '8 villa · deniz manzaralı',
  '["Villa inşaatı","Havuz","Peyzaj","Taş duvar"]',
  NULL, NULL,
  '["Betonarme","Konut","Villa","Deniz Manzara","Bodrum"]',
  NOW(3), NOW(3)
);

COMMIT;
