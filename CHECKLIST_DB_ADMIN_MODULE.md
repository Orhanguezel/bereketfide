# DB Admin Modülü — Ekosistem-Ortak Refactor + Bereketfide Entegrasyon

**Bağlam.** VistaSeeds'te `modules/db_admin` altında çalışan "Veritabanı Yönetimi"
sayfası (snapshot al/restore, modül bazlı export/import, schema validation, full
SQL dump) şu an Bereketfide'de **yok**. Bereketfide'de boş bir `db/` klasörü
kalıntısı var ama içi tamamen boş.

**Strateji (DRY kuralı).**
- Backend ortak kodu `packages/shared-backend/modules/db_admin/` altına
  taşınır. Snapshot, export/import, validation — hepsi ortak.
- Proje-spesifik olan tek şey **modül manifest'i** (hangi tablolar dahil).
  Her projede kendi `manifest.ts` dosyası kalır.
- `registerDbAdmin`, manifest'i parametre olarak alan bir factory olur.
- VistaSeeds de bu ortak pakete yönlendirilir; kendi `modules/db_admin/`
  altındaki ortak dosyalar silinir, yalnız `manifest.ts` kalır.

**Son güncelleme.** 2026-04-20

---

## Faz 0 — Keşif (TAMAMLANDI)

- [x] VistaSeeds backend `db_admin` yapısı incelendi (6 dosya, ~1520 satır)
- [x] Admin panel UI + integrations (7 dosya, ~894 satır) incelendi
- [x] `moduleManifest.ts` ekosistem standart tablolarına uygun yazılmış
  (products, categories, library, storage, users, etc.) — Bereketfide'de
  büyük çoğunluğu aynen geçerli, `comments`/`gallery`/`references`/`audit`/
  `inventory`/`orders`/`dealers` eklemesi gerekiyor.
- [x] Bereketfide'de hiçbir bağımlılık (hook, endpoint, helper) yok.

---

## Faz 1 — packages/shared-backend/modules/db_admin (ortak altyapı)

**Hedef:** Tek kaynak, her ekosistem projesi manifest'i parametre olarak verip
aynı sistemi kullanabilsin.

- [ ] Dizin oluştur: `packages/shared-backend/modules/db_admin/`
- [ ] `types.ts` — ortak tipler (`ModuleManifest`, `SnapshotMeta`, `ImportResult`)
- [ ] `helpers.ts` — VistaSeeds'tekini olduğu gibi kopyala (390 satır, DB dump/restore file I/O, env-driven)
- [ ] `admin.controller.ts` — controller fonksiyonları (manifest parametre yerine
  `req.server.dbAdminManifest` gibi decorator üzerinden okur)
- [ ] `moduleExportImport.controller.ts` — manifest-driven, aynı decorator pattern
- [ ] `moduleValidation.controller.ts` — aynı
- [ ] `admin.routes.ts` — factory: `createDbAdminRoutes(manifest)` fn döner; bu fn
  Fastify plugin'i register eder ve `fastify.decorate('dbAdminManifest', manifest)` ile inject eder
- [ ] `index.ts` — barrel: `createDbAdminRoutes`, `ModuleManifest`, helper types

**Kabul kriteri:** bereketfide veya vistaseeds tek satırla import edip
`app.register(createDbAdminRoutes(MANIFEST))` ile çalıştırabiliyor.

---

## Faz 2 — Bereketfide manifest.ts (proje-özel)

- [ ] `projects/bereketfide/backend/src/modules/db_admin/manifest.ts` oluştur
- [ ] Ortak modüller (VistaSeeds'teki manifest'i baz al): products, categories,
  subcategories, services, faqs, contacts, newsletter, email_templates,
  custom_pages, menuitem, slider, footer_sections, library, reviews, users,
  storage
- [ ] Bereketfide-özel modüller ekle:
  - `comments` → `blog_comments`
  - `gallery` → `gallery`, `gallery_i18n`, `gallery_images`
  - `references` → `references`, `references_i18n`
  - `audit` → `audit_request_logs`, `audit_auth_events`, `audit_events`
  - `inventory` → `inventory`, `inventory_movements`
  - `orders` → `orders`, `order_items`, `order_status_history`
  - `dealers` → `dealers`, `dealer_finance`
  - `payment_attempts` → `payment_attempts`
  - `offers` → `offers`, `offer_number_counters`
