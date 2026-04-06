'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { fetchPublicDealers, type PublicDealerRow } from '@/lib/public-dealers-api';

function mapsUrl(lat: string, lon: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lon}`)}`;
}

export default function BayiAgiClient() {
  const t = useTranslations('bayiNetwork');
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [rows, setRows] = useState<PublicDealerRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(q.trim()), 350);
    return () => window.clearTimeout(id);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetchPublicDealers({ q: debounced || undefined, limit: 40 });
        if (cancelled) return;
        setRows(res.data);
        setTotal(res.total);
      } catch {
        if (!cancelled) setErr(t('loadError'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debounced, t]);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-(--color-text-primary)">{t('title')}</h1>
        <p className="text-sm text-(--color-text-secondary)">{t('lead')}</p>
      </header>

      <div>
        <label className="sr-only" htmlFor="bayi-search">
          {t('search')}
        </label>
        <input
          id="bayi-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-2xl border px-4 py-3 text-sm"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
        />
      </div>

      {err ? (
        <p className="bf-alert-danger rounded-xl px-4 py-3 text-sm">{err}</p>
      ) : null}

      {loading ? (
        <p className="text-center text-sm text-(--color-text-muted)">{t('loading')}</p>
      ) : rows.length === 0 ? (
        <p className="text-center text-sm text-(--color-text-secondary)">{t('empty')}</p>
      ) : (
        <>
          <p className="text-center text-xs text-(--color-text-muted)">
            {t('count', { n: total })}
          </p>
          <ul className="space-y-4">
            {rows.map((d) => (
              <li
                key={d.id}
                className="rounded-2xl border p-5"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
              >
                <h2 className="text-lg font-semibold text-(--color-text-primary)">
                  {d.company_name || t('unnamed')}
                </h2>
                <div className="mt-2 space-y-1 text-sm text-(--color-text-secondary)">
                  {[d.city, d.region].filter(Boolean).length > 0 ? (
                    <p>{[d.city, d.region].filter(Boolean).join(' · ')}</p>
                  ) : null}
                  {d.phone ? <p>{t('phone')}: {d.phone}</p> : null}
                </div>
                {d.latitude && d.longitude ? (
                  <a
                    href={mapsUrl(d.latitude, d.longitude)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-(--color-brand) hover:underline"
                  >
                    {t('openMap')}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
