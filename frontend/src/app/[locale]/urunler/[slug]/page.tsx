import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { API_BASE_URL, SITE_URL, absoluteAssetUrl } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl, organizationJsonLd } from '@/seo';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { ProjectGallery } from '@/components/projects/ProjectGallery';
import type { GalleryImage } from '@/components/projects/ProjectGallery';
import { SocialShare } from '@/components/projects/SocialShare';
import { ProjectSpecs } from '@/components/projects/ProjectSpecs';
import type { SpecItem } from '@/components/projects/ProjectSpecs';
import { ProjectComments } from '@/components/projects/ProjectComments';
import { buildMediaAlt } from '@/lib/media-seo';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedLinks } from '@/components/seo/RelatedLinks';
import { fetchRelatedContent } from '@/lib/related-content';
import { Reveal } from '@/components/motion/Reveal';
import specKeysData from '@shared/spec-keys.json';

import { GALLERY_IMAGE_PLACEHOLDER } from '@/lib/placeholders';
import {
  coerceProductSpecifications,
  productSpecificationsToItems,
} from '@/lib/product-specifications';
import { bereketfideAgronomySpecItems } from '@/lib/bereketfide-product-agronomy';

/** Build a lookup: spec id → all possible locale keys */
type SpecEntry = { id: string; keys: Record<string, string>; labels: Record<string, string> };
const SPEC_ENTRIES: SpecEntry[] = specKeysData.project;

/** For a given spec id, return all known locale keys */
function allKeysForId(id: string): string[] {
  const entry = SPEC_ENTRIES.find((e) => e.id === id);
  return entry ? Object.values(entry.keys) : [id];
}

/** Get spec label for a given id and locale */
function specLabel(id: string, locale: string): string {
  const lang = locale.split('-')[0] || 'en';
  const entry = SPEC_ENTRIES.find((e) => e.id === id);
  if (!entry) return id;
  return entry.labels[lang] || entry.labels['en'] || id;
}

