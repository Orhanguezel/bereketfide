# Bereket Fide — Uygulama ve Icerik Plani

> Bu dokumanin onceligi yeni markayi dogru yerlestirmektir.
> Ilk asamada eski referans iceriklerini panikle silmek yerine `Bereket Fide` icerigini sisteme ekleyecegiz.
> Icerik eslesmesi tamamlandiktan sonra gereksiz insaat modulleri ve eski fallback verileri temizlenecek.

---

## 1. Proje Kimligi

| Alan | Deger |
| --- | --- |
| Marka | Bereket Fide |
| Domain | https://www.bereketfide.com.tr |
| Hedef | Mevcut site icerigini modern, hizli, SEO odakli kurumsal yapida yeniden sunmak |
| Proje Tipi | Corporate Website + Product Catalog + Admin Panel |
| Diller | TR oncelikli, EN opsiyonel |
| Frontend | Next.js |
| Backend | Fastify |
| Admin | Icerik yonetim paneli |
| Tema Yonu | Basak altini + kirik krem + toprak/antrasit |
| Tasarim Hissi | Temiz, dogal, guven veren, modern kurumsal |

---

## 2. Kaynak Site Incelemesi

Incelenen kaynak:
- `https://www.bereketfide.com.tr/Default`
- Kaynak sitedeki ana icerik omurgasi korunacak, ancak bilgi mimarisi ve sunum dili modernlestirilecek.

Kaynak siteden net gorulen ana alanlar:
- Anasayfa
- Hakkimizda
- Urunlerimiz
- Kalite politikasi
- Hizmet politikasi
- Insan kaynaklari
- Basinda biz / haberler
- Iletisim
- KVKK

Kaynak sitede korunmaya deger icerik tipleri:
- Kurumsal firma tanitimi
- Uretim ve kalite odakli guven unsurlari
- Urun gruplari ve fide cesitleri
- Basvuru / iletisim bilgileri
- Haber, duyuru veya bilgi icerikleri

Kaynak sitede zayif kalan alanlar:
- Eski nesil gorunum ve hiyerarsi
- Urunlerin daha iyi filtrelenebilir sunulamamasi
- Sayfa yapilarinda tekrarli metinler
- SEO acisindan zayif baslik/aciklama kurgusu
- Mobil deneyim ve performans algisi

---

## 3. Temel Strateji

Bu proje bir "tema degisimi" degil, kontrollu bir "icerik yeniden yapilandirma" isidir.

Ilk kural:
- Once Bereket Fide icerigini ekle
- Sonra eski referans kalintilarini temizle

Bunun anlami:
- Mevcut modulleri hemen kaldirmiyoruz
- Once yeni bilgi mimarisini ve yeni metinleri yerlestiriyoruz
- Fallback icerikleri Bereket Fide odakli hale getiriyoruz
- Navigation, SEO ve sayfa basliklarini Bereket Fide'ye ceviriyoruz
- En son gereksiz modulleri kapatiyor veya siliyoruz

---

## 4. Hedef Bilgi Mimarisi

Onerilen ana navigasyon:
- Anasayfa
- Kurumsal
- Urunler
- Bilgi Merkezi
- Insan Kaynaklari
- Iletisim

Kurumsal altinda toplanabilecek sayfalar:
- Hakkimizda
- Kalite Politikamiz
- Hizmet Politikamiz
- KVKK

Bilgi Merkezi altinda toplanabilecek alanlar:
- Haberler / Duyurular
- Basinda Biz
- Teknik / Bilgilendirici icerikler

Urunler alani icin hedef yapi:
- Urun gruplari
- Kategori sayfalari
- Urun detay sayfalari
- Teknik ozellik alanlari
- Talep / iletisim CTA'lari

---

## 5. Tutulacak Moduller

Asagidaki moduller proje icin dogrudan kullanilabilir:
- `siteSettings`
- `menuItems`
- `footerSections`
- `products`
- `categories`
- `subcategories`
- `customPages`
- `library`
- `contact`
- `offer`
- `gallery`
- `newsletter`
- `storage`

