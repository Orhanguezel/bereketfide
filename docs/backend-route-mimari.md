# Backend Route Mimari

Bu projede route kayitlari iki dosyaya ayrilir:

- `backend/src/routes/shared.ts`
  Ortak paketten gelen moduller burada kaydedilir.
  Ornek: `auth`, `menuItems`, `newsletter`, `comments`, `offer`, `orders`, `dealerFinance`, `services`

- `backend/src/routes/project.ts`
  Sadece Bereketfide'ye ozel moduller burada tutulur.
  Mevcut durumda: `feed`, `ecosystem`, `dashboard`

Uygulama akisinda siralama:

1. `backend/src/app.ts` Fastify instance olusturur.
2. `/api/v1` altinda once `registerSharedAdmin` ve `registerProjectAdmin` kaydolur.
3. Ardindan `registerSharedPublic` ve `registerProjectPublic` kaydolur.

Prensip:

- Baska projelerde de kullanilacak moduller `@agro/shared-backend` icine tasinir.
- Bereketfide markasina veya is akisina ozel kalanlar yerel repo icinde kalir.
- Yeni bir modulu eklerken once shared mi project-specific mi olduguna karar verilir.

Kural:

- Shared modulse `shared.ts` icine eklenir.
- Sadece Bereketfide'ye ozelse `project.ts` icine eklenir.
