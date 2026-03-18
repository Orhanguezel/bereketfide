import 'server-only';

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Toaster } from 'sonner';

import { getLocaleSettings } from '@/i18n/locale-settings';
import { fetchSetting, fetchMenuItems, fetchFooterSections, fetchActiveLocales, fetchActiveLocaleConfigs, fetchCategories, fetchServices, fetchNews } from '@/i18n/server';
import { getTranslations } from 'next-intl/server';
import { siteUrlBase, asStr, asObj, readSettingValue } from '@/seo';
import { ensureFooterSections, ensureMenuItems } from '@/lib/navigation-fallback';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClientShell } from '@/components/layout/ClientShell';
import { THEME_INTENT, THEME_TEMPLATE } from '@/theme/templates';
import { ThemeBootScript } from '@/scripts/theme-boot';


function pickFirstString(...values: unknown[]): string {
  for (const value of values) {
    const normalized = asStr(value).trim();
    if (normalized) return normalized;
  }

  return '';
}

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz'],
  variable: '--font-body',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-heading',
  display: 'swap',
});

export async function generateStaticParams() {
  const { activeLocales } = await getLocaleSettings();
  return activeLocales.map((l) => ({ locale: l.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = siteUrlBase();

  const [seo, siteLogo, legacyLogo, siteOgDefaultImage] = await Promise.all([
    fetchSetting('seo', locale),
    fetchSetting('site_logo', locale),
    fetchSetting('logo', locale),
    fetchSetting('site_og_default_image', locale),
  ]);

  const val = readSettingValue(seo);
  const logoValue = { ...readSettingValue(legacyLogo), ...readSettingValue(siteLogo) };
  const ogValue = readSettingValue(siteOgDefaultImage);

  const title = asStr(val.site_title) || 'Bereket Fide | Kurumsal İnşaat ve Mimarlık';
  const description =
    asStr(val.site_description) ||
    'Bereket Fide — konut, ticari ve karma kullanım projelerinde güvenilir çözüm ortağı.';
  const faviconUrl = pickFirstString(
    logoValue.favicon_url,
    logoValue.favicon,
    logoValue.icon_url,
  );
  const appleTouchIconUrl = pickFirstString(
    logoValue.apple_touch_icon_url,
    logoValue.apple_touch_icon,
  );
  const ogImage = pickFirstString(
    val.og_image,
    ogValue.url,
    ogValue.image_url,
  );

  const siteName = asStr(val.site_title).split('|')[0]?.trim() || 'Bereket Fide';

  return {
    title: { default: title, template: `%s | ${siteName}` },
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: '/',
      languages: Object.fromEntries(
        (await fetchActiveLocales()).map((loc: string) => [loc, `/${loc}`])
      ),
    },
    icons: {
      ...(faviconUrl
        ? {
            icon: [
              { url: faviconUrl, sizes: '16x16' },
              { url: faviconUrl, sizes: '32x32' },
            ],
          }
        : {}),
      ...(appleTouchIconUrl ? { apple: appleTouchIconUrl } : {}),
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName,
      locale,
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const navT = await getTranslations({ locale, namespace: 'nav' });
  const footerT = await getTranslations({ locale, namespace: 'footer' });

  const [
    menuItems,
    footerSections,
    siteLogoSetting,
    legacyLogoSetting,
    socialsSetting,
    activeLocales,
    companyProfileSetting,
    categories,
    services,
    news,
  ] = await Promise.all([
    fetchMenuItems(locale),
    fetchFooterSections(locale),
    fetchSetting('site_logo', locale),
    fetchSetting('logo', locale),
    fetchSetting('socials', locale),
    fetchActiveLocaleConfigs(),
    fetchSetting('company_profile', locale),
    fetchCategories(locale),
    fetchServices(locale),
    fetchNews(locale),
  ]);

  const logoValue = { ...readSettingValue(legacyLogoSetting), ...readSettingValue(siteLogoSetting) };
  const logoUrl = pickFirstString(logoValue.logo_url, logoValue.url);
  const logoDarkUrl = pickFirstString(logoValue.logo_dark_url, logoValue.logo_url, logoValue.url);
  const stableMenuItems = ensureMenuItems(menuItems, locale, navT);
  const stableFooterSections = ensureFooterSections(footerSections, locale, navT, footerT);
  const socials = readSettingValue(socialsSetting) as Record<string, string>;
  const companyProfile = readSettingValue(companyProfileSetting) as Record<string, string>;

  return (
    <html
      lang={locale}
      className={`${dmSans.variable} ${syne.variable}`}
      data-theme-template={THEME_TEMPLATE}
      data-theme-intent={THEME_INTENT}
      data-theme-mode="light"
      data-theme-preset="default"
      suppressHydrationWarning
    >
      <head>
        <ThemeBootScript />
      </head>
      <body
        className="min-h-screen bg-(--color-bg) text-(--color-text-primary) antialiased"
        data-theme-mode="light"
        suppressHydrationWarning
      >
        {/* SSR Splash Screen: inline overlay that hides content until client takes over */}
        <div
          id="bereket-splash-ssr"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99998,
            background: '#0f0e0d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.4s ease',
          }}
          aria-hidden="true"
          suppressHydrationWarning
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(sessionStorage.getItem('bereket_splash_seen')){var el=document.getElementById('bereket-splash-ssr');if(el)el.style.display='none'}}catch(e){}})()`
          }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header 
            menuItems={stableMenuItems} 
            logoUrl={logoUrl}
            logoDarkUrl={logoDarkUrl}
            locale={locale} 
            activeLocales={activeLocales} 
            companyProfile={companyProfile}
            categories={categories as any[]}
            services={services as any[]}
            news={news as any[]}
          />
          <main className="flex-1">{children}</main>
          <Footer sections={stableFooterSections} locale={locale} socials={socials} companyProfile={companyProfile} logoUrl={logoUrl} logoDarkUrl={logoDarkUrl} />
          <ClientShell 
            companyName={companyProfile?.company_name} 
            tagline={companyProfile?.slogan} 
            whatsappNumber={socials?.whatsapp}
          />
          <Toaster position="bottom-right" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
