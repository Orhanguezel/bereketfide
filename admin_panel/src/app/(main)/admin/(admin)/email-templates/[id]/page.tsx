// =============================================================
// FILE: src/app/(main)/admin/(admin)/email-templates/[id]/page.tsx
// FINAL — Admin Email Template Detail Page (App Router wrapper)
// =============================================================

import AdminEmailTemplateDetailClient from '../_components/admin-email-template-detail-client';

type Params = { id: string };

export default async function Page({ params }: { params: Promise<Params> | Params }) {
  const p = (await params) as Params;
  return <AdminEmailTemplateDetailClient id={p.id} />;
}
