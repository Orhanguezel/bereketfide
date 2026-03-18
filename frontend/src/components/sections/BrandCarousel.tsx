'use client';

import Image from 'next/image';

interface BrandItem {
  id?: number | string;
  title: string;
  logo_url?: string | null;
  image_url?: string | null;
  website_url?: string | null;
}

export function BrandCarousel({ brands }: { brands: BrandItem[] }) {
  if (!brands.length) return null;

  // Duplicate the list to create seamless infinite scroll
  const doubled = [...brands, ...brands];

  return (
    <>
      <style>{`
        @keyframes brand-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .brand-track {
          animation: brand-scroll 30s linear infinite;
        }
        .brand-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div
        style={{
          overflow: 'hidden',
          width: '100%',
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div
          className="brand-track"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 80,
            width: 'max-content',
          }}
        >
          {doubled.map((brand, i) => {
            const logoSrc = brand.logo_url || brand.image_url;
            const key = `${brand.id ?? brand.title}-${i}`;

            return (
              <div
                key={key}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 64,
                  opacity: 0.9,
                  transition: 'all 0.3s ease',
                }}
                className="hover:scale-110 hover:opacity-100"
              >
                {logoSrc ? (
                  <Image
                    src={logoSrc}
                    alt={brand.title}
                    width={180}
                    height={64}
                    style={{ height: 60, width: 'auto', objectFit: 'contain' }}
                    unoptimized={logoSrc.endsWith('.svg')}
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 22,
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {brand.title}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
