import { Suspense } from 'react';
import AdminInventoryClient from './admin-inventory-client';

export default function Page() {
  return (
    <Suspense>
      <AdminInventoryClient />
    </Suspense>
  );
}
