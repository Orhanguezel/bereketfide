import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bereket Fide',
    short_name: 'Bereket Fide',
    description: 'Bereket Fide — kaliteli fide ve tarımsal ürünlerde güvenilir çözüm ortağı.',
    start_url: '/tr',
    display: 'standalone',
    background_color: '#141311',
    theme_color: '#b8a98a',
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
