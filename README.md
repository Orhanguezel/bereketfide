# Bereket Fide

**Kurumsal Web Sitesi, Urun Katalogu ve Icerik Yonetim Sistemi**

Bereket Fide icin hazirlanan bu proje; modern kurumsal tanitim, urun gruplarinin duzenli sunumu,
bilgi merkezi icerikleri ve iletisim/talep akislari icin olusturulan Next.js tabanli web platformudur.

Domain: `https://www.bereketfide.com.tr`

---

## Workspace Yapisi

```txt
bereketfide/
  frontend/         <- Next.js 16, port 3030
  backend/          <- Fastify + Drizzle ORM + MySQL
  admin_panel/      <- React admin paneli
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
| Cok dil  | next-intl                                      |
| Veri     | React Query, Zod, React Hook Form              |
| State    | Zustand                                        |
| UI       | Radix UI, Lucide React, Embla Carousel, Sonner |
| Backend  | Fastify, Drizzle ORM, MySQL                    |
| Admin    | React tabanli yonetim paneli                   |
| Deploy   | Nginx, PM2, SSL                                |

---

## Proje Yonu

Bu proje icin hedef:

- Bereket Fide'nin mevcut site icerigini modernlestirmek
- urun/fide odakli temiz bir bilgi mimarisi kurmak
- SEO ve performans odakli sayfa yapilari hazirlamak
- yonetilebilir bir kurumsal icerik yapisi olusturmak

Tasarim karakteri:

- basak altini odakli marka dili
- kirik krem ve toprak tonlari
- sade, temiz ve guven veren kurumsal gorunum

---

## Calistirma

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && npm install && npm run dev

# Admin panel
cd admin_panel && npm install && npm run dev
```

---

## Guncel Oncelikler

- Bereket Fide marka ve icerik katmanini yerlestirmek
- urun katalog mantigini netlestirmek
- kurumsal sayfalari kaynak siteden dogru bicimde tasimak

---

## Ilgili Dosyalar

| Dosya                      | Icerik                              |
| -------------------------- | ----------------------------------- |
| `CLAUDE.md`              | Calisma kurallari ve marka kontrati |
| `THEMA.md`               | Tema, renk ve tipografi sistemi     |
| `PLAN.md`                | Uygulama ve icerik yol haritasi     |
| `project.portfolio.json` | Proje metadata kaynagi              |

---

*Bu workspace icindeki referans mimari baz alinarak baslatilmistir; proje yonu tamamen Bereket Fide'ye gore yeniden sekillenmektedir.*
