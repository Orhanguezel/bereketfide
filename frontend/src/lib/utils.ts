import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8096/api';

// Resmi barındıran sunucu (API URL'inden /api kısmını çıkarıyoruz)
export const ASSETS_URL =
  process.env.NEXT_PUBLIC_ASSETS_URL ?? API_BASE_URL.replace(/\/api$/, '');

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.bereketfide.com.tr';

function encodeAssetLikeUrl(value: string): string {
  try {
    // Zaten encode edilmiş URL'yi tekrar encode etme (%20, %28 vs. varsa)
    if (value.includes('%')) return value;
    return encodeURI(value);
  } catch {
    return value;
  }
}

export function absoluteAssetUrl(value?: string | null): string | null {
  if (!value) return null;
  
  // Eğer tam URL ise (http://...) olduğu gibi döndür
  if (/^https?:\/\//i.test(value)) return encodeAssetLikeUrl(value);
  
  // Frontend'in kendi /public klasöründeki statik dosyalar (Görünür URL'de başında / olur)
  const localStaticPaths = ['/media/', '/brands/', '/icons/', '/logo-', '/favicon'];
  const normalized = value.startsWith('/') ? value : `/${value}`;
  
  if (localStaticPaths.some(path => normalized.startsWith(path))) {
    return encodeAssetLikeUrl(normalized); // Kendi sunucusundan (frontend) çeksin
  }
  
  // Geri kalan her şeyi (özellikle /uploads/) Backend sunucusundan çekiyoruz
  return encodeAssetLikeUrl(`${ASSETS_URL}${normalized}`);
}
