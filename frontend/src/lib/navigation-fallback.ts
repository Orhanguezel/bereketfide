import { localizedPath } from '@/seo';
import { HR_LIST_PATH } from '@/lib/hr-page';

type TranslateFn = (key: string) => string;

export interface MenuItemLike {
  title: string;
  url: string;
  children?: MenuItemLike[];
}

export interface FooterSectionLike {
  title: string;
  items: Array<{ label: string; url: string }>;
}

/**
 * CMS `305_bereketfide_pages` ile uyumlu yasal sayfa slug'lari (locale bazli).
 */
export function legalPageSlug(
  locale: string,
  key: 'privacy' | 'terms' | 'quality' | 'service',
): string {
  const lc = String(locale || 'tr').toLowerCase();
  if (key === 'privacy' || key === 'terms') return key;
  if (key === 'quality') {
    if (lc.startsWith('tr')) return 'kalite-politikasi';
    if (lc.startsWith('de')) return 'qualitaetspolitik';
    return 'quality-policy';
  }
  if (lc.startsWith('tr')) return 'hizmet-politikasi';
  if (lc.startsWith('de')) return 'servicepolitik';
  return 'service-policy';
}

/** KVKK / PDPL ve çerez — `305` + `by-slug` ile uyumlu slug'lar */
export function legalComplianceSlug(locale: string, key: 'dataNotice' | 'cookies'): string {
  const lc = String(locale || 'tr').toLowerCase();
  if (key === 'cookies') return 'cookies';
  return lc.startsWith('en') ? 'pdpl-information-notice' : 'kvkk-aydinlatma-metni';
}

/** Path without `/{locale}` prefix; `/` = ana sayfa */
export function menuPathKey(locale: string, url: string): string {
  let u = url.trim().replace(/\/+$/, '') || '/';
  if (!u.startsWith('/')) u = `/${u}`;
  const prefix = `/${locale}`;
  if (u === prefix) return '/';
  if (u.startsWith(`${prefix}/`)) {
    const rest = u.slice(prefix.length);
    return rest && rest !== '/' ? rest : '/';
  }
  try {
    if (u.includes('://')) {
      const p = new URL(u).pathname.replace(/\/+$/, '') || '/';
      if (p === prefix) return '/';
      if (p.startsWith(`${prefix}/`)) {
        const rest = p.slice(prefix.length);
        return rest && rest !== '/' ? rest : '/';
      }
    }
  } catch {
    /* ignore */
  }
  return u;
}

function isLegacyNavPath(key: string): boolean {
  const k = key.toLowerCase();
  const exact = new Set([
    '/projeler',
    '/projects',
    '/referans',
    '/referanslar',
    '/references',
    '/galeri',
    '/gallery',
    '/chat',
    '/login',
    '/register',
  ]);
  if (exact.has(k)) return true;
  return k.startsWith('/galeri/') || k.startsWith('/gallery/');
}

/** PLAN §4 omurgasi: ana, kurumsal, urunler, faaliyetler, bilgi merkezi, iletisim */
export function buildDefaultMenu(locale: string, t: TranslateFn): MenuItemLike[] {
  return [
    { title: t('home'), url: localizedPath(locale, '/') },
    { title: t('corporate'), url: localizedPath(locale, '/hakkimizda') },
    { title: t('products'), url: localizedPath(locale, '/urunler') },
    { title: t('services'), url: localizedPath(locale, '/hizmetler') },
    { title: t('knowledgeHub'), url: localizedPath(locale, '/haberler') },
    { title: t('career'), url: localizedPath(locale, HR_LIST_PATH) },
    { title: t('offer'), url: localizedPath(locale, '/teklif') },
    { title: t('contact'), url: localizedPath(locale, '/iletisim') },
  ];
}

/**
 * CMS menüsünden yalnizca izinli path'lerde baslik override alir; eski insaat / gereksiz
 * linkler ust menude gosterilmez. Sirada PLAN omurgasi korunur.
 */
