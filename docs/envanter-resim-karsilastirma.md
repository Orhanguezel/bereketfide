# Envanter - Ürün Resmi Karşılaştırması

Karşılaştırılan admin sayfası:

`admin_panel/src/app/(main)/(admin-pages)/(admin)/inventory`

Bu sayfa ürün kataloğu/görsel yönetimi değil; ScriptCase kaynağından gelen stok cache listesini gösteriyor. Kod tarafında liste alanları şunlar:

- `malzeme_kodu`
- `malzeme_adi`
- `girisler`
- `cikislar`
- `envanter_miktari`
- `synced_at`

Canlı kaynak: `http://88.250.38.79:8092/Envanter/index.php`

Canlı kaynaktan okunan toplam kayıt: **631**

Fotoğraf klasöründen çıkarılan ürün çifti: **43**

## Sonuç

Evet, bu resimler inventory sayfasındaki veriyle alakalı görünüyor. Fotoğraflar tohum paketlerinin ön/arka yüzleri; inventory sayfası da aynı ürünlerin stok kayıtlarını `malzeme_adi` üzerinden tutuyor.

Ama birebir teknik bağlantı henüz yok: inventory tablosunda görsel yolu, ürün görsel ID'si veya fotoğraf dosyasıyla eşleşen bir alan bulunmuyor. Eşleşme yalnızca ürün/çeşit adı üzerinden yapılabiliyor.

## Birebir veya Çok Güçlü Eşleşmeler

| Resim no | Fotoğraftaki ürün | Envanter kodu | Envanter adı | Stok |
|---:|---|---|---|---:|
| 01 | Gülpembe F1 | TŞ00057 | GÜLPEMBE DOMATES TOHUMU | 40.944 |
| 02 | Rougina | TŞ00455 | ROUGINA RZ F1 (74-511) DOMATES TOHUMU | 284.613 |
| 04 | Bambu F1 | TŞ00643 | BAMBUS DOMATES TOHUMU | 3.351 |
| 07 | Kanyon | TŞ00373 | KANYON BİBER TOHUMU | 48.345 |
| 11 | Raptor | TŞ00822 | RAPTOR DOMATES TOHUMU | 1.130 |
| 19 | Ersoy F1 | TŞ00862 | ERSOY DOMATES TOHUMU | 1.000 |
| 20 | Monabell F1 | TŞ00824 | MONABELL DOMATES TOHUMU | 7.878 |
| 21 | Veyron | TŞ00363 | VEYRON DOMATES TOHUMU | 4.551 |
| 22 | Kanuni F1 | TŞ00502 | KANUNİ DOMATES TOHUMU | 963 |
| 24 | Dolunay | TŞ00985 | DOLUNAY DOMATES TOHUMU | 1.000 |
| 29 | Lapçin F1 | TŞ00056 | LAPÇİN DOMATES TOHUMU | 63.678 |
| 30 | UG 4649 13 F1 | TŞ00546 | UG 464913 DOMATES TOHUMU | 73.422 |
| 31 | Lerota F1 | TŞ00912 | LEROTA DOMATES TOHUMU | 102.538 |
| 33 | Zümra | TŞ00152 | ZÜMRA KAVUN TOHUMU | 32.434 |
| 34 | Kuzu F1 | TŞ00927 | KUZU KAVUN TOHUMU | 4.672 |
| 41 | Fullcin F1 | TŞ01006 | FULLCİN BİBER TOHUMU | 2.488 |

## Muhtemel Ama Manuel Kontrol Gerekenler

| Resim no | Fotoğraftaki ürün | Envanter adayı | Neden kontrol edilmeli |
|---:|---|---|---|
| 06 | Hazera / HTP Tomatoes 10-686 SH F1 | TŞ00872 - SHERVİNA DOMATES TOHUMU | Fotoğraftaki etiket okunumu netleştirilmeli; envanterde güçlü aday `SHERVİNA`. |
| 42 | Beyonse | TŞ00708 - BEYONSE BİBER TOHUMU | Ad birebir, fakat fotoğraftaki tür bilgisi tekrar kontrol edilmeli. |
| 43 | Vega Star F1 | TY00815 - VEGASTAR KARPUZ TOHUMU | Ad birebir/çok yakın, fakat fotoğraftaki tür bilgisi tekrar kontrol edilmeli. |

## Envanterde Bulamadıklarım

Aşağıdaki fotoğraf ürünleri canlı inventory listesinde ürün adı olarak net bulunmadı:

| Resim no | Fotoğraftaki ürün |
|---:|---|
| 03 | RYSD 3016 F1 |
| 05 | Ekinaz F1 |
| 08 | Serenad |
| 09 | Şenol |
| 10 | 21CK501 / Fülika F1 |
| 12 | Çiğdem |
| 13 | Sazak F1 |
| 14 | Manier |
| 15 | Tayfun |
| 16 | Alkış 14T1026 |
| 17 | Patro F1 |
| 18 | Troy F1 |
| 23 | Ant F1 |
| 25 | Leydi Rostr... |
| 26 | Auberty F1 |
| 27 | Sencer F1 |
| 28 | E15A50619 F1 |
| 32 | Besteros F1 |
| 35 | Petekçitir |
| 36 | Menako F1 |
| 37 | Çar Arık F1 |
| 38 | Petri |
| 39 | Örten... |
| 40 | Zarurioza F1 |

## Teknik Not

Admin inventory ekranı şu endpointleri kullanıyor:

- `/admin/inventory`
- `/admin/inventory/stats`
- `/admin/inventory/sync-logs`

Frontend tarafı: `admin_panel/src/integrations/endpoints/admin/inventory_admin.endpoints.ts`

Backend tarafı: `backend/src/modules/inventorySync/admin.controller.ts`

Resimleri inventory ile kalıcı bağlamak için inventory cache'e doğrudan görsel alanı eklemek yerine ayrı bir eşleştirme tablosu daha doğru olur:

`inventory_image_map(malzeme_kodu, front_image_path, back_image_path, confidence, note)`

Bu sayede ScriptCase senkronizasyonu bozulmadan görseller admin panelde gösterilebilir.
