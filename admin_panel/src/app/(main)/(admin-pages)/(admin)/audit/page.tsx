import { Suspense } from 'react';
import AdminAuditClient from './admin-audit-client';

export default function Page() {
  return (
    <Suspense>
      <AdminAuditClient />
    </Suspense>
  );
}
