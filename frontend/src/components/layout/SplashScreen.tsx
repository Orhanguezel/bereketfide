'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export function SplashScreen({ 
  companyName, 
  tagline, 
  logoUrl 
}: { 
  companyName?: string; 
  tagline?: string; 
  logoUrl?: string;
}) {
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'exit' | 'done'>('loading');

  const finalName = companyName || 'Bereket Fide';
  const finalTagline = tagline || 'Geleceği Yeşertiyoruz';
  const finalLogo = logoUrl || '/logo-dark.svg';

  const startSequence = useCallback(() => {
    // Remove SSR overlay immediately — client splash takes over
    const ssrOverlay = document.getElementById('bereket-splash-ssr');
    if (ssrOverlay) ssrOverlay.style.display = 'none';

    // Phase 1: Loading (already active on mount)
    const t1 = setTimeout(() => setPhase('reveal'), 600);
    // Phase 2: Brand reveal
    const t2 = setTimeout(() => setPhase('exit'), 3000);
    // Phase 3: Exit
    const t3 = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem('bereket_splash_seen', '1');
    }, 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    // Already seen — remove SSR overlay and skip
    if (sessionStorage.getItem('bereket_splash_seen')) {
      const ssrOverlay = document.getElementById('bereket-splash-ssr');
      if (ssrOverlay) ssrOverlay.style.display = 'none';
      setPhase('done');
      return;
    }
    document.body.style.overflow = 'hidden';
    const cleanup = startSequence();
    return () => {
      cleanup();
      document.body.style.overflow = '';
    };
  }, [startSequence]);

  useEffect(() => {
    if (phase === 'done') {
      document.body.style.overflow = '';
    }
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div
      className={`splash-overlay ${phase === 'exit' ? 'splash-exit' : ''}`}
      aria-hidden="true"
    >
      <style>{`
        .splash-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          background: #0f0e0d;
          overflow: hidden;
        }

        /* ── Background glow ── */
        .splash-bg-gradient {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(46,125,50,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 20% 80%, rgba(76,175,80,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 20%, rgba(129,199,132,0.12) 0%, transparent 50%);
        }

        /* ── Organic floating particles ── */
        .splash-particles { position: absolute; inset: 0; pointer-events: none; }
        .splash-dot {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(129,199,132,0.8), rgba(46,125,50,0.2));
          animation: splash-dot-drift 5s ease-in-out infinite;
          opacity: 0;
        }
        .splash-dot:nth-child(1)  { left: 8%;  top: 18%; width: 3px; height: 3px; animation-delay: 0.0s; }
        .splash-dot:nth-child(2)  { left: 22%; top: 55%; width: 4px; height: 4px; animation-delay: 0.6s; }
        .splash-dot:nth-child(3)  { left: 38%; top: 12%; width: 5px; height: 5px; animation-delay: 1.2s; }
        .splash-dot:nth-child(4)  { left: 52%; top: 72%; width: 4px; height: 4px; animation-delay: 0.3s; }
        .splash-dot:nth-child(5)  { left: 68%; top: 28%; width: 3px; height: 3px; animation-delay: 0.9s; }
        .splash-dot:nth-child(6)  { left: 82%; top: 60%; width: 4px; height: 4px; animation-delay: 1.5s; }

        @keyframes splash-dot-drift {
          0%   { opacity: 0; transform: translateY(15px) scale(0); }
          15%  { opacity: 0.8; transform: translateY(0) scale(1); }
          85%  { opacity: 0.4; transform: translateY(-30px) scale(0.8); }
          100% { opacity: 0; transform: translateY(-50px) scale(0); }
        }

        /* ── Logo ── */
        .splash-logo-wrap {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0;
          transform: scale(0.6);
          animation: splash-logo-appear 1s cubic-bezier(0.22,1,0.36,1) 0.4s forwards;
        }
        @keyframes splash-logo-appear { to { opacity: 1; transform: scale(1); } }

        .splash-logo-img {
          filter: drop-shadow(0 0 50px rgba(46,125,50,0.4));
        }

        /* Glow halo */
        .splash-halo {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(76,175,80,0.25) 0%, transparent 70%);
          filter: blur(50px);
          animation: splash-halo-breathe 3s ease-in-out infinite;
          z-index: -1;
        }
        @keyframes splash-halo-breathe {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }

        /* ── Brand text ── */
        .splash-brand {
          position: relative;
          z-index: 2;
          margin-top: 32px;
          opacity: 0;
          transform: translateY(20px);
          animation: splash-txt-in 0.9s cubic-bezier(0.22,1,0.36,1) 1s forwards;
        }
        .splash-brand span {
          font-family: var(--font-heading, sans-serif);
          font-size: clamp(26px, 5vw, 44px);
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #a5d6a7 0%, #4caf50 30%, #81c784 60%, #2e7d32 100%);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: splash-green-flow 4s ease infinite;
        }
        @keyframes splash-green-flow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes splash-txt-in { to { opacity: 1; transform: translateY(0); } }

        /* ── Green divider ── */
        .splash-rule {
          position: relative;
          z-index: 2;
          width: 0;
          height: 1px;
          margin-top: 20px;
          background: linear-gradient(90deg, transparent, rgba(76,175,80,0.4), transparent);
          animation: splash-rule-grow 1s cubic-bezier(0.22,1,0.36,1) 1.2s forwards;
        }
        @keyframes splash-rule-grow { to { width: clamp(120px, 30vw, 260px); } }

        /* ── Tagline ── */
        .splash-tagline {
          position: relative;
          z-index: 2;
          margin-top: 14px;
          opacity: 0;
          transform: translateY(12px);
          animation: splash-txt-in 0.8s cubic-bezier(0.22,1,0.36,1) 1.5s forwards;
        }
        .splash-tagline span {
          font-family: var(--font-body, sans-serif);
          font-size: clamp(12px, 2vw, 15px);
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(129,199,132,0.8);
        }

        /* ── Bottom badge ── */
        .splash-badge {
          position: absolute;
          bottom: 36px;
          z-index: 2;
          opacity: 0;
          animation: splash-txt-in 0.8s cubic-bezier(0.22,1,0.36,1) 1.8s forwards;
        }
        .splash-badge span {
          font-family: var(--font-body, sans-serif);
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(129,199,132,0.4);
        }

        /* ── Corner accents ── */
        .splash-corner {
          position: absolute;
          width: 50px;
          height: 50px;
          border-color: rgba(129,199,132,0.15);
          border-style: solid;
          opacity: 0;
          animation: splash-corner-fade 1s ease-out 0.8s forwards;
        }
        .splash-c-tl { top: 24px; left: 24px; border-width: 1px 0 0 1px; }
        .splash-c-tr { top: 24px; right: 24px; border-width: 1px 1px 0 0; }
        .splash-c-bl { bottom: 24px; left: 24px; border-width: 0 0 1px 1px; }
        .splash-c-br { bottom: 24px; right: 24px; border-width: 0 1px 1px 0; }
        @keyframes splash-corner-fade { to { opacity: 1; } }

        /* ── Exit curtain ── */
        .splash-exit {
          animation: splash-out 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        @keyframes splash-out {
          0%   { clip-path: inset(0 0 0 0); opacity: 1; }
          50%  { opacity: 1; }
          100% { clip-path: inset(0 0 100% 0); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .splash-overlay, .splash-overlay * {
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
          }
        }
      `}</style>

      {/* BG */}
      <div className="splash-bg-gradient" />

      {/* Corner accents */}
      <div className="splash-corner splash-c-tl" />
      <div className="splash-corner splash-c-tr" />
      <div className="splash-corner splash-c-bl" />
      <div className="splash-corner splash-c-br" />

      {/* Logo */}
      <div className="splash-logo-wrap">
        <div className="splash-halo" />
        <Image
          src={finalLogo}
          alt={finalName}
          width={240}
          height={240}
          className="splash-logo-img"
          style={{ height: 'auto', width: 240, objectFit: 'contain' }}
          priority
          unoptimized={finalLogo.startsWith('/uploads/') || finalLogo.endsWith('.svg')}
        />
      </div>

      {/* Brand name */}
      <div className="splash-brand">
        <span>{finalName}</span>
      </div>

      {/* Divider */}
      <div className="splash-rule" />

      {/* Tagline */}
      <div className="splash-tagline">
        <span>{finalTagline}</span>
      </div>

      {/* Bottom badge */}
      <div className="splash-badge">
        <span>Bereket ve Kalite ile...</span>
      </div>
    </div>
  );
}
