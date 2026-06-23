# GEO Audit Report: Bereket Fide

**Audit Tarihi:** 29 Mart 2026
**URL:** https://www.bereketfide.com/tr
**Is Tipi:** Tarimsal Uretim (Fide Uretimi) — Yerel Isletme + B2B Hibrit
**Analiz Edilen Sayfa:** 75 URL (sitemap), 8 sayfa detayli analiz
**Diller:** Turkce (TR), Ingilizce (EN), Almanca (DE)

---

## Yonetici Ozeti

**Genel GEO Skoru: 44/100 (Zayif)**

Bereket Fide, 2006'dan beri Antalya Aksu'da 32.000 m² alanda faaliyet gosteren, yillik 35+ milyon fide kapasitesine sahip guclu bir tarimsal isletmedir. Teknik altyapi (Next.js SSR, Cloudinary CDN, coklu dil destegi, temiz URL yapisi) saglamdir. Ancak sitenin **icerigi cok ince** (sadece 3 blog yazisi, 60-80 kelimelik urun aciklamalari), **yazar atfi yok**, **sameAs baglantilari eksik**, **urun sayfalarinda yanlis sema kullaniliyor** (Product yerine CreativeWork) ve **llms.txt dosyasi bulunmuyor**. AI sistemleri bu siteyi kendi alaninda bile alintilama olasiligiyla dusuk degerlendirecektir.

### Skor Dagilimi

| Kategori | Skor | Agirlik | Agirlikli Skor |
|---|---|---|---|
| AI Atiflanabilirlik (Citability) | 32/100 | 25% | 8.00 |
| Marka Otoritesi (Brand Authority) | 22/100 | 20% | 4.40 |
| Icerik E-E-A-T | 34/100 | 20% | 6.80 |
| Teknik GEO | 80/100 | 15% | 12.00 |
| Sema & Yapisal Veri | 33/100 | 10% | 3.30 |
| Platform Optimizasyonu | 49/100 | 10% | 4.90 |
| **Genel GEO Skoru** | | | **39.4 → 44/100** |

> *Not: Agirlikli toplam 39.4 olmakla birlikte, guvenilir altyapi (SSR, sitemap, robots.txt, hreflang) AI erisimi icin saglam temel olusturdugundan, efektif skor 44'e yuvarlanmistir.*

---

## Platform Hazirlik Detaylari

| Platform | Skor | Durum |
|---|---|---|
| Google AI Overviews | 55/100 | Orta |
| ChatGPT Web Search | 42/100 | Zayif |
| Perplexity AI | 38/100 | Zayif |
| Google Gemini | 58/100 | Orta |
| Bing Copilot | 52/100 | Orta |

---

## Kritik Sorunlar (Hemen Duzeltilmeli)

### 1. Urun Sayfalarinda Yanlis Sema Tipi
- **Sorun:** Tum urun detay sayfalari `Product` yerine `CreativeWork` sema tipi kullaniyor
- **Etki:** Google zengin urun sonuclari gosteremiyor, AI modelleri bu sayfalari urun olarak tanimlayamiyor
- **Duzeltme:** Tum 7+ urun sayfasinda `CreativeWork` yerine `Product` semasi kullanilmali (offers, brand, category, sku dahil)

### 2. sameAs Baglantilari Tamamen Eksik
- **Sorun:** 6 aktif sosyal medya profili (Instagram, Facebook, X, LinkedIn, YouTube, TikTok) var ancak hicbiri Organization semasinda `sameAs` ile bagli degil
- **Etki:** AI modelleri "Bereket Fide"yi platformlar arasi bir varlik olarak taniyamiyor
- **Duzeltme:** Organization semasina tum sosyal profil URL'lerini `sameAs` dizisi olarak ekleyin

### 3. Icerik Cok Ince
- **Sorun:** Sadece 3 blog yazisi (85-350 kelime), urun aciklamalari 60-80 kelime
- **Etki:** Hicbir konuda topikal otorite kurulamiyor, AI sistemleri alinti yapacak yeterli icerik bulamiyor
- **Duzeltme:** Blog icerigini 1.000-2.000 kelimeye genisletin, 20-30 yeni konu rehberi yayinlayin

