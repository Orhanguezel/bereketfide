# Google Search Console — Yapılandırma Çeklisti

**Mülk:** `https://www.bereketfide.com.tr/` (URL prefix — eklendi)
**Sitemap:** `https://www.bereketfide.com.tr/sitemap.xml` (canlı, 108 URL)
**Hedef:** Sıfır indeksleme hatası, tüm raporlamanın sağlıklı çalışması.

---

## ✅ Tamamlanan

- [x] URL prefix mülkü eklendi (`https://www.bereketfide.com.tr/`)
- [x] Mülk doğrulandı
- [x] `sitemap.xml` dinamik üretiliyor ([app/sitemap.ts](../frontend/src/app/sitemap.ts))
- [x] `robots.txt` sitemap referansı veriyor ([app/robots.ts](../frontend/src/app/robots.ts#L35))
- [x] Canonical helper'ı kuruldu ([seo/helpers.ts](../frontend/src/seo/helpers.ts))
- [x] hreflang (tr/en/de + x-default) aktif
- [x] Codex canlı doğrulaması yapıldı (2026-05-25): sitemap 108 URL, kritik sayfalar 200, redirectler 301, ürün JSON-LD ve GTM aktif
- [x] SEO smoke testi geçti (2026-05-25): `bun run test:seo`

---

## 🔥 Acil — Bu Hafta Yapılacak

### 1. Sitemap'i Search Console'a gönder
- [ ] Sol menü → **İndeksleme → Site Haritaları**
- [ ] Kutuya yaz: `sitemap.xml` (sadece bu, başına URL ekleme)
- [ ] **Gönder** → 1-2 dk sonra "Başarılı" + ~108 URL görünmeli
- [ ] Status "Couldn't fetch" gelirse: 24 saat bekle ve **"Yeniden gönder"** bas

### 2. URL Inspection — kritik 5 sayfayı doğrula
Sol menü → **URL Denetimi** kutusuna her birini sırayla gir, **"Dizine eklenme talep et"** bas:

- [ ] `https://www.bereketfide.com.tr/tr` (anasayfa)
- [ ] `https://www.bereketfide.com.tr/tr/urunler`
- [ ] `https://www.bereketfide.com.tr/tr/hakkimizda`
- [ ] `https://www.bereketfide.com.tr/tr/iletisim`
- [ ] `https://www.bereketfide.com.tr/tr/kampanya/sebze-tohumu-biber-tohumu`

> Her URL için "URL Google'da değil" görürsen normal — yeni mülk. "Tarama izinli, indekslenebilir" sonucu yeterli.
> Codex canlı kontrolü (2026-05-25): 5 URL de `200 OK` dönüyor ve tr/en/de + x-default hreflang header'ları mevcut. Search Console'da "Dizine eklenme talep et" işlemi manuel yapılmalı.

### 3. Yönlendirme zincirini doğrula (2026-05-25 — TEST EDİLDİ ✅)
- [x] `http://bereketfide.com.tr` → `https://www.bereketfide.com.tr/` (301) ✅
- [x] `https://bereketfide.com.tr` → `https://www.bereketfide.com.tr/` (301) ✅
- [x] `http://www.bereketfide.com.tr` → `https://www.bereketfide.com.tr/` (301) ✅
- [x] Trailing slash normalizasyonu (`/tr/` → `/tr`, `/tr/urunler/` → `/tr/urunler` — 308) ✅
- [x] Canonical: `<link rel="canonical" href="https://www.bereketfide.com.tr/tr"/>` ✅
- [x] Hreflang: tr/en/de + x-default (→ /tr) doğru tanımlı ✅
- [x] Test komutu: `curl -sIL https://bereketfide.com.tr | grep -iE "HTTP|location"`

> Sonuç: Tüm domain varyantları tek kanonik adrese düşüyor, slash normalize ediliyor, canonical/hreflang temiz. Search Console'da **"Yönlendirme ile alternatif sayfa" ve "Duplicate URL" hatası çıkmayacak**.
>
> Küçük detay: `bereketfide.com.tr` yazınca 2 hop redirect oluyor (http→https+www, sonra /→/tr). SEO'ya zararı yok, performans için ileride nginx tek atlamada birleştirilebilir — şu an öncelik değil.

---

## 📅 İlk 2 Hafta İçinde

### 4. Domain property ekle (DNS hazır olunca)
- [ ] DNS panelinde TXT kaydı eklenebildiğinde yap
- [ ] `bereketfide.com.tr` (Domain tipi, www'siz)
- [ ] Doğrulandıktan sonra sitemap'i burada da gönder
- [ ] Eski URL prefix mülkü silinmesin — geçmiş veri kaybolur

### 5. Schema / Yapılandırılmış Veri doğrula
Mevcut JSON-LD: Organization, LocalBusiness, Product, BreadcrumbList ([seo/jsonld.ts](../frontend/src/seo/jsonld.ts))

- [ ] [Rich Results Test](https://search.google.com/test/rich-results) → anasayfa + bir ürün detay sayfası
- [ ] Search Console → **İyileştirmeler** sekmesinde "Ürünler", "Mağaza", "Logo" raporları geldiyse kontrol et
- [x] Schema validation hatası varsa düzelt (yaygın: `priceCurrency` eksik, `availability` URL formatı yanlış)

> Codex canlı kontrolü (2026-05-25): `https://www.bereketfide.com.tr/tr/urunler/duz-domates-fidesi` sayfasında `Product`, `Organization`, `BreadcrumbList`, `priceCurrency: TRY` ve schema.org formatlı `availability` doğrulandı.

### 6. Core Web Vitals raporunu izle
- [ ] **Deneyim → Önemli Web Verileri** sekmesini aç
- [ ] CrUX verisi 28 gün sonra dolar — bekle
- [ ] LCP > 2.5s, CLS > 0.1, INP > 200ms URL'ler "Kötü" listesinde çıkarsa öncelikle düzelt
- [x] Lighthouse CI ile paralel takip et: `bun run audit:lighthouse`

> Codex kontrolü (2026-05-25): `bun run audit:lighthouse` 6 URL'de 12 Lighthouse koşusunu başarıyla tamamladı. Audit için standalone build ve local canonical ayarı düzeltildi.

### 7. Mobil Kullanılabilirlik
- [ ] **Deneyim → Mobil Kullanılabilirlik** raporunu aç
- [ ] "Metin çok küçük", "Tıklanabilir öğeler birbirine çok yakın" gibi hataları topla
- [x] Yoksa ✅, varsa frontend tarafında fix et

> Codex mobil kontrolü (2026-05-25): Mobil Lighthouse anasayfa, ürünler ve iletişim sayfalarında `viewport` ve `font-size` audit'leri geçti; SEO 100. Search Console raporu manuel kontrol edilmeli.

---

## 🔄 Aylık Rutin Kontrol

### 8. Coverage / Sayfa Sayısı raporu
- [ ] **İndeksleme → Sayfa Sayısı** sekmesi
- [ ] "Dizine eklendi" vs "Dizine eklenmedi" oranını kontrol et
- [ ] Hata kategorilerine bak:
  - **"Tarandı, henüz dizine eklenmedi"** → 4 hafta+ ise içerik kalitesi sorunu (ince içerik, duplicate, vb.)
  - **"Keşfedildi, henüz dizine eklenmedi"** → crawl budget sorunu, internal link eksik
  - **"Yönlendirme ile alternatif sayfa"** → canonical/redirect hatası (yukarıda madde 3)
  - **"Soft 404"** → Boş içerik veya `not-found` yanlış status code dönüyor
  - **"5xx sunucu hatası"** → Backend down olmuş, log incele
  - **"noindex etiketiyle hariç tutuldu"** → Bilinçli mi kontrol et
- [x] Codex teknik coverage kontrolü: canlı sitemap URL status taraması + lokal crawl

> Codex kontrolü (2026-05-25): Canlı `sitemap.xml` 108 URL içeriyor ve 108/108 URL 400/500 hatası olmadan dönüyor. Lokal SEO crawl: 86 sayfa tarandı, orphan sayfa 0; lokal backend kapalı olduğu için yalnızca `/uploads/...jpg` görsel rewrite'larında beklenen 500 görüldü.

### 9. Performans raporu — pozisyon takibi
- [ ] **Performans → Arama Sonuçları**
- [ ] 28 günlük tıklama, gösterim, CTR, ortalama pozisyon trendine bak
- [ ] **Sorgular** sekmesinde 5-15 pozisyon arası kelimeler: bunlar "kolay kazanç" — içerik güçlendir
- [ ] **Sayfalar** sekmesinde CTR < %2 olan sayfalar: meta description/title revize

### 10. Manuel İşlemler / Güvenlik
- [ ] **Güvenlik ve Manuel İşlemler → Manuel İşlemler** → "Sorun yok" görmeli
- [ ] **Güvenlik Sorunları** → "Sorun yok" görmeli
- [ ] Bildirim gelirse e-postaya gelir, ANINDA müdahale gerekir
- [x] Codex teknik güvenlik başlıkları kontrolü

> Codex kontrolü (2026-05-25): Canlı sayfada `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` doğrulandı. Search Console manuel işlem/güvenlik ekranları manuel kontrol edilmeli.

---

## ⚙️ Bir Kerelik Yapılandırma

### 11. Uluslararası hedefleme kontrolü
- [ ] [Hreflang Tester](https://technicalseo.com/tools/hreflang/) ile `bereketfide.com.tr/tr` test et
- [x] tr/en/de + x-default karşılıklı tanımlanmış olmalı
- [ ] Hata yoksa: ✅ — Search Console artık ayrı bir "International Targeting" sekmesi sunmuyor (kaldırıldı)

> Codex canlı kontrolü (2026-05-25): anasayfa, ürünler, hakkımızda, iletişim ve kampanya sayfalarında tr/en/de + x-default hreflang header'ları var. Harici Hreflang Tester testi manuel kalır.

### 12. Bing Webmaster Tools'a paralel ekle
- [ ] [bing.com/webmasters](https://www.bing.com/webmasters) → "Import from Google Search Console"
- [ ] Tek tıkla sitemap + mülk taşınır
- [ ] Bing ve ChatGPT (Bing index üzerinden) trafiği için kritik

### 13. Google Analytics 4 ile bağla (varsa)
- [ ] Search Console → **Ayarlar → İlişkilendirmeler**
- [ ] GA4 property'sini bağla → GA4'te "Search Console" raporları aktif olur
- [x] Frontend'te GA4 zaten kurulu mu kontrol: [GoogleAnalytics.tsx](../frontend/src/components/analytics/GoogleAnalytics.tsx)

> Codex canlı kontrolü (2026-05-25): `.env.production` içinde `NEXT_PUBLIC_GA_ID=G-9M6GBB11HP`, `NEXT_PUBLIC_GTM_ID=GTM-W6GL2RB9`; canlı anasayfa HTML'inde GTM etiketi görünüyor. Search Console-GA4 ilişkilendirmesi manuel yapılmalı.

### 14. E-posta bildirim ayarları
- [ ] Search Console → **Ayarlar → Kullanıcı tercihleri → E-posta tercihleri**
- [ ] "Tüm sorunlar" açık olmalı
- [ ] Manuel işlem / güvenlik uyarısı gelirse anında haberdar olursun

---

## 🚨 İleride Hata Çıkarsa — Hızlı Müdahale Rehberi

| Hata | İlk bakılacak yer |
|---|---|
| "Sitemap could not be read" | `curl https://www.bereketfide.com.tr/sitemap.xml` — 200 mü, XML geçerli mi? |
| "Robots.txt blocked" | `robots.ts` disallow listesi yanlışlıkla `/` mi içeriyor? |
| Indekslenme aniden düştü | Son deploy + `robots.ts` + `noIndex` flagleri kontrol |
| LCP kötüleşti | Frontend bundle boyutu, image optimization, Cloudinary lazy loading |
| Spam manuel işlem geldi | Acil: yedek backup, malware tarama, hosting destek |

---

## Referans Dosyalar

- [app/sitemap.ts](../frontend/src/app/sitemap.ts) — Sitemap üretici
- [app/robots.ts](../frontend/src/app/robots.ts) — Robots config
- [seo/helpers.ts](../frontend/src/seo/helpers.ts) — Metadata + canonical builder
- [seo/jsonld.ts](../frontend/src/seo/jsonld.ts) — JSON-LD schema'lar
- [SEO-PLAN.md](./SEO-PLAN.md) — Genel SEO planı
- [LIGHTHOUSE-PLAN.md](./LIGHTHOUSE-PLAN.md) — Performans planı
