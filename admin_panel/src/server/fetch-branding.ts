// =============================================================
// FILE: src/server/fetch-branding.ts
// Server-only — SSR'da branding config'i backend'den çeker
// =============================================================

import { DEFAULT_BRANDING, type AdminBrandingConfig } from '@/config/app-config';

const BRAND_PREFIX = process.env.NEXT_PUBLIC_BRAND_PREFIX || 'bereketfide__';

function getServerApiUrl(): string {
  const panel = (process.env.PANEL_API_URL || '').trim().replace(/\/+$/, '');
  if (panel) return `${panel}/api`;

  const pub = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/+$/, '');
  if (pub) return pub;

  return 'http://127.0.0.1:8096/api';
}

function parseSettingValue(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try { return JSON.parse(trimmed); } catch { return value; }
  }
  return value;
}

async function fetchSetting(base: string, key: string): Promise<unknown | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${base}/site_settings/${key}`, {
      next: { revalidate: 300 },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    return parseSettingValue(data?.value);
  } catch {
    return null;
  }
}

/**
 * Tüm branding key'lerini paralel çeker, merge eder.
 */
export async function fetchBrandingConfig(): Promise<AdminBrandingConfig> {
  try {
    const base = getServerApiUrl();

    // Tüm key'leri paralel çek (prefixed öncelikli)
    const [adminConfig, adminConfigGlobal, siteLogoP, siteLogoG, faviconP, faviconG, appleP, appleG] =
      await Promise.all([
        fetchSetting(base, `${BRAND_PREFIX}ui_admin_config`),
        fetchSetting(base, 'ui_admin_config'),
        fetchSetting(base, `${BRAND_PREFIX}site_logo`),
        fetchSetting(base, 'site_logo'),
        fetchSetting(base, `${BRAND_PREFIX}site_favicon`),
        fetchSetting(base, 'site_favicon'),
        fetchSetting(base, `${BRAND_PREFIX}site_apple_touch_icon`),
        fetchSetting(base, 'site_apple_touch_icon'),
      ]);

    // 1) branding config
    const configVal = (adminConfig || adminConfigGlobal) as { branding?: Partial<AdminBrandingConfig> } | null;
    const branding = configVal?.branding;

    // 2) site_logo
    const logoRaw = (siteLogoP || siteLogoG) as Record<string, string> | null;
    const siteLogoData = logoRaw && typeof logoRaw === 'object' ? logoRaw : null;

    // 3) favicon
    const favRaw = (faviconP || faviconG) as { url?: string } | null;
    const faviconUrl = favRaw?.url || siteLogoData?.favicon_url || '';

    // 4) apple touch icon
    const appleRaw = (appleP || appleG) as { url?: string } | null;
    const appleTouchUrl = appleRaw?.url || siteLogoData?.apple_touch_icon_url || '';

    return {
      ...DEFAULT_BRANDING,
      ...branding,
      favicon_16: faviconUrl || branding?.favicon_16 || DEFAULT_BRANDING.favicon_16,
      favicon_32: faviconUrl || branding?.favicon_32 || DEFAULT_BRANDING.favicon_32,
      apple_touch_icon: appleTouchUrl || branding?.apple_touch_icon || DEFAULT_BRANDING.apple_touch_icon,
      meta: {
        ...DEFAULT_BRANDING.meta,
        ...branding?.meta,
        og_image: branding?.meta?.og_image || siteLogoData?.logo_url || DEFAULT_BRANDING.meta.og_image,
      },
    };
  } catch {
    return DEFAULT_BRANDING;
  }
}