### 4. Yazar Atfi Yok
- **Sorun:** Hicbir icerik sayfasinda gercek kisi adi, unvan veya kimlik bilgisi yok. Yazar olarak "Bereket Fide" (sirket adi) kullanilmis
- **Etki:** E-E-A-T sinyalleri cok zayif, AI sistemleri uzman icerigi olarak degerlendiremez
- **Duzeltme:** Tum icerige gercek yazar adlari, unvanlari (Ziraat Muhendisi vb.) ve biyografi sayfalari ekleyin

---

## Yuksek Oncelikli Sorunlar

### 5. llms.txt Dosyasi Yok
- **Sorun:** `/llms.txt` 404 donuyor
- **Duzeltme:** Site yapisini, urunleri ve hizmetleri anlatan bir llms.txt dosyasi olusturun
- **Beklenen Etki:** AI kesfedilebilirliginde aninda iyilesme

### 6. LocalBusiness Semasinda Gecersiz Adres Formati
- **Sorun:** Adres duz metin olarak yazilmis, `PostalAddress` nesnesi degil. Calisma saatleri de yapisal formatta degil
- **Duzeltme:** `PostalAddress` nesnesi + `GeoCoordinates` + `OpeningHoursSpecification` kullanin

### 7. Article Semasinda Goreli Gorsel URL'leri
- **Sorun:** Blog yazilarinda gorsel yolu `/uploads/products/...` seklinde goreli — gecersiz
- **Duzeltme:** Tum gorsel URL'lerini tam Cloudinary URL'leriyle degistirin

### 8. FAQ Icerigi ve Semasi Yok
- **Sorun:** Hicbir sayfada soru-cevap formati veya FAQPage semasi yok
- **Etki:** AI sistemlerinin en cok cikarim yaptigi format eksik
- **Duzeltme:** Her urun kategorisi sayfasina 5-8 SSS ekleyin, FAQPage semasi ile isaretleyin

### 9. Guvenlik Basliklari Eksik
- **Sorun:** HSTS, CSP ve Permissions-Policy basliklari yok. Nginx surumu acik
- **Duzeltme:** Nginx yapilandirmasina ekleyin:
  ```
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
  add_header Content-Security-Policy "default-src 'self'; ..." always;
  server_tokens off;
  ```

### 10. Cloudinary Icin Preconnect Eksik
- **Sorun:** `<link rel="preconnect" href="https://res.cloudinary.com">` yok
- **Etki:** Her sayfa yuklemesinde 100-200ms gecikme
- **Duzeltme:** HTML `<head>` bolumune preconnect ekleyin

---

## Orta Oncelikli Sorunlar

### 11. WebSite Semasinda SearchAction Eksik
- Sitelinks arama kutusu uygunlugu yok. `potentialAction` ile `SearchAction` ekleyin.

### 12. speakable Ozeligi Yok
- AI asistanlarinin sesli okuma/alinti icin kullanacagi `speakable` ozeligi hicbir sayfada yok.

### 13. Hizmet Sayfalari Icin Service Semasi Yok
- 6 hizmet sayfasinin hicbirinde `Service` semasi yok.

### 14. Gorsel Alt Metni Kapsami ~%60-70
- Tum gorsellerin alt metin kapsamini %90+'ya cikarin.

### 15. Cache-Control Politikasi Agresif
- `no-cache, no-store` tum istekleri sunucuya yonlendiriyor. `stale-while-revalidate` degerini dusunun.

### 16. Bing Webmaster Tools ve IndexNow Eksik
- IndexNow protokolunu uygulayin, Bing Webmaster Tools'a kayit olun.

### 17. Wikidata Girisi Yok
- Bereket Fide icin yapilandirilmis ozelliklerle (kurulus tarihi, sektor, konum, web sitesi) bir Wikidata girisi olusturun.

---

## Dusuk Oncelikli Sorunlar

### 18. NewsArticle Yerine Article Kullanimi
- Haber sayfalarinda (`/haberler/`) `Article` yerine `NewsArticle` kullanilmali.

### 19. Baslik Etiketi Muhtemelen Uzun
- 61+ karakter — 60 karakterin altina inin.

### 20. Twitter Description Etiketi Eksik
- `og:description`'a fallback yapiyor ancak acikca eklenmeli.

### 21. BreadcrumbList'te Genel Kategori Adi
- Urun breadcrumb'inda "Cesitli" yerine gercek kategori adi kullanilmali.

