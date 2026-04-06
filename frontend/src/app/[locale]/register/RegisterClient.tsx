'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { localizedPath } from '@/seo';
import { signupWithEmail, startGoogleOAuth } from '@/lib/auth';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
  );
}

const ERROR_KEYS: Record<string, string> = {
  user_exists: 'user_exists',
  invalid_credentials: 'invalid_credentials',
  invalid_email: 'invalid_email',
  weak_password: 'weak_password',
  account_disabled: 'account_disabled',
  too_many_requests: 'too_many_attempts',
  google_oauth_not_configured: 'google_oauth_not_configured',
};

export function RegisterClient({ locale }: { locale: string }) {
  const t = useTranslations('auth');
  const tc = useTranslations('common');
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const resolveError = (err: unknown): string => {
    const msg = err instanceof Error ? err.message : '';
    const key = ERROR_KEYS[msg];
    if (key) {
      try { return t(`errors.${key}`); } catch { /* fallback */ }
    }
    return msg || t('errors.generic');
  };

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      await signupWithEmail(email, password, fullName || undefined);
      router.push(localizedPath(locale, '/'));
      router.refresh();
    } catch (err) {
      setError(resolveError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await startGoogleOAuth(window.location.origin + localizedPath(locale, '/'));
    } catch (err) {
      setError(resolveError(err));
      setGoogleLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'color-mix(in srgb, var(--color-bg-dark) 40%, transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) router.push(localizedPath(locale, '/'));
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          background: 'var(--color-bg)',
          borderRadius: 8,
          padding: '48px 40px 36px',
          boxShadow: '0 8px 40px color-mix(in srgb, var(--color-bg-dark) 20%, transparent)',
        }}
      >
        <button
          type="button"
          onClick={() => router.push(localizedPath(locale, '/'))}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            padding: 6,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
            transition: 'color 0.15s',
          }}
          aria-label={tc('closeMenu')}
        >
          <X style={{ width: 22, height: 22 }} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Link href={localizedPath(locale, '/')} style={{ display: 'inline-block' }}>
            <Image
              src="/logo-dark.svg"
              alt="Bereket Fide"
              width={56}
              height={56}
              style={{ height: 56, width: 'auto' }}
            />
          </Link>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            textAlign: 'center',
            marginBottom: 8,
            lineHeight: 1.3,
          }}
        >
          {t('registerTitle')}
        </h1>

        <p
          style={{
            fontSize: 14,
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            marginBottom: 28,
            lineHeight: 1.5,
          }}
        >
          {t('registerSubtitle')}
        </p>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              marginBottom: 16,
              borderRadius: 4,
              background: 'color-mix(in srgb, var(--status-danger) 8%, transparent)',
              border: '1px solid color-mix(in srgb, var(--status-danger) 20%, transparent)',
              color: 'var(--status-danger)',
              fontSize: 13,
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={googleLoading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 4,
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg)',
            color: 'var(--color-text-primary)',
            fontSize: 14,
            fontWeight: 600,
            cursor: googleLoading ? 'wait' : 'pointer',
            opacity: googleLoading ? 0.7 : 1,
            transition: 'background 0.15s, border-color 0.15s',
          }}
        >
          <GoogleIcon />
          {googleLoading ? tc('loading') : t('continueWithGoogle')}
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '24px 0',
          }}
        >
          <span style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
            {t('orUseEmail')}
          </span>
          <span style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
        </div>

        {step === 1 ? (
          <form onSubmit={handleEmailContinue}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  marginBottom: 6,
                }}
              >
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 4,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>

            <p
              style={{
                fontSize: 12,
                color: 'var(--color-text-muted)',
                lineHeight: 1.5,
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              {t.rich('termsAgreement', {
                terms: (chunks) => (
                  <Link
                    href={localizedPath(locale, '/legal/terms')}
                    style={{ color: 'var(--color-brand)', textDecoration: 'underline' }}
                  >
                    {chunks}
                  </Link>
                ),
                privacy: (chunks) => (
                  <Link
                    href={localizedPath(locale, '/legal/privacy')}
                    style={{ color: 'var(--color-brand)', textDecoration: 'underline' }}
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 4,
                border: 'none',
                background: 'var(--color-accent)',
                color: 'var(--color-text-on-dark)',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
            >
              {t('continueWithEmail')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  marginBottom: 6,
                }}
              >
                {tc('name')}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 4,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  marginBottom: 6,
                }}
              >
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 4,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 4,
                border: 'none',
                background: 'var(--color-accent)',
                color: 'var(--color-text-on-dark)',
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {loading ? tc('loading') : t('signUp')}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                width: '100%',
                marginTop: 8,
                padding: '10px 16px',
                borderRadius: 4,
                border: '1px solid var(--color-border)',
                background: 'none',
                color: 'var(--color-text-secondary)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              ← {t('email')}: {email}
            </button>
          </form>
        )}

        <p
          style={{
            textAlign: 'center',
            marginTop: 24,
            fontSize: 13,
            color: 'var(--color-text-secondary)',
          }}
        >
          {t('hasAccount')}{' '}
          <Link
            href={localizedPath(locale, '/login')}
            style={{
              color: 'var(--color-brand)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            {t('logIn')}
          </Link>
        </p>

        <div
          style={{
            textAlign: 'center',
            marginTop: 16,
            fontSize: 12,
            color: 'var(--color-text-muted)',
            fontWeight: 500,
          }}
        >
          {t('step', { current: step, total: 2 })}
        </div>
      </div>
    </div>
  );
}
