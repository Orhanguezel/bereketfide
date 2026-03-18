'use client';

import { useCallback, useRef } from 'react';

export type SpecItem = {
  icon: string;
  label: string;
  value: string;
  isLink?: boolean;
};

type Props = {
  primarySpecs: SpecItem[];
  secondarySpecs: SpecItem[];
  moreLabel: string;
  lessLabel: string;
};

/* SVG icon map — small inline icons matching ArchDaily style */
const icons: Record<string, React.ReactNode> = {
  architects: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/></svg>,
  area: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/></svg>,
  year: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><rect x="7" y="14" width="4" height="4"/></svg>,
  manufacturers: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  leadArchitect: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  status: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
  category: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>,
  location: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  city: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  country: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  team: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  default: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
};

function getIcon(key: string) {
  return icons[key] || icons.default;
}

export function ProjectSpecs({ primarySpecs, secondarySpecs, moreLabel, lessLabel }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const open = el.getAttribute('data-open') === '1';
    el.setAttribute('data-open', open ? '0' : '1');
  }, []);

  if (!primarySpecs.length && !secondarySpecs.length) return null;

  return (
    <div ref={rootRef} data-open="0">
      <style>{`
        .ps-row{display:flex;align-items:flex-start;gap:10px;font-size:14px;line-height:1.6;padding:7px 0;color:var(--color-text-secondary)}
        .ps-icon{flex-shrink:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;color:var(--color-text-muted);margin-top:1px}
        .ps-label{font-weight:700;color:var(--color-text-primary);white-space:nowrap}
        .ps-value{flex:1}
        .ps-link{color:var(--color-brand);text-decoration:none}
        .ps-link:hover{text-decoration:underline}
        .ps-secondary{display:none;border-top:1px solid var(--color-border);padding-top:8px;margin-top:4px}
        [data-open="1"] .ps-secondary{display:block}
        .ps-toggle{display:flex;align-items:center;justify-content:center;width:100%;padding:12px;margin-top:12px;border:1px solid var(--color-border);background:var(--color-bg);color:var(--color-text-primary);font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:all .15s}
        .ps-toggle:hover{border-color:var(--color-text-primary)}
        .ps-toggle-more{display:inline}
        .ps-toggle-less{display:none}
        [data-open="1"] .ps-toggle-more{display:none}
        [data-open="1"] .ps-toggle-less{display:inline}
      `}</style>

      {/* Primary specs (always visible) */}
      <div>
        {primarySpecs.map((spec, i) => (
          <div key={i} className="ps-row">
            <span className="ps-icon">{getIcon(spec.icon)}</span>
            <span className="ps-label">{spec.label}</span>
            <span className="ps-value">
              {spec.isLink ? <a href="#" className="ps-link">{spec.value}</a> : spec.value}
            </span>
          </div>
        ))}
      </div>

      {/* Secondary specs (togglable) */}
      {secondarySpecs.length > 0 && (
        <>
          <div className="ps-secondary">
            {secondarySpecs.map((spec, i) => (
              <div key={i} className="ps-row">
                <span className="ps-icon">{getIcon(spec.icon)}</span>
                <span className="ps-label">{spec.label}</span>
                <span className="ps-value">
                  {spec.isLink ? <a href="#" className="ps-link">{spec.value}</a> : spec.value}
                </span>
              </div>
            ))}
          </div>

          <button className="ps-toggle" onClick={toggle}>
            <span className="ps-toggle-more">{moreLabel}</span>
            <span className="ps-toggle-less">{lessLabel}</span>
          </button>
        </>
      )}
    </div>
  );
}
