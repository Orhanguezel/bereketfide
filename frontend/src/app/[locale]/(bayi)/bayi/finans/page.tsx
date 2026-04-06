import FinansPageClient from './FinansPageClient';

export default async function BayiFinansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <FinansPageClient locale={locale} />;
}
