import type { MetadataRoute } from 'next';
import { siteUrlBase } from '@/seo/helpers';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = siteUrlBase();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/profil/', '/login', '/register', '/_next/', '/*?_rsc='],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
