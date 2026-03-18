import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: { removeConsole: process.env.NODE_ENV === 'production' },

  // Silence "multiple lockfiles" workspace root warning
  turbopack: {
    root: __dirname,
  },

  // ✅ Image optimization config
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8086',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8086',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ✅ kaldırıyoruz: /admin/dashboard -> /admin/dashboard/default
  async redirects() {
    return [
      // İstersen eski linkleri yakalamak için tersine redirect bırakabilirsin:
      // { source: '/admin/dashboard/default', destination: '/admin/dashboard', permanent: false },
    ];
  },

  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    const apiBase = (
      process.env.PANEL_API_URL ||
      process.env.NEXT_PUBLIC_PANEL_API_URL ||
      'http://127.0.0.1:8086'
    ).replace(/\/+$/, '');

    const frontendUrl = (
      process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3030'
    ).replace(/\/+$/, '');

    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      `img-src 'self' blob: data: https://res.cloudinary.com ${frontendUrl} ${apiBase}`,
      `connect-src 'self' ${apiBase} ${frontendUrl} https://cdn.jsdelivr.net https://api.cloudinary.com`,
      "font-src 'self' https://fonts.gstatic.com data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
      },
    ];
  },

  async rewrites() {
    const origin =
      process.env.PANEL_API_URL || process.env.NEXT_PUBLIC_PANEL_API_URL || 'http://127.0.0.1:8086';

    const base = String(origin).replace(/\/+$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${base}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${base}/uploads/:path*`,
      },
      {
        source: '/storage/:path*',
        destination: `${base}/api/storage/:path*`,
      },
    ];
  },
};

export default nextConfig;
