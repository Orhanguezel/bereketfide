// =============================================================
// FILE: src/app/(main)/admin/(admin)/products/_components/products-list-panel.tsx
// Products List Panel — Shadcn/UI + RTK Query
// Bereket Fide Admin Panel
// =============================================================

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import Image from 'next/image';
import { RefreshCw, Plus, Pencil, Trash2, ImageOff, X, Filter } from 'lucide-react';
import { useAdminT } from '@/app/(main)/(admin-pages)/_components/common/useAdminT';
import { useAdminLocales } from '@/app/(main)/(admin-pages)/_components/common/useAdminLocales';
import {
  AdminLocaleSelect,
  type AdminLocaleOption,
} from '@/app/(main)/(admin-pages)/_components/common/AdminLocaleSelect';
import { toast } from 'sonner';
import {
  useListProductsAdminQuery,
  useDeleteProductAdminMutation,
  useUpdateProductAdminMutation,
  useListProductCategoriesAdminQuery,
} from '@/integrations/endpoints/admin/products_admin.endpoints';
import type { AdminProductDto, ProductItemType } from '@/integrations/shared/product_admin.types';

const isTruthy = (v: unknown) => v === 1 || v === true || v === '1' || v === 'true';

/* ── Spec-based filter dimensions (same as frontend ProjectsView) ── */
const SPEC_FILTER_KEYS = [
  { key: 'tip', label: { tr: 'Tip', en: 'Type', de: 'Typ' } },
  { key: 'lokasyon', label: { tr: 'Lokasyon', en: 'Location', de: 'Standort' } },
  { key: 'durum', label: { tr: 'Durum', en: 'Status', de: 'Status' } },
  { key: 'yıl', label: { tr: 'Yıl', en: 'Year', de: 'Jahr' } },
  { key: 'mimarlar', label: { tr: 'Mimarlar', en: 'Architects', de: 'Architekten' } },
  { key: 'alan', label: { tr: 'Alan', en: 'Area', de: 'Fläche' } },
  { key: 'kat', label: { tr: 'Kat', en: 'Floors', de: 'Stockwerke' } },
  { key: 'malzeme', label: { tr: 'Malzeme', en: 'Materials', de: 'Materialien' } },
  { key: 'isveren', label: { tr: 'İşveren', en: 'Client', de: 'Auftraggeber' } },
] as const;

function extractSpecValues(items: AdminProductDto[], specKey: string): string[] {
  const set = new Set<string>();
  for (const item of items) {
    const specs = item.specifications;
    if (!specs) continue;
    // Check both Turkish and English key variants
    const val = specs[specKey] || specs[specKey.toLowerCase()];
    if (typeof val === 'string' && val.trim()) set.add(val.trim());
  }
  return Array.from(set).sort();
}

interface Props {
  itemType?: ProductItemType;
}

