import { Suspense } from 'react';
import AdminLibraryClient from './_components/admin-library-client';

export default function Page() {
  return (
    <Suspense>
      <AdminLibraryClient />
    </Suspense>
  );
}
