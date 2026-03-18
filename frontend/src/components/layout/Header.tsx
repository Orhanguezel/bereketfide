'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { localizedPath } from '@/seo';

const ThemeToggle = dynamic(
  () => import('@/components/theme/ThemeToggle').then((m) => m.ThemeToggle),
  { ssr: false, loading: () => <span className="inline-block h-7 w-7" /> },
);
const LanguageSwitcher = dynamic<{ locale: string; activeLocales?: { code: string; label: string }[] }>(
  () => import('./LanguageSwitcher').then((m) => m.LanguageSwitcher),
  { ssr: false, loading: () => <span className="inline-block h-7 w-10" /> },
);

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const items = normalizeItems(menuItems);

  const companyName = companyProfile?.shortName || companyProfile?.company_name || 'Bereket Fide';
  const companySlogan = companyProfile?.headline || t('tagline');
  const l = (path: string) => localizedPath(locale, path);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

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

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

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
      {/* ═══════════════════════════════════════════
          MAIN HEADER — Sticky, açık/beyaz ton (Humintech ref)
      ═══════════════════════════════════════════ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: 'var(--color-bg-secondary)',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : '0 1px 0 var(--color-border)',
        }}
      >
        <div
          className="mx-auto flex items-center justify-between"
          style={{ maxWidth: 1400, padding: '0 clamp(1rem, 3vw, 2rem)', height: 72 }}
        >

          {/* ── Sol: Hamburger + Ana Menü Linkleri ── */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center rounded-sm transition-colors"
              style={{
                width: 48, height: 48,
                background: 'var(--color-accent)',
                color: 'var(--color-on-brand)',
              }}
              aria-label="Menü"
            >
              {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>

            {/* Desktop menü linkleri */}
            <nav className="hidden lg:flex items-center gap-1 ml-3">
              {items.slice(0, 6).map((item) => (
                <Link
                  key={item.url}
                  href={item.url || '#'}
                  className="px-3 py-2 text-[13px] font-semibold uppercase tracking-wider transition-colors whitespace-nowrap"
                  style={{
                    color: 'var(--color-text-primary)',
                    letterSpacing: '0.06em',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; }}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Sağ: Slogan + Logo + İkonlar ── */}
          <div className="flex items-center gap-5">
            {/* Slogan — sadece desktop */}
            <div className="hidden xl:flex flex-col items-end">
              <span
                className="text-[13px] font-semibold uppercase tracking-wider"
                style={{ color: 'var(--color-brand)', letterSpacing: '0.08em' }}
              >
                {companySlogan}
              </span>
            </div>

            {/* Logo */}
            <Link
              href={l('/')}
              className="flex items-center shrink-0"
            >
              <Image
                src={logoSrc}
                alt={companyName}
                width={200}
                height={64}
                className="object-contain"
                style={{ height: 56, width: 'auto', maxWidth: 220 }}
                priority
                unoptimized={needsUnoptimized}
              />
            </Link>

            {/* İkon bar — sağ kenar */}
            <div className="flex items-center gap-1">
              {/* Arama */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center justify-center rounded-full transition-colors"
                style={{ width: 40, height: 40, color: 'var(--color-text-muted)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                aria-label="Ara"
              >
                <Search className="size-5" />
              </button>

              {/* Dil */}
              <LanguageSwitcher locale={locale} activeLocales={activeLocales} />

              {/* Tema */}
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* ── Arama çubuğu (açılır) ── */}
        {searchOpen && (
          <div
            className="border-t"
            style={{ background: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}
          >
            <div className="mx-auto flex items-center gap-3" style={{ maxWidth: 1400, padding: '10px clamp(1rem, 3vw, 2rem)' }}>
              <Search className="size-5 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('searchPlaceholder') || 'Ürün, hizmet veya sayfa ara...'}
                className="flex-1 bg-transparent border-none outline-none text-sm"
                style={{ color: 'var(--color-text-primary)', caretColor: 'var(--color-brand)' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = (e.target as HTMLInputElement).value.trim();
                    if (q) window.location.href = l(`/arama?q=${encodeURIComponent(q)}`);
                  }
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                style={{ color: 'var(--color-text-muted)' }}
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* Altın alt çizgi */}
        <div style={{ height: 3, background: 'var(--color-brand)' }} />
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
            style={{ background: 'rgba(0,0,0,0.5)' }}
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
              {/* Kolom 1: Ana Sayfalar */}
              <div>
                <h3
                  className="text-sm font-bold uppercase tracking-wider mb-4"
                  style={{ color: 'var(--color-brand)', letterSpacing: '0.1em' }}
                >
                  {companyName}
                </h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.url}>
                      <Link
                        href={item.url || '#'}
                        className="text-sm transition-colors block py-0.5"
                        style={{ color: 'var(--color-text-on-dark)' }}
                        onClick={() => setMenuOpen(false)}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand-light)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-on-dark)'; }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kolom 2: Ürün Kategorileri */}
              {categories.length > 0 && (
                <div>
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-4"
                    style={{ color: 'var(--color-brand)', letterSpacing: '0.1em' }}
                  >
                    {t('products') || 'Ürünler'}
                  </h3>
                  <ul className="space-y-2">
                    {(categories as any[]).map((c) => (
                      <li key={c.id || c.slug}>
                        <Link
                          href={l(`/urunler?category=${c.slug}`)}
                          className="text-sm transition-colors block py-0.5"
                          style={{ color: 'var(--color-text-on-dark)' }}
                          onClick={() => setMenuOpen(false)}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand-light)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-on-dark)'; }}
                        >
                          {c.title}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href={l('/urunler')}
                        className="text-xs font-semibold uppercase tracking-wider mt-2 inline-block"
                        style={{ color: 'var(--color-brand)' }}
                        onClick={() => setMenuOpen(false)}
                      >
                        {t('viewAll') || 'Tümünü Gör →'}
                      </Link>
                    </li>
                  </ul>
                </div>
              )}

              {/* Kolom 3: Hizmetler */}
              {services.length > 0 && (
                <div>
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-4"
                    style={{ color: 'var(--color-brand)', letterSpacing: '0.1em' }}
                  >
                    {t('services') || 'Hizmetler'}
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
                    {t('blog') || 'Haberler'}
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
                    <li>
                      <Link
                        href={l('/haberler')}
                        className="text-xs font-semibold uppercase tracking-wider mt-2 inline-block"
                        style={{ color: 'var(--color-brand)' }}
                        onClick={() => setMenuOpen(false)}
                      >
                        {t('viewAll') || 'Tümünü Gör →'}
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
                  {t('contact') || 'İletişim'}
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href={l('/iletisim')}
                      className="text-sm transition-colors block py-0.5"
                      style={{ color: 'var(--color-text-on-dark)' }}
                      onClick={() => setMenuOpen(false)}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand-light)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-on-dark)'; }}
                    >
                      {t('contact') || 'İletişim'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={l('/teklif')}
                      className="text-sm transition-colors block py-0.5"
                      style={{ color: 'var(--color-text-on-dark)' }}
                      onClick={() => setMenuOpen(false)}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand-light)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-on-dark)'; }}
                    >
                      {t('offer') || 'Teklif Al'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={l('/hakkimizda')}
                      className="text-sm transition-colors block py-0.5"
                      style={{ color: 'var(--color-text-on-dark)' }}
                      onClick={() => setMenuOpen(false)}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand-light)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-on-dark)'; }}
                    >
                      {t('about') || 'Hakkımızda'}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
