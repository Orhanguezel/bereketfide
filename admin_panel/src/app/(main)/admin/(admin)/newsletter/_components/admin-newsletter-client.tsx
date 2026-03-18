'use client';

// =============================================================
// FILE: src/app/(main)/admin/(admin)/newsletter/_components/admin-newsletter-client.tsx
// FINAL — Admin Newsletter Subscribers (App Router + shadcn)
// =============================================================

import * as React from 'react';
import { toast } from 'sonner';
import { RefreshCcw, Search, Trash2, Pencil, CheckCircle2, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';

import type { NewsletterAdminSubscriber, NewsletterAdminListParams } from '@/integrations/shared';
import {
  useListNewsletterAdminQuery,
  useUpdateNewsletterAdminMutation,
  useRemoveNewsletterAdminMutation,
} from '@/integrations/hooks';

type Filters = {
  search: string;
  verified: 'all' | 'yes' | 'no';
  subscribed: 'all' | 'yes' | 'no';
  orderBy: 'created_at' | 'updated_at' | 'email';
  order: 'asc' | 'desc';
};

function formatYmd(v: unknown): string {
  if (!v) return '';
  if (typeof v === 'string') return v.slice(0, 10);
  if (v instanceof Date && typeof v.toISOString === 'function') return v.toISOString().slice(0, 10);
  return '';
}

export default function AdminNewsletterClient() {
  const t = useAdminT('admin.newsletter');

  const [filters, setFilters] = React.useState<Filters>({
    search: '',
    verified: 'all',
    subscribed: 'all',
    orderBy: 'created_at',
    order: 'desc',
  });

  const listParams = React.useMemo((): NewsletterAdminListParams => ({
    q: filters.search.trim() || undefined,
    verified: filters.verified === 'all' ? undefined : (filters.verified === 'yes' ? 1 : 0),
    subscribed: filters.subscribed === 'all' ? undefined : (filters.subscribed === 'yes' ? 1 : 0),
    orderBy: filters.orderBy,
    order: filters.order,
    limit: 200,
    offset: 0,
  }), [filters]);

  const listQ = useListNewsletterAdminQuery(listParams, { refetchOnMountOrArgChange: true });

  const rows = React.useMemo(() => {
    return Array.isArray(listQ.data?.data) ? listQ.data!.data : [];
  }, [listQ.data]);

  const [updateSubscriber, updateState] = useUpdateNewsletterAdminMutation();
  const [removeSubscriber, removeState] = useRemoveNewsletterAdminMutation();

  const listBusy = listQ.isLoading || listQ.isFetching;
  const busy = listBusy || updateState.isLoading || removeState.isLoading;

  const [editOpen, setEditOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<NewsletterAdminSubscriber | null>(null);
  const [editFields, setEditFields] = React.useState({
    verified: false,
    subscribed: false,
    meta: '',
  });

  function openEdit(item: NewsletterAdminSubscriber) {
    setSelected(item);
    setEditFields({
      verified: !!item.is_verified,
      subscribed: !!item.is_subscribed,
      meta: item.meta ? JSON.stringify(item.meta, null, 2) : '',
    });
    setEditOpen(true);
  }

  function closeEdit() {
    if (busy) return;
    setEditOpen(false);
    setSelected(null);
  }

  async function onSaveEdit() {
    if (!selected) return;
    try {
      let parsedMeta = null;
      if (editFields.meta.trim()) {
        parsedMeta = JSON.parse(editFields.meta);
      }

      await updateSubscriber({
        id: selected.id,
        body: {
          verified: editFields.verified,
          subscribed: editFields.subscribed,
          meta: parsedMeta,
        },
      }).unwrap();
      toast.success(t('messages.saved'));
      closeEdit();
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        toast.error('Geçersiz JSON formatı.');
      } else {
        toast.error(err?.data?.error?.message || err?.message || t('messages.saveError'));
      }
    }
  }

  async function onDelete(item: NewsletterAdminSubscriber) {
    const msg = t('confirmDelete', {
      email: item.email,
      id: item.id,
    });
    if (!window.confirm(msg)) return;

    try {
      await removeSubscriber({ id: item.id }).unwrap();
      toast.success(t('messages.deleted'));
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || t('messages.deleteError'));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{t('header.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('header.subtitle')}</p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => listQ.refetch()}
          disabled={busy}
        >
          <RefreshCcw className="mr-2 size-4" />
          {t('admin.common.refresh')}
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-base">{t('filters.title')}</CardTitle>
          <CardDescription>{t('filters.description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-2">
            <Label>{t('admin.common.search')}</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={filters.search}
                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                placeholder={t('filters.searchPlaceholder')}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('filters.verifiedLabel')}</Label>
            <Select
              value={filters.verified}
              onValueChange={(v) => setFilters((p) => ({ ...p, verified: v as Filters['verified'] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.verifiedAll')}</SelectItem>
                <SelectItem value="yes">{t('filters.verifiedYes')}</SelectItem>
                <SelectItem value="no">{t('filters.verifiedNo')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('filters.subscribedLabel')}</Label>
            <Select
              value={filters.subscribed}
              onValueChange={(v) => setFilters((p) => ({ ...p, subscribed: v as Filters['subscribed'] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.subscribedAll')}</SelectItem>
                <SelectItem value="yes">{t('filters.subscribedYes')}</SelectItem>
                <SelectItem value="no">{t('filters.subscribedNo')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('filters.orderByLabel')}</Label>
            <Select
              value={filters.orderBy}
              onValueChange={(v) => setFilters((p) => ({ ...p, orderBy: v as Filters['orderBy'] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">{t('filters.orderByCreated')}</SelectItem>
                <SelectItem value="updated_at">{t('filters.orderByUpdated')}</SelectItem>
                <SelectItem value="email">{t('filters.orderByEmail')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('admin.common.orderLabel')}</Label>
            <Select
              value={filters.order}
              onValueChange={(v) => setFilters((p) => ({ ...p, order: v as Filters['order'] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">{t('admin.common.orderDesc')}</SelectItem>
                <SelectItem value="asc">{t('admin.common.orderAsc')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-base">{t('list.title')}</CardTitle>
          <CardDescription>{t('list.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('columns.email')}</TableHead>
                <TableHead>{t('columns.verified')}</TableHead>
                <TableHead>{t('columns.subscribed')}</TableHead>
                <TableHead>{t('columns.createdAt')}</TableHead>
                <TableHead className="text-right">{t('admin.common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && listBusy && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    {t('list.loading')}
                  </TableCell>
                </TableRow>
              )}

              {rows.length === 0 && !listBusy && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    {t('list.empty')}
                  </TableCell>
                </TableRow>
              )}

              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.email}</TableCell>
                  <TableCell>
                    {item.is_verified ? (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="size-3" />
                        {t('status.verified')}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-muted-foreground">
                        <XCircle className="size-3" />
                        {t('status.unverified')}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.is_subscribed ? (
                      <Badge className="bg-green-600 hover:bg-green-700">{t('status.active')}</Badge>
                    ) : (
                      <Badge variant="destructive">{t('status.unsubscribed')}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatYmd(item.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(item)}
                        disabled={busy}
                      >
                        <Pencil className="mr-2 size-4" />
                        {t('admin.common.edit')}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(item)}
                        disabled={busy}
                      >
                        <Trash2 className="mr-2 size-4" />
                        {t('admin.common.delete')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={(v) => (v ? null : closeEdit())}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('editDialog.title')}</DialogTitle>
            <DialogDescription>{t('editDialog.description')}</DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="grid gap-4 py-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">E-posta</Label>
                <div className="font-medium">{selected.email}</div>
              </div>

              <div className="flex flex-wrap gap-6 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="verified-switch"
                    checked={editFields.verified}
                    onCheckedChange={(v) => setEditFields(p => ({ ...p, verified: v }))}
                  />
                  <Label htmlFor="verified-switch">{t('editDialog.verifiedLabel')}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="subscribed-switch"
                    checked={editFields.subscribed}
                    onCheckedChange={(v) => setEditFields(p => ({ ...p, subscribed: v }))}
                  />
                  <Label htmlFor="subscribed-switch">{t('editDialog.subscribedLabel')}</Label>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <Label>{t('editDialog.metaLabel')}</Label>
                <Textarea
                  value={editFields.meta}
                  onChange={(e) => setEditFields(p => ({ ...p, meta: e.target.value }))}
                  placeholder='{ "source": "web", "ip": "..." }'
                  rows={6}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeEdit} disabled={busy}>
              {t('admin.common.cancel')}
            </Button>
            <Button onClick={onSaveEdit} disabled={busy || !selected}>
              {t('admin.common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