export function ensureMenuItems(
  input: Record<string, unknown>[],
  locale: string,
  t: TranslateFn,
): Record<string, unknown>[] {
  const defaults = buildDefaultMenu(locale, t);
  const apiByPath = new Map<string, Record<string, unknown>>();

  for (const raw of input) {
    const url = String(raw.url ?? raw.href ?? '').trim();
    if (!url) continue;
    const key = menuPathKey(locale, url);
    if (isLegacyNavPath(key)) continue;
    apiByPath.set(key, raw);
  }

  return defaults.map((def) => {
    const key = menuPathKey(locale, def.url);
    const raw = apiByPath.get(key);
    const title = raw
      ? String(raw.title ?? (raw as { label?: string }).label ?? def.title).trim() || def.title
      : def.title;
    return { title, url: def.url } as unknown as Record<string, unknown>;
  });
}

export function buildDefaultFooterSections(
  locale: string,
  navT: TranslateFn,
  footerT: TranslateFn,
): FooterSectionLike[] {
  return [
    {
      title: footerT('sections.explore'),
      items: [
        { label: navT('products'), url: localizedPath(locale, '/urunler') },
        { label: navT('services'), url: localizedPath(locale, '/hizmetler') },
        { label: navT('knowledgeHub'), url: localizedPath(locale, '/haberler') },
        { label: navT('career'), url: localizedPath(locale, HR_LIST_PATH) },
        { label: navT('catalogs'), url: localizedPath(locale, '/kataloglar') },
        { label: navT('corporate'), url: localizedPath(locale, '/hakkimizda') },
        { label: navT('offer'), url: localizedPath(locale, '/teklif') },
        { label: navT('contact'), url: localizedPath(locale, '/iletisim') },
      ],
    },
    {
      title: footerT('sections.company'),
      items: [
        { label: navT('about'), url: localizedPath(locale, '/hakkimizda') },
        { label: navT('contact'), url: localizedPath(locale, '/iletisim') },
      ],
    },
    {
      title: footerT('sections.legal'),
      items: [
        { label: footerT('privacy'), url: localizedPath(locale, `/legal/${legalPageSlug(locale, 'privacy')}`) },
        { label: footerT('terms'), url: localizedPath(locale, `/legal/${legalPageSlug(locale, 'terms')}`) },
        { label: footerT('qualityPolicy'), url: localizedPath(locale, `/legal/${legalPageSlug(locale, 'quality')}`) },
        { label: footerT('servicePolicy'), url: localizedPath(locale, `/legal/${legalPageSlug(locale, 'service')}`) },
        { label: footerT('dataProtectionNotice'), url: localizedPath(locale, `/legal/${legalComplianceSlug(locale, 'dataNotice')}`) },
        { label: footerT('cookiePolicy'), url: localizedPath(locale, `/legal/${legalComplianceSlug(locale, 'cookies')}`) },
      ],
    },
  ];
}

export function ensureFooterSections(
  input: Record<string, unknown>[],
  locale: string,
  navT: TranslateFn,
  footerT: TranslateFn,
): Record<string, unknown>[] {
  const fallbackSections = buildDefaultFooterSections(locale, navT, footerT);

  if (input.length === 0) {
    return fallbackSections as unknown as Record<string, unknown>[];
  }

  const existingUrls = new Set<string>();
  for (const section of input) {
    const items = Array.isArray(section.items) ? section.items : [];
    for (const item of items) {
      const url = String((item as any)?.url ?? (item as any)?.href ?? '').trim();
      if (url) existingUrls.add(url);
    }
  }

  const quickLinks = fallbackSections
    .flatMap((section) => section.items)
    .filter((item) => !existingUrls.has(item.url));

  if (quickLinks.length === 0) return input;

  return [
    ...input,
    {
      title: footerT('sections.quickLinks'),
      items: quickLinks,
    },
  ];
}
