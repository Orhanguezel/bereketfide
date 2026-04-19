# BereketFide — KatalogAI Entegrasyon Checklist

**Bağlam.** KatalogAI artık `Yayınla` butonuyla bir kataloğu doğrudan
`bereketfide.library` tablosuna **TASLAK** olarak yazıyor:

- `library` (type=`catalog`, **is_published=0**, is_active=1)
- `library_i18n` (locale + slug + name + description)
- `library_files` (file_url = KatalogAI'nın ürettiği PDF, mime=`application/pdf`)

Bu, KatalogAI tarafında **bitti**. BereketFide tarafında yapılacak iş:
yeni gelen taslak kataloğu admin panelinde **görmek + onaylamak (is_published=1)**.

Frontend (`/[locale]/kataloglar`) zaten `library?type=catalog` çağırıyor —
muhtemelen `is_published=1` filtresi var, gerekirse onu da kontrol et.

---

## 1) Veritabanı

`library`, `library_i18n`, `library_files` tabloları **zaten mevcut**
(ekosistem standart şeması). Hiçbir migration gerekmez.

KatalogAI'nın `app@localhost` user'ı `bereketfide.*` üzerinde **ALL PRIVILEGES**'a
zaten sahip olduğu için yetki ekleme gerekmez.

Doğrulama:
```bash
sudo mysql bereketfide -e "DESCRIBE library;"
sudo mysql bereketfide -e "SELECT id, type, is_published, is_active, image_url, created_at \
  FROM library WHERE type='catalog' ORDER BY created_at DESC LIMIT 10;"
```

---

## 2) Backend — Library modülü route'a register edilmiş mi?

Library modülü `@agro/shared-backend/modules/library` içinde. BereketFide
backend'inin `routes/shared.ts` (veya `routes.ts`) dosyasında
register edilmiş olmalı. Eğer eksikse:

```ts
// backend/src/routes/shared.ts
import { registerLibrary, registerLibraryAdmin } from '@agro/shared-backend/modules/library';

export async function registerSharedPublic(api: FastifyInstance) {
  // ...
  await registerLibrary(api);              // GET /library, /library/:id, ...
}

export async function registerSharedAdmin(adminApi: FastifyInstance) {
  // ...
  await registerLibraryAdmin(adminApi);    // CRUD admin endpoints
}
```

Doğrulama:
```bash
curl -s https://www.bereketfide.com/api/v1/library?type=catalog | jq .
```

Eğer 404 dönerse register eksiktir.

---

## 3) Admin Panel — Library yönetim sayfası

KatalogAI'dan gelen taslak kataloğu görmek + onaylamak için:

- [ ] Sidebar'a "Kütüphane" / "Kataloglar" menü öğesi (admin/library)
- [ ] List sayfası: `useListLibraryAdminQuery({ type: 'catalog' })`
  - Kolonlar: kapak görseli, başlık (locale), durum (`is_published`), tarih
  - Action: "Yayına al" toggle (PATCH `library/:id` body: `{is_published: 1}`)
- [ ] Detay sayfası: i18n metinleri düzenleme + dosya listesi (PDF)
- [ ] Filter: `type=catalog` default, status filter

Tahmini iş: ~half day (mevcut `categories` admin sayfasının paterni kopyalanır;
shared-backend'in library admin endpoint'leri zaten tam CRUD).

---

## 4) Frontend — `/kataloglar` sayfası

`bereketfide/frontend/src/app/[locale]/kataloglar/page.tsx` zaten **mevcut ve
çalışıyor**. `${API_BASE_URL}/library?locale=...&type=catalog` çağırıyor.

Backend public endpoint default'unda `is_published=1` filtresi olduğunu
varsayıyoruz — gerekirse query'ye `is_published=1` ekle:

```ts
// page.tsx
const res = await fetch(`${API_BASE_URL}/library?locale=${locale}&type=catalog&is_published=1&limit=12`);
```

Detay sayfası (`/kataloglar/[slug]`) PDF download butonu için
`library/:id/files` endpoint'inden `file_url` al, `<a href={file_url} download>` ile sun.
PDF KatalogAI'da üretilip absolute URL olarak yazıldığı için CORS sorunu yok
(direct download).

---

## 5) Smoke Test

1. KatalogAI editöründe bir katalog oluştur, "Yayınla" tıkla, BereketFide'yi seç
2. BereketFide admin panelinde Kütüphane → Kataloglar sayfası → yeni taslak görünmeli
   (status: pasif/draft)
3. "Yayına al" tıkla → `is_published=1`
4. `https://www.bereketfide.com/tr/kataloglar` → katalog kartı görünür
5. Kart tıkla → detay → PDF link çalışır

---

## 6) Notlar

- KatalogAI **schema'ya dokunmaz**, sadece INSERT yapar. BereketFide tarafında
  herhangi bir override veya silme tek yön: BereketFide içinde yönetilir.
- Aynı katalog tekrar "Yayınla" edilirse YENİ bir `library` kaydı oluşur
  (KatalogAI duplicate kontrolü yapmıyor — bilinçli; her sürümü ayrı taslak
  olarak görmek istiyoruz). Eski kaydı silmek/güncellemek admin'in elinde.
- PDF dosyası KatalogAI backend'inin `LOCAL_STORAGE_BASE_URL` üzerinden serve
  edilir (örn. `https://thecatalogia.com/uploads/catalogs/<slug>-<id>.pdf`).
  Bu URL canlı kalmaya devam ettiği sürece BereketFide'den de erişilir.
