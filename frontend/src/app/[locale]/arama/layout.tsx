import { Suspense, type ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return {
    title: t('searchTitle'),
    description: t('searchDescription'),
    robots: { index: false, follow: true },
  };
}

export default function SearchLayout({ children }: { children: ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
