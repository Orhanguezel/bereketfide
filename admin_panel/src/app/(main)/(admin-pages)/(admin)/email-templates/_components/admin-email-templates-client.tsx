'use client';

// =============================================================
// Admin Email Templates List — with locale switcher
// =============================================================

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { RefreshCcw, Search, Plus, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useAdminT } from '@/app/(main)/(admin-pages)/_components/common/useAdminT';
import { useAdminLocales } from '@/app/(main)/(admin-pages)/_components/common/useAdminLocales';
import { AdminLocaleSelect } from '@/app/(main)/(admin-pages)/_components/common/AdminLocaleSelect';
import { resolveAdminApiLocale } from '@/i18n/adminLocale';

import {
  useListEmailTemplatesAdminQuery,
  useDeleteEmailTemplateAdminMutation,
} from '@/integrations/hooks';
import type { EmailTemplateAdminListItemDto } from '@/integrations/shared';

export default function AdminEmailTemplatesClient() {
  const t = useAdminT('admin.email_templates');

  const { localeOptions, defaultLocaleFromDb, loading: localesLoading } = useAdminLocales();
  const apiLocale = React.useMemo(
    () => resolveAdminApiLocale(localeOptions as any, defaultLocaleFromDb, 'tr'),
    [localeOptions, defaultLocaleFromDb],
  );
  const [activeLocale, setActiveLocale] = React.useState(apiLocale || 'tr');
  const effectiveLocale = activeLocale || apiLocale || 'tr';

  const [search, setSearch] = React.useState('');

  const listQ = useListEmailTemplatesAdminQuery(
    { q: search.trim() || undefined, locale: effectiveLocale } as any,
    { refetchOnMountOrArgChange: true },
  );

  const [deleteTemplate, deleteState] = useDeleteEmailTemplateAdminMutation();

  const rows = React.useMemo(() => {
    return Array.isArray(listQ.data) ? listQ.data : [];
  }, [listQ.data]);

  const busy = listQ.isLoading || listQ.isFetching || deleteState.isLoading;

  async function onDelete(item: EmailTemplateAdminListItemDto) {
    if (!window.confirm(`"${item.template_key}" şablonunu silmek istiyor musunuz?`)) return;
    try {
      await deleteTemplate({ id: item.id }).unwrap();
      toast.success(t('messages.deleted'));
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || t('messages.deleteError'));
    }
  }

  const localesForSelect = React.useMemo(() => {
    return (localeOptions || []).map((l: any) => ({
      value: String(l.value || ''),
      label: String(l.label || l.value || ''),
    }));
  }, [localeOptions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-base">{t('header.title')}</CardTitle>
              <CardDescription>{t('header.subtitle')}</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <AdminLocaleSelect
                options={localesForSelect}
                value={effectiveLocale}
                onChange={setActiveLocale}
                loading={localesLoading}
                disabled={busy}
              />
              <Button variant="outline" size="sm" onClick={() => listQ.refetch()} disabled={busy}>
                <RefreshCcw className={`mr-2 size-4 ${listQ.isFetching ? 'animate-spin' : ''}`} />
                {t('admin.common.refresh')}
              </Button>
              <Link href="/email-templates/new">
                <Button size="sm">
                  <Plus className="mr-2 size-4" />
                  {t('admin.common.create')}
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
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
                <TableHead className="w-20">{t('columns.status')}</TableHead>
                <TableHead className="w-32 text-right">{t('admin.common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && listQ.isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    {t('list.loading')}
                  </TableCell>
                </TableRow>
              )}

              {rows.length === 0 && !listQ.isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    {t('list.empty')}
                  </TableCell>
                </TableRow>
              )}

              {rows.map((item) => (
                <TableRow key={`${item.id}-${effectiveLocale}`}>
                  <TableCell className="font-mono text-xs font-medium">
                    {item.template_key}
                  </TableCell>
                  <TableCell>{item.template_name || '-'}</TableCell>
                  <TableCell className="max-w-[250px] truncate" title={item.subject || ''}>
                    {item.subject || '-'}
                  </TableCell>
                  <TableCell>
                    {item.is_active ? (
                      <Badge className="bg-green-600 hover:bg-green-700">{t('status.active')}</Badge>
                    ) : (
                      <Badge variant="destructive">{t('status.inactive')}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/email-templates/${item.id}?locale=${effectiveLocale}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(item)} disabled={busy}>
                        <Trash2 className="size-4 text-destructive" />
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
