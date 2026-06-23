'use client';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type ConversionEvent = 'offer_submit' | 'contact_submit';

const CONVERSION_LABELS: Record<ConversionEvent, string | undefined> = {
  offer_submit: process.env.NEXT_PUBLIC_GOOGLE_ADS_OFFER_CONVERSION_LABEL,
  contact_submit:
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_CONVERSION_LABEL ||
    process.env.NEXT_PUBLIC_GOOGLE_ADS_OFFER_CONVERSION_LABEL,
};

export function trackGoogleAdsConversion(event: ConversionEvent, value?: number) {
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const label = CONVERSION_LABELS[event];

  if (!adsId || !label || typeof window === 'undefined') {
    return;
  }

  const payload = {
    send_to: `${adsId}/${label}`,
    ...(value != null ? { value, currency: 'TRY' } : {}),
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    conversion_id: adsId,
    conversion_label: label,
    conversion_send_to: payload.send_to,
    ...(value != null ? { value, currency: 'TRY' } : {}),
  });

  if (typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', 'conversion', {
    ...payload,
  });
}
