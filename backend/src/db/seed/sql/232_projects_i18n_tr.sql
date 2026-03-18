-- =============================================================
-- 232_projects_i18n_tr.sql
-- Bereket Fide proje i18n kayıtları — TÜRKÇE (tr)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

INSERT INTO `projects_i18n`
(
  id, project_id, locale,
  title, slug, summary, content,
  featured_image_alt, meta_title, meta_description,
  created_at, updated_at
)
VALUES

-- 1. Boğaz Manzaralı Rezidans — İstanbul, Beşiktaş
(
  '44444001-0001-4444-8444-444400000001',
  '33333001-0001-4333-8333-333300000001',
  'tr',
  'Boğaz Manzaralı Rezidans — 18 Bağımsız Bölüm, 6 Kat',
  'bogaz-manzarali-rezidans-besiktas',
  'İstanbul Beşiktaş''ta Boğaz manzarasına hakim, 18 bağımsız bölümlü, 6 katlı lüks rezidans projesi başarıyla tamamlandı.',
  '{"html":"<p>İstanbul''un en prestijli semtlerinden Beşiktaş''ta, eşsiz Boğaz manzarasına sahip <strong>18 bağımsız bölümlü, 6 katlı lüks rezidans</strong> projesi Bereket Fide tarafından hayata geçirilmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Konum: İstanbul, Beşiktaş — Boğaz cephesi</li><li>Tip: Lüks Rezidans</li><li>Bağımsız bölüm: 18 adet</li><li>Kat sayısı: 6</li><li>Tamamlanma: Mart 2024</li></ul><h3>Tasarım ve İnşaat</h3><p>Projede betonarme taşıyıcı sistem, enerji verimli cam cephe, akıllı ev sistemleri ve özel peyzaj düzenlemesi uygulanmıştır. Her dairede Boğaz manzarasını en üst düzeyde yaşatan geniş balkon ve teras alanları bulunmaktadır.</p>","description":"Beşiktaş''ta Boğaz manzaralı 18 daireli 6 katlı lüks rezidans — Bereket Fide konut projesi."}',
  'Boğaz Manzaralı Rezidans — Bereket Fide Beşiktaş Lüks Konut Projesi',
  'Boğaz Manzaralı Rezidans Beşiktaş — Bereket Fide',
  'İstanbul Beşiktaş''ta Boğaz manzaralı 18 bağımsız bölümlü 6 katlı lüks rezidans projesi. Bereket Fide konut referansı.',
  NOW(3), NOW(3)
),

-- 2. Levent Ofis Kulesi — İstanbul, Levent
(
  '44444001-0002-4444-8444-444400000002',
  '33333001-0002-4333-8333-333300000002',
  'tr',
  'Levent Ofis Kulesi — 12 Katlı Yeşil Sertifikalı A Sınıfı Ofis',
  'levent-ofis-kulesi-yesil-sertifikali',
  'İstanbul Levent''te 12 katlı, LEED sertifikalı, çelik konstrüksiyon ve cam cephe sistemli A sınıfı ofis kulesi tamamlandı.',
  '{"html":"<p>İstanbul''un finans merkezi Levent''te, <strong>12 katlı LEED sertifikalı A sınıfı ofis kulesi</strong> Bereket Fide tarafından inşa edilmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Konum: İstanbul, Levent</li><li>Tip: A Sınıfı Ofis Kulesi</li><li>Kat sayısı: 12</li><li>Yapı sistemi: Çelik konstrüksiyon + cam cephe</li><li>Sertifika: LEED Yeşil Bina</li></ul><h3>Sürdürülebilir Tasarım</h3><p>Bina, enerji verimliliği odaklı tasarlanmış olup; yüksek performanslı cam cephe sistemi, yağmur suyu geri kazanımı ve akıllı bina yönetim sistemi ile LEED yeşil bina sertifikası almıştır.</p>","description":"Levent''te 12 katlı LEED sertifikalı çelik konstrüksiyon A sınıfı ofis kulesi — Bereket Fide ticari proje."}',
  'Levent Ofis Kulesi — Bereket Fide LEED Sertifikalı Ticari Proje',
  'Levent Ofis Kulesi Yeşil Sertifikalı — Bereket Fide',
  'İstanbul Levent''te 12 katlı LEED sertifikalı A sınıfı ofis kulesi. Çelik konstrüksiyon ve cam cephe. Bereket Fide ticari referans.',
  NOW(3), NOW(3)
),

