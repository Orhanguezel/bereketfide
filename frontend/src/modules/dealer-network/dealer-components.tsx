'use client';

import * as React from 'react';
import { MapPin, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import type { PublicDealer } from './types';

type TFn = (key: string, values?: Record<string, string | number | Date>) => string;

export function DealerCardSkeleton() {
  return (
    <div
      className="space-y-4 rounded-2xl border border-(--color-border) bg-(--color-bg-secondary) p-5 shadow-sm"
      aria-hidden
    >
      <div className="h-6 w-3/4 animate-pulse rounded-lg bg-(--color-bg-muted)" />
      <div className="space-y-2">
        <div className="h-4 w-1/2 animate-pulse rounded-md bg-(--color-bg-muted)" />
        <div className="h-4 w-1/3 animate-pulse rounded-md bg-(--color-bg-muted)" />
      </div>
      <div className="h-10 w-full animate-pulse rounded-xl bg-(--color-bg-muted)" />
    </div>
  );
}

export function DealerCard({ dealer, t }: { dealer: PublicDealer; t: TFn }) {
  const whatsappUrl = dealer.phone
    ? `https://wa.me/${dealer.phone.replace(/[\s()+-]/g, '')}`
    : null;

  const googleMapsUrl =
    dealer.latitude && dealer.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${dealer.latitude},${dealer.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.company_name || dealer.city || '')}`;

  return (
    <li
      id={`dealer-${dealer.id}`}
      className="group list-none rounded-2xl border border-(--color-border) bg-(--color-bg-secondary) p-5 shadow-sm transition-all duration-300 hover:border-(--color-brand)/30 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between">
        <h3 className="line-clamp-2 font-bold leading-tight text-(--color-text-primary) transition-colors group-hover:text-(--color-brand)">
          {dealer.company_name || dealer.city || '—'}
        </h3>
        <div className="hidden rounded-full bg-(--color-brand)/10 p-2 text-(--color-brand) transition-all group-hover:block">
          <MapPin className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-2 text-sm text-(--color-text-muted)">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">
            {[dealer.city, dealer.region].filter(Boolean).join(' · ') || '—'}
          </span>
        </div>

        {dealer.phone ? (
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <a
              href={`tel:${dealer.phone.replace(/\s/g, '')}`}
              className="font-medium text-(--color-text-primary)/90 hover:text-(--color-brand)"
            >
              {dealer.phone}
            </a>
          </div>
        ) : null}
      </div>

      <div className={`mt-5 grid gap-2 ${whatsappUrl ? 'grid-cols-2' : 'grid-cols-1'}`}>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-(--color-border) bg-(--color-bg-muted) px-3 py-2 text-xs font-semibold transition-all hover:bg-(--color-bg) hover:text-(--color-brand)"
        >
          <ExternalLink className="h-3 w-3" />
          {t('directions')}
        </a>

        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-(--color-brand)/10 px-3 py-2 text-xs font-semibold text-(--color-brand) transition-all hover:bg-(--color-brand) hover:text-(--color-on-brand)"
          >
            <MessageSquare className="h-3 w-3" />
            {t('whatsapp')}
          </a>
        ) : null}
      </div>
    </li>
  );
}
