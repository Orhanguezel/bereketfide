'use client';

import * as React from 'react';
import Link from 'next/link';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useAdminT } from '@/app/(main)/(admin-pages)/_components/common/useAdminT';
import { useAdminB2bOrdersListQuery } from '@/integrations/hooks';

const STATUSES = ['pending', 'confirmed', 'shipped', 'completed', 'cancelled'] as const;

function moneyTr(s: string) {
  const n = Number.parseFloat(s);
  if (Number.isNaN(n)) return s;
  return n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
}

export default function AdminOrdersListClient() {
  const t = useAdminT('admin.b2b.orders');
  const [status, setStatus] = React.useState<string>('');

  const q = useAdminB2bOrdersListQuery(
    { page: 1, limit: 50, status: status || undefined },
    { refetchOnMountOrArgChange: true },
  );

  React.useEffect(() => {
    if (q.isError) toast.error(t('loadError'));
  }, [q.isError, t]);

  const rows = q.data?.data ?? [];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href="/orders/payment-attempts">{t('attemptsTitle')}</Link>
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => void q.refetch()} disabled={q.isFetching}>
            <RefreshCcw className="mr-2 size-4" />
            {t('refresh')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('filterStatus')}</CardTitle>
          <CardDescription />
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Select value={status || 'all'} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t('filterAll')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filterAll')}</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {t(`status.${s}` as 'status.pending')}
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
                  <TableHead>{t('colDate')}</TableHead>
                  <TableHead>{t('colDealer')}</TableHead>
                  <TableHead>{t('colTotal')}</TableHead>
                  <TableHead>{t('colStatus')}</TableHead>
                  <TableHead>{t('colPayment')}</TableHead>
                  <TableHead className="text-right">{t('colActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {o.created_at?.slice(0, 19)?.replace('T', ' ')}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-sm">{o.dealer_name || o.dealer_id}</TableCell>
                    <TableCell className="font-medium">{moneyTr(o.total)}</TableCell>
                    <TableCell>{t(`status.${o.status}` as 'status.pending')}</TableCell>
                    <TableCell className="text-sm">{t(`pay.${o.payment_status}` as 'pay.unpaid')}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="link" className="h-auto p-0" asChild>
                        <Link href={`/orders/${encodeURIComponent(o.id)}`}>{t('detail')}</Link>
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
