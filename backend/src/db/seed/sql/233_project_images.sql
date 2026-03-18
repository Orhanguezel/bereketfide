-- =============================================================
-- 233_project_images.sql
-- Bereket Fide proje galeri görselleri
-- Kaynak: /uploads/projects/ (yerel depolama)
-- =============================================================
-- UUID kalıpları:
--   project_images:       77777001-00NN-4777-8777-77770000NNNN
--   asset_id (placeholder): a0000001-00NN-4a00-8a00-a00000000NNN
--   images_i18n TR:       88881001-00NN-4888-8888-888810000NNN
--   images_i18n EN:       88882001-00NN-4888-8888-888820000NNN
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

-- =============================================================
-- 1. project_images  (30 görsel, 15 proje — her projede 2 görsel)
-- =============================================================

INSERT INTO `project_images`
  (id, project_id, asset_id, image_url, display_order, is_active, created_at, updated_at)
VALUES

-- ---- Proje 01 — Boğaz Manzaralı Rezidans (İstanbul, Beşiktaş) --------
('77777001-0001-4777-8777-777700000001',
 '33333001-0001-4333-8333-333300000001',
 'a0000001-0001-4a00-8a00-a00000000001',
 '/uploads/projects/vista-insaat-proje-01.jpeg',
 10, 1, NOW(3), NOW(3)),

