# Bereket Fide — Kod Disi Yapilacak Isler

**Tarih:** 29 Mart 2026
**Amac:** GEO skorunu 44 → 70+ cikarmak icin kod disinda yapilmasi gereken islemler

---

## 1. Sunucu / Nginx Yapilandirmasi

### 1.1 Guvenlik Basliklari
Nginx config dosyasina eklenecek:
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self'; img-src 'self' https://res.cloudinary.com data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com;" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
server_tokens off;
```

### 1.2 Cache-Control Politikasi
- Mevcut: `no-cache, no-store` (her istek sunucuya gidiyor)
- Hedef: Statik asset'ler icin `Cache-Control: public, max-age=31536000, immutable`
- HTML icin: `Cache-Control: public, max-age=0, must-revalidate` veya `stale-while-revalidate=60`

---

## 2. Arama Motoru Kayitlari

### 2.1 Bing Webmaster Tools
- [ ] https://www.bing.com/webmasters adresinden kayit ol
- [ ] Site dogrulama yap (DNS TXT veya meta tag)
- [ ] Sitemap.xml submit et: `https://www.bereketfide.com.tr/sitemap.xml`

### 2.2 IndexNow Protokolu
- [ ] IndexNow API key olustur (ornek: `a1b2c3d4e5f6.txt`)
- [ ] Key dosyasini `frontend/public/` dizinine koy
- [ ] Yeni icerik yayinlandiginda IndexNow API'ye ping at
- Dokumantasyon: https://www.indexnow.org/documentation

### 2.3 Google Search Console
- [ ] Mevcut kayit durumunu kontrol et
- [ ] Sitemap.xml submit et
- [ ] Core Web Vitals raporunu incele

---

## 3. Google Is Profili (Google Business Profile)

- [ ] https://business.google.com adresinden giris yap
- [ ] "Bereket Fide" isletmesini dogrula (posta, telefon veya e-posta ile)
- [ ] Doldurulacak alanlar:
  - Isletme adi: Bereket Fide
  - Kategori: Tarimsal Isletme / Fide Ureticisi
  - Adres: Fatih Mah. Isparta Yolu, Aksu, Antalya 07112
  - Telefon: +90 242 464 19 25
  - Web sitesi: https://www.bereketfide.com.tr
  - Calisma saatleri: Pazartesi-Cumartesi 08:00-18:00
  - Aciklama: "2006'dan beri Antalya Aksu'da 24.000 m² modern seralarda asili ve standart sebze fidesi uretimi. Yillik 35+ milyon fide kapasitesi."
- [ ] En az 10 yuksek kaliteli fotograf yukle (sera, uretim hatti, urunler, ekip)
- [ ] Hizmetleri listele: Asili fide uretimi, Standart fide uretimi, Teknik destek, Lojistik, Sozlesmeli uretim

---

## 4. Sosyal Medya Optimizasyonu

### 4.1 Instagram — @bereketfide
- [ ] Biyografiyi guncelle:
  ```
  Bereket Fide | 2006'dan beri
  Asili & Standart Sebze Fidesi Uretimi
  24.000 m² sera | 35M+ yillik kapasite
  Antalya, Aksu
  bereketfide.com.tr
  ```
- [ ] Highlight'lar olustur: Urunler, Sera, Uretim, Musteriler, Hakkimizda
- [ ] Haftalik 3-4 paylasim plani:
  - Pazartesi: Urun tanitimi (fide cesidi, ozellik, gorsel)
  - Carsamba: Sera/uretim sureci (behind the scenes)
  - Cuma: Bilgi icerigi (fide dikimi ipuclari, mevsimsel tavsiyeler)
  - Cumartesi: Musteri hikayeleri / teslimat gorselleri
- [ ] Reels icerikleri: Fide uretim sureci, sera turu, paketleme, teslimat

### 4.2 Facebook — /bereketfide
- [ ] Sayfa bilgilerini tam doldur (adres, telefon, saat, kategori, aciklama)
- [ ] Kapak fotografi: Sera panoramik goruntu veya marka gorseli
- [ ] Haftalik 2-3 paylasim (Instagram ile cross-post yapilabilir)
- [ ] Facebook Shop ozelligini aktiflestir (urun katalog baglantisi)

