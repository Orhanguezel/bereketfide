'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { absoluteAssetUrl } from '@/lib/utils';
import type { DealerExtraSeedling } from '@/modules/bayi/types';
import { createDealerExtraRequest, fetchDealerExtras } from '@/modules/bayi/services';

type ExtraLine = {
  extra: DealerExtraSeedling;
  requestedQuantity: number;
};

function formatNumber(n: number, locale: string) {
  return n.toLocaleString(locale === 'en' ? 'en-US' : 'tr-TR');
}

function formatDate(value: string | null, locale: string) {
  if (!value) return null;
  return new Date(`${value}T00:00:00`).toLocaleDateString(locale === 'en' ? 'en-GB' : 'tr-TR');
}

function extraThumb(extra: DealerExtraSeedling): string | null {
  return absoluteAssetUrl(extra.image_url);
}

export default function EkstralarPageClient({ locale }: { locale: string }) {
  const t = useTranslations('auth.panel.extras');
  const [items, setItems] = useState<DealerExtraSeedling[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [trayType, setTrayType] = useState('');
  const [cart, setCart] = useState<Record<string, ExtraLine>>({});
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setBanner(null);
    try {
      const res = await fetchDealerExtras();
      setItems(res.items);
    } catch {
      setBanner({ kind: 'err', text: t('errors.load') });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))).sort((a, b) => a.localeCompare(b, 'tr')),
    [items],
  );
  const trayTypes = useMemo(
    () => Array.from(new Set(items.map((item) => item.tray_type))).sort((a, b) => a - b),
    [items],
  );
  const cartLines = useMemo(() => Object.values(cart), [cart]);
  const filteredItems = useMemo(
    () => items.filter((item) => {
      if (category && item.category !== category) return false;
      if (trayType && item.tray_type !== Number(trayType)) return false;
      return true;
    }),
    [category, items, trayType],
  );
  const cartTotal = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.requestedQuantity, 0),
    [cartLines],
  );

  function addExtra(extra: DealerExtraSeedling) {
    setCart((prev) => ({
      ...prev,
      [extra.id]: {
        extra,
        requestedQuantity: prev[extra.id]?.requestedQuantity ?? Math.min(extra.quantity || 1, 1000),
      },
    }));
    setBanner(null);
  }

  function setLineQty(id: string, quantity: number) {
    setCart((prev) => {
      const cur = prev[id];
      if (!cur) return prev;
      const max = Math.max(1, cur.extra.quantity);
      const qty = Math.min(max, Math.max(1, Math.floor(quantity)));
      return { ...prev, [id]: { ...cur, requestedQuantity: qty } };
    });
  }

  function removeLine(id: string) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  async function submitRequests() {
    if (cartLines.length === 0) return;
    setBusy(true);
    setBanner(null);
    try {
      for (const line of cartLines) {
        await createDealerExtraRequest({
          extra_seedling_id: line.extra.id,
          requested_quantity: line.requestedQuantity,
          note: note.trim() || null,
        });
      }
      setCart({});
      setNote('');
      setBanner({ kind: 'ok', text: t('created') });
    } catch (e) {
      setBanner({ kind: 'err', text: t('errors.generic', { code: e instanceof Error ? e.message : 'error' }) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-(--color-text-primary)">{t('title')}</h1>
        <p className="mt-1 text-sm text-(--color-text-secondary)">{t('lead')}</p>
      </div>

      {banner ? (
        <div className={`rounded-xl px-4 py-3 text-sm ${banner.kind === 'ok' ? 'bf-alert-success' : 'bf-alert-danger'}`}>
          {banner.text}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border px-4 py-2 text-sm"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
            >
              <option value="">{t('allCategories')}</option>
              {categories.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <select
              value={trayType}
              onChange={(e) => setTrayType(e.target.value)}
              className="rounded-xl border px-4 py-2 text-sm"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
            >
              <option value="">{t('allTrayTypes')}</option>
              {trayTypes.map((tray) => (
                <option key={tray} value={tray}>{t('trayType', { tray })}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-sm text-(--color-text-muted)">{t('loading')}</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-sm text-(--color-text-secondary)">{t('empty')}</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((extra) => {
                const img = extraThumb(extra);
                const dateLabel = extra.availability_label || formatDate(extra.available_on, locale);
                return (
                  <article
                    key={extra.id}
                    className="flex flex-col overflow-hidden rounded-2xl border"
                    style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
                  >
                    <div className="relative aspect-4/3 bg-(--color-bg-alt)">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element -- API asset URLs
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-(--color-text-muted)">
                          {extra.category}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="text-xs font-semibold uppercase text-(--color-brand)">
                        {extra.category}
                      </div>
                      <h2 className="mt-1 line-clamp-2 text-sm font-semibold text-(--color-text-primary)">
                        {extra.product_name}
                      </h2>
                      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-(--color-text-secondary)">
                        <div>
                          <dt className="text-(--color-text-muted)">{t('tray')}</dt>
                          <dd className="font-medium text-(--color-text-primary)">{extra.tray_type}</dd>
                        </div>
                        <div>
                          <dt className="text-(--color-text-muted)">{t('stock')}</dt>
                          <dd className="font-medium text-(--color-text-primary)">
                            {formatNumber(extra.quantity, locale)}
                          </dd>
                        </div>
                      </dl>
                      {dateLabel ? (
                        <p className="mt-3 text-xs text-(--color-text-muted)">{dateLabel}</p>
                      ) : null}
                      {extra.note ? (
                        <p className="mt-2 line-clamp-2 text-xs text-(--color-text-secondary)">{extra.note}</p>
                      ) : null}
                      <button
                        type="button"
                        className="mt-auto w-full rounded-xl py-2 text-sm font-semibold text-(--color-on-brand)"
                        style={{ background: 'var(--color-brand)' }}
                        onClick={() => addExtra(extra)}
                      >
                        {t('add')}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside
          className="space-y-4 rounded-2xl border p-5 lg:sticky lg:top-6 lg:self-start"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
        >
          <h2 className="text-lg font-semibold text-(--color-text-primary)">{t('requestBox')}</h2>
          {cartLines.length === 0 ? (
            <p className="text-sm text-(--color-text-secondary)">{t('emptyRequest')}</p>
          ) : (
            <ul className="space-y-4">
              {cartLines.map((line) => (
                <li key={line.extra.id} className="border-b pb-4 last:border-0" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="text-sm font-medium text-(--color-text-primary)">{line.extra.product_name}</div>
                  <div className="mt-1 text-xs text-(--color-text-muted)">
                    {t('trayType', { tray: line.extra.tray_type })} · {formatNumber(line.extra.quantity, locale)}
                  </div>
                  <label className="mt-2 block text-xs text-(--color-text-muted)">
                    {t('requestedQuantity')}
                    <input
                      type="number"
                      min={1}
                      max={line.extra.quantity}
                      step={1}
                      value={line.requestedQuantity}
                      onChange={(e) => setLineQty(line.extra.id, Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                      style={{ borderColor: 'var(--color-border)' }}
                    />
                  </label>
                  <button
                    type="button"
                    className="mt-2 bf-link-danger text-xs"
                    onClick={() => removeLine(line.extra.id)}
                  >
                    {t('remove')}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <label className="block text-xs font-medium text-(--color-text-muted)">
            {t('note')}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </label>

          <div className="flex items-center justify-between border-t pt-4 text-sm font-semibold" style={{ borderColor: 'var(--color-border)' }}>
            <span>{t('totalRequested')}</span>
            <span className="text-(--color-brand)">{formatNumber(cartTotal, locale)}</span>
          </div>

          <button
            type="button"
            disabled={busy || cartLines.length === 0}
            className="w-full rounded-xl py-3 text-sm font-semibold text-(--color-on-brand) disabled:opacity-50"
            style={{ background: 'var(--color-brand)' }}
            onClick={() => void submitRequests()}
          >
            {busy ? t('submitting') : t('submit')}
          </button>
        </aside>
      </div>
    </div>
  );
}
