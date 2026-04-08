import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { API_BASE_URL, absoluteAssetUrl } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { buildMediaAlt } from '@/lib/media-seo';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { fetchSetting } from '@/i18n/server';
import { fetchSeoPage } from '@/seo/server';

async function fetchReferences(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/references?module_key=bereketfide&is_active=1&locale=${locale}&limit=50`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
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
  const seo = await fetchSeoPage(locale, 'referanslar');
  const isEn = locale.startsWith('en');

  return buildPageMetadata({
    locale,
    pathname: '/referanslar',
    title: seo?.title || (isEn ? 'References & Success Stories' : 'Referanslar & Başarı Hikayeleri'),
    description:
      seo?.description ||
      (isEn
        ? 'Greenhouse projects and customer success stories from Bereket Fide. See how our seedlings perform in the field.'
        : 'Bereket Fide müşteri başarı hikayeleri ve sera projeleri. Fidelerimizin sahadaki performansını görün.'),
    ogImage: seo?.og_image || undefined,
  });
}

export default async function ReferencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isEn = locale.startsWith('en');

  const [references, profile] = await Promise.all([
    fetchReferences(locale),
    fetchSetting('company_profile', locale),
  ]);

  const companyName = (profile?.value as any)?.company_name || 'Bereket Fide';
  const pageTitle = isEn ? 'References & Success Stories' : 'Referanslar & Başarı Hikayeleri';
  const pageDesc = isEn
    ? 'Real projects, real results. Discover how Bereket Fide seedlings have helped growers across Turkey achieve higher yields.'
    : 'Gerçek projeler, gerçek sonuçlar. Bereket Fide fidelerinin Türkiye genelinde üreticilere daha yüksek verim sağladığını keşfedin.';

  const featured = references.slice(0, 3);
  const rest = references.slice(3);

  // JSON-LD: Review schema for references
  const reviewSchemas = featured
    .filter((r: any) => r.rating)
    .map((r: any) => ({
      '@type': 'Review',
      reviewBody: r.content || r.description,
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      author: { '@type': 'Person', name: r.customer_name || r.title },
      itemReviewed: { '@id': 'https://www.bereketfide.com.tr/#organization' },
    }));

  return (
    <>
      <style>{`
        .ref-title{font-family:var(--font-heading);font-size:28px;font-weight:800;color:var(--color-text-primary);line-height:1.2;margin:0 0 8px}
        .ref-desc{font-size:15px;color:var(--color-text-secondary);line-height:1.6;margin-bottom:28px;max-width:720px}
        .ref-featured-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px;margin-bottom:48px}
        .ref-card{display:flex;flex-direction:column;text-decoration:none;border:1px solid var(--color-border);background:var(--color-bg-secondary);transition:box-shadow .2s,border-color .2s;overflow:hidden}
        .ref-card:hover{border-color:var(--color-brand);box-shadow:0 4px 20px color-mix(in srgb,var(--color-bg-dark) 8%,transparent)}
        .ref-card-img{position:relative;width:100%;aspect-ratio:4/3;overflow:hidden;background:var(--color-bg-muted)}
        .ref-card-body{padding:20px 22px 22px;display:flex;flex-direction:column;flex:1}
        .ref-card-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--color-brand);margin-bottom:6px}
        .ref-card-title{font-family:var(--font-heading);font-size:18px;font-weight:700;color:var(--color-text-primary);line-height:1.3;margin:0 0 10px;transition:color .15s}
        .ref-card:hover .ref-card-title{color:var(--color-brand)}
        .ref-card-desc{font-size:13px;color:var(--color-text-secondary);line-height:1.6;flex:1;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
        .ref-card-meta{display:flex;align-items:center;gap:12px;margin-top:14px;padding-top:14px;border-top:1px solid var(--color-border)}
        .ref-card-customer{font-size:13px;font-weight:600;color:var(--color-text-primary)}
        .ref-card-location{font-size:12px;color:var(--color-text-muted)}
        .ref-stars{color:var(--color-brand);font-size:14px;letter-spacing:1px}
        .ref-list{display:flex;flex-direction:column;gap:0}
        .ref-list-item{display:flex;gap:20px;padding:24px 0;border-top:1px solid var(--color-border);text-decoration:none;align-items:flex-start}
        .ref-list-item:hover .ref-list-title{color:var(--color-brand)}
        .ref-list-img{position:relative;width:140px;height:105px;flex-shrink:0;overflow:hidden;background:var(--color-bg-muted)}
        .ref-list-body{flex:1;min-width:0}
        .ref-list-title{font-family:var(--font-heading);font-size:16px;font-weight:700;color:var(--color-text-primary);margin:0 0 6px;transition:color .15s}
        .ref-list-desc{font-size:13px;color:var(--color-text-secondary);line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
        .ref-cta{margin-top:48px;padding:32px;background:var(--color-bg-dark);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
        @media(max-width:640px){.ref-list-img{width:100px;height:75px}}
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>
        {reviewSchemas.length > 0 && (
          <JsonLd
            data={jsonld.graph([
              jsonld.collectionPage({
                name: pageTitle,
                description: pageDesc,
                url: localizedUrl(locale, '/referanslar'),
              }),
              ...reviewSchemas,
            ])}
          />
        )}
        {reviewSchemas.length === 0 && (
          <JsonLd
            data={jsonld.graph([
              jsonld.collectionPage({
                name: pageTitle,
                description: pageDesc,
                url: localizedUrl(locale, '/referanslar'),
              }),
            ])}
          />
        )}

        <Breadcrumbs items={[
          { label: companyName, href: localizedPath(locale, '/') },
          { label: pageTitle },
        ]} />

        <h1 className="ref-title">{pageTitle}</h1>
        <p className="ref-desc">{pageDesc}</p>

        {references.length === 0 && (
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 8 }}>
            {isEn ? 'No references published yet.' : 'Henüz referans yayınlanmamış.'}
          </p>
        )}

        {/* Featured 3 — card grid */}
        {featured.length > 0 && (
          <div className="ref-featured-grid">
            {featured.map((ref: any) => {
              const img = absoluteAssetUrl(ref.featured_image || ref.image_url);
              const stars = ref.rating ? Math.round(ref.rating) : 0;
              return (
                <div key={ref.id ?? ref.slug} className="ref-card">
                  {img && (
                    <div className="ref-card-img">
                      <OptimizedImage
                        src={img}
                        alt={buildMediaAlt({ locale, kind: 'project', title: ref.title, alt: ref.featured_image_alt })}
                        fill
                        className="object-cover"
                        sizes="(max-width:640px) 100vw, 360px"
                        priority
                      />
                    </div>
                  )}
                  <div className="ref-card-body">
                    {ref.category_name && (
                      <span className="ref-card-label">{ref.category_name}</span>
                    )}
                    <h2 className="ref-card-title">{ref.title}</h2>
                    {(ref.content || ref.description) && (
                      <p className="ref-card-desc">{ref.content || ref.description}</p>
                    )}
                    <div className="ref-card-meta">
                      <div>
                        {ref.customer_name && (
                          <div className="ref-card-customer">{ref.customer_name}</div>
                        )}
                        {ref.location && (
                          <div className="ref-card-location">{ref.location}</div>
                        )}
                      </div>
                      {stars > 0 && (
                        <div className="ref-stars" title={`${stars}/5`}>
                          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rest — list */}
        {rest.length > 0 && (
          <div className="ref-list">
            {rest.map((ref: any) => {
              const img = absoluteAssetUrl(ref.featured_image || ref.image_url);
              return (
                <div key={ref.id ?? ref.slug} className="ref-list-item">
                  {img && (
                    <div className="ref-list-img">
                      <OptimizedImage
                        src={img}
                        alt={buildMediaAlt({ locale, kind: 'project', title: ref.title, alt: ref.featured_image_alt })}
                        fill
                        className="object-cover"
                        sizes="140px"
                      />
                    </div>
                  )}
                  <div className="ref-list-body">
                    <h2 className="ref-list-title">{ref.title}</h2>
                    {ref.customer_name && (
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-brand)', marginBottom: 4 }}>
                        {ref.customer_name}
                        {ref.location && ` — ${ref.location}`}
                      </p>
                    )}
                    {(ref.content || ref.description) && (
                      <p className="ref-list-desc">{ref.content || ref.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="ref-cta">
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-on-dark)', margin: 0 }}>
              {isEn ? 'Become a Bereket Fide Customer' : 'Bereket Fide Müşterisi Olun'}
            </h3>
            <p style={{ fontSize: 14, marginTop: 4, color: 'color-mix(in srgb, var(--section-bg-white) 70%, transparent)' }}>
              {t('common.offerCtaDescription')}
            </p>
          </div>
          <Link
            href={localizedPath(locale, '/teklif')}
            style={{ padding: '10px 24px', background: 'var(--color-brand)', color: 'var(--color-on-brand)', fontWeight: 600, fontSize: 14, textDecoration: 'none', borderRadius: 2, whiteSpace: 'nowrap' }}
          >
            {t('nav.offer')}
          </Link>
        </div>
      </div>
    </>
  );
}
