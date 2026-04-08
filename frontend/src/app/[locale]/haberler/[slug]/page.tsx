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
import { SocialShare } from '@/components/projects/SocialShare';
import { ProjectComments } from '@/components/projects/ProjectComments';
import { NewsImageGallery } from '@/components/news/NewsImageGallery';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedLinks } from '@/components/seo/RelatedLinks';
import { fetchRelatedContent } from '@/lib/related-content';

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

async function fetchPost(slug: string, locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom-pages/by-slug/${encodeURIComponent(slug)}?locale=${locale}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchSidebarNews(locale: string, excludeSlug: string, limit = 4) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom-pages?module_key=news&is_published=1&locale=${locale}&limit=${limit + 1}&sort=created_at&order=desc`,
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

async function fetchRelatedArticles(locale: string, excludeSlug: string, limit = 3) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom-pages?module_key=news&is_published=1&locale=${locale}&limit=${limit + 1}&sort=created_at&order=desc`,
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
    pathname: `/haberler/${slug}`,
    title: post.meta_title || post.title,
    description: post.meta_description || post.summary || post.title,
    ogImage: post.featured_image || post.image_url,
    openGraphType: 'article',
    includeLocaleAlternates: true,
  });
}

function formatDate(dateStr: string, locale: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(locale.startsWith('en') ? 'en-US' : 'tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatRelativeTime(dateStr: string, isEn: boolean): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return isEn ? 'just now' : 'az önce';
    if (diffHours < 24) return isEn ? `about ${diffHours} hours ago` : `yaklaşık ${diffHours} saat önce`;
    if (diffDays < 7) return isEn ? `${diffDays} days ago` : `${diffDays} gün önce`;
    return formatDate(dateStr, isEn ? 'en' : 'tr');
  } catch {
    return dateStr;
  }
}