-- 3. Kadıköy Karma Yapı Kompleksi — İstanbul, Kadıköy
(
  '44444001-0003-4444-8444-444400000003',
  '33333001-0003-4333-8333-333300000003',
  'tr',
  'Kadıköy Karma Yapı Kompleksi — 64 Konut + 3 Kat Ticari Alan',
  'kadikoy-karma-yapi-kompleksi',
  'İstanbul Kadıköy''de 64 konut birimi ve 3 kat ticari alandan oluşan karma kullanımlı yapı kompleksi inşaatı devam etmektedir.',
  '{"html":"<p>İstanbul Kadıköy''ün merkezinde, <strong>64 konut birimi ve 3 kat ticari alan</strong> içeren karma kullanımlı yapı kompleksi Bereket Fide tarafından inşa edilmektedir.</p><h3>Proje Özellikleri</h3><ul><li>Konum: İstanbul, Kadıköy</li><li>Tip: Karma Kullanım (Konut + Ticari)</li><li>Konut: 64 bağımsız bölüm</li><li>Ticari: 3 kat mağaza ve ofis alanı</li><li>Otopark: 2 kat yeraltı otoparkı</li></ul><h3>Şehircilik ve Yaşam</h3><p>Proje, Kadıköy''ün canlı şehir dokusuna uyum sağlayan modern mimari çizgileri ile tasarlanmıştır. Zemin ve üst katlarda ticari alanlar, üst katlarda farklı tiplerde konut birimleri yer almaktadır.</p>","description":"Kadıköy''de 64 konut + 3 kat ticari alan karma kullanım yapı kompleksi — Bereket Fide devam eden proje."}',
  'Kadıköy Karma Yapı Kompleksi — Bereket Fide Konut ve Ticari Proje',
  'Kadıköy Karma Yapı Kompleksi — Bereket Fide',
  'İstanbul Kadıköy''de 64 konut ve 3 kat ticari alanlı karma yapı kompleksi. Bereket Fide karma kullanım referansı.',
  NOW(3), NOW(3)
),

-- 4. Tarihi Han Restorasyon — İstanbul, Eminönü
(
  '44444001-0004-4444-8444-444400000004',
  '33333001-0004-4333-8333-333300000004',
  'tr',
  'Tarihi Han Restorasyonu — 19. Yüzyıl Osmanlı Hanı, Özgün Doku Korunumu',
  'tarihi-han-restorasyonu-eminonu',
  'İstanbul Eminönü''nde 19. yüzyıldan kalma tarihi Osmanlı hanının kapsamlı restorasyon çalışması başarıyla tamamlandı.',
  '{"html":"<p>İstanbul''un tarihi yarımadasında, Eminönü''de bulunan <strong>19. yüzyıl Osmanlı hanı</strong> Bereket Fide tarafından kapsamlı restorasyon sürecinden geçirilmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Konum: İstanbul, Eminönü</li><li>Tip: Tarihi Yapı Restorasyonu</li><li>Dönem: 19. yüzyıl Osmanlı</li><li>Süre: Mart 2020 – Ağustos 2022</li></ul><h3>Restorasyon Kapsamı</h3><p>Projede özgün taş duvar dokusu korunarak güçlendirme yapılmış, ahşap çatı ve döşeme elemanları restore edilmiş, tarihi pencere ve kapı doğramaları onarılmıştır. Tüm çalışmalar Koruma Kurulu denetiminde, özgün malzeme ve geleneksel tekniklerle gerçekleştirilmiştir.</p>","description":"Eminönü''nde 19. yüzyıl Osmanlı hanı restorasyonu — taş, ahşap onarım ve güçlendirme. Bereket Fide."}',
  'Tarihi Han Restorasyonu Eminönü — Bereket Fide Koruma Projesi',
  'Tarihi Han Restorasyonu Eminönü — Bereket Fide',
  'İstanbul Eminönü''nde 19. yüzyıl Osmanlı hanının kapsamlı restorasyonu. Taş duvar, ahşap onarım, güçlendirme. Bereket Fide restorasyon referansı.',
  NOW(3), NOW(3)
),

