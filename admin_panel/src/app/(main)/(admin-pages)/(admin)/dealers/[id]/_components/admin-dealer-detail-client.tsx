'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  useAdminB2bDealerDetailQuery,
  useAdminB2bDealerSummaryQuery,
  useAdminB2bDealerTransactionsQuery,
  useAdminB2bDealerUpdateMutation,
  useAdminB2bDealerCreateTxMutation,
} from '@/integrations/hooks';

const TX_TYPES = ['payment', 'adjustment', 'refund', 'order'] as const;

function moneyTr(s: string | number) {
  const n = typeof s === 'number' ? s : Number.parseFloat(s);
  if (Number.isNaN(n)) return String(s);
  return n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
}

export default function AdminDealerDetailClient() {
  const t = useAdminT('admin.b2b.dealers');
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';

  const profileQ = useAdminB2bDealerDetailQuery(id, { skip: !id });
  const sumQ = useAdminB2bDealerSummaryQuery(id, { skip: !id });
  const txQ = useAdminB2bDealerTransactionsQuery({ id, page: 1, limit: 50 }, { skip: !id });

  const [company, setCompany] = React.useState('');
  const [taxNumber, setTaxNumber] = React.useState('');
  const [taxOffice, setTaxOffice] = React.useState('');
  const [creditLimit, setCreditLimit] = React.useState('');
  const [discountRate, setDiscountRate] = React.useState('');
  const [approved, setApproved] = React.useState(false);

  const [txType, setTxType] = React.useState<(typeof TX_TYPES)[number]>('payment');
  const [txAmount, setTxAmount] = React.useState('');
  const [txDesc, setTxDesc] = React.useState('');

  React.useEffect(() => {
    const p = profileQ.data;
    if (!p) return;
    setCompany(p.company_name ?? '');
    setTaxNumber(p.tax_number ?? '');
    setTaxOffice(p.tax_office ?? '');
    setCreditLimit(p.credit_limit ?? '0');
    setDiscountRate(p.discount_rate ?? '0');
    setApproved(p.is_approved === 1);
  }, [profileQ.data]);

  const [updateProfile, updateState] = useAdminB2bDealerUpdateMutation();
  const [createTx, createTxState] = useAdminB2bDealerCreateTxMutation();

  React.useEffect(() => {
    if (profileQ.isError || sumQ.isError || txQ.isError) toast.error(t('loadError'));
  }, [profileQ.isError, sumQ.isError, txQ.isError, t]);

  async function onSaveProfile() {
    if (!id) return;
    try {
      await updateProfile({
        id,
        body: {
          company_name: company.trim() || undefined,
          tax_number: taxNumber.trim() || undefined,
          tax_office: taxOffice.trim() || undefined,
          credit_limit: creditLimit.trim(),
          discount_rate: discountRate.trim(),
          is_approved: approved ? 1 : 0,
        },
      }).unwrap();
      toast.success(t('savedProfile'));
      void sumQ.refetch();
      void profileQ.refetch();
    } catch {
      toast.error(t('loadError'));
    }
  }

  async function onAddTx() {
    if (!id || !txAmount.trim()) return;
    try {
      await createTx({
        id,
        body: {
          type: txType,
          amount: txAmount.trim(),
          description: txDesc.trim() || undefined,
        },
      }).unwrap();
      toast.success(t('savedTx'));
      setTxAmount('');
      setTxDesc('');
      void txQ.refetch();
      void sumQ.refetch();
      void profileQ.refetch();
    } catch {
      toast.error(t('loadError'));
    }
  }

  if (!id) return null;

  if (profileQ.isLoading || !profileQ.data) {
    return <p className="text-muted-foreground p-6 text-sm">{t('loading')}</p>;
  }

  const p = profileQ.data;
  const s = sumQ.data;
  const txs = txQ.data?.data ?? [];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('detailTitle')}</h1>
          <p className="text-muted-foreground font-mono text-xs">{p.id}</p>
          <p className="text-muted-foreground mt-1 text-xs">
            {t('userId')}: {p.user_id}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dealers">{t('back')}</Link>
        </Button>
      </div>

      {s ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('summary')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-muted-foreground">{t('colLimit')}</div>
              <div className="font-semibold">{moneyTr(s.credit_limit)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">{t('colBalance')}</div>
              <div className="font-semibold">{moneyTr(s.current_balance)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">{t('discountRate')}</div>
              <div className="font-semibold">{s.discount_rate}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">{t('warnings')}</div>
              <div className="font-semibold">{s.warnings?.join(', ') || '—'}</div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('profileForm')}</CardTitle>
          <CardDescription />
        </CardHeader>
        <CardContent className="grid max-w-xl gap-4">
          <div className="space-y-2">
            <Label>{t('company')}</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('taxNumber')}</Label>
              <Input value={taxNumber} onChange={(e) => setTaxNumber(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t('taxOffice')}</Label>
              <Input value={taxOffice} onChange={(e) => setTaxOffice(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('creditLimit')}</Label>
              <Input value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t('discountRate')}</Label>
              <Input value={discountRate} onChange={(e) => setDiscountRate(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="appr" checked={approved} onCheckedChange={setApproved} />
            <Label htmlFor="appr">{t('approvedSwitch')}</Label>
          </div>
          <Button type="button" onClick={() => void onSaveProfile()} disabled={updateState.isLoading}>
            {t('saveProfile')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('addTx')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <Label>{t('txType')}</Label>
            <Select value={txType} onValueChange={(v) => setTxType(v as (typeof TX_TYPES)[number])}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TX_TYPES.map((tp) => (
                  <SelectItem key={tp} value={tp}>
                    {t(`txTypes.${tp}` as 'txTypes.payment')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[140px] space-y-2">
            <Label>{t('txAmount')}</Label>
            <Input value={txAmount} onChange={(e) => setTxAmount(e.target.value)} placeholder="-100.50" />
          </div>
          <div className="min-w-[200px] flex-1 space-y-2">
            <Label>{t('txDesc')}</Label>
            <Input value={txDesc} onChange={(e) => setTxDesc(e.target.value)} />
          </div>
          <Button type="button" onClick={() => void onAddTx()} disabled={createTxState.isLoading}>
            {t('txSubmit')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('txTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {txQ.isLoading ? (
            <p className="text-muted-foreground p-6 text-sm">{t('loading')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('colDate')}</TableHead>
                  <TableHead>{t('colType')}</TableHead>
                  <TableHead>{t('colAmount')}</TableHead>
                  <TableHead>{t('colBalanceAfter')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txs.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                      {row.created_at?.slice(0, 19)?.replace('T', ' ')}
                    </TableCell>
                    <TableCell>{t(`txTypes.${row.type}` as 'txTypes.payment')}</TableCell>
                    <TableCell>{moneyTr(row.amount)}</TableCell>
                    <TableCell>{moneyTr(row.balance_after)}</TableCell>
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
