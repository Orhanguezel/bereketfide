import type { MetadataRoute } from 'next';
import { BEREKET_PALETTE_HEX as C } from '@/lib/bereketfide-palette-hex';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bereket Fide',
    short_name: 'Bereket Fide',
    description:
      'Bereket Fide — sebze, meyve ve süs bitkisi fidelerinde kaliteli ve sağlıklı üretim çözüm ortağınız.',
    start_url: '/tr',
    display: 'standalone',
    background_color: C.surfaceBaseDark,
    theme_color: C.gold550,
    icons: [
      {
        src: '/icon',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
