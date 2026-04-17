import { Suspense } from 'react';
import AdminEmailTemplatesClient from './_components/admin-email-templates-client';

export default function Page() {
  return (
    <Suspense>
      <AdminEmailTemplatesClient />
    </Suspense>
  );
}
