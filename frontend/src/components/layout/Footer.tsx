import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { showFooterNewsletter } from '@/config/public-features';
import { NewsletterForm } from '@/components/sections/NewsletterForm';
import { localizedPath } from '@/seo';
import { legalComplianceSlug, legalPageSlug } from '@/lib/navigation-fallback';

interface FooterSection {
  title?: string;
  items?: { label?: string; url?: string }[];
  [key: string]: unknown;
}

function normalizeSections(raw: Record<string, unknown>[]): FooterSection[] {
  return raw.map((s) => ({
    title: String(s.title ?? s.name ?? ''),
    items: Array.isArray(s.items)
      ? s.items.map((i: any) => ({
          label: String(i.label ?? i.title ?? ''),
          url: String(i.url ?? i.href ?? '#'),
        }))
      : [],
  }));
}

const SOCIAL_META: Record<string, { label: string; path: string }> = {
  instagram: { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
  facebook: { label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  x: { label: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  linkedin: { label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  youtube: { label: 'YouTube', path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  tiktok: { label: 'TikTok', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
};

const SOCIAL_ORDER = ['instagram', 'facebook', 'x', 'linkedin', 'youtube', 'tiktok'];

export function Footer({
  sections,
  locale,
  socials,
  companyProfile,
  logoUrl,
  logoDarkUrl,
}: {
  sections: Record<string, unknown>[];
  locale: string;
  socials?: Record<string, string>;
  companyProfile?: Record<string, string>;
  logoUrl?: string;
  logoDarkUrl?: string;
}) {
  const t = useTranslations('footer');
  const tNews = useTranslations('home.newsletter');
  const normalized = normalizeSections(sections);
  const year = new Date().getFullYear();

  const socialLinks = SOCIAL_ORDER
    .filter((key) => socials?.[key] && SOCIAL_META[key])
    .map((key) => ({
      key,
      url: socials![key],
      label: SOCIAL_META[key]!.label,
      path: SOCIAL_META[key]!.path,
    }));

  return (
    <footer className="surface-dark-border border-t bg-(--color-bg-dark) text-(--color-text-on-dark)">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <div>
              <Image
                src={logoDarkUrl || logoUrl || '/logo/bereket-logo-dark.png'}
                alt={companyProfile?.company_name || 'Bereket Fide'}
                width={200}
                height={70}
                style={{ height: '60px', width: 'auto', maxWidth: '200px' }}
                unoptimized={(logoDarkUrl || logoUrl || '').startsWith('/uploads/')}
              />
            </div>
            <p className="surface-dark-text text-sm leading-relaxed">
              {companyProfile?.about || t('description')}
            </p>
            {/* Social media icons */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-1">
                {socialLinks.map(({ key, url, label, path }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    aria-label={label}
                    className="surface-dark-text transition-colors hover:text-(--color-brand-text)"
                  >
                    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic sections */}
          {normalized.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="surface-dark-text text-sm font-semibold uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items?.map((item) => (
                  <li key={item.url}>
                    <Link
                      href={item.url!}
                      className="surface-dark-link inline-flex min-h-9 items-center py-1 text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {showFooterNewsletter ? (
          <div className="surface-dark-border mt-12 border-t pt-10">
            <div className="mx-auto max-w-lg text-center lg:text-left">
              <h3 className="surface-dark-text text-base font-semibold tracking-wide">
                {tNews('title')}
              </h3>
              <p className="surface-dark-text mt-2 text-sm opacity-75">{tNews('subtitle')}</p>
              <NewsletterForm locale={locale} />
            </div>
          </div>
        ) : null}

        <div className="surface-dark-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="surface-dark-text text-xs">
            &copy; {year} {companyProfile?.company_name || 'Bereket Fide'}. {t('rights')}
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:justify-end">
            <Link
              href={localizedPath(locale, `/legal/${legalPageSlug(locale, 'privacy')}`)}
              className="surface-dark-link inline-flex min-h-9 items-center py-1 text-xs"
            >
              {t('privacy')}
            </Link>
            <Link
              href={localizedPath(locale, `/legal/${legalPageSlug(locale, 'terms')}`)}
              className="surface-dark-link inline-flex min-h-9 items-center py-1 text-xs"
            >
              {t('terms')}
            </Link>
            <Link
              href={localizedPath(locale, `/legal/${legalPageSlug(locale, 'quality')}`)}
              className="surface-dark-link inline-flex min-h-9 items-center py-1 text-xs"
            >
              {t('qualityPolicy')}
            </Link>
            <Link
              href={localizedPath(locale, `/legal/${legalPageSlug(locale, 'service')}`)}
              className="surface-dark-link inline-flex min-h-9 items-center py-1 text-xs"
            >
              {t('servicePolicy')}
            </Link>
            <Link
              href={localizedPath(locale, `/legal/${legalComplianceSlug(locale, 'dataNotice')}`)}
              className="surface-dark-link inline-flex min-h-9 items-center py-1 text-xs"
            >
              {t('dataProtectionNotice')}
            </Link>
            <Link
              href={localizedPath(locale, `/legal/${legalComplianceSlug(locale, 'cookies')}`)}
              className="surface-dark-link inline-flex min-h-9 items-center py-1 text-xs"
            >
              {t('cookiePolicy')}
            </Link>
            <span className="surface-dark-text surface-dark-border ml-2 inline-flex min-h-9 items-center border-l py-1 pl-4 text-xs sm:ml-4 sm:pl-6">
              Design by{' '}
              <a
                href="https://guezelwebdesign.com"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="ml-1 font-medium tracking-wide text-(--color-brand-light) transition-colors hover:text-(--section-bg-white) hover:underline"
              >
                GWD
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
