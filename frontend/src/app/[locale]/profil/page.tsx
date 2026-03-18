import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/seo';
import { ProfileClient } from './ProfileClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return buildPageMetadata({
    locale,
    pathname: '/profil',
    title: t('auth.profile.title'),
    description: t('auth.profile.subtitle'),
    noIndex: true,
  });
}

export default async function ProfilPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ProfileClient locale={locale} />;
}
