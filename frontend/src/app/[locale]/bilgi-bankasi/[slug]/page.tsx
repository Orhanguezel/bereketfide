import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { absoluteAssetUrl, API_BASE_URL, SITE_URL } from '@/lib/utils';
import { normalizeRichContent } from '@/lib/rich-content';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl, organizationJsonLd } from '@/seo';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { buildMediaAlt } from '@/lib/media-seo';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedLinks } from '@/components/seo/RelatedLinks';
import { fetchRelatedContent } from '@/lib/related-content';

const MODULE_KEY = 'bilgi-bankasi';

async function fetchPost(slug: string, locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom-pages/by-slug/${encodeURIComponent(slug)}?locale=${locale}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    // Ensure it belongs to this module
    if (data?.module_key && data.module_key !== MODULE_KEY) return null;
    return data;
  } catch {
    return null;
  }
}

async function fetchRelatedPosts(locale: string, excludeSlug: string, limit = 4) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom-pages?module_key=${MODULE_KEY}&is_published=1&locale=${locale}&limit=${limit + 1}`,
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
  const post = await fetchPost(slug, locale);
  if (!post) return {};
  return buildPageMetadata({
    locale,
    pathname: `/bilgi-bankasi/${slug}`,
    title: post.meta_title || post.title,
    description: post.meta_description || post.summary || post.title,
    ogImage: post.featured_image || post.image_url,
    openGraphType: 'article',
    includeLocaleAlternates: true,
  });
}

export default async function KnowledgeBaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const isEn = locale.startsWith('en');
  const post = await fetchPost(slug, locale);
  if (!post) notFound();

  const content = normalizeRichContent(post.content);
  const org = organizationJsonLd(locale);
  const imageSrc = absoluteAssetUrl(post.featured_image || post.image_url) || null;
  const shareUrl = `${SITE_URL}/${locale}/bilgi-bankasi/${slug}`;
  const postTags: string[] = Array.isArray(post.tags) ? post.tags : [];
  const pageTitle = isEn ? 'Knowledge Base' : 'Bilgi Bankası';

  const [relatedPosts, related] = await Promise.all([
    fetchRelatedPosts(locale, slug, 4),
    fetchRelatedContent(
      {
        title: post.title,
        description: post.summary || post.description || null,
        slug: post.slug || slug,
        tags: postTags,
      },
      slug,
      locale,
    ),
  ]);

  const breadcrumbs = [
    { label: 'Bereket Fide', href: localizedPath(locale, '/') },
    { label: pageTitle, href: localizedPath(locale, '/bilgi-bankasi') },
    ...(post.category_name && post.category_slug
      ? [{ label: post.category_name, href: localizedPath(locale, `/bilgi-bankasi?category=${post.category_slug}`) }]
      : []),
    { label: post.title },
  ];

  return (
    <>
      <style>{`
        .kb-d-title{font-family:var(--font-heading);font-size:30px;font-weight:800;color:var(--color-text-primary);line-height:1.2;margin:4px 0 16px}
        .kb-d-hero{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:var(--color-bg-muted);margin-bottom:28px;border-radius:4px}
        .kb-d-content{font-size:16px;line-height:1.85;color:var(--color-text-secondary)}
        .kb-d-content p{margin-bottom:18px}
        .kb-d-content h2,.kb-d-content h3{font-family:var(--font-heading);color:var(--color-text-primary);margin:32px 0 14px;font-weight:700}
        .kb-d-content ul,.kb-d-content ol{margin:16px 0;padding-left:24px}
        .kb-d-content li{margin-bottom:8px}
        .kb-d-content a{color:var(--color-brand);text-decoration:none;font-weight:500}
        .kb-d-content a:hover{text-decoration:underline}
        .kb-d-content img{max-width:100%;height:auto;margin:20px 0;border-radius:4px}
        .kb-d-content blockquote{border-left:3px solid var(--color-brand);margin:24px 0;padding:12px 20px;background:var(--color-bg-secondary);font-style:italic}
        .kb-d-meta{display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding:12px 0 20px;border-bottom:1px solid var(--color-border);margin-bottom:24px;font-size:13px;color:var(--color-text-muted)}
        .kb-d-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:28px}
        .kb-d-tag{padding:4px 12px;border-radius:2px;border:1px solid var(--color-border);font-size:12px;color:var(--color-text-secondary);text-decoration:none}
        .kb-d-tag:hover{border-color:var(--color-brand);color:var(--color-brand)}
        .kb-sidebar-card{border:1px solid var(--color-border);padding:20px;margin-bottom:20px}
        .kb-sidebar-card h3{font-family:var(--font-heading);font-size:16px;font-weight:700;color:var(--color-text-primary);margin:0 0 14px}
        .kb-sidebar-item{display:block;padding:8px 0;font-size:14px;color:var(--color-text-secondary);text-decoration:none;border-bottom:1px solid var(--color-border);line-height:1.4}
        .kb-sidebar-item:last-child{border-bottom:none}
        .kb-sidebar-item:hover{color:var(--color-brand)}
        @media(min-width:1024px){.kb-d-layout{display:grid;grid-template-columns:1fr 320px;gap:48px}}
      `}</style>

      <JsonLd
        data={jsonld.graph([
          jsonld.org(org),
          jsonld.article({
            headline: post.title,
            description: post.summary || post.meta_description,
            image: imageSrc || undefined,
            datePublished: post.created_at,
            dateModified: post.updated_at,
            author: post.author_name || org.name,
            publisher: { name: org.name, logo: org.logo as string | undefined },
            speakable: { cssSelector: ['h1.kb-d-title', '.kb-d-content'] },
          }),
          jsonld.howTo({
            name: post.title,
            description: post.summary || post.meta_description,
            image: imageSrc || undefined,
            url: localizedUrl(locale, `/bilgi-bankasi/${slug}`),
          }),
          jsonld.breadcrumb(
            breadcrumbs.map((item) => ({
              name: item.label,
              url: 'href' in item && item.href
                ? localizedUrl(locale, (item.href as string).replace(`/${locale}`, '') || '/')
                : localizedUrl(locale, `/bilgi-bankasi/${slug}`),
            })),
          ),
        ])}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>
        <Breadcrumbs items={breadcrumbs} />

        {post.category_name && (
          <Link
            href={localizedPath(locale, `/bilgi-bankasi?category=${post.category_slug || ''}`)}
            style={{ display: 'inline-block', padding: '2px 10px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--color-brand)', border: '1px solid var(--color-brand)', textDecoration: 'none', marginBottom: 8 }}
          >
            {post.category_name}
          </Link>
        )}

        <h1 className="kb-d-title">{post.title}</h1>

        <div className="kb-d-meta">
          {post.author_name && (
            <span>{isEn ? 'By' : 'Yazan:'} <b style={{ color: 'var(--color-text-primary)' }}>{post.author_name}</b></span>
          )}
          {post.created_at && (
            <span>
              {new Date(post.created_at).toLocaleDateString(
                isEn ? 'en-US' : 'tr-TR',
                { year: 'numeric', month: 'long', day: 'numeric' },
              )}
            </span>
          )}
        </div>

        <div className="kb-d-layout">
          <div>
            {imageSrc && (
              <div className="kb-d-hero">
                <OptimizedImage
                  src={imageSrc}
                  alt={buildMediaAlt({ locale, kind: 'blog', title: post.title, alt: post.alt })}
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 800px"
                  priority
                />
              </div>
            )}

            {post.summary && (
              <p style={{ fontSize: 17, fontWeight: 500, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 24, borderLeft: '3px solid var(--color-brand)', paddingLeft: 16 }}>
                {post.summary}
              </p>
            )}

            {content && (
              <div
                className="kb-d-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {postTags.length > 0 && (
              <div className="kb-d-tags">
                {postTags.map((tag: string) => (
                  <span key={tag} className="kb-d-tag">{tag}</span>
                ))}
              </div>
            )}

            <div style={{ marginTop: 48, display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              <RelatedLinks
                title={t('common.relatedProducts')}
                hrefBase={localizedPath(locale, '/urunler')}
                items={related.products}
              />
              <RelatedLinks
                title={isEn ? 'Related Articles' : 'İlgili Makaleler'}
                hrefBase={localizedPath(locale, '/haberler')}
                items={related.blogPosts}
              />
            </div>

            {/* CTA */}
            <div style={{ marginTop: 40, padding: '24px 28px', background: 'var(--color-bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-on-dark)', margin: 0 }}>
                  {isEn ? 'Need Seedlings?' : 'Fide İhtiyacınız mı Var?'}
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

          <aside>
            {relatedPosts.length > 0 && (
              <div className="kb-sidebar-card">
                <h3>{isEn ? 'Related Guides' : 'İlgili Rehberler'}</h3>
                {relatedPosts.map((p: any) => (
                  <Link key={p.id ?? p.slug} href={localizedPath(locale, `/bilgi-bankasi/${p.slug}`)} className="kb-sidebar-item">
                    {p.title}
                  </Link>
                ))}
              </div>
            )}

            <div className="kb-sidebar-card" style={{ background: 'var(--color-bg-secondary)', borderColor: 'transparent' }}>
              <h3>{isEn ? 'All Guides' : 'Tüm Rehberler'}</h3>
              <Link
                href={localizedPath(locale, '/bilgi-bankasi')}
                style={{ display: 'inline-block', marginTop: 4, padding: '8px 20px', background: 'var(--color-brand)', color: 'var(--color-on-brand)', fontWeight: 600, fontSize: 13, textDecoration: 'none', borderRadius: 2 }}
              >
                {isEn ? '← Back to Knowledge Base' : '← Bilgi Bankasına Dön'}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
