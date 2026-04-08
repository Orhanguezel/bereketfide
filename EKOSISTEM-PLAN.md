# Bereketfide — Ekosistem Entegrasyon ve Gelistirme Plani

**Tarih:** 29 Mart 2026
**Baglam:** Tarim Dijital Ekosistem kabul edildi. Bereketfide, ekosistemin iki merkez sitesinden biri olarak yeniden konumlandiriliyor.
**Mevcut Durum:** Canli site (bereketfide.com.tr), icerik migrasyonu devam ediyor.

> Bu plan mevcut `PLAN.md`'nin (icerik migrasyonu) **ustune** insa edilir. Icerik esleme islemi (Faz A-D) devam ederken, ekosistem entegrasyonu paralel planlanir.

---

## 1. Bereketfide'nin Ekosistem Icerisindeki Rolu

```
EKOSISTEM
├── Bereketfide (BU PROJE)
│   ├── Fide odakli kurumsal site
│   ├── Icerik hub'i (blog/haberler -> haber portalina besleme)
│   ├── Urun katalogu -> B2B pazaryerine acar
│   └── Sera musteri tabani -> sera SaaS'a yonlendirir
├── VistaSeed (kardes site)
│   ├── Tohum odakli kurumsal site
│   ├── Bayi/uye sistemi (ekosistem auth temeli)
│   └── Siparis sistemi -> B2B pazaryeri cekirdegi
└── Gelecek Platformlar
    ├── Ziraat Haber Portali (Bereketfide blog besler)
    ├── Hal Fiyatlari
    ├── Tarim Ansiklopedisi (iki site birlikte besler)
    ├── Sera SaaS
    └── B2B Pazaryeri
```

**Temel prensip:** Bereketfide kendi basina deger ureten bir kurumsal site olmaya devam edecek, ayni zamanda ekosistem icin icerik ve kullanici akisi saglayacak.

---

## 2. Yapilacak Isler — Oncelik Sirasina Gore

### P0 — Acil (Hafta 1-2)

#### 2.1 Icerik Altyapisi Guclendirilmesi

Mevcut PLAN.md'deki icerik migrasyonu devam ederken, ekosisteme besleme yapacak icerik altyapisi kurulmali.

**2.1.1 Blog/Haberler Bolumunu Guclendir**

Mevcut `/haberler` ve `/blog` route'lari var ama icerik az.

- [ ] Blog icerik kategorileri olustur (admin panelde):
  - `sera-yonetimi` — Sera kurulum, bakim, enerji
  - `fide-bakimi` — Fide yetistirme, sulama, gubreleme
  - `sektor-haberleri` — Tarim sektoru, piyasa, devlet destekleri
  - `mevsimsel-ipuclari` — Aylik ekim/dikim onerileri
  - `teknoloji` — Tarim teknolojisi, IoT, AI
- [x] Blog sayfasinda kategori filtreleme ekle (frontend) — mevcut haberler/blog sayfalarinda var
- [x] Blog makale sayfasina "Ilgili Yazilar" bolumu ekle — RelatedLinks bileseni ile yapildi
- [x] RSS feed endpointi olustur (backend: `GET /api/feed/rss`) — 8 Nisan 2026
  - Bu endpoint gelecekte ziraat haber portalini besleyecek
- [ ] Icerik uretim takvimi olustur: **haftalik 2 makale hedefi** — editorial, teknik degil

**2.1.2 Bilgi Bankasi Sayfasi Ekle**

VistaSeed'de var, Bereketfide'de yok. Ekosistem icin kritik.

- [x] `/bilgi-bankasi` route olustur (frontend) — 8 Nisan 2026
- [x] `/bilgi-bankasi/[slug]` detay sayfasi — 8 Nisan 2026
- [x] Backend: mevcut `customPages` modulu kullanildi (`module_key=bilgi-bankasi`)
- [ ] Icerik turleri (admin panelde girilecek — teknik hazir):
  - Fide yetistirme rehberleri (domates, biber, patlican, salatalik...)
  - Sera kurulum rehberi
  - Sulama ve gubreleme kilavuzlari
  - Hastalik teshis rehberi (gorsel destekli)
- [x] Her bilgi bankasi sayfasinda ilgili urunlere link — RelatedLinks bileseni ile yapildi
- [x] JSON-LD: `HowTo` ve `Article` schema ekle — 8 Nisan 2026

**2.1.3 Ekim Takvimi Sayfasi**

