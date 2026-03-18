'use client';

import dynamic from 'next/dynamic';

const ScrollToTop = dynamic(
  () => import('@/components/layout/ScrollToTop').then((m) => m.ScrollToTop),
  { ssr: false },
);
const WebVitals = dynamic(
  () => import('@/components/analytics/WebVitals').then((m) => m.WebVitals),
  { ssr: false },
);
const GoogleAnalytics = dynamic(
  () =>
    import('@/components/analytics/GoogleAnalytics').then(
      (m) => m.GoogleAnalytics,
    ),
  { ssr: false },
);
const GoogleTagManager = dynamic(
  () =>
    import('@/components/analytics/GoogleAnalytics').then(
      (m) => m.GoogleTagManager,
    ),
  { ssr: false },
);
const WhatsAppButton = dynamic<{ number?: string }>(
  () =>
    import('@/components/widgets/WhatsAppButton').then(
      (m) => m.WhatsAppButton,
    ),
  { ssr: false },
);
const SplashScreen = dynamic<{ companyName?: string; tagline?: string }>(
  () =>
    import('@/components/layout/SplashScreen').then(
      (m) => m.SplashScreen,
    ),
  { ssr: false },
);

export function ClientShell({ 
  companyName, 
  tagline,
  whatsappNumber
}: { 
  companyName?: string; 
  tagline?: string;
  whatsappNumber?: string;
}) {
  return (
    <>
      <SplashScreen companyName={companyName} tagline={tagline} />
      <ScrollToTop />
      <WebVitals />
      <GoogleAnalytics />
      <GoogleTagManager />
      <WhatsAppButton number={whatsappNumber} />
    </>
  );
}
