import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { API_BASE_URL, absoluteAssetUrl } from '@/lib/utils';
import { normalizeRichContent } from '@/lib/rich-content';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl, organizationJsonLd } from '@/seo';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { buildMediaAlt } from '@/lib/media-seo';
import { fetchSetting } from '@/i18n/server';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

async function fetchAboutPage(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom_pages/by-slug/about?locale=${locale}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchServices(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/services?module_key=bereketfide&is_active=1&locale=${locale}&limit=10`,
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
  const seo = await fetchSeoPage(locale, 'hakkimizda');
  const t = await getTranslations({ locale });

  return buildPageMetadata({
    locale,
    pathname: '/hakkimizda',
    title: seo?.title || `${t('about.title')} - ${t('seo.defaultTitle')}`,
    description: seo?.description || t('about.description'),
    ogImage: seo?.og_image || undefined,
    noIndex: seo?.no_index,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isEn = locale.startsWith('en');

  const [page, services, profile] = await Promise.all([
    fetchAboutPage(locale),
    fetchServices(locale),
    fetchSetting('company_profile', locale),
  ]);

  const companyProfile = (profile?.value as any) ?? {};
  const companyName = companyProfile.company_name || 'Bereket Fide';

  const content = normalizeRichContent(page?.content);
  const org = organizationJsonLd(locale);
  const imageSrc = absoluteAssetUrl(page?.image_url || page?.featured_image) || '/uploads/projects/bereket-fide-urun-01.jpeg';

  const breadcrumbs = [
    { label: companyName, href: localizedPath(locale, '/') },
    { label: t('about.title') },
  ];

  return (
    <>
      <style>{`
        .ab-title{font-family:var(--font-heading);font-size:28px;font-weight:800;color:var(--color-text-primary);line-height:1.2;margin:0 0 16px}
        .ab-hero{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:var(--color-bg-muted);margin-top:16px}
        .ab-intro{font-size:16px;color:var(--color-text-secondary);line-height:1.7;margin-top:16px;max-width:720px}
        .ab-content{margin-top:24px;font-size:15px;line-height:1.8;color:var(--color-text-secondary)}
        .ab-content p{margin-bottom:16px}
        .ab-content h2,.ab-content h3{font-family:var(--font-heading);color:var(--color-text-primary);margin:28px 0 12px}
        .ab-content a{color:var(--color-brand);text-decoration:none}
        .ab-content a:hover{text-decoration:underline}
        .ab-content img{max-width:100%;height:auto;margin:16px 0}
        .ab-content ul,.ab-content ol{margin:12px 0;padding-left:24px}
        .ab-content li{margin-bottom:8px}
        .ab-sidebar-card{border:1px solid var(--color-border);padding:20px;margin-bottom:20px}
        .ab-sidebar-card h3{font-family:var(--font-heading);font-size:18px;font-weight:700;color:var(--color-text-primary);margin:0 0 16px}
        .ab-sidebar-item{display:block;padding:8px 0;font-size:14px;color:var(--color-text-secondary);text-decoration:none;border-bottom:1px solid var(--color-border)}
        .ab-sidebar-item:last-child{border-bottom:none}
        .ab-sidebar-item:hover{color:var(--color-brand)}
        .ab-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:32px}
        .ab-stat{text-align:center;padding:20px 12px;border:1px solid var(--color-border)}
        .ab-stat-value{font-family:var(--font-heading);font-size:28px;font-weight:800;color:var(--color-brand)}
        .ab-stat-label{font-size:13px;color:var(--color-text-muted);margin-top:4px}
        @media(min-width:1024px){.ab-layout{display:grid;grid-template-columns:1fr 340px;gap:40px}}
        @media(max-width:640px){.ab-stats{grid-template-columns:1fr}}
      `}</style>

      <JsonLd
        data={jsonld.graph([
          jsonld.org(
            organizationJsonLd(locale, {
              description: t('about.description'),
            }),
          ),
          jsonld.breadcrumb(
            breadcrumbs.map((item) => ({
              name: item.label,
              url: 'href' in item && item.href
                ? localizedUrl(locale, (item.href as string).replace(`/${locale}`, '') || '/')
                : localizedUrl(locale, '/hakkimizda'),
            })),
          ),
        ])}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>

        {/* Breadcrumb */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Title */}
        <h1 className="ab-title">{page?.title || t('about.title')}</h1>

        {/* Main layout */}
        <div className="ab-layout">
          {/* LEFT COLUMN */}
          <div>
            {/* Hero image */}
            <div className="ab-hero">
              <OptimizedImage
                src={absoluteAssetUrl(imageSrc) || imageSrc}
                alt={buildMediaAlt({
                  locale,
                  kind: 'project',
                  title: `${companyName} — ${t('about.title')}`,
                  description: t('about.description'),
                })}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
              />
            </div>

            {/* Intro */}
            <p className="ab-intro">{t('about.description')}</p>

            {/* Content from API or fallback */}
            {content ? (
              <div
                className="ab-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="ab-content">
                <p>{t('about.intro')}</p>

                <h2>{t('about.sections.expertiseTitle')}</h2>
                <ul>
                  {Object.values(t.raw('about.sections.expertiseItems') as Record<string, string>).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <h2>{t('about.sections.processTitle')}</h2>
                <ul>
                  {Object.values(t.raw('about.sections.processItems') as Record<string, string>).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <h2>{t('about.sections.sectorsTitle')}</h2>
                <ul>
                  {Object.values(t.raw('about.sections.sectorsItems') as Record<string, string>).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stats */}
            <div className="ab-stats">
              <div className="ab-stat">
                <div className="ab-stat-value">15+</div>
                <div className="ab-stat-label">{t('about.sections.stats.experience')}</div>
              </div>
              <div className="ab-stat">
                <div className="ab-stat-value">100+</div>
                <div className="ab-stat-label">{t('about.sections.stats.projects')}</div>
              </div>
              <div className="ab-stat">
                <div className="ab-stat-value">50+</div>
                <div className="ab-stat-label">{t('about.sections.stats.team')}</div>
              </div>
            </div>

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
            {/* Services list */}
            {services.length > 0 && (
              <div className="ab-sidebar-card">
                <h3>{t('home.services.title')}</h3>
                {services.map((s: any) => (
                  <Link
                    key={s.id ?? s.title}
                    href={s.slug ? localizedPath(locale, `/hizmetler/${s.slug}`) : '#'}
                    className="ab-sidebar-item"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Offer CTA sidebar */}
            <div
              className="ab-sidebar-card"
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

            {/* Contact link */}
            <Link
              href={localizedPath(locale, '/iletisim')}
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
              ← {t('nav.contact')}
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
