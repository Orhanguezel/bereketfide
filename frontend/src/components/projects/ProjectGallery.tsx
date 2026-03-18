'use client';

import { useCallback, useRef, useState } from 'react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { ProjectLightbox } from './ProjectLightbox';

export type GalleryImage = {
  src: string;
  alt: string;
};

type Props = {
  images: GalleryImage[];
  priority?: boolean;
};

export function ProjectGallery({ images, priority }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  /* Clicking a thumbnail updates the hero image + can open lightbox */
  const setHero = useCallback((idx: number) => {
    const hero = heroRef.current;
    if (!hero) return;
    const img = hero.querySelector<HTMLImageElement>('img');
    if (img && images[idx]) {
      img.src = images[idx].src;
      img.alt = images[idx].alt;
    }
    hero.setAttribute('data-idx', String(idx));
  }, [images]);

  const openLightbox = useCallback((idx: number) => {
    setLightboxIndex(idx);
  }, []);

  const openHeroLightbox = useCallback(() => {
    const hero = heroRef.current;
    const idx = hero ? parseInt(hero.getAttribute('data-idx') || '0', 10) : 0;
    setLightboxIndex(idx);
  }, []);

  if (!images.length) return null;

  const firstImage = images[0]!;
  const visibleThumbs = images.slice(0, 6);
  const remainingCount = images.length - 6;

  return (
    <>
      <style>{`
        .pg-hero{position:relative;width:100%;overflow:hidden;background:var(--color-bg-muted);cursor:pointer;aspect-ratio:16/10}
        .pg-hero img{transition:transform .3s ease;width:100%;height:100%;object-fit:cover}
        .pg-hero:hover img{transform:scale(1.02)}
        .pg-hero-zoom{position:absolute;bottom:12px;right:16px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);border-radius:50%;color:#fff;opacity:.7;transition:opacity .2s;pointer-events:none}
        .pg-hero:hover .pg-hero-zoom{opacity:1}
        .pg-thumbs{display:flex;gap:8px;margin-top:10px;overflow-x:auto}
        .pg-thumb{position:relative;width:120px;height:80px;flex-shrink:0;overflow:hidden;background:var(--color-bg-muted);cursor:pointer;border:2px solid transparent;transition:border-color .15s}
        .pg-thumb:hover{border-color:var(--color-brand)}
        .pg-thumb img{width:100%;height:100%;object-fit:cover}
        .pg-thumb-more{display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:var(--color-text-primary);background:var(--color-bg-secondary);cursor:pointer;border:2px solid transparent;transition:border-color .15s}
        .pg-thumb-more:hover{border-color:var(--color-brand)}
      `}</style>

      {/* Hero image — click to open lightbox */}
      <div ref={heroRef} className="pg-hero" data-idx="0" onClick={openHeroLightbox}>
        <OptimizedImage
          src={firstImage.src}
          alt={firstImage.alt}
          fill
          className="object-cover"
          priority={priority}
          sizes="(max-width:1024px) 100vw, 65vw"
        />
        <div className="pg-hero-zoom">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="8" r="5" />
            <path d="M12 12l4 4" />
            <path d="M6 8h4M8 6v4" />
          </svg>
        </div>
      </div>

      {/* Thumbnail strip — click to change hero, double-click opens lightbox */}
      {images.length > 1 && (
        <div className="pg-thumbs">
          {visibleThumbs.map((img, i) => (
            <div
              key={i}
              className="pg-thumb"
              onClick={() => { setHero(i); openLightbox(i); }}
            >
              <OptimizedImage
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="120px"
              />
            </div>
          ))}
          {remainingCount > 0 && (
            <div
              className="pg-thumb pg-thumb-more"
              style={{ width: 120, height: 80 }}
              onClick={() => openLightbox(6)}
            >
              + {remainingCount}
            </div>
          )}
        </div>
      )}

      {/* Fullscreen lightbox */}
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
