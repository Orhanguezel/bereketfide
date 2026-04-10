'use client';

import * as React from 'react';
import Link from 'next/link';
import { RefreshCcw, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
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

  const stats = React.useMemo(() => {
    const counts = { succeeded: 0, failed: 0, expired: 0, pending: 0 };
    const providerMap: Record<string, number> = {};
    for (const r of rows) {
      if (r.status in counts) counts[r.status as keyof typeof counts]++;
      providerMap[r.provider] = (providerMap[r.provider] ?? 0) + 1;
    }
    const providers = Object.entries(providerMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    return { counts, providers, total: rows.length };
  }, [rows]);

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

      {rows.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('statsTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <CheckCircle2 className="size-5 shrink-0 text-green-500" />
                <div>
                  <p className="text-lg font-bold leading-none">{stats.counts.succeeded}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">{t('statsSucceeded')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <XCircle className="size-5 shrink-0 text-red-500" />
                <div>
                  <p className="text-lg font-bold leading-none">{stats.counts.failed}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">{t('statsFailed')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <Clock className="size-5 shrink-0 text-amber-500" />
                <div>
                  <p className="text-lg font-bold leading-none">{stats.counts.expired}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">{t('statsExpired')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <AlertCircle className="size-5 shrink-0 text-blue-500" />
                <div>
                  <p className="text-lg font-bold leading-none">{stats.counts.pending}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">{t('statsPending')}</p>
                </div>
              </div>
            </div>
            {stats.providers.length > 0 && (
              <div className="mt-3">
                <p className="text-muted-foreground mb-2 text-xs font-medium">{t('statsProviders')}</p>
                <div className="flex flex-wrap gap-2">
                  {stats.providers.map(([prov, cnt]) => (
                    <span key={prov} className="bg-muted rounded-md px-2 py-0.5 text-xs">
                      {prov}: {cnt}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-muted-foreground mt-3 text-xs">{t('statsNote', { count: stats.total })}</p>
          </CardContent>
        </Card>
      )}

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
