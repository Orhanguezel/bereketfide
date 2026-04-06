'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Play, X } from 'lucide-react';

interface HeroVideoPlayerProps {
  src: string;
  mobileSrc?: string;
  poster?: string;
  badge?: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export function HeroVideoPlayer({ src, mobileSrc, poster, badge, title, description, ctaText, ctaUrl }: HeroVideoPlayerProps) {
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const fullVideoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Use 1024 to match LG break
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openFullscreen = useCallback(() => {
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
    document.body.style.overflow = '';
    if (fullVideoRef.current) {
      fullVideoRef.current.pause();
    }
  }, []);

  const currentSrc = isMobile && mobileSrc ? mobileSrc : src;

  // Defer video load until browser is idle — prevents LCP/TBT impact
  useEffect(() => {
    const video = bgVideoRef.current;
    if (!video) return;
    const startVideo = () => {
      video.preload = 'auto';
      video.load();
      video.play().catch(() => {});
    };
    // Wait for idle time so video doesn't compete with LCP
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(startVideo, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    const timer = setTimeout(startVideo, 2000);
    return () => clearTimeout(timer);
  }, [currentSrc]);


  return (
    <>
      {/* Background auto-playing video */}
      <div
        className="group relative flex cursor-pointer flex-col overflow-hidden aspect-9/16 sm:aspect-4/3 lg:aspect-auto lg:flex-1 min-h-[520px] lg:min-h-0"
        onClick={openFullscreen}
      >
        <div className="relative flex-1 overflow-hidden">
          {/* Gradient placeholder until video loads */}
          {!poster && (
            <div
              className="absolute inset-0 z-0"
              style={{
                background:
                  'linear-gradient(135deg, var(--gold-950) 0%, var(--soil-900) 42%, color-mix(in srgb, var(--gold-900) 50%, var(--soil-800) 50%) 100%)',
              }}
            />
          )}
          <video
            ref={bgVideoRef}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover"
            poster={poster}
          >
            <source src={currentSrc} type="video/mp4" />
          </video>
          {/* Video badge — top left */}
          <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-sm bg-(--color-bg-secondary) px-3 py-1.5 text-xs font-semibold text-(--color-text-primary)">
            <Play className="size-3 fill-current" />
            Video
          </div>
        </div>
        {/* Title area — below video */}
        <div className="bg-(--color-bg) pt-3 pb-1">
          {badge && (
            <p className="text-xs font-medium uppercase tracking-wider text-(--color-brand-text)">
              {badge}
            </p>
          )}
          <h1
            className="mt-1 text-lg font-semibold leading-snug text-(--color-brand-text) lg:text-xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-(--color-text-secondary)">{description}</p>
          )}
          {ctaText && ctaUrl && (
             <a 
               href={ctaUrl}
               className="mt-3 inline-flex items-center text-xs font-bold uppercase tracking-wider text-(--color-text-primary) hover:text-(--color-brand-text) transition-colors"
               onClick={(e) => e.stopPropagation()}
             >
               {ctaText} →
             </a>
          )}
        </div>
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-200 flex items-center justify-center bg-black/95"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute right-6 top-6 z-10 flex size-10 items-center justify-center rounded-full bg-(--color-glass-bg-strong) text-(--section-bg-white) transition-colors hover:bg-(--color-glass-hover)"
            aria-label="Kapat"
          >
            <X className="size-5" />
          </button>
          <video
            ref={fullVideoRef}
            autoPlay
            controls
            playsInline
            className="max-h-[90vh] max-w-full lg:max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <source src={currentSrc} type="video/mp4" />
          </video>
        </div>
      )}
    </>
  );
}