('77777001-0002-4777-8777-777700000002',
 '33333001-0001-4333-8333-333300000001',
 'a0000001-0002-4a00-8a00-a00000000002',
 '/uploads/projects/vista-insaat-proje-02.jpeg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 02 — Levent Ofis Kulesi (İstanbul, Levent) ----------------
('77777001-0003-4777-8777-777700000003',
 '33333001-0002-4333-8333-333300000002',
 'a0000001-0003-4a00-8a00-a00000000003',
 '/uploads/projects/vista-insaat-proje-05.jpeg',
 10, 1, NOW(3), NOW(3)),

('77777001-0004-4777-8777-777700000004',
 '33333001-0002-4333-8333-333300000002',
 'a0000001-0004-4a00-8a00-a00000000004',
 '/uploads/projects/vista-insaat-proje-06.jpeg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 03 — Kadıköy Karma Yapı (İstanbul, Kadıköy) ---------------
('77777001-0005-4777-8777-777700000005',
 '33333001-0003-4333-8333-333300000003',
 'a0000001-0005-4a00-8a00-a00000000005',
 '/uploads/projects/vista-insaat-proje-10.jpeg',
 10, 1, NOW(3), NOW(3)),

('77777001-0006-4777-8777-777700000006',
 '33333001-0003-4333-8333-333300000003',
 'a0000001-0006-4a00-8a00-a00000000006',
 '/uploads/projects/vista-insaat-proje-11.jpeg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 04 — Tarihi Han Restorasyon (İstanbul, Eminönü) -----------
('77777001-0007-4777-8777-777700000007',
 '33333001-0004-4333-8333-333300000004',
 'a0000001-0007-4a00-8a00-a00000000007',
 '/uploads/projects/vista-insaat-proje-15.jpeg',
 10, 1, NOW(3), NOW(3)),

('77777001-0008-4777-8777-777700000008',
 '33333001-0004-4333-8333-333300000004',
 'a0000001-0008-4a00-8a00-a00000000008',
 '/uploads/projects/vista-insaat-proje-16.jpeg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 05 — Gebze Lojistik Merkezi (Kocaeli, Gebze) ---------------
('77777001-0009-4777-8777-777700000009',
 '33333001-0005-4333-8333-333300000005',
 'a0000001-0009-4a00-8a00-a00000000009',
 '/uploads/projects/vista-insaat-proje-20.jpeg',
 10, 1, NOW(3), NOW(3)),

('77777001-0010-4777-8777-777700000010',
 '33333001-0005-4333-8333-333300000005',
 'a0000001-0010-4a00-8a00-a00000000010',
 '/uploads/projects/vista-insaat-proje-21.jpeg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 06 — Beşiktaş Sahil Rezidans (İstanbul, Beşiktaş) ---------
('77777001-0011-4777-8777-777700000011',
 '33333001-0006-4333-8333-333300000006',
 'a0000001-0011-4a00-8a00-a00000000011',
 '/uploads/projects/vista-insaat-proje-25.jpeg',
 10, 1, NOW(3), NOW(3)),

('77777001-0012-4777-8777-777700000012',
 '33333001-0006-4333-8333-333300000006',
 'a0000001-0012-4a00-8a00-a00000000012',
 '/uploads/projects/vista-insaat-proje-26.jpeg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 07 — Ankara Kamu Hizmet Binası (Ankara, Çankaya) ----------
('77777001-0013-4777-8777-777700000013',
 '33333001-0007-4333-8333-333300000007',
 'a0000001-0013-4a00-8a00-a00000000013',
 '/uploads/projects/vista-insaat-proje-30.jpeg',
 10, 1, NOW(3), NOW(3)),

('77777001-0014-4777-8777-777700000014',
 '33333001-0007-4333-8333-333300000007',
 'a0000001-0014-4a00-8a00-a00000000014',
 '/uploads/projects/vista-insaat-proje-31.jpeg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 08 — Bursa Altyapı (Bursa, Nilüfer) -----------------------
('77777001-0015-4777-8777-777700000015',
 '33333001-0008-4333-8333-333300000008',
 'a0000001-0015-4a00-8a00-a00000000015',
 '/uploads/projects/vista-insaat-proje-35.jpeg',
 10, 1, NOW(3), NOW(3)),

('77777001-0016-4777-8777-777700000016',
 '33333001-0008-4333-8333-333300000008',
 'a0000001-0016-4a00-8a00-a00000000016',
 '/uploads/projects/vista-insaat-proje-36.jpeg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 09 — Antalya Butik Otel (Antalya, Kaleiçi) ----------------
('77777001-0017-4777-8777-777700000017',
 '33333001-0009-4333-8333-333300000009',
 'a0000001-0017-4a00-8a00-a00000000017',
 '/uploads/projects/vista-insaat-proje-40.jpeg',
 10, 1, NOW(3), NOW(3)),

('77777001-0018-4777-8777-777700000018',
 '33333001-0009-4333-8333-333300000009',
 'a0000001-0018-4a00-8a00-a00000000018',
 '/uploads/projects/vista-insaat-proje-41.jpeg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 10 — İzmir Teknoloji Kampüsü (İzmir, Bayraklı) ------------
('77777001-0019-4777-8777-777700000019',
 '33333001-0010-4333-8333-333300000010',
 'a0000001-0019-4a00-8a00-a00000000019',
 '/uploads/projects/vista-insaat-proje-45.jpeg',
 10, 1, NOW(3), NOW(3)),

('77777001-0020-4777-8777-777700000020',
 '33333001-0010-4333-8333-333300000010',
 'a0000001-0020-4a00-8a00-a00000000020',
 '/uploads/projects/vista-insaat-proje-46.jpeg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 11 — Ümraniye Konut (İstanbul, Ümraniye) -------------------
('77777001-0021-4777-8777-777700000021',
 '33333001-0011-4333-8333-333300000011',
 'a0000001-0021-4a00-8a00-a00000000021',
 '/uploads/projects/vista-insaat-proje-03.jpeg',
 10, 1, NOW(3), NOW(3)),

('77777001-0022-4777-8777-777700000022',
 '33333001-0011-4333-8333-333300000011',
 'a0000001-0022-4a00-8a00-a00000000022',
 '/uploads/projects/vista-insaat-proje-04.jpeg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 12 — Taksim Otel Renovasyon (İstanbul, Beyoğlu) -----------
('77777001-0023-4777-8777-777700000023',
 '33333001-0012-4333-8333-333300000012',
 'a0000001-0023-4a00-8a00-a00000000023',
 '/uploads/projects/vista-insaat-proje-08.jpeg',
 10, 1, NOW(3), NOW(3)),

('77777001-0024-4777-8777-777700000024',
 '33333001-0012-4333-8333-333300000012',
 'a0000001-0024-4a00-8a00-a00000000024',
 '/uploads/projects/vista-insaat-proje-09.jpeg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 13 — Eskişehir Üniversite Kampüsü -------------------------
('77777001-0025-4777-8777-777700000025',
 '33333001-0013-4333-8333-333300000013',
 'a0000001-0025-4a00-8a00-a00000000025',
 '/uploads/projects/vista-insaat-proje-12.jpeg',
 10, 1, NOW(3), NOW(3)),

('77777001-0026-4777-8777-777700000026',
 '33333001-0013-4333-8333-333300000013',
 'a0000001-0026-4a00-8a00-a00000000026',
 '/uploads/projects/vista-insaat-proje-13.jpeg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 14 — Mersin Serbest Bölge Depo ----------------------------
('77777001-0027-4777-8777-777700000027',
 '33333001-0014-4333-8333-333300000014',
 'a0000001-0027-4a00-8a00-a00000000027',
 '/uploads/projects/vista-insaat-proje-18.jpeg',
 10, 1, NOW(3), NOW(3)),

('77777001-0028-4777-8777-777700000028',
 '33333001-0014-4333-8333-333300000014',
 'a0000001-0028-4a00-8a00-a00000000028',
 '/uploads/projects/vista-insaat-proje-19.jpeg',
 20, 1, NOW(3), NOW(3)),

-- ---- Proje 15 — Bodrum Villa Projesi (Muğla, Bodrum) ------------------
('77777001-0029-4777-8777-777700000029',
 '33333001-0015-4333-8333-333300000015',
 'a0000001-0029-4a00-8a00-a00000000029',
 '/uploads/projects/vista-insaat-proje-22.jpeg',
 10, 1, NOW(3), NOW(3)),

('77777001-0030-4777-8777-777700000030',
 '33333001-0015-4333-8333-333300000015',
 'a0000001-0030-4a00-8a00-a00000000030',
 '/uploads/projects/vista-insaat-proje-23.jpeg',
 20, 1, NOW(3), NOW(3));


-- =============================================================
-- 2. project_images_i18n  — TÜRKÇE (tr)
-- =============================================================

INSERT INTO `project_images_i18n`
  (id, image_id, locale, alt, caption, created_at, updated_at)
VALUES

-- Proje 01 — Boğaz Manzaralı Rezidans
('88881001-0001-4888-8888-888810000001',
 '77777001-0001-4777-8777-777700000001', 'tr',
 'Boğaz manzaralı lüks rezidans dış cephe görünümü',
 'İstanbul Beşiktaş''ta Boğaz manzarasına hakim 18 daireli lüks rezidans — Bereket Fide konut projesi',
 NOW(3), NOW(3)),

('88881001-0002-4888-8888-888810000002',
 '77777001-0002-4777-8777-777700000002', 'tr',
 'Beşiktaş rezidans Boğaz cephe detayı',
 'Boğaz Manzaralı Rezidans — cam cephe ve balkon detayları, 6 katlı betonarme yapı',
 NOW(3), NOW(3)),

-- Proje 02 — Levent Ofis Kulesi
('88881001-0003-4888-8888-888810000003',
 '77777001-0003-4777-8777-777700000003', 'tr',
 'Levent ofis kulesi cam cephe genel görünüm',
 'Levent''te 12 katlı LEED sertifikalı A sınıfı ofis kulesi — çelik konstrüksiyon ve cam cephe sistemi',
 NOW(3), NOW(3)),

('88881001-0004-4888-8888-888810000004',
 '77777001-0004-4777-8777-777700000004', 'tr',
 'Levent ofis kulesi giriş ve çevre düzenleme',
 'Yeşil sertifikalı ofis kulesi giriş katı ve peyzaj alanı — Bereket Fide ticari proje',
 NOW(3), NOW(3)),

-- Proje 03 — Kadıköy Karma Yapı
('88881001-0005-4888-8888-888810000005',
 '77777001-0005-4777-8777-777700000005', 'tr',
 'Kadıköy karma yapı kompleksi inşaat görünümü',
 'Kadıköy''de 64 konut + 3 kat ticari alanlı karma yapı kompleksi — devam eden proje',
 NOW(3), NOW(3)),

('88881001-0006-4888-8888-888810000006',
 '77777001-0006-4777-8777-777700000006', 'tr',
 'Kadıköy karma kullanım projesi cephe detayı',
 'Karma kullanım yapı kompleksi ticari zemin kat ve konut üst kat cephe görünümü',
 NOW(3), NOW(3)),

-- Proje 04 — Tarihi Han Restorasyon
('88881001-0007-4888-8888-888810000007',
 '77777001-0007-4777-8777-777700000007', 'tr',
 'Eminönü tarihi han restorasyon taş duvar detayı',
 '19. yüzyıl Osmanlı hanı restorasyonu — özgün taş duvar dokusu korunarak güçlendirme',
 NOW(3), NOW(3)),

('88881001-0008-4888-8888-888810000008',
 '77777001-0008-4777-8777-777700000008', 'tr',
 'Tarihi han ahşap çatı onarımı',
 'Eminönü tarihi han — ahşap çatı ve döşeme elemanlarının geleneksel tekniklerle restorasyonu',
 NOW(3), NOW(3)),

-- Proje 05 — Gebze Lojistik Merkezi
('88881001-0009-4888-8888-888810000009',
 '77777001-0009-4777-8777-777700000009', 'tr',
 'Gebze lojistik depo prefabrik çelik yapı',
 'Gebze''de 8.000 m² prefabrik çelik yapı lojistik depo — Bereket Fide endüstriyel proje',
 NOW(3), NOW(3)),

('88881001-0010-4888-8888-888810000010',
 '77777001-0010-4777-8777-777700000010', 'tr',
 'Gebze lojistik merkezi yükleme rampaları',
 'Lojistik depo yükleme rampaları ve geniş açıklıklı çelik yapı iç mekan görünümü',
 NOW(3), NOW(3)),

-- Proje 06 — Beşiktaş Sahil Rezidans
('88881001-0011-4888-8888-888810000011',
 '77777001-0011-4777-8777-777700000011', 'tr',
 'Beşiktaş sahil rezidans modern cephe',
 'Beşiktaş sahilde 24 daireli modern rezidans — cephe kaplama ve peyzaj çalışması',
 NOW(3), NOW(3)),

('88881001-0012-4888-8888-888810000012',
 '77777001-0012-4777-8777-777700000012', 'tr',
 'Sahil rezidans havuz ve peyzaj alanı',
 'Beşiktaş Sahil Rezidans — havuz alanı ve peyzaj düzenlemesi, deniz manzarası',
 NOW(3), NOW(3)),

-- Proje 07 — Ankara Kamu Hizmet Binası
('88881001-0013-4888-8888-888810000013',
 '77777001-0013-4777-8777-777700000013', 'tr',
 'Ankara bakanlık hizmet binası cam cephe',
 'Çankaya''da 7 katlı bakanlık hizmet binası — cam cephe ve deprem güçlendirme uygulaması',
 NOW(3), NOW(3)),

('88881001-0014-4888-8888-888810000014',
 '77777001-0014-4777-8777-777700000014', 'tr',
 'Ankara kamu binası giriş katı',
 'Bakanlık hizmet binası giriş katı ve çevre düzenlemesi — Bereket Fide kamu projesi',
 NOW(3), NOW(3)),

-- Proje 08 — Bursa Altyapı
('88881001-0015-4888-8888-888810000015',
 '77777001-0015-4777-8777-777700000015', 'tr',
 'Bursa OSB altyapı yenileme yol yapımı',
 'Bursa Nilüfer OSB altyapı yenileme — yol yapımı ve kanalizasyon çalışması',
 NOW(3), NOW(3)),

('88881001-0016-4888-8888-888810000016',
 '77777001-0016-4777-8777-777700000016', 'tr',
 'Bursa altyapı çevre düzenleme peyzaj',
 'OSB altyapı yenileme sonrası çevre düzenleme ve peyzaj — 45.000 m² alan',
 NOW(3), NOW(3)),

-- Proje 09 — Antalya Butik Otel
('88881001-0017-4888-8888-888810000017',
 '77777001-0017-4777-8777-777700000017', 'tr',
 'Antalya Kaleiçi butik otel taş cephe',
 'Kaleiçi''nde 32 odalı butik otel — yığma taş ve ahşap işçiliği ile tarihi doku uyumu',
 NOW(3), NOW(3)),

('88881001-0018-4888-8888-888810000018',
 '77777001-0018-4777-8777-777700000018', 'tr',
 'Kaleiçi butik otel avlu ve peyzaj',
 'Antalya Kaleiçi butik otel avlu düzenlemesi — geleneksel mimari ile modern konfor',
 NOW(3), NOW(3)),

-- Proje 10 — İzmir Teknoloji Kampüsü
('88881001-0019-4888-8888-888810000019',
 '77777001-0019-4777-8777-777700000019', 'tr',
 'İzmir teknoloji kampüsü çelik ve cam cephe',
 'Bayraklı''da 32.000 m² sürdürülebilir teknoloji ofis kampüsü — çelik konstrüksiyon ve cam cephe',
 NOW(3), NOW(3)),

('88881001-0020-4888-8888-888810000020',
 '77777001-0020-4777-8777-777700000020', 'tr',
 'İzmir teknoloji kampüsü peyzaj ve yeşil alan',
 'Teknoloji kampüsü peyzaj düzenlemesi ve yeşil çatı uygulaması — sürdürülebilir yapı',
 NOW(3), NOW(3)),

-- Proje 11 — Ümraniye Konut
('88881001-0021-4888-8888-888810000021',
 '77777001-0021-4777-8777-777700000021', 'tr',
 'Ümraniye toplu konut projesi genel görünüm',
 'Ümraniye''de 120 daireli toplu konut projesi — sosyal tesis ve otopark dahil',
 NOW(3), NOW(3)),

('88881001-0022-4888-8888-888810000022',
 '77777001-0022-4777-8777-777700000022', 'tr',
 'Ümraniye konut çevre düzenleme alanı',
 'Toplu konut projesi çevre düzenleme ve sosyal tesis alanları — Bereket Fide',
 NOW(3), NOW(3)),

-- Proje 12 — Taksim Otel Renovasyon
('88881001-0023-4888-8888-888810000023',
 '77777001-0023-4777-8777-777700000023', 'tr',
 'Taksim otel renovasyon cephe yenileme',
 'Taksim''de 85 odalı otel renovasyonu — cephe yenileme ve iç mekan düzenleme',
 NOW(3), NOW(3)),

('88881001-0024-4888-8888-888810000024',
 '77777001-0024-4777-8777-777700000024', 'tr',
 'Taksim otel lobi renovasyon',
 'Otel renovasyonu lobi ve resepsiyon alanı yenileme — Bereket Fide turizm projesi',
 NOW(3), NOW(3)),

-- Proje 13 — Eskişehir Üniversite Kampüsü
('88881001-0025-4888-8888-888810000025',
 '77777001-0025-4777-8777-777700000025', 'tr',
 'Eskişehir üniversite kampüsü ek bina cephesi',
 'Üniversite kampüsü 15.000 m² ek eğitim binası — laboratuvar, amfi ve kütüphane',
 NOW(3), NOW(3)),

('88881001-0026-4888-8888-888810000026',
 '77777001-0026-4777-8777-777700000026', 'tr',
 'Üniversite kampüsü eğitim binası iç mekan',
 'Kampüs ek bina amfi ve ders salonları — modern eğitim altyapısı',
 NOW(3), NOW(3)),

-- Proje 14 — Mersin Serbest Bölge Depo
('88881001-0027-4888-8888-888810000027',
 '77777001-0027-4777-8777-777700000027', 'tr',
 'Mersin serbest bölge soğuk hava deposu çelik yapı',
 'Mersin Serbest Bölge''de 12.000 m² soğuk hava deposu — prefabrik çelik ve izolasyon sistemi',
 NOW(3), NOW(3)),

('88881001-0028-4888-8888-888810000028',
 '77777001-0028-4777-8777-777700000028', 'tr',
 'Soğuk hava deposu iç mekan izolasyon',
 'Soğuk hava deposu farklı sıcaklık bölgeleri ve izolasyon detayı — endüstriyel depo',
 NOW(3), NOW(3)),

-- Proje 15 — Bodrum Villa
('88881001-0029-4888-8888-888810000029',
 '77777001-0029-4777-8777-777700000029', 'tr',
 'Bodrum deniz manzaralı villa projesi',
 'Bodrum''da 8 adet deniz manzaralı villa — özel havuz ve doğal taş kaplama',
 NOW(3), NOW(3)),

('88881001-0030-4888-8888-888810000030',
 '77777001-0030-4777-8777-777700000030', 'tr',
 'Bodrum villa havuz ve peyzaj alanı',
 'Bodrum villa projesi — özel havuz, teras ve Ege mimarisi peyzaj düzenlemesi',
 NOW(3), NOW(3));


-- =============================================================
-- 3. project_images_i18n  — ENGLISH (en)
-- =============================================================

INSERT INTO `project_images_i18n`
  (id, image_id, locale, alt, caption, created_at, updated_at)
VALUES

-- Proje 01 — Bosphorus View Residence
('88882001-0001-4888-8888-888820000001',
 '77777001-0001-4777-8777-777700000001', 'en',
 'Bosphorus view luxury residence exterior',
 'Luxury 18-unit residence with Bosphorus views in Beşiktaş, Istanbul — Bereket Fide residential project',
 NOW(3), NOW(3)),

('88882001-0002-4888-8888-888820000002',
 '77777001-0002-4777-8777-777700000002', 'en',
 'Beşiktaş residence Bosphorus façade detail',
 'Bosphorus View Residence — curtain wall and balcony details, 6-storey reinforced concrete structure',
 NOW(3), NOW(3)),

-- Proje 02 — Levent Office Tower
('88882001-0003-4888-8888-888820000003',
 '77777001-0003-4777-8777-777700000003', 'en',
 'Levent office tower curtain wall overview',
 '12-storey LEED-certified Class A office tower in Levent — steel frame and curtain wall system',
 NOW(3), NOW(3)),

('88882001-0004-4888-8888-888820000004',
 '77777001-0004-4777-8777-777700000004', 'en',
 'Levent office tower entrance and landscaping',
 'Green-certified office tower ground floor entrance and landscape area — Bereket Fide commercial project',
 NOW(3), NOW(3)),

-- Proje 03 — Kadıköy Mixed-Use
('88882001-0005-4888-8888-888820000005',
 '77777001-0005-4777-8777-777700000005', 'en',
 'Kadıköy mixed-use complex construction view',
 '64-unit residential + 3-floor commercial mixed-use complex in Kadıköy — ongoing project',
 NOW(3), NOW(3)),

('88882001-0006-4888-8888-888820000006',
 '77777001-0006-4777-8777-777700000006', 'en',
 'Kadıköy mixed-use project façade detail',
 'Mixed-use complex commercial ground floor and residential upper floor façade view',
 NOW(3), NOW(3)),

-- Proje 04 — Historic Han Restoration
('88882001-0007-4888-8888-888820000007',
 '77777001-0007-4777-8777-777700000007', 'en',
 'Eminönü historic han restoration stone masonry detail',
 '19th-century Ottoman caravanserai restoration — original stone masonry preserved and reinforced',
 NOW(3), NOW(3)),

('88882001-0008-4888-8888-888820000008',
 '77777001-0008-4777-8777-777700000008', 'en',
 'Historic han timber roof repair',
 'Eminönü historic han — timber roof and floor elements restored using traditional techniques',
 NOW(3), NOW(3)),

-- Proje 05 — Gebze Logistics Centre
('88882001-0009-4888-8888-888820000009',
 '77777001-0009-4777-8777-777700000009', 'en',
 'Gebze logistics warehouse prefabricated steel structure',
 '8,000 m² prefabricated steel logistics warehouse in Gebze — Bereket Fide industrial project',
 NOW(3), NOW(3)),

('88882001-0010-4888-8888-888820000010',
 '77777001-0010-4777-8777-777700000010', 'en',
 'Gebze logistics centre loading docks',
 'Logistics warehouse loading docks and wide-span steel interior view',
 NOW(3), NOW(3)),

-- Proje 06 — Beşiktaş Waterfront Residence
('88882001-0011-4888-8888-888820000011',
 '77777001-0011-4777-8777-777700000011', 'en',
 'Beşiktaş waterfront residence modern façade',
 '24-unit modern waterfront residence in Beşiktaş — façade cladding and landscape works',
 NOW(3), NOW(3)),

('88882001-0012-4888-8888-888820000012',
 '77777001-0012-4777-8777-777700000012', 'en',
 'Waterfront residence pool and landscape area',
 'Beşiktaş Waterfront Residence — pool area and landscape design with sea views',
 NOW(3), NOW(3)),

-- Proje 07 — Ankara Government Building
('88882001-0013-4888-8888-888820000013',
 '77777001-0013-4777-8777-777700000013', 'en',
 'Ankara government services building curtain wall',
 '7-storey ministry services building in Çankaya — curtain wall and seismic reinforcement',
 NOW(3), NOW(3)),

('88882001-0014-4888-8888-888820000014',
 '77777001-0014-4777-8777-777700000014', 'en',
 'Ankara public building ground floor',
 'Ministry services building ground floor entrance and landscaping — Bereket Fide public sector project',
 NOW(3), NOW(3)),

-- Proje 08 — Bursa Infrastructure
('88882001-0015-4888-8888-888820000015',
 '77777001-0015-4777-8777-777700000015', 'en',
 'Bursa OIZ infrastructure renewal road construction',
 'Bursa Nilüfer OIZ infrastructure renewal — road construction and sewerage works',
 NOW(3), NOW(3)),

('88882001-0016-4888-8888-888820000016',
 '77777001-0016-4777-8777-777700000016', 'en',
 'Bursa infrastructure site development landscaping',
 'OIZ infrastructure renewal completed site development and landscaping — 45,000 m² area',
 NOW(3), NOW(3)),

-- Proje 09 — Antalya Boutique Hotel
('88882001-0017-4888-8888-888820000017',
 '77777001-0017-4777-8777-777700000017', 'en',
 'Antalya Kaleiçi boutique hotel stone façade',
 '32-room boutique hotel in Kaleiçi — stone masonry and timber craftsmanship in historic fabric',
 NOW(3), NOW(3)),

('88882001-0018-4888-8888-888820000018',
 '77777001-0018-4777-8777-777700000018', 'en',
 'Kaleiçi boutique hotel courtyard and landscaping',
 'Antalya Kaleiçi boutique hotel courtyard — traditional architecture with modern comfort',
 NOW(3), NOW(3)),

-- Proje 10 — İzmir Technology Campus
('88882001-0019-4888-8888-888820000019',
 '77777001-0019-4777-8777-777700000019', 'en',
 'İzmir technology campus steel and curtain wall',
 '32,000 m² sustainable technology office campus in Bayraklı — steel frame and curtain wall',
 NOW(3), NOW(3)),

('88882001-0020-4888-8888-888820000020',
 '77777001-0020-4777-8777-777700000020', 'en',
 'İzmir technology campus landscape and green area',
 'Technology campus landscape design and green roof application — sustainable building',
 NOW(3), NOW(3)),

-- Proje 11 — Ümraniye Housing
('88882001-0021-4888-8888-888820000021',
 '77777001-0021-4777-8777-777700000021', 'en',
 'Ümraniye mass housing project overview',
 '120-unit mass housing in Ümraniye — including social facilities and parking',
 NOW(3), NOW(3)),

('88882001-0022-4888-8888-888820000022',
 '77777001-0022-4777-8777-777700000022', 'en',
 'Ümraniye housing landscaped area',
 'Mass housing project landscape and social facility areas — Bereket Fide',
 NOW(3), NOW(3)),

-- Proje 12 — Taksim Hotel Renovation
('88882001-0023-4888-8888-888820000023',
 '77777001-0023-4777-8777-777700000023', 'en',
 'Taksim hotel renovation façade renewal',
 '85-room hotel renovation in Taksim — façade renewal and interior refurbishment',
 NOW(3), NOW(3)),

('88882001-0024-4888-8888-888820000024',
 '77777001-0024-4777-8777-777700000024', 'en',
 'Taksim hotel lobby renovation',
 'Hotel renovation lobby and reception area renewal — Bereket Fide hospitality project',
 NOW(3), NOW(3)),

-- Proje 13 — Eskişehir University Campus
('88882001-0025-4888-8888-888820000025',
 '77777001-0025-4777-8777-777700000025', 'en',
 'Eskişehir university campus extension façade',
 'University campus 15,000 m² education building — laboratories, lecture halls, library',
 NOW(3), NOW(3)),

('88882001-0026-4888-8888-888820000026',
 '77777001-0026-4777-8777-777700000026', 'en',
 'University campus education building interior',
 'Campus extension lecture halls and classrooms — modern educational infrastructure',
 NOW(3), NOW(3)),

-- Proje 14 — Mersin Cold Storage
('88882001-0027-4888-8888-888820000027',
 '77777001-0027-4777-8777-777700000027', 'en',
 'Mersin free zone cold storage steel structure',
 '12,000 m² cold storage facility in Mersin Free Zone — prefabricated steel and insulation',
 NOW(3), NOW(3)),

('88882001-0028-4888-8888-888820000028',
 '77777001-0028-4777-8777-777700000028', 'en',
 'Cold storage facility interior insulation',
 'Cold storage facility temperature zones and insulation detail — industrial warehouse',
 NOW(3), NOW(3)),

-- Proje 15 — Bodrum Villas
('88882001-0029-4888-8888-888820000029',
 '77777001-0029-4777-8777-777700000029', 'en',
 'Bodrum sea-view villa project',
 '8 sea-view villas in Bodrum — private pools and natural stone cladding',
 NOW(3), NOW(3)),

('88882001-0030-4888-8888-888820000030',
 '77777001-0030-4777-8777-777700000030', 'en',
 'Bodrum villa pool and landscape area',
 'Bodrum villa project — private pool, terrace, and Aegean-style landscape design',
 NOW(3), NOW(3));


COMMIT;
