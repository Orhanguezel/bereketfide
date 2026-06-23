# THEMA.md — Bereket Fide Tema Sistemi

> Bu dokuman Bereket Fide projesinin tema kontratidir.
> Tema sistemi, tipografi, tasarim dili veya SEO-sunum kurallari degisirse bu dosya guncellenir.
> Kaynak: `frontend/src/styles/globals.css` + `frontend/src/theme/templates.ts`

---

## 1. Kimlik

| Alan | Deger |
|------|-------|
| Template adi | `bereket-harvest` |
| Template intent | `clean-natural-wheat-gold` |
| Renk stratejisi | 70% kirik acik tonlar · 20% basak altini · 10% koyu toprak/antrasit |
| Tipografi | Syne (baslik) + DM Sans (body) |
| Dark mode | Desteklenebilir, ancak ilk algi light mode agirlikli olmali |
| Tailwind | v4 |

---

## 2. Tasarim Yonelimi

Bereket Fide'nin tasarim dili:
- dogal ama rustik degil
- kurumsal ama soguk degil
- urun odakli ama katalog karmasasina dusmeyen
- temiz, ferah, guven veren

Referans his:
- basak
- verimlilik
- tarim ve uretim guveni
- modern kurumsal sadelik

Kacinilacaklar:
- insaat/editorial dramatik kurgu
- asiri koyu hero alanlari
- sert siyah-altin luks hissi
- gereksiz overlay ve agir cam efektleri

---

## 3. Primitive Tokenlar

### 3.1 Basak Altini Skalasi
```css
--wheat-50:  #fcfaf4;
--wheat-100: #f7f0dd;
--wheat-200: #ecdcb3;
--wheat-300: #e0c98a;
--wheat-400: #d0b066;
--wheat-500: #bf9a45;   /* ana marka rengi */
--wheat-600: #a78233;
--wheat-700: #856626;
--wheat-800: #654c1b;
--wheat-900: #4a3715;
```

### 3.2 Kirik Krem / Dogal Zemin Skalasi
```css
--cream-0:   #ffffff;
--cream-50:  #fbfaf7;
--cream-100: #f4f1e8;
--cream-200: #e7e0d0;
--cream-300: #d6ccb6;
```

### 3.3 Toprak / Antrasit Skalasi
```css
--soil-100: #d8d0c3;
--soil-200: #b9ae9b;
--soil-300: #968977;
--soil-400: #746857;
--soil-500: #5b5042;
--soil-700: #3b342c;
--soil-900: #201c18;
```

---

## 4. Semantic Tokenlar

### 4.1 Light Mode
```css
--color-bg:             var(--cream-50);
--color-bg-secondary:   var(--cream-0);
--color-bg-muted:       var(--cream-100);
--color-bg-dark:        var(--soil-900);

--color-text-primary:   var(--soil-900);
--color-text-secondary: var(--soil-500);
--color-text-muted:     var(--soil-300);
--color-text-on-dark:   #f8f5ef;

--color-border:         var(--cream-200);
--color-border-strong:  var(--soil-200);

--color-brand:          var(--wheat-500);
--color-brand-light:    var(--wheat-300);
--color-brand-dark:     var(--wheat-700);
--color-accent:         var(--soil-700);
--color-on-brand:       #201c18;
```

### 4.2 Dark Mode
```css
--color-bg:             #171411;
--color-bg-secondary:   #211c17;
--color-bg-muted:       #2a241e;
--color-bg-dark:        #0f0d0b;

--color-text-primary:   #f4efe6;
--color-text-secondary: #d5ccbc;
--color-text-muted:     #a99e8b;
--color-text-on-dark:   #f7f2ea;

--color-border:         #312a23;
--color-border-strong:  #463c31;

--color-brand:          var(--wheat-400);
--color-brand-light:    var(--wheat-300);
--color-brand-dark:     var(--wheat-600);
--color-accent:         var(--wheat-500);
--color-on-brand:       #201c18;
```

---

## 5. Tipografi

Font yonu:
- Baslik: `Syne`
- Govde: `DM Sans`

Kurallar:
- basliklar guven veren, net ve orta-sikletli olmali
- paragraflar rahat okunmali
- urun kartlari ve tablo benzeri alanlarda gosteri yerine okunabilirlik onde olmali

```css
--font-heading: 'Syne', system-ui, sans-serif;
--font-body: 'DM Sans', system-ui, sans-serif;
```

---

## 6. Bilesen Dili

Ana bilesen karakteri:
- yumusak koseli kartlar
- ince border
- acik zemin uzerinde net tipografi
- altin rengi sadece vurgu ve CTA'da

Buton kurali:
- primary: basak altini dolu
- secondary: acik zemin + ince border
- tertiary: text-link

Kart kurali:
- urun kartlari sade
- hover abartisiz
- gorsel ve baslik once gelir

---

## 7. Sayfa Deseni

Anasayfa sirasinda hedef:
- hero
- guven / kurumsal tanitim
- urun gruplari
- kalite ve uretim guvencesi
- bilgi merkezi
- iletisim CTA

Kurumsal sayfalar:
- temiz hero
- kisa intro
- icerik bloklari
- gerekiyorsa belge/politika kutulari

Urun sayfalari:
- kategori odakli
- filtrelenebilir ama sade
- teknik bilgi, kullanim notu ve gorsel dengeli

---

## 8. Logo Yonu

Referans yon:
- mevcut vektor logo mantigindaki kurumsallik korunabilir
- renk dili basak altini + koyu toprak tonlarina cekilmeli
- luks insaat hissi degil, dogal uretim guveni vermeli

Logo kullanim kurali:
- acik zeminde ana logo
- koyu zeminde acik/negatif logo
- favicon ve sosyal gorsellerde sade monogram veya kisaltilmis isaret dusunulebilir

---

## 9. SEO ve Performans Uyumu

Tema kurallari SEO ve performansla celismemeli:
- LCP alaninda agir slider kullanma
- gorseller optimize olmali
- ilk ekranda tek ana mesaj olmali
- dekoratif efektler icerigi bastirmamali
- komponentlerde raw hex yerine semantic token kullanilmali

---

## 10. Son Not

Bu proje icin renk yonu:
- altin kalacak
- ama `sampanya/luks` yerine `basak/hasat/dogal guven` hissine kayacak

Tema kararlarinda ana soru su olacak:
- Bu ekran Bereket Fide'yi daha guvenilir ve daha temiz gosteriyor mu?