-- 5. Gebze Lojistik Merkezi — Kocaeli, Gebze
(
  '44444001-0005-4444-8444-444400000005',
  '33333001-0005-4333-8333-333300000005',
  'tr',
  'Gebze Lojistik Merkezi — 8.000 m² Prefabrik Çelik Depo',
  'gebze-lojistik-merkezi-prefabrik-celik-depo',
  'Kocaeli Gebze''de 8.000 m² kapalı alana sahip prefabrik çelik yapı lojistik depo projesi tamamlandı.',
  '{"html":"<p>Kocaeli Gebze''de, <strong>8.000 m² kapalı alana sahip prefabrik çelik yapı</strong> lojistik depo Bereket Fide tarafından inşa edilmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Konum: Kocaeli, Gebze</li><li>Tip: Lojistik Depo</li><li>Kapalı alan: 8.000 m²</li><li>Yapı sistemi: Prefabrik çelik konstrüksiyon</li><li>Tamamlanma: Haziran 2024</li></ul><h3>Endüstriyel İnşaat</h3><p>Yüksek tonajlı vinç kapasitesine uygun çelik yapı sistemi, zemin güçlendirme çalışmaları ve modern yükleme rampaları ile projelendirilmiştir. Lojistik operasyonlara uygun geniş açıklıklı, sütun-az yapı tasarımı uygulanmıştır.</p>","description":"Gebze''de 8.000 m² prefabrik çelik yapı lojistik depo — Bereket Fide endüstriyel proje."}',
  'Gebze Lojistik Merkezi — Bereket Fide Endüstriyel Proje',
  'Gebze Lojistik Merkezi Prefabrik Çelik Depo — Bereket Fide',
  'Kocaeli Gebze''de 8.000 m² prefabrik çelik yapı lojistik depo projesi. Bereket Fide endüstriyel inşaat referansı.',
  NOW(3), NOW(3)
),

-- 6. Beşiktaş Sahil Rezidans — İstanbul, Beşiktaş
(
  '44444001-0006-4444-8444-444400000006',
  '33333001-0006-4333-8333-333300000006',
  'tr',
  'Beşiktaş Sahil Rezidans — 24 Daireli Modern Konut',
  'besiktas-sahil-rezidans-modern-konut',
  'İstanbul Beşiktaş''ta sahil şeridinde 24 daireli modern rezidans projesi inşaat aşamasındadır.',
  '{"html":"<p>İstanbul Beşiktaş''ın sahil şeridinde, <strong>24 daireli modern rezidans</strong> projesi Bereket Fide tarafından inşa edilmektedir.</p><h3>Proje Özellikleri</h3><ul><li>Konum: İstanbul, Beşiktaş — sahil şeridi</li><li>Tip: Modern Rezidans</li><li>Daire sayısı: 24</li><li>Başlangıç: Mart 2024</li></ul><h3>Modern Yaşam Alanı</h3><p>Sahil manzarası ve şehir erişimini bir arada sunan proje; cephe kaplama, peyzaj düzenleme ve havuz inşaatı dahil tüm yapım süreçleri ile planlanmıştır.</p>","description":"Beşiktaş sahilde 24 daireli modern rezidans — Bereket Fide devam eden konut projesi."}',
  'Beşiktaş Sahil Rezidans — Bereket Fide Modern Konut Projesi',
  'Beşiktaş Sahil Rezidans 24 Daire — Bereket Fide',
  'İstanbul Beşiktaş sahilde 24 daireli modern rezidans projesi. Bereket Fide konut referansı.',
  NOW(3), NOW(3)
),

