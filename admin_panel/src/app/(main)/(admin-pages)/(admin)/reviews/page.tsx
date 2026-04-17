import { Suspense } from 'react';
import AdminReviewsClient from './_components/admin-reviews-client';

export default function Page() {
  return (
    <Suspense>
      <AdminReviewsClient />
    </Suspense>
  );
}
