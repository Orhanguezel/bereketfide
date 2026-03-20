import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { absoluteAssetUrl, API_BASE_URL } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, organizationJsonLd, siteUrlBase, readSettingValue, asStr } from '@/seo';
import { Reveal } from '@/components/motion/Reveal';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { BrandCarousel } from '@/components/sections/BrandCarousel';
import { StatsHighlightSection } from '@/components/sections/StatsHighlightSection';

import { ProjectFeed } from '@/components/sections/ProjectFeed';
import { fetchReferences, fetchSetting } from '@/i18n/server';
import { fetchSeoPage } from '@/seo/server';
import { ScrollBackground } from '@/components/sections/ScrollBackground';
import { HeroBackgroundVideo } from '@/components/ui/HeroBackgroundVideo';

function resolveImageUrl(value?: string | null): string {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/media/')) return value;
  return absoluteAssetUrl(value) || '';
}

function resolveBlogImage(post: any): string {
  return resolveImageUrl(
    post?.featured_image_url_resolved ||
    post?.image_url_resolved ||
    post?.cover_image_url_resolved ||
    post?.featured_image ||
    post?.image_url ||
    post?.cover_image ||
    post?.featured_image_url ||
    post?.cover_image_url ||
    post?.imageSrc,
  );
}

function normalizeBackgrounds(input: unknown): { url: string; alt: string }[] {
  let data = input;
  if (typeof input === 'string') {
    try { data = JSON.parse(input); } catch { return []; }
  }
  if (!Array.isArray(data)) return [];

  return data
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const rawUrl = typeof (item as { url?: unknown }).url === 'string' ? (item as { url: string }).url : '';
      const alt = typeof (item as { alt?: unknown }).alt === 'string' ? (item as { alt: string }).alt : '';
      if (!rawUrl) return null;

      return {
        url: rawUrl,
        alt,
      };
    })
    .filter((item): item is { url: string; alt: string } => Boolean(item));
}

function normalizeHomeStats(input: unknown): { value: number; label: string }[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const rawValue =
        typeof (item as { value?: unknown }).value === 'number'
          ? (item as { value: number }).value
          : Number((item as { value?: unknown }).value);
      const label =
        typeof (item as { label?: unknown }).label === 'string'
          ? (item as { label: string }).label.trim()
          : '';

      if (!Number.isFinite(rawValue) || !label) return null;
      return { value: rawValue, label };
    })
    .filter((item): item is { value: number; label: string } => Boolean(item));
}

