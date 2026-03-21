import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 2592000,
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'bereketfide.com.tr' },
      { protocol: 'https', hostname: 'www.bereketfide.com.tr' },
      { protocol: 'https', hostname: 'api.bereketfide.com.tr' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
      ...(process.env.NODE_ENV === 'development'
        ? [
            { protocol: 'http' as const, hostname: 'localhost', port: '8096' },
            { protocol: 'http' as const, hostname: '127.0.0.1', port: '8096' },
          ]
        : []),
    ],
  },

  async rewrites() {
    const apiBase = process.env.INTERNAL_API_URL?.replace(/\/api\/?$/, '') || 'http://127.0.0.1:8096';
    return [
      {
        source: '/uploads/:path*',
        destination: `${apiBase}/uploads/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/:locale/projeler',
        destination: '/:locale/urunler',
        permanent: true,
      },
      {
        source: '/:locale/projeler/:slug',
        destination: '/:locale/urunler/:slug',
        permanent: true,
      },
      {
        source: '/',
        destination: '/tr',
        permanent: true,
      },
    ];
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'sonner', '@tanstack/react-query'],
  },

  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          ...(isDev ? [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }] : []),
        ],
      },
      ...(!isDev
        ? [
            {
              source: '/_next/static/(.*)',
              headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
              ],
            },
          ]
        : []),
    ];
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  compress: true,
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