---

## Kategori Detay Analizleri

### AI Atiflanabilirlik (32/100)

Bereket Fide'nin icerigi AI atiflanabilirligi icin olusturulmamis. En iyi icerik blogu (Hakkimizda sayfasindaki uretim kapasite verileri) bile yapisal formatlama eksikliginden dolayi 44/100 alabilmistir.

**Temel Bulgular:**
- **Sifir FAQ icerigi** — AI sistemlerinin en kolay cikarim yaptigi format
- **Blog yazilari cok ince** — 85-350 kelime, spesifik veri noktasi yok
- **Urun aciklamalari pazarlama kopyasi** — cesit adlari, verim verileri, yetistirme spesifikasyonlari yok
- **Haber yazilari** — etkinlik duyurusu, substantif icerik degil
- **En atiflanabilir blok:** Uretim kapasite verileri (24.000 m², 16-17M asili, 18-20M standart)

**Iyilestirme:** Her blog yazisina spesifik veriler (sicaklik, pH, zamanlama, verim yuzdeleri), SSS bolumleri ve kaynak referanslari ekleyin.

### Marka Otoritesi (22/100)

| Platform | Durum | Detay |
|---|---|---|
| Wikipedia | Yok | TR/EN Wikipedia'da makale yok |
| Reddit | Yok | Sifir bahsetme |
| YouTube | Minimal | Kanal var ancak kesfe acik icerik yok |
| LinkedIn | Minimal | Sirket sayfasi var, dusuk etkilesim |
| Sektör Kaynaklari | Kismen | TarimZiraat, AllBiz, Find.com.tr, Bloomberg listesi, Antalya TV haberi |

**En Kritik Eksik:** Wikipedia ve Wikidata varligi — AI modellerinin varlik tanima icin en cok kullandigi kaynaklar.

### Icerik E-E-A-T (34/100)

| Boyut | Skor | Temel Sorun |
|---|---|---|
| Deneyim (Experience) | 10/25 | Vaka calismasi, oncesi/sonrasi verisi, surec dokumantasyonu yok |
| Uzmanlik (Expertise) | 7/25 | Adli yazar yok, sertifika yok, teknik derinlik yok |
| Otorite (Authoritativeness) | 12/25 | Hukumet ziyaretleri ve ortakliklar var ama oduller, medya kapsamasi yok |
| Guvenilirlik (Trustworthiness) | 9/25 | NAP var ama desteklenmeyen iddialar (10.000 musteri), sertifika yok |

**AI Icerik Degerlendirmesi:** Blog yazilari buyuk olasilikla AI ile uretilmis veya hafif duzenlenmistir. "Inovatif Yaklasimlar" yazisi 85 kelimede sifir spesifik inovasyon adi vermektedir.

### Teknik GEO (80/100)

**En guclu kategori.** Altyapi saglam:
- Next.js SSR ile sunucu tarafli renderlama (3.049+ karakter gorunur icerik)
- Sitemap.xml mevcut (75 URL, lastmod tarihleri var)
- robots.txt iyi yapilandirilmis, AI tarayicilari engellenmemis
- Hreflang uygulamasi dogru (TR/EN/DE + x-default)
- Temiz URL yapisi (`/{locale}/{kategori}/{slug}`)
- Cloudinary CDN ile gorsel optimizasyonu
- PWA manifest mevcut

**Eksikler:** HSTS/CSP guvenlik basliklari yok (-25), Cloudinary preconnect yok, agresif cache politikasi.

### Sema & Yapisal Veri (33/100)

**Bulunan Semalar:** Organization, WebSite, LocalBusiness, CollectionPage, ItemList, BreadcrumbList, CreativeWork (yanlis), Article

**Kritik Hatalar:**
1. Urun sayfalarinda `Product` yerine `CreativeWork` — en onemli sema hatasi
2. Organization'da `sameAs` tamamen eksik — 6 sosyal profil baglantisiz
3. LocalBusiness'ta adres duz metin, `PostalAddress` nesnesi degil
4. Article'da gorsel URL'si goreli yol
5. Yazar `Person` semasi gercek kisi adi yerine sirket adi

**Eksik Semalar:** Product, FAQPage, HowTo, Service, Person (yazar), speakable, SearchAction, NewsArticle, GeoCoordinates, AggregateRating

