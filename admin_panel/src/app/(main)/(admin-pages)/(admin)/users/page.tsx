import { Suspense } from 'react';
import UsersListClient from './_components/users-list-client';

export default function Page() {
  return (
    <Suspense>
      <UsersListClient />
    </Suspense>
  );
}
