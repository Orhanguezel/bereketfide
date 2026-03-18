import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { API_BASE_URL, absoluteAssetUrl } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { buildMediaAlt } from '@/lib/media-seo';
import { SeoIssueBeacon } from '@/components/monitoring/SeoIssueBeacon';

import { fetchSetting } from '@/i18n/server';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

const GALLERY_PLACEHOLDER_SRC = '/media/gallery-placeholder.svg';

async function fetchGalleries(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/galleries?module_key=bereketfide&is_active=1&locale=${locale}&limit=50&sort=display_order&order=asc`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

import { fetchSeoPage } from '@/seo/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await fetchSeoPage(locale, 'galeri');
  const t = await getTranslations({ locale });

  return buildPageMetadata({
    locale,
    pathname: '/galeri',
    title: seo?.title || `${t('gallery.title')} - ${t('seo.defaultTitle')}`,
    description: seo?.description || t('gallery.description'),
    ogImage: seo?.og_image || undefined,
    noIndex: seo?.no_index,
  });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isEn = locale.startsWith('en');
  const [galleries, profile] = await Promise.all([
    fetchGalleries(locale),
    fetchSetting('company_profile', locale),
  ]);

  const companyProfile = (profile?.value as any) ?? {};
  const companyName = companyProfile.company_name || 'Bereket Fide';

  const visibleGalleries = galleries;
  const featured = visibleGalleries[0];
  const rest = visibleGalleries.slice(1);

  return (
    <>
      <style>{`
        .gl-page-title{font-family:var(--font-heading);font-size:28px;font-weight:800;color:var(--color-text-primary);line-height:1.2;margin:0 0 6px}
        .gl-page-desc{font-size:14px;color:var(--color-text-secondary);max-width:720px;line-height:1.6;margin-bottom:24px}
        .gl-featured{display:block;text-decoration:none;margin-bottom:32px}
        .gl-featured-img{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:var(--color-bg-muted)}
        .gl-featured-img img{transition:transform .4s ease}
        .gl-featured:hover .gl-featured-img img{transform:scale(1.03)}
        .gl-featured-overlay{position:absolute;bottom:0;left:0;right:0;padding:24px 20px;background:linear-gradient(transparent,rgba(0,0,0,.6))}
        .gl-featured-title{font-family:var(--font-heading);font-size:22px;font-weight:700;color:#fff;line-height:1.3;margin:0}
        .gl-featured-meta{display:flex;gap:16px;margin-top:6px;font-size:13px;color:rgba(255,255,255,.75)}
        .gl-grid{display:grid;grid-template-columns:1fr;gap:16px}
        @media(min-width:640px){.gl-grid{grid-template-columns:repeat(2,1fr)}}
        @media(min-width:1024px){.gl-grid{grid-template-columns:repeat(3,1fr)}}
        .gl-card{display:block;text-decoration:none;position:relative;overflow:hidden}
        .gl-card-img{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--color-bg-muted)}
        .gl-card-img img{transition:transform .3s ease}
        .gl-card:hover .gl-card-img img{transform:scale(1.05)}
        .gl-card-overlay{position:absolute;bottom:0;left:0;right:0;padding:14px 12px;background:linear-gradient(transparent,rgba(0,0,0,.55));opacity:0;transition:opacity .25s}
        .gl-card:hover .gl-card-overlay{opacity:1}
        .gl-card-info{padding:10px 0}
        .gl-card-title{font-family:var(--font-heading);font-size:16px;font-weight:700;color:var(--color-text-primary);line-height:1.3;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .gl-card:hover .gl-card-title{color:var(--color-brand)}
        .gl-card-count{font-size:12px;color:var(--color-text-muted);margin-top:2px}
        .gl-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;background:rgba(0,0,0,.55);color:#fff;font-size:12px;font-weight:600;position:absolute;top:12px;right:12px;z-index:2;backdrop-filter:blur(4px)}
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>
        <JsonLd
          data={jsonld.graph([
            jsonld.collectionPage({
              name: t('gallery.title'),
              description: t('gallery.description'),
              url: localizedUrl(locale, '/galeri'),
              mainEntity: jsonld.itemList(
                visibleGalleries.map((gallery: any) => ({
                  name: gallery.title,
                  url: gallery.slug
                    ? localizedUrl(locale, `/galeri/${gallery.slug}`)
                    : localizedUrl(locale, '/galeri'),
                })),
              ),
            }),
          ])}
        />

        {/* Breadcrumb */}
        <Breadcrumbs items={[
          { label: companyName, href: localizedPath(locale, '/') },
          { label: t('gallery.title') },
        ]} />

        {/* Page title */}
        <h1 className="gl-page-title">{t('gallery.title')}</h1>
        <p className="gl-page-desc">{t('gallery.description')}</p>

        {/* Empty state */}
        {galleries.length === 0 && (
          <>
            <SeoIssueBeacon
              type="soft-404"
              pathname={localizedPath(locale, '/galeri')}
              reason="gallery-list-empty"
            />
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
              {t('gallery.emptyStateNote')}
            </p>
          </>
        )}

        {/* Featured gallery (hero) */}
        {featured && (
          <Link
            href={featured.slug ? localizedPath(locale, `/galeri/${featured.slug}`) : localizedPath(locale, '/galeri')}
            className="gl-featured"
          >
            <div className="gl-featured-img">
              <OptimizedImage
                src={absoluteAssetUrl(featured.cover_image_url) || featured.cover_image || featured.imageSrc || GALLERY_PLACEHOLDER_SRC}
                alt={buildMediaAlt({
                  locale,
                  kind: 'gallery-cover',
                  title: featured.title,
                  alt: featured.cover_image_alt,
                  description: featured.description,
                })}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1280px"
                priority
              />
              {/* Image count badge */}
              {featured.image_count > 0 && (
                <span className="gl-badge">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="14" height="14" rx="1"/><circle cx="5.5" cy="5.5" r="1.5"/><path d="M1 12l4-4 3 3 2.5-2.5L15 13"/></svg>
                  {featured.image_count}
                </span>
              )}
              <div className="gl-featured-overlay">
                <h2 className="gl-featured-title">{featured.title}</h2>
                <div className="gl-featured-meta">
                  {featured.description && <span>{featured.description}</span>}
                  {featured.image_count > 0 && (
                    <span>{featured.image_count} {t('gallery.photos')}</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Gallery grid */}
        {rest.length > 0 && (
          <div className="gl-grid">
            {rest.map((g: any) => (
              <Link
                key={g.id ?? g.title}
                href={g.slug ? localizedPath(locale, `/galeri/${g.slug}`) : localizedPath(locale, '/galeri')}
                className="gl-card"
              >
                <div className="gl-card-img">
                  <OptimizedImage
                    src={absoluteAssetUrl(g.cover_image_url) || g.cover_image || g.imageSrc || GALLERY_PLACEHOLDER_SRC}
                    alt={buildMediaAlt({
                      locale,
                      kind: 'gallery-cover',
                      title: g.title,
                      alt: g.cover_image_alt,
                      description: g.description,
                    })}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {g.image_count > 0 && (
                    <span className="gl-badge">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="14" height="14" rx="1"/><circle cx="5.5" cy="5.5" r="1.5"/><path d="M1 12l4-4 3 3 2.5-2.5L15 13"/></svg>
                      {g.image_count}
                    </span>
                  )}
                  <div className="gl-card-overlay">
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
                      {g.title}
                    </span>
                  </div>
                </div>
                <div className="gl-card-info">
                  <h3 className="gl-card-title">{g.title}</h3>
                  <p className="gl-card-count">
                    {g.image_count > 0
                      ? `${g.image_count} ${t('gallery.photos')}`
                      : t('gallery.title')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
