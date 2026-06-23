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

- [x] `PLAN.md` Bereket Fide odakli (§1 kimlik, §4 IA, §13 bayi); icerik maddeleri Faz B-D'de
- [x] `README.md` Bereket Fide, `bereketfide.com.tr`, portlar (3030 / 8086 / 3004), `bun` ile hizali
- [x] Canonical URL ve metadata sablonlari: `NEXT_PUBLIC_SITE_URL` / `SITE_URL` varsayilan `https://www.bereketfide.com.tr`; `project.portfolio.json` + `frontend/project.portfolio.json`; `manifest.ts` aciklama; `layout.tsx` varsayilan title/description Bereket Fide; OG gorsel site_settings uzerinden
- [x] navigation fallback: PLAN §4 sirasi (kurumsal, urunler, faaliyetler, bilgi merkezi, insan kaynaklari/kariyer, teklif, iletisim); CMS yalnizca ayni path'lerde baslik override; projeler/galeri/login/register vb. ust menuden filtre
- [x] contact / offer `source`: API payload `bereketfide` (`contact.service.ts`, `offer.service.ts`, backend sema varsayilanlari)

### Faz B — Icerik esleme

- [x] Kaynak site ana alanlari → hedef rotalar (tasima sirasinda kontrol listesi; icerik henuz kopyalanmadi):

| Kaynak alan (bereketfide.com.tr ozeti) | Hedef (frontend) |
| --- | --- |
| Anasayfa | `/{locale}/` |
| Kurumsal / firma | `/{locale}/hakkimizda` + gerekirse CMS `custom-pages` |
| Urunler / cesitler | `/{locale}/urunler`, `/{locale}/urunler/{slug}` |
| Kalite / hizmet politikasi, KVKK | `/{locale}/legal/{slug}` veya CMS |
| Insan kaynaklari | `/{locale}/insan-kaynaklari` + CMS `by-slug` (tr `insan-kaynaklari`, en `careers`, de `karriere`) |
| Basinda biz / haber | `/{locale}/haberler`, `/{locale}/haberler/{slug}` |
| Bilgi / teknik icerik | `/{locale}/blog`, `/{locale}/blog/{slug}` |
| Iletisim | `/{locale}/iletisim` |
| Teklif / talep | `/{locale}/teklif` |
| Katalog (PDF) | `/{locale}/kataloglar`, `/{locale}/kataloglar/{slug}` |

