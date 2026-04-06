'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, X, MapPin, SlidersHorizontal } from 'lucide-react';
import { fetchPublicDealers } from '@/lib/public-dealers-api';
import BayiMap from '@/modules/dealer-network/bayi-map';
import type { PublicDealer } from '@/modules/dealer-network/types';
import { DealerCard, DealerCardSkeleton } from '@/modules/dealer-network/dealer-components';

export default function DealersNetworkClient() {
  const t = useTranslations('bayiNetwork');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [dealers, setDealers] = React.useState<PublicDealer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const q = searchParams.get('q') ?? '';
  const city = searchParams.get('city') ?? '';
  const region = searchParams.get('region') ?? '';

  const [form, setForm] = React.useState({ q, city, region });

  React.useEffect(() => {
    setForm({ q, city, region });
  }, [q, city, region]);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPublicDealers({
      page: 1,
      limit: 50,
      q: q.trim() || undefined,
      city: city.trim() || undefined,
      region: region.trim() || undefined,
    })
      .then((res) => {
        if (!cancelled) setDealers(res.data ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setError(t('fetchError'));
          setDealers([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [q, city, region, t]);

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (form.q.trim()) p.set('q', form.q.trim());
    if (form.city.trim()) p.set('city', form.city.trim());
    if (form.region.trim()) p.set('region', form.region.trim());
    const qs = p.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const clearFilters = () => {
    setForm({ q: '', city: '', region: '' });
    router.push(pathname);
  };

  const hasFilters = Boolean(q || city || region);

  return (
    <div className="flex min-h-screen flex-col bg-(--color-bg)">
      <section className="border-b border-(--color-border) bg-(--color-bg-secondary)">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <p
            className="mb-4 text-[11px] font-black uppercase tracking-[0.3em] text-(--color-brand)"
            style={{ letterSpacing: '0.28em' }}
          >
            {t('metaTitle')}
          </p>
          <h1
            className="text-4xl font-black leading-none tracking-tighter text-(--color-text-primary) md:text-6xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('title')}
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-(--color-text-muted)">{t('description')}</p>
        </div>
      </section>

      <section className="relative h-[600px] w-full border-b border-(--color-border) bg-(--color-bg-muted) md:h-[700px]">
        <div className="absolute inset-0 z-0">
          <BayiMap
            dealers={dealers}
            emptyLabel={t('mapEmpty')}
            mapHint={t('mapHint')}
            mapLoadingLabel={t('mapLoading')}
            mapSummaryText={t('mapSummaryTemplate', { n: dealers.length })}
            height="100%"
            rounded={false}
          />
        </div>

        <div className="absolute left-1/2 top-8 z-10 w-full max-w-4xl -translate-x-1/2 px-4">
          <div
            className="flex flex-col items-center gap-2 rounded-[2.5rem] border border-(--color-border) p-2 shadow-2xl backdrop-blur-2xl md:flex-row"
            style={{
              background: 'color-mix(in srgb, var(--color-bg-secondary) 88%, transparent)',
            }}
          >
            <div className="group relative w-full flex-1">
              <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-(--color-brand) transition-transform group-focus-within:scale-110" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={form.q}
                onChange={(e) => setForm((f) => ({ ...f, q: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters(e as unknown as React.FormEvent)}
                className="w-full bg-transparent py-5 pl-14 pr-6 text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
              />
            </div>

            <div className="hidden h-10 w-px bg-(--color-border) md:block" />

            <div className="group relative w-full flex-none md:w-56">
              <MapPin className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-(--color-text-muted) transition-colors group-focus-within:text-(--color-brand)" />
              <input
                type="text"
                placeholder={t('cityPlaceholder')}
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters(e as unknown as React.FormEvent)}
                className="w-full bg-transparent py-5 pl-14 pr-6 text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
              />
            </div>

            <div className="group relative w-full flex-none md:w-56">
              <MapPin className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-(--color-text-muted) transition-colors group-focus-within:text-(--color-brand)" />
              <input
                type="text"
                placeholder={t('regionPlaceholder')}
                value={form.region}
                onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters(e as unknown as React.FormEvent)}
                className="w-full bg-transparent py-5 pl-14 pr-6 text-sm font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
              />
            </div>

            <button
              type="button"
              onClick={applyFilters}
              className="flex w-full items-center justify-center gap-2 rounded-[2rem] px-8 py-4 text-sm font-black uppercase tracking-widest text-(--color-on-brand) shadow-xl transition-all hover:opacity-95 active:scale-[0.98]"
              style={{ background: 'var(--color-brand)' }}
            >
              {t('searchButton')}
            </button>

            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="shrink-0 p-4 text-(--color-text-muted) transition-colors hover:text-red-600"
                aria-label={t('clearFilters')}
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </div>

          {!loading && dealers.length > 0 ? (
            <div className="mt-4 flex justify-center">
              <div
                className="flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-(--color-on-brand) shadow-lg"
                style={{ background: 'color-mix(in srgb, var(--color-brand) 92%, transparent)' }}
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-(--section-bg-white)" />
                {dealers.length} {t('resultCount')}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="mb-12 flex items-center justify-between gap-6">
          <div>
            <h2
              className="text-3xl font-black tracking-tight text-(--color-text-primary)"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('listTitle')}
            </h2>
            <p className="mt-2 text-(--color-text-muted)">{t('listSection')}</p>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <div className="hidden h-px w-24 bg-(--color-border) md:block" />
            <SlidersHorizontal className="h-5 w-5 text-(--color-text-muted)/40" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <DealerCardSkeleton key={i} />
            ))}
          </div>
        ) : dealers.length === 0 ? (
          <div className="rounded-[3rem] border border-dashed border-(--color-border) bg-(--color-bg-muted)/40 py-24 text-center">
            <Search className="mx-auto mb-6 h-12 w-12 text-(--color-text-muted)/20" />
            <p className="text-lg font-medium text-(--color-text-muted)">{t('listEmpty')}</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 text-xs font-black uppercase tracking-widest text-(--color-brand) hover:underline"
            >
              {t('clear')}
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dealers.map((d) => (
              <DealerCard key={d.id} dealer={d} t={t} />
            ))}
          </ul>
        )}
      </section>

      {error ? (
        <div
          className="fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-2xl p-4 text-(--section-bg-white) shadow-2xl"
          style={{ background: 'var(--status-danger)' }}
        >
          <X className="h-5 w-5 shrink-0" />
          <span className="font-bold">{error}</span>
        </div>
      ) : null}
    </div>
  );
}