- [x] `/ekim-takvimi` route olustur — 8 Nisan 2026
- [x] Bolgesel secim (7 bolge: Akdeniz, Ege, Marmara, Ic/Dogu/Guneydogu Anadolu, Karadeniz) — 8 Nisan 2026
- [x] Aylik gorunum: hangi fide ne zaman dikilir — 12 sutunlu ay tablosu
- [x] Her fide turune link (urun sayfasi) — slug eslesmesi ile API'den cekiliyor
- [ ] Bu veri gelecekte Sera SaaS ve Verim Tahmini motorunu besleyecek — P3
- [ ] JSON-LD: `Event` veya `Schedule` schema — eksik, eklenecek

---

#### 2.2 Cross-Linking Altyapisi

Ekosistem platformlari arasi link yapisi.

- [ ] Backend: `ecosystem_links` tablosu ekle
  ```
  id, source_platform, source_type, source_id,
  target_platform, target_url, target_title,
  link_type (related/cross-sell/reference),
  is_active, sort_order
  ```
- [ ] Admin panelde: urun/makale duzenlerken "Ekosistem Baglantilari" tab'i
- [ ] Frontend: makale ve urun sayfalarinda "Ekosistemde Ilgili Icerikler" bolumu
- [ ] Baslangicta manuel link, ileride otomatik oneri (AI)

---

#### 2.3 Fiyat Listesi / Sezonluk Kampanya Sayfasi

- [x] `/fiyat-listesi` route olustur — 8 Nisan 2026
- [x] Urun kategorisine gore fiyat tablosu — kategori chip filtreleme ile
- [x] Sezonluk kampanya alani — `bereketfide__fiyat_listesi_notu` site_settings key'i ile yonetilebilir
- [x] "Toplu siparis icin teklif alin" CTA — hem tablo altinda hem sidebar'da
- [ ] Bu sayfa gelecekte Hal Fiyatlari platformuyla entegre olacak — P2

---

### P1 — Kisa Vade (Hafta 2-4)

#### 2.4 SEO Derinlestirme

Mevcut SEO altyapisi guclu. Ekosistem icin genisletilmeli.

- [x] JSON-LD genisletme:
  - [x] Blog makaleler icin `Article` + `speakable` schema — 8 Nisan 2026
  - [x] Bilgi bankasi icin `HowTo` + `Article` schema — 8 Nisan 2026
  - [x] SSS icin `FAQPage` schema — urun detay sayfasina eklendi, 8 Nisan 2026
  - [x] Ekim takvimi icin `Dataset` schema — 8 Nisan 2026
- [x] `llms.txt` guncelle: yeni sayfalar eklendi — 8 Nisan 2026
- [ ] Internal linking stratejisi:
  - [x] Her blog yazisinda ilgili urunlere link — RelatedLinks ile yapildi
  - [x] Her urun sayfasindan ilgili bilgi bankasi makalesine link — 8 Nisan 2026 (knowledgeBasePosts)
  - [x] Footer'da ekosistem platformlari bolumu — 8 Nisan 2026 (VistaSeed + yakinda gelecekler)
- [ ] Sitemap'e yeni route'lari ekle — Next.js otomatik sitemap kontrol edilecek
- [ ] Meta description sablonlari — her sayfada inline tanimli, merkezi sablon yok

#### 2.5 Referanslar / Musteri Hikayeleri Sayfasi

- [x] `/referanslar` route olustur — 8 Nisan 2026
- [x] Sera projeleri, musteri yorumlari, basari hikayeleri — kart grid + liste gorünümü
- [ ] Gorsel galeri ile destekle — mevcut featured_image var, tam galeri entegrasyonu eksik
- [ ] Bu icerik gelecekte Danismanlik Pazaryeri'ni besleyecek — P2
- [x] JSON-LD: `Review` schema — rating varsa otomatik ekleniyor, 8 Nisan 2026

#### 2.6 Newsletter Genisletme

- [x] Mevcut newsletter modulu aktif — shared-backend'den geliyor, admin route'lar kayitli
- [x] Abone segmentasyonu eklendi — 8 Nisan 2026:
  - `urunler` — Urun & Katalog
  - `haberler` — Haberler & Duyurular
  - `bilgi-bankasi` — Tarim Rehberleri
- [x] Backend: `segments` meta JSON alanina kaydediliyor (ALTER gerektirmeden)
- [x] Frontend: NewsletterForm.tsx segment checkbox'lari eklendi
- [ ] Gelecekte ekosistem genelinde ortak newsletter sistemiyle entegre olacak — P3

---

### P2 — Orta Vade (Ay 2-3)

#### 2.7 Content Federation API

Bereketfide icerigini diger ekosistem platformlarina acan API.

- [x] Backend: `GET /api/v1/ecosystem/content` endpoint'i olusturuldu — 8 Nisan 2026
  - `?type=blog|product|knowledge|event&locale=tr|en&limit=1-20&category=...`
  - Response: `{ source, type, locale, items: [{ title, slug, excerpt, image, url, publishedAt }] }`
