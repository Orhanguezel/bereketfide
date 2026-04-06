'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { FinanceSummary, DealerTransactionRow } from '@/modules/bayi/types';
import {
  downloadFinanceStatementPdf,
  fetchFinanceSummary,
  fetchTransactions,
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
      setErr(t('errors.load'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
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

      {err ? (
        <div className="bf-alert-danger rounded-xl px-4 py-3 text-sm">{err}</div>
      ) : null}

      {summary ? (
        <>
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
