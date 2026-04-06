import api from '@/lib/axios';
import { localizedPath } from '@/seo';
import { HR_LIST_PATH } from '@/lib/hr-page';

export type SiteSearchHitType =
  | 'product'
  | 'service'
  | 'news'
  | 'blog'
  | 'catalog'
  | 'legal'
  | 'corporate';

export type SiteSearchHit = {
  id: string;
  title: string;
  type: SiteSearchHitType;
  url: string;
  description?: string;
};

function asArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object' && Array.isArray((data as { items?: unknown }).items)) {
    return (data as { items: T[] }).items;
  }
  return [];
}

const MIN_QUERY_LEN = 2;

const HR_SLUGS = new Set(['insan-kaynaklari', 'careers', 'karriere']);

export function siteSearchQueryValid(q: string): boolean {
  return q.trim().length >= MIN_QUERY_LEN;
}

function customPageUrl(locale: string, moduleKey: string, slug: string): string | null {
  if (!slug) return null;

  if (moduleKey === 'news') {
    return localizedPath(locale, `/haberler/${encodeURIComponent(slug)}`);
  }
  if (moduleKey === 'blog') {
    return localizedPath(locale, `/blog/${encodeURIComponent(slug)}`);
  }
  if (moduleKey === 'bereketfide_legal') {
    return localizedPath(locale, `/legal/${encodeURIComponent(slug)}`);
  }
  if (moduleKey === 'bereketfide_about') {
    if (slug === 'about') return localizedPath(locale, '/hakkimizda');
    if (HR_SLUGS.has(slug)) return localizedPath(locale, HR_LIST_PATH);
    return localizedPath(locale, '/hakkimizda');
  }

  return null;
}

function customPageType(moduleKey: string, slug: string): SiteSearchHitType | null {
  if (moduleKey === 'news') return 'news';
  if (moduleKey === 'blog') return 'blog';
  if (moduleKey === 'bereketfide_legal') return 'legal';
  if (moduleKey === 'bereketfide_about') return 'corporate';
  return null;
}

export async function fetchSiteSearch(locale: string, rawQuery: string): Promise<SiteSearchHit[]> {
  const q = rawQuery.trim();
  if (!siteSearchQueryValid(q)) return [];

  const [productsRes, servicesRes, libraryRes, pagesRes] = await Promise.all([
    api
      .get<unknown>('/products', {
        params: { q, locale, item_type: 'bereketfide', is_active: '1', limit: 20 },
      })
      .catch(() => ({ data: [] })),
    api
      .get<unknown>('/services', {
        params: { q, locale, module_key: 'bereketfide', is_active: '1', limit: 15 },
      })
      .catch(() => ({ data: [] })),
    api
      .get<unknown>('/library', {
        params: { q, locale, type: 'catalog', limit: 12 },
      })
      .catch(() => ({ data: [] })),
    api
      .get<unknown>('/custom-pages', {
        params: { search: q, locale, is_published: '1', limit: 25 },
      })
      .catch(() => ({ data: [] })),
  ]);

  const hits: SiteSearchHit[] = [];

  for (const p of asArray<Record<string, unknown>>(productsRes.data)) {
    const slug = typeof p.slug === 'string' ? p.slug : '';
    const id = typeof p.id === 'string' ? p.id : slug;
    if (!slug) continue;
    const title = typeof p.title === 'string' && p.title ? p.title : slug;
    const summary = typeof p.summary === 'string' ? p.summary : undefined;
    const metaDesc = typeof p.meta_description === 'string' ? p.meta_description : undefined;
    hits.push({
      id,
      title,
      type: 'product',
      url: localizedPath(locale, `/urunler/${encodeURIComponent(slug)}`),
      description: summary ?? metaDesc,
    });
  }

  for (const s of asArray<Record<string, unknown>>(servicesRes.data)) {
    const slug = typeof s.slug === 'string' ? s.slug : '';
    const id = typeof s.id === 'string' ? s.id : slug;
    if (!slug) continue;
    const title = typeof s.title === 'string' && s.title ? s.title : slug;
    const summary = typeof s.summary === 'string' ? s.summary : undefined;
    hits.push({
      id,
      title,
      type: 'service',
      url: localizedPath(locale, `/hizmetler/${encodeURIComponent(slug)}`),
      description: summary ?? undefined,
    });
  }

  for (const row of asArray<Record<string, unknown>>(libraryRes.data)) {
    const slug = typeof row.slug === 'string' ? row.slug : '';
    const id = typeof row.id === 'string' ? row.id : slug;
    if (!slug) continue;
    const name = typeof row.name === 'string' && row.name.trim() ? row.name : '';
    const titleField = typeof row.title === 'string' && row.title.trim() ? row.title : '';
    const title = name || titleField || slug;
    const description = typeof row.description === 'string' ? row.description : undefined;
    hits.push({
      id,
      title,
      type: 'catalog',
      url: localizedPath(locale, `/kataloglar/${encodeURIComponent(slug)}`),
      description,
    });
  }

  for (const row of asArray<Record<string, unknown>>(pagesRes.data)) {
    const slug = typeof row.slug === 'string' ? row.slug : '';
    const moduleKey = typeof row.module_key === 'string' ? row.module_key : '';
    const id = typeof row.id === 'string' ? row.id : slug;
    if (!slug || !moduleKey) continue;

    const hitType = customPageType(moduleKey, slug);
    const url = customPageUrl(locale, moduleKey, slug);
    if (!hitType || !url) continue;

    const title = typeof row.title === 'string' && row.title ? row.title : slug;
    const summary = typeof row.summary === 'string' ? row.summary : undefined;
    hits.push({
      id,
      title,
      type: hitType,
      url,
      description: summary ?? undefined,
    });
  }

  const order: Record<SiteSearchHitType, number> = {
    product: 0,
    catalog: 1,
    service: 2,
    corporate: 3,
    legal: 4,
    news: 5,
    blog: 6,
  };
  hits.sort((a, b) => {
    const d = order[a.type] - order[b.type];
    return d !== 0 ? d : a.title.localeCompare(b.title, locale, { sensitivity: 'base' });
  });

  return hits;
}