- [x] Hakkimizda ve yasal sayfalar `305_bereketfide_pages.seed.sql` ile slug `about` / `privacy` / `terms` vb.; `hakkimizda` rotasi `by-slug/about` ile uyumlu. Eski `051*` custom page seed dosyalari (profilde calismiyordu) repodan kaldirildi; canli DB: `db:seed` veya admin ile icerik kontrolu
- [x] `305` — DE: `about` / `privacy` / `terms` (slug'lar TR/EN ile ayni; `GET .../by-slug/...?locale=de`); TR KVKK + cerez ve EN PDPL + cerez stub metinleri genisletildi; DE Servicepolitik yazim (`möchten`) duzeltildi
- [x] Hakkimizda: canli sitedeki ana mesajlarla `305` giris paragrafi + ozet/meta (TR/EN/DE); sayfa `RelatedLinks` + `fetchRelatedContent` (`knowledgePosts` / bilgi bankasi); detay sayfalarinda ayni bilgi bankasi sutunu; `check-seo-smoke.mjs` hakkimizda icin Breadcrumb + `jsonld.breadcrumb` + RelatedLinks. Operasyonel nihai uzun metin CMS/admin ile sabitlenebilir
- [x] Kalite / hizmet politikasi: `305_bereketfide_pages.seed.sql` (`kalite-politikasi`, `hizmet-politikasi` + EN/DE slug’lar), footer yasal bolumu, `legal/[slug]` fallback + `sitemap` — canli nihai metin CMS ile incelenebilir
- [x] Insan kaynaklari: `insan-kaynaklari/page.tsx`, `hr-page.ts`, `305` (`bc010008` + i18n), ust menu + footer Kesfet, `sitemap`; opsiyonel `seo_pages.insan_kaynaklari`
- [x] Urun detay: `item_type=bereketfide` icin `product_i18n.specifications` JSON dogrudan listelenir (`product-specifications.ts`); kategori satiri `kategori`/`category` + API `category_name`; diger tiplerde mevcut spec-keys davranisi korunur — yeni DB alani gerekmeden model netlesti
- [x] Blog + haber seed: `304_bereketfide_blog.seed.sql` ve `310_bereketfide_news.seed.sql` icin `de` locale (blog 4, haber 5 yazi; slug + meta); canli siteden icerik tasimasi asagidaki madde
- [x] spec-keys: `shared/spec-keys.json` (`project`) ve `admin_panel/src/shared/spec-keys.json` (`product`) icin `de` anahtar ve etiketleri
- [x] SEO `site_settings`: `046_seo_config.sql` — `de` (`seo`, `bereketfide__seo`, `seo_pages`, `bereketfide__seo_pages`); `insan_kaynaklari` + politika slug’lari icin `legal_*` anahtarlari TR/EN/DE (`fetchSeoPage` / `legal_[slug]`); ayrica KVKK/PDPL (`legal_kvkk-aydinlatma-metni`, `legal_pdpl-information-notice`) ve `legal_cookies`
- [x] Yasal sayfalar tamamlayici: `305` DE satirlari KVKK + cerez (slug’lar TR ile uyumlu `kvkk-aydinlatma-metni` / `cookies`); `sitemap.ts` hukum + KVKK veya PDPL + cerez URL’leri
- [x] Footer + yasal fallback: KVKK/PDPL ve cerez linkleri (`legalComplianceSlug`, alt bant + `buildDefaultFooterSections`); `legal/[slug]` locale JSON fallback (`tr` / `en` / `de`)
- [x] Bilgi merkezi (blog) detay: `blog/[slug]` ic ice baglantilar — `fetchRelatedContent` + `RelatedLinks` (urunler, haber modulu, galeri); `scripts/check-seo-smoke.mjs` blog sayfalari ve `sitemap.ts` `/blog` kontrolu
- [x] Haber seed `310`: ilk iki haber canli site (Mart 2026) basin / kurumsal ziyaret metinleriyle hizalandi (TR/EN/DE, slug + govde + meta); diger 310 maddeleri + tam medya yukleri CMS/admin ile sabitlenebilir
- [x] Bilgi bankasi `304`: `custom_pages.images` + `storage_image_ids` (coklu gorsel); TR/EN/DE icerik ve meta aciklamalari zenginlestirildi. Haber `310` (3-5): TR/EN/DE genisletilmis govde; haber 4 baslik/slug `305` kapasite anlatimiyla celismeyecek sekilde guncellendi (sabit rakam yerine olcek ifadesi). Nihai canli fotograf/PDF/CMS ince ayari admin

### Faz C — Moduler donusum

- [x] `projeler` / `projects` URL'leri `next.config` ile `/:locale/urunler` (+ slug) 301; ilgili icerik `related-content` artik `GET /products?item_type=bereketfide` kullanir; SEO scriptleri ve Lighthouse URL'leri `/urunler` ile hizali
- [x] DE yerel fallback: `nav.tagline` ve `footer.description` insaat dilinden fide/tarim diline cekildi; ayrica `de.json` icinde nav, `common.offerCta*`, `home.*` (hero, vitrin, blog spotlight, newsletter, contact), `projects.*` (liste, filtre, detay, `similarByTagsTitle` / `aboutProducerTitle`), `services`, `gallery`, `contact`, `offer`, `about`, `auth` metinleri TR/EN ile hizali urun/tarim diline cekildi
- [x] DE `legal.*` + `seo.keywords` insaat/Vista kalintilari fide/tarim diline cekildi; EN `about.sectorsItems.three` + `gallery.emptyStateNote` guncellendi — CMS/uzun icerik maddeleri canli metinle ayri ayri incelenebilir
- [x] Urun detay (`item_type=bereketfide`): `@agro/shared-backend` `products` tablosundaki tarimsal alanlar (botanik ad, ekim donemi, iklim, toprak, su/gunes, sicaklik, mesafe, verim vb.) API'de zaten donuyor; frontend `bereketfide-product-agronomy.ts` + `projects.agronomy*` cevirileri ile listeleniyor. Ekstra DB kolonu ihtiyaci ayri degerlendirilir

### Faz D — Temizlik

- [x] public ust menü: `navigation-fallback.ts` ile eski / gereksiz CMS linkleri (or. projeler, galeri) header listesine alinmaz; sayfalar dogrudan URL ile acik kalabilir
- [x] Referans / is ortagi bandi: ana sayfada `fetchReferences` yalniz `NEXT_PUBLIC_FEATURE_HOME_REFERENCES=1` iken; varsayilan kapali (`frontend/src/config/public-features.ts`, `.env.example`)
- [x] Ana sayfa katalog bandi: `fetchFeaturedCatalogs` yalniz `NEXT_PUBLIC_FEATURE_HOME_CATALOGS=1` iken; varsayilan kapali (`showHomeCatalogsBand`, `.env.example`); blog ızgarasi veri yoksa bolum render edilmez
- [x] Ana sayfa blog / haber: API ve bolum `NEXT_PUBLIC_FEATURE_HOME_BLOG=0` / `NEXT_PUBLIC_FEATURE_HOME_NEWS=0` ile kapatilabilir; varsayilan acik (`public-features.ts`, `.env.example`)
- [x] Footer bulten: `NewsletterForm` yalniz `NEXT_PUBLIC_FEATURE_FOOTER_NEWSLETTER=1` iken (`Footer.tsx`, `public-features.ts`, `.env.example`); varsayilan kapali
- [x] Admin sidebar: referanslar, galeri, bulten, haber yorumlari, bildirimler varsayilan gizli; `NEXT_PUBLIC_ADMIN_NAV_*=1` ile acilir (`admin-features.ts`, `.env.example`)
- [x] Ana sayfa sabit fallback temizligi: hard-coded `home_backgrounds` (upload path'leri) ve `home_stats` (376/20/16/31 sayilari) kaldirildi; yalniz `site_settings` `home_backgrounds` / `home_stats` doluysa ScrollBackground ve istatistik bandi render edilir (`page.tsx`, `StatsHighlightSection` bos liste → null)
- [x] `FloatingWidgets` arama placeholder: TR hardcode kaldirildi; `de.json` `nav.searchPlaceholder` ve trend anahtarlari eklendi. `NewsletterForm` gonderim durumu `common.sending` ile yerellestirildi
- [x] `Header.tsx`: mobil menu dugmesi `nav.ariaToggleMenu` + `aria-expanded`; masaustu `nav` `ariaPrimaryNavigation`; marka rengi uzerinde metin `var(--color-on-brand)`; link rengi `#1a1a1a` → `var(--color-text-primary)` (TR/EN/DE locale anahtarlari)
- [x] `StatsHighlightSection`: bolum zemini `bg-(--color-bg-dark)` (`globals` toprak token’lari ile hizali)
- [x] `SplashScreen`: zemin `var(--section-bg-dark-deep)`; yesil/material hex yerine `--green-*` / `--gold-*` + `color-mix`; marka basligi altin gradient
- [x] `ProjectsView`: liste/grid ikon rengi `#111111` → `var(--color-text-primary)`; masonry baslik `#fff` → `var(--section-bg-white)`
- [x] Ana sayfa `page.tsx`: hero gradient / overlay `globals` primitive + `color-mix`; kart zemini `var(--surface-dark-strong)`; koyu bolumler `bg-(--color-bg-dark)`; referans bandi `%85` icin `color-mix`; `HeroVideoPlayer` ayni hero gradient; `layout.tsx` SSR splash `#0f0e0d` → `var(--section-bg-dark-deep)`; `OfferForm` alanlari `border` / `bg` / `focus` token; `galeri` kart rozeti `color-mix` + `var(--section-bg-white)`
- [x] Liste + detay token temizligi: `blog/page.tsx` + `haberler/page.tsx` (`.nw-*` chip/featured/article); `hizmetler/page.tsx` (CTA + sidebar link, `sv-cta` metin `color-mix`); `ProjectsView` (filtre, tab, panel, masonry overlay); `urunler/[slug]`, `blog/[slug]`, `haberler/[slug]` teklif/CTA `#fff` → `var(--color-on-brand)`
- [x] Galeri / proje UI: `GalleryImageGrid`, `ProjectGallery`, `ProjectLightbox` (zemin ve metin `color-mix` / `var(--section-bg-white)`); `ProjectComments` (durum yesili `var(--color-success)`, avatar `color-mix` + ikon `var(--section-bg-white)`, gonder `var(--color-on-brand)`); `SocialShare` ikon rengi + e-posta dugmesi `var(--soil-600)`; `hakkimizda` CTA `#fff` → `var(--color-on-brand)`; `ProfileClient` + `LoginClient` + `RegisterClient` alert kutulari `var(--color-success*)` / `var(--status-danger)` + `color-mix`
- [x] OG / PWA / ikon: `lib/bereketfide-palette-hex.ts` (ImageResponse/manifest ile `globals` hizasi); `opengraph-image` + `twitter-image` material yesil → basak/toprak gradient + altin vurgu; `apple-icon` «MK» + turuncu kaldirildi → «B» + altin; `icon` fallback `green-900`/`gold-500`; `manifest` `theme_color`/`background_color` paletten; `globals.css` `--color-bg-alt` (light: `section-bg-light`, dark: `surface-muted`); bayi giris/kayit/panel `var(..., #hex)` yedekleri kaldirildi
- [x] `globals.css` `--color-surface` → `var(--color-bg-secondary)` (iletisim, galeri, hizmet detay, `ContactForm` ile uyum); `Header` cam zemin + golge + mega menu backdrop `color-mix`; logo ayirici `border-gray-100` → `border-(--color-border)`; giris/kayit modal zemin + kart golgesi; detay sayfalari CTA aciklamasi `section-bg-white` %70; `ProjectsView` / `ProjectComments` / `galeri` / `iletisim` / `hizmetler/[slug]` kutu golgeleri; `StatsHighlightSection` beyaz kenar/ic highlight `color-mix`
- [x] `globals.css` `.bf-alert-danger` / `.bf-alert-success` / `.bf-link-danger` (status token + `color-mix`); bayi giris/kayit, bayi agi, finans, siparis listesi/detay banner ve hata kutulari; `Footer` ayirici `surface-dark-border`; ana sayfa `text-gray-400` → `text-(--color-text-muted)`, haber karti `bg-white` → `bg-(--color-bg-secondary)`, hero baslik `drop-shadow` token; `kataloglar` kart zemini token; `BayiPanelShell` cikis hover `var(--status-danger)`
- [x] Bayi paneli + bayi akisi Tailwind v4: `text-[var(--color-*)]` / `bg-[var(--color-bg-alt)]` / `border-[var(--color-brand)]` / `focus:ring-[var(--color-brand)]` kalintilari `text-(--color-*)` / `bg-(--color-bg-alt)` / `border-(--color-brand)` / `focus:ring-(--color-brand)/30`; aktif nav `text-(--color-on-brand)`; marka birincil dugmeler `bg-(--color-brand)` + `text-(--color-on-brand)` (`BayiPanelShell`, `bayi-dashboard`, `FinansPageClient`, `SiparislerPageClient`, `OrderDetailClient`, `BayiGirisClient`, `BayiKayitClient`, `BayiAgiClient`)
- [x] Kalan `text-[var(--*)]` / `border-[var(--*)]` / `focus:*-[var(--*)]` (frontend `src` geneli) → `(--*)` kisa yazimi; `kataloglar` + ana sayfa bolumleri + `HeroVideoPlayer` etiket + `FloatingWidgets` yan panel `bg-white` → `bg-(--color-bg-secondary)`; `LanguageSwitcher` aktif satir `text-(--color-on-brand)` / nokta `bg-(--color-on-brand)`; `scripts/check-theme-tokens.mjs` — hex yalniz 3/6/8 hane (`&#9733;` yanlis alarmi yok), `bg-white` taramasi `section-bg-white` icin yanlis pozitif vermez, allowlist: `bereketfide-palette-hex.ts`, `projects/SocialShare.tsx`, `LoginClient` / `RegisterClient` (Google SVG)
- [x] `text-white` / `bg-white/*` kalintilari: marka zeminli CTA’larda `text-(--color-on-brand)` (`arama`, `hizmetler/[slug]`, `DownloadButton`, `ProjectFeed`, `InfoListPanel` hover); `SaveProjectButton` kayitli `gold-900` + `text-(--section-bg-white)`; koyu yuzey / hero / istatistik / tam ekran video kapatma: `text-(--section-bg-white)` veya cam token (`--color-glass-*`, `--color-border-on-dark`); `FloatingWidgets` arama + dikey cubuk; ana sayfa hero + blog/katalog kartlari + marka bandi + final CTA (`hover:text-(--color-on-brand)` marka hover’da); `Footer` bulten baslikta gereksiz `text-white` kaldirildi, GWD hover `section-bg-white`
- [x] Koyu bolum kenarlari: ana sayfa blog karti / referans bandi / final CTA `border-white/*` → `border-(--color-border-on-dark)` veya `border-(--color-glass-border)` (pill CTA); `ContactForm` gonder spinner `border-(--color-on-brand)` (`btn-primary` uzerinde); `ScrollBackground*.sync-conflict*` cop dosyasi silindi
- [x] Kullanilmayan newsletter feature katmani kaldirildi (`features/newsletter/*`; abonelik yalniz `NewsletterForm` + axios). `query-client` `queryKeys.newsletter` silindi. Admin tarafi ayri degerlendirilecek
- [x] Gorsel placeholder tek kaynak: `GALLERY_IMAGE_PLACEHOLDER` (`frontend/src/lib/placeholders.ts`); `urunler` liste/detay ve `galeri` sayfalarindaki tekrarlayan sabitler kaldirildi
- [x] DB seed temizligi: `011_categories`, `051*`, `061`, `141`, `151`, `171`, `181`, `191` silindi; `012_sub_categories.sql` yalniz tablo semasi; `040.1_site_meta.sql` fide/tarim SEO metinlerine cekildi (`seo` / `site_seo` / `site_meta_default`)
- [x] Detay sayfalari iliskili link kumesi: `urunler/[slug]`, `haberler/[slug]`, `hizmetler/[slug]` icinde `RelatedLinks` + `fetchRelatedContent`; `related-content` haber listesi `module_key=news&is_published=1`; `node scripts/check-seo-smoke.mjs` gecer
- [x] URL ve SEO map (teknik): asagidaki ozet + `frontend/src/app/sitemap.ts` (statik sayfalar + `insan-kaynaklari`, urun/hizmet/galeri, haber + blog + katalog detaylari, legal); `robots.ts` dil on ekli `disallow` (`/tr/...`, `/en/...`, `/de/...`); Search Console odagi `/{locale}/urunler`

#### URL ve SEO — teknik ozet (canonical)

| Alan | Yol | Not |
| --- | --- | --- |
| Kok | `/` → `/tr` | `next.config` kalici yonlendirme |
| Urunler | `/{locale}/urunler`, `/{locale}/urunler/{slug}` | Oncelikli indeks; `projeler` / `projects` → `urunler` 301 |
| Hizmetler | `/{locale}/hizmetler`, `/{locale}/hizmetler/{slug}` | `module_key=bereketfide` |
| Galeri | `/{locale}/galeri`, `/{locale}/galeri/{slug}` | |
| Haberler | `/{locale}/haberler`, `/{locale}/haberler/{slug}` | CMS `module_key=news` |
| Bilgi bankasi | `/{locale}/blog`, `/{locale}/blog/{slug}` | CMS `module_key=blog` |
| Kataloglar | `/{locale}/kataloglar`, `/{locale}/kataloglar/{slug}` | `library` `type=catalog` |
| Kurumsal / iletisim | `/{locale}/hakkimizda`, `/{locale}/insan-kaynaklari`, `/{locale}/iletisim`, `/{locale}/teklif` | IK icerigi CMS slug ile locale bazli |
| Yasal | `/{locale}/legal/{slug}` | or. gizlilik, kosullar |
| Bayi / auth (noindex amaci) | `robots` ile engellenen yollar | `/{locale}/bayi-girisi`, `bayi-kayit`, `bayi-dashboard`, `panel/siparisler`, `bayi/finans`, `login`, `register`, `profil` |

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

## 13. Bayi girisi ve B2B panel (VistaSeed eslestirmesi) — checklist

VistaSeed ile ayni ekosistem rolleri ve API omurgasi hedeflenir. Asagidaki liste uygulama durumunu yansitir.

### Tamamlananlar

**Veritabani / seed**

- [x] `user_roles.role` enum'u ekosistem ile hizalandi (`admin`, `editor`, `carrier`, `customer`, `dealer`) — `004_user_roles_schema.sql`
- [x] Eski enum'dan gecis icin migration — `314_user_roles_legacy_migrate.sql` (`moderator`→`editor`, `user`→`customer`)
- [x] `orders` + `order_items` tablolari — `315_orders_b2b_schema.sql`
- [x] `dealer_profiles` + `dealer_transactions` — `316_dealer_finance_schema.sql` (`is_approved` ile admin onayi)
- [x] Test bayi kullanicisi + profil seed — `317_bereketfide_dealer_user.seed.sql` (`bayi@example.com`, onayli profil)
- [x] Bereketfide seed profiline `314–317` dosyalari eklendi

**Backend**

- [x] `dealerFinance` modulu projeye kopyalandi ve kayit edildi (`registerDealerFinance`, admin karsiliklari)
- [x] `POST /dealer/register` (public): basvuru; `users` + `dealer` rolu + `dealer_profiles` (`is_approved: 0`); Telegram bildirimi
- [x] `requireApprovedDealer` middleware: admin JWT disinda bayi API'lerinde `is_approved === 1` zorunlu; degilse `403 dealer_not_approved`
- [x] `orders` modulu projeye kopyalandi; bayi CRUD + odeme: havale + cari (`dealer_credit`); Iyzico kart (`FEATURE_IYZICO_PAYMENT`, `modules/wallet/`, callback) — Bolum 13 “Kalan isler (opsiyonel)” maddesine bakin
- [x] Bayi katalog sorgusu `item_type = bereketfide` olacak sekilde uyarlandi
- [x] `repoUserIsDealer` ve mail uyumu: `bereket-mail` (`finance-alerts` icin)
- [x] VistaSeed `seller` / marketplace siparis omurgasi bu projede yok; bayi tarafinda Iyzico callback `orders/payment/iyzico/callback` ile tanimli
- [x] `dealerFinance/repository` tip duzeltmesi (`SQL[]` kosullar)
- [x] `repoGetOrderById`: siparis kalemlerinde `x-locale` ile `product_i18n.title` (`product_title`)
- [x] `@fastify/rate-limit`: global 100/dk/IP; `/health`, `/api/health`, `/uploads/` muaf; ortak auth/contact rotalarindaki `config.rateLimit` aktif; `POST /dealer/register` 5/saat/IP
- [x] Testler (`backend/package.json`): `bun run test:unit` — `dealerPublicRegisterSchema` (DB gerekmez); `bun run test` / `test:integration` — Fastify inject (`401` korumali bayi uclari, `POST /dealer/register` bos govde `400`); entegrasyon icin MySQL ayakta olmali
- [x] Yerel / sablon yapilandirma: `backend/.env.example` — `CORS_ORIGIN` (public `3030`, admin `3004`), `FRONTEND_URL` / `PUBLIC_*` ile `PORT=8086` hizasi; uretim cookie notu (`NODE_ENV=production` iken `app.ts`: `sameSite: none`, `secure: true`); B2B seed komut ipucu; `env.ts` varsayilan `PORT` 8086, `FRONTEND_URL` `http://localhost:3030`

**Paylasik paket (`@agro/shared-backend`)**

- [x] Admin `adminSetRolesBody` ve kullanici listesi rol filtresi: `dealer`, `customer`, `carrier`, `editor` dahil

**Frontend (public site)**

- [x] `/[locale]/bayi-kayit` — bayi basvuru formu (`lib/dealer-register-api.ts`); basari: onay beklenir mesaji
- [x] `/[locale]/bayi-girisi` — `dealer` / `admin`; giris sonrasi onaysiz bayi `GET /dealer/profile` ile kontrol, `dealer_not_approved` → cikis + `?durum=beklemede`
- [x] `(bayi)` panel: `BayiPanelShell` ayni onay kontrolu; `bayi-dashboard`, `panel/siparisler`, `bayi/finans`, siparis detay + havale/cari
- [x] `bayi-agi` (`GET /dealers/public`) + header: `nav.dealerNetwork`, `nav.dealerRegister`, `nav.dealerLogin`
- [x] `robots.ts`: `/bayi-girisi`, `/bayi-kayit`, bayi panel yollari `disallow` (sayfalarda `noindex` ile uyumlu)
- [x] TR/EN (ve nav icin DE): `nav.dealerRegister`, `auth.bayi`, `auth.panel`

**Admin panel**

- [x] `UserRoleName` ekosistem rolleriyle uyumlu; kullanici listesi / detay rol secicileri (`tr`, `en`, `de`); `moderator`/`user` normalize
- [x] Bayi / siparis / cari: `/orders`, `/orders/[id]`, `/dealers`, `/dealers/[id]` — `b2b_admin.endpoints.ts`, sidebar `b2b_orders` / `b2b_dealers`
- [x] Onay akisi: `/dealers` listesinde filtre (or. «Bekleyen»); `/dealers/[id]` uzerinden `is_approved` / «Onayli bayi» — sonrasinda bayi girisi ve API
- [x] Bekleyen basvurular ipucu: `b2b.dealers.pendingHint`

### Kalan isler (elis / operasyon)

- [x] Teknik yonerge: `backend/.env.example` — monorepo kokunden `bun install` / `build:shared`, backend `bun run build`, seed (`db:seed:bereketfide` / `fresh`, profil 314-317 `seed/index.ts` notu), canli `CORS_ORIGIN` (www + apex + admin) ve cookie hatirlatmasi
- [x] Canli / yeni ortam `.env` + CORS + cookie: operasyonel adimlar `backend/.env.example` altinda "Canli / staging — manuel kontrol listesi" ile sabitlendi; her deploy’da bu liste taranir (otomasyon yok)

### Kalan isler (opsiyonel / ileri faz — kod)

- [x] Iyzico / kart: `iyzipay`, `modules/wallet/iyzico.ts`, `POST /orders/:id/payment/iyzico/initiate` (bayi, `FEATURE_IYZICO_PAYMENT`), `POST /orders/payment/iyzico/callback` (public, `urlencoded`), `FRONTEND_DEFAULT_LOCALE` + yonlendirme; bayi UI: `NEXT_PUBLIC_FEATURE_IYZICO_PAYMENT` + `IyzicoCheckoutHost`. **Kalan (is):** coklu satici / alt bayi sozlesmesi; banka POS ayri kanal
- [ ] Coklu satici: Bereket Fide B2B su an tek marka; `seller` + `registerSellerOrders` yalniz pazaryeri ihtiyacinda VistaSeed’ten (istege bagli)

### Kalan isler (banka / tarim karti — is + teknik)

- [x] **Banka POS / tarim kartlari** — Kod tamamlandi (2026-04-06):
  - `wallet/craftgate.ts` — Craftgate HMAC-SHA256 REST client (hosted checkout, sandbox hazir)
  - `wallet/nestpay.ts` — NestPay EstV3Pos XML 3D form (Is Bankasi + Halkbank)
  - `wallet/ziraatpay.ts` — ZiraatPay REST API v2 client
  - `orders/payment-card.controller.ts` — tek endpoint, `PAYMENT_CARD_PROVIDER` env ile saglayici secimi
  - `orders/payment-card-callback.controller.ts` — Craftgate / NestPay / ZiraatPay callback isleyicileri
  - `orders/router.ts` — `POST /orders/:id/payment/card/initiate` + 8 callback URL
  - `core/env.ts` + `.env.example` — `FEATURE_BANK_CARD_PAYMENT`, `PAYMENT_CARD_PROVIDER`, Craftgate/NestPay/ZiraatPay anahtarlari
  - Frontend: `showDealerBankCardPayment` feature flag, `postOrderCardInitiate` servisi, "Kredi/Banka Karti ile Ode" butonu + redirect/form mantigi
  - **Kalan (is):** banka sozlesmesi + `.env` doldurmak + `FEATURE_BANK_CARD_PAYMENT=1` yapmak. Once Craftgate sandbox ile test onerilir (banka sozlesmesi beklemeden).

---

## 14. Sonuc

Bu projede hedef:
- mevcut Bereket Fide icerigini kaybetmeden modernlestirmek
- gereksiz modulleri erken silmeden kontrollu ilerlemek
- urun odakli, SEO guclu, hizli ve temiz bir kurumsal yapi kurmak

Bir sonraki teknik odak (Bolum 13 disinda genel plan ile birlikte):
- Bereket Fide marka / meta / fallback donusumu; navigasyon sadelestirmesi; insaat dilinden fide diline icerik
- Bayi tarafinda: ilk kurulum seed ve canli CORS dogrulamasi (sablon `.env.example`); odeme: Iyzico route + callback + bayi UI tamam; banka POS ayri kanal / sozlesme
