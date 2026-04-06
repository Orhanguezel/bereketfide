import { getTranslations } from 'next-intl/server';

export default async function BayiDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.panel.dashboard' });
  return (
    <div className="max-w-2xl space-y-2">
      <h1 className="text-2xl font-semibold text-(--color-text-primary)">{t('title')}</h1>
      <p className="text-(--color-text-secondary)">{t('lead')}</p>
    </div>
  );
}
