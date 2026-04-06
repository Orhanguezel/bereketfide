import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/seo';
import { BayiKayitClient } from './BayiKayitClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.bayi' });
  return buildPageMetadata({
    locale,
    pathname: '/bayi-kayit',
    title: t('registerTitle'),
    description: t('registerSubtitle'),
    noIndex: true,
  });
}

export default async function BayiKayitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div
      className="flex min-h-[70vh] items-center justify-center px-4 py-16"
      style={{ background: 'var(--color-bg-alt)' }}
    >
      <BayiKayitClient locale={locale} />
    </div>
  );
}