### 4.3 YouTube — @bereketfide
- [ ] Kanal aciklamasi:
  ```
  Bereket Fide — 2006'dan beri Antalya Aksu'da asili ve standart sebze fidesi uretimi.

  24.000 m² modern seralarda yillik 35 milyonun uzerinde fide uretim kapasitesiyle
  Turkiye'nin onde gelen fide ureticilerinden biriyiz.

  Bu kanalda:
  - Fide uretim sureclerimiz
  - Sera teknolojileri
  - Fide bakim ve yetistirme rehberleri
  - Musteri ziyaretleri ve referanslar
  - Fuar ve etkinlik goruntulerini paylasiyoruz.

  Iletisim: info@bereketfide.com.tr | +90 242 464 19 25
  Web: https://www.bereketfide.com.tr
  ```
- [ ] Kanal banner'i: Marka uyumlu gorsel (sera + logo + slogan)
- [ ] Oncelikli yuklenecek videolar:
  1. **Tanitim videosu** (2-3 dk): Sera turu, uretim hatti, ekip, kapasite bilgileri
  2. **Uretim sureci** (3-5 dk): Tohum ekiminden fide teslimatina kadar tum assamalar
  3. **Asili fide nedir?** (2-3 dk): Asili fide avantajlari, uretim teknigi
  4. **Sera teknolojisi** (2-3 dk): Iklim kontrolu, sulama, gubre sistemleri
  5. **Musteri referansi** (1-2 dk): Mutlu musteri roportaji
- [ ] Video basliklarini SEO uyumlu yaz: "Asili Domates Fidesi Nasil Uretilir? | Bereket Fide"
- [ ] Her videoya aciklama ekle (min 200 kelime, linkler, zaman damgalari)
- [ ] Oynatma listeleri olustur: Uretim, Rehberler, Referanslar

### 4.4 LinkedIn — /company/bereketfide
- [ ] Sirket sayfasi bilgilerini tam doldur:
  - Sektor: Tarim
  - Sirket boyutu: 50-200 calisan
  - Merkez: Antalya, Turkiye
  - Kurulus: 2006
  - Web sitesi: https://www.bereketfide.com.tr
  - Aciklama (TR + EN):
    ```
    Bereket Fide, 2006 yilindan bu yana Antalya Aksu'da 24.000 m² modern sera
    tesislerinde asili ve standart sebze fidesi uretimi yapmaktadir. Yillik 35
    milyonun uzerinde fide uretim kapasitesiyle Turkiye'nin onde gelen fide
    ureticilerinden biriyiz.

    Uretim alanlari: Domates, biber, patlican, hiyar, kavun, karpuz fidesi
    Hizmetler: Asili uretim, standart uretim, teknik destek, lojistik,
    sozlesmeli uretim, cesit denemeleri
    ```
- [ ] Logo ve kapak gorseli yukle
- [ ] Haftalik 1-2 profesyonel paylasim:
  - Sektor haberleri ve yorumlar
  - Sirket gelismeleri
  - Is birligi duyurulari
  - Fuar katilimlari

### 4.5 X (Twitter) — @bereketfide
- [ ] Biyografi guncelle:
  ```
  Bereket Fide | Asili & Standart Sebze Fidesi | 2006'dan beri | Antalya Aksu
  24.000 m² sera | 35M+ yillik kapasite
  bereketfide.com.tr
  ```
- [ ] Sabitlenmis tweet: Tanitim videosu veya infografik
- [ ] Haftalik 2-3 paylasim (Instagram cross-post + sektor haberleri)

### 4.6 TikTok — @bereketfide
- [ ] Profil bilgilerini doldur (biyografi, link, kategori)
- [ ] Kisa video icerikleri (15-60 sn):
  - Sera turu timelapse
  - Fide uretim sureci hizlandirilmis
  - "Biliyor muydunuz?" bilgi kapsulleri
  - Paketleme ve teslimat gorselleri

---

## 5. Wikidata Girisi

- [ ] https://www.wikidata.org adresine giris yap (Wikipedia hesabi ile)
- [ ] Yeni ogeleme olustur: "Bereket Fide"
- [ ] Doldurulacak ozellikler:
  - Label (TR): Bereket Fide
  - Label (EN): Bereket Fide
  - Description (TR): Antalya merkezli sebze fidesi uretim sirketi
  - Description (EN): Vegetable seedling production company based in Antalya, Turkey
  - instance of (P31): business enterprise (Q4830453)
  - country (P17): Turkey (Q43)
  - headquarters location (P159): Aksu, Antalya
  - inception (P571): 2006
  - industry (P452): agriculture (Q11451)
  - official website (P856): https://www.bereketfide.com.tr
  - social media links: Instagram, Facebook, YouTube, LinkedIn, X, TikTok URL'leri

---

## 6. Icerik Uretimi (Admin Panel)

