'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { localizedPath } from '@/seo';

/* ── Types ── */

interface MenuItem {
  title?: string;
  url?: string;
  children?: MenuItem[];
  [key: string]: unknown;
}

function normalizeItems(raw: Record<string, unknown>[]): MenuItem[] {
  return raw
    .map((r) => ({
      title: String(r.title ?? r.label ?? ''),
      url: String(r.url ?? r.href ?? '#'),
      children: Array.isArray(r.children) ? normalizeItems(r.children as any) : [],
    }))
    .filter((i) => i.title);
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={className} aria-hidden>
      <path
        d="M2.5 3.75L5 6.25L7.5 3.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function isNavActive(pathname: string, url: string, locale: string): boolean {
  const home = localizedPath(locale, '/');
  if (url === home) return pathname === url;
  return pathname.startsWith(url || '');
}

function itemOrChildActive(pathname: string, item: MenuItem, locale: string): boolean {
  if (isNavActive(pathname, item.url ?? '', locale)) return true;
  return (item.children ?? []).some((c) => isNavActive(pathname, c.url ?? '', locale));
}


/* ── Props ── */

interface HeaderProps {
  menuItems: Record<string, unknown>[];
  logoUrl: string;
  logoDarkUrl?: string;
  locale: string;
  activeLocales?: { code: string; label: string }[];
  companyProfile?: Record<string, string>;
  categories?: Record<string, unknown>[];
  services?: Record<string, unknown>[];
  news?: Record<string, unknown>[];
}

/* ── Component ── */