- [ ] Her modül için `tablesInOrder` (FK sırasıyla parent → child) ve
  `truncateInOrder` (tersine)
- [ ] Bereketfide'de olmayan modülleri **dahil etme** (wallet, jobApplications,
  jobListings, popups, sellers → vistaseeds'e özel)

**Kabul kriteri:** `validate` endpoint'i manifest'teki tüm tabloların DB'de
mevcut olduğunu onaylar.

---

## Faz 3 — Bereketfide Backend Integration

- [ ] `backend/src/routes/shared.ts` veya `routes/project.ts`:
  ```ts
  import { createDbAdminRoutes } from '@agro/shared-backend/modules/db_admin';
  import { BEREKETFIDE_DB_MODULES } from '@/modules/db_admin/manifest';
  // admin-scope içinde:
  await adminApi.register(createDbAdminRoutes(BEREKETFIDE_DB_MODULES));
  ```
- [ ] Env gereksinimleri doğrula (DB_HOST/PORT/NAME/USER/PASS snapshot için gerekli)
- [ ] `LOCAL_STORAGE_ROOT` altında `db-snapshots/` dizini oluşacağını garanti et
- [ ] Swagger / OpenAPI `/admin/db/*` endpoint'leri görünsün

**Kabul kriteri:** Canlı `GET /api/v1/admin/db/snapshots` 200 döner (boş dizi),
`GET /api/v1/admin/db/modules/validate` 200 döner.

---

## Faz 4 — Bereketfide Admin Panel UI

### 4.1 Integrations
- [ ] `admin_panel/src/integrations/endpoints/admin/db-admin-endpoints.ts` —
  VistaSeeds'tekini kopyala (120 satır, RTK query endpoints)
- [ ] `admin_panel/src/integrations/shared/db-admin/` — klasör oluştur:
  - `db-admin-types.ts` (84 satır)
  - `db-admin-config.ts` (67 satır) — manifest'le TEKRAR — bu da ortak olabilir, ancak admin panel'de kalsa sorun yok çünkü admin UI katmanı
  - `index.ts` barrel (30 satır)
- [ ] `integrations/shared.ts` re-exports güncelle
- [ ] `integrations/hooks.ts` re-exports güncelle

### 4.2 Page
- [ ] `admin_panel/src/app/(main)/(admin-pages)/(admin)/db-admin/` dizini oluştur
  - `page.tsx` (2 satır)
  - `db-admin.tsx` (4 satır)
  - `_components/db-admin-client.tsx` (588 satır, Path + hook adapt)
- [ ] Mevcut boş `admin_panel/src/app/(main)/(admin-pages)/(admin)/db/` klasörünü sil

### 4.3 Path Adapt
- [ ] `@/app/(main)/admin/_components/common/use-admin-t` →
  `@/app/(main)/(admin-pages)/_components/common/useAdminT`
  (bereketfide'deki import path)

**Kabul kriteri:** Bereketfide admin panel'inde `/admin/db-admin` sayfası açılır,
tabs (Snapshots, Import, Modules, Validation) render edilir, endpoint'ler
yanıt verir.

---

## Faz 5 — Sidebar + Locale

- [ ] `admin_panel/src/navigation/sidebar/sidebar-items.ts`:
  - `AdminNavItemKey` type'ına `db_admin` ekle
  - `adminNavConfig` içinde `system` grubuna ekle: `{ key: 'db_admin', url: '/db-admin', icon: Database }`
  - `FALLBACK_TITLES`: `db_admin: 'Veritabanı Yönetimi'`
  - Mevcut `db` key'ini kaldır (eski kalıntı, sidebar'da zaten yok)
- [ ] `src/locale/tr.json`: `admin.dashboard.items.db_admin: 'Veritabanı Yönetimi'` + `admin.dbAdmin.*` tree (header, tabs, messages)
- [ ] `src/locale/en.json`: eşdeğer
- [ ] `src/locale/de.json`: eşdeğer

