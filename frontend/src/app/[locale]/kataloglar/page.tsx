import 'server-only';

import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { API_BASE_URL, absoluteAssetUrl } from '@/lib/utils';
import { buildPageMetadata, localizedPath } from '@/seo';
import { fetchSeoPage } from '@/seo/server';

type CatalogItem = {
  id: string;
  slug?: string | null;
  name?: string | null;
  description?: string | null;
  image_url?: string | null;
  featured_image?: string | null;
};

function resolveImage(value?: string | null) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return absoluteAssetUrl(value) || value;
}

async function fetchCatalogs(locale: string): Promise<CatalogItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/library?locale=${locale}&type=catalog&limit=12`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.items ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [seo, t] = await Promise.all([
    fetchSeoPage(locale, 'kataloglar'),
    getTranslations({ locale }),
  ]);

  return buildPageMetadata({
    locale,
    pathname: '/kataloglar',
    title: seo?.title || t('catalog.title'),
    description: seo?.description || t('catalog.description'),
    ogImage: seo?.og_image || undefined,
    noIndex: seo?.no_index,
  });
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const catalogs = await fetchCatalogs(locale);

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-(--color-brand-text)">
            {t('catalog.title')}
          </div>
          <h1
            className="mt-3 text-3xl font-bold text-(--color-text-primary) lg:text-4xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('catalog.title')}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-(--color-text-secondary)">
            {t('catalog.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {catalogs.map((catalog) => {
            const image = resolveImage(catalog.image_url || catalog.featured_image);
            const href = localizedPath(locale, `/kataloglar/${catalog.slug}`);

            return (
              <Link
                key={catalog.id}
                href={href}
                className="group flex h-full flex-col border border-(--color-border) bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {image ? (
                  <div className="relative aspect-4/3 overflow-hidden bg-(--color-bg-muted)">
                    <OptimizedImage
                      src={image}
                      alt={catalog.name || t('catalog.title')}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-6">
                  <h2
                    className="text-xl font-bold uppercase leading-tight text-(--color-text-primary)"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {catalog.name}
                  </h2>
                  {catalog.description ? (
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-(--color-text-secondary)">
                      {catalog.description}
                    </p>
                  ) : null}
                  <span className="mt-6 text-sm font-semibold text-(--color-brand-text)">
                    {t('catalog.viewCatalog')}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
