export interface ColorTokens {
  primary: string;
  primaryDark: string;
  accent: string;
  background: string;
  surfaceBase: string;
  surfaceRaised: string;
  surfaceMuted: string;
  textStrong: string;
  textBody: string;
  textMuted: string;
  border: string;
  borderLight: string;
  navBg: string;
  navFg: string;
  footerBg: string;
  footerFg: string;
  success: string;
  warning: string;
  danger: string;
  surfaceDarkBg: string;
  surfaceDarkText: string;
  surfaceDarkHeading: string;
}

export interface TypographyConfig {
  fontHeading: string;
  fontBody: string;
}

export interface SectionBackground {
  key: string;
  bg: string;
  overlay?: string;
  textColor?: string;
  headingColor?: string;
}

export interface ThemeConfig {
  colors: ColorTokens;
  typography: TypographyConfig;
  radius: string;
  darkMode: 'light' | 'dark' | 'system';
  sectionBackgrounds: SectionBackground[];
}

export type ThemeUpdateInput = {
  colors?: Partial<ColorTokens>;
  typography?: Partial<TypographyConfig>;
  radius?: string;
  darkMode?: 'light' | 'dark' | 'system';
  sectionBackgrounds?: SectionBackground[];
};

export const COLOR_TOKEN_LABELS: Record<keyof ColorTokens, { label: string; group: string }> = {
  primary: { label: 'Marka Ana Renk', group: 'Marka' },
  primaryDark: { label: 'Marka Koyu', group: 'Marka' },
  accent: { label: 'Vurgu Rengi', group: 'Marka' },
  background: { label: 'Sayfa Arka Plan', group: 'Yüzey' },
  surfaceBase: { label: 'Taban Yüzey', group: 'Yüzey' },
  surfaceRaised: { label: 'Yükseltilmiş Yüzey', group: 'Yüzey' },
  surfaceMuted: { label: 'Soluk Yüzey', group: 'Yüzey' },
  textStrong: { label: 'Güçlü Metin', group: 'Metin' },
  textBody: { label: 'Gövde Metin', group: 'Metin' },
  textMuted: { label: 'Soluk Metin', group: 'Metin' },
  border: { label: 'Kenarlık', group: 'Kenarlık' },
  borderLight: { label: 'Açık Kenarlık', group: 'Kenarlık' },
  navBg: { label: 'Navbar Arka Plan', group: 'Navigasyon' },
  navFg: { label: 'Navbar Metin', group: 'Navigasyon' },
  footerBg: { label: 'Footer Arka Plan', group: 'Navigasyon' },
  footerFg: { label: 'Footer Metin', group: 'Navigasyon' },
  success: { label: 'Başarı', group: 'Durum' },
  warning: { label: 'Uyarı', group: 'Durum' },
  danger: { label: 'Tehlike', group: 'Durum' },
  surfaceDarkBg: { label: 'Koyu Bölüm Arka Plan', group: 'Koyu Bölüm' },
  surfaceDarkText: { label: 'Koyu Bölüm Metin', group: 'Koyu Bölüm' },
  surfaceDarkHeading: { label: 'Koyu Bölüm Başlık', group: 'Koyu Bölüm' },
};

export const RADIUS_OPTIONS = [
  { value: '0rem', label: 'Yok (0)' },
  { value: '0.25rem', label: 'Küçük (4px)' },
  { value: '0.375rem', label: 'Orta (6px)' },
  { value: '0.5rem', label: 'Varsayılan (8px)' },
  { value: '0.75rem', label: 'Büyük (12px)' },
  { value: '1rem', label: 'Çok Büyük (16px)' },
];