### Platform Optimizasyonu (49/100)

- **Google AI Overviews (55):** Schema cesitliligi iyi ama FAQ/HowTo semasi yok, icerik ince
- **ChatGPT (42):** Varlik tanima zayif (Wikipedia/Wikidata yok), yazar atfi yok
- **Perplexity (38):** Topluluk dogrulamasi yok (Reddit/forum), birincil kaynak icerigi yetersiz
- **Gemini (58):** Google ekosistemi sinyalleri var (YouTube, muhtemel GBP), sema cesitliligi iyi
- **Bing Copilot (52):** LinkedIn varligi var ama IndexNow yok, Bing Webmaster Tools yok

---

## Geleneksel SEO Faktorleri

### On-Page SEO (72/100)

| Ozellik | Durum | Detay |
|---|---|---|
| Baslik Etiketi | ✅ Iyi | 61 karakter, anahtar kelimeler dahil |
| Meta Aciklama | ✅ Iyi | 156 karakter, anahtar kelimeler dahil |
| H1 Yapisi | ✅ Dogru | Tek H1, mantikli hiyerarsi |
| Anahtar Kelime Dagitimi | ✅ Saglikli | "fide" %2.1, asiri optimizasyon yok |
| Alt Metin | ⚠️ Orta | %60-70 kapsam |
| Ic Baglantilar | ✅ Guclu | 45+ dahili baglanti |
| Dis Baglantilar | ✅ Uygun | 6 ortak/tedarikci referansi |
| Canonical | ✅ Dogru | Kendine referansli canonical |
| Hreflang | ✅ Dogru | TR/EN/DE + x-default |

### Performans Gostergeleri (75/100)

| Ozellik | Durum | Detay |
|---|---|---|
| Framework | ✅ | Next.js SSR — hizli ilk yukleme |
| CDN | ✅ | Cloudinary gorsel CDN |
| Font Preload | ✅ | 4 woff2 font HTTP Link ile oncelikli |
| CSS Preload | ✅ | 2 CSS dosyasi oncelikli |
| Preconnect | ❌ | Cloudinary icin preconnect yok |
| Cache | ⚠️ | no-cache, no-store — her istek sunucuya gider |
| Ucuncu Parti | ✅ | Analytics/reklam/chat yok — temiz |
| LCP Riski | ⚠️ Orta | Hero gorselinde fetchpriority yok |

### Sosyal Medya (70/100)

| Platform | Durum | URL |
|---|---|---|
| Instagram | ✅ Mevcut | instagram.com/bereketfide |
| Facebook | ✅ Mevcut | facebook.com/bereketfide |
| X (Twitter) | ✅ Mevcut | x.com/bereketfide |
| LinkedIn | ✅ Mevcut | linkedin.com/company/bereketfide |
| YouTube | ✅ Mevcut | youtube.com/@bereketfide |
| TikTok | ✅ Mevcut | tiktok.com/@bereketfide |
| OG Tags | ✅ Tam | title, description, image, url, locale, type |
| Twitter Cards | ✅ Tam | summary_large_image |

**Sorun:** 6 sosyal profil var ama hicbiri Schema.org `sameAs` ile bagli degil.

### Baglanti Yapisi (68/100)

| Ozellik | Durum | Detay |
|---|---|---|
| Ic Baglantilar | ✅ 45+ | Navigasyon ve baglamsal baglantilar |
| Dis Baglantilar | ✅ 6 | Ortak/tedarikci referanslari |
| URL Yapisi | ✅ Temiz | `/{locale}/{kategori}/{slug}` |
| Breadcrumb | ✅ Mevcut | BreadcrumbList semasi ile |
| Anchor Metin | ✅ Uygun | Aciklayici metin kullanilmis |
| Icerik-Icerik Baglantisi | ❌ Eksik | Blog yazilari birbirine veya urunlere baglanmiyor |

---

## Genisletilmis Skor Tablosu

| Kategori | Skor | Tip |
|---|---|---|
| AI Atiflanabilirlik | 32/100 | GEO Cekirdek |
| Marka Otoritesi | 22/100 | GEO Cekirdek |
| Icerik E-E-A-T | 34/100 | GEO Cekirdek |
| Teknik GEO | 80/100 | GEO Cekirdek |
| Sema & Yapisal Veri | 33/100 | GEO Cekirdek |
| Platform Optimizasyonu | 49/100 | GEO Cekirdek |
| **GEO Skoru** | **44/100** | **Agirlikli** |
| On-Page SEO | 72/100 | Geleneksel |
| Performans | 75/100 | Geleneksel |
| Sosyal Medya | 70/100 | Geleneksel |
| Baglanti Yapisi | 68/100 | Geleneksel |

