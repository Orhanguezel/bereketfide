import 'server-only';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { API_BASE_URL, absoluteAssetUrl } from '@/lib/utils';
import { buildPageMetadata, localizedPath } from '@/seo';
import { DownloadButton } from '@/components/catalog/DownloadButton';

type CatalogItem = {
  id: string;
  slug?: string | null;
  name?: string | null;
  description?: string | null;
  image_url?: string | null;
  featured_image?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
};

type CatalogFile = {
  id: string;
  file_url?: string | null;
  file_public_url?: string | null;
  name?: string | null;
};

function resolveAsset(value?: string | null) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return absoluteAssetUrl(value) || value;
}

async function fetchCatalogBySlug(locale: string, slug: string): Promise<CatalogItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/library/by-slug/${slug}?locale=${locale}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchCatalogFiles(id: string): Promise<CatalogFile[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/library/${id}/files`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function fetchCatalogs(locale: string): Promise<CatalogItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/library?locale=${locale}&type=catalog&limit=8`, {
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
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const catalog = await fetchCatalogBySlug(locale, slug);

  if (!catalog) {
    return buildPageMetadata({
      locale,
      pathname: `/kataloglar/${slug}`,
      title: t('catalog.title'),
      description: t('catalog.description'),
    });
  }

  return buildPageMetadata({
    locale,
    pathname: `/kataloglar/${slug}`,
    title: catalog.meta_title || catalog.name || t('catalog.title'),
    description: catalog.meta_description || catalog.description || t('catalog.description'),
    ogImage: resolveAsset(catalog.image_url || catalog.featured_image) || undefined,
  });
}

export default async function CatalogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const catalog = await fetchCatalogBySlug(locale, slug);

  if (!catalog?.id) notFound();

  const [files, relatedCatalogs] = await Promise.all([
    fetchCatalogFiles(catalog.id),
    fetchCatalogs(locale),
  ]);

  const image = resolveAsset(catalog.image_url || catalog.featured_image);
  const primaryFile = files[0];
  const fileUrl = resolveAsset(primaryFile?.file_public_url || primaryFile?.file_url);
  const sidebarItems = relatedCatalogs.filter((item) => item.id !== catalog.id).slice(0, 3);

  return (
    <div className="bg-(--color-bg-secondary) py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <Link
          href={localizedPath(locale, '/kataloglar')}
          className="mb-6 inline-flex text-sm font-medium text-(--color-brand-text) hover:underline"
        >
          {t('catalog.backToCatalogs')}
        </Link>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <div>
            <h1
              className="text-3xl font-bold text-(--color-text-primary) lg:text-4xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {catalog.name}
            </h1>

            {catalog.description ? (
              <p className="mt-4 max-w-3xl text-sm leading-7 text-(--color-text-secondary)">
                {catalog.description}
              </p>
            ) : null}

            {image ? (
              <div className="relative mt-8 aspect-16/10 overflow-hidden bg-(--color-bg-muted)">
                <OptimizedImage
                  src={image}
                  alt={catalog.name || t('catalog.title')}
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}

            {fileUrl ? (
              <>
                <div className="mt-6 flex flex-wrap gap-3">
                  <DownloadButton
                    catalogId={catalog.id}
                    fileUrl={fileUrl}
                    label={t('catalog.openCatalog')}
                    variant="primary"
                  />
                  <DownloadButton
                    catalogId={catalog.id}
                    fileUrl={fileUrl}
                    label={t('catalog.downloadCatalog')}
                    variant="outline"
                    download
                  />
                </div>

                <div className="mt-8 overflow-hidden border border-(--color-border) bg-(--color-bg-muted)">
                  <iframe
                    src={fileUrl}
                    title={catalog.name || t('catalog.title')}
                    className="h-[900px] w-full"
                  />
                </div>
              </>
            ) : (
              <div className="mt-8 rounded-3xl border border-dashed border-(--color-border) px-6 py-10 text-sm text-(--color-text-secondary)">
                {t('catalog.noFile')}
              </div>
            )}
          </div>

          <aside className="mt-12 lg:mt-0">
            <div className="sticky top-24 border-b border-(--color-border) pb-6">
              <h2
                className="mb-5 text-lg font-bold text-(--color-text-primary)"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t('catalog.sidebarTitle')}
              </h2>

              <div className="space-y-5">
                {sidebarItems.map((item) => {
                  const sidebarImage = resolveAsset(item.image_url || item.featured_image);
                  return (
                    <Link
                      key={item.id}
                      href={localizedPath(locale, `/kataloglar/${item.slug}`)}
                      className="group flex gap-3"
                    >
                      {sidebarImage ? (
                        <div className="relative aspect-4/3 w-24 shrink-0 overflow-hidden bg-(--color-bg-muted)">
                          <OptimizedImage
                            src={sidebarImage}
                            alt={item.name || t('catalog.title')}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : null}
                      <div>
                        <div className="text-sm font-semibold leading-6 text-(--color-text-primary) transition-colors group-hover:text-(--color-brand-text)">
                          {item.name}
                        </div>
                        {item.description ? (
                          <div className="mt-1 line-clamp-2 text-xs leading-5 text-(--color-text-muted)">
                            {item.description}
                          </div>
                        ) : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