**Kabul kriteri:** Sidebar'da "Sistem & Ayarlar" altında "Veritabanı Yönetimi"
linki görünür, tıklayınca sayfa açılır.

---

## Faz 6 — VistaSeeds Refactor (DRY)

- [ ] `projects/vistaseeds/backend/src/modules/db_admin/` içindeki
  `admin.controller.ts`, `admin.routes.ts`, `helpers.ts`,
  `moduleExportImport.controller.ts`, `moduleValidation.controller.ts`
  dosyalarını SİL (ortak pakette var)
- [ ] `modules/db_admin/manifest.ts` kalır (VistaSeeds-özel modül listesi; var olan
  `moduleManifest.ts` → yeniden adlandırılır)
- [ ] `routes/project.ts` import'ları güncelle:
  ```ts
  import { createDbAdminRoutes } from '@agro/shared-backend/modules/db_admin';
  import { VISTASEEDS_DB_MODULES } from '@/modules/db_admin/manifest';
  await adminApi.register(createDbAdminRoutes(VISTASEEDS_DB_MODULES));
  ```
- [ ] Local VistaSeeds backend build + endpoint testi

**Kabul kriteri:** VistaSeeds canlı endpoint'leri aynı şekilde çalışır,
kod tekrarı sıfır.

---

## Faz 7 — Build + Test + Deploy

### 7.1 Local
- [ ] `cd packages && git add -A && git commit` (local-only repo)
- [ ] Root'tan: `bun run build:shared` (shared-backend dist rebuild)
- [ ] Bereketfide backend: `cd projects/bereketfide/backend && bun run build`
- [ ] Bereketfide admin panel: `cd projects/bereketfide/admin_panel && bun run build`
- [ ] VistaSeeds backend build (regresyon)

### 7.2 VPS Deploy
- [ ] packages/shared-backend source scp (controller.ts, helpers.ts, etc.)
- [ ] VPS'te `cd /var/www/packages/shared-backend && bun x tsc -p tsconfig.build.json`
- [ ] Bereketfide: git pull + build + `pm2 restart bereketfide-backend bereketfide-admin`
- [ ] VistaSeeds: git pull + build + `pm2 restart vistaseed-backend vistaseed-admin-panel`

### 7.3 Smoke Test
- [ ] Bereketfide: `/admin/db-admin` → sayfa açılır, snapshots tab boş liste
- [ ] `POST /api/v1/admin/db/snapshots` → yeni snapshot oluşur
- [ ] `GET /api/v1/admin/db/snapshots` → snapshot listesinde görünür
- [ ] `GET /api/v1/admin/db/modules/validate` → tüm modüller `ok: true`
- [ ] VistaSeeds: aynı smoke (regresyon)

---

## Faz 8 — Commit + Push

- [ ] `packages/` local repo: commit (Faz 1 + Faz 6 değişiklikleri)
- [ ] Bereketfide: commit + push (manifest + routes + admin UI + sidebar + locale)
- [ ] VistaSeeds: commit + push (refactor cleanup)

---

## Riskler

- **DB manipulation riski:** Yanlış dump yükleme = veri kaybı. Admin guard
  korumasına + `is_admin_user` kontrolüne güven.
- **Manifest tutarsızlığı:** Bir tablo manifest'te tanımlı ama DB'de yok →
  export/import fail. Validation endpoint ile önceden kontrol edilebilir.
- **FK sırası yanlış:** Import sırasında FK violation. `tablesInOrder` parent→child,
  `truncateInOrder` child→parent. Manifest'te dikkat.
- **Snapshot dosya boyutu:** Bereketfide canlı DB'de storage_assets büyük
  olabilir. Snapshot dosyası GB'a çıkabilir. `LOCAL_STORAGE_ROOT` disk boyutu
  yeterli olmalı.
- **VistaSeeds canlı regresyonu:** Refactor sonrası VistaSeeds'in mevcut
  admin fonksiyonları kırılmasın. Deploy öncesi local regresyon test şart.

---

## Son Durum

Faz 0: ✅ Tamamlandı
Faz 1-8: ⏳ Uygulamaya başlanacak
