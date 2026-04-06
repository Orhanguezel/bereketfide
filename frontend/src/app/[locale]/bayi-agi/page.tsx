import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { absoluteUrl } from '@/seo/helpers';
import BayiAgiClient from './BayiAgiClient';

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

export default function BayiAgiPage() {
  return <BayiAgiClient />;
}
