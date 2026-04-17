import { Suspense } from 'react';
import AdminSiteSettingsClient from './_components/admin-site_settings-client';

export default function Page() {
  return (
    <Suspense>
      <AdminSiteSettingsClient />
    </Suspense>
  );
}
