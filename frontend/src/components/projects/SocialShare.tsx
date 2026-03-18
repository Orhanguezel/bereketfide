'use client';

import { useCallback } from 'react';

type Props = {
  url: string;
  title: string;
  description?: string;
  locale: string;
  saveLabel?: string;
};

export function SocialShare({ url, title, description, locale, saveLabel: saveLabelProp }: Props) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || title);

  const share = useCallback(
    (href: string) => {
      window.open(href, '_blank', 'width=600,height=500,noopener,noreferrer');
    },
    [],
  );

  const saveLabel = saveLabelProp ?? 'Kaydet';

  return (
    <>
      <style>{`
        .ss-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
        .ss-btn{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;border:none;cursor:pointer;transition:opacity .15s;color:#fff;flex-shrink:0}
        .ss-btn:hover{opacity:.85}
        .ss-btn-fb{background:#3b5998}
        .ss-btn-tw{background:#1da1f2}
        .ss-btn-li{background:#0077b5}
        .ss-btn-em{background:#555}
        .ss-btn-pi{background:#e60023}
        .ss-save{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border:1px solid var(--color-border);border-radius:2px;background:var(--color-bg);color:var(--color-text-primary);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;margin-left:auto;white-space:nowrap}
        .ss-save:hover{border-color:var(--color-text-primary);background:var(--color-text-primary);color:var(--color-bg)}
      `}</style>

      <div className="ss-row">
        {/* Facebook */}
        <button
          className="ss-btn ss-btn-fb"
          aria-label="Facebook"
          onClick={() => share(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
        </button>

        {/* Twitter / X */}
        <button
          className="ss-btn ss-btn-tw"
          aria-label="Twitter"
          onClick={() => share(`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
        </button>

        {/* LinkedIn */}
        <button
          className="ss-btn ss-btn-li"
          aria-label="LinkedIn"
          onClick={() => share(`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>
        </button>

        {/* Email */}
        <button
          className="ss-btn ss-btn-em"
          aria-label="Email"
          onClick={() => {
            window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encoded}`;
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg>
        </button>

        {/* Pinterest */}
        <button
          className="ss-btn ss-btn-pi"
          aria-label="Pinterest"
          onClick={() => share(`https://pinterest.com/pin/create/button/?url=${encoded}&description=${encodedTitle}`)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 4.99 3.657 9.128 8.438 9.879-.046-.75-.088-1.903.018-2.722.096-.743.62-4.725.62-4.725s-.158-.317-.158-.783c0-.734.425-1.282.954-1.282.45 0 .667.337.667.741 0 .452-.287 1.128-.436 1.754-.124.525.263.953.782.953 1.938 0 3.028-2.496 3.028-5.455 0-2.257-1.524-3.95-4.3-3.95-3.13 0-5.082 2.34-5.082 4.948 0 .9.265 1.534.678 2.025.19.225.216.316.148.575-.05.19-.164.647-.21.828-.068.26-.277.353-.51.257-1.426-.581-2.09-2.14-2.09-3.893 0-2.9 2.444-6.377 7.298-6.377 3.898 0 6.457 2.822 6.457 5.852 0 4.005-2.228 6.987-5.514 6.987-1.102 0-2.14-.596-2.494-1.274l-.678 2.677c-.246.972-.91 2.19-1.356 2.932A12 12 0 0024 12c0-6.627-5.373-12-12-12z"/></svg>
        </button>

        {/* Save */}
        <button className="ss-save" aria-label={saveLabel}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          {saveLabel}
        </button>
      </div>
    </>
  );
}