async function fetchFeaturedProducts(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products?item_type=bereketfide&is_active=1&is_featured=1&locale=${locale}&limit=4`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchInitialProducts(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products?item_type=bereketfide&is_active=1&locale=${locale}&limit=10`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchFeaturedBlogPosts(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom_pages?module_key=blog&is_published=1&featured=1&locale=${locale}&limit=3`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchFeaturedNewsPosts(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom_pages?module_key=news&is_published=1&locale=${locale}&limit=2`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchFeaturedCatalogs(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/library?locale=${locale}&type=catalog&limit=3`,
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
  const seo = await fetchSeoPage(locale, 'home');
  const t = await getTranslations({ locale });

  return buildPageMetadata({
    locale,
    pathname: '/',
    title: seo?.title || 'Bereket Fide',
    description: seo?.description || t('seo.defaultDescription'),
    ogImage: seo?.og_image || undefined,
    noIndex: seo?.no_index,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const [products, blogPosts, newsPosts, catalogs, initialProducts, references, heroVideoSetting, heroConfigSetting, homeBackgroundsSetting, homeStatsSetting] = await Promise.all([
    fetchFeaturedProducts(locale),
    fetchFeaturedBlogPosts(locale),
    fetchFeaturedNewsPosts(locale),
    fetchFeaturedCatalogs(locale),
    fetchInitialProducts(locale),
    fetchReferences(locale, 12),
    fetchSetting('hero_video', locale),
    fetchSetting('hero_config', locale),
    fetchSetting('home_backgrounds', locale).then(res => res || fetchSetting('home_backgrounds', '*')),
    fetchSetting('home_stats', locale),
  ]);

  const heroVideo = readSettingValue(heroVideoSetting);
  const heroConfig = readSettingValue(heroConfigSetting);
  const configuredHomeBackgrounds = normalizeBackgrounds(homeBackgroundsSetting?.value);
  const configuredHomeStats = normalizeHomeStats(homeStatsSetting?.value);

  const homeBackgrounds = configuredHomeBackgrounds.length ? configuredHomeBackgrounds : [
    { url: '/uploads/products/23.28.37 (1).jpeg', alt: 'Bereket Fide 1' },
    { url: '/uploads/products/23.28.37 (3).jpeg', alt: 'Bereket Fide 2' },
    { url: '/uploads/products/23.28.37.jpeg', alt: 'Bereket Fide 3' }
  ];
  const homeStats = configuredHomeStats.length
    ? configuredHomeStats
    : [
        { value: 376, label: locale.startsWith('en') ? 'Happy Customers' : 'Mutlu Müşteri' },
        { value: 20, label: locale.startsWith('en') ? 'Seedling Varieties' : 'Çeşit Fidan' },
        { value: 16, label: locale.startsWith('en') ? 'Years of Experience' : 'Yıllık deneyim' },
        { value: 31, label: locale.startsWith('en') ? 'Completed Orders' : 'Tamamlanan Sipariş' },
      ];

  const heroVideoUrl = asStr(heroVideo.url) || '/uploads/video/2d7f.mp4';
  const heroPoster = asStr(heroVideo.poster) || '';
  const heroTitle = asStr(heroConfig.title) || t('home.hero.title');
  const heroSubtitle = asStr(heroConfig.subtitle) || t('home.hero.subtitle');

  const siteUrl = siteUrlBase();
  const visibleProducts = products.slice(0, 8);
  const visibleBlogPosts = blogPosts.slice(0, 3);
  const visibleNewsPosts = newsPosts.slice(0, 2);
  const visibleCatalogs = catalogs.slice(0, 3);

  return (
    <div className="relative min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: 'body { background-color: transparent !important; }' }} />
      <JsonLd
        data={jsonld.graph([
          jsonld.org({
            ...organizationJsonLd(locale, {
              description: t('seo.defaultDescription'),
            }),
            url: siteUrl,
          }),
          jsonld.website({
            name: 'Bereket Fide',
            url: siteUrl,
          }),
        ])}
      />

      {/* ═══════════════════════════════════════════
          DYNAMIC SCROLL BACKGROUND
      ═══════════════════════════════════════════ */}
      <ScrollBackground backgrounds={homeBackgrounds} />

      {/* ═══════════════════════════════════════════
          HERO — Dynamic industrial/premium redesign
      ═══════════════════════════════════════════ */}
      <section className="relative flex min-h-[900px] w-full flex-col overflow-hidden px-0 pt-24 pb-12 sm:min-h-[980px] sm:pt-28 md:min-h-[860px] md:pt-32 lg:h-screen lg:min-h-[700px] lg:items-center lg:justify-center lg:pt-0 lg:pb-0">
        {/* Background Overlay / Video */}
        <HeroBackgroundVideo src={heroVideoUrl} poster={heroPoster || undefined} />
        <div 
          className="absolute inset-0 opacity-80"
          style={{ background: 'linear-gradient(to bottom, rgba(20, 24, 18, 0.4) 0%, rgba(20, 32, 16, 0.85) 100%)' }}
        />

        {/* Hero Content — Centered Heading */}
        <div className="relative z-10 mb-10 w-full max-w-7xl px-6 text-center sm:mb-12 lg:mb-16">
          <Reveal>
            <h1
              className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-brand-light)',
                lineHeight: 1.05,
              }}
            >
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p
                className="mx-auto mt-4 max-w-3xl text-base font-medium sm:mt-5 sm:text-lg md:text-xl lg:mt-6 lg:text-2xl"
                style={{ color: 'rgba(255,255,255,0.85)' }}
              >
                {heroSubtitle}
              </p>
            )}
          </Reveal>
        </div>

        {/* Hero Category Navigation — Humintech-inspired cards */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 4).map((p: any, idx: number) => (
              <Reveal key={p.id} delay={idx * 0.1} className={idx === 3 ? 'md:hidden lg:block' : ''}>
                <Link
                  href={p.slug ? localizedPath(locale, `/urunler/${p.slug}`) : '#'}
                  title={p.title}
                  className="group relative flex h-[220px] flex-col justify-end overflow-hidden border-l-4 border-(--color-brand) p-5 shadow-2xl transition-all duration-500 hover:scale-[1.02] sm:h-[240px] md:h-[220px] lg:h-[280px] lg:p-6"
                  style={{ background: '#141814' }}
                >
                  <OptimizedImage
                    src={resolveImageUrl(p.image_url)}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />
                  <div className="relative z-10 text-left w-full">
                    <h2
                      className="mb-2 text-lg font-black uppercase tracking-wider text-white! drop-shadow-[1px_1px_4px_rgba(0,0,0,0.6)] sm:text-xl"
                      style={{ fontFamily: 'var(--font-heading)', color: '#ffffff' }}
                    >
                      {p.title}
                    </h2>
                    {p.summary && (
                      <p className="mb-2 line-clamp-2 text-sm font-medium text-white/90! opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        {p.summary}
                      </p>
                    )}
                    <div className="mt-4 flex items-center text-[10px] font-black text-(--color-brand-light) uppercase tracking-[0.2em]">
                       {t('common.readMore')} <ArrowRight className="ml-2 size-3" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Bottom indicator line */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-(--color-brand)" />
      </section>

      <StatsHighlightSection items={homeStats} />

      {/* ═══════════════════════════════════════════
          DYNAMIC CONTENT SECTIONS- Solid/Glass Backgrounds
      ═══════════════════════════════════════════ */}
      <div className="relative space-y-24 py-24">
        
        {/* Knowledge Base Feed */}
        <section className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {visibleBlogPosts.map((post: any, idx: number) => (
              <Reveal key={post.id} delay={idx * 0.1}>
                <div 
                  className="group relative flex flex-col items-center text-center bg-[#2B2B2B] border border-white/10 p-6 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                >
                  {/* Image Container */}
                  {resolveBlogImage(post) && (
                    <div className="relative w-full aspect-4/3 overflow-hidden mb-8">
                      <OptimizedImage
                        src={resolveBlogImage(post)}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 flex flex-col items-center">
                    <h3 
                      className="text-lg lg:text-xl font-extrabold text-white uppercase tracking-widest mb-4 leading-tight group-hover:text-(--color-brand-text) transition-colors"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-8 line-clamp-3 leading-relaxed">
                       {post.summary || post.content_text?.substring(0, 100)}
                    </p>
                    
                    {/* Pill Button */}
                    <Link
                      href={localizedPath(locale, `/blog/${post.slug}`)}
                      title={post.title}
                      className="mt-auto px-8 py-2 border-2 border-white/20 rounded-full text-[11px] font-black text-white uppercase tracking-[0.2em] transition-all duration-300 hover:bg-(--color-brand) hover:border-(--color-brand) hover:scale-105"
                    >
                      {t('common.readMore')}
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {visibleNewsPosts.length ? (
          <section className="bg-white border-y border-(--color-border) py-24">
            <div className="mx-auto max-w-7xl px-4 lg:px-6">
              <div className="mb-8">
                <h2
                  className="text-2xl font-bold text-(--color-text-primary) lg:text-3xl"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t('news.title')}
                </h2>
                <p className="mt-2 text-sm text-(--color-text-secondary)">
                  {t('news.description')}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {visibleNewsPosts.map((post: any) => {
                  const mainImage = resolveBlogImage(post);
                  const postHref = post.slug
                    ? localizedPath(locale, `/haberler/${post.slug}`)
                    : localizedPath(locale, '/haberler');

                  return (
                    <article
                      key={post.id}
                      className="overflow-hidden border border-(--color-border) bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      {mainImage ? (
                        <Link
                          href={postHref}
                          title={post.title}
                          className="group relative block aspect-16/10 overflow-hidden bg-(--color-bg-muted)"
                        >
                          <OptimizedImage
                            src={mainImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </Link>
                      ) : null}

                      <div className="p-6 lg:p-8">
                        {post.category_name ? (
                          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-brand-text)">
                            {post.category_name}
                          </div>
                        ) : null}

                        <Link href={postHref} title={post.title}>
                          <h3
                            className="mt-3 text-2xl font-bold text-(--color-text-primary) transition-colors hover:text-(--color-brand-text)"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            {post.title}
                          </h3>
                        </Link>

                        {post.summary ? (
                          <p className="mt-4 text-sm leading-7 text-(--color-text-secondary)">
                            {post.summary}
                          </p>
                        ) : null}

                        <div className="mt-6 flex items-center justify-between gap-4">
                          <span className="text-xs text-(--color-text-muted)">
                            {post.created_at
                              ? new Date(post.created_at).toLocaleDateString(
                                  locale === 'en' ? 'en-US' : 'tr-TR',
                                )
                              : ''}
                          </span>
                          <Link
                            href={postHref}
                            title={`${post.title} — ${t('common.readMore')}`}
                            className="text-xs font-medium text-(--color-brand-text) hover:underline"
                          >
                            {t('common.readMore')} »
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        {visibleCatalogs.length ? (
          <section className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
              {visibleCatalogs.map((catalog: any, idx: number) => (
                <Reveal key={catalog.id} delay={idx * 0.1}>
                  <div className="group relative flex h-full flex-col items-center bg-[#2B2B2B] p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                    {resolveBlogImage(catalog) ? (
                      <div className="relative mb-8 w-full overflow-hidden aspect-4/3">
                        <OptimizedImage
                          src={resolveBlogImage(catalog)}
                          alt={catalog.name || catalog.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col items-center">
                      <h3
                        className="text-lg font-extrabold uppercase leading-tight tracking-widest text-white transition-colors group-hover:text-(--color-brand-text) lg:text-xl"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {catalog.name || catalog.title}
                      </h3>
                      {(catalog.description || catalog.summary) ? (
                        <p className="mt-4 mb-8 line-clamp-3 text-sm leading-relaxed text-gray-400">
                          {catalog.description || catalog.summary}
                        </p>
                      ) : null}

                      <Link
                        href={localizedPath(locale, `/kataloglar/${catalog.slug}`)}
                        title={catalog.name || catalog.title}
                        className="mt-auto rounded-full border-2 border-white/20 px-8 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all duration-300 hover:scale-105 hover:border-(--color-brand) hover:bg-(--color-brand)"
                      >
                        {t('catalog.viewCatalog')}
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        {/* Featured Products Section */}
        <section className="bg-white/95 backdrop-blur-sm border-b border-(--color-border) py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <ProjectFeed
              initialProjects={products}
              locale={locale}
              apiUrl={API_BASE_URL}
              backendUrl={API_BASE_URL.replace(/\/api\/?$/, '')}
              title={t('home.projects.title')}
              subtitle={t('home.projects.subtitle')}
              sidebarProjects={products}
              sidebarTitle={t('projects.loveTitle')}
              readMoreLabel={t('common.readMore')}
            />
          </div>
        </section>



        {references.length ? (
          <section className="w-full">
            <div className="mx-auto max-w-7xl px-4 lg:px-6 mb-12">
              <Reveal>
                <div className="text-center">
                  <p
                    className="text-xs font-black uppercase tracking-[0.35em] drop-shadow-sm"
                    style={{ color: 'var(--color-brand-light)' }}
                  >
                    {t('home.brands.title')}
                  </p>
                  <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-white/80 sm:text-base drop-shadow-md">
                    {t('home.brands.subtitle')}
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="relative w-full border-y border-white/10 bg-[#2B2B2B]/85 backdrop-blur-xl shadow-2xl py-16">
                <div className="absolute top-0 left-0 h-1 w-32 bg-(--color-brand)" />
                <BrandCarousel brands={references as any[]} />
                <div className="absolute bottom-0 right-0 h-1 w-32 bg-(--color-brand)" />
              </div>
            </Reveal>
          </section>
        ) : null}

        {/* Latest Products - Infinite Scroll */}
        <section className="bg-white border-t border-(--color-border) py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <ProjectFeed
              initialProjects={initialProducts}
              locale={locale}
              apiUrl={API_BASE_URL}
              backendUrl={API_BASE_URL.replace(/\/api\/?$/, '')}
              title={t('home.latestProjects.title')}
              subtitle={t('home.latestProjects.subtitle')}
              sidebarProjects={products}
              sidebarTitle={t('home.projects.title')}
            />
          </div>
        </section>

        {/* CTA - Final Premium Section (Humintech Inspired) */}
        <section className="mx-auto max-w-7xl px-4 py-24">
           <Reveal>
             <div className="relative overflow-hidden bg-[#2B2B2B] border border-white/10 p-12 lg:p-24 text-center shadow-2xl">
                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                  <h2 
                    className="text-3xl lg:text-6xl font-black text-white uppercase tracking-[0.15em] mb-8 leading-tight" 
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                     {t('common.offerCtaTitle')}
                  </h2>
                  <p className="text-base lg:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                     {t('common.offerCtaDescription')}
                  </p>
                  
                  {/* Premium CTA Pill Button */}
                  <Link 
                    href={localizedPath(locale, '/teklif')}
                    className="inline-flex items-center justify-center px-12 py-4 border-2 border-white/20 rounded-full text-xs lg:text-sm font-black text-white uppercase tracking-[0.3em] transition-all duration-500 hover:bg-(--color-brand) hover:border-(--color-brand) hover:scale-105"
                  >
                    {t('common.requestOffer')}
                  </Link>
                </div>

                {/* Subtle background decoration */}
                <div className="absolute top-0 left-0 w-32 h-1 bg-(--color-brand)" />
                <div className="absolute bottom-0 right-0 w-32 h-1 bg-(--color-brand)" />
             </div>
           </Reveal>
        </section>

      </div>
    </div>
  );
}
