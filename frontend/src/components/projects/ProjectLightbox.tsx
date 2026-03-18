'use client';

import { useCallback, useEffect, useRef } from 'react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

type Props = {
  images: { src: string; alt: string }[];
  initialIndex: number;
  onClose: () => void;
};

export function ProjectLightbox({ images, initialIndex, onClose }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(initialIndex);
  const touchStartX = useRef(0);

  const update = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const idx = indexRef.current;
    const img = root.querySelector<HTMLImageElement>('.lb-img');
    const counter = root.querySelector<HTMLSpanElement>('.lb-counter');
    const item = images[idx];
    if (img && item) {
      img.src = item.src;
      img.alt = item.alt;
    }
    if (counter) counter.textContent = `${idx + 1} / ${images.length}`;
  }, [images]);

  const go = useCallback(
    (dir: 1 | -1) => {
      indexRef.current = (indexRef.current + dir + images.length) % images.length;
      update();
    },
    [images.length, update],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, go]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (t) touchStartX.current = t.clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    if (!t) return;
    const diff = t.clientX - touchStartX.current;
    if (Math.abs(diff) > 60) go(diff < 0 ? 1 : -1);
  };

  if (!images.length) return null;

  return (
    <div
      ref={rootRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{`
        .lb-btn{position:absolute;top:50%;transform:translateY(-50%);width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.1);border:none;color:#fff;font-size:28px;cursor:pointer;border-radius:50%;transition:background .2s}
        .lb-btn:hover{background:rgba(255,255,255,.25)}
        .lb-close{position:absolute;top:16px;right:16px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:none;border:none;color:#fff;font-size:28px;cursor:pointer;opacity:.7;transition:opacity .2s}
        .lb-close:hover{opacity:1}
        .lb-counter{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.8);font-size:14px;font-weight:500;letter-spacing:.04em}
        .lb-img{max-width:90vw;max-height:85vh;object-fit:contain;user-select:none}
      `}</style>

      {/* Close */}
      <button className="lb-close" onClick={onClose} aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button className="lb-btn" style={{ left: 12 }} onClick={() => go(-1)} aria-label="Previous">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 4l-6 6 6 6" /></svg>
        </button>
      )}

      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="lb-img"
        src={images[initialIndex]?.src ?? ''}
        alt={images[initialIndex]?.alt ?? ''}
      />

      {/* Next */}
      {images.length > 1 && (
        <button className="lb-btn" style={{ right: 12 }} onClick={() => go(1)} aria-label="Next">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 4l6 6-6 6" /></svg>
        </button>
      )}

      {/* Counter */}
      <span className="lb-counter">{initialIndex + 1} / {images.length}</span>
    </div>
  );
}
