# Bereket Fide

**Kurumsal Web Sitesi, Urun Katalogu ve Icerik Yonetim Sistemi**

Bereket Fide icin hazirlanan bu proje; modern kurumsal tanitim, urun gruplarinin duzenli sunumu,
bilgi merkezi icerikleri ve iletisim/talep akislari icin olusturulan Next.js tabanli web platformudur.

**Canli site:** [https://www.bereketfide.com.tr](https://www.bereketfide.com.tr)

---

## Ekran Goruntuleri

### Masaustu Gorunumu

![Bereket Fide — Masaustu](docs/screenshots/bereketfide-desktop.png)

### Mobil Gorunumu

![Bereket Fide — Mobil](docs/screenshots/bereketfide-mobile.png)

---

## Workspace Yapisi

```txt
bereketfide/
  frontend/         <- Next.js 16, port 3030
  backend/          <- Fastify + Drizzle ORM + MySQL, port 8086
  admin_panel/      <- Next.js admin, port 3004
  package.json      <- workspace root
  CLAUDE.md         <- calisma kurallari
  THEMA.md          <- tema kontrati
  PLAN.md           <- uygulama ve icerik plani
  project.portfolio.json
```

---

## Teknoloji Yigini

| Katman   | Teknoloji                                      |
| -------- | ---------------------------------------------- |
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4        |
| Cok dil  | next-intl (TR/EN)                              |
| Veri     | React Query, Zod, React Hook Form              |
| State    | Zustand                                        |
| UI       | Radix UI, Lucide React, Embla Carousel, Sonner |
| Animasyon| Framer Motion                                  |
| Backend  | Fastify, Drizzle ORM, MySQL                    |
| Admin    | React tabanli yonetim paneli                   |
| Deploy   | Nginx, PM2, Let's Encrypt SSL                  |

---

## Ozellikler

- Urun katalogu (liste + detay + galeri)
- TR/EN cok dilli yapi (next-intl)
- Bilgi Bankasi / Haberler
- Galeri sistemi
- Iletisim ve teklif formu
- Token tabanli tema sistemi (basak altini, toprak tonlari)
- Dark / Light mode
- Teknik SEO (canonical, hreflang, JSON-LD, sitemap)
- Admin panel ile icerik yonetimi

---

## Calistirma

Ekosistem kokunden (tercihen): `bun install && bun run build:shared`. Sonra:

```bash
# Frontend (port 3030)
cd frontend && bun install && bun run dev

# Backend (API, port 8086)
cd backend && bun install && bun run dev

# Admin panel (port 3004)
cd admin_panel && bun install && bun run dev
```

---

## Deployment

- **VPS:** Nginx reverse proxy + PM2
- **SSL:** Let's Encrypt (certbot, otomatik yenileme)
- **Domain:** `www.bereketfide.com.tr` (canonical; apex → www yonlendirme)
- **PM2 (ornek isimler):** `bereketfide-frontend`, `bereketfide-backend`, `bereketfide-admin` — portlar Nginx ile uyumlu (`CLAUDE.md`)

---

## Ilgili Dosyalar

| Dosya                      | Icerik                              |
| -------------------------- | ----------------------------------- |
| `CLAUDE.md`              | Calisma kurallari ve marka kontrati |
| `THEMA.md`               | Tema, renk ve tipografi sistemi     |
| `PLAN.md`                | Uygulama ve icerik yol haritasi     |
| `project.portfolio.json` | Proje metadata kaynagi              |
