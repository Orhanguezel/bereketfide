'use client';

import React, { useState, useEffect, useRef } from 'react';
import { absoluteAssetUrl } from '@/lib/utils';

interface BackgroundItem {
  url: string;
  alt: string;
}

interface ScrollBackgroundProps {
  backgrounds: BackgroundItem[];
}

export const ScrollBackground: React.FC<ScrollBackgroundProps> = ({ backgrounds }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const originalBgRef = useRef<string>('');

  const resolvedBackgrounds = backgrounds.map((bg) => ({
    ...bg,
    url: absoluteAssetUrl(bg.url) || bg.url,
  }));

  // Mount: body bg kaldır → Unmount: geri koy
  useEffect(() => {
    if (!resolvedBackgrounds.length) return;

    const body = document.body;
    // Tailwind class override: !important ile body bg'yi transparan yap
    body.style.setProperty('background-color', 'transparent', 'important');
    body.style.setProperty('background', 'transparent', 'important');

    return () => {
      body.style.removeProperty('background-color');
      body.style.removeProperty('background');
    };
  }, [resolvedBackgrounds.length]);

  // Scroll'a göre aktif arka planı değiştir
  useEffect(() => {
    if (!resolvedBackgrounds.length) return;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const scrollHeight = Math.max(
        document.body.scrollHeight, 
        document.documentElement.scrollHeight,
        document.body.offsetHeight, 
        document.documentElement.offsetHeight,
        document.body.clientHeight, 
        document.documentElement.clientHeight
      );
      
      const maxScroll = scrollHeight - windowHeight;
      if (maxScroll <= 0) return;

      const scrollPercent = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      const index = Math.min(
        Math.floor(scrollPercent * resolvedBackgrounds.length),
        resolvedBackgrounds.length - 1,
      );

      setActiveIndex((prev) => (prev !== index ? index : prev));
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [resolvedBackgrounds.length]);

  if (!resolvedBackgrounds.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -5 }}>
      {resolvedBackgrounds.map((bg, idx) => (
        <div
          key={`${bg.url}-${idx}`}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url("${bg.url}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: activeIndex === idx ? 1 : 0,
            filter: 'brightness(0.55) contrast(1.1)',
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
};