- [ ] Rate limiting: IP bazli — Fastify rate-limit plugin ile eklenecek (P2 tamamlaninca)
- [ ] API key authentication — site_settings uzerinden ECOSYSTEM_API_KEY ile eklenebilir
- [x] Desteklenen icerik tipleri: blog, product, knowledge, event — 8 Nisan 2026
- [x] Cache: in-memory 5 dk TTL — 8 Nisan 2026

#### 2.8 Urun Verisi Zenginlestirme

Mevcut urun modulu standart e-ticaret yapisi. Tarimsal metadata eklenmeli.

- [ ] Backend `products` schema'ya tarimsal alanlar ekle:
  ```
  botanical_name      VARCHAR(255)   — Latince isim
  planting_seasons    JSON           — ["ilkbahar", "sonbahar"]
  harvest_days        INT            — Hasat suresi (gun)
  climate_zones       JSON           — ["akdeniz", "ege"]
  soil_types          JSON           — ["kumlu", "killi"]
  water_need          ENUM           — low/medium/high
  sun_exposure        ENUM           — full/partial/shade
  min_temp            DECIMAL        — Minimum sicaklik (C)
  max_temp            DECIMAL        — Maksimum sicaklik (C)
  ```
- [ ] Admin panelde urun formuna "Tarimsal Bilgiler" tab'i ekle
- [ ] Frontend urun detay sayfasinda bu bilgileri goster
- [ ] Bu veriler gelecekte Sera SaaS ve Verim Tahmini motorunda kullanilacak

#### 2.9 Ortak Auth Hazirlik

Ekosistem SSO icin Bereketfide tarafindaki hazirlicklar.

- [x] Mevcut `auth` modulu incelendi — 8 Nisan 2026
  - `phone`, `ecosystem_id`, `email_verified` zaten shared-backend schema'da mevcut
  - `avatar_url` profiles tablosunda mevcut
  - Seed SQL'de eksik olan `ecosystem_id`, `rules_accepted_at` eklendi
- [x] users seed SQL (001_auth_schema.sql) Drizzle schema ile senkronize edildi — 8 Nisan 2026
- [ ] Email dogrulama akisi ekle — opsiyonel, ileride eklenecek
- [ ] Bu alanlar VistaSeed ile ayni semada tutulmali — VistaSeed'in seed SQL'i kontrol edilecek

---

### P3 — Uzun Vade (Ay 3-6)

#### 2.10 Ortak Paketlere Gecis

Ekosistem `packages/` yapisina kademeli katilim.

- [ ] `packages/shared-types/` — Ortak TypeScript tipleri kullanmaya basla
  - `EcosystemProduct`, `EcosystemUser`, `ContentFeedItem`
- [ ] `packages/shared-config/` — ESLint, Tailwind base tokens, TS config
- [ ] `packages/shared-backend/` — Ortak Fastify plugin'ler (auth, storage, audit)
  - Ilk aday: `storage` modulu (Cloudinary) — iki projede neredeyse ayni

#### 2.11 Admin Panel Ortaklastirma

- [ ] Shadcn UI bilesenleri `packages/shared-ui/admin/` altina tasima oncesi envanter
  - data-table, form-builder, json-editor, sidebar ortak mi?
- [ ] RTK Query base-api yapilandirmasini standartlastir
- [ ] Tema preset'lerini paylasimli yap (bereketfide ve vistaseed ayri preset)

#### 2.12 Docker Compose Entegrasyonu

- [ ] Mevcut PM2 yapisini koruyarak Docker alternatifi hazirla
- [ ] `Dockerfile` olustur (frontend, backend)
- [ ] `docker-compose.yml` ekle (dev ortami icin)
- [ ] Production'da PM2 devam edecek, Docker sadece dev/staging

---

## 3. Icerik Uretim Takvimi

Ekosistem icerikle buyuyecek. Teknik altyapi ne kadar iyi olursa olsun, icerik uretilmezse trafik gelmez.

### Haftalik Icerik Plani

| Gun | Icerik Tipi | Konu Ornegi |
|-----|-------------|-------------|
| Pazartesi | Blog makalesi (teknik) | "Sera Sicaklik Kontrolu: 5 Kritik Hata" |
| Persembe | Blog makalesi (mevsimsel) | "Nisan Ayi Fide Dikim Rehberi" |

### Aylik Icerik Hedefleri

| Ay | Blog | Bilgi Bankasi | Ekim Takvimi | Referans |
|----|------|---------------|--------------|----------|
| Ay 1 | 8 makale | 10 rehber | 1 bolge | 3 hikaye |
| Ay 2 | 8 makale | 10 rehber | 2 bolge | 3 hikaye |
| Ay 3 | 8 makale | 10 rehber | 2 bolge | 3 hikaye |
| **3 Ay Toplam** | **24 makale** | **30 rehber** | **5 bolge** | **9 hikaye** |

