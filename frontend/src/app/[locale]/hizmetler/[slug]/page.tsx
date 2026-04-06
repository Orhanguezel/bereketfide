import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { absoluteAssetUrl, API_BASE_URL } from '@/lib/utils';
import { normalizeRichContent } from '@/lib/rich-content';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl, organizationJsonLd } from '@/seo';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { buildMediaAlt } from '@/lib/media-seo';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedLinks } from '@/components/seo/RelatedLinks';
import { fetchRelatedContent } from '@/lib/related-content';

async function fetchService(slug: string, locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/services/by-slug/${slug}?locale=${locale}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchRelatedProjects(locale: string, limit = 4) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products?item_type=bereketfide&is_active=1&locale=${locale}&limit=${limit}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchOtherServices(locale: string, excludeSlug: string, limit = 5) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/services?module_key=bereketfide&is_active=1&locale=${locale}&limit=${limit + 1}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data as any)?.items ?? [];
    return items.filter((item: any) => item.slug !== excludeSlug).slice(0, limit);
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
  const service = await fetchService(slug, locale);
  if (!service) return {};

  return buildPageMetadata({
    locale,
    pathname: `/hizmetler/${slug}`,
    title: service.meta_title || service.title,
    description: service.meta_description || service.description,
    ogImage: absoluteAssetUrl(service.image_url) || undefined,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const isEn = locale.startsWith('en');
  const service = await fetchService(slug, locale);
  if (!service) notFound();

  const content = normalizeRichContent(service.content);
  const org = organizationJsonLd(locale);
  const imageSrc = absoluteAssetUrl(service.image_url);
  const serviceTags: string[] = Array.isArray(service.tags) ? service.tags : [];

  const [otherServices, relatedProjects, related] = await Promise.all([
    fetchOtherServices(locale, slug, 5),
    fetchRelatedProjects(locale, 4),
    fetchRelatedContent(
      {
        title: service.title,
        description: service.description || null,
        slug: service.slug || slug,
        tags: serviceTags,
      },
      slug,
      locale,
    ),
  ]);

  const breadcrumbs = [
    { label: 'Bereket Fide', href: localizedPath(locale, '/') },
    { label: isEn ? 'Activities' : 'Faaliyetler', href: localizedPath(locale, '/hizmetler') },
    { label: service.title },
  ];

  return (
    <>
      <style>{`
        .sd-title{font-family:var(--font-heading);font-size:36px;font-weight:800;color:var(--color-text-primary);line-height:1.2;margin:16px 0 24px}
        .sd-hero{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:var(--color-bg-muted);border-radius:16px;box-shadow:0 12px 24px color-mix(in srgb,var(--color-bg-dark) 6%,transparent);margin-bottom:32px}
        .sd-desc{font-size:18px;color:var(--color-text-secondary);line-height:1.7;margin-top:0;margin-bottom:24px;font-weight:500;max-width:800px}
        .sd-content{margin-top:32px;font-size:16px;line-height:1.8;color:var(--color-text-secondary)}
        .sd-content p{margin-bottom:20px}
        .sd-content h2,.sd-content h3{font-family:var(--font-heading);color:var(--color-text-primary);margin:32px 0 16px;font-weight:700}
        .sd-content a{color:var(--color-brand);text-decoration:none;font-weight:500}
        .sd-content a:hover{text-decoration:underline}
        .sd-content img{border-radius:12px;max-width:100%;height:auto;margin:24px 0}
        .sd-content ul,.sd-content ol{margin:16px 0;padding-left:24px}
        .sd-content li{margin-bottom:10px}
        .sd-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:32px}
        .sd-tag{padding:6px 14px;border-radius:24px;border:1px solid var(--color-border);font-size:13px;font-weight:600;color:var(--color-text-secondary);background:var(--color-surface);transition:all .2s ease}
        .sd-tag:hover{border-color:var(--color-brand);color:var(--color-brand)}
        .sd-sidebar-card{background:var(--color-surface);border:1px solid var(--color-border);padding:28px 24px;border-radius:16px;margin-bottom:24px;transition:box-shadow .3s ease}
        .sd-sidebar-card:hover{box-shadow:0 12px 24px color-mix(in srgb,var(--color-bg-dark) 6%,transparent)}
        .sd-sidebar-card h3{font-family:var(--font-heading);font-size:18px;font-weight:800;color:var(--color-text-primary);margin:0 0 20px;text-transform:uppercase;letter-spacing:0.05em}
        .sd-sidebar-project{display:flex;gap:16px;text-decoration:none;margin-bottom:20px;align-items:center}
        .sd-sidebar-project:last-child{margin-bottom:0}
        .sd-sidebar-project-thumb{position:relative;width:90px;height:68px;flex-shrink:0;overflow:hidden;background:var(--color-bg-muted);border-radius:8px}
        .sd-sidebar-project-title{font-size:15px;font-weight:700;color:var(--color-text-primary);line-height:1.4;transition:color .2s ease}
        .sd-sidebar-project:hover .sd-sidebar-project-title{color:var(--color-brand)}
        .sd-sidebar-item{display:block;padding:12px 0;font-size:15px;font-weight:600;color:var(--color-text-secondary);text-decoration:none;border-bottom:1px solid var(--color-border);transition:all .2s ease}
        .sd-sidebar-item:last-child{border-bottom:none}
        .sd-sidebar-item:hover{color:var(--color-brand);padding-left:4px}
        @media(min-width:1024px){.sd-layout{display:grid;grid-template-columns:1fr 380px;gap:60px}}
      `}</style>

      <JsonLd
        data={jsonld.graph([
          jsonld.org(org),
          jsonld.service({
            name: service.title,
            description: service.description,
            url: localizedUrl(locale, `/hizmetler/${slug}`),
            image: imageSrc || undefined,
          }),
          jsonld.breadcrumb(
            breadcrumbs.map((item) => ({
              name: item.label,
              url: 'href' in item && item.href
                ? localizedUrl(locale, (item.href as string).replace(`/${locale}`, '') || '/')
                : localizedUrl(locale, `/hizmetler/${slug}`),
            })),
          ),
        ])}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>

        {/* Breadcrumb */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Title */}
        <h1 className="sd-title">{service.title}</h1>

        {/* Main layout */}
        <div className="sd-layout">
          {/* LEFT COLUMN */}
          <div>
            {/* Description */}
            {service.description && (
              <p className="sd-desc">{service.description}</p>
            )}

            {/* Hero image - only if exists */}
            {imageSrc && (
              <div className="sd-hero">
                <OptimizedImage
                  src={imageSrc}
                  alt={buildMediaAlt({
                    locale,
                    kind: 'service',
                    title: service.title,
                    alt: service.alt,
                    description: service.description,
                  })}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority
                />
              </div>
            )}


            {/* Content */}
            {content && (
              <div
                className="sd-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {/* Tags */}
            {serviceTags.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 10 }}>
                  {isEn ? 'Tags' : 'Etiketler'}
                </h3>
                <div className="sd-tags">
                  {serviceTags.map((tag: string) => (
                    <span key={tag} className="sd-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: 48,
                display: 'grid',
                gap: 24,
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              }}
            >
              <RelatedLinks
                title={t('common.relatedProducts')}
                hrefBase={localizedPath(locale, '/urunler')}
                items={related.products}
              />
              <RelatedLinks
                title={t('common.relatedArticles')}
                hrefBase={localizedPath(locale, '/haberler')}
                items={related.blogPosts}
              />
              <RelatedLinks
                title={t('common.relatedKnowledgePosts')}
                hrefBase={localizedPath(locale, '/blog')}
                items={related.knowledgePosts}
              />
              <RelatedLinks
                title={t('common.relatedGallery')}
                hrefBase={localizedPath(locale, '/galeri')}
                items={related.galleries}
              />
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside>
            {/* Related projects */}
            {relatedProjects.length > 0 && (
              <div className="sd-sidebar-card">
                <h3>{isEn ? 'Related Products' : 'İlgili Ürünler'}</h3>
                {relatedProjects.map((p: any) => (
                  <Link
                    key={p.id ?? p.title}
                    href={p.slug ? localizedPath(locale, `/urunler/${p.slug}`) : '#'}
                    className="sd-sidebar-project"
                  >
                    {absoluteAssetUrl(p.image_url) && (
                      <div className="sd-sidebar-project-thumb">
                        <OptimizedImage
                          src={absoluteAssetUrl(p.image_url)!}
                          alt={p.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}
                    <div>
                      <span className="sd-sidebar-project-title">{p.title}</span>
                      {(p.specifications?.lokasyon || p.specifications?.location) && (
                        <span style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                          {p.specifications.lokasyon || p.specifications.location}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
                <Link
                  href={localizedPath(locale, '/urunler')}
                  style={{ fontSize: 13, color: 'var(--color-brand)', textDecoration: 'none', marginTop: 10, display: 'inline-block' }}
                >
                  {isEn ? 'All Products »' : 'Tüm Ürünler »'}
                </Link>
              </div>
            )}

            {/* Other services */}
            {otherServices.length > 0 && (
              <div className="sd-sidebar-card">
                <h3>{isEn ? 'Other Activities' : 'Diğer Faaliyetler'}</h3>
                {otherServices.map((s: any) => (
                  <Link
                    key={s.id ?? s.title}
                    href={s.slug ? localizedPath(locale, `/hizmetler/${s.slug}`) : '#'}
                    className="sd-sidebar-item"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Offer CTA sidebar */}
            <div
              className="sd-sidebar-card"
              style={{ background: 'var(--color-surface)', borderTop: '4px solid var(--color-brand)' }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>{t('common.offerCtaTitle')}</h3>
              <p style={{ fontSize: 15, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {t('common.offerCtaDescription')}
              </p>
              <Link
                href={localizedPath(locale, '/teklif')}
                className="mt-5 flex items-center justify-center rounded-lg bg-(--color-brand) px-5 py-3 text-sm font-bold uppercase tracking-wide text-(--color-on-brand) no-underline transition-opacity hover:opacity-85"
              >
                {t('common.requestOffer')}
              </Link>
            </div>

            {/* All services link */}
            <Link
              href={localizedPath(locale, '/hizmetler')}
              className="flex items-center justify-center rounded-lg border-2 border-(--color-brand) px-4 py-3.5 text-sm font-bold text-(--color-brand-text) no-underline transition-colors hover:bg-(--color-brand) hover:text-(--color-on-brand)"
            >
              {isEn ? '← All Activities' : '← Tüm Faaliyetler'}
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