export default async function NewsDetailPage({
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
  const imageSrc = resolveNewsImage(post);
  const shareUrl = `${SITE_URL}/${locale}/haberler/${slug}`;
  const rawImages: string[] = Array.isArray(post.images) ? post.images : [];
  const galleryImages = rawImages
    .map((img, i) => {
      const resolved = absoluteAssetUrl(img) || img;
      if (!resolved) return null;
      return {
        src: resolved,
        alt: `${post.title} — ${i + 1}`,
      };
    })
    .filter((img): img is { src: string; alt: string } => Boolean(img));
  const author = post.author_name || 'Bereket Fide';

  const postTags: string[] = Array.isArray(post.tags) ? post.tags : [];

  const [sidebarPosts, relatedArticles, related] = await Promise.all([
    fetchSidebarNews(locale, slug, 4),
    fetchRelatedArticles(locale, slug, 3),
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
    { label: isEn ? 'News' : 'Haberler', href: localizedPath(locale, '/haberler') },
    ...(post.category_name && post.category_slug
      ? [{ label: post.category_name, href: localizedPath(locale, `/haberler?category=${post.category_slug}`) }]
      : []),
    { label: post.title },
  ];

  return (
    <>
      <style>{`
        .nd-title{font-family:var(--font-heading);font-size:28px;font-weight:700;color:var(--color-text-primary);line-height:1.25;margin:4px 0 16px}
        .nd-hero{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:var(--color-bg-muted);margin-top:16px}
        .nd-hero-caption{font-size:12px;color:var(--color-text-muted);margin-top:6px;font-style:italic}
        .nd-meta{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-top:20px;padding-bottom:16px;border-bottom:1px solid var(--color-border)}
        .nd-author{font-size:14px;color:var(--color-text-secondary)}
        .nd-author b{color:var(--color-text-primary);font-weight:600}
        .nd-date{font-size:14px;color:var(--color-text-muted)}
        .nd-content{margin-top:24px;font-size:15px;line-height:1.8;color:var(--color-text-secondary)}
        .nd-content p{margin-bottom:16px}
        .nd-content h2,.nd-content h3{font-family:var(--font-heading);color:var(--color-text-primary);margin:28px 0 12px}
        .nd-content a{color:var(--color-brand);text-decoration:none}
        .nd-content a:hover{text-decoration:underline}
        .nd-content img{max-width:100%;height:auto;margin:16px 0}
        .nd-thumbstrip{display:flex;gap:6px;margin-top:20px;overflow-x:auto}
        .nd-thumbstrip-item{position:relative;width:120px;height:80px;flex-shrink:0;overflow:hidden;background:var(--color-bg-muted);cursor:pointer}
        .nd-thumbstrip-more{display:flex;align-items:center;justify-content:center;width:120px;height:80px;flex-shrink:0;background:var(--color-bg-muted);font-size:18px;font-weight:700;color:var(--color-text-muted)}
        .nd-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:24px}
        .nd-tag{padding:4px 12px;border-radius:2px;border:1px solid var(--color-border);font-size:12px;color:var(--color-text-secondary);text-decoration:none}
        .nd-tag:hover{border-color:var(--color-brand);color:var(--color-brand)}
        .nd-sidebar-card{border:1px solid var(--color-border);padding:20px;margin-bottom:20px}
        .nd-sidebar-card h3{font-family:var(--font-heading);font-size:18px;font-weight:700;color:var(--color-text-primary);margin:0 0 16px}
        .nd-sidebar-item{display:flex;gap:12px;text-decoration:none;margin-bottom:14px}
        .nd-sidebar-item:last-child{margin-bottom:0}
        .nd-sidebar-thumb{position:relative;width:80px;height:60px;flex-shrink:0;overflow:hidden;background:var(--color-bg-muted)}
        .nd-sidebar-title{font-size:14px;font-weight:600;color:var(--color-text-primary);line-height:1.3}
        .nd-sidebar-item:hover .nd-sidebar-title{color:var(--color-brand)}
        .nd-related-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--color-text-muted);margin-bottom:16px}
        @media(min-width:1024px){.nd-layout{display:grid;grid-template-columns:1fr 340px;gap:40px}}
      `}</style>

      <JsonLd
        data={jsonld.graph([
          jsonld.org(org),
          jsonld.newsArticle({
            headline: post.title,
            description: post.description,
            image: imageSrc || undefined,
            datePublished: post.created_at,
            dateModified: post.updated_at,
            author: post.author_name || org.name,
            publisher: {
              name: org.name,
              logo: org.logo as string | undefined,
            },
            speakable: { cssSelector: ['h1.nd-title', '.nd-content'] },
          }),
          jsonld.breadcrumb(
            breadcrumbs.map((item) => ({
              name: item.label,
              url: 'href' in item && item.href
                ? localizedUrl(locale, (item.href as string).replace(`/${locale}`, '') || '/')
                : localizedUrl(locale, `/haberler/${slug}`),
            })),
          ),
        ])}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>

        {/* Breadcrumb */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Category badge + Title */}
        {post.category_name && (
          <Link
            href={localizedPath(locale, `/haberler?category=${post.category_slug || ''}`)}
            style={{
              display: 'inline-block',
              padding: '2px 10px',
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '.04em',
              color: 'var(--color-brand)',
              border: '1px solid var(--color-brand)',
              textDecoration: 'none',
              marginBottom: 8,
            }}
          >
            {post.category_name}
          </Link>
        )}
        <h1 className="nd-title">{post.title}</h1>

        {/* Social share */}
        <div style={{ marginBottom: 8 }}>
          <SocialShare
            url={shareUrl}
            title={post.title}
            description={post.meta_description || post.description?.slice(0, 160)}
            locale={locale}
            saveLabel={t('common.save')}
          />
        </div>

        {/* Main layout */}
        <div className="nd-layout">
          {/* LEFT COLUMN */}
          <div>
            {/* Hero image + gallery with lightbox */}
            {imageSrc && (
              <NewsImageGallery
                heroSrc={imageSrc}
                heroAlt={buildMediaAlt({
                  locale,
                  kind: 'blog',
                  title: post.title,
                  alt: post.featured_image_alt,
                  caption: post.description,
                  description: post.description,
                })}
                images={galleryImages}
                caption={post.image_caption}
              />
            )}

            {/* Author + Date */}
            <div className="nd-meta">
              <span className="nd-author">
                {isEn ? 'Written by ' : 'Yazan: '}
                <b>{author}</b>
              </span>
              {post.created_at && (
                <span className="nd-date">
                  {isEn ? 'Published on ' : 'Yayınlanma: '}
                  {formatDate(post.created_at, locale)}
                </span>
              )}
            </div>

            {/* Content */}
            {content && (
              <div
                className="nd-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {/* Thumbnail strip is rendered inside NewsImageGallery */}

            {/* Tags */}
            {postTags.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 10 }}>
                  {isEn ? 'Tags' : 'Etiketler'}
                </h3>
                <div className="nd-tags">
                  {postTags.map((tag: string) => (
                    <span key={tag} className="nd-tag">{tag}</span>
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
                  {t('projects.requestOffer')}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    marginTop: 4,
                    color: 'color-mix(in srgb, var(--section-bg-white) 70%, transparent)',
                  }}
                >
                  {t('common.offerCtaDescription')}
                </p>
              </div>
              <Link
                href={localizedPath(locale, '/teklif')}
                style={{
                  padding: '10px 24px',
                  background: 'var(--color-brand)',
                  color: 'var(--color-on-brand)',
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: 'none',
                  borderRadius: 2,
                  whiteSpace: 'nowrap',
                }}
              >
                {t('nav.offer')}
              </Link>
            </div>

            {/* Comments */}
            <ProjectComments
              targetType="news"
              targetId={post.id || slug}
              apiBaseUrl={API_BASE_URL}
              locale={locale}
              texts={{
                title: t('projects.comments.title'),
                viewing: t('projects.comments.viewing'),
                commentingAs: t('projects.comments.commentingAs'),
                guest: t('common.guest'),
                loginLink: t('projects.comments.loginLink'),
                signupLink: t('projects.comments.signupLink'),
                namePlaceholder: t('projects.comments.namePlaceholder'),
                commentPlaceholder: t('projects.comments.commentPlaceholder'),
                uploadingImage: t('projects.comments.uploadingImage'),
                photoVideo: t('projects.comments.photoVideo'),
                submitComment: t('projects.comments.submitComment'),
                sending: t('common.sending'),
                successMessage: t('projects.comments.successMessage'),
                loadingComments: t('projects.comments.loadingComments'),
                emptyTitle: t('projects.comments.emptyTitle'),
                emptySubtitle: t('projects.comments.emptySubtitle'),
                captchaLoading: t('projects.comments.captchaLoading'),
                captchaPending: t('projects.comments.captchaPending'),
                captchaLoadFailed: t('projects.comments.captchaLoadFailed'),
                captchaVerifyFailed: t('projects.comments.captchaVerifyFailed'),
                captchaRequired: t('projects.comments.captchaRequired'),
                captchaBypass: t('projects.comments.captchaBypass'),
              }}
            />
          </div>

          {/* RIGHT SIDEBAR */}
          <aside>
            {/* Architecture You'll Love */}
            {sidebarPosts.length > 0 && (
              <div className="nd-sidebar-card">
                <h3>{isEn ? "News You'll Love" : 'Beğeneceğiniz Haberler'}</h3>
                {sidebarPosts.map((sp: any) => (
                  <Link
                    key={sp.id ?? sp.title}
                    href={sp.slug ? localizedPath(locale, `/haberler/${sp.slug}`) : '#'}
                    className="nd-sidebar-item"
                  >
                    {resolveNewsImage(sp) && (
                      <div className="nd-sidebar-thumb">
                        <OptimizedImage
                          src={resolveNewsImage(sp)!}
                          alt={sp.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}
                    <span className="nd-sidebar-title">{sp.title}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="nd-sidebar-card">
                <div className="nd-related-title">{isEn ? 'RELATED ARTICLES' : 'İLGİLİ HABERLER'}</div>
                {relatedArticles.map((ra: any) => (
                  <Link
                    key={ra.id ?? ra.title}
                    href={ra.slug ? localizedPath(locale, `/haberler/${ra.slug}`) : '#'}
                    className="nd-sidebar-item"
                  >
                    {resolveNewsImage(ra) && (
                      <div className="nd-sidebar-thumb">
                        <OptimizedImage
                          src={resolveNewsImage(ra)!}
                          alt={ra.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}
                    <span className="nd-sidebar-title">{ra.title}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Offer CTA sidebar */}
            <div
              className="nd-sidebar-card"
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
