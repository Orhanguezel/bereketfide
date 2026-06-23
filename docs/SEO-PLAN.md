# Bereket Fide — Technical SEO Plan

## Audit Summary

| Item | Status | Priority |
|------|--------|----------|
| robots.txt | OK | - |
| sitemap.xml | OK | - |
| Canonical / hreflang | OK | - |
| OG / Twitter Cards | OK | - |
| Favicon / Apple Touch Icon | OK | - |
| Page Titles | OK | - |
| JSON-LD Schemas | OK | - |
| Image SEO (alt/caption helpers) | OK | - |
| Analytics (GA4/GTM) | OK (env var dependent) | - |
| Search page noIndex | MISSING | HIGH |
| Generic anchor text (aria-label) | PARTIAL | MEDIUM |
| 404 page locale link | HARDCODED | LOW |
| Author meta in Article schema | MISSING | LOW |

## Action Items

### 1. Search Page — noIndex + metadata [HIGH]
- File: `frontend/src/app/[locale]/arama/page.tsx`
- Add `generateMetadata()` with `noIndex: true` and `robots: { index: false, follow: true }`
- Query-driven sayfalar Google'da duplicate content riski oluşturur

### 2. Generic Link Text — aria-label [MEDIUM]
- "Tümünü Gör", "Devamını Oku", "Daha Fazla" gibi linkler anlamsal bağlam taşımıyor
- Her generic link'e `aria-label` eklenmeli: `<Link aria-label="Tüm ürünleri gör">Tümünü Gör</Link>`
- Dosyalar: page.tsx (home), ProjectFeed.tsx, hizmetler/page.tsx

### 3. 404 Page — Dynamic locale [LOW]
- File: `frontend/src/app/not-found.tsx`
- Hardcoded `/tr` → dinamik locale

### 4. Article Schema — author field [LOW]
- JSON-LD article schema'sında author alanı eksik
- `jsonld.ts` içinde article builder'a author eklenmeli
