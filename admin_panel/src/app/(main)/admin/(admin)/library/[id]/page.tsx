import AdminLibraryDetailClient from '../_components/admin-library-detail-client';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminLibraryDetailClient id={id} />;
}