### 6.1 Blog Yazilarini Zenginlestirme
Mevcut 3 blog yazisi cok ince (85-350 kelime). Her birini 1.000-2.000 kelimeye cikar:

| Yazi | Mevcut | Hedef | Eklenecekler |
|---|---|---|---|
| Toprak Hazirligi | ~350 kelime | 1.500+ | pH degerleri, toprak turleri tablosu, mevsimsel takvim, SSS |
| Inovatif Yaklasimlar | ~85 kelime | 1.200+ | Spesifik teknoloji adlari, karsilastirma verileri, SSS |
| (3. yazi) | ~200 kelime | 1.000+ | Veri noktalari, uzman gorusleri, SSS |

### 6.2 Yeni Icerikler (5+ konu rehberi)
1. **Asili Fide Nedir? Avantajlari ve Dezavantajlari** — hastalık dayanikliligi, verim farki, maliyet analizi
2. **Domates Fidesi Dikimi: Bastan Sona Rehber** — toprak, sulama, gubreleme, hastalik yonetimi
3. **Sera Sicaklik ve Nem Ayarlari** — mevsimsel tablolar, ideal degerler, havalandirma
4. **Asili vs Standart Fide Karsilastirmasi** — verim, maliyet, dayaniklilik tablolari
5. **Fide Secimi Rehberi: Dogru Fideyi Nasil Secersiniz?** — bolge, mevsim, toprak uyumu

### 6.3 Urun Aciklamalarini Genisletme
Her urun sayfasi icin (min 300 kelime):
- Cesit ozellikleri (meyve agirligi, renk, olgunlasma suresi)
- Yetistirme kosullari (sicaklik, nem, toprak)
- Hastalik dayanikliligi bilgisi
- Verim verileri
- Onerilen dikim zamani ve bolgeler

### 6.4 Urun SSS Girisi (Admin Panel)
Backend'de `product_faqs` tablosu mevcut. Her urun icin 5-8 SSS gir:
- Bu fide ne zaman dikilir?
- Hansi bolgelere uygundur?
- Asili mi standart mi?
- Verim beklentisi nedir?
- Hastalik dayanikliligi nasildir?
- Sulama ve gubreleme onerisi nedir?
- Raf omru ne kadardir?
- Minimum siparis miktari nedir?

### 6.5 Yazar Profilleri
Icerik yazan/onaylayan gercek kisilerin bilgilerini ekle:
- Ad soyad
- Unvan (Ziraat Muhendisi, Sera Uretim Muduru vb.)
- Kisa biyografi (2-3 cumle)
- Fotograf
- Admin panel'de yazar olarak atama

---

## 7. Tarim Forumlari ve Topluluk Varligi

- [ ] **TarimZiraat.com** — Profil olustur, fide ile ilgili sorulara uzman cevaplar yaz
- [ ] **Ciftcilik.com** — Forum'a katil, bilgi paylasiminda bulun
- [ ] **Reddit r/farming veya r/gardening** — Ingilizce icerik icin katilim (opsiyonel)
- [ ] **Quora** — "fide uretimi", "seedling production" sorularina cevap yaz

---

## 8. Medya ve PR

- [ ] Yerel tarim gazetelerine/dergilerine haber gonderi (uretim kapasitesi, yeni yatirimlar)
- [ ] Antalya yerel medyada haber cikisi (isletme tanitimi)
- [ ] Sektörel etkinliklere katilim (Growtech, Antalya Tarim Fuari)
- [ ] Musteri basari hikayeleri dokumante et ve yayinla

---

## Oncelik Sirasi

| Oncelik | Is | Tahmini Etki |
|---|---|---|
| 1 | Nginx guvenlik basliklari | Teknik GEO +10 |
| 2 | Google Is Profili dogrulama | Platform Opt. +8 |
| 3 | YouTube tanitim videosu | Marka Otoritesi +5 |
| 4 | Wikidata girisi | Marka Otoritesi +8 |
| 5 | Bing Webmaster + IndexNow | Platform Opt. +5 |
| 6 | Blog zenginlestirme (3 yazi) | Icerik E-E-A-T +10 |
| 7 | Urun SSS girisi | AI Atiflanabilirlik +8 |
| 8 | 5 yeni konu rehberi | Icerik E-E-A-T +12 |
| 9 | Yazar profilleri | Icerik E-E-A-T +5 |
| 10 | Sosyal medya duzenli paylasim | Marka Otoritesi +3 |
| 11 | Forum katilimi | Marka Otoritesi +3 |
| 12 | Urun aciklama genisletme | AI Atiflanabilirlik +5 |
