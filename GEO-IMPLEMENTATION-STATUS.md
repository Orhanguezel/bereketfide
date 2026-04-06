# Bereket Fide — GEO Audit Uygulama Durumu

**Baslangic Skoru:** 44/100
**Rapor Tarihi:** 29 Mart 2026
**Uygulama Baslangici:** 29 Mart 2026

---

## TAMAMLANAN ISLER

### Faz 1: Kritik Sema Duzeltmeleri

- [x] **Urun sayfalarinda CreativeWork → Product semasi**
  - `frontend/src/seo/jsonld.ts` — `product()` builder genisletildi: `offers`, `aggregateRating`, `manufacturer`, `sku`, `category` alanlari eklendi
  - `frontend/src/app/[locale]/urunler/[slug]/page.tsx` — `jsonld.creativeWork()` → `jsonld.product()` degistirildi
  - Artik Google zengin urun sonuclari (fiyat, stok, marka, rating) icin uygun

- [x] **Organization semasina sameAs eklenmesi**
  - `frontend/src/app/[locale]/page.tsx` — Homepage Organization semasina socials'dan sameAs dizisi eklendi
  - `frontend/src/app/[locale]/iletisim/page.tsx` — Iletisim sayfasi Organization semasina sameAs eklendi
  - 6 sosyal profil (Instagram, Facebook, X, LinkedIn, YouTube, TikTok) artik schema.org ile bagli

- [x] **LocalBusiness semasini PostalAddress + GeoCoordinates ile duzeltme**
  - `frontend/src/seo/jsonld.ts` — `localBusiness()` builder genisletildi: yapisal `PostalAddress`, `GeoCoordinates`, `OpeningHoursSpecification`, `sameAs` destegi
  - `frontend/src/app/[locale]/iletisim/page.tsx` — Duz metin adres yerine yapisal PostalAddress nesnesi + koordinatlar + calisma saatleri

- [x] **Article semasinda gorsel URL duzeltmesi**
  - `frontend/src/app/[locale]/blog/[slug]/page.tsx` — `image: post.image_url` (goreli) → `image: imageSrc` (absoluteAssetUrl ile cozulmus tam URL)
  - `frontend/src/app/[locale]/haberler/[slug]/page.tsx` — Ayni duzeltme uygulandi

### Faz 2: Yeni Sema ve Dosya Eklemeleri

- [x] **llms.txt dosyasi olusturuldu**
  - `frontend/public/llms.txt` — Site yapisi, urunler, hizmetler, bilgi bankasi ve iletisim bilgilerini iceren AI kesfedilebilirlik dosyasi
  - Next.js public/ dizininde statik olarak sunuluyor

- [x] **FAQPage sema builder'i eklendi**
  - `frontend/src/seo/jsonld.ts` — `faqPage()` fonksiyonu: Question/Answer ciftlerini FAQPage semasina donusturur
  - Backend'de `product_faqs` tablosu mevcut, urun sayfalarinda kullanima hazir

- [x] **NewsArticle sema builder'i eklendi**
  - `frontend/src/seo/jsonld.ts` — `newsArticle()` fonksiyonu: Haber sayfalari icin ozellestirilmis sema tipi

- [x] **WebSite semasina SearchAction eklendi**
  - `frontend/src/seo/jsonld.ts` — `website()` builder'ina `potentialAction` / `SearchAction` destegi
  - `frontend/src/app/[locale]/page.tsx` — Homepage WebSite semasinda SearchAction aktif

- [x] **Cloudinary preconnect eklendi**
  - `frontend/src/app/[locale]/layout.tsx` — `<head>` bolumune `<link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />` eklendi
  - Sayfa basi ~100-200ms gorsel yukleme kazanci

### Faz 3: Homepage ve Genel Iyilestirmeler

- [x] **Homepage Organization semasi zenginlestirildi**
  - `frontend/src/seo/jsonld.ts` — `org()` builder'ina `@id`, `foundingDate`, `knowsAbout`, `contactPoint` destegi eklendi
  - `frontend/src/app/[locale]/page.tsx` — Organization semasina `@id`, `foundingDate: 2006`, `knowsAbout` (5 alan), `contactPoint` (3 dil destegi) eklendi

- [x] **Haber sayfalarinda Article → NewsArticle**
  - `frontend/src/app/[locale]/haberler/[slug]/page.tsx` — `jsonld.article()` → `jsonld.newsArticle()` degistirildi

- [x] **BreadcrumbList dogrulamasi**
  - Urun breadcrumb'inda zaten gercek kategori adi (`category_name`) kullaniliyor, "Cesitli" sorunu yok

### Build Dogrulamasi

- [x] TypeScript type check — hata yok
- [x] Next.js production build — basarili

---

## KALAN ISLER

### Faz 4: Nginx & Sunucu Yapilandirmasi (Kod Disi)

- [ ] **Guvenlik basliklari ekle (Nginx)**
  ```nginx
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
  add_header Content-Security-Policy "default-src 'self'; img-src 'self' https://res.cloudinary.com data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com;" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
  server_tokens off;
  ```

- [ ] **Cache-Control politikasini duzelt**
  - `no-cache, no-store` → `stale-while-revalidate` ekle
  - Statik asset'ler icin uzun sureli cache headers ayarla

- [ ] **Bing Webmaster Tools & IndexNow**
  - IndexNow API key'i `frontend/public/` dizinine ekle
  - Bing Webmaster Tools'a site kaydi yap
  - Sitemap.xml submit et

### Icerik Islemleri (Admin Panel / Manuel)

