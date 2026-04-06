'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandItem {
  id?: number | string;
  title: string;
  logo_url?: string | null;
  image_url?: string | null;
  featured_image?: string | null;
  website_url?: string | null;
}

export function BrandCarousel({ brands }: { brands: BrandItem[] }) {
  const items = brands.filter((brand) => {
    const logoSrc = brand.logo_url || brand.image_url || brand.featured_image;
    return Boolean(logoSrc);
  });

  if (!items.length) return null;

  // We double the items for a continuous scroll loop
  const doubled = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden">
      <style>{`
        @keyframes brand-loop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .brand-loop-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: brand-loop 40s linear infinite;
        }
        .brand-loop-track:hover {
          animation-play-state: paused;
        }
        @media (max-width: 768px) {
          .brand-loop-track {
            animation-duration: 30s;
          }
        }
      `}</style>

      <div
        className="relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div className="brand-loop-track flex gap-8 py-4 md:gap-14 md:py-6">
          {doubled.map((brand, i) => {
            const logoSrc = brand.logo_url || brand.image_url || brand.featured_image;
            const key = `${brand.id ?? brand.title}-${i}`;
            
            const TileContent = (
              <div
                className={cn(
                  'group relative flex h-28 w-44 items-center justify-center overflow-hidden transition-all duration-500 md:h-32 md:w-52',
                  'rounded-lg border border-white/20 bg-white shadow-md',
                  'hover:scale-[1.04] hover:border-(--color-brand) hover:shadow-xl',
                  brand.website_url && 'cursor-pointer'
                )}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={logoSrc!}
                    alt={brand.title}
                    fill
                    sizes="(max-width: 768px) 176px, 208px"
                    className="object-contain p-4 md:p-5 opacity-75 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                    unoptimized
                  />
                </div>

                {/* Gold accent line on hover */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] w-0 bg-linear-to-r from-transparent via-(--color-brand) to-transparent transition-all duration-700 group-hover:w-full" />
              </div>
            );

            return (
              <div key={key} className="flex shrink-0 items-center justify-center">
                {brand.website_url ? (
                  <a
                    href={brand.website_url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    aria-label={brand.title}
                    className="block"
                  >
                    {TileContent}
                  </a>
                ) : (
                  TileContent
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

