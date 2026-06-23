# Bereket Fide Ekstralar Modulu Checklist

## Amaç

Ekstralar; siparis disinda uretilen, belirli viol tipinde ve belirli tarihte hazir olacak fide firsat stoklaridir. Bayiler bu listeyi gorup hizli talep olusturabilmelidir.

## Yapilacaklar

- [x] DB: `extra_seedlings` tablosu
  - kategori, urun adi, viol tipi, adet, hazir tarihi/durum, yayin durumu, not, gorsel
- [x] DB: `extra_seedling_requests` tablosu
  - bayi/kullanici, talep edilen adet, not, durum
- [x] Seed: WhatsApp ekstra listelerinden ilk veri girisi
- [x] Backend Admin API
  - listele, olustur, guncelle, sil/arsivle
  - talepleri listele ve durum guncelle
- [x] Backend Bayi API
  - yayindaki ekstralari listele
  - bayi talebi olustur
- [x] Admin Panel
  - Ekstralar sayfasi
  - filtreler, liste, form modal
  - fiyat degil; adet/tarih/viol/durum odakli yonetim
- [x] Bayi Gorunumu
  - yayindaki ekstralari kategori/viol/tarih ile goster
  - talep olusturma akisi
- [x] Test/Kontrol
  - backend TypeScript
  - admin panel TypeScript
  - hedefli lint
  - API route temel kontrolleri

## Ilk Faz Kararlari

- Ekstralar normal envanterden ayri tutulacak.
- Stoklar otomatik ScriptCase akisi gibi degil, manuel/import yonetilecek.
- Bayi tarafinda dogrudan satin alma degil, talep/rezervasyon akisi olacak.
- `HAZIR`, `BOYLU` gibi metinler `availability_label` alaninda tutulacak.
- Tarihli satirlarda `available_on` dolu olacak.