export function Header({
  menuItems,
  logoUrl,
  logoDarkUrl,
  locale,
  activeLocales,
  companyProfile,
  categories = [],
  services = [],
  news = [],
}: HeaderProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const items = normalizeItems(menuItems);

  const handleDropdownEnter = useCallback((key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(key);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  }, []);

  const companyName = companyProfile?.shortName || companyProfile?.company_name || 'Bereket Fide';
  const companySlogan = companyProfile?.headline || t('tagline');
  const l = (path: string) => localizedPath(locale, path);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!openDropdown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openDropdown]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);



  // Tema moduna göre logo seçimi
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme-mode') === 'dark');
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme-mode'] });
    return () => observer.disconnect();
  }, []);

  const fallbackLogo = '/logo/bereket-logo-light.png';
  const logoSrc = isDark ? (logoDarkUrl || logoUrl || fallbackLogo) : (logoUrl || fallbackLogo);
  const needsUnoptimized = logoSrc.endsWith('.svg') || logoSrc.startsWith('/uploads/');

  return (
    <>
      {/* Ana üst menü — yapışkan, açık/beyaz zemin */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: 'color-mix(in srgb, var(--color-bg-secondary) 95%, transparent)',
          backdropFilter: 'blur(10px)',
          boxShadow: scrolled
            ? '0 2px 20px color-mix(in srgb, var(--color-bg-dark) 8%, transparent)'
            : 'none',
          height: 80,
        }}
      >
        <div
          className="mx-auto flex items-center justify-between h-full"
          style={{ maxWidth: 1600, padding: '0 clamp(1rem, 4vw, 3rem)' }}
        >

          {/* ── Sol: Hamburger + Ana Menü Linkleri ── */}
          <div className="flex items-center gap-6 h-full">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center transition-all duration-300 hover:scale-105"
              style={{
                width: 52,
                height: 52,
                background: 'var(--color-brand)',
                color: 'var(--color-on-brand)',
                borderRadius: 'var(--radius-sm)',
              }}
              aria-label={t('ariaToggleMenu')}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="size-7" /> : <Menu className="size-7" />}
            </button>

            <nav
              className="ml-2 hidden flex-wrap items-center gap-4 xl:gap-6 lg:flex"
              aria-label={t('ariaPrimaryNavigation')}
            >
              {items.map((item, idx) => {
                const dKey = `dd-${idx}`;
                const hasChildren = Boolean(item.children?.length);
                const active = itemOrChildActive(pathname, item, locale);

                if (!hasChildren) {
                  return (
                    <Link
                      key={dKey}
                      href={item.url || '#'}
                      title={item.title}
                      className="group relative text-[12px] font-bold uppercase tracking-[0.12em] transition-colors xl:text-[13px] xl:tracking-[0.15em]"
                      style={{
                        color: active ? 'var(--color-brand)' : 'var(--color-text-primary)',
                      }}
                    >
                      {item.title}
                      <span
                        className="absolute -bottom-1 left-0 h-0.5 bg-(--color-brand) transition-all duration-300"
                        style={{ width: active ? '100%' : '0' }}
                      />
                    </Link>
                  );
                }

                return (
                  <div
                    key={dKey}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(dKey)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={item.url || '#'}
                      title={item.title}
                      className="group relative inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.12em] transition-colors xl:text-[13px] xl:tracking-[0.15em]"
                      style={{
                        color: active ? 'var(--color-brand)' : 'var(--color-text-primary)',
                      }}
                      aria-expanded={openDropdown === dKey}
                    >
                      {item.title}
                      <ChevronDown
                        className={`shrink-0 transition-transform duration-200 ${openDropdown === dKey ? 'rotate-180' : ''}`}
                      />
                      <span
                        className="absolute -bottom-1 left-0 h-0.5 bg-(--color-brand) transition-all duration-300"
                        style={{ width: active ? '100%' : '0' }}
                      />
                    </Link>
                    {openDropdown === dKey && (
                      <div
                        className="absolute left-0 top-full z-[60] pt-2"
                        onMouseEnter={() => handleDropdownEnter(dKey)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <div
                          className="min-w-[220px] py-2"
                          style={{
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            boxShadow:
                              '0 12px 40px color-mix(in srgb, var(--color-bg-dark) 14%, transparent)',
                          }}
                          role="menu"
                        >
                          {item.children!.map((ch, ci) => {
                            const subActive = isNavActive(pathname, ch.url ?? '', locale);
                            return (
                              <Link
                                key={`${dKey}-sub-${ci}`}
                                href={ch.url ?? '#'}
                                role="menuitem"
                                className="block px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors xl:text-[12px]"
                                style={{
                                  color: subActive ? 'var(--color-brand)' : 'var(--color-text-primary)',
                                  background: subActive
                                    ? 'color-mix(in srgb, var(--color-brand) 8%, transparent)'
                                    : 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                  if (!subActive) {
                                    e.currentTarget.style.background =
                                      'color-mix(in srgb, var(--color-brand) 5%, transparent)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = subActive
                                    ? 'color-mix(in srgb, var(--color-brand) 8%, transparent)'
                                    : 'transparent';
                                }}
                              >
                                {ch.title}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* ── Sağ: Bayi girişi + Logo ── */}
          <div className="flex items-center gap-4 sm:gap-8 h-full">
            <Link
              href={l('/bayi-girisi')}
              className="inline-flex shrink-0 items-center justify-center px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] transition-opacity hover:opacity-90 sm:text-[11px] sm:tracking-[0.12em]"
              style={{
                background: 'var(--color-brand)',
                color: 'var(--color-on-brand)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {t('dealerLogin')}
            </Link>

            {/* Logo — Humintech style on the right */}
            <Link
              href={l('/')}
              title="Bereket Fide"
              className="flex h-10 shrink-0 items-center border-l border-(--color-border) pl-8"
            >
              <Image
                src={logoSrc}
                alt={companyName}
                width={200}
                height={64}
                className="object-contain"
                style={{ height: 48, width: 'auto' }}
                priority
                unoptimized={needsUnoptimized}
              />
            </Link>
          </div>
        </div>



        {/* Thin accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-(--color-brand) opacity-30 group-hover:opacity-100 transition-opacity" />
      </header>

      {/* Header yüksekliği kadar boşluk (72px header + 3px altın çizgi) */}
      <div style={{ height: 75 }} />

      {/* ═══════════════════════════════════════════
          MEGA MENÜ OVERLAY
      ═══════════════════════════════════════════ */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ top: 75 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background: 'color-mix(in srgb, var(--color-bg-dark) 50%, transparent)',
            }}
            onClick={() => setMenuOpen(false)}
          />

          {/* Panel */}
          <div
            className="relative overflow-y-auto"
            style={{
              background: 'var(--color-bg-dark)',
              maxHeight: 'calc(100vh - 75px)',
              borderBottom: '3px solid var(--color-brand)',
            }}
          >
            <div
              className="mx-auto grid gap-8 py-10"
              style={{
                maxWidth: 1400,
                padding: '2.5rem clamp(1rem, 3vw, 2rem)',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              }}
            >
              {/* Kolom 1: Kurumsal */}
              <div>
                <h3
                  className="text-sm font-bold uppercase tracking-wider mb-4"
                  style={{ color: 'var(--color-brand)', letterSpacing: '0.1em' }}
                >
                  {companyName}
                </h3>
                <ul className="space-y-2">
                  {[
                    { label: t('home'),         href: l('/') },
                    { label: t('about'),        href: l('/hakkimizda') },
                    { label: t('news'),         href: l('/haberler') },
                    { label: t('blog'),         href: l('/bilgi-bankasi') },
                    { label: t('catalogs'),     href: l('/kataloglar') },
                    { label: t('career'),       href: l('/kariyer') },
                    { label: 'Referanslar',     href: l('/referanslar') },
                    { label: 'Fiyat Listesi',   href: l('/fiyat-listesi') },
                    { label: 'Ekim Takvimi',    href: l('/ekim-takvimi') },
                  ].map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm transition-colors block py-0.5"
                        style={{ color: 'var(--color-text-on-dark)' }}
                        onClick={() => setMenuOpen(false)}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand-light)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-on-dark)'; }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kolom 2: Ürünler */}
              <div>
                <h3
                  className="text-sm font-bold uppercase tracking-wider mb-4"
                  style={{ color: 'var(--color-brand)', letterSpacing: '0.1em' }}
                >
                  {t('products')}
                </h3>
                <ul className="space-y-2">
                  {/* Kategoriler */}
                  {(categories as any[]).map((c) => (
                    <li key={c.id || c.slug}>
                      <Link
                        href={l(`/urunler?category=${encodeURIComponent(c.slug || c.name || c.title)}`)}
                        className="text-sm transition-colors block py-0.5"
                        style={{ color: 'var(--color-text-on-dark)' }}
                        onClick={() => setMenuOpen(false)}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand-light)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-on-dark)'; }}
                      >
                        {c.title || c.name}
                      </Link>
                    </li>
                  ))}
                  {/* Hızlı bağlantılar */}
                  <li style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <Link
                      href={l('/urunler')}
                      className="text-xs font-semibold uppercase tracking-wider inline-block"
                      style={{ color: 'var(--color-brand)' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      {t('viewAll')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={l('/fiyat-listesi')}
                      className="text-xs font-semibold uppercase tracking-wider inline-block"
                      style={{ color: 'var(--color-brand)' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      Fiyat Listesi →
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={l('/teklif')}
                      className="text-xs font-semibold uppercase tracking-wider inline-block"
                      style={{ color: 'var(--color-brand)' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      {t('offer')} →
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Kolom 3: Faaliyetler */}
              {services.length > 0 && (
                <div>
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-4"
                    style={{ color: 'var(--color-brand)', letterSpacing: '0.1em' }}
                  >
                    {t('services')}
                  </h3>
                  <ul className="space-y-2">
                    {(services as any[]).slice(0, 8).map((s) => (
                      <li key={s.id || s.slug}>
                        <Link
                          href={l(`/hizmetler/${s.slug}`)}
                          className="text-sm transition-colors block py-0.5"
                          style={{ color: 'var(--color-text-on-dark)' }}
                          onClick={() => setMenuOpen(false)}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand-light)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-on-dark)'; }}
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Kolom 4: Haberler */}
              {news.length > 0 && (
                <div>
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-4"
                    style={{ color: 'var(--color-brand)', letterSpacing: '0.1em' }}
                  >
                    {t('news')}
                  </h3>
                  <ul className="space-y-2">
                    {(news as any[]).slice(0, 5).map((n) => (
                      <li key={n.id || n.slug}>
                        <Link
                          href={l(`/haberler/${n.slug}`)}
                          className="text-sm transition-colors block py-0.5 line-clamp-1"
                          style={{ color: 'var(--color-text-on-dark)' }}
                          onClick={() => setMenuOpen(false)}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand-light)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-on-dark)'; }}
                        >
                          {n.title}
                        </Link>
                      </li>
                    ))}
                    <li style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <Link
                        href={l('/haberler')}
                        className="text-xs font-semibold uppercase tracking-wider inline-block"
                        style={{ color: 'var(--color-brand)' }}
                        onClick={() => setMenuOpen(false)}
                      >
                        {t('viewAll')}
                      </Link>
                    </li>
                  </ul>
                </div>
              )}

              {/* Kolom 5: İletişim */}
              <div>
                <h3
                  className="text-sm font-bold uppercase tracking-wider mb-4"
                  style={{ color: 'var(--color-brand)', letterSpacing: '0.1em' }}
                >
                  {t('contact')}
                </h3>
                <ul className="space-y-2">
                  {[
                    { label: t('contact'),        href: l('/iletisim') },
                    { label: t('offer'),          href: l('/teklif') },
                    { label: t('about'),          href: l('/hakkimizda') },
                    { label: t('dealerNetwork'),  href: l('/bayi-agi') },
                    { label: t('dealerRegister'), href: l('/bayi-kayit') },
                    { label: t('dealerLogin'),    href: l('/bayi-girisi') },
                  ].map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm transition-colors block py-0.5"
                        style={{ color: 'var(--color-text-on-dark)' }}
                        onClick={() => setMenuOpen(false)}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand-light)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-on-dark)'; }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
