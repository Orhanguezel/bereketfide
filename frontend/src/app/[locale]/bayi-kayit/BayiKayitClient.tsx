'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { localizedPath } from '@/seo/helpers';
import { postDealerRegister } from '@/lib/dealer-register-api';

export function BayiKayitClient({ locale }: { locale: string }) {
  const t = useTranslations('auth.bayi');
  const tc = useTranslations('auth.errors');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [taxOffice, setTaxOffice] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [rules, setRules] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const inputCls =
    'w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-(--color-brand)/30';
  const labelCls = 'text-xs font-medium uppercase tracking-wide text-(--color-text-muted)';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== password2) {
      setError(t('passwordMismatch'));
      return;
    }
    if (!rules) {
      setError(tc('rules_accepted_required'));
      return;
    }
    setLoading(true);
    try {
      await postDealerRegister({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        phone: phone.trim(),
        company_name: companyName.trim(),
        tax_number: taxNumber.trim(),
        tax_office: taxOffice.trim(),
        city: city.trim() || undefined,
        region: region.trim() || undefined,
        rules_accepted: true,
      });
      setDone(true);
    } catch (e) {
      const err = e as Error & { status?: number };
      const msg = err instanceof Error ? err.message : 'generic';
      if (err.status === 429) setError(tc('rate_limited'));
      else if (msg === 'user_exists') setError(tc('user_exists'));
      else if (msg === 'validation_error') setError(tc('validation_error'));
      else setError(tc('generic'));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div
        className="w-full max-w-md rounded-2xl border p-8 shadow-sm"
        style={{
          borderColor: 'var(--color-border)',
          background: 'var(--color-bg-secondary)',
        }}
      >
        <p className="text-sm text-(--color-text-primary)">{t('registerSuccess')}</p>
        <Link
          href={localizedPath(locale, '/bayi-girisi')}
          className="mt-6 inline-block rounded-xl bg-(--color-brand) px-4 py-3 text-sm font-semibold text-(--color-on-brand)"
        >
          {t('registerGoLogin')}
        </Link>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-lg rounded-2xl border p-8 shadow-sm"
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
          {t('registerTitle')}
        </h1>
        <p className="mt-2 text-sm text-(--color-text-secondary)">{t('registerSubtitle')}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className={labelCls}>{t('companyName')} *</label>
          <input
            className={inputCls}
            style={{ borderColor: 'var(--color-border)' }}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            minLength={2}
            autoComplete="organization"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={labelCls}>{t('taxNumber')} *</label>
            <input
              className={inputCls}
              style={{ borderColor: 'var(--color-border)' }}
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              required
              minLength={5}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>{t('taxOffice')} *</label>
            <input
              className={inputCls}
              style={{ borderColor: 'var(--color-border)' }}
              value={taxOffice}
              onChange={(e) => setTaxOffice(e.target.value)}
              required
              minLength={2}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>{t('fullName')} *</label>
          <input
            className={inputCls}
            style={{ borderColor: 'var(--color-border)' }}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            minLength={2}
            autoComplete="name"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={labelCls}>{t('email')} *</label>
            <input
              type="email"
              className={inputCls}
              style={{ borderColor: 'var(--color-border)' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>{t('phone')} *</label>
            <input
              type="tel"
              className={inputCls}
              style={{ borderColor: 'var(--color-border)' }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              minLength={8}
              autoComplete="tel"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={labelCls}>{t('city')}</label>
            <input
              className={inputCls}
              style={{ borderColor: 'var(--color-border)' }}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoComplete="address-level2"
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>{t('region')}</label>
            <input
              className={inputCls}
              style={{ borderColor: 'var(--color-border)' }}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>{t('password')} *</label>
          <input
            type="password"
            className={inputCls}
            style={{ borderColor: 'var(--color-border)' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>{t('passwordConfirm')} *</label>
          <input
            type="password"
            className={inputCls}
            style={{ borderColor: 'var(--color-border)' }}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-(--color-text-secondary)">
          <input type="checkbox" className="mt-1" checked={rules} onChange={(e) => setRules(e.target.checked)} />
          <span>{t('rulesLabel')}</span>
        </label>

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
          {loading ? t('registerSubmitting') : t('registerSubmit')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-(--color-text-muted)">
        {t('hasAccount')}{' '}
        <Link href={localizedPath(locale, '/bayi-girisi')} className="font-medium text-(--color-brand) hover:underline">
          {t('submit')}
        </Link>
      </p>
    </div>
  );
}
