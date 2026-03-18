import 'server-only';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/seo';
import { LoginClient } from './LoginClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });

  return buildPageMetadata({
    locale,
    pathname: '/login',
    title: t('loginTitle'),
    description: t('loginSubtitle'),
    noIndex: true, // Login page should not be indexed
  });
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LoginClient locale={locale} />;
}
