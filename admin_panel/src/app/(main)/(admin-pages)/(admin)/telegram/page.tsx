import { Suspense } from 'react';
import AdminTelegramClient from './_components/admin-telegram-client';

export default function Page() {
  return (
    <Suspense>
      <AdminTelegramClient />
    </Suspense>
  );
}
