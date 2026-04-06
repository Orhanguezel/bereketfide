import BayiPanelShell from './BayiPanelShell';

export default async function BayiPanelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <BayiPanelShell locale={locale}>{children}</BayiPanelShell>;
}
