# Bereket Fide — Calisma Kurallari

## Proje Tanimi

Bereket Fide icin gelistirilen kurumsal web sitesi, urun katalog yapisi ve icerik yonetim sistemi.
Domain: `https://www.bereketfide.com.tr`
Marka yonu: temiz, dogal, guven veren, basak-altin tonlu kurumsal gorunum.

## @agro/shared-backend Entegrasyonu

Bu proje `@agro/shared-backend` workspace paketini kullanacak. Gecis planlaniyor.

```bash
# Calismaya baslamadan once (root dizinde):
bun install && bun run build:shared

# Sonra proje backend'inde:
cd projects/bereketfide/backend && bun run dev
```

- Detayli rehber: `packages/KULLANIM.md`
- Ortak modul degistiginde: root'tan `bun run build:shared` calistir

### Proje-Spesifik Moduller (bu repoda kalacak)
offer, services, menuItems, comments

## Workspace Yapisi

```txt
bereketfide/
  frontend/     <- Next.js 16, TypeScript, Tailwind CSS v4 (port 3030)
  backend/      <- Fastify, Drizzle ORM, MySQL (port 8086)
  admin_panel/  <- React admin paneli (port 3004)
```

## Adlandirma ve Marka

- Proje slug: `bereketfide`
- Tema template: `bereket-harvest`
- Intent: `clean-natural-wheat-gold`
- Renk paleti: basak altini, kirik krem, toprak/antrasit
- Tipografi: Syne (baslik) + DM Sans (body)

## Calisma Kurallari

1. Portlar sabit kabul edilir: frontend `3030`, backend `8086`, admin `3004`
2. `project.portfolio.json` tek dogru metadata kaynagidir
3. Once Bereket Fide icerigi yerlestirilir, sonra eski referans sabitleri temizlenir
4. Component icinde raw hex kullanimi yerine semantic token tercih edilir
5. `dark:` odakli tasarim mantigi yerine token tabanli mode sistemi kullanilir
6. Public sitede gereksiz moduller hemen silinmez; once gizleme/pasiflestirme dusunulur

## Icerik Modulleri

Birinci oncelik:
- Anasayfa
- Kurumsal
- Urunler
- Bilgi Merkezi
- Insan Kaynaklari
- Iletisim

Yonetilecek temel moduller:
- urunler
- kategoriler
- sayfalar
- blog/haberler
- site ayarlari
- menu
- footer
- iletisim kayitlari

## SEO Kontrati

- Her sayfa icin benzersiz metadata olacak
- Canonical, OG ve temel sosyal meta alanlari duzenli olacak
- Urun, kategori ve kurumsal sayfalar temiz URL yapisina sahip olacak
- Query tabanli filtre sayfalari gerekirse `noindex` alacak
- Domain: `https://www.bereketfide.com.tr`

Oncelikli SEO alanlari:
- urun kategori sayfalari
- urun detay sayfalari
- kurumsal guven sayfalari
- bilgi merkezi / haber icerikleri

## API Mantigi

Kural:
- endpoint adlari simdilik mevcut iskelete gore korunabilir
- ama icerik anlami insaattan urune/fideye evriltilir
- `projects` mantigi zamanla `products` merkezli sade yapıya indirgenir

## Deployment

- Frontend PM2: `bereketfide-frontend`
- Backend PM2: `bereketfide-backend`
- Nginx config daha sonra Bereket Fide domainine gore yeniden adlandirilacak
- SSL: Let's Encrypt / Certbot

## Marka Kontrol Sorulari

Bir degisiklik yaparken su sorulari sor:
- Bu ekran Bereket Fide gibi gorunuyor mu?
- Bu metin insaat dili mi, yoksa fide/urun dili mi?
- Bu modul gercekten gerekli mi?
- Bu sayfa SEO acisindan arama niyetine hizmet ediyor mu?
