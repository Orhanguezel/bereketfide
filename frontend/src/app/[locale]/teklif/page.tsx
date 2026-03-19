import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ContentPageHeader } from '@/components/patterns/ContentPageHeader';
import { InfoListPanel } from '@/components/patterns/InfoListPanel';
import { OfferFormClient } from '@/components/sections/OfferForm';
import { buildPageMetadata, localizedPath } from '@/seo';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

import { fetchSeoPage } from '@/seo/server';

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string; project?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const projectName = sp.project || sp.product;
  const seo = await fetchSeoPage(locale, 'teklif');
  const t = await getTranslations({ locale, namespace: 'offer' });

  return buildPageMetadata({
    locale,
    pathname: '/teklif',
    title: projectName
        ? `${projectName} - ${t('title')}`
        : (seo?.title || t('title')),
    description: seo?.description || t('description'),
    ogImage: seo?.og_image || undefined,
    noIndex: seo?.no_index || Boolean(projectName),
  });
}

export default async function OfferPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string; project?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const product = sp.project || sp.product;
  const t = await getTranslations({ locale });
  const benefitItems = Object.values(t.raw('offer.benefits.items') as Record<string, string>);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>
      <div>
        <Breadcrumbs items={[
          { label: 'Bereket Fide', href: localizedPath(locale, '/') },
          { label: locale.startsWith('en') ? 'Request a Quote' : 'Teklif Al' },
        ]} />
        <ContentPageHeader
          title={t('offer.title')}
          description={t('offer.description')}
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="surface-card rounded-xl p-6">
            <OfferFormClient locale={locale} preselectedProduct={product} />
          </div>
          <aside>
            <InfoListPanel
              title={t('offer.benefits.title')}
              items={benefitItems}
              accentText={t('common.freeOfObligation')}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
