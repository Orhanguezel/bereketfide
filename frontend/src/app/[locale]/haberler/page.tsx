import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { API_BASE_URL, SITE_URL, absoluteAssetUrl } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

import { buildMediaAlt } from '@/lib/media-seo';
import { SeoIssueBeacon } from '@/components/monitoring/SeoIssueBeacon';
import { fetchSetting } from '@/i18n/server';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

function resolveNewsImage(post: any): string | null {
  return absoluteAssetUrl(
    post?.featured_image_url_resolved ||
    post?.image_url_resolved ||
    post?.cover_image_url_resolved ||
    post?.featured_image ||
    post?.image_url ||
    post?.cover_image ||
    post?.imageSrc ||
    post?.featured_image_url ||
    post?.cover_image_url,
  ) || null;
}

type NewsCategory = {
  id: string;
  name: string;
  slug: string;
};

async function fetchNewsCategories(locale: string): Promise<NewsCategory[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/categories?module_key=news&is_active=1&locale=${locale}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchNews(locale: string, categoryId?: string) {
  try {
    let url = `${API_BASE_URL}/custom-pages?module_key=news&is_published=1&locale=${locale}&limit=50`;
    if (categoryId) url += `&category_id=${encodeURIComponent(categoryId)}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchSidebarNews(locale: string, limit = 4) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom-pages?module_key=news&is_published=1&locale=${locale}&limit=${limit}&sort=created_at&order=desc`,
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
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { category } = await searchParams;
  const seo = await fetchSeoPage(locale, 'haberler');
  const t = await getTranslations({ locale });

  return buildPageMetadata({
    locale,
    pathname: '/haberler',
    title: seo?.title || t('news.title'),
    description: seo?.description || t('news.description'),
    ogImage: seo?.og_image || undefined,
    noIndex: seo?.no_index || Boolean(category),
  });
}

function formatRelativeTime(dateStr: string, t: any, locale: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return t('common.relativeTime.justNow');
    if (diffHours < 24) return t('common.relativeTime.hoursAgo', { hours: diffHours });
    if (diffDays < 7) return t('common.relativeTime.daysAgo', { days: diffDays });
    
    return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default async function NewsPage({
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

  const categories = await fetchNewsCategories(locale);
  const activeCategory = category
    ? categories.find((c) => c.slug === category)
    : undefined;

  const [posts, sidebarPosts, profile] = await Promise.all([
    fetchNews(locale, activeCategory?.id),
    fetchSidebarNews(locale, 4),
    fetchSetting('company_profile', locale),
  ]);

  const companyProfile = (profile?.value as any) ?? {};
  const companyName = companyProfile.company_name || 'Bereket Fide';

  const visiblePosts = posts;
  const featured = visiblePosts[0];
  const rest = visiblePosts.slice(1);

  return (
    <>
      <style>{`
        .nw-page-title{font-family:var(--font-heading);font-size:28px;font-weight:800;color:var(--color-text-primary);line-height:1.2;margin:0 0 16px}
        .nw-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
        .nw-chip{display:inline-block;padding:6px 16px;border:1px solid var(--color-border);font-size:13px;font-weight:600;color:var(--color-text-primary);text-decoration:none;border-radius:2px;transition:all .15s;background:var(--color-bg-secondary)}
        .nw-chip:hover{border-color:var(--color-brand);color:var(--color-brand)}
        .nw-chip-active{border-color:var(--color-brand);background:var(--color-brand);color:var(--color-on-brand)}
        .nw-chip-active:hover{background:var(--color-brand-dark);border-color:var(--color-brand-dark);color:var(--color-on-brand)}
        .nw-featured{display:block;text-decoration:none;margin-bottom:32px}
        .nw-featured-img{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:var(--color-bg-muted)}
        .nw-featured-title{font-family:var(--font-heading);font-size:22px;font-weight:700;color:var(--color-text-primary);line-height:1.3;margin:12px 0 4px}
        .nw-featured:hover .nw-featured-title{color:var(--color-brand)}
        .nw-featured-time{font-size:12px;color:var(--color-text-muted);font-weight:500}
        .nw-cat-badge{display:inline-block;padding:2px 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--color-brand);border:1px solid var(--color-brand);margin-bottom:6px}
        .nw-article{display:flex;gap:16px;text-decoration:none;padding:20px 0;border-top:1px solid var(--color-border)}
        .nw-article:hover .nw-article-title{color:var(--color-brand)}
        .nw-article-body{flex:1;min-width:0}
        .nw-article-title{font-family:var(--font-heading);font-size:17px;font-weight:700;color:var(--color-text-primary);line-height:1.35;margin:0 0 6px;transition:color .15s}
        .nw-article-excerpt{font-size:14px;color:var(--color-text-secondary);line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
        .nw-article-time{font-size:12px;color:var(--color-text-muted);margin-top:8px;font-weight:500}
        .nw-article-thumb{position:relative;width:200px;height:140px;flex-shrink:0;overflow:hidden;background:var(--color-bg-muted)}
        .nw-sidebar-card{border:1px solid var(--color-border);padding:20px;margin-bottom:20px}
        .nw-sidebar-card h3{font-family:var(--font-heading);font-size:18px;font-weight:700;color:var(--color-text-primary);margin:0 0 16px}
        .nw-sidebar-item{display:flex;gap:12px;text-decoration:none;margin-bottom:14px}
        .nw-sidebar-item:last-child{margin-bottom:0}
        .nw-sidebar-thumb{position:relative;width:80px;height:60px;flex-shrink:0;overflow:hidden;background:var(--color-bg-muted)}
        .nw-sidebar-title{font-size:14px;font-weight:600;color:var(--color-text-primary);line-height:1.3}
        .nw-sidebar-item:hover .nw-sidebar-title{color:var(--color-brand)}
        .nw-thumbstrip{display:flex;gap:6px;margin-top:12px;overflow-x:auto}
        .nw-thumbstrip-item{position:relative;width:100px;height:70px;flex-shrink:0;overflow:hidden;background:var(--color-bg-muted)}
        .nw-thumbstrip-more{display:flex;align-items:center;justify-content:center;width:100px;height:70px;flex-shrink:0;background:var(--color-bg-muted);font-size:16px;font-weight:700;color:var(--color-text-muted)}
        @media(min-width:1024px){.nw-layout{display:grid;grid-template-columns:1fr 340px;gap:40px}}
        @media(max-width:640px){.nw-article-thumb{width:120px;height:90px}.nw-article-title{font-size:15px}}
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>
        <JsonLd
          data={jsonld.graph([
            jsonld.collectionPage({
              name: isEn ? 'News' : 'Haberler',
              description: t('news.description'),
              url: localizedUrl(locale, '/haberler'),
              mainEntity: jsonld.itemList(
                visiblePosts.slice(0, 12).map((item: any) => ({
                  name: item.title,
                  url: item.slug
                    ? localizedUrl(locale, `/haberler/${item.slug}`)
                    : localizedUrl(locale, '/haberler'),
                })),
              ),
            }),
          ])}
        />

        {/* Breadcrumb */}
        <Breadcrumbs items={
          activeCategory
            ? [
                { label: companyName, href: localizedPath(locale, '/') },
                { label: t('news.title') },
                { label: activeCategory.name },
              ]
            : [
                { label: companyName, href: localizedPath(locale, '/') },
                { label: t('news.title') },
              ]
        } />

        {/* Page title */}
        <h1 className="nw-page-title">
          {activeCategory
            ? activeCategory.name
            : t('news.title')}
        </h1>

        {/* Category filter chips */}
        {categories.length > 0 && (
          <div className="nw-chips">
            <Link
              href={localizedPath(locale, '/haberler')}
              className={`nw-chip${!activeCategory ? ' nw-chip-active' : ''}`}
            >
              {t('news.all')}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={localizedPath(locale, `/haberler?category=${cat.slug}`)}
                className={`nw-chip${activeCategory?.id === cat.id ? ' nw-chip-active' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {posts.length === 0 && (
          <>
            <SeoIssueBeacon
              type="soft-404"
              pathname={localizedPath(locale, '/haberler')}
              reason="news-list-empty"
            />
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
              {t('news.emptyStateNote')}
            </p>
          </>
        )}

        {/* Main layout */}
        <div className="nw-layout">
          {/* LEFT COLUMN */}
          <div>
            {/* Featured article */}
            {featured && (
              <Link
                href={featured.slug ? localizedPath(locale, `/haberler/${featured.slug}`) : '#'}
                className="nw-featured"
              >
                {featured.category_name && (
                  <span className="nw-cat-badge">{featured.category_name}</span>
                )}
                <div className="nw-featured-title">{featured.title}</div>
                {featured.created_at && (
                  <span className="nw-featured-time">{formatRelativeTime(featured.created_at, t, locale)}</span>
                )}
                {resolveNewsImage(featured) && (
                  <div className="nw-featured-img">
                    <OptimizedImage
                      src={resolveNewsImage(featured)!}
                      alt={buildMediaAlt({
                        locale,
                        kind: 'blog',
                        title: featured.title,
                        alt: featured.alt,
                        caption: featured.description,
                        description: featured.description,
                      })}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 800px"
                      priority
                    />
                  </div>
                )}
                {featured.summary && (
                  <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginTop: 12, maxWidth: 720 }}>
                    {featured.summary}
                  </p>
                )}
                {/* Thumbnail strip */}
                {featured.images && Array.isArray(featured.images) && featured.images.length > 0 && (
                  <div className="nw-thumbstrip">
                    {featured.images.slice(0, 4).map((img: string, i: number) => (
                      <div key={i} className="nw-thumbstrip-item">
                        <OptimizedImage
                          src={absoluteAssetUrl(img) || img}
                          alt={`${featured.title} — ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                      </div>
                    ))}
                    {featured.images.length > 4 && (
                      <div className="nw-thumbstrip-more">+ {featured.images.length - 4}</div>
                    )}
                  </div>
                )}
              </Link>
            )}

            {/* Rest of articles */}
            {rest.map((post: any) => (
              <Link
                key={post.id ?? post.title}
                href={post.slug ? localizedPath(locale, `/haberler/${post.slug}`) : '#'}
                className="nw-article"
              >
                <div className="nw-article-body">
                  {post.category_name && (
                    <span className="nw-cat-badge">{post.category_name}</span>
                  )}
                  <h2 className="nw-article-title">{post.title}</h2>
                  {post.summary && (
                    <p className="nw-article-excerpt">{post.summary}</p>
                  )}
                  {post.created_at && (
                    <span className="nw-article-time">{formatRelativeTime(post.created_at, t, locale)}</span>
                  )}
                </div>
                {resolveNewsImage(post) && (
                  <div className="nw-article-thumb">
                    <OptimizedImage
                      src={resolveNewsImage(post)!}
                      alt={buildMediaAlt({
                        locale,
                        kind: 'blog',
                        title: post.title,
                        alt: post.alt,
                        caption: post.description,
                        description: post.description,
                      })}
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
            {/* Architecture You'll Love */}
            {sidebarPosts.length > 0 && (
              <div className="nw-sidebar-card">
                <h3>{t('news.loveTitle')}</h3>
                {sidebarPosts.map((sp: any) => (
                  <Link
                    key={sp.id ?? sp.title}
                    href={sp.slug ? localizedPath(locale, `/haberler/${sp.slug}`) : '#'}
                    className="nw-sidebar-item"
                  >
                    {resolveNewsImage(sp) && (
                      <div className="nw-sidebar-thumb">
                        <OptimizedImage
                          src={resolveNewsImage(sp)!}
                          alt={sp.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}
                    <span className="nw-sidebar-title">{sp.title}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Category list sidebar */}
            {categories.length > 0 && (
              <div className="nw-sidebar-card">
                <h3>{t('news.categories')}</h3>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={localizedPath(locale, `/haberler?category=${cat.slug}`)}
                    style={{
                      display: 'block',
                      padding: '8px 0',
                      fontSize: 14,
                      color: activeCategory?.id === cat.id ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                      fontWeight: activeCategory?.id === cat.id ? 600 : 400,
                      textDecoration: 'none',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Offer CTA */}
            <div
              className="nw-sidebar-card"
              style={{ background: 'var(--color-bg-secondary)', borderColor: 'transparent' }}
            >
              <h3 style={{ fontSize: 16 }}>{t('projects.requestOffer')}</h3>
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
                  color: 'var(--color-on-brand)',
                  fontWeight: 600,
                  fontSize: 13,
                  textDecoration: 'none',
                  borderRadius: 2,
                }}
              >
                {t('nav.offer')}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