-- 7. Ankara Kamu Hizmet Binası — Ankara, Çankaya
(
  '44444001-0007-4444-8444-444400000007',
  '33333001-0007-4333-8333-333300000007',
  'tr',
  'Ankara Kamu Hizmet Binası — 7 Katlı Bakanlık Binası',
  'ankara-kamu-hizmet-binasi-bakanlik',
  'Ankara Çankaya''da 7 katlı bakanlık hizmet binası projesi deprem güçlendirme dahil başarıyla tamamlandı.',
  '{"html":"<p>Ankara''nın yönetim merkezi Çankaya''da, <strong>7 katlı bakanlık hizmet binası</strong> Bereket Fide tarafından inşa edilmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Konum: Ankara, Çankaya</li><li>Tip: Kamu Hizmet Binası</li><li>Kat sayısı: 7</li><li>Süre: Mayıs 2021 – Ekim 2023</li></ul><h3>Kamu İnşaat Uzmanlığı</h3><p>Projede betonarme taşıyıcı sistem, cam cephe, deprem güçlendirme ve komple mekanik tesisat uygulamaları gerçekleştirilmiştir. Bina, güncel deprem yönetmeliğine uygun olarak tasarlanmış ve inşa edilmiştir.</p>","description":"Ankara Çankaya''da 7 katlı bakanlık hizmet binası — deprem güçlendirme dahil. Bereket Fide kamu projesi."}',
  'Ankara Kamu Hizmet Binası — Bereket Fide Kamu Projesi',
  'Ankara Kamu Hizmet Binası Çankaya — Bereket Fide',
  'Ankara Çankaya''da 7 katlı bakanlık hizmet binası inşaatı. Deprem güçlendirme ve cam cephe. Bereket Fide kamu referansı.',
  NOW(3), NOW(3)
),

-- 8. Bursa Altyapı ve Çevre Düzenlemesi — Bursa, Nilüfer
(
  '44444001-0008-4444-8444-444400000008',
  '33333001-0008-4333-8333-333300000008',
  'tr',
  'Bursa OSB Altyapı Yenileme — 45.000 m² Çevre Düzenlemesi',
  'bursa-osb-altyapi-yenileme-cevre-duzenlemesi',
  'Bursa Nilüfer''de 45.000 m² OSB altyapı yenileme ve çevre düzenleme projesi tamamlandı.',
  '{"html":"<p>Bursa Nilüfer''deki organize sanayi bölgesinde, <strong>45.000 m² alanda altyapı yenileme ve çevre düzenleme</strong> projesi Bereket Fide tarafından gerçekleştirilmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Konum: Bursa, Nilüfer OSB</li><li>Tip: Altyapı Yenileme</li><li>Alan: 45.000 m²</li><li>Süre: Nisan 2023 – Eylül 2024</li></ul><h3>Altyapı Kapsamı</h3><p>Yol yapımı, kanalizasyon hatları, yağmur suyu drenaj sistemi ve peyzaj düzenlemesi dahil kapsamlı altyapı yenileme çalışmaları tamamlanmıştır.</p>","description":"Bursa Nilüfer OSB''de 45.000 m² altyapı yenileme ve çevre düzenleme — Bereket Fide altyapı projesi."}',
  'Bursa OSB Altyapı Yenileme — Bereket Fide Altyapı Projesi',
  'Bursa OSB Altyapı Yenileme 45.000 m² — Bereket Fide',
  'Bursa Nilüfer OSB''de 45.000 m² altyapı yenileme ve çevre düzenleme projesi. Bereket Fide altyapı referansı.',
  NOW(3), NOW(3)
),

