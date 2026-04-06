import type { MetadataRoute } from 'next';
import { AVAILABLE_LOCALES } from '@/i18n/locales';
import { siteUrlBase } from '@/seo/helpers';

function localePrefixed(paths: string[]): string[] {
  return AVAILABLE_LOCALES.flatMap((loc) => paths.map((p) => `/${loc}${p}`));
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = siteUrlBase();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          ...localePrefixed([
            '/arama',
            '/profil',
            '/login',
            '/register',
            '/bayi-girisi',
            '/bayi-kayit',
            '/bayi-dashboard',
            '/panel/siparisler',
            '/bayi/finans',
          ]),
          '/_next/',
          '/*?_rsc=',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
