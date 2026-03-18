import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Play, Bookmark } from 'lucide-react';

import { absoluteAssetUrl, API_BASE_URL } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, organizationJsonLd, siteUrlBase, readSettingValue, asStr } from '@/seo';
import { NewsletterForm } from '@/components/sections/NewsletterForm';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { Reveal } from '@/components/motion/Reveal';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

import { buildMediaAlt } from '@/lib/media-seo';
import { ProjectFeed } from '@/components/sections/ProjectFeed';
import { fetchSetting } from '@/i18n/server';
import { SaveProjectButton } from '@/components/projects/SaveProjectButton';
function resolveImageUrl(value?: string | null): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/media/')) return value;
  return absoluteAssetUrl(value);
}

const BLOG_PLACEHOLDER_SRC = '/media/blog-placeholder.svg';

async function fetchFeaturedProducts(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products?item_type=bereketfide&is_active=1&is_featured=1&locale=${locale}&limit=8`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}


async function fetchAllProjects(locale: string) {
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
      `${API_BASE_URL}/custom_pages?module_key=news&is_published=1&featured=1&locale=${locale}&limit=3`,
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
  const seo = await fetchSeoPage(locale, 'home');
  const t = await getTranslations({ locale });

  return buildPageMetadata({
    locale,
    pathname: '/',
    title: seo?.title || (locale.startsWith('en')
      ? 'Bereket Fide | Quality Seedling Production'
      : 'Bereket Fide | Kaliteli Fide Üretimi'),
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

  const [products, blogPosts, allProjects, heroVideoSetting, heroConfigSetting] = await Promise.all([
    fetchFeaturedProducts(locale),
    fetchFeaturedBlogPosts(locale),
    fetchAllProjects(locale),
    fetchSetting('hero_video', locale),
    fetchSetting('hero_config', locale),
  ]);

  const heroVideo = readSettingValue(heroVideoSetting);
  const heroConfig = readSettingValue(heroConfigSetting);
  const heroVideoUrl = asStr(heroVideo.url) || '/uploads/video/2d7f.mp4';
  const heroPoster = asStr(heroVideo.poster) || '';
  const heroTitle = asStr(heroConfig.title) || t('home.hero.title');
  const heroSubtitle = asStr(heroConfig.subtitle) || t('home.hero.subtitle');
  const heroCtaText = asStr(heroConfig.cta_text) || t('home.hero.cta');
  const heroCtaUrl = asStr(heroConfig.cta_url) || '/urunler';
  const heroCta2Text = asStr(heroConfig.cta2_text) || '';
  const heroCta2Url = asStr(heroConfig.cta2_url) || '/teklif';

  const siteUrl = siteUrlBase();
  const visibleProducts = products.slice(0, 8);
  const visibleBlogPosts = blogPosts.slice(0, 3);
  const featuredBlogPost = visibleBlogPosts[0];

  return (
    <main className="min-h-screen">
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
          HERO — Full-width video (Humintech ref)
          Video DB'den: hero_video.url
          İçerik DB'den: hero_config (title, subtitle, cta)
      ═══════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden" style={{ height: 'clamp(400px, 70vh, 700px)' }}>
        {/* Video arka plan */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster={heroPoster || undefined}
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>

        {/* Koyu yeşil overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(26,58,14,0.65) 0%, rgba(26,58,14,0.8) 100%)' }}
        />

        {/* İçerik */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1
            className="text-3xl font-bold sm:text-4xl lg:text-5xl xl:text-6xl max-w-4xl"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-brand-light)',
              lineHeight: 1.15,
            }}
          >
            {heroTitle}
          </h1>

          {heroSubtitle && (
            <p
              className="mt-4 text-base sm:text-lg lg:text-xl max-w-2xl"
              style={{ color: 'var(--color-text-on-dark)', opacity: 0.9 }}
            >
              {heroSubtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {heroCtaText && (
              <Link
                href={localizedPath(locale, heroCtaUrl)}
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold uppercase tracking-wider transition-all"
                style={{
                  background: 'var(--color-brand)',
                  color: 'var(--color-on-brand)',
                  borderRadius: 'var(--radius-sm)',
                  letterSpacing: '0.08em',
                }}
              >
                {heroCtaText}
                <ArrowRight className="size-4" />
              </Link>
            )}

            {heroCta2Text && (
              <Link
                href={localizedPath(locale, heroCta2Url)}
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold uppercase tracking-wider transition-all border"
                style={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  letterSpacing: '0.08em',
                }}
              >
                {heroCta2Text}
              </Link>
            )}
          </div>
        </div>

        {/* Alt altın çizgi */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: 4, background: 'var(--color-brand)' }} />
      </section>


      {/* Featured Projects — ArchDaily expanded cards */}
      <section className="section-py">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="motion-fade-up mb-8">
            <SectionHeader
              title={t('home.projects.title')}
              description={t('home.projects.subtitle')}
            />
          </div>
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">
            {/* Main feed */}
            <div className="space-y-10">
              {visibleProducts.slice(0, 4).map((project: any) => {
                const mainImage = absoluteAssetUrl(project.image_url);
                const thumbs = (project.images || []).slice(0, 5).map((img: string) => absoluteAssetUrl(img)).filter(Boolean) as string[];
                const extraCount = (project.images?.length || 0) - 5;
                const specs = project.specifications || {};
                const categoryName = project.category?.name || specs.tip || '';
                const location = specs.lokasyon || specs.location || '';
                const architects = specs.mimarlar || specs.architects || '';
                const area = specs.alan || specs.area || '';
                const year = specs.yıl || specs.year || '';
                const manufacturers = specs.üreticiler || specs.manufacturers || '';
                const projectHref = project.slug ? localizedPath(locale, `/projeler/${project.slug}`) : localizedPath(locale, '/projeler');

                return (
                  <article key={project.id ?? project.title} className="border-b border-(--color-border) pb-10">
                    <Link href={projectHref}>
                      <h2
                        className="text-xl font-bold text-(--color-text-primary) hover:text-(--color-brand) lg:text-2xl"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {project.title}
                        {architects ? ` / ${architects}` : ''}
                      </h2>
                    </Link>

                    {mainImage && (
                      <Link href={projectHref} className="group relative mt-4 block aspect-16/10 overflow-hidden bg-(--color-bg-muted)">
                        <OptimizedImage
                          src={mainImage}
                          alt={project.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 660px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      </Link>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-x-1.5 text-xs font-semibold uppercase tracking-wide">
                      {categoryName && (
                        <span className="text-(--color-brand)">{categoryName}</span>
                      )}
                      {categoryName && location && (
                        <span className="text-(--color-text-muted)">·</span>
                      )}
                      {location && (
                        <span className="text-(--color-text-secondary)">{location}</span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-(--color-text-secondary)">
                      {architects && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-(--color-text-muted)">{t('projects.filters.architects')}:</span>
                          <span className="font-medium text-(--color-brand)">{architects}</span>
                        </div>
                      )}
                      {area && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-(--color-text-muted)">{t('projects.filters.area')}:</span>
                          <span className="font-medium">{area}</span>
                        </div>
                      )}
                      {year && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-(--color-text-muted)">{t('projects.filters.year')}:</span>
                          <span className="font-medium text-(--color-brand)">{year}</span>
                        </div>
                      )}
                      {manufacturers && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-(--color-text-muted)">{t('projects.manufacturers')}:</span>
                          <span className="font-medium">{manufacturers}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <SaveProjectButton 
                        projectId={project.id} 
                        label={t('projects.saveProject')} 
                      />
                      <Link
                        href={projectHref}
                        className="text-xs font-medium text-(--color-brand) hover:underline"
                      >
                        {t('common.readMore')} »
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Sidebar — desktop only */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <div className="border-b border-(--color-border) pb-6">
                  <h3
                    className="mb-4 text-lg font-bold text-(--color-text-primary)"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {t('projects.loveTitle')}
                  </h3>
                  <div className="space-y-5">
                    {visibleProducts.slice(0, 4).map((p: any) => {
                      const img = absoluteAssetUrl(p.image_url);
                      return (
                        <Link
                          key={p.id}
                          href={p.slug ? localizedPath(locale, `/projeler/${p.slug}`) : localizedPath(locale, '/projeler')}
                          className="group flex gap-3"
                        >
                          {img && (
                            <div className="relative aspect-4/3 w-24 shrink-0 overflow-hidden bg-(--color-bg-muted)">
                              <OptimizedImage
                                src={img}
                                alt={p.title}
                                fill
                                sizes="96px"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <h4 className="text-sm font-semibold leading-snug text-(--color-text-primary) group-hover:text-(--color-brand)">
                            {p.title}
                            {p.specifications?.mimarlar ? ` / ${p.specifications.mimarlar}` : ''}
                          </h4>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-(--color-bg-muted) p-5">
                  <p
                    className="text-sm font-bold text-(--color-text-primary)"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {t('projects.getQuoteTitle')}
                  </p>
                  <p className="mt-1 text-xs text-(--color-text-secondary)">
                    {t('projects.getQuoteDesc')}
                  </p>
                  <Link
                    href={localizedPath(locale, '/teklif')}
                    className="mt-3 inline-block bg-(--color-brand) px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {t('nav.offer')}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>


      {/* All Projects — ArchDaily-style infinite feed */}
      <section className="section-py border-t border-(--color-border)">
        <ProjectFeed
          initialProjects={allProjects}
          locale={locale}
          apiUrl={API_BASE_URL}
          backendUrl={API_BASE_URL.replace(/\/api\/?$/, '')}
          title={t('home.latestProjects.title')}
          subtitle={t('home.latestProjects.subtitle')}
          sidebarProjects={visibleProducts.slice(0, 4)}
          sidebarTitle={t('projects.loveTitle')}
          readMoreLabel={t('common.readMore')}
        />
      </section>

      {/* CTA */}
      <section className="bg-(--color-bg-dark)">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className="text-3xl font-bold text-(--color-text-on-dark) lg:text-4xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('common.offerCtaTitle')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-(--color-text-on-dark)/70">
              {t('common.offerCtaDescription')}
            </p>
            <Link
              href={localizedPath(locale, '/teklif')}
              className="mt-8 inline-flex items-center gap-2 bg-(--color-brand) px-8 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('common.requestOffer')}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-py bg-(--color-bg-muted)">
        <div className="mx-auto max-w-xl px-4 text-center">
          <div className="motion-fade-up">
            <h2 className="text-2xl font-bold">{t('home.newsletter.title')}</h2>
            <p className="mt-2 text-(--color-text-secondary)">
              {t('home.newsletter.subtitle')}
            </p>
          </div>
          <div className="motion-fade-up motion-delay-2">
            <NewsletterForm locale={locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
