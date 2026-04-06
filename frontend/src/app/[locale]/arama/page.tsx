'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Search,
  Package,
  Newspaper,
  Briefcase,
  BookOpen,
  ArrowRight,
  FolderOpen,
  Scale,
  Building2,
} from 'lucide-react';
import { localizedPath } from '@/seo';
import {
  fetchSiteSearch,
  siteSearchQueryValid,
  type SiteSearchHit,
  type SiteSearchHitType,
} from '@/lib/site-search';

export default function SearchPage() {
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'tr';
  const searchParams = useSearchParams();
  const query = (searchParams.get('q') || '').trim();
  const t = useTranslations('searchPage');
  const tNav = useTranslations('nav');

  const [results, setResults] = useState<SiteSearchHit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const queryOk = useMemo(() => siteSearchQueryValid(query), [query]);

  useEffect(() => {
    if (!queryOk) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const hits = await fetchSiteSearch(locale, query);
        if (!cancelled) setResults(hits);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locale, query, queryOk]);

  const homeHref = localizedPath(locale, '/');

  return (
    <div
      className="section-py min-h-[60vh]"
      style={{ background: 'var(--color-bg-alt)' }}
    >
      <div className="container-tight">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-(--color-text-primary) sm:text-4xl lg:text-5xl">
            {queryOk ? t('titleResults', { query }) : t('titlePrompt')}
          </h1>
          <p className="mt-3 max-w-2xl text-(--color-text-secondary)">{t('lead')}</p>
          {!queryOk && query.length > 0 ? (
            <p className="mt-2 text-sm text-(--color-text-muted)">{t('queryTooShort')}</p>
          ) : null}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-20">
            <div
              className="h-12 w-12 animate-spin rounded-full border-4 border-transparent"
              style={{
                borderTopColor: 'var(--color-brand)',
                borderRightColor: 'var(--color-border)',
                borderBottomColor: 'var(--color-border)',
                borderLeftColor: 'var(--color-border)',
              }}
            />
            <p className="font-medium text-(--color-text-muted)">{t('loading')}</p>
          </div>
        ) : queryOk && results.length > 0 ? (
          <div className="grid gap-4">
            {results.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.url}
                className="group flex flex-col justify-between gap-4 rounded-xl border p-5 transition-all sm:flex-row sm:items-center"
                style={{
                  borderColor: 'var(--color-border)',
                  background: 'var(--color-bg)',
                }}
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors"
                    style={{
                      background: 'var(--color-bg-alt)',
                      color: 'var(--color-brand)',
                    }}
                  >
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-(--color-text-primary) group-hover:text-(--color-brand)">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
                      {typeLabel(t, item.type)}
                    </p>
                    {item.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-(--color-text-secondary)">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
                <ArrowRight
                  size={22}
                  className="shrink-0 text-(--color-text-muted) transition-transform group-hover:translate-x-1 group-hover:text-(--color-brand)"
                />
              </Link>
            ))}
          </div>
        ) : queryOk ? (
          <div
            className="rounded-3xl border p-12 text-center shadow-sm sm:p-16"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
          >
            <div
              className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full"
              style={{ background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)' }}
            >
              <Search size={40} />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-(--color-text-primary)">
              {t('noResultsTitle')}
            </h2>
            <p className="mx-auto mb-8 max-w-md text-(--color-text-secondary)">
              {t('noResultsBody', { query })}
            </p>
            <Link
              href={homeHref}
              className="inline-flex items-center justify-center rounded-lg bg-(--color-brand) px-8 py-3 text-sm font-semibold text-(--color-on-brand)"
            >
              {t('backHome')}
            </Link>
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-(--color-text-muted)">{t('hintToolbar')}</p>
            <p className="mt-2 text-sm text-(--color-text-muted)">
              {tNav('searchPlaceholder')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getTypeIcon(type: SiteSearchHitType) {
  switch (type) {
    case 'product':
      return <Package size={24} />;
    case 'service':
      return <Briefcase size={24} />;
    case 'news':
      return <Newspaper size={24} />;
    case 'blog':
      return <BookOpen size={24} />;
    case 'catalog':
      return <FolderOpen size={24} />;
    case 'legal':
      return <Scale size={24} />;
    case 'corporate':
      return <Building2 size={24} />;
    default:
      return <Search size={24} />;
  }
}

function typeLabel(t: (key: string) => string, type: SiteSearchHitType): string {
  switch (type) {
    case 'product':
      return t('typeProduct');
    case 'service':
      return t('typeService');
    case 'news':
      return t('typeNews');
    case 'blog':
      return t('typeBlog');
    case 'catalog':
      return t('typeCatalog');
    case 'legal':
      return t('typeLegal');
    case 'corporate':
      return t('typeCorporate');
    default:
      return type;
  }
}