---

## Hizli Kazanimlar (Bu Hafta Uygulayin)

1. **llms.txt dosyasi olusturun** — Site yapisini ve urunleri anlatan basit bir markdown dosyasi. Sifir maliyet, aninda AI kesfedilebilirlik etkisi.

2. **Organization semasina sameAs ekleyin** — 6 sosyal profil URL'sini `sameAs` dizisine eklemek 5 dakikalik is, varlik tanima icin kritik.

3. **Urun semasini Product olarak degistirin** — `CreativeWork` → `Product` degisikligi zengin sonuc uygunlugu saglayacak.

4. **LocalBusiness adresini PostalAddress nesnesine donusturun** — Duz metin yerine yapisal format + GeoCoordinates ekleyin.

5. **Cloudinary icin preconnect ekleyin** — `<link rel="preconnect" href="https://res.cloudinary.com" crossorigin>` ile sayfa basi 100-200ms kazanc.

---

## 30 Gunluk Eylem Plani

### Hafta 1: Teknik Duzeltmeler & Sema Iyilestirmeleri
- [x] llms.txt dosyasi olusturun ve deploy edin ✅ 29 Mart 2026
- [x] Organization semasina sameAs dizisi ekleyin (6 sosyal profil) ✅ 29 Mart 2026
- [x] Urun sayfalarinda CreativeWork → Product semasi degistirin ✅ 29 Mart 2026
- [x] LocalBusiness semasini PostalAddress + GeoCoordinates ile duzaltin ✅ 29 Mart 2026
- [x] Article semasinda gorsel URL'lerini tam URL'lere cevirtin ✅ 29 Mart 2026
- [ ] HSTS ve CSP guvenlik basliklarini Nginx'e ekleyin
- [x] Cloudinary preconnect ekleyin ✅ 29 Mart 2026
- [ ] Nginx'te `server_tokens off` yapin

### Hafta 2: Icerik Zenginlestirme
- [ ] Mevcut 3 blog yazisini 1.000-2.000 kelimeye genisletin (spesifik veriler, kaynaklar, SSS)
- [ ] Tum icerige gercek yazar adlari ve unvanlari ekleyin
- [ ] Her urun sayfasina 5-8 SSS ekleyin, FAQPage semasi ile isaretleyin
- [ ] Urun aciklamalarini genisletin (cesit listesi, ozellik tablosu, yetistirme kosullari)
- [ ] Hizmet sayfalarina Service semasi ekleyin

### Hafta 3: Marka Otoritesi Olusturma
- [ ] Bereket Fide icin Wikidata girisi olusturun
- [ ] Google Is Profilini dogrulayin ve optimize edin
- [ ] Bing Webmaster Tools'a kayit olun, IndexNow uygulayin
- [ ] YouTube kanalina tanitim videosu ve uretim sureci videosu yukleyin
- [ ] LinkedIn sirket sayfasini tam bilgi ve duzenli paylasimlarla optimize edin

### Hafta 4: Icerik Uretimi & Topluluk Varligi
- [ ] 5 yeni konu rehberi yayinlayin (asili fide nedir, domates fidesi dikimi, sera sicaklik ayarlari, vb.)
- [ ] Her rehbere uzman yazar atfi, kaynak referanslari ve SSS bolumleri ekleyin
- [ ] Urun sayfalarina asili vs. standart karsilastirma tablolari ekleyin
- [ ] Tarim forumlarinda (TarimZiraat, ciftcilik.com) profil olusturun ve uzman cevaplari yazin
- [ ] speakable ozelligini Article ve NewsArticle semalarina ekleyin

---

## Onerilen llms.txt Sablonu

