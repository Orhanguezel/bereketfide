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
    title: seo?.title || t('gallery.title'),
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
  const [galleries, profile] = await Promise.all([
    fetchGalleries(locale),
    fetchSetting('company_profile', locale),
  ]);

  const companyProfile = (profile?.value as any) ?? {};
  const companyName = companyProfile.company_name || 'Bereket Fide';

  const visibleGalleries = galleries;
  const totalCount = visibleGalleries.length;

  return (
    <div style={{ background: 'var(--color-bg)' }}>
      <style>{`
        .gl-grid{display:grid;grid-template-columns:1fr;gap:24px;margin-top:32px}
        @media(min-width:640px){.gl-grid{grid-template-columns:repeat(2,1fr)}}
        @media(min-width:1024px){.gl-grid{grid-template-columns:repeat(3,1fr)}}
        .gl-card{display:block;text-decoration:none;border:1px solid var(--color-border);background:var(--color-surface);transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);overflow:hidden}
        .gl-card:hover{border-color:var(--color-brand);transform:translateY(-4px);box-shadow:0 20px 40px rgba(0,0,0,0.1)}
        .gl-card-media{position:relative;aspect-ratio:16/10;overflow:hidden;background:var(--color-bg-muted)}
        .gl-card-media img{transition:transform .5s cubic-bezier(0.4, 0, 0.2, 1)}
        .gl-card:hover .gl-card-media img{transform:scale(1.08)}
        .gl-card-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:rgba(20,20,20,0.7);color:#fff;font-size:12px;font-weight:600;position:absolute;top:16px;right:16px;z-index:2;backdrop-filter:blur(8px);border-radius:2px}
        .gl-card-body{padding:20px 20px 24px}
        .gl-card-title{font-family:var(--font-heading);font-size:20px;font-weight:800;color:var(--color-text-primary);line-height:1.3;margin:0;transition:color .2s ease}
        .gl-card:hover .gl-card-title{color:var(--color-brand)}
        .gl-card-desc{font-size:14px;color:var(--color-text-secondary);line-height:1.6;margin:12px 0 0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;min-height:67px}
        .gl-card-meta{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:16px;padding-top:16px;border-top:1px solid var(--color-border);font-size:11px;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:0.1em;font-weight:700}
        .gl-card-cta{color:var(--color-brand);display:flex;align-items:center;gap:4px}
        .gl-card-cta::after{content:'→';transition:transform .2s ease}
        .gl-card:hover .gl-card-cta::after{transform:translateX(4px)}
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 48px' }}>
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

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {t('gallery.title')}
          </h1>
          <span style={{ fontSize: 15, color: 'var(--color-text-muted)', fontWeight: 400 }}>
            | {totalCount} {t('gallery.results')}
          </span>
        </div>

        <p
          style={{
            fontSize: 14,
            color: 'var(--color-text-secondary)',
            marginTop: 6,
            maxWidth: 720,
            lineHeight: 1.6,
          }}
        >
          {t('gallery.description')}
        </p>

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

        {visibleGalleries.length > 0 && (
          <div className="gl-grid">
            {visibleGalleries.map((g: any, index: number) => (
              <Link
                key={g.id ?? g.title}
                href={g.slug ? localizedPath(locale, `/galeri/${g.slug}`) : localizedPath(locale, '/galeri')}
                className="gl-card"
              >
                <div className="gl-card-media">
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
                    priority={index < 3}
                  />
                  {g.image_count > 0 && (
                    <span className="gl-card-badge">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="14" height="14" rx="1"/><circle cx="5.5" cy="5.5" r="1.5"/><path d="M1 12l4-4 3 3 2.5-2.5L15 13"/></svg>
                      {g.image_count} {t('gallery.photos')}
                    </span>
                  )}
                </div>
                <div className="gl-card-body">
                  <h3 className="gl-card-title">{g.title}</h3>
                  <p className="gl-card-desc">
                    {g.description || t('gallery.description')}
                  </p>
                  <div className="gl-card-meta">
                    <span>
                      {g.image_count > 0 ? `${g.image_count} ${t('gallery.photos')}` : t('gallery.title')}
                    </span>
                    <span className="gl-card-cta">{t('common.viewAll')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
