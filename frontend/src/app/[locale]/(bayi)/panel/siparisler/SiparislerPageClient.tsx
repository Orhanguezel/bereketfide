'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { localizedPath } from '@/seo/helpers';
import { absoluteAssetUrl } from '@/lib/utils';
import type { DealerCatalogProduct, OrderDetail, OrderRow } from '@/modules/bayi/types';
import {
  cancelOrder,
  createOrder,
  fetchDealerCatalog,
  fetchOrdersList,
  postOrderBankTransfer,
  postOrderCreditPayment,
} from '@/modules/bayi/services';

type CartLine = {
  product: DealerCatalogProduct;
  quantityGrams: number;
};

function formatTry(n: number, locale: string) {
  return n.toLocaleString(locale === 'en' ? 'en-US' : 'tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  });
}

function parseMoney(s: string) {
  return Number.parseFloat(s) || 0;
}

function productThumb(p: DealerCatalogProduct): string | null {
  const first = p.images?.[0];
  return absoluteAssetUrl(first ?? null);
}

export default function SiparislerPageClient({ locale }: { locale: string }) {
  const t = useTranslations('auth.panel.orders');
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [catalog, setCatalog] = useState<DealerCatalogProduct[]>([]);
  const [catalogTotal, setCatalogTotal] = useState(0);
  const [catalogOffset, setCatalogOffset] = useState(0);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [lastCreated, setLastCreated] = useState<OrderDetail | null>(null);
  const [payBusy, setPayBusy] = useState(false);

  const pageSize = 24;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const u = new URLSearchParams(window.location.search);
    const p = u.get('payment');
    if (p === 'success') {
      setBanner({ kind: 'ok', text: t('iyzicoPaymentSuccess') });
      window.history.replaceState(null, '', window.location.pathname);
    } else if (p === 'fail') {
      setBanner({ kind: 'err', text: t('iyzicoPaymentFail') });
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [t]);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQ(q), 320);
    return () => window.clearTimeout(id);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCatalogLoading(true);
      try {
        const res = await fetchDealerCatalog({
          locale,
          q: debouncedQ,
          limit: pageSize,
          offset: 0,
        });
        if (cancelled) return;
        setCatalog(res.data);
        setCatalogOffset(res.data.length);
        setCatalogTotal(res.total);
      } catch {
        if (!cancelled) setBanner({ kind: 'err', text: t('errors.loadCatalog') });
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedQ, locale, t]);

  async function loadMoreCatalog() {
    setCatalogLoading(true);
    try {
      const res = await fetchDealerCatalog({
        locale,
        q: debouncedQ,
        limit: pageSize,
        offset: catalogOffset,
      });
      setCatalog((prev) => [...prev, ...res.data]);
      setCatalogOffset((o) => o + res.data.length);
      setCatalogTotal(res.total);
    } catch {
      setBanner({ kind: 'err', text: t('errors.loadCatalog') });
    } finally {
      setCatalogLoading(false);
    }
  }

  const refreshOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetchOrdersList({ page: 1, limit: 30 });
      setOrders(res.data);
    } catch {
      setBanner({ kind: 'err', text: t('errors.loadOrders') });
    } finally {
      setOrdersLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  const cartLines = useMemo(() => Object.values(cart), [cart]);

  const cartTotalTry = useMemo(() => {
    let sum = 0;
    for (const line of cartLines) {
      const unit = parseMoney(line.product.unit_price);
      sum += (unit * line.quantityGrams) / 1000;
    }
    return sum;
  }, [cartLines]);

  function translateErr(code: string) {
    const known = [
      'insufficient_credit',
      'already_paid',
      'order_cancelled',
      'products_not_found',
      'only_pending_orders_can_be_cancelled',
      'order_not_found',
      'dealer_not_found',
      'payment_already_in_progress',
      'installment_not_supported',
    ] as const;
    if ((known as readonly string[]).includes(code)) {
      return t(`errors.${code}` as 'errors.insufficient_credit');
    }
    return t('errors.generic', { code });
  }

  function addToCart(p: DealerCatalogProduct) {
    setCart((prev) => ({
      ...prev,
      [p.id]: {
        product: p,
        quantityGrams: prev[p.id]?.quantityGrams ?? 1000,
      },
    }));
    setBanner(null);
  }

  function setLineQty(productId: string, grams: number) {
    const g = Math.max(1, Math.floor(grams));
    setCart((prev) => {
      const cur = prev[productId];
      if (!cur) return prev;
      return { ...prev, [productId]: { ...cur, quantityGrams: g } };
    });
  }

  function removeLine(productId: string) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }

  async function submitOrder() {
    if (cartLines.length === 0) return;
    setSubmitting(true);
    setBanner(null);
    try {
      const created = await createOrder({
        items: cartLines.map((l) => ({
          product_id: l.product.id,
          quantity: l.quantityGrams,
        })),
        notes: notes.trim() || null,
      });
      setLastCreated(created);
      setCart({});
      setNotes('');
      setBanner({ kind: 'ok', text: t('created') });
      await refreshOrders();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'error';
      setBanner({ kind: 'err', text: translateErr(msg) });
    } finally {
      setSubmitting(false);
    }
  }

  async function onPayBank(orderId: string) {
    setPayBusy(true);
    setBanner(null);
    try {
      await postOrderBankTransfer(orderId);
      setBanner({ kind: 'ok', text: t('bankMarked') });
      setLastCreated(null);
      await refreshOrders();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'error';
      setBanner({ kind: 'err', text: translateErr(msg) });
    } finally {
      setPayBusy(false);
    }
  }

  async function onPayCredit(orderId: string) {
    setPayBusy(true);
    setBanner(null);
    try {
      await postOrderCreditPayment(orderId);
      setBanner({ kind: 'ok', text: t('creditPaid') });
      setLastCreated(null);
      await refreshOrders();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'error';
      setBanner({ kind: 'err', text: translateErr(msg) });
    } finally {
      setPayBusy(false);
    }
  }

  async function onCancelOrder(orderId: string) {
    if (!window.confirm(t('confirmCancel'))) return;
    setPayBusy(true);
    try {
      await cancelOrder(orderId);
      setLastCreated(null);
      setBanner({ kind: 'ok', text: t('cancelled') });
      await refreshOrders();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'error';
      setBanner({ kind: 'err', text: translateErr(msg) });
    } finally {
      setPayBusy(false);
    }
  }

  const canLoadMore = catalog.length < catalogTotal;

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-(--color-text-primary)">{t('title')}</h1>
        <p className="mt-1 text-sm text-(--color-text-secondary)">{t('lead')}</p>
      </div>

      {banner ? (
        <div
          role="status"
          className={`rounded-xl px-4 py-3 text-sm ${
            banner.kind === 'ok' ? 'bf-alert-success' : 'bf-alert-danger'
          }`}
        >
          {banner.text}
        </div>
      ) : null}

      {lastCreated ? (
        <div
          className="rounded-2xl border p-6"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
        >
          <h2 className="text-lg font-semibold text-(--color-text-primary)">{t('nextStep')}</h2>
          <p className="mt-1 text-sm text-(--color-text-secondary)">
            {t('orderRef', { id: lastCreated.id.slice(0, 8) })}
          </p>
          <p className="mt-2 font-medium text-(--color-brand)">
            {formatTry(parseMoney(lastCreated.total), locale)}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={payBusy || lastCreated.payment_status !== 'unpaid'}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-(--color-on-brand) disabled:opacity-50"
              style={{ background: 'var(--color-brand)' }}
              onClick={() => void onPayBank(lastCreated.id)}
            >
              {t('payBank')}
            </button>
            <button
              type="button"
              disabled={payBusy || lastCreated.payment_status !== 'unpaid'}
              className="rounded-xl border px-4 py-2 text-sm font-semibold"
              style={{ borderColor: 'var(--color-border)' }}
              onClick={() => void onPayCredit(lastCreated.id)}
            >
              {t('payCredit')}
            </button>
            <button
              type="button"
              disabled={payBusy || lastCreated.status !== 'pending'}
              className="rounded-xl border px-4 py-2 text-sm text-(--color-text-muted)"
              style={{ borderColor: 'var(--color-border)' }}
              onClick={() => void onCancelOrder(lastCreated.id)}
            >
              {t('cancelOrder')}
            </button>
            <Link
              href={localizedPath(locale, `/panel/siparisler/${lastCreated.id}`)}
              className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-(--color-brand) underline-offset-2 hover:underline"
            >
              {t('openDetail')}
            </Link>
          </div>
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-(--color-text-primary)">{t('catalog')}</h2>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full rounded-xl border px-4 py-2 text-sm sm:max-w-xs"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {catalog.map((p) => {
              const img = productThumb(p);
              return (
                <article
                  key={p.id}
                  className="flex flex-col overflow-hidden rounded-2xl border"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
                >
                  <div className="relative aspect-4/3 bg-(--color-bg-alt)">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element -- remote asset URLs from API
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 text-sm font-semibold text-(--color-text-primary)">
                      {p.title}
                    </h3>
                    <div className="mt-2 text-xs text-(--color-text-muted)">
                      <span className="line-through">{formatTry(parseMoney(p.list_price), locale)}</span>
                      <span className="ml-2 font-semibold text-(--color-brand)">
                        {formatTry(parseMoney(p.unit_price), locale)}
                        <span className="font-normal text-(--color-text-secondary)"> / kg</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      className="mt-auto w-full rounded-xl py-2 text-sm font-semibold text-(--color-on-brand)"
                      style={{ background: 'var(--color-brand)' }}
                      onClick={() => addToCart(p)}
                    >
                      {t('addToCart')}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {catalogLoading && catalog.length === 0 ? (
            <p className="text-sm text-(--color-text-muted)">{t('loading')}</p>
          ) : null}

          {canLoadMore ? (
            <button
              type="button"
              disabled={catalogLoading}
              className="w-full rounded-xl border py-3 text-sm font-medium"
              style={{ borderColor: 'var(--color-border)' }}
              onClick={() => void loadMoreCatalog()}
            >
              {catalogLoading ? t('loading') : t('loadMore')}
            </button>
          ) : null}
        </section>

        <aside
          className="space-y-4 rounded-2xl border p-5 lg:sticky lg:top-6 lg:self-start"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
        >
          <h2 className="text-lg font-semibold text-(--color-text-primary)">{t('cart')}</h2>
          {cartLines.length === 0 ? (
            <p className="text-sm text-(--color-text-secondary)">{t('emptyCart')}</p>
          ) : (
            <ul className="space-y-4">
              {cartLines.map((line) => (
                <li key={line.product.id} className="border-b pb-4 last:border-0" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="text-sm font-medium text-(--color-text-primary)">{line.product.title}</div>
                  <label className="mt-2 block text-xs text-(--color-text-muted)">
                    {t('quantityGrams')}
                    <input
                      type="number"
                      min={1}
                      step={100}
                      value={line.quantityGrams}
                      onChange={(e) => setLineQty(line.product.id, Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                      style={{ borderColor: 'var(--color-border)' }}
                    />
                  </label>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-(--color-text-secondary)">
                      {formatTry((parseMoney(line.product.unit_price) * line.quantityGrams) / 1000, locale)}
                    </span>
                    <button
                      type="button"
                      className="bf-link-danger text-xs"
                      onClick={() => removeLine(line.product.id)}
                    >
                      {t('remove')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <label className="block text-xs font-medium text-(--color-text-muted)">
            {t('notes')}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </label>

          <div className="flex items-center justify-between border-t pt-4 text-sm font-semibold" style={{ borderColor: 'var(--color-border)' }}>
            <span>{t('cartTotal')}</span>
            <span className="text-(--color-brand)">{formatTry(cartTotalTry, locale)}</span>
          </div>

          <button
            type="button"
            disabled={submitting || cartLines.length === 0}
            className="w-full rounded-xl py-3 text-sm font-semibold text-(--color-on-brand) disabled:opacity-50"
            style={{ background: 'var(--color-brand)' }}
            onClick={() => void submitOrder()}
          >
            {submitting ? t('submitting') : t('submitOrder')}
          </button>
        </aside>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-(--color-text-primary)">{t('recent')}</h2>
          <button
            type="button"
            className="text-sm text-(--color-brand) hover:underline"
            onClick={() => void refreshOrders()}
          >
            {t('refresh')}
          </button>
        </div>

        {ordersLoading ? (
          <p className="text-sm text-(--color-text-muted)">{t('loading')}</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-(--color-text-secondary)">{t('noOrders')}</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--color-border)' }}>
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-(--color-bg-alt) text-(--color-text-muted)">
                <tr>
                  <th className="px-4 py-3 font-medium">{t('col.date')}</th>
                  <th className="px-4 py-3 font-medium">{t('col.total')}</th>
                  <th className="px-4 py-3 font-medium">{t('col.status')}</th>
                  <th className="px-4 py-3 font-medium">{t('col.payment')}</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="px-4 py-3 text-(--color-text-secondary)">
                      {new Date(o.created_at).toLocaleString(locale === 'en' ? 'en-GB' : 'tr-TR')}
                    </td>
                    <td className="px-4 py-3 font-medium">{formatTry(parseMoney(o.total), locale)}</td>
                    <td className="px-4 py-3">{t(`status.${o.status}` as 'status.pending')}</td>
                    <td className="px-4 py-3">{t(`pay.${o.payment_status}` as 'pay.unpaid')}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={localizedPath(locale, `/panel/siparisler/${o.id}`)}
                        className="font-medium text-(--color-brand) hover:underline"
                      >
                        {t('detail')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
