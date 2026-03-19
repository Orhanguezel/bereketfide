'use client';

import { API_BASE_URL } from '@/lib/utils';

interface DownloadButtonProps {
  catalogId: string;
  fileUrl: string;
  label: string;
  variant?: 'primary' | 'outline';
  download?: boolean;
}

export function DownloadButton({ catalogId, fileUrl, label, variant = 'primary', download }: DownloadButtonProps) {
  const handleClick = () => {
    // İndirme sayacını artır (fire-and-forget)
    fetch(`${API_BASE_URL}/library/${catalogId}/track-download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
  };

  const className = variant === 'primary'
    ? 'inline-flex rounded-full bg-(--color-brand) px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90'
    : 'inline-flex rounded-full border border-(--color-border) px-6 py-3 text-sm font-semibold text-(--color-text-primary) transition hover:border-(--color-brand) hover:text-(--color-brand-text)';

  return (
    <a
      href={fileUrl}
      target={download ? undefined : '_blank'}
      rel={download ? undefined : 'noreferrer'}
      download={download || undefined}
      className={className}
      onClick={handleClick}
    >
      {label}
    </a>
  );
}
