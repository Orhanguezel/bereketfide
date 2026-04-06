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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useAdminT } from '@/app/(main)/(admin-pages)/_components/common/useAdminT';
import { useAdminB2bDealersListQuery } from '@/integrations/hooks';

function moneyTr(s: string) {
  const n = Number.parseFloat(s);
  if (Number.isNaN(n)) return s;
  return n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
}

export default function AdminDealersListClient() {
  const t = useAdminT('admin.b2b.dealers');
  const [search, setSearch] = React.useState('');
  const [debounced, setDebounced] = React.useState('');
  const [approved, setApproved] = React.useState<string>('all');

  React.useEffect(() => {
    const h = window.setTimeout(() => setDebounced(search.trim()), 300);
    return () => window.clearTimeout(h);
  }, [search]);

  const isApprovedParam =
    approved === 'all' ? undefined : approved === 'yes' ? 1 : 0;

  const q = useAdminB2bDealersListQuery(
    { page: 1, limit: 50, search: debounced || undefined, is_approved: isApprovedParam },
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
          <p className="text-muted-foreground mt-2 max-w-xl text-xs">{t('pendingHint')}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void q.refetch()} disabled={q.isFetching}>
          <RefreshCcw className="mr-2 size-4" />
          {t('refresh')}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('search')}</CardTitle>
          <CardDescription />
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Input
            className="max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search')}
          />
          <Select value={approved} onValueChange={setApproved}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('approvedAll')}</SelectItem>
              <SelectItem value="yes">{t('approvedYes')}</SelectItem>
              <SelectItem value="no">{t('approvedNo')}</SelectItem>
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
                  <TableHead>{t('colCompany')}</TableHead>
                  <TableHead>{t('colBalance')}</TableHead>
                  <TableHead>{t('colLimit')}</TableHead>
                  <TableHead>{t('colApproved')}</TableHead>
                  <TableHead className="text-right">{t('colActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="max-w-[200px] truncate font-medium">
                      {d.company_name || d.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>{moneyTr(d.current_balance)}</TableCell>
                    <TableCell>{moneyTr(d.credit_limit)}</TableCell>
                    <TableCell>{d.is_approved ? t('yes') : t('no')}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="link" className="h-auto p-0" asChild>
                        <Link href={`/dealers/${encodeURIComponent(d.id)}`}>{t('detail')}</Link>
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
