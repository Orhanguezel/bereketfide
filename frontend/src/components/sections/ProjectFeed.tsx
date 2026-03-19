'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark } from 'lucide-react';
import { absoluteAssetUrl } from '@/lib/utils';
import { SaveProjectButton } from '@/components/projects/SaveProjectButton';
import { useTranslations } from 'next-intl';

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image_url?: string;
  count?: number;
  images?: string[];
  category?: { name: string; slug: string };
  specifications?: Record<string, string>;
  tags?: string[];
  created_at?: string;
}

interface ProjectFeedProps {
  initialProjects: ProjectItem[];
  locale: string;
  apiUrl: string;
  backendUrl: string;
  title?: string;
  subtitle?: string;
  sidebarProjects?: ProjectItem[];
  sidebarTitle?: string;
  readMoreLabel?: string;
}

function localePath(locale: string, path: string): string {
  return `/${locale}${path}`;
}

function timeAgo(dateStr: string, t: any): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return t('common.relativeTime.justNow');
  if (hours < 24) return t('common.relativeTime.hoursAgo', { hours });
  return t('common.relativeTime.daysAgo', { days });
}

export function ProjectFeed({
  initialProjects,
  locale,
  apiUrl,
  backendUrl,
  title,
  subtitle,
  sidebarProjects,
  sidebarTitle,
  readMoreLabel,
}: ProjectFeedProps) {
  const t = useTranslations();
  const finalReadMore = readMoreLabel || t('common.readMore');
  const finalSidebarTitle = sidebarTitle || t('projects.loveTitle');
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 10;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/products?item_type=bereketfide&is_active=1&locale=${locale}&limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`
      );
      if (!res.ok) { setHasMore(false); return; }
      const data = await res.json();
      const items: ProjectItem[] = Array.isArray(data) ? data : data?.items ?? [];
      if (items.length < PAGE_SIZE) setHasMore(false);
      if (items.length > 0) {
        setProjects((prev) => [...prev, ...items]);
        setPage((p) => p + 1);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, apiUrl, locale]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) loadMore(); },
      { rootMargin: '400px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6">
      {title && (
        <div className="mb-8">
          <h2
            className="text-2xl font-bold text-(--color-text-primary) lg:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-(--color-text-secondary)">{subtitle}</p>
          )}
        </div>
      )}
      <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">
        {/* Main feed */}
        <div className="space-y-10">
          {projects.map((project) => {
            const mainImage = absoluteAssetUrl(project.image_url) || absoluteAssetUrl(project.images?.[0]);
            const thumbs = (project.images || []).slice(0, 5).map((img) => absoluteAssetUrl(img)).filter(Boolean) as string[];
            const extraCount = (project.images?.length || 0) - 5;
            const specs = project.specifications || {};
            const categoryName = project.category?.name || specs.tip || '';
            const location = specs.lokasyon || specs.location || '';
            const architects = specs.mimarlar || specs.architects || '';
            const area = specs.alan || specs.area || '';
            const year = specs.yıl || specs.year || '';
            const manufacturers = specs.üreticiler || specs.manufacturers || '';
            const projectHref = localePath(locale, `/urunler/${project.slug}`);

            return (
              <article key={project.id} className="border-b border-(--color-border) pb-10">
                {/* Title + time */}
                <Link href={projectHref}>
                  <h2
                    className="text-xl font-bold text-(--color-text-primary) hover:text-(--color-brand-text) lg:text-2xl"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {project.title}
                    {architects ? ` / ${architects}` : ''}
                  </h2>
                </Link>
                {project.created_at && (
                  <p className="mt-1 text-xs text-(--color-text-muted)">
                    {timeAgo(project.created_at, t)}
                  </p>
                )}

                {/* Main image */}
                {mainImage && (
                  <Link href={projectHref} className="group relative mt-4 block aspect-16/10 overflow-hidden bg-(--color-bg-muted)">
                    <Image
                      src={mainImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 660px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </Link>
                )}

                {/* Category tags + location */}
                <div className="mt-3 flex flex-wrap items-center gap-x-1.5 text-xs font-semibold uppercase tracking-wide">
                  {categoryName && (
                    <span className="text-(--color-brand-text)">{categoryName}</span>
                  )}
                  {categoryName && location && (
                    <span className="text-(--color-text-muted)">·</span>
                  )}
                  {location && (
                    <span className="text-(--color-text-secondary)">{location}</span>
                  )}
                </div>

                {/* Specs row */}
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-(--color-text-secondary)">
                  {architects && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-(--color-text-muted)">{t('projects.filters.architects')}:</span>
                      <span className="font-medium text-(--color-brand-text)">{architects}</span>
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
                      <span className="font-medium text-(--color-brand-text)">{year}</span>
                    </div>
                  )}
                  {manufacturers && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-(--color-text-muted)">{t('projects.manufacturers')}:</span>
                      <span className="font-medium">{manufacturers}</span>
                    </div>
                  )}
                </div>

                {/* Actions: Save + Read more */}
                <div className="mt-3 flex items-center justify-between">
                  <SaveProjectButton 
                    projectId={project.id} 
                    label={t('projects.saveProject')} 
                  />
                  <Link
                    href={projectHref}
                    className="text-xs font-medium text-(--color-brand-text) hover:underline"
                  >
                    {finalReadMore} »
                  </Link>
                </div>
              </article>
            );
          })}

          {/* Sentinel for infinite scroll */}
          <div ref={sentinelRef} className="h-px" />
          {loading && (
            <div className="flex justify-center py-8">
              <div className="size-6 animate-spin rounded-full border-2 border-(--color-brand) border-t-transparent" />
            </div>
          )}
        </div>

        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-8">
            {/* Featured projects sidebar */}
            {sidebarProjects && sidebarProjects.length > 0 && (
              <div className="border-b border-(--color-border) pb-6">
                <h3
                  className="mb-4 text-lg font-bold text-(--color-text-primary)"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {finalSidebarTitle}
                </h3>
                <div className="space-y-5">
                  {sidebarProjects.map((p) => {
                    const img = absoluteAssetUrl(p.image_url) || absoluteAssetUrl(p.images?.[0]);
                    return (
                      <Link
                        key={p.id}
                        href={localePath(locale, `/urunler/${p.slug}`)}
                        className="group flex gap-3"
                      >
                        {img && (
                          <div className="relative aspect-4/3 w-24 shrink-0 overflow-hidden bg-(--color-bg-muted)">
                            <Image
                              src={img}
                              alt={p.title}
                              fill
                              sizes="96px"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <h4 className="text-sm font-semibold leading-snug text-(--color-text-primary) group-hover:text-(--color-brand-text)">
                          {p.title}
                          {p.specifications?.mimarlar ? ` / ${p.specifications.mimarlar}` : ''}
                        </h4>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA in sidebar */}
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
                href={localePath(locale, '/teklif')}
                className="mt-3 inline-block bg-(--color-brand) px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                {t('nav.offer')}
              </Link>
            </div>

            <div className="bg-(--color-bg-muted) p-5">
              <p
                className="text-sm font-bold text-(--color-text-primary)"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t('catalog.sidebarCtaTitle')}
              </p>
              <p className="mt-1 text-xs text-(--color-text-secondary)">
                {t('catalog.sidebarCtaDesc')}
              </p>
              <Link
                href={localePath(locale, '/kataloglar')}
                className="mt-3 inline-block bg-(--color-brand) px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                {t('catalog.viewCatalog')}
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
