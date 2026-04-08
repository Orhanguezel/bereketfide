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

const MODULE_KEY = 'bilgi-bankasi';

async function fetchPosts(locale: string, categoryId?: string) {
  try {
    let url = `${API_BASE_URL}/custom-pages?module_key=${MODULE_KEY}&is_published=1&locale=${locale}&limit=50&sort=display_order&order=asc`;
    if (categoryId) url += `&category_id=${encodeURIComponent(categoryId)}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchCategories(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/categories?module_key=${MODULE_KEY}&is_active=1&locale=${locale}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

function resolveImage(post: any): string | null {
  return absoluteAssetUrl(post?.featured_image || post?.image_url) || null;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations({ locale });
  const seo = await fetchSeoPage(locale, 'bilgi-bankasi');
  const isEn = locale.startsWith('en');

  return buildPageMetadata({
    locale,
    pathname: '/bilgi-bankasi',
    title: seo?.title || (isEn ? 'Knowledge Base' : 'Bilgi Bankası'),
    description:
      seo?.description ||
      (isEn
        ? 'Seedling cultivation guides, greenhouse tips and agricultural know-how from Bereket Fide experts.'
        : 'Bereket Fide uzmanlarından fide yetiştirme rehberleri, sera tavsiyeleri ve tarım bilgisi.'),
    ogImage: seo?.og_image || undefined,
    noIndex: seo?.no_index || Boolean(category),
  });
}

export default async function KnowledgeBasePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations({ locale });
  const isEn = locale.startsWith('en');

  const [categories, profile] = await Promise.all([
    fetchCategories(locale),
    fetchSetting('company_profile', locale),
  ]);

  const activeCategory = category
    ? categories.find((c: any) => c.slug === category)
    : undefined;

  const posts = await fetchPosts(locale, activeCategory?.id);

  const companyName = (profile?.value as any)?.company_name || 'Bereket Fide';
  const pageTitle = isEn ? 'Knowledge Base' : 'Bilgi Bankası';
  const pageDesc = isEn
    ? 'Expert guides on seedling cultivation, greenhouse management and agricultural best practices.'
    : 'Fide yetiştirme, sera yönetimi ve tarım uygulamaları üzerine uzman rehberleri.';

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <style>{`
        .kb-title{font-family:var(--font-heading);font-size:28px;font-weight:800;color:var(--color-text-primary);line-height:1.2;margin:0 0 8px}
        .kb-desc{font-size:15px;color:var(--color-text-secondary);line-height:1.6;margin-bottom:20px;max-width:680px}
        .kb-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
        .kb-chip{display:inline-block;padding:6px 16px;border:1px solid var(--color-border);font-size:13px;font-weight:600;color:var(--color-text-primary);text-decoration:none;border-radius:2px;transition:all .15s;background:var(--color-bg-secondary)}
        .kb-chip:hover{border-color:var(--color-brand);color:var(--color-brand)}
        .kb-chip-active{border-color:var(--color-brand);background:var(--color-brand);color:var(--color-on-brand)}
        .kb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;margin-top:8px}
        .kb-card{display:flex;flex-direction:column;text-decoration:none;border:1px solid var(--color-border);background:var(--color-bg-secondary);transition:box-shadow .2s,border-color .2s}
        .kb-card:hover{border-color:var(--color-brand);box-shadow:0 4px 16px color-mix(in srgb,var(--color-bg-dark) 6%,transparent)}
        .kb-card-img{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:var(--color-bg-muted);flex-shrink:0}
        .kb-card-body{padding:18px 20px 20px;display:flex;flex-direction:column;flex:1}
        .kb-card-cat{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--color-brand);margin-bottom:6px}
        .kb-card-title{font-family:var(--font-heading);font-size:17px;font-weight:700;color:var(--color-text-primary);line-height:1.35;margin:0 0 8px;transition:color .15s}
        .kb-card:hover .kb-card-title{color:var(--color-brand)}
        .kb-card-excerpt{font-size:13px;color:var(--color-text-secondary);line-height:1.6;flex:1;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
        .kb-card-link{display:inline-flex;align-items:center;gap:4px;margin-top:12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--color-brand)}
        .kb-featured{display:flex;gap:32px;text-decoration:none;padding-bottom:32px;margin-bottom:32px;border-bottom:1px solid var(--color-border)}
        .kb-featured-img{position:relative;width:380px;flex-shrink:0;aspect-ratio:4/3;overflow:hidden;background:var(--color-bg-muted)}
        .kb-featured-body{display:flex;flex-direction:column;justify-content:center}
        .kb-featured-cat{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--color-brand);margin-bottom:8px}
        .kb-featured-title{font-family:var(--font-heading);font-size:24px;font-weight:800;color:var(--color-text-primary);line-height:1.25;margin:0 0 12px;transition:color .15s}
        .kb-featured:hover .kb-featured-title{color:var(--color-brand)}
        .kb-featured-desc{font-size:15px;color:var(--color-text-secondary);line-height:1.7}
        @media(max-width:768px){.kb-featured{flex-direction:column}.kb-featured-img{width:100%}}
        @media(min-width:1024px){.kb-layout{display:grid;grid-template-columns:1fr 300px;gap:40px}}
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>
        <JsonLd
          data={jsonld.graph([
            jsonld.collectionPage({
              name: pageTitle,
              description: pageDesc,
              url: localizedUrl(locale, '/bilgi-bankasi'),
              mainEntity: jsonld.itemList(
                posts.slice(0, 12).map((p: any) => ({
                  name: p.title,
                  url: p.slug ? localizedUrl(locale, `/bilgi-bankasi/${p.slug}`) : localizedUrl(locale, '/bilgi-bankasi'),
                })),
              ),
            }),
          ])}
        />

        <Breadcrumbs items={[
          { label: companyName, href: localizedPath(locale, '/') },
          { label: pageTitle },
        ]} />

        <h1 className="kb-title">
          {activeCategory ? activeCategory.name : pageTitle}
        </h1>
        {!activeCategory && <p className="kb-desc">{pageDesc}</p>}

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="kb-chips">
            <Link
              href={localizedPath(locale, '/bilgi-bankasi')}
              className={`kb-chip${!activeCategory ? ' kb-chip-active' : ''}`}
            >
              {isEn ? 'All' : 'Tümü'}
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={localizedPath(locale, `/bilgi-bankasi?category=${cat.slug}`)}
                className={`kb-chip${activeCategory?.id === cat.id ? ' kb-chip-active' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 24 }}>
            {isEn ? 'No guides published yet.' : 'Henüz rehber yayınlanmamış.'}
          </p>
        )}

        <div className="kb-layout">
          <div>
            {/* Featured */}
            {featured && (
              <Link
                href={localizedPath(locale, `/bilgi-bankasi/${featured.slug}`)}
                className="kb-featured"
              >
                {resolveImage(featured) && (
                  <div className="kb-featured-img">
                    <OptimizedImage
                      src={resolveImage(featured)!}
                      alt={buildMediaAlt({ locale, kind: 'blog', title: featured.title, alt: featured.alt })}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 380px"
                      priority
                    />
                  </div>
                )}
                <div className="kb-featured-body">
                  {featured.category_name && (
                    <span className="kb-featured-cat">{featured.category_name}</span>
                  )}
                  <h2 className="kb-featured-title">{featured.title}</h2>
                  {featured.summary && (
                    <p className="kb-featured-desc">{featured.summary}</p>
                  )}
                </div>
              </Link>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="kb-grid">
                {rest.map((post: any) => (
                  <Link
                    key={post.id ?? post.title}
                    href={localizedPath(locale, `/bilgi-bankasi/${post.slug}`)}
                    className="kb-card"
                  >
                    {resolveImage(post) && (
                      <div className="kb-card-img">
                        <OptimizedImage
                          src={resolveImage(post)!}
                          alt={buildMediaAlt({ locale, kind: 'blog', title: post.title, alt: post.alt })}
                          fill
                          className="object-cover"
                          sizes="(max-width:640px) 100vw, 340px"
                        />
                      </div>
                    )}
                    <div className="kb-card-body">
                      {post.category_name && (
                        <span className="kb-card-cat">{post.category_name}</span>
                      )}
                      <h2 className="kb-card-title">{post.title}</h2>
                      {post.summary && (
                        <p className="kb-card-excerpt">{post.summary}</p>
                      )}
                      <span className="kb-card-link">
                        {isEn ? 'Read guide' : 'Rehberi oku'} →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside style={{ marginTop: featured ? 0 : 0 }}>
            <div style={{ border: '1px solid var(--color-border)', padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 14px' }}>
                {isEn ? 'Popular Guides' : 'Popüler Rehberler'}
              </h3>
              {posts.slice(0, 6).map((p: any) => (
                <Link
                  key={p.id}
                  href={localizedPath(locale, `/bilgi-bankasi/${p.slug}`)}
                  style={{ display: 'block', padding: '8px 0', fontSize: 14, color: 'var(--color-text-secondary)', textDecoration: 'none', borderBottom: '1px solid var(--color-border)' }}
                >
                  {p.title}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div style={{ background: 'var(--color-bg-secondary)', padding: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
                {isEn ? 'Need Expert Advice?' : 'Uzman Görüşü İster Misiniz?'}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {isEn
                  ? 'Contact our agronomists for personalized guidance.'
                  : 'Kişiselleştirilmiş rehberlik için ziraat mühendislerimizle iletişime geçin.'}
              </p>
              <Link
                href={localizedPath(locale, '/teklif')}
                style={{ display: 'inline-block', marginTop: 12, padding: '8px 20px', background: 'var(--color-brand)', color: 'var(--color-on-brand)', fontWeight: 600, fontSize: 13, textDecoration: 'none', borderRadius: 2 }}
              >
                {isEn ? 'Get in Touch' : 'İletişime Geç'}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
