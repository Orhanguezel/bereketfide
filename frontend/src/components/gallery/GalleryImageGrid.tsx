'use client';

import { useState } from 'react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { ProjectLightbox } from '@/components/projects/ProjectLightbox';

type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

type Props = {
  images: GalleryImage[];
};

export function GalleryImageGrid({ images }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images.length) return null;

  // First image is hero (large), rest in masonry grid
  const hero = images[0]!;
  const rest = images.slice(1);

  return (
    <>
      <style>{`
        .gig-hero{position:relative;width:100%;aspect-ratio:16/10;overflow:hidden;background:var(--color-bg-muted);cursor:pointer}
        .gig-hero img{transition:transform .4s ease}
        .gig-hero:hover img{transform:scale(1.03)}
        .gig-hero-badge{position:absolute;bottom:16px;right:16px;display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:rgba(0,0,0,.55);color:#fff;font-size:13px;font-weight:600;backdrop-filter:blur(4px)}
        .gig-masonry{columns:1;column-gap:12px;margin-top:12px}
        @media(min-width:640px){.gig-masonry{columns:2}}
        @media(min-width:1024px){.gig-masonry{columns:3}}
        .gig-item{break-inside:avoid;margin-bottom:12px;position:relative;overflow:hidden;cursor:pointer;background:var(--color-bg-muted)}
        .gig-item img{display:block;width:100%;height:auto;transition:transform .3s ease}
        .gig-item:hover img{transform:scale(1.03)}
        .gig-item-overlay{position:absolute;bottom:0;left:0;right:0;padding:10px 12px;background:linear-gradient(transparent,rgba(0,0,0,.45));opacity:0;transition:opacity .25s}
        .gig-item:hover .gig-item-overlay{opacity:1}
        .gig-expand{position:absolute;top:8px;right:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.4);color:#fff;border-radius:50%;opacity:0;transition:opacity .25s}
        .gig-item:hover .gig-expand,.gig-hero:hover .gig-expand{opacity:1}
      `}</style>

      {/* Hero image */}
      <div
        className="gig-hero"
        role="button"
        tabIndex={0}
        onClick={() => setLightboxIndex(0)}
        onKeyDown={(e) => e.key === 'Enter' && setLightboxIndex(0)}
      >
        <OptimizedImage
          src={hero.src}
          alt={hero.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1280px"
          priority
        />
        <span className="gig-expand">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 6V1h5M15 6V1h-5M1 10v5h5M15 10v5h-5" />
          </svg>
        </span>
        {images.length > 1 && (
          <span className="gig-hero-badge">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="1" width="14" height="14" rx="1" />
              <circle cx="5.5" cy="5.5" r="1.5" />
              <path d="M1 12l4-4 3 3 2.5-2.5L15 13" />
            </svg>
            1 / {images.length}
          </span>
        )}
      </div>

      {/* Masonry grid */}
      {rest.length > 0 && (
        <div className="gig-masonry">
          {rest.map((img, i) => (
            <div
              key={i}
              className="gig-item"
              role="button"
              tabIndex={0}
              onClick={() => setLightboxIndex(i + 1)}
              onKeyDown={(e) => e.key === 'Enter' && setLightboxIndex(i + 1)}
            >
              <OptimizedImage
                src={img.src}
                alt={img.alt}
                width={img.width || 600}
                height={img.height || 400}
                style={{ width: '100%', height: 'auto' }}
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              />
              <span className="gig-expand">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 6V1h5M15 6V1h-5M1 10v5h5M15 10v5h-5" />
                </svg>
              </span>
              {img.caption && (
                <div className="gig-item-overlay">
                  <span style={{ fontSize: 12, color: '#fff' }}>{img.caption}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <ProjectLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
