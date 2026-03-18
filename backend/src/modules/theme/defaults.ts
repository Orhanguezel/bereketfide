import type { ThemeConfig } from './types';

/**
 * Bereket Fide varsayılan tema konfigürasyonu.
 * Altın (başak/buğday) + Yeşil (fide/doğa) paleti.
 * Logo renkleriyle uyumlu: #d4a843 açık altın → #6b4f0e koyu altın
 * Humintech referans: kurumsal, temiz, ekolojik
 */
export const DEFAULT_THEME: ThemeConfig = {
  colors: {
    // Brand — logo altın paleti
    primary: '#b8862d',       // Logo orta altın — butonlar, başlıklar
    primaryDark: '#8b6914',   // Koyu altın — hover, active
    accent: '#d4a843',        // Açık altın — vurgular, ikonlar, highlight

    // Surface — sayfa arka planları
    background: '#faf9f6',    // Sıcak kırık beyaz — ana bg
    surfaceBase: '#f5f2eb',   // Sıcak krem — alternatif section bg
    surfaceRaised: '#ffffff', // Beyaz — kart arka planı
    surfaceMuted: '#f0f5eb',  // Açık yeşil krem — yeşil section bg

    // Text
    textStrong: '#1a2e12',    // Çok koyu yeşil — başlıklar
    textBody: '#3d4a38',      // Koyu yeşil-gri — gövde metin
    textMuted: '#7a8574',     // Orta yeşil-gri — soluk metin

    // Border
    border: '#d4d2c8',        // Sıcak gri — kenarlık
    borderLight: '#e8e6dc',   // Açık sıcak gri — hafif kenarlık

    // Nav / Footer — koyu yeşil
    navBg: '#1a3a0e',         // Koyu yeşil — navbar
    navFg: '#ffffff',         // Beyaz text
    footerBg: '#162d0c',      // Daha koyu yeşil — footer
    footerFg: '#e8e6dc',      // Açık krem — footer text

    // Status
    success: '#2d7a3a',       // Doğal yeşil
    warning: '#d4a843',       // Altın (uyarı = accent)
    danger: '#c23a2a',        // Toprak kırmızı

    // Dark sections — koyu yeşil bölümler (CTA, hero overlay)
    surfaceDarkBg: '#1a3a0e',       // Koyu yeşil
    surfaceDarkText: '#e0ddd4',     // Açık krem metin
    surfaceDarkHeading: '#d4a843',  // Altın başlık
  },

  typography: {
    fontHeading: 'Syne, system-ui, sans-serif',
    fontBody: 'DM Sans, system-ui, sans-serif',
  },

  radius: '0.375rem',   // Minimal köşe — Humintech gibi temiz
  darkMode: 'light',

  // Anasayfa section arka plan sırası
  sectionBackgrounds: [
    { key: 'hero', bg: 'transparent', overlay: 'rgba(26,58,14,0.7)' },
    { key: 'intro', bg: '#faf9f6' },
    { key: 'categories', bg: '#f0f5eb' },
    { key: 'featured_products', bg: '#ffffff' },
    { key: 'services', bg: '#1a3a0e', textColor: '#ffffff', headingColor: '#d4a843' },
    { key: 'about_numbers', bg: '#faf9f6' },
    { key: 'catalog_references', bg: '#f0f5eb' },
    { key: 'news', bg: '#ffffff' },
    { key: 'contact_cta', bg: '#1a3a0e', textColor: '#ffffff', headingColor: '#d4a843' },
  ],
};
