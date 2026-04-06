import SiparislerPageClient from './SiparislerPageClient';

export default async function BayiSiparislerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <SiparislerPageClient locale={locale} />;
}