-- 9. Antalya Boutique Otel — Antalya, Kaleiçi
(
  '44444001-0009-4444-8444-444400000009',
  '33333001-0009-4333-8333-333300000009',
  'tr',
  'Antalya Kaleiçi Butik Otel — 32 Odalı, Tarihi Doku Uyumlu',
  'antalya-kaleici-butik-otel-tarihi-doku',
  'Antalya Kaleiçi bölgesinde tarihi dokuya uyumlu 32 odalı butik otel inşaat projesi devam etmektedir.',
  '{"html":"<p>Antalya''nın tarihi kalbi Kaleiçi''nde, <strong>32 odalı butik otel</strong> projesi Bereket Fide tarafından inşa edilmektedir.</p><h3>Proje Özellikleri</h3><ul><li>Konum: Antalya, Kaleiçi</li><li>Tip: Butik Otel</li><li>Oda sayısı: 32</li><li>Başlangıç: Haziran 2024</li></ul><h3>Tarihi Doku Uyumu</h3><p>Kaleiçi''nin UNESCO Dünya Mirası listesindeki tarihi dokusuna uygun olarak yığma taş ve ahşap işçiliği ön planda tutulmuştur. Geleneksel Antalya mimarisi ile modern konfor standartları bir arada sunulmaktadır.</p>","description":"Antalya Kaleiçi''nde tarihi dokuya uyumlu 32 odalı butik otel — Bereket Fide turizm projesi."}',
  'Antalya Kaleiçi Butik Otel — Bereket Fide Turizm Projesi',
  'Antalya Kaleiçi Butik Otel 32 Oda — Bereket Fide',
  'Antalya Kaleiçi''nde tarihi dokuya uyumlu 32 odalı butik otel projesi. Yığma taş ve ahşap. Bereket Fide turizm referansı.',
  NOW(3), NOW(3)
),

-- 10. İzmir Teknoloji Kampüsü — İzmir, Bayraklı
(
  '44444001-0010-4444-8444-444400000010',
  '33333001-0010-4333-8333-333300000010',
  'tr',
  'İzmir Teknoloji Kampüsü — 32.000 m² Sürdürülebilir Ofis Kampüsü',
  'izmir-teknoloji-kampusu-surdurulebilir-ofis',
  'İzmir Bayraklı''da 32.000 m² kapalı alanlı sürdürülebilir teknoloji ofis kampüsü tamamlandı.',
  '{"html":"<p>İzmir''in yeni iş merkezi Bayraklı''da, <strong>32.000 m² kapalı alanlı sürdürülebilir teknoloji ofis kampüsü</strong> Bereket Fide tarafından inşa edilmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Konum: İzmir, Bayraklı</li><li>Tip: Teknoloji Ofis Kampüsü</li><li>Kapalı alan: 32.000 m²</li><li>Süre: Ekim 2022 – Kasım 2024</li></ul><h3>Sürdürülebilir Tasarım</h3><p>Çelik konstrüksiyon ve cam cephe sistemi ile inşa edilen kampüs; güneş panelleri, yeşil çatı uygulaması ve enerji verimli HVAC sistemi ile sürdürülebilir yapı standartlarını karşılamaktadır. Peyzaj düzenlemesi ile teknoloji çalışanları için konforlu bir çalışma ortamı oluşturulmuştur.</p>","description":"İzmir Bayraklı''da 32.000 m² sürdürülebilir teknoloji ofis kampüsü — Bereket Fide ticari proje."}',
  'İzmir Teknoloji Kampüsü — Bereket Fide Sürdürülebilir Proje',
  'İzmir Teknoloji Kampüsü Bayraklı — Bereket Fide',
  'İzmir Bayraklı''da 32.000 m² sürdürülebilir teknoloji ofis kampüsü. Çelik konstrüksiyon ve cam cephe. Bereket Fide referansı.',
  NOW(3), NOW(3)
),

