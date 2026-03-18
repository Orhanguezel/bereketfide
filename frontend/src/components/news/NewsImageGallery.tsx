'use client';

import { useState } from 'react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { ProjectLightbox } from '@/components/projects/ProjectLightbox';

type Props = {
  heroSrc: string;
  heroAlt: string;
  images: { src: string; alt: string }[];
  caption?: string | null;
};

export function NewsImageGallery({ heroSrc, heroAlt, images, caption }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // All images for lightbox: hero first, then additional images
  const allImages = [{ src: heroSrc, alt: heroAlt }, ...images];

  return (
    <>
      {/* Hero image — clickable */}
      <div
        className="nd-hero"
        onClick={() => setLightboxIndex(0)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') setLightboxIndex(0); }}
        style={{ cursor: 'pointer' }}
      >
        <OptimizedImage
          src={heroSrc}
          alt={heroAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 800px"
          priority
        />
      </div>
      {caption && <p className="nd-hero-caption">{caption}</p>}

      {/* Thumbnail strip — clickable */}
      {images.length > 0 && (
        <div className="nd-thumbstrip">
          {images.slice(0, 5).map((img, i) => (
            <div
              key={i}
              className="nd-thumbstrip-item"
              onClick={() => setLightboxIndex(i + 1)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setLightboxIndex(i + 1); }}
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
          {images.length > 5 && (
            <div
              className="nd-thumbstrip-more"
              onClick={() => setLightboxIndex(6)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setLightboxIndex(6); }}
              style={{ cursor: 'pointer' }}
            >
              + {images.length - 5}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <ProjectLightbox
          images={allImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
