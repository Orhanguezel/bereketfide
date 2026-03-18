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
    title: service.meta_title || (locale.startsWith('en')
      ? `${service.title} | Bereket Fide Activities`
      : `${service.title} | Bereket Fide Faaliyetleri`),
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
  const [otherServices, relatedProjects] = await Promise.all([
    fetchOtherServices(locale, slug, 5),
    fetchRelatedProjects(locale, 4),
  ]);

  const breadcrumbs = [
    { label: 'Bereket Fide', href: localizedPath(locale, '/') },
    { label: isEn ? 'Activities' : 'Faaliyetler', href: localizedPath(locale, '/hizmetler') },
    { label: service.title },
  ];

  return (
    <>
      <style>{`
        .sd-title{font-family:var(--font-heading);font-size:28px;font-weight:700;color:var(--color-text-primary);line-height:1.25;margin:4px 0 16px}
        .sd-hero{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:var(--color-bg-muted);margin-top:16px}
        .sd-desc{font-size:16px;color:var(--color-text-secondary);line-height:1.7;margin-top:16px;max-width:720px}
        .sd-content{margin-top:24px;font-size:15px;line-height:1.8;color:var(--color-text-secondary)}
        .sd-content p{margin-bottom:16px}
        .sd-content h2,.sd-content h3{font-family:var(--font-heading);color:var(--color-text-primary);margin:28px 0 12px}
        .sd-content a{color:var(--color-brand);text-decoration:none}
        .sd-content a:hover{text-decoration:underline}
        .sd-content img{max-width:100%;height:auto;margin:16px 0}
        .sd-content ul,.sd-content ol{margin:12px 0;padding-left:24px}
        .sd-content li{margin-bottom:8px}
        .sd-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:24px}
        .sd-tag{padding:4px 12px;border-radius:2px;border:1px solid var(--color-border);font-size:12px;color:var(--color-text-secondary)}
        .sd-sidebar-card{border:1px solid var(--color-border);padding:20px;margin-bottom:20px}
        .sd-sidebar-card h3{font-family:var(--font-heading);font-size:18px;font-weight:700;color:var(--color-text-primary);margin:0 0 16px}
        .sd-sidebar-project{display:flex;gap:12px;text-decoration:none;margin-bottom:14px}
        .sd-sidebar-project:last-child{margin-bottom:0}
        .sd-sidebar-project-thumb{position:relative;width:80px;height:60px;flex-shrink:0;overflow:hidden;background:var(--color-bg-muted)}
        .sd-sidebar-project-title{font-size:14px;font-weight:600;color:var(--color-text-primary);line-height:1.3}
        .sd-sidebar-project:hover .sd-sidebar-project-title{color:var(--color-brand)}
        .sd-sidebar-item{display:block;padding:8px 0;font-size:14px;color:var(--color-text-secondary);text-decoration:none;border-bottom:1px solid var(--color-border)}
        .sd-sidebar-item:last-child{border-bottom:none}
        .sd-sidebar-item:hover{color:var(--color-brand)}
        @media(min-width:1024px){.sd-layout{display:grid;grid-template-columns:1fr 340px;gap:40px}}
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

            {/* Description */}
            {service.description && (
              <p className="sd-desc">{service.description}</p>
            )}

            {/* Content */}
            {content && (
              <div
                className="sd-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {/* Tags */}
            {service.tags && Array.isArray(service.tags) && service.tags.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 10 }}>
                  {isEn ? 'Tags' : 'Etiketler'}
                </h3>
                <div className="sd-tags">
                  {service.tags.map((tag: string) => (
                    <span key={tag} className="sd-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div
              style={{
                marginTop: 40,
                padding: '24px 28px',
                background: 'var(--color-bg-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-on-dark)', margin: 0 }}>
                  {t('common.offerCtaTitle')}
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', marginTop: 4 }}>
                  {t('common.offerCtaDescription')}
                </p>
              </div>
              <Link
                href={localizedPath(locale, '/teklif')}
                style={{
                  padding: '10px 24px',
                  background: 'var(--color-brand)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: 'none',
                  borderRadius: 2,
                  whiteSpace: 'nowrap',
                }}
              >
                {t('common.requestOffer')}
              </Link>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside>
            {/* Related projects */}
            {relatedProjects.length > 0 && (
              <div className="sd-sidebar-card">
                <h3>{isEn ? 'Related Projects' : 'İlgili Projeler'}</h3>
                {relatedProjects.map((p: any) => (
                  <Link
                    key={p.id ?? p.title}
                    href={p.slug ? localizedPath(locale, `/projeler/${p.slug}`) : '#'}
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
                  href={localizedPath(locale, '/projeler')}
                  style={{ fontSize: 13, color: 'var(--color-brand)', textDecoration: 'none', marginTop: 10, display: 'inline-block' }}
                >
                  {isEn ? 'All Projects »' : 'Tüm Projeler »'}
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
              style={{ background: 'var(--color-bg-secondary)', borderColor: 'transparent' }}
            >
              <h3 style={{ fontSize: 16 }}>{t('common.offerCtaTitle')}</h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {t('common.offerCtaDescription')}
              </p>
              <Link
                href={localizedPath(locale, '/teklif')}
                style={{
                  display: 'inline-block',
                  marginTop: 12,
                  padding: '8px 20px',
                  background: 'var(--color-brand)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 13,
                  textDecoration: 'none',
                  borderRadius: 2,
                }}
              >
                {t('common.requestOffer')}
              </Link>
            </div>

            {/* All services link */}
            <Link
              href={localizedPath(locale, '/hizmetler')}
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '12px',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-brand)',
                textDecoration: 'none',
                border: '1px solid var(--color-border)',
              }}
            >
              {isEn ? '← All Activities' : '← Tüm Faaliyetler'}
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
