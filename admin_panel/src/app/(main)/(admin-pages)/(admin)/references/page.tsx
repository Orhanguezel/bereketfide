import { Suspense } from 'react';
import AdminReferencesClient from './_components/admin-references-client';

export default function Page() {
  return (
    <Suspense>
      <AdminReferencesClient />
    </Suspense>
  );
}
