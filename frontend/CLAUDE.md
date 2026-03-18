# CLAUDE.md — Bereket Fide Frontend

## Proje Özeti

`bereketfide-frontend`, Bereket Fide için geliştirilen Next.js tabanlı kurumsal tanıtım ve ürün katalog frontend'idir.
Ana hedefler:

- Temiz, doğal, güven veren kurumsal tasarım
- Teknik SEO uyumlu sayfa yapısı
- Çok dilli içerik (TR/EN)
- Token tabanlı tema yönetimi (bereket-harvest)
- Dark / Light mode desteği

## Sayfa Yapısı (URL Rotaları)

```
/[locale]/                → Anasayfa
/[locale]/urunler         → Ürün katalog listesi
/[locale]/urunler/[slug]  → Ürün detay
/[locale]/galeri           → Galeri
/[locale]/galeri/[slug]    → Galeri detay
/[locale]/haberler         → Blog / Haberler
/[locale]/haberler/[slug]  → Blog yazı detay
/[locale]/hakkimizda       → Hakkımızda
/[locale]/iletisim         → İletişim
/[locale]/teklif           → Talep formu
/[locale]/legal/[slug]     → Yasal sayfalar
```

## Tema Kontratı

- Template: `bereket-harvest`
- Intent: `clean-natural-wheat-gold`
- Referans: `/THEMA.md` (proje kökünde)
- Kaynak: `src/styles/globals.css`, `src/theme/templates.ts`

### Kural Özeti

- Component dark/light bilmez — `dark:bg-*` YASAK
- Semantic token kullan: `bg-[var(--color-bg)]`
- Dark section: `surface-dark-heading`, `surface-dark-text`, `surface-dark-panel`
- Brand rengi başak altını: `--color-brand = var(--gold-500)` (#b8a98a)
- Tipografi: Syne (--font-heading) + DM Sans (--font-body)

## Zorunlu Çalışma Kuralları

- Her yeni sayfa veya section önce mevcut SEO pattern'i ile hizalanır.
- Metadata, canonical, hreflang, robots ve JSON-LD mantığı helper seviyesinde tekrar kullanılır.
- Query parametreli indeks riski olan URL'lerde canonical temiz path'e döner; gerekiyorsa `noindex,follow` kullanılır.
- Her locale aynı component pattern'ini kullanır; locale bazlı fark yalnızca veri ve mesaj katmanında olur.

## SEO Pattern Kontratı

Her indekslenebilir sayfa için aşağıdakiler kontrol edilmeden iş tamamlanmış sayılmaz:

- `generateMetadata` — `buildPageMetadata()` kullanılır (`src/seo/helpers.ts`)
- canonical
- hreflang + `x-default`
- uygun `robots`
- Open Graph / Twitter alanları
- JSON-LD şeması (sayfa tipine göre)
- Boş veri durumunda kontrollü fallback UI

**Varsayılan pattern:**

```ts
// Listing sayfası
buildPageMetadata({ locale, pathname: '/urunler', title, description })

// Detay sayfası
buildPageMetadata({ locale, pathname: '/urunler/[slug]', title, description, ogImage })

// Filtreli / query-driven sayfa
buildPageMetadata({ ..., noIndex: true })
```

**JSON-LD şemaları** (`src/seo/jsonld.ts`):

- Anasayfa: `Organization` + `LocalBusiness`
- Ürün detay: `Product` + `BreadcrumbList`
- İletişim: `LocalBusiness` (adres, tel, openingHours)

## API Endpoint Şablonu

```
GET /api/products?item_type=bereketfide&locale=tr&is_active=1
GET /api/products/by-slug/[slug]?item_type=bereketfide&locale=tr
GET /api/categories?module_key=bereketfide&locale=tr
GET /api/galleries?module_key=bereketfide&locale=tr
GET /api/custom_pages?module_key=bereketfide_blog&locale=tr
GET /api/site_settings/[key]?prefix=bereketfide__
```

## Media SEO Kontratı

- `alt` metni title-only fallback olarak bırakılmaz; `src/lib/media-seo.ts` içindeki helper ile anlamsal fallback üretilir.
- `caption` varsa title tekrar etmez.
- Görsel `width` ve `height` API'den geliyorsa kullanılır; gelmiyorsa tek bir merkezi fallback uygulanır.
- Yeni görseller kebab-case dosya adı ile yüklenir: `domates-fidesi-detay-01.jpg`

## Test

```bash
npm run build          # Build kontrol
npm run type-check     # TypeScript kontrol
npm run test:theme     # Tema token kontrol (raw hex, bg-white, dark: yok)
npm run test:seo       # SEO smoke test (canonical, hreflang, robots, sitemap)
npm run test:media     # Media alt/caption kontrol
npm run audit:crawl    # Tam site tarama raporu
npm run audit:lighthouse # Lighthouse CI
```

## Kritik Dosyalar

| Dosya                            | Amaç                    |
| -------------------------------- | ----------------------- |
| `src/styles/globals.css`         | Renk token'ları         |
| `src/theme/templates.ts`         | Template adı            |
| `src/lib/utils.ts`               | SITE_URL, API_BASE_URL  |
| `src/seo/helpers.ts`             | buildPageMetadata()     |
| `src/seo/jsonld.ts`              | JSON-LD builder'ları    |
| `src/lib/navigation-fallback.ts` | Fallback nav linkleri   |
| `public/locales/tr.json`         | TR çeviriler            |
| `public/locales/en.json`         | EN çeviriler            |

## Delivery Kuralı

Aşağıdaki dosyalar birbirinden kopuk güncellenmez:

- `CLAUDE.md`
- `PLAN.md` (proje kökünde)
- `THEMA.md` (proje kökünde)
- `src/styles/globals.css`
- `src/theme/templates.ts`