Frontend tarafinda tutulacak ana sayfalar:
- anasayfa
- hakkimizda
- urunler
- haberler veya bilgi merkezi
- iletisim

Admin tarafinda tutulacak yonetim alanlari:
- site ayarlari
- menu yonetimi
- footer yonetimi
- urunler
- kategoriler
- sayfalar
- blog / haberler
- medya
- iletisim kayitlari

---

## 6. Sadelestirilecek veya Kapatilacak Moduller

Mevcut klon repoda insaat odakli kalan veya ilk fazda gereksiz olan alanlar:
- `projects`
- `references`
- `faqs` sadece ihtiyac varsa aktif edilmeli
- `chat`
- `comments`
- `review`
- `support`
- `notifications` kamuya acik site icin zorunlu degil
- `login/register` public sitede gereksiz olabilir

Frontend tarafinda donusmesi gereken sayfalar:
- `projeler` -> `urunler`
- `teklif` -> `talep formu` veya `toplu siparis / bilgi talebi`

Ilk fazda hemen silinmeyecek ama pasiflestirme adayi:
- galeri
- newsletter
- basvuru disi ekstra formlar

Karar:
- Silmeden once icerik karsiligi olup olmadigi kontrol edilecek
- Public navigation'da gereksiz alanlar gizlenebilir
- Kod temizligi ikinci asamada yapilacak

---

## 7. Bereket Fide Icin Gerekli Ana Moduller

### 7.1 Anasayfa

Olmasi gereken bloklar:
- guclu hero alani
- kisa kurumsal tanitim
- neden Bereket Fide
- urun gruplari onizleme
- kalite / uretim guvencesi
- haberler veya bilgi icerikleri
- iletisim cagrisi

### 7.2 Kurumsal

Olmasi gereken sayfalar:
- Hakkimizda
- kalite politikasi
- hizmet politikasi
- KVKK

Icerik beklentisi:
- firma hikayesi
- uretim anlayisi
- kalite ve guven metinleri
- kurumsal belgeler veya politikalar

### 7.3 Urunler

Bu alan projenin cekirdek modulu olacak.

Olmasi gereken yapilar:
- kategori listesi
- urun kartlari
- urun detay sayfasi
- teknik alanlar
- urun gorselleri
- talep formu baglantisi

Detay sayfasinda dusunulen alanlar:
- urun adi
- kategori
- kisa aciklama
- teknik ozellikler
- kullanim / yetistirme notlari
- gorsel galeri
- benzer urunler

### 7.4 Bilgi Merkezi

Kaynak sitedeki haber ve bilgilendirici icerikler burada toplanacak.

Alt yapilar:
- haberler
- basinda biz
- bilgi yazilari

Bu alan SEO icin kritik:
- uzun kuyruklu arama terimleri
- sezonluk fide aramalari
- teknik yetistiricilik icerikleri

### 7.5 Insan Kaynaklari

Tek sayfa yeterli olabilir:
- IK tanitimi
- basvuru metni
- basvuru formu veya e-posta yonlendirmesi

### 7.6 Iletisim

Olmasi gerekenler:
- adres
- telefon
- e-posta
- harita
- iletisim formu
- hizli ulasim CTA'lari

---

## 8. SEO ve Performans Kurallari

Bu proje modern gorunum kadar teknik kaliteye de odaklanacak.

Zorunlu SEO basliklari:
- her sayfa icin benzersiz title
- her sayfa icin benzersiz meta description
- urun ve kategori sayfalari icin temiz URL yapisi
- canonical
- Open Graph / Twitter kartlari
- JSON-LD
- sitemap
- robots

Oncelikli SEO firsatlari:
- kategori bazli urun landing sayfalari
- fide turlerine gore arama niyeti yakalama
- bilgilendirici blog icerikleri
- marka guveni icin kurumsal sayfalarin guclendirilmesi

Performans kurallari:
- agir slider mantigindan kac
- ilk ekranda az ama etkili icerik
- optimize gorseller
- gereksiz JS ve animasyonlardan kac
- server-side veri ve statik uretilen sayfa dengesi

