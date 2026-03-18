'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { User, Mail, Phone, Shield, Calendar, Lock } from 'lucide-react';
import { localizedPath } from '@/seo';
import { fetchCurrentUser, updateProfile, type AuthUser } from '@/lib/auth';

export function ProfileClient({ locale }: { locale: string }) {
  const t = useTranslations('auth');
  const tc = useTranslations('common');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password form
  const [newPassword, setNewPassword] = useState('');
  const [savingPw, setSavingPw] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    fetchCurrentUser().then((u) => {
      setUser(u);
      if (u) {
        setFullName(u.full_name || '');
        setPhone(u.phone || '');
      }
      setLoading(false);
    });
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setProfileSuccess('');
    setProfileError('');
    try {
      const updated = await updateProfile({ full_name: fullName, phone });
      setUser((prev) => prev ? { ...prev, ...updated } : prev);
      setProfileSuccess(t('profile.saved'));
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : tc('error'));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) return;
    setSavingPw(true);
    setPwSuccess('');
    setPwError('');
    try {
      await updateProfile({ password: newPassword });
      setPwSuccess(t('profile.passwordChanged'));
      setNewPassword('');
    } catch (err) {
      setPwError(err instanceof Error ? err.message : tc('error'));
    } finally {
      setSavingPw(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 16px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>{tc('loading')}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 16px', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
          background: 'var(--color-bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <User style={{ width: 28, height: 28, color: 'var(--color-text-muted)' }} />
        </div>
        <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
          {t('profile.notLoggedIn')}
        </p>
        <Link
          href={localizedPath(locale, '/login')}
          style={{
            display: 'inline-block', padding: '12px 32px', borderRadius: 4,
            background: 'var(--color-accent)', color: 'var(--color-text-on-dark)',
            fontSize: 14, fontWeight: 700, textDecoration: 'none',
          }}
        >
          {t('profile.goToLogin')}
        </Link>
      </div>
    );
  }

  const initials = (user.full_name || user.email)
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 28,
          fontWeight: 800,
          color: 'var(--color-text-primary)',
          lineHeight: 1.2,
          margin: '0 0 8px',
        }}
      >
        {t('profile.title')}
      </h1>
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 32 }}>
        {t('profile.subtitle')}
      </p>

      <div style={{ display: 'grid', gap: 24 }} className="lg:grid-cols-[320px_1fr]">
        {/* ── LEFT: User card ── */}
        <div
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            padding: 32,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--color-brand)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              margin: '0 auto 16px',
            }}
          >
            {initials}
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: 4,
            }}
          >
            {user.full_name || user.email.split('@')[0]}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24 }}>
            {user.email}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Shield style={{ width: 16, height: 16, color: 'var(--color-brand)', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {t('profile.role')}
                </span>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                  {t(`profile.roles.${user.role}`)}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Calendar style={{ width: 16, height: 16, color: 'var(--color-brand)', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {t('profile.memberSince')}
                </span>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                  {new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Forms ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Profile info form */}
          <form
            onSubmit={handleProfileSave}
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              padding: 32,
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <User style={{ width: 18, height: 18, color: 'var(--color-brand)' }} />
              {t('profile.title')}
            </h3>

            {profileSuccess && (
              <div style={{
                padding: '10px 14px', marginBottom: 16, borderRadius: 4,
                background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)',
                color: '#16a34a', fontSize: 13,
              }}>
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div style={{
                padding: '10px 14px', marginBottom: 16, borderRadius: 4,
                background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.2)',
                color: '#dc2626', fontSize: 13,
              }}>
                {profileError}
              </div>
            )}

            <div style={{ display: 'grid', gap: 16 }} className="sm:grid-cols-2">
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                  <User style={{ width: 14, height: 14, color: 'var(--color-text-muted)' }} />
                  {t('profile.fullName')}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 4,
                    border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                    color: 'var(--color-text-primary)', fontSize: 14, outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                  <Mail style={{ width: 14, height: 14, color: 'var(--color-text-muted)' }} />
                  {t('profile.email')}
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 4,
                    border: '1px solid var(--color-border)', background: 'var(--color-bg-muted)',
                    color: 'var(--color-text-muted)', fontSize: 14, outline: 'none', cursor: 'not-allowed',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                  <Phone style={{ width: 14, height: 14, color: 'var(--color-text-muted)' }} />
                  {t('profile.phone')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+90 5XX XXX XX XX"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 4,
                    border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                    color: 'var(--color-text-primary)', fontSize: 14, outline: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                marginTop: 24, padding: '12px 28px', borderRadius: 4, border: 'none',
                background: 'var(--color-accent)', color: 'var(--color-text-on-dark)',
                fontSize: 14, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
                opacity: saving ? 0.7 : 1, transition: 'opacity 0.15s',
              }}
            >
              {saving ? t('profile.saving') : t('profile.saveChanges')}
            </button>
          </form>

          {/* Password change form */}
          <form
            onSubmit={handlePasswordChange}
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              padding: 32,
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Lock style={{ width: 18, height: 18, color: 'var(--color-brand)' }} />
              {t('profile.changePassword')}
            </h3>

            {pwSuccess && (
              <div style={{
                padding: '10px 14px', marginBottom: 16, borderRadius: 4,
                background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)',
                color: '#16a34a', fontSize: 13,
              }}>
                {pwSuccess}
              </div>
            )}
            {pwError && (
              <div style={{
                padding: '10px 14px', marginBottom: 16, borderRadius: 4,
                background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.2)',
                color: '#dc2626', fontSize: 13,
              }}>
                {pwError}
              </div>
            )}

            <div style={{ maxWidth: 400 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                <Lock style={{ width: 14, height: 14, color: 'var(--color-text-muted)' }} />
                {t('profile.newPassword')}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 4,
                  border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)', fontSize: 14, outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={savingPw || newPassword.length < 6}
              style={{
                marginTop: 24, padding: '12px 28px', borderRadius: 4,
                border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                color: 'var(--color-text-primary)',
                fontSize: 14, fontWeight: 600, cursor: savingPw ? 'wait' : 'pointer',
                opacity: savingPw || newPassword.length < 6 ? 0.5 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {savingPw ? t('profile.saving') : t('profile.changePassword')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
