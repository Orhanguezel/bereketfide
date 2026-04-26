'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { localizedPath } from '@/seo/helpers';
import { showDealerIyzicoPayment, showDealerBankCardPayment } from '@/config/public-features';
import type { OrderDetail } from '@/modules/bayi/types';
import { IyzicoCheckoutHost } from '@/modules/bayi/IyzicoCheckoutHost';
import {
  cancelOrder,
  fetchOrderById,
  postOrderBankTransfer,
  postOrderCreditPayment,
  postOrderIyzicoInitiate,
  postOrderCardInitiate,
} from '@/modules/bayi/services';

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

export default function OrderDetailClient({ locale, orderId }: { locale: string; orderId: string }) {
  const t = useTranslations('auth.panel.orders');
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [checkoutHtml, setCheckoutHtml] = useState<string | null>(null);
  const [cardFormHtml, setCardFormHtml] = useState<string | null>(null);
  const [installment, setInstallment] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const o = await fetchOrderById(orderId);
      setOrder(o);
    } catch {
      setOrder(null);
      setMsg({ kind: 'err', text: t('errors.loadOrder') });
    } finally {
      setLoading(false);
    }
  }, [orderId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  function translateErr(code: string) {
    const known = [
      'insufficient_credit',
      'already_paid',
      'order_cancelled',
      'only_pending_orders_can_be_cancelled',
      'order_not_found',
      'payment_already_in_progress',
      'installment_not_supported',
      'iyzico_feature_disabled',
      'iyzico_not_configured',
      'iyzico_init_failed',
      'basket_total_mismatch',
      'order_has_no_items',
    ] as const;
    if ((known as readonly string[]).includes(code)) {
      return t(`errors.${code}` as 'errors.insufficient_credit');
    }
    return t('errors.generic', { code });
  }

  async function onBank() {
    if (!order) return;
    setBusy(true);
    setMsg(null);
    try {
      await postOrderBankTransfer(order.id);
      setMsg({ kind: 'ok', text: t('bankMarked') });
      await load();
    } catch (e) {
      setMsg({ kind: 'err', text: translateErr(e instanceof Error ? e.message : 'error') });
    } finally {
      setBusy(false);
    }
  }

  async function onIyzico() {
    if (!order) return;
    setBusy(true);
    setMsg(null);
    setCheckoutHtml(null);
    setCardFormHtml(null);
    try {
      const res = await postOrderIyzicoInitiate(order.id, locale, installment);
      setCheckoutHtml(res.checkoutFormContent);
    } catch (e) {
      setMsg({ kind: 'err', text: translateErr(e instanceof Error ? e.message : 'error') });
    } finally {
      setBusy(false);
    }
  }

  async function onBankCard() {
    if (!order) return;
    setBusy(true);
    setMsg(null);
    setCheckoutHtml(null);
    setCardFormHtml(null);
    try {
      const res = await postOrderCardInitiate(order.id, locale, installment);
      if ('pageUrl' in res) {
        window.location.href = res.pageUrl;
      } else if ('redirectUrl' in res) {
        window.location.href = res.redirectUrl;
      } else if ('formHtml' in res) {
        setCardFormHtml(res.formHtml);
      }
    } catch (e) {
      setMsg({ kind: 'err', text: translateErr(e instanceof Error ? e.message : 'error') });
    } finally {
      setBusy(false);
    }
  }

  async function onCredit() {
    if (!order) return;
    setBusy(true);
    setMsg(null);
    try {
      await postOrderCreditPayment(order.id);
      setMsg({ kind: 'ok', text: t('creditPaid') });
      await load();
    } catch (e) {
      setMsg({ kind: 'err', text: translateErr(e instanceof Error ? e.message : 'error') });
    } finally {
      setBusy(false);
    }
  }

  async function onCancel() {
    if (!order || !window.confirm(t('confirmCancel'))) return;
    setBusy(true);
    setMsg(null);
    try {
      await cancelOrder(order.id);
      setMsg({ kind: 'ok', text: t('cancelled') });
      await load();
    } catch (e) {
      setMsg({ kind: 'err', text: translateErr(e instanceof Error ? e.message : 'error') });
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-(--color-text-muted)">{t('loading')}</p>;
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-(--status-danger)">{msg?.text ?? t('notFound')}</p>
        <Link href={localizedPath(locale, '/panel/siparisler')} className="text-sm text-(--color-brand) hover:underline">
          {t('backList')}
        </Link>
      </div>
    );
  }

  const showPay = order.payment_status === 'unpaid' && order.status === 'pending';
  const showRetry = order.payment_status === 'pending' && order.status === 'pending';
  const showCancel = order.status === 'pending';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-(--color-text-primary)">{t('detailTitle')}</h1>
          <p className="mt-1 font-mono text-xs text-(--color-text-muted)">{order.id}</p>
        </div>
        <Link
          href={localizedPath(locale, '/panel/siparisler')}
          className="text-sm font-medium text-(--color-brand) hover:underline"
        >
          {t('backList')}
        </Link>
      </div>

      {msg ? (
        <div
          role="status"
          className={`rounded-xl px-4 py-3 text-sm ${
            msg.kind === 'ok' ? 'bf-alert-success' : 'bf-alert-danger'
          }`}
        >
          {msg.text}
        </div>
      ) : null}

      <div
        className="grid gap-4 rounded-2xl border p-5 sm:grid-cols-2"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
      >
        <div>
          <div className="text-xs font-semibold uppercase text-(--color-text-muted)">{t('col.status')}</div>
          <div className="mt-1">{t(`status.${order.status}` as 'status.pending')}</div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase text-(--color-text-muted)">{t('col.payment')}</div>
          <div className="mt-1">{t(`pay.${order.payment_status}` as 'pay.unpaid')}</div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase text-(--color-text-muted)">{t('col.date')}</div>
          <div className="mt-1 text-(--color-text-secondary)">
            {new Date(order.created_at).toLocaleString(locale === 'en' ? 'en-GB' : 'tr-TR')}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase text-(--color-text-muted)">{t('col.total')}</div>
          <div className="mt-1 text-lg font-semibold text-(--color-brand)">
            {formatTry(parseMoney(order.total), locale)}
          </div>
        </div>
      </div>

      {order.notes ? (
        <div className="rounded-xl border p-4 text-sm" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-xs font-semibold uppercase text-(--color-text-muted)">{t('notes')}</div>
          <p className="mt-2 whitespace-pre-wrap text-(--color-text-secondary)">{order.notes}</p>
        </div>
      ) : null}

      <div>
        <h2 className="text-lg font-semibold text-(--color-text-primary)">{t('lines')}</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
          <table className="w-full min-w-100 text-left text-sm">
            <thead className="bg-(--color-bg-alt) text-(--color-text-muted)">
              <tr>
                <th className="px-4 py-2 font-medium">{t('col.product')}</th>
                <th className="px-4 py-2 font-medium">{t('col.qty')}</th>
                <th className="px-4 py-2 font-medium">{t('col.lineTotal')}</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it) => (
                <tr key={it.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="px-4 py-3 text-(--color-text-primary)">
                    {it.product_title ?? it.product_id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-(--color-text-secondary)">
                    {it.quantity.toLocaleString(locale === 'en' ? 'en-US' : 'tr-TR')}
                  </td>
                  <td className="px-4 py-3">{formatTry(parseMoney(it.total_price), locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {checkoutHtml ? (
        <div className="space-y-2">
          <p className="text-xs text-(--color-text-muted)">{t('iyzicoIframeHint')}</p>
          <IyzicoCheckoutHost html={checkoutHtml} />
        </div>
      ) : null}

      {cardFormHtml ? (
        <div className="space-y-2">
          <p className="text-xs text-(--color-text-muted)">{t('cardRedirectHint')}</p>
          <IyzicoCheckoutHost html={cardFormHtml} />
        </div>
      ) : null}

      {showRetry ? (
        <div
          role="status"
          className="rounded-xl border px-4 py-3 text-sm"
          style={{ borderColor: 'var(--color-warn, #d97706)', background: 'var(--color-warn-bg, #fffbeb)' }}
        >
          <p className="font-semibold text-(--color-text-primary)">{t('paymentAbandoned')}</p>
          <p className="mt-1 text-(--color-text-secondary)">{t('paymentAbandonedHint')}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {(showPay || showRetry) ? (
          <>
            <label className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-(--color-text-muted)">{t('installment')}</span>
              <select
                value={installment}
                onChange={(e) => setInstallment(Number(e.target.value) || 1)}
                className="bg-transparent outline-none"
              >
                {[1, 2, 3, 6, 9, 12].map((n) => (
                  <option key={n} value={n}>
                    {t('installmentOption', { count: n })}
                  </option>
                ))}
              </select>
            </label>
            {showDealerBankCardPayment ? (
              <button
                type="button"
                disabled={busy}
                className="rounded-xl bg-(--color-brand) px-4 py-2 text-sm font-semibold text-(--color-on-brand) disabled:opacity-50"
                onClick={() => void onBankCard()}
              >
                {t('payBankCard')}
              </button>
            ) : null}
            {showDealerIyzicoPayment ? (
              <button
                type="button"
                disabled={busy}
                className="rounded-xl border border-(--color-brand) px-4 py-2 text-sm font-semibold text-(--color-brand) disabled:opacity-50"
                onClick={() => void onIyzico()}
              >
                {installment > 1 ? t('payCardInstallment') : t('payCard')}
              </button>
            ) : null}
            <button
              type="button"
              disabled={busy}
              className="rounded-xl bg-(--color-brand) px-4 py-2 text-sm font-semibold text-(--color-on-brand) disabled:opacity-50"
              onClick={() => void onBank()}
            >
              {t('payBank')}
            </button>
            <button
              type="button"
              disabled={busy}
              className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50"
              style={{ borderColor: 'var(--color-border)' }}
              onClick={() => void onCredit()}
            >
              {t('payCredit')}
            </button>
          </>
        ) : null}
        {showCancel ? (
          <button
            type="button"
            disabled={busy}
            className="rounded-xl border px-4 py-2 text-sm text-(--color-text-muted) disabled:opacity-50"
            style={{ borderColor: 'var(--color-border)' }}
            onClick={() => void onCancel()}
          >
            {t('cancelOrder')}
          </button>
        ) : null}
      </div>
    </div>
  );
}
