import type { MetadataRoute } from 'next';
import { localizedUrl } from '@/seo/helpers';
import { AVAILABLE_LOCALES } from '@/i18n/locales';
import { API_BASE_URL } from '@/lib/utils';

type SitemapItem = {
  slug: string;
  updated_at?: string | null;
  created_at?: string | null;
  title?: string | null;
  description?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
};

function withDefaultParams(endpoint: string): string {
  const joiner = endpoint.includes('?') ? '&' : '?';
  return `${API_BASE_URL}${endpoint}${joiner}is_active=1&limit=500`;
}

async function fetchItems(endpoint: string): Promise<SitemapItem[]> {
  try {
    const res = await fetch(withDefaultParams(endpoint), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data as any)?.items ?? [];
    return items
      .filter((item: any) => item?.slug)
      .map((item: any) => ({
        slug: item.slug,
        updated_at: item.updated_at ?? null,
        created_at: item.created_at ?? null,
        title: item.title ?? item.name ?? null,
        description: item.description ?? item.meta_description ?? null,
        image_url:
          item.image_url ??
          item.image_url_resolved ??
          item.cover_image_url_resolved ??
          item.cover_image ??
          null,
        image_alt: item.alt ?? item.cover_image_alt ?? item.title ?? item.name ?? null,
      }));
  } catch {
    return [];
  }
}

async function fetchLegalItemsForLocale(locale: string): Promise<SitemapItem[]> {
  const lc = String(locale || 'tr').toLowerCase();
  const policySlugs = lc.startsWith('tr')
    ? ['kalite-politikasi', 'hizmet-politikasi']
    : lc.startsWith('de')
      ? ['qualitaetspolitik', 'servicepolitik']
      : ['quality-policy', 'service-policy'];
  const kvkkOrPdpl = lc.startsWith('en') ? 'pdpl-information-notice' : 'kvkk-aydinlatma-metni';
  const legalSlugs = ['privacy', 'terms', ...policySlugs, kvkkOrPdpl, 'cookies'];

  const rows = await Promise.all(
    legalSlugs.map(async (slug) => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/custom-pages/by-slug/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
          { next: { revalidate: 3600 } },
        );
        if (!res.ok) return null;
        const data = await res.json();
        if (!data?.slug) return null;
        return {
          slug: data.slug,
          updated_at: data.updated_at ?? null,
          created_at: data.created_at ?? null,
        } satisfies SitemapItem;
      } catch {
        return null;
      }
    }),
  );

  return rows.filter(Boolean) as SitemapItem[];
}

/** Public liste; `custom-pages` icin `limit` max 250 (backend sema). */
async function fetchPublishedCustomPages(locale: string, moduleKey: string): Promise<SitemapItem[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom-pages?module_key=${encodeURIComponent(moduleKey)}&locale=${encodeURIComponent(locale)}&limit=250`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data as any)?.items ?? [];
    return items
      .filter((item: any) => item?.slug)
      .map((item: any) => ({
        slug: item.slug,
        updated_at: item.updated_at ?? null,
        created_at: item.created_at ?? null,
        title: item.title ?? null,
        description: item.meta_description ?? item.summary ?? null,
        image_url:
          item.featured_image_url_resolved ??
          item.featured_image ??
          item.cover_image_url_resolved ??
          item.cover_image ??
          null,
        image_alt: item.title ?? null,
      }));
  } catch {
    return [];
  }
}

/** Kutuphane listesi; `limit` max 200 (backend sema). */
async function fetchLibraryCatalogItems(locale: string): Promise<SitemapItem[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/library?locale=${encodeURIComponent(locale)}&type=catalog&limit=200`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data as any)?.items ?? [];
    return items
      .filter((item: any) => item?.slug)
      .map((item: any) => ({
        slug: item.slug,
        updated_at: item.updated_at ?? null,
        created_at: item.created_at ?? null,
        title: item.name ?? item.title ?? null,
        description: item.description ?? item.meta_description ?? null,
        image_url: item.image_url ?? item.featured_image ?? null,
        image_alt: item.name ?? item.title ?? null,
      }));
  } catch {
    return [];
  }
}

