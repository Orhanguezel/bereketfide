# Envanter - Resim Birleştirme Özeti

Kaynak ürün/resim listesi: `urun-resim-listesi.md`

Birleştirme çıktıları:

- `envanter-resim-eslesmeleri.csv`
- `envanter-resim-eslesmeleri.json`
- `envanter-resim-map.sql`

## Net Cevap

`urun-resim-listesi.md` içindeki isimlerin tamamı envanterle birebir uyumlu değil.

Liste fotoğraftan okunmuş isimlerden oluşuyor; envanter ise resmi stok adını `malzeme_adi` olarak tutuyor. Bu yüzden sadece adı ve ürün türü güvenli biçimde uyuşanları otomatik birleştirmek doğru olur.

## Güvenli Birleşebilecek Kayıtlar

Bu 15 ürün resimlerle envanter arasında güvenli şekilde eşleştirilebilir:

| Resim no | Envanter kodu | Envanter adı | Ön resim | Arka resim |
|---:|---|---|---|---|
| 01 | TŞ00057 | GÜLPEMBE DOMATES TOHUMU | `duzeltilmis_resimler/urun-01-on.jpg` | `duzeltilmis_resimler/urun-01-arka.jpg` |
| 02 | TŞ00455 | ROUGINA RZ F1 (74-511) DOMATES TOHUMU | `duzeltilmis_resimler/urun-02-on.jpg` | `duzeltilmis_resimler/urun-02-arka.jpg` |
| 04 | TŞ00643 | BAMBUS DOMATES TOHUMU | `duzeltilmis_resimler/urun-04-on.jpg` | `duzeltilmis_resimler/urun-04-arka.jpg` |
| 07 | TŞ00373 | KANYON BİBER TOHUMU | `duzeltilmis_resimler/urun-07-on.jpg` | `duzeltilmis_resimler/urun-07-arka.jpg` |
| 11 | TŞ00822 | RAPTOR DOMATES TOHUMU | `duzeltilmis_resimler/urun-11-on.jpg` | `duzeltilmis_resimler/urun-11-arka.jpg` |
| 19 | TŞ00862 | ERSOY DOMATES TOHUMU | `duzeltilmis_resimler/urun-19-on.jpg` | `duzeltilmis_resimler/urun-19-arka.jpg` |
| 20 | TŞ00824 | MONABELL DOMATES TOHUMU | `duzeltilmis_resimler/urun-20-on.jpg` | `duzeltilmis_resimler/urun-20-arka.jpg` |
| 21 | TŞ00363 | VEYRON DOMATES TOHUMU | `duzeltilmis_resimler/urun-21-on.jpg` | `duzeltilmis_resimler/urun-21-arka.jpg` |
| 22 | TŞ00502 | KANUNİ DOMATES TOHUMU | `duzeltilmis_resimler/urun-22-on.jpg` | `duzeltilmis_resimler/urun-22-arka.jpg` |
| 24 | TŞ00985 | DOLUNAY DOMATES TOHUMU | `duzeltilmis_resimler/urun-24-on.jpg` | `duzeltilmis_resimler/urun-24-arka.jpg` |
| 29 | TŞ00056 | LAPÇİN DOMATES TOHUMU | `duzeltilmis_resimler/urun-29-on.jpg` | `duzeltilmis_resimler/urun-29-arka.jpg` |
| 30 | TŞ00546 | UG 464913 DOMATES TOHUMU | `duzeltilmis_resimler/urun-30-on.jpg` | `duzeltilmis_resimler/urun-30-arka.jpg` |
| 31 | TŞ00912 | LEROTA DOMATES TOHUMU | `duzeltilmis_resimler/urun-31-on.jpg` | `duzeltilmis_resimler/urun-31-arka.jpg` |
| 33 | TŞ00152 | ZÜMRA KAVUN TOHUMU | `duzeltilmis_resimler/urun-33-on.jpg` | `duzeltilmis_resimler/urun-33-arka.jpg` |
| 41 | TŞ01006 | FULLCİN BİBER TOHUMU | `duzeltilmis_resimler/urun-41-on.jpg` | `duzeltilmis_resimler/urun-41-arka.jpg` |

## Manuel Kontrol Gerekenler

Bu 4 ürünün adı envanterde var ya da güçlü aday var; fakat tür veya etiket bilgisi çeliştiği için otomatik birleştirmedim:

| Resim no | Fotoğraftaki ad | Envanter adayı | Sorun |
|---:|---|---|---|
| 06 | HTP Tomatoes 10-686 SH F1 | TŞ00872 - SHERVİNA DOMATES TOHUMU | Fotoğraf etiketi tekrar okunmalı. |
| 34 | Kuzu F1 | TŞ00927 - KUZU KAVUN TOHUMU | Bizim listede tür Soğan, envanter Kavun. |
| 42 | Beyonse | TŞ00708 - BEYONSE BİBER TOHUMU | Bizim listede tür Fasulye, envanter Biber. |
| 43 | Vega Star F1 | TY00815 - VEGASTAR KARPUZ TOHUMU | Bizim listede tür Hıyar, envanter Karpuz. |

## Uygulama Notu

`envanter-resim-map.sql` sadece güvenli 15 eşleşmeyi içerir. En doğru model inventory sync tablosuna resim kolonu eklemek değil, ayrı bir eşleştirme tablosu kullanmak:

`inventory_image_map(malzeme_kodu, front_image_path, back_image_path, image_pair_no, confidence, note)`

Bu şekilde ScriptCase senkronizasyonu bozulmaz; admin panelde inventory satırları `malzeme_kodu` ile resimlere bağlanabilir.