async function fetchProject(slug: string, locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products/by-slug/${encodeURIComponent(slug)}?locale=${locale}&item_type=bereketfide`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchProductFaqs(productId: string, locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products/faqs?product_id=${encodeURIComponent(productId)}&only_active=1&locale=${locale}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchSidebarProjects(
  locale: string,
  opts: {
    excludeId?: string;
    categoryId?: string;
    isFeatured?: boolean;
    sort?: string;
    limit?: number;
    tags?: string[];
  } = {},
) {
  const params = new URLSearchParams({
    item_type: 'bereketfide',
    is_active: '1',
    locale,
    limit: String(opts.limit ?? 4),
  });
  if (opts.excludeId) params.set('exclude_id', opts.excludeId);
  if (opts.categoryId) params.set('category_id', opts.categoryId);
  if (opts.isFeatured) params.set('is_featured', '1');
  if (opts.sort) params.set('sort', opts.sort);
  if (opts.tags && opts.tags.length > 0) params.set('tags', opts.tags.join(','));
  params.set('order', 'desc');

  try {
    const res = await fetch(`${API_BASE_URL}/products?${params}`, {
      next: { revalidate: 300 },
    });
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
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await fetchProject(slug, locale);
  if (!project) return {};
  return buildPageMetadata({
    locale,
    pathname: `/urunler/${slug}`,
    title: project.meta_title || project.title,
    description: project.meta_description || project.description || project.title,
    ogImage: project.image_url,
    includeLocaleAlternates: true,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const project = await fetchProject(slug, locale);
  if (!project) notFound();

  const projectId = project.id;
  const categoryId = project.category_id || project.category?.id;
  const projectTags: string[] = project.tags || [];

  // Parallel sidebar fetches — all dynamic from API
  const [sameCategoryProjects, featuredProjects, recentProjects, similarByTagsProjects, related, productFaqs] =
    await Promise.all([
      categoryId
        ? fetchSidebarProjects(locale, { excludeId: projectId, categoryId, limit: 4 })
        : Promise.resolve([]),
      fetchSidebarProjects(locale, { excludeId: projectId, isFeatured: true, limit: 4 }),
      fetchSidebarProjects(locale, { excludeId: projectId, sort: 'created_at', limit: 6 }),
      projectTags.length > 0
        ? fetchSidebarProjects(locale, { excludeId: projectId, tags: projectTags, limit: 4 })
        : Promise.resolve([]),
      fetchRelatedContent(
        {
          title: project.title,
          description: project.description || project.meta_description || null,
          slug: project.slug || slug,
          tags: projectTags,
        },
        slug,
        locale,
      ),
      projectId ? fetchProductFaqs(projectId, locale) : Promise.resolve([]),
    ]);

  const specs = coerceProductSpecifications(project.specifications);
  const isBereketfide = String(project.item_type || '').toLowerCase() === 'bereketfide';
  const isEn = locale.startsWith('en');

  /** Resolve spec value by id — searches all locale key variants */
  function sv(id: string): string | null {
    const keys = allKeysForId(id);
    for (const k of keys) {
      const norm = k.toLowerCase().replace(/[\s_]+/g, '');
      for (const [sk, val] of Object.entries(specs)) {
        if (sk.toLowerCase().replace(/[\s_]+/g, '') === norm && val) return val;
      }
    }
    return null;
  }

  /** Shorthand: label with colon for current locale */
  const sl = (id: string) => `${specLabel(id, locale)}:`;

  const location = sv('location');
  const year = sv('year');
  const area = sv('area');
  const projectType = isBereketfide
    ? specs.kategori ||
      specs.category ||
      project.category_name ||
      specs.tip ||
      specs.type ||
      null
    : sv('type') || project.category_name || null;
  const status = sv('status');
  const architects = sv('architects');
  const leadArchitect = sv('lead_architect');
  const manufacturers = sv('manufacturers');
  const projectTeam = sv('project_team');
  const landscapeArch = sv('landscape_architecture');
  const interiorDesign = sv('interior_design');
  const engineering = sv('engineering');
  const generalConstruction = sv('general_construction');
  const city = sv('city');
  const country = sv('country');
  const contractor = sv('contractor');
  const tags = projectTags;

  // Build spec items for the expandable component
  const primarySpecs: SpecItem[] = [
    architects && { icon: 'architects', label: sl('architects'), value: architects, isLink: true },
    area && { icon: 'area', label: sl('area'), value: area },
    year && { icon: 'year', label: sl('year'), value: year },
    manufacturers && { icon: 'manufacturers', label: sl('manufacturers'), value: manufacturers },
    leadArchitect && { icon: 'leadArchitect', label: sl('lead_architect'), value: leadArchitect },
    status && { icon: 'status', label: sl('status'), value: status },
  ].filter(Boolean) as SpecItem[];

  const secondarySpecs: SpecItem[] = [
    projectType && { icon: 'category', label: sl('type'), value: projectType, isLink: true },
    projectTeam && { icon: 'team', label: sl('project_team'), value: projectTeam },
    landscapeArch && { icon: 'default', label: sl('landscape_architecture'), value: landscapeArch },
    interiorDesign && { icon: 'default', label: sl('interior_design'), value: interiorDesign },
    engineering && { icon: 'default', label: sl('engineering'), value: engineering },
    generalConstruction && { icon: 'default', label: sl('general_construction'), value: generalConstruction },
    city && { icon: 'city', label: sl('city'), value: city },
    country && { icon: 'country', label: sl('country'), value: country },
    location && { icon: 'location', label: sl('location'), value: location },
    contractor && { icon: 'default', label: sl('contractor'), value: contractor },
  ].filter(Boolean) as SpecItem[];

  const genericSpecItems = isBereketfide ? productSpecificationsToItems(specs) : [];
  const constructionSpecItems = [...primarySpecs, ...secondarySpecs];
  const agronomySpecs = isBereketfide
    ? bereketfideAgronomySpecItems(project as Record<string, unknown>, (key) => t(key))
    : [];
  const displaySpecs = !isBereketfide ? constructionSpecItems : [];

  const rawGalleryImages: string[] = Array.isArray(project.images) ? project.images : [];
  const heroImage = absoluteAssetUrl(project.image_url) || absoluteAssetUrl(rawGalleryImages[0]) || GALLERY_IMAGE_PLACEHOLDER;

  // Build serializable gallery images array for the client component
  const galleryImages: GalleryImage[] = [
    { src: heroImage, alt: buildMediaAlt({ locale, kind: 'project', title: project.title, alt: project.alt, caption: project.caption, description: project.description }) },
    ...rawGalleryImages
      .filter((img) => absoluteAssetUrl(img) !== heroImage)
      .map((img, i) => ({
        src: absoluteAssetUrl(img) || GALLERY_IMAGE_PLACEHOLDER,
        alt: `${project.title} — ${i + 2}`,
      })),
  ];

  const shareUrl = `${SITE_URL}/${locale}/urunler/${slug}`;

  const breadcrumbs = [
    { label: 'Bereket Fide', href: localizedPath(locale, '/') },
    { label: isEn ? 'Products' : 'Ürünler', href: localizedPath(locale, '/urunler') },
    ...(projectType ? [{ label: projectType, href: localizedPath(locale, '/urunler') }] : []),
    { label: project.title },
  ];

  return (
    <>
      <style>{`
        .pd-sidebar-card{border:1px solid var(--color-border);padding:20px;margin-bottom:20px}
        .pd-sidebar-card h3{font-size:18px;font-weight:700;color:var(--color-text-primary);margin:0 0 16px}
        .pd-sidebar-item{display:flex;gap:12px;text-decoration:none;margin-bottom:14px}
        .pd-sidebar-item:last-child{margin-bottom:0}
        .pd-sidebar-thumb{position:relative;width:80px;height:60px;flex-shrink:0;overflow:hidden;background:var(--color-bg-muted)}
        .pd-sidebar-title{font-size:14px;font-weight:600;color:var(--color-text-primary);line-height:1.3}
        .pd-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:20px}
        .pd-tag{padding:4px 12px;border-radius:2px;border:1px solid var(--color-border);font-size:12px;color:var(--color-text-secondary);text-decoration:none}
        .pd-tag:hover{border-color:var(--color-brand);color:var(--color-brand)}
        @media(min-width:1024px){.pd-layout{display:grid;grid-template-columns:1fr 340px;gap:40px}}
      `}</style>

      <JsonLd
        data={jsonld.graph([
          jsonld.org(organizationJsonLd(locale)),
          jsonld.product({
            name: project.title,
            description: project.meta_description || project.description,
            image: heroImage,
            url: localizedUrl(locale, `/urunler/${slug}`),
            brand: 'Bereket Fide',
            category: project.category_name || projectType || undefined,
            sku: project.product_code || undefined,
            offers: {
              priceCurrency: 'TRY',
              price: project.price || undefined,
              availability: project.stock_quantity > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
            aggregateRating: project.rating && project.review_count
              ? { ratingValue: project.rating, reviewCount: project.review_count }
              : undefined,
            manufacturer: { '@id': 'https://www.bereketfide.com.tr/#organization' },
          }),
          ...(productFaqs.length > 0
            ? [jsonld.faqPage(productFaqs.map((f: any) => ({ question: f.question, answer: f.answer })))]
            : []),
          jsonld.breadcrumb(
            breadcrumbs.map((item) => ({
              name: item.label,
              url: 'href' in item && item.href
                ? localizedUrl(locale, (item.href as string).replace(`/${locale}`, '') || '/')
                : localizedUrl(locale, `/urunler/${slug}`),
            })),
          ),
        ])}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>

        {/* ── Breadcrumb ── */}
        <Breadcrumbs items={breadcrumbs} />

        {/* ── Title ── */}
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: 1.25,
            margin: '4px 0 16px',
          }}
        >
          {project.title}
        </h1>

        {/* ── Social share ── */}
        <div style={{ marginBottom: 16 }}>
          <SocialShare
            url={shareUrl}
            title={project.title}
            description={project.meta_description || project.description?.slice(0, 160)}
            locale={locale}
            saveLabel={t('common.save')}
          />
        </div>

        {/* ── Main layout: content + sidebar ── */}
        <div className="pd-layout">
          {/* ══ LEFT COLUMN ══ */}
          <div>
            {/* Hero image + thumbnail strip (clickable → lightbox) */}
            <ProjectGallery images={galleryImages} priority />

            {/* ── Category + Location line ── */}
            <div style={{ marginTop: 20, fontSize: 14 }}>
              {projectType && (
                <span style={{ fontWeight: 700, color: 'var(--color-brand)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {projectType}
                </span>
              )}
              {projectType && location && <span style={{ color: 'var(--color-text-muted)' }}> · </span>}
              {location && (
                <span style={{ color: 'var(--color-text-secondary)' }}>{location}</span>
              )}
            </div>

            {/* Bereket Fide: şema alanları (API) + isteğe bağlı specifications JSON */}
            {isBereketfide && (agronomySpecs.length > 0 || genericSpecItems.length > 0) ? (
              <div style={{ marginTop: 16, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
                {agronomySpecs.length > 0 ? (
                  <>
                    <h2
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--color-text-muted)',
                        margin: '0 0 12px',
                      }}
                    >
                      {t('projects.agronomySectionTitle')}
                    </h2>
                    <ProjectSpecs specs={agronomySpecs} />
                  </>
                ) : null}
                {genericSpecItems.length > 0 ? (
                  <div style={{ marginTop: agronomySpecs.length > 0 ? 28 : 0 }}>
                    <h2
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--color-text-muted)',
                        margin: '0 0 12px',
                      }}
                    >
                      {t('projects.specs')}
                    </h2>
                    <ProjectSpecs specs={genericSpecItems} />
                  </div>
                ) : null}
              </div>
            ) : null}

            {!isBereketfide && displaySpecs.length > 0 ? (
              <div style={{ marginTop: 16, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
                <ProjectSpecs specs={displaySpecs} />
              </div>
            ) : null}

            {/* ── Scroll-trigger gallery flow ── */}
            {galleryImages.length > 1 && (
              <div style={{ marginTop: 40 }}>
                {galleryImages.slice(1).map((img, i) => (
                  <Reveal key={i} delay={i < 3 ? i * 80 : 0}>
                    <div style={{ marginBottom: 12, position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: 'var(--color-bg-muted)' }}>
                      <OptimizedImage
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width:1024px) 100vw, 65vw"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            {/* ── Description ── */}
            {(project.content || project.description) && (
              <div style={{ marginTop: 32 }}>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 8, fontStyle: 'italic' }}>
                  {isEn ? 'Product description and production details provided by our experts.' : 'Ziraat mühendislerimiz tarafından sağlanan ürün açıklaması.'}
                </p>
                <div
                  style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--color-text-secondary)' }}
                  dangerouslySetInnerHTML={{ __html: project.content || project.description }}
                />
              </div>
            )}

            {/* ── Tags ── */}
            {tags.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 10 }}>
                  {isEn ? 'Tags' : 'Etiketler'}
                </h3>
                <div className="pd-tags">
                  {tags.map((tag: string) => (
                    <span key={tag} className="pd-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* ── CTA ── */}
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
                href={`${localizedPath(locale, '/teklif')}?project=${encodeURIComponent(project.title)}`}
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
              {related.knowledgeBasePosts.length > 0 && (
                <RelatedLinks
                  title={isEn ? 'Growing Guides' : 'Yetiştirme Rehberleri'}
                  hrefBase={localizedPath(locale, '/bilgi-bankasi')}
                  items={related.knowledgeBasePosts}
                />
              )}
              <RelatedLinks
                title={t('common.relatedGallery')}
                hrefBase={localizedPath(locale, '/galeri')}
                items={related.galleries}
              />
            </div>

            {/* ── Comments ── */}
            <ProjectComments
              targetType="project"
              targetId={projectId || slug}
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

          {/* ══ RIGHT SIDEBAR ══ */}
          <aside>
            {/* ── 1. Same category projects ── */}
            {sameCategoryProjects.length > 0 && (
              <SidebarSection
                title={
                  projectType
                    ? (isEn ? `More ${projectType}` : `Daha Fazla ${projectType}`)
                    : (isEn ? 'More Products' : 'Daha Fazla Ürün')
                }
                projects={sameCategoryProjects}
                locale={locale}
                moreHref={localizedPath(locale, '/urunler')}
                moreLabel={isEn ? 'See All »' : 'Tümünü Gör »'}
              />
            )}

            {/* ── 2. Featured / Öne Çıkanlar ── */}
            {featuredProjects.length > 0 && (
              <SidebarSection
                title={isEn ? 'Featured Products' : 'Öne Çıkan Ürünler'}
                projects={featuredProjects.slice(0, 3)}
                locale={locale}
              />
            )}

            {/* ── 3. Recently Added / Son Eklenenler ── */}
            {recentProjects.length > 0 && (
              <SidebarSection
                title={isEn ? 'Recently Added' : 'Son Eklenenler'}
                projects={recentProjects.slice(0, 4)}
                locale={locale}
                moreHref={localizedPath(locale, '/urunler')}
                moreLabel={isEn ? 'All products »' : 'Tüm ürünler »'}
              />
            )}

            {/* ── 4. Benzer İçerikler (tag-based) ── */}
            {similarByTagsProjects.length > 0 && (
              <TagBasedSection
                title={t('projects.similarByTagsTitle')}
                projects={similarByTagsProjects}
                matchingTags={tags}
                locale={locale}
                isEn={isEn}
              />
            )}

            {/* ── 5. About this producer ── */}
            {architects && (
              <div className="pd-sidebar-card">
                <h3 style={{ fontSize: 15 }}>{t('projects.aboutProducerTitle')}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'var(--color-bg-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      fontWeight: 700,
                      color: 'var(--color-brand)',
                      flexShrink: 0,
                    }}
                  >
                    {architects.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {architects}
                    </span>
                    {location && (
                      <span style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                        {location}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={localizedPath(locale, '/urunler')}
                  aria-label={isEn ? 'View all Bereket Fide products' : 'Bereket Fide tüm ürünlerini görüntüle'}
                  style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 2,
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    textDecoration: 'none',
                  }}
                >
                  {isEn ? 'View All Products' : 'Tüm Ürünleri Gör'}
                </Link>
              </div>
            )}

            {/* ── 6. Request offer sidebar ── */}
            <div
              className="pd-sidebar-card"
              style={{ background: 'var(--color-bg-secondary)', borderColor: 'transparent' }}
            >
              <h3 style={{ fontSize: 16 }}>{t('projects.requestOffer')}</h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {t('common.offerCtaDescription')}
              </p>
              <Link
                href={`${localizedPath(locale, '/teklif')}?project=${encodeURIComponent(project.title)}`}
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

/* ── Reusable sidebar section ── */
function SidebarSection({
  title,
  projects,
  locale,
  moreHref,
  moreLabel,
}: {
  title: string;
  projects: any[];
  locale: string;
  moreHref?: string;
  moreLabel?: string;
}) {
  return (
    <div className="pd-sidebar-card">
      <h3>{title}</h3>
      {projects.map((rp: any) => (
        <Link
          key={rp.id ?? rp.title}
          href={rp.slug ? localizedPath(locale, `/urunler/${rp.slug}`) : '#'}
          className="pd-sidebar-item"
        >
          <div className="pd-sidebar-thumb">
            <OptimizedImage
              src={absoluteAssetUrl(rp.image_url) || GALLERY_IMAGE_PLACEHOLDER}
              alt={rp.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div>
            <span className="pd-sidebar-title">{rp.title}</span>
            {(rp.specifications?.lokasyon || rp.specifications?.location) && (
              <span style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                {rp.specifications.lokasyon || rp.specifications.location}
              </span>
            )}
          </div>
        </Link>
      ))}
      {moreHref && moreLabel && (
        <Link
          href={moreHref}
          aria-label={`${moreLabel} - ${title}`}
          style={{ fontSize: 13, color: 'var(--color-brand)', textDecoration: 'none', marginTop: 10, display: 'inline-block' }}
        >
          {moreLabel}
        </Link>
      )}
    </div>
  );
}

/* ── Tag-based similar projects section ── */
function TagBasedSection({
  title,
  projects,
  matchingTags,
  locale,
  isEn,
}: {
  title: string;
  projects: any[];
  matchingTags: string[];
  locale: string;
  isEn: boolean;
}) {
  return (
    <div className="pd-sidebar-card" style={{ borderColor: 'var(--color-brand)', borderWidth: 1 }}>
      <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>&#9733;</span>
        {title}
      </h3>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '-8px 0 14px', lineHeight: 1.4 }}>
        {isEn
          ? 'Based on shared themes with this product'
          : 'Bu ürünle ortak temalara dayalı öneriler'}
      </p>
      {matchingTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
          {matchingTags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              style={{
                padding: '2px 10px',
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 2,
                background: 'var(--color-bg-muted)',
                color: 'var(--color-brand)',
                letterSpacing: '0.02em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {projects.map((rp: any) => (
        <Link
          key={rp.id ?? rp.title}
          href={rp.slug ? localizedPath(locale, `/urunler/${rp.slug}`) : '#'}
          className="pd-sidebar-item"
        >
          <div className="pd-sidebar-thumb">
            <OptimizedImage
              src={absoluteAssetUrl(rp.image_url) || GALLERY_IMAGE_PLACEHOLDER}
              alt={rp.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div>
            <span className="pd-sidebar-title">{rp.title}</span>
            {(rp.specifications?.lokasyon || rp.specifications?.location) && (
              <span style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                {rp.specifications.lokasyon || rp.specifications.location}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