function resolveLastModified(item?: SitemapItem): Date | undefined {
  const value = item?.updated_at || item?.created_at;
  return value ? new Date(value) : undefined;
}

function toAbsoluteImageUrl(value?: string | null): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith('/') ? value : `/${value}`;
  return `${API_BASE_URL.replace(/\/api\/?$/, '')}${normalized}`;
}

function resolveSitemapImages(item?: SitemapItem): string[] | undefined {
  const url = toAbsoluteImageUrl(item?.image_url);
  return url ? [url] : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = AVAILABLE_LOCALES;

  const entries: MetadataRoute.Sitemap = [];

  const staticRoutes = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/urunler', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/hizmetler', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/galeri', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/haberler', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/blog', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/kataloglar', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/hakkimizda', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/insan-kaynaklari', changeFrequency: 'monthly' as const, priority: 0.55 },
    { path: '/iletisim', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/teklif', changeFrequency: 'monthly' as const, priority: 0.8 },
  ];

  for (const locale of locales) {
    const [products, services, galleries, newsPosts, blogPosts, catalogs, legalPages] = await Promise.all([
      fetchItems(`/products?item_type=bereketfide&locale=${encodeURIComponent(locale)}`),
      fetchItems(`/services?module_key=bereketfide&locale=${encodeURIComponent(locale)}`),
      fetchItems(`/galleries?module_key=bereketfide&locale=${encodeURIComponent(locale)}`),
      fetchPublishedCustomPages(locale, 'news'),
      fetchPublishedCustomPages(locale, 'blog'),
      fetchLibraryCatalogItems(locale),
      fetchLegalItemsForLocale(locale),
    ]);

    for (const route of staticRoutes) {
      entries.push({
        url: localizedUrl(locale, route.path || '/'),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }

    for (const item of products) {
      entries.push({
        url: localizedUrl(locale, `/urunler/${item.slug}`),
        lastModified: resolveLastModified(item),
        changeFrequency: 'weekly',
        priority: 0.8,
        images: resolveSitemapImages(item),
      });
    }

    for (const item of services) {
      entries.push({
        url: localizedUrl(locale, `/hizmetler/${item.slug}`),
        lastModified: resolveLastModified(item),
        changeFrequency: 'monthly',
        priority: 0.8,
        images: resolveSitemapImages(item),
      });
    }

    for (const item of galleries) {
      entries.push({
        url: localizedUrl(locale, `/galeri/${item.slug}`),
        lastModified: resolveLastModified(item),
        changeFrequency: 'monthly',
        priority: 0.6,
        images: resolveSitemapImages(item),
      });
    }

    for (const item of newsPosts) {
      entries.push({
        url: localizedUrl(locale, `/haberler/${item.slug}`),
        lastModified: resolveLastModified(item),
        changeFrequency: 'monthly',
        priority: 0.7,
        images: resolveSitemapImages(item),
      });
    }

    for (const item of blogPosts) {
      entries.push({
        url: localizedUrl(locale, `/blog/${item.slug}`),
        lastModified: resolveLastModified(item),
        changeFrequency: 'monthly',
        priority: 0.65,
        images: resolveSitemapImages(item),
      });
    }

    for (const item of catalogs) {
      entries.push({
        url: localizedUrl(locale, `/kataloglar/${item.slug}`),
        lastModified: resolveLastModified(item),
        changeFrequency: 'monthly',
        priority: 0.55,
        images: resolveSitemapImages(item),
      });
    }

    for (const item of legalPages) {
      entries.push({
        url: localizedUrl(locale, `/legal/${item.slug}`),
        lastModified: resolveLastModified(item),
        changeFrequency: 'yearly',
        priority: 0.3,
      });
    }
  }

  return entries;
}
