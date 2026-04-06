import OrderDetailClient from './OrderDetailClient';

export default async function BayiSiparisDetayPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return <OrderDetailClient locale={locale} orderId={id} />;
}
