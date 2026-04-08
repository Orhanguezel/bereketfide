'use client';

import * as React from 'react';
import Link from 'next/link';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminT } from '@/app/(main)/(admin-pages)/_components/common/useAdminT';
import { useAdminB2bPaymentAttemptsListQuery } from '@/integrations/hooks';

const ATTEMPT_STATUSES = ['pending', 'succeeded', 'failed', 'expired'] as const;

function moneyTr(s: string) {
  const n = Number.parseFloat(s);
  if (Number.isNaN(n)) return s;
  return n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
}

export default function AdminPaymentAttemptsListClient() {
  const t = useAdminT('admin.b2b.orders');
  const [status, setStatus] = React.useState('');
  const [provider, setProvider] = React.useState('');
  const [orderId, setOrderId] = React.useState('');

  const q = useAdminB2bPaymentAttemptsListQuery(
    {
      page: 1,
      limit: 50,
      status: status || undefined,
      provider: provider || undefined,
      order_id: orderId.trim() || undefined,
    },
    { refetchOnMountOrArgChange: true },
  );

  React.useEffect(() => {
    if (q.isError) toast.error(t('attemptsLoadError'));
  }, [q.isError, t]);

  const rows = q.data?.data ?? [];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('attemptsTitle')}</h1>
          <p className="text-muted-foreground text-sm">{t('attemptsSubtitle')}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void q.refetch()} disabled={q.isFetching}>
          <RefreshCcw className="mr-2 size-4" />
          {t('refresh')}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('attemptsFilters')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Input
            className="w-[260px]"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder={t('attemptsOrderPlaceholder')}
          />
          <Input
            className="w-[180px]"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder={t('attemptsProviderPlaceholder')}
          />
          <Select value={status || 'all'} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('attemptsStatusAll')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('attemptsStatusAll')}</SelectItem>
              {ATTEMPT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {t(`attemptStatus.${s}` as 'attemptStatus.pending')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {q.isLoading ? (
            <p className="text-muted-foreground p-6 text-sm">{t('loading')}</p>
          ) : rows.length === 0 ? (
            <p className="text-muted-foreground p-6 text-sm">{t('empty')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('attemptsColDate')}</TableHead>
                  <TableHead>{t('attemptsColOrder')}</TableHead>
                  <TableHead>{t('attemptsColProvider')}</TableHead>
                  <TableHead>{t('attemptsColAmount')}</TableHead>
                  <TableHead>{t('attemptsColStatus')}</TableHead>
                  <TableHead>{t('attemptsColError')}</TableHead>
                  <TableHead className="text-right">{t('colActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {row.created_at?.slice(0, 19)?.replace('T', ' ')}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      <Link href={`/orders/${encodeURIComponent(row.order_id)}`} className="hover:underline">
                        {row.order_id.slice(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell>{row.provider}</TableCell>
                    <TableCell>{moneyTr(row.amount)}</TableCell>
                    <TableCell>{t(`attemptStatus.${row.status}` as 'attemptStatus.pending')}</TableCell>
                    <TableCell className="max-w-[220px] truncate text-sm text-muted-foreground">
                      {row.last_error || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="link" className="h-auto p-0" asChild>
                        <Link href={`/orders/payment-attempts/${encodeURIComponent(row.payment_ref)}`}>{t('detail')}</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
