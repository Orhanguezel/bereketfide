'use client';

// =============================================================
// FILE: admin-library-client.tsx
// Bereket Fide – Admin Library (Katalog) List Page
// =============================================================

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  RefreshCcw,
  Search,
  Plus,
  Pencil,
  Trash2,
  FileText,
} from 'lucide-react';

import { useAdminT } from '@/app/(main)/(admin-pages)/_components/common/useAdminT';
import { useAdminLocales } from '@/app/(main)/(admin-pages)/_components/common/useAdminLocales';
import { AdminLocaleSelect } from '@/app/(main)/(admin-pages)/_components/common/AdminLocaleSelect';
import { resolveAdminApiLocale } from '@/i18n/adminLocale';
import { localeShortClientOr } from '@/i18n/localeShortClient';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  useListLibraryAdminQuery,
  useDeleteLibraryAdminMutation,
} from '@/integrations/hooks';
import type { LibraryAdminDto } from '@/integrations/endpoints/admin/library_admin.endpoints';

const inputClassName =
  'w-full rounded border border-[#ccc] bg-white px-4 py-3 text-sm text-[#333] placeholder-[#999] outline-none focus:border-[#946e1c] focus:ring-1 focus:ring-[#946e1c]/30';

export default function AdminLibraryClient() {
  const t = useAdminT('admin.library');

  const {
    localeOptions,
    defaultLocaleFromDb,
    loading: localesLoading,
    fetching: localesFetching,
  } = useAdminLocales();

  const apiLocale = React.useMemo(
    () => resolveAdminApiLocale(localeOptions as any, defaultLocaleFromDb, 'tr'),
    [localeOptions, defaultLocaleFromDb],
  );

  // ── Filters ──────────────────────────────────────────────────
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('');
  const [publishedFilter, setPublishedFilter] = React.useState('');
  const [activeLocale, setActiveLocale] = React.useState('');

  React.useEffect(() => {
    if (!localeOptions || localeOptions.length === 0) return;
    setActiveLocale((prev) => {
      if (prev) return prev;
      return localeShortClientOr(apiLocale, 'tr');
    });
  }, [localeOptions, apiLocale]);

  const effectiveLocale = activeLocale || apiLocale || 'tr';

  const queryParams = React.useMemo(
    () => ({
      q: search.trim() || undefined,
      type: typeFilter || undefined,
      is_published:
        publishedFilter === 'published' ? 1 : publishedFilter === 'draft' ? 0 : undefined,
      locale: effectiveLocale || undefined,
      limit: 200,
      offset: 0,
    }),
    [search, typeFilter, publishedFilter, effectiveLocale],
  );

  const listQ = useListLibraryAdminQuery(queryParams as any, {
    refetchOnMountOrArgChange: true,
  } as any);

  const items: LibraryAdminDto[] = React.useMemo(
    () => listQ.data?.items ?? [],
    [listQ.data],
  );

  // ── Delete ───────────────────────────────────────────────────
  const [deleteLibrary] = useDeleteLibraryAdminMutation();
  const [deleteTarget, setDeleteTarget] = React.useState<LibraryAdminDto | null>(null);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteLibrary(deleteTarget.id).unwrap();
      toast.success(t('messages.deleted'));
      listQ.refetch();
    } catch {
      toast.error(t('messages.error'));
    } finally {
      setDeleteTarget(null);
    }
  }

  const busy = listQ.isLoading || listQ.isFetching || localesLoading || localesFetching;

  return (
    <div className="min-w-0 w-full max-w-full overflow-hidden space-y-4">
      {/* ── Header ──────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{t('header.title')}</CardTitle>
              <CardDescription>{t('header.description')}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <AdminLocaleSelect
                options={(localeOptions as any) ?? []}
                value={activeLocale || effectiveLocale}
                onChange={(l) => setActiveLocale(l)}
                loading={localesLoading || localesFetching}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => listQ.refetch()}
                disabled={busy}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button asChild>
                <Link href="/library/new">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('actions.create')}
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* ── Filters ─────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-end gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {t('filters.search')}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('filters.searchPlaceholder')}
                  className={`${inputClassName} pl-9`}
                />
              </div>
            </div>

            {/* Type filter */}
            <div className="w-[160px]">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {t('filters.type')}
              </label>
              <Select
                value={typeFilter || 'all'}
                onValueChange={(v) => setTypeFilter(v === 'all' ? '' : v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.typeAll')}</SelectItem>
                  <SelectItem value="catalog">Katalog</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Published filter */}
            <div className="w-[160px]">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {t('filters.published')}
              </label>
              <Select
                value={publishedFilter || 'all'}
                onValueChange={(v) => setPublishedFilter(v === 'all' ? '' : v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.publishedAll')}</SelectItem>
                  <SelectItem value="published">{t('filters.publishedYes')}</SelectItem>
                  <SelectItem value="draft">{t('filters.publishedNo')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Table ───────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-4">
          {busy && items.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              Yükleniyor...
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">{t('messages.noRecords')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">{t('columns.image') || 'Görsel'}</TableHead>
                    <TableHead>{t('columns.name')}</TableHead>
                    <TableHead>{t('columns.slug')}</TableHead>
                    <TableHead>{t('columns.type')}</TableHead>
                    <TableHead>{t('columns.locale')}</TableHead>
                    <TableHead>{t('columns.status')}</TableHead>
                    <TableHead>{t('columns.downloads')}</TableHead>
                    <TableHead className="text-right">{t('columns.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const thumb = item.image_url || item.featured_image;
                    const apiOrigin = typeof window !== 'undefined'
                      ? `${window.location.protocol}//${window.location.hostname}:8086`
                      : 'http://localhost:8086';
                    const imgSrc = thumb
                      ? (thumb.startsWith('http') ? thumb : `${apiOrigin}${thumb.startsWith('/') ? '' : '/'}${thumb}`)
                      : '';
                    return (
                    <TableRow key={item.id}>
                      <TableCell>
                        {imgSrc ? (
                          <div className="relative h-10 w-10 overflow-hidden rounded border bg-muted/20">
                            <img src={imgSrc} alt={item.name || ''} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded border bg-muted/20">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.name || '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {item.slug || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.type || '-'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.locale || '-'}</Badge>
                      </TableCell>
                      <TableCell>
                        {item.is_published ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {t('status.published')}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">{t('status.draft')}</Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.download_count ?? 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link
                              href={`/library/${item.id}?locale=${effectiveLocale}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget(item)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Delete Dialog ───────────────────────────────────── */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('actions.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('messages.deleteConfirm', { name: deleteTarget?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t('actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
