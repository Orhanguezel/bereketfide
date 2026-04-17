import { Suspense } from 'react';
import AdminGalleryClient from './_components/admin-gallery-client';

export default function Page() {
  return (
    <Suspense>
      <AdminGalleryClient />
    </Suspense>
  );
}
