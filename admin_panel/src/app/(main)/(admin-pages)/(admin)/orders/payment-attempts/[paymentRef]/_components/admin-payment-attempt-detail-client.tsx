'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminT } from '@/app/(main)/(admin-pages)/_components/common/useAdminT';
import { useAdminB2bPaymentAttemptDetailQuery } from '@/integrations/hooks';

function prettyJson(input: string | null) {
  if (!input) return '—';
  try {
    return JSON.stringify(JSON.parse(input), null, 2);
  } catch {
    return input;
  }
}

export default function AdminPaymentAttemptDetailClient() {
  const t = useAdminT('admin.b2b.orders');
  const params = useParams();
  const paymentRef = typeof params?.paymentRef === 'string' ? params.paymentRef : '';

  const q = useAdminB2bPaymentAttemptDetailQuery(paymentRef, { skip: !paymentRef });

  React.useEffect(() => {
    if (q.isError) toast.error(t('attemptsLoadError'));
  }, [q.isError, t]);

  if (!paymentRef) return null;
  if (q.isLoading || !q.data) {
    return <p className="text-muted-foreground p-6 text-sm">{t('loading')}</p>;
  }

  const row = q.data;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('attemptDetailTitle')}</h1>
          <p className="font-mono text-xs text-muted-foreground">{row.payment_ref}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/orders/${encodeURIComponent(row.order_id)}`}>{t('attemptGoOrder')}</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders/payment-attempts">{t('back')}</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('attemptMetaTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
          <div><strong>{t('attemptsColOrder')}:</strong> {row.order_id}</div>
          <div><strong>{t('attemptsColProvider')}:</strong> {row.provider}</div>
          <div><strong>{t('attemptsColStatus')}:</strong> {t(`attemptStatus.${row.status}` as 'attemptStatus.pending')}</div>
          <div><strong>{t('attemptsColAmount')}:</strong> {row.amount}</div>
          <div><strong>{t('colPayment')}:</strong> {row.order_payment_status}</div>
          <div><strong>{t('attemptsColError')}:</strong> {row.last_error || '—'}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">{t('attemptRequestTitle')}</CardTitle></CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">{prettyJson(row.request_payload)}</pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">{t('attemptResponseTitle')}</CardTitle></CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">{prettyJson(row.response_payload)}</pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">{t('attemptCallbackTitle')}</CardTitle></CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">{prettyJson(row.callback_payload)}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
