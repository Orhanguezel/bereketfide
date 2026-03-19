import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { API_BASE_URL, absoluteAssetUrl } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { buildMediaAlt } from '@/lib/media-seo';
import { fetchSetting } from '@/i18n/server';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { SeoIssueBeacon } from '@/components/monitoring/SeoIssueBeacon';

async function fetchServices(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/services?module_key=bereketfide&is_active=1&locale=${locale}&limit=50`,
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
  const seo = await fetchSeoPage(locale, 'hizmetler');
  const t = await getTranslations({ locale });

  return buildPageMetadata({
    locale,
    pathname: '/hizmetler',
    title: seo?.title || t('services.title'),
    description: seo?.description || t('services.description'),
    ogImage: seo?.og_image || undefined,
    noIndex: seo?.no_index,
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isEn = locale.startsWith('en');

  const [services, profile] = await Promise.all([
    fetchServices(locale),
    fetchSetting('company_profile', locale),
  ]);

  const companyProfile = (profile?.value as any) ?? {};
  const companyName = companyProfile.company_name || 'Bereket Fide';

  const visibleServices = services;
  const featured = visibleServices[0];
  const rest = visibleServices.slice(1);

  return (
    <>
      <style>{`
        .sv-page-title{font-family:var(--font-heading);font-size:28px;font-weight:800;color:var(--color-text-primary);line-height:1.2;margin:0 0 16px}
        .sv-featured{display:block;text-decoration:none;margin-bottom:32px}
        .sv-featured-img{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:var(--color-bg-muted);margin-top:12px}
        .sv-featured-title{font-family:var(--font-heading);font-size:22px;font-weight:700;color:var(--color-text-primary);line-height:1.3;margin:0}
        .sv-featured:hover .sv-featured-title{color:var(--color-brand)}
        .sv-featured-desc{font-size:15px;color:var(--color-text-secondary);line-height:1.7;margin-top:12px;max-width:720px}
        .sv-article{display:flex;gap:16px;text-decoration:none;padding:20px 0;border-top:1px solid var(--color-border)}
        .sv-article:hover .sv-article-title{color:var(--color-brand)}
        .sv-article-body{flex:1;min-width:0}
        .sv-article-title{font-family:var(--font-heading);font-size:17px;font-weight:700;color:var(--color-text-primary);line-height:1.35;margin:0 0 6px;transition:color .15s}
        .sv-article-excerpt{font-size:14px;color:var(--color-text-secondary);line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
        .sv-article-link{display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-size:12px;font-weight:600;color:var(--color-brand);text-transform:uppercase;letter-spacing:.04em}
        .sv-article-thumb{position:relative;width:200px;height:140px;flex-shrink:0;overflow:hidden;background:var(--color-bg-muted)}
        .sv-sidebar-card{border:1px solid var(--color-border);padding:20px;margin-bottom:20px}
        .sv-sidebar-card h3{font-family:var(--font-heading);font-size:18px;font-weight:700;color:var(--color-text-primary);margin:0 0 16px}
        .sv-sidebar-item{display:block;padding:8px 0;font-size:14px;color:var(--color-text-secondary);text-decoration:none;border-bottom:1px solid var(--color-border)}
        .sv-sidebar-item:hover{color:var(--color-brand)}
        .sv-sidebar-item:last-child{border-bottom:none}
        .sv-cta{margin-top:48px;padding:32px;background:var(--color-bg-dark);text-align:center}
        .sv-cta h2{font-family:var(--font-heading);font-size:22px;font-weight:700;color:var(--color-text-on-dark);margin:0 0 8px}
        .sv-cta p{font-size:14px;color:rgba(255,255,255,.7);max-width:560px;margin:0 auto 20px;line-height:1.6}
        .sv-cta a{display:inline-block;padding:10px 28px;background:var(--color-brand);color:#fff;font-weight:600;font-size:14px;text-decoration:none;border-radius:2px}
        @media(min-width:1024px){.sv-layout{display:grid;grid-template-columns:1fr 340px;gap:40px}}
        @media(max-width:640px){.sv-article-thumb{width:120px;height:90px}.sv-article-title{font-size:15px}}
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>
        <JsonLd
          data={jsonld.graph([
            jsonld.collectionPage({
              name: t('services.title'),
              description: t('services.description'),
              url: localizedUrl(locale, '/hizmetler'),
              mainEntity: jsonld.itemList(
                visibleServices.slice(0, 10).map((item: any) => ({
                  name: item.title,
                  url: item.slug ? localizedUrl(locale, `/hizmetler/${item.slug}`) : localizedUrl(locale, '/iletisim'),
                })),
              ),
            }),
          ])}
        />

        <Breadcrumbs items={[
          { label: companyName, href: localizedPath(locale, '/') },
          { label: t('services.title') },
        ]} />

        <h1 className="sv-page-title">{t('services.title')}</h1>

        {/* Empty state */}
        {services.length === 0 && (
          <>
            <SeoIssueBeacon
              type="soft-404"
              pathname={localizedPath(locale, '/hizmetler')}
              reason="services-list-empty"
            />
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
              {t('services.emptyStateNote')}
            </p>
          </>
        )}

        {/* Main layout */}
        <div className="sv-layout">
          {/* LEFT COLUMN */}
          <div>
            {/* Featured service */}
            {featured && (
              <Link
                href={featured.slug ? localizedPath(locale, `/hizmetler/${featured.slug}`) : localizedPath(locale, '/iletisim')}
                className="sv-featured"
              >
                <h2 className="sv-featured-title">{featured.title}</h2>
                {featured.image_url && (
                  <div className="sv-featured-img">
                    <OptimizedImage
                      src={absoluteAssetUrl(featured.image_url) || ''}
                      alt={buildMediaAlt({ locale, kind: 'service', title: featured.title, alt: featured.alt, description: featured.description })}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 800px"
                      priority
                    />
                  </div>
                )}
                {featured.description && (
                  <p className="sv-featured-desc">{featured.description}</p>
                )}
              </Link>
            )}

            {/* Rest of services */}
            {rest.map((s: any) => (
              <Link
                key={s.id ?? s.title}
                href={s.slug ? localizedPath(locale, `/hizmetler/${s.slug}`) : localizedPath(locale, '/iletisim')}
                className="sv-article"
              >
                <div className="sv-article-body">
                  <h2 className="sv-article-title">{s.title}</h2>
                  {s.description && (
                    <p className="sv-article-excerpt">{s.description}</p>
                  )}
                  <span className="sv-article-link">
                    {t('services.learnMore')}
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 3l5 5-5 5" />
                    </svg>
                  </span>
                </div>
                {s.image_url && (
                  <div className="sv-article-thumb">
                    <OptimizedImage
                      src={absoluteAssetUrl(s.image_url) || ''}
                      alt={buildMediaAlt({ locale, kind: 'service', title: s.title, alt: s.alt, description: s.description })}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside>
            {/* All services list */}
            <div className="sv-sidebar-card">
              <h3>{t('services.viewAll')}</h3>
              {visibleServices.map((s: any) => (
                <Link
                  key={s.id ?? s.title}
                  href={s.slug ? localizedPath(locale, `/hizmetler/${s.slug}`) : localizedPath(locale, '/iletisim')}
                  className="sv-sidebar-item"
                >
                  {s.title}
                </Link>
              ))}
            </div>

            {/* Offer CTA */}
            <div
              className="sv-sidebar-card"
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
          </aside>
        </div>

        {/* CTA */}
        <div className="sv-cta">
          <h2>{t('common.offerCtaTitle')}</h2>
          <p>{t('common.offerCtaDescription')}</p>
          <Link href={localizedPath(locale, '/teklif')}>
            {t('common.requestOffer')}
          </Link>
        </div>
      </div>
    </>
  );
}
