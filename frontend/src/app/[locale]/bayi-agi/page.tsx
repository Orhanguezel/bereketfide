import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { absoluteUrl } from '@/seo/helpers';
import DealersNetworkClient from './dealers-network-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bayiNetwork' });
  const path = `/${locale}/bayi-agi`;
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: true, follow: true },
  };
}

function BayiAgiFallback() {
  return (
    <div className="min-h-[50vh] animate-pulse bg-(--color-bg-muted) px-6 py-24 text-center text-(--color-text-muted)">
      …
    </div>
  );
}

export default function BayiAgiPage() {
  return (
    <Suspense fallback={<BayiAgiFallback />}>
      <DealersNetworkClient />
    </Suspense>
  );
}
