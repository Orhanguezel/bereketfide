import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import { SITE_URL } from '@/lib/utils';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL;
const metadataBase = new URL(siteUrl);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: 'Bereket Fide | Kaliteli ve Güvenilir Fide Üretimi',
    template: '%s | Bereket Fide',
  },
  description: `Sebze, meyve ve süs bitkisi fidelerinde kaliteli, sağlıklı üretim. Bereket Fide — ${metadataBase.host}`,
  openGraph: {
    type: 'website',
    siteName: 'Bereket Fide',
    url: metadataBase,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