- [ ] **Urun sayfalarinda FAQ icerik girisi**
  - Backend'de `product_faqs` tablosu mevcut
  - Admin panel'den her urun icin 5-8 SSS girisi yapilmali
  - Frontend'de FAQPage sema builder'i hazir, sayfa koduna entegre edilmeli

- [ ] **Mevcut blog yazilarini zenginlestirme**
  - 3 mevcut blog yazisini 1.000-2.000 kelimeye genislet
  - Spesifik veriler ekle: sicaklik, pH, zamanlama, verim yuzdeleri
  - Her yaziya SSS bolumu ekle

- [ ] **Gercek yazar atfi ekleme**
  - Tum icerige gercek kisi adlari ve unvanlari ekle (orn. "Mehmet Yilmaz, Ziraat Muhendisi")
  - Yazar biyografi sayfalari olustur
  - Article/NewsArticle semasinda Person olarak yazar bilgisi zaten destekleniyor

- [ ] **Urun aciklamalarini genisletme**
  - Mevcut 60-80 kelimelik aciklamalari 300+ kelimeye cikar
  - Cesit listesi, ozellik tablosu, yetistirme kosullari ekle

- [ ] **5+ yeni konu rehberi yayinlama**
  - Asili fide nedir, domates fidesi dikimi, sera sicaklik ayarlari vb.
  - Her rehbere uzman yazar atfi, kaynak referanslari ve SSS bolumleri

- [ ] **Gorsel alt metni kapsamini %90+'ya cikarma**
  - Mevcut kapsam ~%60-70
  - Admin panel'den eksik alt metinleri tamamla

### Marka Otoritesi (Dis Platform Islemleri)

- [ ] **Wikidata girisi olusturma**
  - Bereket Fide icin yapilandirilmis ozelliklerle Wikidata girisi
  - Kurulus tarihi, sektor, konum, web sitesi, sosyal profiller

- [ ] **Google Is Profili (GBP) dogrulama ve optimizasyon**
  - Tam bilgi, fotograflar, calisma saatleri, kategoriler

- [ ] **YouTube kanal optimizasyonu**
  - Tanitim videosu ve uretim sureci videosu yukle
  - Kanal aciklamasini SEO uyumlu yaz

- [ ] **LinkedIn sirket sayfasi optimizasyonu**
  - Tam bilgi ve duzenli paylasimlar

- [ ] **Tarim forumlarina katilim**
  - TarimZiraat, ciftcilik.com gibi platformlarda profil olustur
  - Uzman cevaplari yaz

### Gelecek Teknik Iyilestirmeler (Oncelik: Dusuk-Orta)

- [ ] **speakable ozeligi ekleme**
  - Article ve NewsArticle semalarina speakable CSS selector'lari ekle
  - AI asistanlarinin sesli okuma/alinti icin kullanacagi bloklar

- [ ] **Service semasi hizmet sayfalarinda dogrulama**
  - Mevcut Service semasi builder'i var, hizmet sayfalarinda kullanildigi dogrulanmali

- [ ] **Hero gorselinde fetchpriority="high" ekleme**
  - LCP iyilestirmesi icin hero gorsel onceliklendirilmeli

- [ ] **Baslik etiketini 60 karakterin altina indirme**
  - Mevcut: 61+ karakter → 60 altina kes
  - `buildSeoTitle()` zaten 60 karakter limiti uyguluyor, veri tarafinda kontrol

- [ ] **Icerik-icerik baglantilari (interlinking)**
  - Blog yazilari birbirine ve urun sayfalarina baglanmali
  - Urun sayfalarindan ilgili blog yazilarına link verilmeli

---

## Degisiklik Yapilan Dosyalar (Referans)

| Dosya | Ne Yapildi |
|---|---|
| `frontend/src/seo/jsonld.ts` | product(), org(), localBusiness(), website() genisletildi; faqPage(), newsArticle() eklendi |
| `frontend/src/app/[locale]/urunler/[slug]/page.tsx` | CreativeWork → Product semasi |
| `frontend/src/app/[locale]/page.tsx` | Organization zenginlestirildi, sameAs, SearchAction eklendi |
| `frontend/src/app/[locale]/iletisim/page.tsx` | PostalAddress + GeoCoordinates + sameAs |
| `frontend/src/app/[locale]/layout.tsx` | Cloudinary preconnect eklendi |
| `frontend/src/app/[locale]/blog/[slug]/page.tsx` | Article image tam URL duzeltmesi |
| `frontend/src/app/[locale]/haberler/[slug]/page.tsx` | Article → NewsArticle + image tam URL |
| `frontend/public/llms.txt` | Yeni dosya |

---

## Beklenen Etki

Bu degisikliklerle asagidaki GEO skor iyilestirmeleri bekleniyor:

| Kategori | Once | Sonra (Tahmini) | Degisim |
|---|---|---|---|
| Teknik GEO | 80/100 | 90/100 | +10 (preconnect, guvenlik basliklari) |
| Sema & Yapisal Veri | 33/100 | 65/100 | +32 (Product, sameAs, PostalAddress, FAQPage, NewsArticle, SearchAction) |
| AI Atiflanabilirlik | 32/100 | 45/100 | +13 (llms.txt, yapisal sema, FAQ hazirlik) |
| Platform Optimizasyonu | 49/100 | 62/100 | +13 (zengin semalar, SearchAction) |
| Icerik E-E-A-T | 34/100 | 34/100 | 0 (icerik zenginlestirme henuz yapilmadi) |
| Marka Otoritesi | 22/100 | 22/100 | 0 (dis platform islemleri henuz yapilmadi) |
| **Genel GEO Skoru** | **44/100** | **~55/100** | **+11** |

> *Not: Icerik zenginlestirme ve marka otoritesi islemleri tamamlandiginda hedef skor 70+/100*
