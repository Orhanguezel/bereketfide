'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { localizedPath } from '@/seo/helpers';
import { loginWithEmail, logout, type AuthUserRole } from '@/lib/auth';
import { assertApprovedDealerProfile } from '@/lib/dealer-api';

function canUseDealerPortal(role: AuthUserRole | undefined): boolean {
  return role === 'dealer' || role === 'admin';
}

export function BayiGirisClient({ locale }: { locale: string }) {
  const t = useTranslations('auth.bayi');
  const tc = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDev = process.env.NODE_ENV === 'development';
  const [email, setEmail] = useState(isDev ? 'bayi@example.com' : '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('durum') === 'beklemede') {
      setError(t('pendingApproval'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resolveNextPath() {
    const raw = searchParams.get('next');
    if (!raw || !raw.startsWith('/')) return localizedPath(locale, '/bayi-dashboard');
    if (raw.startsWith('//')) return localizedPath(locale, '/bayi-dashboard');
    return raw;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginWithEmail(email.trim(), password);
      if (!canUseDealerPortal(res.user?.role)) {
        await logout();
        setError(t('unauthorized'));
        setLoading(false);
        return;
      }
      if (res.user?.role === 'dealer') {
        try {
          await assertApprovedDealerProfile();
        } catch (e) {
          const msg = e instanceof Error ? e.message : '';
          if (msg === 'dealer_not_approved') {
            await logout();
            setError(t('pendingApproval'));
            setLoading(false);
            return;
          }
          throw e;
        }
      }
      router.push(resolveNextPath());
      router.refresh();
    } catch {
      setError(tc('errors.invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[70vh] flex items-center justify-center px-4 py-16"
      style={{ background: 'var(--color-bg-alt)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-8 shadow-sm"
        style={{
          borderColor: 'var(--color-border)',
          background: 'var(--color-bg-secondary)',
        }}
      >
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 h-1 w-16 rounded-full"
            style={{ background: 'var(--color-brand)' }}
          />
          <h1 className="text-2xl font-semibold tracking-tight text-(--color-text-primary)">
            {t('loginTitle')}
          </h1>
          <p className="mt-2 text-sm text-(--color-text-secondary)">{t('loginSubtitle')}</p>
          {isDev ? (
            <p className="mt-3 text-left font-mono text-[11px] text-(--color-text-muted)">
              {t('devHint')}
            </p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-(--color-text-muted)">
              {t('email')}
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-(--color-brand)/30"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-(--color-text-muted)">
              {t('password')}
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-(--color-brand)/30"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {error ? (
            <div className="bf-alert-danger rounded-xl px-4 py-3 text-center text-xs font-medium">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-(--color-brand) py-3 text-sm font-semibold text-(--color-on-brand) transition-opacity disabled:opacity-50"
          >
            {loading ? t('submitting') : t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