export default function ProductsListPanel({ itemType }: Props) {
  const t = useAdminT('admin.products');
  const router = useRouter();

  const newUrl = itemType ? `/products/new?type=${itemType}` : '/products/new';

  const { localeOptions, defaultLocaleFromDb } = useAdminLocales();

  // Filters
  const [search, setSearch] = React.useState('');
  const [locale, setLocale] = React.useState('tr');
  const [categoryFilter, setCategoryFilter] = React.useState('');
  const [showOnlyActive, setShowOnlyActive] = React.useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = React.useState(false);
  const [specFilters, setSpecFilters] = React.useState<Record<string, string>>({});

  // Set default locale once options load
  React.useEffect(() => {
    if (!localeOptions?.length) return;
    setLocale((prev) => {
      if (prev) return prev;
      const def = (defaultLocaleFromDb as string) || localeOptions[0]?.value || 'tr';
      return String(def);
    });
  }, [localeOptions, defaultLocaleFromDb]);

  // RTK Query
  const {
    data: productData,
    isFetching,
    refetch,
  } = useListProductsAdminQuery(
    {
      locale: locale || undefined,
      q: search || undefined,
      item_type: itemType,
      category_id: categoryFilter || undefined,
      is_active: showOnlyActive ? true : undefined,
      is_featured: showOnlyFeatured ? true : undefined,
      limit: 100,
    },
    { skip: !locale },
  );

  const { data: categories = [] } = useListProductCategoriesAdminQuery(
    { locale: locale || 'tr' },
    { skip: !locale },
  );

  const rawItems: AdminProductDto[] = productData?.items ?? [];

  // Compute spec filter dimensions from all items
  const specDimensions = React.useMemo(() => {
    return SPEC_FILTER_KEYS
      .map((dim) => ({
        key: dim.key,
        label: dim.label[(locale as 'tr' | 'en' | 'de') || 'tr'] || dim.label.tr,
        options: extractSpecValues(rawItems, dim.key),
      }))
      .filter((d) => d.options.length > 0);
  }, [rawItems, locale]);

  // Apply client-side spec filters
  const items = React.useMemo(() => {
    const activeSpecFilters = Object.entries(specFilters).filter(([, v]) => v);
    if (activeSpecFilters.length === 0) return rawItems;
    return rawItems.filter((item) => {
      const specs = item.specifications;
      if (!specs) return false;
      return activeSpecFilters.every(([key, val]) => {
        const specVal = specs[key] || specs[key.toLowerCase()];
        return typeof specVal === 'string' && specVal.trim() === val;
      });
    });
  }, [rawItems, specFilters]);

  const activeSpecCount = Object.values(specFilters).filter(Boolean).length;

  const [updateProduct] = useUpdateProductAdminMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductAdminMutation();

  const localesForSelect = React.useMemo<AdminLocaleOption[]>(() => {
    return (localeOptions || []).map((l: any) => ({
      value: String(l.value || ''),
      label: String(l.label || l.value || ''),
    }));
  }, [localeOptions]);

  const handleToggleActive = async (item: AdminProductDto, value: boolean) => {
    try {
      await updateProduct({ id: item.id, patch: { is_active: value } }).unwrap();
    } catch {
      toast.error(t('messages.toggleActiveError'));
    }
  };

  const handleToggleFeatured = async (item: AdminProductDto, value: boolean) => {
    try {
      await updateProduct({ id: item.id, patch: { is_featured: value } }).unwrap();
    } catch {
      toast.error(t('messages.toggleFeaturedError'));
    }
  };

  const handleDelete = async (item: AdminProductDto) => {
    if (!confirm(t('messages.confirmDelete', { title: item.title || item.slug || '' }))) return;
    try {
      await deleteProduct({ id: item.id }).unwrap();
      toast.success(t('messages.deleted'));
      refetch();
    } catch {
      toast.error(t('messages.deleteError'));
    }
  };

  const isLoading = isFetching || isDeleting;

  const renderThumb = (item: AdminProductDto) => {
    const url = item.image_url || (item.images?.length ? item.images[0] : null);
    if (!url) {
      return (
        <div className="flex shrink-0 items-center justify-center rounded border bg-muted" style={{ width: 36, height: 36 }}>
          <ImageOff className="size-4 text-muted-foreground" />
        </div>
      );
    }
    return (
      <Image
        src={url}
        alt={item.title || ''}
        width={36}
        height={36}
        className="shrink-0 rounded border object-cover"
        style={{ width: 36, height: 36 }}
        unoptimized
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">
                {itemType === 'sparepart' ? t('header.title_sparepart') : t('header.title')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {itemType === 'sparepart' ? t('header.description_sparepart') : t('header.description')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={() => router.push(newUrl)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('actions.create')}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            {/* Search */}
            <div className="flex-1 min-w-[180px]">
              <Input
                placeholder={t('filters.search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Locale */}
            <div className="w-[140px]">
              <AdminLocaleSelect
                options={localesForSelect}
                value={locale}
                onChange={setLocale}
                disabled={isLoading}
              />
            </div>

            {/* Category */}
            <div className="w-[180px]">
              <Select
                value={categoryFilter || 'all'}
                onValueChange={(v) => setCategoryFilter(v === 'all' ? '' : v)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('list.allCategories')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('list.allCategories')}</SelectItem>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name || cat.slug}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="active-filter"
                  checked={showOnlyActive}
                  onCheckedChange={setShowOnlyActive}
                  disabled={isLoading}
                />
                <Label htmlFor="active-filter" className="cursor-pointer text-sm">
                  {t('list.columns.active')}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="featured-filter"
                  checked={showOnlyFeatured}
                  onCheckedChange={setShowOnlyFeatured}
                  disabled={isLoading}
                />
                <Label htmlFor="featured-filter" className="cursor-pointer text-sm">
                  {t('list.columns.featured')}
                </Label>
              </div>
            </div>
          </div>

          {/* Spec-based filters (like frontend ProjectsView) */}
          {specDimensions.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {locale === 'en' ? 'Specifications' : locale === 'de' ? 'Spezifikationen' : 'Özellikler'}
                </span>
                {activeSpecCount > 0 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {activeSpecCount}
                  </Badge>
                )}
                {activeSpecCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-muted-foreground"
                    onClick={() => setSpecFilters({})}
                  >
                    <X className="h-3 w-3 mr-1" />
                    {locale === 'en' ? 'Clear' : locale === 'de' ? 'Löschen' : 'Temizle'}
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {specDimensions.map((dim) => (
                  <div key={dim.key} className="w-[160px]">
                    <Select
                      value={specFilters[dim.key] || 'all'}
                      onValueChange={(v) =>
                        setSpecFilters((prev) => ({
                          ...prev,
                          [dim.key]: v === 'all' ? '' : v,
                        }))
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder={dim.label} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{dim.label}</SelectItem>
                        {dim.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[48px]">#</TableHead>
                <TableHead className="w-13" />
                <TableHead>{t('list.columns.title')}</TableHead>
                <TableHead className="w-[80px]">{t('list.columns.locale')}</TableHead>
                <TableHead className="w-[140px]">{t('list.columns.category')}</TableHead>
                <TableHead className="w-[90px] text-right">{t('list.columns.price')}</TableHead>
                <TableHead className="w-[70px] text-center">{t('list.columns.stock')}</TableHead>
                <TableHead className="w-[80px] text-center">{t('list.columns.active')}</TableHead>
                <TableHead className="w-[90px] text-center">{t('list.columns.featured')}</TableHead>
                <TableHead className="w-[110px] text-right">{t('list.columns.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching && items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-8 text-center text-muted-foreground text-sm">
                    {t('list.loading')}
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-8 text-center text-muted-foreground text-sm">
                    {t('list.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item: AdminProductDto, idx: number) => {
                  const isActive = isTruthy(item.is_active);
                  const isFeatured = isTruthy(item.is_featured);

                  return (
                    <TableRow key={item.id} className={!isActive ? 'opacity-50' : ''}>
                      <TableCell className="text-muted-foreground text-sm">{idx + 1}</TableCell>

                      <TableCell className="py-1">
                        {renderThumb(item)}
                      </TableCell>

                      <TableCell>
                        <div
                          className="font-medium text-sm truncate max-w-[260px]"
                          title={item.title || ''}
                        >
                          {item.title || (
                            <span className="text-muted-foreground italic">(adsız)</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-[260px]">
                          <code>{item.slug || '—'}</code>
                          {item.product_code && (
                            <span className="ml-2 text-muted-foreground">
                              [{item.product_code}]
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.locale || '—'}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground truncate max-w-[140px]">
                        {(item as any).category_name || item.category_id || '—'}
                      </TableCell>

                      <TableCell className="text-right text-sm">
                        {item.price != null ? Number(item.price).toLocaleString('tr-TR') : '—'}
                      </TableCell>

                      <TableCell className="text-center text-sm">
                        {item.stock_quantity ?? '—'}
                      </TableCell>

                      <TableCell className="text-center">
                        <Switch
                          checked={isActive}
                          disabled={isLoading}
                          onCheckedChange={(v) => handleToggleActive(item, v)}
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <Switch
                          checked={isFeatured}
                          disabled={isLoading}
                          onCheckedChange={(v) => handleToggleFeatured(item, v)}
                        />
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isLoading}
                            onClick={() => router.push(`/products/${item.id}?type=${item.item_type || 'product'}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isLoading}
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