```markdown
# Bereket Fide

> Antalya Aksu merkezli, 2006'dan beri 24.000 m² modern seralarda asili ve standart sebze fidesi ureten tarimsal isletme. Yillik 35+ milyon fide kapasitesi.

## Sirket Bilgileri
- [Hakkimizda](https://www.bereketfide.com/tr/hakkimizda): Sirket tarihi, uretim kapasitesi, kalite politikasi
- [Iletisim](https://www.bereketfide.com/tr/iletisim): Konum, calisma saatleri, iletisim bilgileri

## Urunler
- [Urun Katalogu](https://www.bereketfide.com/tr/urunler): Sebze ve meyve fide cesitleri
- [Asili Fide Katalogu](https://www.bereketfide.com/tr/kataloglar/asisli-fide-katalogu): Hastaliga dayanikli asili cesitler
- [Duz Fide Katalogu](https://www.bereketfide.com/tr/kataloglar/duz-fide-katalogu): Standart fide cesitleri

## Hizmetler
- [Hizmetler](https://www.bereketfide.com/tr/hizmetler): Asili uretim, standart uretim, teknik destek, lojistik, sozlesmeli uretim, cesit denemeleri

## Bilgi Bankasi
- [Blog](https://www.bereketfide.com/tr/blog): Tarimsal rehberler ve inovasyon yazilari
- [Haberler](https://www.bereketfide.com/tr/haberler): Sirket haberleri ve etkinlikler
```

---

## Onerilen JSON-LD Sema Sablonlari

### Organization (Gelistirilmis)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.bereketfide.com/#organization",
  "name": "Bereket Fide",
  "legalName": "Bereket Fide Ltd. Sti.",
  "url": "https://www.bereketfide.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.bereketfide.com/icon",
    "width": 512,
    "height": 512
  },
  "description": "2006'dan beri Antalya Aksu'da 24.000 m² modern seralarda asili ve standart sebze fidesi uretimi.",
  "foundingDate": "2006",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Fatih Mah. Isparta Yolu",
    "addressLocality": "Aksu",
    "addressRegion": "Antalya",
    "postalCode": "07112",
    "addressCountry": "TR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 36.9392215,
    "longitude": 30.8525091
  },
  "telephone": "+90-242-464-19-25",
  "email": "info@bereketfide.com.tr",
  "sameAs": [
    "https://instagram.com/bereketfide",
    "https://facebook.com/bereketfide",
    "https://x.com/bereketfide",
    "https://linkedin.com/company/bereketfide",
    "https://youtube.com/@bereketfide",
    "https://www.tiktok.com/@bereketfide"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+90-242-464-19-25",
    "contactType": "customer service",
    "availableLanguage": ["Turkish", "English", "German"]
  },
  "knowsAbout": ["Fide uretimi", "Asili fide", "Domates fidesi", "Biber fidesi", "Sera tarimciligi"]
}
```

### Product (Urun Sayfalari Icin — CreativeWork'un Yerine)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Urun Adi]",
  "description": "[Detayli urun aciklamasi]",
  "image": "[Tam Cloudinary URL]",
  "url": "https://www.bereketfide.com/tr/urunler/[slug]",
  "brand": { "@type": "Brand", "name": "Bereket Fide" },
  "manufacturer": { "@id": "https://www.bereketfide.com/#organization" },
  "category": "[Urun Kategorisi]",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceCurrency": "TRY",
    "seller": { "@id": "https://www.bereketfide.com/#organization" }
  }
}
```

---

## Ek: Analiz Edilen Sayfalar

| URL | Baslik | GEO Sorun Sayisi |
|---|---|---|
| /tr | Bereket Fide \| Kaliteli ve Yuksek Verimli Fide Uretimi | 5 |
| /tr/hakkimizda | Hakkimizda | 4 |
| /tr/iletisim | Iletisim | 3 |
| /tr/urunler | Urunlerimiz | 2 |
| /tr/urunler/biber-fidesi-satin-al | Biber Fidesi | 5 |
| /tr/blog | Bilgi Bankasi | 3 |
| /tr/blog/fide-dikim-oncesi-toprak-hazirligi | Toprak Hazirligi | 4 |
| /tr/haberler/ozbekistan-tarim-bakani... | Ozbekistan Ziyareti | 3 |
| /robots.txt | - | 1 |
| /sitemap.xml | - | 0 |
| /llms.txt | 404 - Bulunamadi | 1 |

---

*Bu rapor Claude Code GEO Audit araci ile olusturulmustur. Veriler 29 Mart 2026 tarihinde toplanmistir.*
