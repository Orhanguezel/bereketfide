import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/seo';
import { BayiGirisClient } from './BayiGirisClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.bayi' });
  return buildPageMetadata({
    locale,
    pathname: '/bayi-girisi',
    title: t('loginTitle'),
    description: t('loginSubtitle'),
    noIndex: true,
  });
}

export default async function BayiGirisiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-(--color-text-muted)">
          Loading
        </div>
      }
    >
      <BayiGirisClient locale={locale} />
    </Suspense>
  );
}
