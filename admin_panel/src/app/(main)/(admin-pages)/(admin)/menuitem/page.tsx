import { Suspense } from 'react';
import AdminMenuItemClient from './_components/admin-menuitem-client';

export default function Page() {
  return (
    <Suspense>
      <AdminMenuItemClient />
    </Suspense>
  );
}