---

## 9. Tasarim Yonelimleri

Hedef tasarim karakteri:
- tarim / uretim / dogallik hissi
- modern ve temiz kurumsal gorunum
- guven veren tipografi
- urunleri one cikaran sade grid sistemi

Tasarim karar notlari:
- insaat sektorune ait editorial dramatik dil terk edilecek
- gorsel dil daha ferah, daha dogal ve daha ulasilabilir olacak
- altin ton korunacak ancak basak/harman hissine yaklastirilacak
- kirik krem, toprak tonlari ve temiz arka plan birlikte dusunulebilir
- urun listelerinde okunabilirlik gosteristen onde olacak

---

## 10. Gecis Stratejisi: Referanstan Bereket'e

Bu proje icin uygulanacak sira:

### Faz A — Marka yerlestirme

- [ ] `PLAN.md` Bereket Fide odakli yeniden yazildi
- [ ] `README.md` Bereket Fide olarak guncellenecek
- [ ] `site name`, `metadataBase`, `manifest`, OG gorselleri Bereket Fide'ye cevrilecek
- [ ] navigation fallback ve site settings fallback Bereket Fide olacak
- [ ] contact / offer source alanlari Bereket Fide olacak

### Faz B — Icerik esleme

- [ ] Kaynak sitedeki tum ana sayfalar listelenecek
- [ ] Hakkimizda metinleri yeni yapiya alinacak
- [ ] politika sayfalari custom page olarak duzenlenecek
- [ ] urun gruplari ve urun detay modeli netlestirilecek
- [ ] haber / bilgi merkezi icerikleri tasinacak

### Faz C — Moduler donusum

- [ ] `projeler` mantigi tamamen `urunler` mantigina donusturulecek
- [ ] insaat fallback verileri Bereket Fide icerigi ile degistirilecek
- [ ] insaat diline ait sabit metinler ayiklanacak
- [ ] gerekiyorsa yeni urun alanlari backend'e eklenecek

### Faz D — Temizlik

- [ ] public tarafta gereksiz sayfalar navigation'dan kaldirilacak
- [ ] kullanilmayan moduller pasiflestirilecek
- [ ] gercekten gereksiz olan kod ve fallback veriler silinecek
- [ ] URL ve SEO map'i son haline getirilecek

---

## 11. Ilk Sprint Oncelikleri

Hemen yapilacak islerin sirasi:

1. Bereket Fide marka referanslarini tum public metadata alanlarina yerlestir.
2. Mevcut navigation ve fallback icerigini Bereket Fide omurgasina cevir.
3. `projeler` yapisinin urun katalog mantigina nasil donusecegini netlestir.
4. Kaynak sitedeki kurumsal icerikleri sayfa sayfa taslaklastir.
5. Gereksiz insaat modullerini silmeden once public yuzde gizle veya pasiflestir.

---

## 12. Acik Kararlar

Bu maddeler ilk icerik yerlestirme sirasinda netlestirilecek:
- EN dil aktif olacak mi?
- Urunlerde teknik veri alanlari neler olacak?
- Basinda Biz ve Haberler ayni modulde mi yonetilecek?
- Insan Kaynaklari icin form mu olacak, e-posta yonlendirmesi mi?
- Newsletter gercekten gerekli mi?
- Galeri ayri sayfa mi olacak, yoksa urun ve kurumsal sayfalara mi dagilacak?

---

## 13. Sonuc

Bu projede hedef:
- mevcut Bereket Fide icerigini kaybetmeden modernlestirmek
- gereksiz modulleri erken silmeden kontrollu ilerlemek
- urun odakli, SEO guclu, hizli ve temiz bir kurumsal yapi kurmak

Bir sonraki teknik uygulama adiminda odak:
- Bereket Fide marka/meta/fallback donusumu
- navigation yapisinin sadeleştirilmesi
- insaat dilindeki sabit iceriklerin urun/fide diline evriltilmesi