-- 11. Ümraniye Konut Projesi — İstanbul, Ümraniye
(
  '44444001-0011-4444-8444-444400000011',
  '33333001-0011-4333-8333-333300000011',
  'tr',
  'Ümraniye Toplu Konut — 120 Daireli Sosyal Tesisli Konut Projesi',
  'umraniye-toplu-konut-120-daire',
  'İstanbul Ümraniye''de 120 daireli, sosyal tesis ve otopark alanlarını içeren toplu konut projesi tamamlandı.',
  '{"html":"<p>İstanbul Ümraniye''de, <strong>120 daireli toplu konut projesi</strong> Bereket Fide tarafından inşa edilmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Konum: İstanbul, Ümraniye</li><li>Tip: Toplu Konut</li><li>Daire sayısı: 120</li><li>Süre: Ocak 2021 – Haziran 2023</li></ul><h3>Kapsamlı Yaşam Alanı</h3><p>Proje kapsamında 120 konut biriminin yanı sıra çevre düzenleme, yer altı otoparkı ve sosyal tesis alanları da inşa edilmiştir. Farklı daire tiplerinde ailelerin ihtiyaçlarına yönelik konut çözümleri sunulmaktadır.</p>","description":"Ümraniye''de 120 daireli toplu konut — otopark ve sosyal tesis dahil. Bereket Fide konut projesi."}',
  'Ümraniye Toplu Konut 120 Daire — Bereket Fide Konut Projesi',
  'Ümraniye Toplu Konut 120 Daire — Bereket Fide',
  'İstanbul Ümraniye''de 120 daireli toplu konut projesi. Sosyal tesis ve otopark dahil. Bereket Fide konut referansı.',
  NOW(3), NOW(3)
),

-- 12. Taksim Otel Renovasyon — İstanbul, Beyoğlu
(
  '44444001-0012-4444-8444-444400000012',
  '33333001-0012-4333-8333-333300000012',
  'tr',
  'Taksim Otel Renovasyonu — 85 Odalı Otel Yenileme Projesi',
  'taksim-otel-renovasyonu-85-oda',
  'İstanbul Beyoğlu Taksim''de 85 odalı otelin kapsamlı renovasyon projesi başarıyla tamamlandı.',
  '{"html":"<p>İstanbul''un turizm merkezi Taksim''de, <strong>85 odalı otelin kapsamlı renovasyonu</strong> Bereket Fide tarafından gerçekleştirilmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Konum: İstanbul, Beyoğlu — Taksim</li><li>Tip: Otel Renovasyon</li><li>Oda sayısı: 85</li><li>Süre: Kasım 2022 – Şubat 2024</li></ul><h3>Renovasyon Kapsamı</h3><p>İç mekan yenileme, tesisat altyapısı değişimi, cephe yenileme ve lobi-restoran alanlarının yeniden düzenlenmesi dahil kapsamlı bir renovasyon gerçekleştirilmiştir. Otel, renovasyon sürecinde kısmi olarak hizmet vermeye devam etmiştir.</p>","description":"Taksim''de 85 odalı otel renovasyonu — iç mekan, cephe ve tesisat yenileme. Bereket Fide turizm projesi."}',
  'Taksim Otel Renovasyonu — Bereket Fide Turizm Projesi',
  'Taksim Otel Renovasyonu 85 Oda — Bereket Fide',
  'İstanbul Taksim''de 85 odalı otel renovasyonu. İç mekan, cephe ve tesisat yenileme. Bereket Fide turizm referansı.',
  NOW(3), NOW(3)
),

-- 13. Eskişehir Üniversite Kampüsü — Eskişehir
(
  '44444001-0013-4444-8444-444400000013',
  '33333001-0013-4333-8333-333300000013',
  'tr',
  'Eskişehir Üniversite Kampüsü Ek Bina — 15.000 m² Eğitim Yapısı',
  'eskisehir-universite-kampusu-ek-bina',
  'Eskişehir''de üniversite kampüsüne 15.000 m² kapalı alanlı eğitim binası ek projesi tamamlandı.',
  '{"html":"<p>Eskişehir''de bir üniversite kampüsüne, <strong>15.000 m² kapalı alanlı ek eğitim binası</strong> Bereket Fide tarafından inşa edilmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Konum: Eskişehir</li><li>Tip: Eğitim Yapısı — Kampüs Ek Bina</li><li>Kapalı alan: 15.000 m²</li><li>Süre: Ağustos 2020 – Ocak 2023</li></ul><h3>Eğitim Altyapısı</h3><p>Bina bünyesinde laboratuvar, amfi, kütüphane ve ofis alanları yer almaktadır. Betonarme taşıyıcı sistem ve modern cephe tasarımı ile kampüsün mevcut yapılarına uyumlu bir mimari dil benimsenmiştir.</p>","description":"Eskişehir üniversite kampüsünde 15.000 m² ek eğitim binası — laboratuvar, amfi, kütüphane. Bereket Fide kamu projesi."}',
  'Eskişehir Üniversite Kampüsü Ek Bina — Bereket Fide Eğitim Projesi',
  'Eskişehir Üniversite Kampüsü Ek Bina — Bereket Fide',
  'Eskişehir üniversite kampüsünde 15.000 m² ek eğitim binası. Laboratuvar, amfi, kütüphane. Bereket Fide kamu referansı.',
  NOW(3), NOW(3)
),

