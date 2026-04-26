'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { localizedPath } from '@/seo/helpers';
import { fetchCurrentUser, logout, type AuthUser, type AuthUserRole } from '@/lib/auth';
import { assertApprovedDealerProfile, fetchDealerBalance, type DealerBalanceDto } from '@/lib/dealer-api';

function isDealerLike(role: AuthUserRole | undefined): boolean {
  return role === 'dealer' || role === 'admin';
}

function stripLocalePrefix(pathname: string, loc: string): string {
  const prefix = `/${loc}`;
  if (pathname === prefix) return '/';
  if (pathname.startsWith(`${prefix}/`)) {
    const rest = pathname.slice(prefix.length);
    return rest && rest.length > 0 ? rest : '/';
  }
  return pathname;
}

export default function BayiPanelShell({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const t = useTranslations('auth.panel');
  const activeLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<DealerBalanceDto | null>(null);

  useEffect(() => {
    setMounted(true);
    let cancelled = false;
    (async () => {
      const u = await fetchCurrentUser();
      if (cancelled) return;
      if (!u || !isDealerLike(u.role)) {
        router.replace(localizedPath(locale, '/bayi-girisi'));
        setLoading(false);
        return;
      }
      setUser(u);
      if (u.role === 'dealer') {
        try {
          await assertApprovedDealerProfile();
        } catch (e) {
          if (cancelled) return;
          const msg = e instanceof Error ? e.message : '';
          if (msg === 'dealer_not_approved') {
            await logout();
            router.replace(localizedPath(locale, '/bayi-girisi?durum=beklemede'));
            setLoading(false);
            return;
          }
        }
        const b = await fetchDealerBalance();
        if (!cancelled) setBalance(b);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const pathNoLocale = stripLocalePrefix(pathname, activeLocale);

  if (!mounted || loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: 'var(--color-bg-alt)' }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
          style={{ borderColor: 'var(--color-brand)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!user) return null;

  const isDealer = user.role === 'dealer';

  const navCls = (active: boolean) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
      active
        ? 'text-(--color-on-brand)'
        : 'text-(--color-text-secondary) hover:bg-(--color-bg-alt)'
    }`;

  const navStyle = (active: boolean) =>
    active ? { background: 'var(--color-brand)' } : undefined;

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-(--color-bg-alt)">
      <aside
        className="w-full border-b p-6 md:w-72 md:border-b-0 md:border-r"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
      >
        <Link
          href={localizedPath(locale, '/')}
          className="block text-lg font-semibold text-(--color-text-primary)"
        >
          Bereket Fide
        </Link>
        <div
          className="mt-6 rounded-2xl border p-4"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-alt)' }}
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider text-(--color-brand)">
            {t('nav.dealerPortal')}
          </div>
          <div className="mt-1 truncate text-sm font-medium text-(--color-text-primary)">
            {user.full_name || user.email}
          </div>
          {isDealer && balance ? (
            <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="text-[10px] font-semibold uppercase text-(--color-text-muted)">
                {t('nav.limitLabel')}
              </div>
              <div className="text-lg font-semibold text-(--color-brand)">
                ₺
                {balance.available.toLocaleString('tr-TR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          ) : null}
        </div>

        <nav className="mt-6 space-y-1">
          <Link
            href={localizedPath(locale, '/bayi-dashboard')}
            className={navCls(pathNoLocale === '/bayi-dashboard')}
            style={navStyle(pathNoLocale === '/bayi-dashboard')}
          >
            {t('nav.overview')}
          </Link>
          {isDealer ? (
            <>
              <Link
                href={localizedPath(locale, '/panel/siparisler')}
                className={navCls(pathNoLocale.startsWith('/panel/siparisler'))}
                style={navStyle(pathNoLocale.startsWith('/panel/siparisler'))}
              >
                {t('nav.orders')}
              </Link>
              <Link
                href={localizedPath(locale, '/panel/ekstralar')}
                className={navCls(pathNoLocale.startsWith('/panel/ekstralar'))}
                style={navStyle(pathNoLocale.startsWith('/panel/ekstralar'))}
              >
                {t('nav.extras')}
              </Link>
              <Link
                href={localizedPath(locale, '/bayi/finans')}
                className={navCls(pathNoLocale.startsWith('/bayi/finans'))}
                style={navStyle(pathNoLocale.startsWith('/bayi/finans'))}
              >
                {t('nav.finance')}
              </Link>
            </>
          ) : null}
        </nav>

        <button
          type="button"
          className="mt-8 w-full rounded-xl border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) transition-colors hover:border-[color-mix(in_srgb,var(--status-danger)_30%,transparent)] hover:text-(--status-danger)"
          style={{ borderColor: 'var(--color-border)' }}
          onClick={async () => {
            await logout();
            router.push(localizedPath(locale, '/'));
            router.refresh();
          }}
        >
          {t('nav.logout')}
        </button>
      </aside>
      <main className="flex-1 overflow-auto p-6 md:p-10">{children}</main>
    </div>
  );
}
