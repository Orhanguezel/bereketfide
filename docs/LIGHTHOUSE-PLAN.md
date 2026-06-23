# Bereket Fide — Lighthouse 100/100 Plan

## Mevcut Skorlar
- Performance: **57/100**
- Accessibility: **89/100**

## Hedef
- Performance: **100/100**
- Accessibility: **100/100**

---

## PERFORMANCE (57 → 100)

### Sorunlar ve Çözümler

| Metrik | Mevcut | Hedef | Sorun | Çözüm |
|--------|--------|-------|-------|-------|
| LCP | 3.4s | <1.2s | Hero video 21MB + görsel optimizasyon yok | Video poster + lazy load, görselleri WebP/AVIF |
| TBT | 550ms | <150ms | main-app.js 2.5MB, 701ms long task | Dynamic import, code splitting |
| TTI | 5.5s | <3.8s | Büyük JS bundle + video yükleme | Lazy load video, reduce bundle |

### 1. Hero Video Optimizasyonu [CRITICAL]
- **Sorun:** 21MB video FCP sonrası yükleniyor, LCP'yi etkiliyor
- **Dosya:** Hero section component
- **Çözüm:**
  - Video'ya `poster` attribute ekle (ilk kare'nin statik görseli)
  - Video'yu `preload="none"` yap (lazy load)
  - IntersectionObserver ile viewport'a girince yükle
  - Video boyutunu küçült veya daha küçük bir versiyon kullan

### 2. Görsel Optimizasyonu [HIGH]
- **Sorun:** WhatsApp JPEG'ler optimize edilmemiş, ~400KB/görsel
- **Çözüm:**
  - Next.js Image component `sizes` prop ile responsive boyutlar
  - priority sadece above-the-fold görsellere
  - Lazy load tüm below-fold görseller (zaten var)

### 3. JS Bundle Boyutu [HIGH]
- **Sorun:** main-app.js 2.5MB, page.js 285KB unused
- **Çözüm:**
  - ClientShell içindeki widget'ları dynamic import yap
  - FloatingWidgets lazy load
  - Analytics bileşenleri zaten lazy (OK)

### 4. CSS Minification [LOW]
- **Sorun:** 3KB tasarruf potansiyeli
- **Çözüm:** Production build zaten minify eder, dev ortam farkı

---

## ACCESSIBILITY (89 → 100)

### 1. Button Accessible Name [CRITICAL] — 3 element
- **Sorun:** FloatingWidgets butonlarında aria-label yok
- **Dosya:** `src/components/widgets/FloatingWidgets.tsx`
- **Çözüm:** Her butona `aria-label` ekle

### 2. Color Contrast [CRITICAL] — 45 element
- **Sorun:** `text-(--color-brand)` (#b8a98a altın rengi) beyaz/açık arka plan üzerinde yetersiz kontrast
- **Çözüm:** Brand rengi daha koyu bir varyant kullan veya font-weight artır
- **Kapsam:** Section başlıkları, link'ler, badge'ler

### 3. Heading Order [MEDIUM] — 2 element
- **Sorun:** h1 → h3 atlama (h2 yok), h3 → h4 sıralama
- **Dosya:** Ana sayfa section'ları
- **Çözüm:** Heading hierarchy'yi düzelt (h2 kullan)

---

## Uygulama Sırası
1. FloatingWidgets aria-label (Accessibility)
2. Color contrast düzeltmesi (Accessibility)
3. Heading order düzeltmesi (Accessibility)
4. Hero video poster + preload=none (Performance)
5. FloatingWidgets dynamic import (Performance)
