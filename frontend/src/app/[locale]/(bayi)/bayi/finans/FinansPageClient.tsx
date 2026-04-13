'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { showDealerBankCardPayment } from '@/config/public-features';
import { IyzicoCheckoutHost } from '@/modules/bayi/IyzicoCheckoutHost';
import type { FinanceSummary, DealerTransactionRow } from '@/modules/bayi/types';
import {
  downloadFinanceStatementPdf,
  fetchFinanceSummary,
  fetchTransactions,
  postDealerDirectCardInitiate,
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

export default function FinansPageClient({ locale }: { locale: string }) {
  const t = useTranslations('auth.panel.finance');
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [tx, setTx] = useState<DealerTransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [payBusy, setPayBusy] = useState(false);
  const [cardFormHtml, setCardFormHtml] = useState<string | null>(null);
  const [amount, setAmount] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const [s, tr] = await Promise.all([
        fetchFinanceSummary(),
        fetchTransactions({ page: 1, limit: 40 }),
      ]);
      setSummary(s);
      setTx(tr.data);
    } catch {
      setErr('load_error');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!summary) return;
    if (amount.trim()) return;
    if (summary.current_balance > 0) {
      setAmount(summary.current_balance.toFixed(2));
    }
  }, [summary, amount]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const u = new URLSearchParams(window.location.search);
    const payment = u.get('payment');
    if (payment === 'success') {
      setMsg({ kind: 'ok', text: t('directPayment.success') });
      setCardFormHtml(null);
      void load();
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }
    if (payment === 'fail') {
      const reason = u.get('reason');
      setMsg({ kind: 'err', text: translateErr(reason || 'payment_failed') });
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }
    if (u.get('focus') === 'direct-payment') {
      const el = document.getElementById('dealer-direct-payment');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  async function onPdf() {
    setPdfBusy(true);
    setErr(null);
    try {
      await downloadFinanceStatementPdf();
    } catch {
      setErr(t('errors.pdf'));
    } finally {
      setPdfBusy(false);
    }
  }

  function translateErr(code: string) {
    const known = [
      'bank_card_feature_disabled',
      'nestpay_not_configured',
      'ziraatpay_not_configured',
      'craftgate_init_failed',
      'ziraatpay_init_failed',
      'payment_failed',
      'hash_mismatch',
      'payment_not_found',
      'amount_exceeds_balance',
      'no_outstanding_balance',
      'invalid_payment_state',
    ] as const;
    if ((known as readonly string[]).includes(code)) {
      return t(`errors.${code}` as 'errors.load');
    }
    return t('errors.generic', { code });
  }

  async function onDirectPayment() {
    const numericAmount = Number.parseFloat(amount.replace(',', '.'));
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMsg({ kind: 'err', text: t('errors.invalidAmount') });
      return;
    }
    setPayBusy(true);
    setErr(null);
    setMsg(null);
    setCardFormHtml(null);
    try {
      const res = await postDealerDirectCardInitiate({ amount: numericAmount, locale });
      if ('pageUrl' in res) {
        window.location.href = res.pageUrl;
      } else if ('redirectUrl' in res) {
        window.location.href = res.redirectUrl;
      } else if ('formHtml' in res) {
        setCardFormHtml(res.formHtml);
      }
    } catch (e) {
      setMsg({ kind: 'err', text: translateErr(e instanceof Error ? e.message : 'payment_failed') });
    } finally {
      setPayBusy(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-(--color-text-muted)">{t('loading')}</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-(--color-text-primary)">{t('title')}</h1>
          <p className="mt-1 text-sm text-(--color-text-secondary)">{t('lead')}</p>
        </div>
        <button
          type="button"
          disabled={pdfBusy}
          className="rounded-xl bg-(--color-brand) px-4 py-2 text-sm font-semibold text-(--color-on-brand) disabled:opacity-50"
          onClick={() => void onPdf()}
        >
          {pdfBusy ? t('pdfWorking') : t('downloadPdf')}
        </button>
      </div>

      {msg ? (
        <div className={`rounded-xl px-4 py-3 text-sm ${msg.kind === 'ok' ? 'bf-alert-success' : 'bf-alert-danger'}`}>{msg.text}</div>
      ) : null}

      {err ? (
        <div className="bf-alert-danger rounded-xl px-4 py-3 text-sm">
          {err === 'load_error' ? t('errors.load') : err}
        </div>
      ) : null}

      {summary ? (
        <>
          <section
            id="dealer-direct-payment"
            className="rounded-[28px] border p-6 shadow-sm"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-brand)">
                  {t('directPayment.eyebrow')}
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-(--color-text-primary)">
                  {t('directPayment.title')}
                </h2>
                <p className="mt-2 text-sm leading-7 text-(--color-text-secondary)">
                  {t('directPayment.lead')}
                </p>
              </div>
              {summary.current_balance > 0 && (
                <button
                  type="button"
                  className="rounded-xl border px-4 py-2 text-sm font-medium"
                  style={{ borderColor: 'var(--color-border)' }}
                  onClick={() => setAmount(String(summary.current_balance.toFixed(2)))}
                >
                  {t('directPayment.useFullBalance')}
                </button>
              )}
            </div>

            <div className="mt-6">
              <label className="space-y-2">
                <span className="text-sm font-medium text-(--color-text-primary)">{t('directPayment.amount')}</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={String((summary.current_balance || 0).toFixed(2))}
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-(--color-text-muted)">{t('directPayment.outstanding')}</div>
                <div className="mt-1 font-semibold text-(--color-brand)">{formatTry(summary.current_balance, locale)}</div>
              </div>
              <div className="max-w-md text-(--color-text-secondary)">
                {t('directPayment.hint')}
              </div>
            </div>

            {showDealerBankCardPayment && (
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={payBusy || !(Number.parseFloat(amount.replace(',', '.')) > 0)}
                  className="rounded-xl bg-(--color-brand) px-5 py-3 text-sm font-semibold text-(--color-on-brand) disabled:opacity-50"
                  onClick={() => void onDirectPayment()}
                >
                  {payBusy ? t('directPayment.processing') : t('directPayment.cta')}
                </button>
              </div>
            )}
          </section>

          {summary.warnings.length > 0 ? (
            <ul className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              {summary.warnings.map((w) => (
                <li key={w}>{t(`warnings.${w}` as 'warnings.low_credit')}</li>
              ))}
            </ul>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: t('cards.limit'), value: summary.credit_limit },
              { label: t('cards.balance'), value: summary.current_balance },
              { label: t('cards.available'), value: summary.available },
              { label: t('cards.discount'), value: summary.discount_rate, suffix: '%' },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border p-4"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
              >
                <div className="text-xs font-semibold uppercase text-(--color-text-muted)">{c.label}</div>
                <div className="mt-2 text-xl font-semibold text-(--color-brand)">
                  {'suffix' in c && c.suffix === '%'
                    ? `${c.value.toLocaleString(locale === 'en' ? 'en-US' : 'tr-TR')}%`
                    : formatTry(c.value, locale)}
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl border p-5 text-sm"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-alt)' }}
          >
            <h2 className="font-semibold text-(--color-text-primary)">{t('totalsByType')}</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {Object.entries(summary.totals_by_type).map(([k, v]) => (
                <li key={k} className="flex justify-between gap-4">
                  <span className="text-(--color-text-secondary)">{t(`txType.${k}` as 'txType.order')}</span>
                  <span className="font-medium">{formatTry(v, locale)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-(--color-text-muted)">
              {t('meta', { count: summary.transaction_count, overdue: summary.overdue_count })}
            </p>
          </div>
        </>
      ) : null}

      {cardFormHtml ? (
        <div className="space-y-2">
          <p className="text-xs text-(--color-text-muted)">{t('directPayment.redirectHint')}</p>
          <IyzicoCheckoutHost html={cardFormHtml} />
        </div>
      ) : null}

      <section>
        <h2 className="text-lg font-semibold text-(--color-text-primary)">{t('movements')}</h2>
        {tx.length === 0 ? (
          <p className="mt-3 text-sm text-(--color-text-secondary)">{t('noMovements')}</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--color-border)' }}>
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-(--color-bg-alt) text-(--color-text-muted)">
                <tr>
                  <th className="px-4 py-3 font-medium">{t('col.date')}</th>
                  <th className="px-4 py-3 font-medium">{t('col.type')}</th>
                  <th className="px-4 py-3 font-medium">{t('col.amount')}</th>
                  <th className="px-4 py-3 font-medium">{t('col.balance')}</th>
                </tr>
              </thead>
              <tbody>
                {tx.map((row) => (
                  <tr key={row.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="px-4 py-3 text-(--color-text-secondary)">
                      {new Date(row.created_at).toLocaleString(locale === 'en' ? 'en-GB' : 'tr-TR')}
                    </td>
                    <td className="px-4 py-3">{t(`txType.${row.type}` as 'txType.order')}</td>
                    <td className="px-4 py-3 font-medium">{formatTry(parseMoney(row.amount), locale)}</td>
                    <td className="px-4 py-3 text-(--color-text-secondary)">
                      {formatTry(parseMoney(row.balance_after), locale)}
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
