import AdminServiceDetailClient from '../_components/admin-service-detail-client';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminServiceDetailClient id={id} />;
}
