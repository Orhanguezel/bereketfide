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
                  'group relative flex h-24 w-40 items-center justify-center overflow-hidden transition-all duration-500 md:h-28 md:w-52',
                  'rounded-xl border border-white/10 bg-white/5 shadow-inner backdrop-blur-sm',
                  'hover:scale-[1.04] hover:border-(--color-brand-light) hover:bg-white/10 hover:shadow-2xl hover:shadow-(--color-brand)/5',
                  brand.website_url && 'cursor-pointer'
                )}
              >
                {/* Logo with grayscale to color transition */}
                <div className="relative h-full w-full grayscale-[0.5] opacity-80 transition duration-500 group-hover:grayscale-0 group-hover:opacity-100">
                  <Image
                    src={logoSrc!}
                    alt={brand.title}
                    fill
                    sizes="(max-width: 768px) 160px, 208px"
                    className="object-contain p-5 md:p-6 brightness-0 invert opacity-50 group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100 transition-all duration-500"
                    unoptimized={logoSrc!.endsWith('.svg')}
                  />
                </div>
                
                {/* Subtle gold accent line on hover */}
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

