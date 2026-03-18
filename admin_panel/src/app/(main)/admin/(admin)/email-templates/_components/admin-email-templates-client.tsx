'use client';

// =============================================================
// FILE: src/app/(main)/admin/(admin)/email-templates/_components/admin-email-templates-client.tsx
// FINAL — Admin Email Templates List (App Router + shadcn)
// =============================================================

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { RefreshCcw, Search, Plus, Pencil, Trash2, Mail, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';
import {
  useListEmailTemplatesAdminQuery,
  useDeleteEmailTemplateAdminMutation,
} from '@/integrations/hooks';
import type { EmailTemplateAdminListItemDto } from '@/integrations/shared';

export default function AdminEmailTemplatesClient() {
  const t = useAdminT('admin.email_templates');
  const [search, setSearch] = React.useState('');

  const listQ = useListEmailTemplatesAdminQuery(
    { q: search.trim() || undefined },
    { refetchOnMountOrArgChange: true }
  );

  const [deleteTemplate, deleteState] = useDeleteEmailTemplateAdminMutation();

  const rows = React.useMemo(() => {
    return Array.isArray(listQ.data) ? listQ.data : [];
  }, [listQ.data]);

  const busy = listQ.isLoading || listQ.isFetching || deleteState.isLoading;

  async function onDelete(item: EmailTemplateAdminListItemDto) {
    const msg = t('confirmDelete', {
      key: item.template_key,
      id: item.id,
    });
    if (!window.confirm(msg)) return;

    try {
      await deleteTemplate({ id: item.id }).unwrap();
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

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => listQ.refetch()}
            disabled={busy}
          >
            <RefreshCcw className={`mr-2 size-4 ${listQ.isFetching ? 'animate-spin' : ''}`} />
            {t('admin.common.refresh') || 'Yenile'}
          </Button>
          <Link href="/admin/email-templates/new">
            <Button size="sm">
              <Plus className="mr-2 size-4" />
              {t('admin.common.create') || 'Oluştur'}
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('filters.searchPlaceholder')}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('columns.key')}</TableHead>
                <TableHead>{t('columns.name')}</TableHead>
                <TableHead>{t('columns.subject')}</TableHead>
                <TableHead>{t('columns.locale')}</TableHead>
                <TableHead>{t('columns.status')}</TableHead>
                <TableHead className="text-right">{t('admin.common.actions') || 'İşlemler'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && listQ.isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    {t('list.loading')}
                  </TableCell>
                </TableRow>
              )}

              {rows.length === 0 && !listQ.isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    {t('list.empty')}
                  </TableCell>
                </TableRow>
              )}

              {rows.map((item) => (
                <TableRow key={`${item.id}-${item.locale}`}>
                  <TableCell className="font-mono text-xs font-medium">
                    {item.template_key}
                  </TableCell>
                  <TableCell>{item.template_name || '-'}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={item.subject || ''}>
                    {item.subject || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase">
                      {item.locale || 'tr'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.is_active ? (
                      <Badge className="bg-green-600 hover:bg-green-700">Aktif</Badge>
                    ) : (
                      <Badge variant="destructive">Pasif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/email-templates/${item.id}?locale=${item.locale}`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="mr-2 size-4" />
                          {t('admin.common.edit') || 'Düzenle'}
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(item)}
                        disabled={busy}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
