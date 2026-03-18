'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export function SplashScreen({ companyName, tagline }: { companyName?: string; tagline?: string }) {
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'exit' | 'done'>('loading');

  const finalName = companyName || 'Bereket Fide';
  const finalTagline = tagline || 'Fide & Tohum Üretimi';

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
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(184,169,138,0.14) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 20% 80%, rgba(184,169,138,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 20%, rgba(212,196,160,0.08) 0%, transparent 50%);
        }

        /* ── Gold gridlines ── */
        .splash-lines {
          position: absolute;
          inset: 0;
          opacity: 0;
          animation: splash-lines-in 1.8s ease-out 0.2s forwards;
        }
        .splash-line-v {
          position: absolute;
          background: linear-gradient(180deg, transparent, rgba(184,169,138,0.12), transparent);
          width: 1px;
          height: 100%;
          animation: splash-line-pulse 3.5s ease-in-out infinite;
        }
        .splash-line-v:nth-child(1) { left: 15%; animation-delay: 0s; }
        .splash-line-v:nth-child(2) { left: 30%; animation-delay: 0.5s; }
        .splash-line-v:nth-child(3) { left: 50%; animation-delay: 0.2s; background: linear-gradient(180deg, transparent 20%, rgba(184,169,138,0.18) 50%, transparent 80%); }
        .splash-line-v:nth-child(4) { left: 70%; animation-delay: 0.7s; }
        .splash-line-v:nth-child(5) { left: 85%; animation-delay: 0.3s; }
        .splash-line-h {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(184,169,138,0.08), transparent);
          height: 1px;
          width: 100%;
        }
        .splash-line-h:nth-child(6) { top: 30%; }
        .splash-line-h:nth-child(7) { top: 50%; }
        .splash-line-h:nth-child(8) { top: 70%; }

        @keyframes splash-lines-in { to { opacity: 1; } }
        @keyframes splash-line-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        /* ── Floating gold particles ── */
        .splash-particles { position: absolute; inset: 0; pointer-events: none; }
        .splash-dot {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,196,160,0.9), rgba(184,169,138,0.2));
          animation: splash-dot-drift 5s ease-in-out infinite;
          opacity: 0;
        }
        .splash-dot:nth-child(1)  { left: 8%;  top: 18%; width: 2px; height: 2px; animation-delay: 0.0s; }
        .splash-dot:nth-child(2)  { left: 22%; top: 55%; width: 3px; height: 3px; animation-delay: 0.6s; }
        .splash-dot:nth-child(3)  { left: 38%; top: 12%; width: 4px; height: 4px; animation-delay: 1.2s; }
        .splash-dot:nth-child(4)  { left: 52%; top: 72%; width: 3px; height: 3px; animation-delay: 0.3s; }
        .splash-dot:nth-child(5)  { left: 68%; top: 28%; width: 2px; height: 2px; animation-delay: 0.9s; }
        .splash-dot:nth-child(6)  { left: 82%; top: 60%; width: 3px; height: 3px; animation-delay: 1.5s; }
        .splash-dot:nth-child(7)  { left: 12%; top: 82%; width: 4px; height: 4px; animation-delay: 0.4s; }
        .splash-dot:nth-child(8)  { left: 58%; top: 40%; width: 2px; height: 2px; animation-delay: 1.0s; }
        .splash-dot:nth-child(9)  { left: 92%; top: 45%; width: 2px; height: 2px; animation-delay: 0.7s; }
        .splash-dot:nth-child(10) { left: 75%; top: 88%; width: 3px; height: 3px; animation-delay: 1.3s; }

        @keyframes splash-dot-drift {
          0%   { opacity: 0; transform: translateY(15px) scale(0); }
          15%  { opacity: 0.9; transform: translateY(0) scale(1); }
          85%  { opacity: 0.5; transform: translateY(-25px) scale(0.7); }
          100% { opacity: 0; transform: translateY(-40px) scale(0); }
        }

        /* ── Diamond ornament ── */
        .splash-diamond {
          position: absolute;
          width: 180px;
          height: 180px;
          border: 1px solid rgba(184,169,138,0.18);
          transform: rotate(45deg) scale(0);
          animation: splash-dia-in 1.4s cubic-bezier(0.22,1,0.36,1) 0.15s forwards;
        }
        .splash-diamond-sm {
          position: absolute;
          width: 120px;
          height: 120px;
          border: 1px solid rgba(184,169,138,0.10);
          transform: rotate(45deg) scale(0);
          animation: splash-dia-in 1.4s cubic-bezier(0.22,1,0.36,1) 0.35s forwards;
        }
        @keyframes splash-dia-in { to { transform: rotate(45deg) scale(1); } }

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
          filter: brightness(1.3) drop-shadow(0 0 50px rgba(184,169,138,0.35));
        }

        /* Glow halo */
        .splash-halo {
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,169,138,0.22) 0%, transparent 70%);
          filter: blur(40px);
          animation: splash-halo-breathe 2.5s ease-in-out infinite;
          z-index: -1;
        }
        @keyframes splash-halo-breathe {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.25); }
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
          font-family: var(--font-heading, 'Syne', sans-serif);
          font-size: clamp(26px, 5vw, 44px);
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #e8dcc8 0%, #b8a98a 30%, #d4c4a0 60%, #9e8f6f 100%);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: splash-gold-flow 3s ease infinite;
        }
        @keyframes splash-gold-flow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes splash-txt-in { to { opacity: 1; transform: translateY(0); } }

        /* ── Gold divider ── */
        .splash-rule {
          position: relative;
          z-index: 2;
          width: 0;
          height: 1px;
          margin-top: 20px;
          background: linear-gradient(90deg, transparent, rgba(184,169,138,0.5), transparent);
          animation: splash-rule-grow 1s cubic-bezier(0.22,1,0.36,1) 1.2s forwards;
        }
        @keyframes splash-rule-grow { to { width: clamp(100px, 28vw, 220px); } }

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
          font-family: var(--font-body, 'DM Sans', sans-serif);
          font-size: clamp(11px, 1.8vw, 14px);
          font-weight: 400;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(184,169,138,0.55);
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
          font-family: var(--font-body, 'DM Sans', sans-serif);
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(184,169,138,0.30);
        }

        /* ── Corner brackets ── */
        .splash-corner {
          position: absolute;
          width: 48px;
          height: 48px;
          border-color: rgba(184,169,138,0.14);
          border-style: solid;
          opacity: 0;
          animation: splash-corner-fade 0.8s ease-out 0.7s forwards;
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

      {/* Grid lines */}
      <div className="splash-lines">
        <div className="splash-line-v" />
        <div className="splash-line-v" />
        <div className="splash-line-v" />
        <div className="splash-line-v" />
        <div className="splash-line-v" />
        <div className="splash-line-h" />
        <div className="splash-line-h" />
        <div className="splash-line-h" />
      </div>

      {/* Particles */}
      <div className="splash-particles">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="splash-dot" />
        ))}
      </div>

      {/* Corner brackets */}
      <div className="splash-corner splash-c-tl" />
      <div className="splash-corner splash-c-tr" />
      <div className="splash-corner splash-c-bl" />
      <div className="splash-corner splash-c-br" />

      {/* Diamond frames */}
      <div className="splash-diamond" />
      <div className="splash-diamond-sm" />

      {/* Logo */}
      <div className="splash-logo-wrap">
        <div className="splash-halo" />
        <Image
          src="/logo-dark.svg"
          alt={finalName}
          width={110}
          height={110}
          className="splash-logo-img"
          style={{ height: 110, width: 'auto' }}
          priority
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
        <span>Est. 2009 — Türkiye</span>
      </div>
    </div>
  );
}
