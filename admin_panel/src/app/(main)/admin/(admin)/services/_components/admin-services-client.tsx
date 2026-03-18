'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, RefreshCcw, Search, Trash2, Pencil } from 'lucide-react';
import Image from 'next/image';

import { useAdminLocales } from '@/app/(main)/admin/_components/common/useAdminLocales';
import { resolveAdminApiLocale } from '@/i18n/adminLocale';
import { localeShortClient, localeShortClientOr } from '@/i18n/localeShortClient';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  useListServicesAdminQuery,
  useUpdateServiceAdminMutation,
  useDeleteServiceAdminMutation,
} from '@/integrations/hooks';

const isTruthyBoolLike = (v: unknown) => v === true || v === 1 || v === '1' || v === 'true';

function isValidId(v?: string) {
  if (!v || v === 'new') return false;
  return v.length >= 10 && v.includes('-');
}

export default function AdminServicesClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const { localeOptions, defaultLocaleFromDb, loading: localesLoading, fetching: localesFetching } = useAdminLocales();

  const apiLocale = React.useMemo(() => resolveAdminApiLocale(localeOptions as any, defaultLocaleFromDb, 'tr'), [localeOptions, defaultLocaleFromDb]);
  const urlLocale = React.useMemo(() => localeShortClient(sp?.get('locale')) || '', [sp]);

  const [filters, setFilters] = React.useState({ search: '', statusFilter: 'all' as 'all' | 'active' | 'inactive', locale: '', featuredOnly: false });

  React.useEffect(() => {
    if (!localeOptions || localeOptions.length === 0) return;
    setFilters((prev) => {
      const p = localeShortClient(prev.locale);
      const u = localeShortClient(urlLocale);
      const d = localeShortClientOr(apiLocale, 'tr');
      const canUse = (l: string) => !!l && (localeOptions ?? []).some((x: any) => localeShortClient(x.value) === l);
      if (p && canUse(p)) return prev;
      if (u && canUse(u)) return { ...prev, locale: u };
      if (d && canUse(d)) return { ...prev, locale: d };
      return { ...prev, locale: localeShortClient((localeOptions as any)?.[0]?.value) || 'tr' };
    });
  }, [localeOptions, urlLocale, apiLocale]);

  const effectiveLocale = localeShortClient(filters.locale) || apiLocale;

  React.useEffect(() => {
    const l = localeShortClient(filters.locale);
    if (!l || l === urlLocale) return;
    const params = new URLSearchParams(sp?.toString() || '');
    params.set('locale', l);
    router.replace(`/admin/services?${params.toString()}`);
  }, [filters.locale]);

  const queryParams = React.useMemo(() => ({
    q: filters.search.trim() || undefined,
    locale: effectiveLocale || undefined,
    is_active: filters.statusFilter === 'all' ? undefined : filters.statusFilter === 'active' ? 1 : 0,
    is_featured: filters.featuredOnly ? 1 : undefined,
    limit: 200,
    offset: 0,
  }), [filters, effectiveLocale]);

  const listQ = useListServicesAdminQuery(queryParams as any, { refetchOnMountOrArgChange: true } as any);
  const items = React.useMemo(() => {
    const d = listQ.data;
    if (Array.isArray(d)) return d;
    return ((d as any)?.items ?? []) as any[];
  }, [listQ.data]);

  const [updateService] = useUpdateServiceAdminMutation();
  const [deleteService] = useDeleteServiceAdminMutation();
  const busy = listQ.isLoading || listQ.isFetching || localesLoading || localesFetching;

  function onCreate() {
    router.push(`/admin/services/new?locale=${encodeURIComponent(effectiveLocale || 'tr')}`);
  }

  async function onToggleActive(item: any, next: boolean) {
    const id = String(item?.id ?? '');
    if (!isValidId(id)) return;
    try {
      await updateService({ id, patch: { is_active: next ? 1 : 0, locale: effectiveLocale } } as any).unwrap();
      toast.success('Durum güncellendi');
      listQ.refetch();
    } catch { toast.error('Durum güncellenemedi'); }
  }

  async function onToggleFeatured(item: any, next: boolean) {
    const id = String(item?.id ?? '');
    if (!isValidId(id)) return;
    try {
      await updateService({ id, patch: { is_featured: next ? 1 : 0, locale: effectiveLocale } } as any).unwrap();
      toast.success('Öne çıkarma güncellendi');
      listQ.refetch();
    } catch { toast.error('Güncellenemedi'); }
  }

  async function onDelete(item: any) {
    const id = String(item?.id ?? '');
    if (!isValidId(id)) return;
    if (!window.confirm(`"${item?.title || item?.name || 'Hizmet'}" silinsin mi?`)) return;
    try {
      await deleteService(id as any).unwrap();
      toast.success('Silindi');
      listQ.refetch();
    } catch { toast.error('Silinemedi'); }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">Hizmetler / Faaliyet Alanları</h1>
        <p className="text-sm text-muted-foreground">Hizmet ve faaliyet alanlarını yönetin.</p>
      </div>

      <Card>
        <CardHeader className="gap-2">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base">Filtreler</CardTitle>
              <CardDescription>
                Toplam: <span className="font-medium">{items.length}</span> • Dil: <Badge variant="secondary">{effectiveLocale || '—'}</Badge>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={onCreate} disabled={busy}><Plus className="mr-2 size-4" />Yeni Hizmet</Button>
              <Button variant="outline" onClick={() => listQ.refetch()} disabled={busy}><RefreshCcw className="mr-2 size-4" />Yenile</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Ara</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} placeholder="Başlık ara..." className="pl-9" disabled={busy} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Durum</Label>
              <Select value={filters.statusFilter} onValueChange={(v) => setFilters((p) => ({ ...p, statusFilter: v as any }))} disabled={busy}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dil</Label>
              <Select value={filters.locale || ''} onValueChange={(v) => setFilters((p) => ({ ...p, locale: v }))} disabled={busy || !localeOptions?.length}>
                <SelectTrigger><SelectValue placeholder="Dil seç" /></SelectTrigger>
                <SelectContent>
                  {(localeOptions ?? []).map((l: any) => (<SelectItem key={l.value} value={String(l.value)}>{String(l.label ?? l.value)}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pt-6 md:pt-7">
              <Switch checked={!!filters.featuredOnly} onCheckedChange={(v) => setFilters((p) => ({ ...p, featuredOnly: !!v }))} disabled={busy} />
              <span className="text-sm text-muted-foreground">Sadece öne çıkan</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Hizmet Listesi</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16" />
                  <TableHead>Başlık / Slug</TableHead>
                  <TableHead>Öne Çıkan</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any) => {
                  const id = String(item?.id ?? '');
                  const title = String(item?.title || item?.name || '').trim() || '—';
                  const slug = String(item?.slug ?? '').trim() || '—';
                  const isActive = isTruthyBoolLike(item?.is_active);
                  const isFeatured = isTruthyBoolLike(item?.is_featured ?? item?.featured);
                  const img = item?.image_url || item?.featured_image || item?.cover_url || '';
                  return (
                    <TableRow key={id}>
                      <TableCell>
                        {img ? (
                          <div className="size-10 overflow-hidden rounded border bg-muted">
                            <Image src={img} alt={title} width={40} height={40} className="size-full object-cover" unoptimized />
                          </div>
                        ) : <Badge variant="secondary" className="text-xs">—</Badge>}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{title}</div>
                        <div className="text-xs text-muted-foreground"><code>{slug}</code></div>
                      </TableCell>
                      <TableCell>
                        <Switch checked={isFeatured} onCheckedChange={(v) => onToggleFeatured(item, !!v)} disabled={busy || !isValidId(id)} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={isActive} onCheckedChange={(v) => onToggleActive(item, !!v)} disabled={busy || !isValidId(id)} />
                          <Badge variant={isActive ? 'secondary' : 'destructive'}>{isActive ? 'Aktif' : 'Pasif'}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/services/${encodeURIComponent(id)}?locale=${encodeURIComponent(effectiveLocale || 'tr')}`)} disabled={busy || !isValidId(id)}>
                            <Pencil className="mr-2 size-4" />Düzenle
                          </Button>
                          <Button variant="outline" size="sm" className="border-destructive text-destructive hover:text-destructive" onClick={() => onDelete(item)} disabled={busy || !isValidId(id)}>
                            <Trash2 className="mr-2 size-4" />Sil
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!busy && items.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">Kayıt bulunamadı.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