-- 14. Mersin Serbest Bölge Depo — Mersin
(
  '44444001-0014-4444-8444-444400000014',
  '33333001-0014-4333-8333-333300000014',
  'tr',
  'Mersin Serbest Bölge Soğuk Hava Deposu — 12.000 m² Çelik Yapı',
  'mersin-serbest-bolge-soguk-hava-deposu',
  'Mersin Serbest Bölge''de 12.000 m² soğuk hava deposu çelik yapı projesi tamamlandı.',
  '{"html":"<p>Mersin Serbest Bölge''de, <strong>12.000 m² kapalı alanlı soğuk hava deposu</strong> Bereket Fide tarafından inşa edilmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Konum: Mersin Serbest Bölge</li><li>Tip: Soğuk Hava Deposu</li><li>Kapalı alan: 12.000 m²</li><li>Yapı sistemi: Prefabrik çelik</li><li>Süre: Temmuz 2023 – Aralık 2024</li></ul><h3>Özel İzolasyon Sistemi</h3><p>Soğuk zincir lojistiğine uygun yüksek performanslı izolasyon sistemi, prefabrik çelik yapı ve özel zemin kaplama ile projelendirilmiştir. Tesis, farklı sıcaklık bölgelerine ayrılmış depolama alanları içermektedir.</p>","description":"Mersin Serbest Bölge''de 12.000 m² soğuk hava deposu — prefabrik çelik ve izolasyon. Bereket Fide endüstriyel proje."}',
  'Mersin Serbest Bölge Soğuk Hava Deposu — Bereket Fide Endüstriyel Proje',
  'Mersin Serbest Bölge Soğuk Hava Deposu — Bereket Fide',
  'Mersin Serbest Bölge''de 12.000 m² soğuk hava deposu projesi. Prefabrik çelik ve izolasyon. Bereket Fide endüstriyel referans.',
  NOW(3), NOW(3)
),

-- 15. Bodrum Villa Projesi — Muğla, Bodrum
(
  '44444001-0015-4444-8444-444400000015',
  '33333001-0015-4333-8333-333300000015',
  'tr',
  'Bodrum Villa Projesi — 8 Villa, Deniz Manzaralı',
  'bodrum-villa-projesi-deniz-manzarali',
  'Muğla Bodrum''da deniz manzaralı 8 adet villa inşaat projesi tamamlandı.',
  '{"html":"<p>Muğla Bodrum''un en güzel koylarından birine bakan, <strong>8 adet deniz manzaralı villa</strong> Bereket Fide tarafından inşa edilmiştir.</p><h3>Proje Özellikleri</h3><ul><li>Konum: Muğla, Bodrum</li><li>Tip: Villa</li><li>Villa sayısı: 8</li><li>Süre: Mart 2023 – Ekim 2024</li></ul><h3>Ege Yaşam Tarzı</h3><p>Her villada özel havuz, peyzaj alanı ve deniz manzaralı teras bulunmaktadır. Doğal taş duvar kaplama ve Bodrum mimarisine uygun beyaz-mavi renk paleti ile tasarlanmıştır.</p>","description":"Bodrum''da deniz manzaralı 8 villa — özel havuz ve peyzaj. Bereket Fide konut projesi."}',
  'Bodrum Villa Projesi Deniz Manzaralı — Bereket Fide Konut',
  'Bodrum Villa Projesi 8 Villa — Bereket Fide',
  'Muğla Bodrum''da deniz manzaralı 8 villa projesi. Özel havuz, peyzaj ve taş duvar. Bereket Fide konut referansı.',
  NOW(3), NOW(3)
);

COMMIT;
