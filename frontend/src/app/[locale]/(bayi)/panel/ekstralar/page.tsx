import EkstralarPageClient from './EkstralarPageClient';

export default async function BayiEkstralarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <EkstralarPageClient locale={locale} />;
}
