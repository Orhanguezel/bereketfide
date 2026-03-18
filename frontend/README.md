# Bereket Fide Frontend

**Bereket Fide — Kurumsal Web Sitesi**

Next.js tabanlı kurumsal tanıtım ve ürün katalog platformu.

Domain hedefi: `https://www.bereketfide.com.tr`

---

## Workspace Yapısı

```
bereketfide/
  frontend/           <- bu repo
    src/
      app/[locale]/   <- App Router, tüm rotalar locale altında
        urunler/      <- ürün katalog (liste + detay)
        galeri/        <- galeri (liste + detay)
        haberler/      <- haberler/blog (liste + detay)
        hakkimizda/    <- hakkımızda
        iletisim/      <- iletişim
        teklif/        <- talep formu
        legal/[slug]/  <- yasal sayfalar
      features/       <- domain feature modülleri
      components/     <- UI, layout, seo, widgets
      seo/            <- JSON-LD builder'ları, metadata helper'ları
      theme/          <- token-first tema sistemi
      styles/         <- globals.css, semantic token tanımları
      lib/            <- shared yardımcı fonksiyonlar
    scripts/          <- SEO ve tema smoke test script'leri
```

---

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS v4 |
| Çok dil | next-intl (TR / EN) |
| Veri | React Query (@tanstack/react-query) |
| Form | React Hook Form + Zod |
| State | Zustand |
| UI | Radix UI, Lucide React, Embla Carousel, Sonner |

---

## Çalıştırma

```bash
npm install
npm run dev        # port 3030
npm run build
npm run start      # port 3030
```

---

## Test ve Audit Komutları

```bash
npm run type-check          # TypeScript kontrolü
npm run lint                # ESLint
npm run test:theme          # Semantic token smoke test
npm run test:seo            # SEO smoke test (canonical, hreflang, robots)
npm run test:media          # Medya SEO contract kontrolü
npm run audit:crawl         # Tam crawl raporu
npm run audit:lighthouse    # Lighthouse CI SEO assertion
```

---

## Tema Sistemi

Token-first tema yapısı kullanılır.

- Template: `bereket-harvest`
- Intent: `clean-natural-wheat-gold`
- Kaynak: `src/styles/globals.css`, `src/theme/templates.ts`
- Renk paleti: başak altını (#b8a98a), kırık krem (#ffffff), toprak/antrasit (#1e1c1a)
- Tipografi: Syne (başlık) + DM Sans (body)

---

## SEO Yapısı

Her indekslenebilir sayfa için zorunlu set:

- `generateMetadata` (title, description, canonical, hreflang, OG, Twitter)
- `x-default` alternate link
- Uygun `robots` direktifi
- JSON-LD (Organization, Product, Breadcrumb, LocalBusiness)

Helper: `buildPageMetadata({ locale, pathname, title, description, ogImage?, noIndex? })`

---

## İlgili Dosyalar

| Dosya | İçerik |
|---|---|
| `CLAUDE.md` | Çalışma kuralları, SEO pattern contract, tema token contract |
| `ecosystem.config.cjs` | PM2 process konfigürasyonu |
| `project.portfolio.json` | Tek doğru metadata kaynağı |
