'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  useAdminB2bOrderDetailQuery,
  useAdminB2bOrderStatusMutation,
  useAdminB2bOrderSellerMutation,
  useAdminB2bOrderDeleteMutation,
  useAdminB2bOrderRefundMutation,
} from '@/integrations/hooks';

const STATUSES = ['pending', 'confirmed', 'shipped', 'completed', 'cancelled'] as const;

function moneyTr(s: string) {
  const n = Number.parseFloat(s);
  if (Number.isNaN(n)) return s;
  return n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
}

export default function AdminOrderDetailClient() {
  const t = useAdminT('admin.b2b.orders');
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';

  const q = useAdminB2bOrderDetailQuery(id, { skip: !id });
  const [status, setStatus] = React.useState<string>('');
  const [sellerId, setSellerId] = React.useState('');

  React.useEffect(() => {
    if (q.data?.status) setStatus(q.data.status);
    if (q.data?.seller_id != null) setSellerId(q.data.seller_id);
    else setSellerId('');
  }, [q.data?.status, q.data?.seller_id]);

  const [patchStatus, patchStatusState] = useAdminB2bOrderStatusMutation();
  const [patchSeller, patchSellerState] = useAdminB2bOrderSellerMutation();
  const [del, delState] = useAdminB2bOrderDeleteMutation();
  const [refund, refundState] = useAdminB2bOrderRefundMutation();

  React.useEffect(() => {
    if (q.isError) toast.error(t('loadError'));
  }, [q.isError, t]);

  async function onSaveStatus() {
    if (!id || !status) return;
    try {
      await patchStatus({ id, status }).unwrap();
      toast.success(t('saved'));
    } catch {
      toast.error(t('loadError'));
    }
  }

  async function onSaveSeller() {
    if (!id) return;
    const raw = sellerId.trim();
    try {
      await patchSeller({ id, seller_id: raw === '' ? null : raw }).unwrap();
      toast.success(t('saved'));
    } catch {
      toast.error(t('loadError'));
    }
  }

  async function onDelete() {
    if (!id || !window.confirm(t('confirmDelete'))) return;
    try {
      await del(id).unwrap();
      toast.success(t('deleted'));
      window.location.href = '/orders';
    } catch {
      toast.error(t('loadError'));
    }
  }

  async function onRefund() {
    if (!id || !window.confirm(t('confirmRefund'))) return;
    const reason = window.prompt(t('refundReasonPrompt'))?.trim();
    try {
      await refund({ id, reason }).unwrap();
      toast.success(t('refunded'));
    } catch {
      toast.error(t('refundError'));
    }
  }

  if (!id) return null;

  if (q.isLoading || !q.data) {
    return <p className="text-muted-foreground p-6 text-sm">{t('loading')}</p>;
  }

  const o = q.data;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('detailTitle')}</h1>
          <p className="font-mono text-xs text-muted-foreground">{o.id}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/orders">{t('back')}</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('changeStatus')}</CardTitle>
            <CardDescription />
          </CardHeader>
          <CardContent className="flex flex-wrap items-end gap-3">
            <div className="space-y-2">
              <Label>{t('colStatus')}</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {t(`status.${s}` as 'status.pending')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="button" onClick={() => void onSaveStatus()} disabled={patchStatusState.isLoading}>
              {patchStatusState.isLoading ? t('saving') : t('saveStatus')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('sellerLabel')}</CardTitle>
            <CardDescription />
          </CardHeader>
          <CardContent className="flex flex-wrap items-end gap-3">
            <div className="min-w-[240px] flex-1 space-y-2">
              <Label htmlFor="seller">UUID</Label>
              <Input
                id="seller"
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                placeholder={t('sellerPlaceholder')}
              />
            </div>
            <Button type="button" variant="secondary" onClick={() => void onSaveSeller()} disabled={patchSellerState.isLoading}>
              {t('saveSeller')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('lines')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('colProduct')}</TableHead>
                <TableHead>{t('colQty')}</TableHead>
                <TableHead>{t('colLine')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {o.items.map((it) => (
                <TableRow key={it.id}>
                  <TableCell>{it.product_title ?? it.product_id.slice(0, 8)}</TableCell>
                  <TableCell>{it.quantity}</TableCell>
                  <TableCell>{moneyTr(it.total_price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
        <span>
          {t('colDealer')}: {o.dealer_name || o.dealer_id}
        </span>
        <span>
          {t('colTotal')}: {moneyTr(o.total)}
        </span>
        <span>
          {t('colPayment')}: {t(`pay.${o.payment_status}` as 'pay.unpaid')}
        </span>
        {o.payment_ref ? (
          <span>
            <Link href={`/orders/payment-attempts/${encodeURIComponent(o.payment_ref)}`} className="hover:underline">
              {t('attemptLink')}
            </Link>
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" asChild>
          <Link href="/orders/payment-attempts">{t('attemptsTitle')}</Link>
        </Button>
        {o.payment_method === 'dealer_credit' && o.payment_status === 'paid' ? (
          <Button type="button" variant="secondary" onClick={() => void onRefund()} disabled={refundState.isLoading}>
            {refundState.isLoading ? t('saving') : t('refund')}
          </Button>
        ) : null}
        <Button type="button" variant="destructive" onClick={() => void onDelete()} disabled={delState.isLoading}>
          {t('delete')}
        </Button>
      </div>
    </div>
  );
}
