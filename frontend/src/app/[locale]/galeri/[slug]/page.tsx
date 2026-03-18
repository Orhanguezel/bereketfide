import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { API_BASE_URL, absoluteAssetUrl } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl, organizationJsonLd } from '@/seo';
import { fetchRelatedContent } from '@/lib/related-content';
import { fetchSetting } from '@/i18n/server';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedLinks } from '@/components/seo/RelatedLinks';
import { buildMediaAlt, buildMediaCaption, buildMediaSchemaText, isMeaningfulMediaDate, resolveMediaDimensions } from '@/lib/media-seo';
import { GalleryImageGrid } from '@/components/gallery/GalleryImageGrid';

const GALLERY_PLACEHOLDER_SRC = '/media/gallery-placeholder.svg';

async function fetchGallery(slug: string, locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/galleries/${encodeURIComponent(slug)}?locale=${locale}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const gallery = await fetchGallery(slug, locale);
  if (!gallery) return {};
  const t = await getTranslations({ locale });
  return buildPageMetadata({
    locale,
    pathname: `/galeri/${slug}`,
    title:
      gallery.meta_title || `${gallery.title} - ${t('seo.defaultTitle')}`,
    description:
      gallery.meta_description ||
      gallery.description ||
      t('gallery.description'),
    ogImage: gallery.cover_image_url_resolved || gallery.cover_image,
    includeLocaleAlternates: true,
  });
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const isEn = locale.startsWith('en');
  const [gallery, profile] = await Promise.all([
    fetchGallery(slug, locale),
    fetchSetting('company_profile', locale),
  ]);
  
  if (!gallery) notFound();

  const companyProfile = (profile?.value as any) ?? {};
  const companyName = companyProfile.company_name || 'Bereket Fide';

  const images = Array.isArray(gallery.images)
    ? gallery.images.map((img: any) => ({
        ...img,
        image_url_resolved: absoluteAssetUrl(img.asset_url || img.image_url) || img.image_url_resolved || GALLERY_PLACEHOLDER_SRC,
        width: img.width || img.asset_width,
        height: img.height || img.asset_height,
      }))
    : [];

  const sortedImages = images.sort((a: any, b: any) => a.display_order - b.display_order);

  // Build lightbox-ready image array for client component
  const lightboxImages = sortedImages.map((img: any) => ({
    src: img.image_url_resolved,
    alt: buildMediaAlt({
      locale,
      kind: 'gallery',
      title: gallery.title,
      alt: img.alt,
      caption: img.caption,
      description: gallery.description,
    }),
    width: img.width || 1200,
    height: img.height || 800,
    caption: buildMediaCaption({
      title: gallery.title,
      caption: img.caption,
      description: gallery.description,
    }) || undefined,
  }));

  const related = await fetchRelatedContent(gallery, slug, locale);
  const galleryUrl = localizedUrl(locale, `/galeri/${slug}`);
  const breadcrumbs = [
    { label: companyName, href: localizedPath(locale, '/') },
    { label: t('gallery.title'), href: localizedPath(locale, '/galeri') },
    { label: gallery.title },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>
      <JsonLd
        data={jsonld.graph([
          jsonld.org(organizationJsonLd(locale)),
          jsonld.imageGallery({
            name: gallery.title,
            description: gallery.description,
            url: galleryUrl,
            images: (sortedImages.length > 0 ? sortedImages : [{
              image_url_resolved: gallery.cover_image_url_resolved,
              image_url: gallery.cover_image,
              alt: gallery.cover_image_alt,
              caption: gallery.description,
              width: 1200,
              height: 800,
              updated_at: gallery.updated_at,
            }]).map((img: any) => {
              const media = buildMediaSchemaText({
                locale,
                kind: sortedImages.length > 0 ? 'gallery' : 'gallery-cover',
                title: gallery.title,
                alt: img.alt,
                caption: img.caption,
                description: gallery.description,
              });
              const dimensions = resolveMediaDimensions({
                width: img.width,
                height: img.height,
                fallbackWidth: 1200,
                fallbackHeight: 800,
              });

              return jsonld.imageObject({
                contentUrl: img.image_url_resolved || img.image_url || gallery.cover_image_url_resolved || gallery.cover_image || GALLERY_PLACEHOLDER_SRC,
                name: media.alt,
                caption: media.caption || media.alt,
                width: dimensions.width,
                height: dimensions.height,
                dateModified: isMeaningfulMediaDate(img.updated_at) ? img.updated_at : undefined,
              });
            }),
          }),
          jsonld.breadcrumb(
            breadcrumbs.map((item) => ({
              name: item.label,
              url: item.href ? localizedUrl(locale, item.href.replace(`/${locale}`, '') || '/') : galleryUrl,
            })),
          ),
        ])}
      />
      <Breadcrumbs items={breadcrumbs} />

      {/* Title + count */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {gallery.title}
        </h1>
        {sortedImages.length > 0 && (
          <span style={{ fontSize: 15, color: 'var(--color-text-muted)', fontWeight: 400 }}>
            | {sortedImages.length} {t('gallery.photos')}
          </span>
        )}
      </div>

      {gallery.description && (
        <p
          style={{
            fontSize: 14,
            color: 'var(--color-text-secondary)',
            marginTop: 6,
            maxWidth: 720,
            lineHeight: 1.6,
          }}
        >
          {gallery.description}
        </p>
      )}

      {/* Gallery images with lightbox */}
      {sortedImages.length > 0 ? (
        <div style={{ marginTop: 20 }}>
          <GalleryImageGrid images={lightboxImages} />
        </div>
      ) : (
        <div style={{ marginTop: 24, overflow: 'hidden', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
          <img
            src={gallery.cover_image_url_resolved || gallery.cover_image || GALLERY_PLACEHOLDER_SRC}
            alt={buildMediaAlt({
              locale,
              kind: 'gallery-cover',
              title: gallery.title,
              alt: gallery.cover_image_alt,
              description: gallery.description,
            })}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      )}

      {/* Related content */}
      <div style={{ marginTop: 48, display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <RelatedLinks
          title={t('common.relatedGallery')}
          hrefBase={localizedPath(locale, '/galeri')}
          items={related.galleries}
        />
        <RelatedLinks
          title={t('common.relatedProducts')}
          hrefBase={localizedPath(locale, '/projeler')}
          items={related.products}
        />
        <RelatedLinks
          title={t('common.relatedArticles')}
          hrefBase={localizedPath(locale, '/haberler')}
          items={related.blogPosts}
        />
      </div>
    </div>
  );
}
