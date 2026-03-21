'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { localizedPath } from '@/seo';

const ThemeToggle = dynamic(
  () => import('@/components/theme/ThemeToggle').then((m) => m.ThemeToggle),
  { ssr: false, loading: () => <span className="inline-block h-7 w-7" /> },
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
  const [scrolled, setScrolled] = useState(false);
  const items = normalizeItems(menuItems);

  const companyName = companyProfile?.shortName || companyProfile?.company_name || 'Bereket Fide';
  const companySlogan = companyProfile?.headline || t('tagline');
  const l = (path: string) => localizedPath(locale, path);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
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
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
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
                color: '#ffffff',
                borderRadius: 'var(--radius-sm)',
              }}
              aria-label="Menü"
            >
              {menuOpen ? <X className="size-7" /> : <Menu className="size-7" />}
            </button>

            {/* Desktop menü linkleri (Humintech style) */}
            <nav className="hidden lg:flex items-center gap-8 ml-4">
                {items.filter((item) => item.url && !item.url.includes('/teklif')).slice(0, 8).map((item) => {
                  const isActive = item.url === l('/') ? pathname === item.url : pathname.startsWith(item.url || '');
                  return (
                    <Link
                      key={item.url}
                      href={item.url || '#'}
                      title={item.title}
                      className="group relative text-[13px] font-bold uppercase tracking-[0.15em] transition-colors"
                      style={{
                        color: isActive ? 'var(--color-brand)' : '#1a1a1a',
                      }}
                    >
                      {item.title}
                      <span 
                        className="absolute -bottom-1 left-0 h-0.5 bg-(--color-brand) transition-all duration-300" 
                        style={{ width: isActive ? '100%' : '0' }}
                      />
                    </Link>
                  );
                })}
            </nav>
          </div>

          {/* ── Sağ: Logo + İkonlar ── */}
          <div className="flex items-center gap-8 h-full">

            {/* Logo — Humintech style on the right */}
            <Link
              href={l('/')}
              title="Bereket Fide"
              className="flex items-center shrink-0 border-l border-gray-100 pl-8 h-10"
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
                          href={l(`/urunler?category=${encodeURIComponent(c.name || c.title)}`)}
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
                    <li>
                      <Link
                        href={l('/urunler')}
                        className="text-xs font-semibold uppercase tracking-wider mt-2 inline-block"
                        style={{ color: 'var(--color-brand)' }}
                        onClick={() => setMenuOpen(false)}
                        aria-label={t('viewAllProducts') || 'Tüm ürünleri görüntüle'}
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
                    {t('news') || 'Haberler'}
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
                        aria-label={t('viewAllNews') || 'Tüm haberleri görüntüle'}
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
