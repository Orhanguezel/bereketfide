'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { 
  Search, Globe, User, Share2, ClipboardList, X, 
  Instagram, Facebook, Linkedin, Youtube, Twitter, Phone, Mail, MapPin 
} from 'lucide-react';

interface FloatingWidgetsProps {
  activeLocales?: { code: string; label: string }[];
  socials?: Record<string, string>;
  contactInfo?: {
    company_name?: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
  };
}

export function FloatingWidgets({ activeLocales = [], socials = {}, contactInfo = {} }: FloatingWidgetsProps) {
  const [activeTab, setActiveTab] = useState<'none' | 'search' | 'lang' | 'info' | 'social'>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when escaping
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveTab('none');
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Focus search input when tab opens
  useEffect(() => {
    if (activeTab === 'search') {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [activeTab]);

  const toggleTab = (tab: typeof activeTab) => {
    setActiveTab(prev => prev === tab ? 'none' : tab);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/arama?q=${encodeURIComponent(searchQuery.trim())}`;
      setActiveTab('none');
    }
  };

  const socialIcons = [
    { key: 'instagram', icon: Instagram, url: socials.instagram },
    { key: 'facebook', icon: Facebook, url: socials.facebook },
    { key: 'linkedin', icon: Linkedin, url: socials.linkedin },
    { key: 'youtube', icon: Youtube, url: socials.youtube },
    { key: 'x', icon: Twitter, url: socials.x },
  ].filter(s => s.url);

  return (
    <>
      {/* ── SEARCH OVERLAY (Moved outside transformed parent) ── */}
      {activeTab === 'search' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/95 backdrop-blur-3xl pointer-events-auto animate-in fade-in duration-500">
          <button
            type="button"
            onClick={() => setActiveTab('none')}
            className="absolute right-10 top-10 text-(--section-bg-white)/50 transition-colors hover:text-(--section-bg-white)"
            aria-label={tCommon('closeMenu')}
          >
            <X size={48} strokeWidth={1} />
          </button>
          
          <div className="w-full max-w-4xl px-10">
            <form onSubmit={handleSearch} className="relative group">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full border-b-2 border-(--color-glass-border) bg-transparent pb-4 pr-16 text-3xl font-medium tracking-tight text-(--section-bg-white) outline-none transition-colors focus:border-(--color-glass-hover) lg:text-5xl"
              />
              <button
                type="submit"
                className="absolute bottom-6 right-0 text-(--section-bg-white)/40 transition-colors hover:text-(--section-bg-white)"
              >
                <Search size={32} />
              </button>
            </form>
            <div className="mt-12 flex flex-wrap gap-8 text-sm font-bold uppercase tracking-widest text-(--section-bg-white)/40">
              <span style={{ color: 'var(--color-brand-light)' }}>{t('trendingSearches')}</span>
              <button
                type="button"
                onClick={() => setSearchQuery(t('trendSeedling'))}
                className="transition-colors hover:text-(--section-bg-white)"
              >
                {t('trendSeedling')}
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery(t('trendGrafted'))}
                className="transition-colors hover:text-(--section-bg-white)"
              >
                {t('trendGrafted')}
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery(t('trendTomato'))}
                className="transition-colors hover:text-(--section-bg-white)"
              >
                {t('trendTomato')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-9000 flex flex-col pointer-events-none">
        
        {/* ── FLOATING BAR ── */}
        <div
          className="relative mr-0 flex w-[60px] flex-col shadow-2xl pointer-events-auto"
          style={{ background: 'var(--color-bg-dark)' }}
        >
          
          {/* Search Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleTab('search')}
              aria-label={t('ariaSearch')}
              className={`flex h-[60px] w-[60px] items-center justify-center transition-colors ${
                activeTab === 'search'
                  ? 'text-(--color-on-brand)'
                  : 'text-(--section-bg-white)/70 hover:bg-(--color-glass-hover)'
              }`}
              style={activeTab === 'search' ? { background: 'var(--color-brand)' } : undefined}
            >
              <Search size={22} />
            </button>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            {activeTab === 'lang' && (
              <div
                className="absolute right-full top-0 flex h-[60px] animate-in slide-in-from-right-10 duration-300 shadow-xl"
                style={{ background: 'var(--color-bg-dark)' }}
              >
                {activeLocales.map((loc) => (
                  <Link
                    key={loc.code}
                    href={pathname.replace(`/${locale}`, `/${loc.code}`)}
                    onClick={() => setActiveTab('none')}
                    className={`flex min-w-[60px] items-center justify-center border-r border-(--color-border-on-dark) px-4 text-xs font-bold uppercase transition-colors hover:bg-(--color-glass-bg-strong) ${
                      locale === loc.code ? '' : 'text-(--section-bg-white)/60'
                    }`}
                    style={locale === loc.code ? { color: 'var(--color-brand-light)' } : undefined}
                  >
                    {loc.code}
                  </Link>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => toggleTab('lang')}
              aria-label={t('ariaLanguage')}
              className={`flex h-[60px] w-[60px] items-center justify-center border-t border-(--color-border-on-dark) text-xs font-bold uppercase transition-colors ${
                activeTab === 'lang'
                  ? 'text-(--color-on-brand)'
                  : 'text-(--section-bg-white)/70 hover:bg-(--color-glass-hover)'
              }`}
              style={activeTab === 'lang' ? { background: 'var(--color-brand)' } : undefined}
            >
              {locale}
            </button>
          </div>

          {/* Info Button */}
          <div className="relative">
            {activeTab === 'info' && (
              <div className="absolute right-full top-0 w-[300px] bg-(--color-bg-secondary) p-8 shadow-2xl animate-in slide-in-from-right-10 duration-300">
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-2 text-lg font-bold text-(--color-text-primary)">
                      {contactInfo.company_name || 'Bereket Fide'}
                    </h4>
                    <div className="flex gap-3 text-sm leading-relaxed text-(--color-text-muted)">
                      <MapPin size={18} className="shrink-0" style={{ color: 'var(--color-brand)' }} />
                      <span>{contactInfo.address}<br />{contactInfo.city}</span>
                    </div>
                  </div>
                  <div className="space-y-3 border-t border-(--color-border) pt-4">
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="flex items-center gap-3 font-medium text-(--color-text-secondary) transition-colors hover:text-(--color-brand)"
                    >
                      <Phone size={18} />
                      <span>{contactInfo.phone}</span>
                    </a>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="flex items-center gap-3 font-medium text-(--color-text-secondary) transition-colors hover:text-(--color-brand)"
                    >
                      <Mail size={18} />
                      <span>{contactInfo.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => toggleTab('info')}
              aria-label={t('ariaContactInfo')}
              className={`flex h-[60px] w-[60px] items-center justify-center border-t border-(--color-border-on-dark) transition-colors ${
                activeTab === 'info'
                  ? 'text-(--color-on-brand)'
                  : 'text-(--section-bg-white)/70 hover:bg-(--color-glass-hover)'
              }`}
              style={activeTab === 'info' ? { background: 'var(--color-brand)' } : undefined}
            >
              <User size={22} />
            </button>
          </div>

          {/* Social Share */}
          <div className="relative">
            {activeTab === 'social' && (
              <div
                className="absolute right-full top-0 flex h-[60px] animate-in slide-in-from-right-10 duration-300 shadow-xl"
                style={{ background: 'var(--color-bg-dark)' }}
              >
                {socialIcons.map((s) => (
                  <a 
                    key={s.key} 
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-[60px] items-center justify-center border-r border-(--color-border-on-dark) text-(--section-bg-white)/50 transition-colors hover:bg-(--color-glass-bg-strong) hover:text-(--section-bg-white)"
                  >
                    <s.icon size={20} />
                  </a>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => toggleTab('social')}
              aria-label={t('ariaSocialLinks')}
              className={`flex h-[60px] w-[60px] items-center justify-center border-t border-(--color-border-on-dark) transition-colors ${
                activeTab === 'social'
                  ? 'text-(--color-on-brand)'
                  : 'text-(--section-bg-white)/70 hover:bg-(--color-glass-hover)'
              }`}
              style={activeTab === 'social' ? { background: 'var(--color-brand)' } : undefined}
            >
              <Share2 size={22} />
            </button>
          </div>

          {/* Teklif Al Widget */}
          <Link
            href={`/${locale}/teklif`}
            className="group flex h-[80px] w-[60px] flex-col items-center justify-center overflow-hidden border-t border-(--color-border-on-dark) text-(--color-on-brand) transition-all hover:opacity-95"
            style={{ background: 'var(--color-brand-dark)' }}
          >
            <ClipboardList size={22} className="group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-tighter text-center leading-none">{t('offerWidgetLine1')}<br/>{t('offerWidgetLine2')}</span>
          </Link>

        </div>
      </div>

      {/* Background Dim for Language/Social/Info if needed? 
          Actually usually these side widgets don't dim the whole page unless it's the search modal.
      */}
      {activeTab !== 'none' && activeTab !== 'search' && (
        <div className="fixed inset-0 z-[90]" onClick={() => setActiveTab('none')} />
      )}
    </>
  );
}