### Icerik Kaynaklari

- Bereketfide uzman kadrosu (sera muhendisleri, ziraat muhendisleri)
- Mevcut kaynak sitedeki icerikler (modernize edilecek)
- Sektor haberleri (RSS/API ile toplanacak, editoryal yorumla)
- VistaSeed bilgi bankasi ile cross-reference

---

## 4. VistaSeed ile Entegrasyon Noktalari

| Alan | Bereketfide | VistaSeed | Entegrasyon |
|------|-------------|-----------|-------------|
| Urunler | Fide | Tohum | Cross-link: "Bu fidenin tohumu" |
| Blog | Sera/fide odakli | Tohum bilimi odakli | RSS beslemesi, cross-post |
| Bilgi Bankasi | Yetistirme rehberleri | Ekim rehberleri | Ortak ansiklopedi temeli |
| Kullanicilar | Basit auth | Bayi + uye sistemi | Ortak users tablosu (SSO) |
| Siparis | Teklif formu | Siparis sistemi | B2B pazaryeri temeli |
| Newsletter | Genel bülten | Bayi bulteni | Ortak subscriber havuzu |

### Cross-Link Ornekleri

```
Bereketfide urun sayfasi: "Cherry Domates Fidesi"
  -> VistaSeed: "Cherry Domates Tohumu Cesitleri"
  -> [Gelecek] Ansiklopedi: "Domates Yetistirme Rehberi"
  -> [Gelecek] Hal Fiyatlari: "Domates Guncel Fiyatlari"

Bereketfide blog: "Sera Sicaklik Kontrolu Rehberi"
  -> VistaSeed Bilgi Bankasi: "Sicakliga Dayanikli Tohum Cesitleri"
  -> [Gelecek] Sera SaaS: "Sicaklik Monitoru Ozelligi"
  -> [Gelecek] Haber Portali: otomatik besleme
```

---

## 5. Teknik Notlar

### Mevcut Yapiyi Bozmamak Icin Kurallar

1. **Canli siteyi etkileme.** Yeni sayfalar `/bilgi-bankasi`, `/ekim-takvimi`, `/fiyat-listesi` — mevcut route'larla cakismaz.
2. **Backend'e yeni modul eklerken** mevcut `routes.ts` register paternini takip et.
3. **DB migration'lari** mevcut tablolari degistirmemeli (yeni kolon eklemek OK, tablo silmek/rename YASAK).
4. **Admin panel'e yeni sayfa eklerken** sidebar-items.ts'e ekle, mevcut navigasyonu bozma.
5. **SEO kaybi onle.** Mevcut indekslenmis URL'ler korunmali. Yeni sayfalar ekleniyor, mevcut sayfalar degismiyor.

### Port ve Endpoint Plani

| Servis | Port | Degisiklik |
|--------|------|------------|
| Frontend | 3030 | Degisiklik yok |
| Backend | 8086 | Degisiklik yok |
| Admin | 3004 | Degisiklik yok |
| Yeni endpoint'ler | 8086 | Mevcut backend'e ekleniyor |

### Yeni Backend Endpoint'ler

```
GET  /api/bilgi-bankasi              — Bilgi bankasi listesi
GET  /api/bilgi-bankasi/:slug        — Bilgi bankasi detay
GET  /api/ekim-takvimi               — Ekim takvimi (bolge filtreli)
GET  /api/fiyat-listesi              — Fiyat listesi (kategori filtreli)
GET  /api/feed/rss                   — RSS feed (blog + bilgi bankasi)
GET  /api/v1/ecosystem/content       — Ekosistem icerik API (P2)
POST /api/newsletter/subscribe       — Newsletter kayit (segment destekli)
```

---

## 6. Basari Metrikleri

| Metrik | Baslangic (Simdi) | 1 Ay | 3 Ay | 6 Ay |
|--------|-------------------|------|------|------|
| Blog makale sayisi | ~5 | 13 | 29 | 53 |
| Bilgi bankasi sayfa sayisi | 0 | 10 | 30 | 50 |
| Organik trafik (aylik) | Baz | +20% | +80% | +200% |
| Cross-platform link sayisi | 0 | 10 | 50 | 150 |
| Newsletter abone | Baz | +50 | +200 | +500 |
| Core Web Vitals (LCP < 2.5s) | ? | %90 | %95 | %95 |
| RSS feed tuketici sayisi | 0 | 0 | 1 (haber portali) | 3 |

---

*Bu plan, Bereketfide'nin ekosistem icerisindeki stratejik rolunu tanimlar ve somut uygulama adimlari sunar. Mevcut PLAN.md'deki icerik migrasyonu isleri bu planla celiskmez, paralel yurutulur.*
