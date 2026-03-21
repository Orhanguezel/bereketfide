// =============================================================
// FILE: product-detail-client.tsx
// Product Detail — Tab bazlı düzenli form
// Genel | Görseller | Özellikler | SEO | SSS | Değerlendirmeler | JSON
// =============================================================

'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import RichContentEditor from '@/app/(main)/(admin-pages)/_components/common/RichContentEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft, Save, FileJson, ListChecks, HelpCircle, Star,
  Images, Plus, Trash2, X, ImageOff, Search, FileText, ChevronDown,
} from 'lucide-react';
import { useAdminT } from '@/app/(main)/(admin-pages)/_components/common/useAdminT';
import { usePreferencesStore } from '@/stores/preferences/preferences-provider';
import { AdminLocaleSelect } from '@/app/(main)/(admin-pages)/_components/common/AdminLocaleSelect';
import { AdminJsonEditor } from '@/app/(main)/(admin-pages)/_components/common/AdminJsonEditor';
import { AdminImageUploadField } from '@/app/(main)/(admin-pages)/_components/common/AdminImageUploadField';
import { useAdminLocales } from '@/app/(main)/(admin-pages)/_components/common/useAdminLocales';
import { toast } from 'sonner';
import {
  useGetProductAdminQuery,
  useCreateProductAdminMutation,
  useUpdateProductAdminMutation,
  useListProductCategoriesAdminQuery,
  useListProductSubcategoriesAdminQuery,
} from '@/integrations/endpoints/admin/products_admin.endpoints';
import { ProductFaqsTab } from './product-faqs-tab';
import { ProductReviewsTab } from './product-reviews-tab';
import type { ProductItemType } from '@/integrations/shared/product_admin.types';
import { useAIContentAssist, type LocaleContent } from '@/app/(main)/(admin-pages)/_components/common/useAIContentAssist';

// ─── Props ───────────────────────────────────────────────────

interface Props {
  id: string;
  itemType?: ProductItemType;
}

type TabKey = 'general' | 'images' | 'specs' | 'seo' | 'faqs' | 'reviews' | 'json';

// ─── Specifications Key-Value Editor ─────────────────────────

/** Spec key definitions — loaded from shared/spec-keys.json */
import specKeysData from '@shared/spec-keys.json';

type SpecKeyEntry = { id: string; labels: Record<string, string>; keys: Record<string, string> };
const SPEC_ENTRIES: SpecKeyEntry[] = specKeysData.product;

function getSpecOptionsForLocale(locale: string): { key: string; label: string }[] {
  const lang = locale.split('-')[0].split('_')[0];
  return SPEC_ENTRIES.map((e) => ({
    key: e.keys[lang] ?? e.keys['en'] ?? e.id,
    label: e.labels[lang] ?? e.labels['en'] ?? e.id,
  }));
}

/** All spec keys across all locales (for label resolution) */
const ALL_SPEC_OPTIONS: { key: string; label: string }[] = SPEC_ENTRIES.flatMap((e) =>
  Object.entries(e.keys).map(([lang, key]) => ({
    key,
    label: e.labels[lang] ?? e.labels['en'] ?? e.id,
  })),
);


/** Resolve display label for a spec key */
function specKeyLabel(key: string): string {
  const found = ALL_SPEC_OPTIONS.find(
    (o) => o.key.toLowerCase().replace(/[\s_]+/g, '') === key.toLowerCase().replace(/[\s_]+/g, ''),
  );
  return found?.label ?? key;
}

function SpecificationsEditor({
  value,
  onChange,
  disabled,
  isProject,
  locale = 'tr',
}: {
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
  disabled?: boolean;
  isProject?: boolean;
  locale?: string;
}) {
  const specOptions = getSpecOptionsForLocale(locale);
  const entries = Object.entries(value);
  const [customKeyInputs, setCustomKeyInputs] = React.useState<Record<number, boolean>>({});

  /** Normalize existing non-standard keys to standard format */
  const normalizeKey = (key: string): string => {
    const norm = key.toLowerCase().replace(/[\s_]+/g, '');
    const match = specOptions.find(
      (o) => o.key.toLowerCase().replace(/[\s_]+/g, '') === norm,
    );
    return match?.key ?? key;
  };

  const handleKeyChange = (oldKey: string, newKey: string) => {
    if (newKey === oldKey) return;
    const next: Record<string, string> = {};
    for (const [k, v] of entries) {
      next[k === oldKey ? newKey : k] = v;
    }
    onChange(next);
  };

  const handleValueChange = (key: string, newVal: string) => {
    onChange({ ...value, [key]: newVal });
  };

  const handleRemove = (key: string) => {
    const next = { ...value };
    delete next[key];
    onChange(next);
  };

  const handleAddSuggested = (key: string) => {
    if (value[key] !== undefined) return;
    onChange({ ...value, [key]: '' });
  };

  // Henüz eklenmemiş standart özellikler
  const usedKeys = new Set(entries.map(([k]) => normalizeKey(k)));
  const availableOptions = specOptions.filter((o) => !usedKeys.has(o.key));

  const isStandardKey = (key: string) =>
    specOptions.some(
      (o) => o.key.toLowerCase().replace(/[\s_]+/g, '') === key.toLowerCase().replace(/[\s_]+/g, ''),
    );

  return (
    <div className="space-y-3">
      {entries.length === 0 && (
        <p className="text-sm text-muted-foreground">Henüz özellik eklenmemiş.</p>
      )}
      {entries.map(([k, v], idx) => {
        const isCustom = customKeyInputs[idx] || !isStandardKey(k);
        return (
          <div key={idx} className="flex items-center gap-2">
            {!isCustom ? (
              <select
                className="w-50 shrink-0 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                value={normalizeKey(k)}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setCustomKeyInputs((p) => ({ ...p, [idx]: true }));
                    return;
                  }
                  handleKeyChange(k, e.target.value);
                }}
                disabled={disabled}
              >
                <option value={normalizeKey(k)}>{specKeyLabel(k)}</option>
                {availableOptions
                  .filter((o) => o.key !== normalizeKey(k))
                  .map((o) => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                <option value="__custom__">— Özel alan —</option>
              </select>
            ) : (
              <div className="flex items-center gap-1 w-50 shrink-0">
                <Input
                  className="flex-1"
                  value={k}
                  onChange={(e) => handleKeyChange(k, e.target.value)}
                  disabled={disabled}
                  placeholder="Özellik adı"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setCustomKeyInputs((p) => ({ ...p, [idx]: false }))}
                  title="Listeden seç"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            <Input
              className="flex-1"
              value={v}
              onChange={(e) => handleValueChange(k, e.target.value)}
              disabled={disabled}
              placeholder="Değer"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(k)}
              disabled={disabled}
              className="shrink-0"
            >
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      })}

      <div className="flex items-center gap-2 flex-wrap">
        {/* Hızlı ekleme önerileri */}
        {availableOptions.length > 0 && (
          <>
            <span className="text-[11px] text-muted-foreground">Hızlı ekle:</span>
            {availableOptions.slice(0, 8).map((o) => (
              <button
                key={o.key}
                type="button"
                className="rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
                onClick={() => handleAddSuggested(o.key)}
                disabled={disabled}
              >
                + {o.label}
              </button>
            ))}
          </>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            let key = 'özel_alan';
            let i = 1;
            while (value[key] !== undefined) key = `özel_alan_${i++}`;
            onChange({ ...value, [key]: '' });
            setCustomKeyInputs((p) => ({ ...p, [entries.length]: true }));
          }}
          disabled={disabled}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Özel Alan Ekle
        </Button>
      </div>
    </div>
  );
}

// ─── Multiple Images Editor ──────────────────────────────────

function ImagesEditor({
  images,
  onChange,
  disabled,
  coverUrl,
  onSelectCover,
}: {
  images: string[];
  onChange: (v: string[]) => void;
  disabled?: boolean;
  coverUrl?: string;
  onSelectCover?: (url: string) => void;
}) {
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const [urlValue, setUrlValue] = React.useState('');

  const handleRemove = (idx: number) => onChange(images.filter((_, i) => i !== idx));

  const handleAddUrl = () => {
    const trimmed = urlValue.trim();
    if (trimmed) {
      onChange([...images, trimmed]);
      setUrlValue('');
      setShowUrlInput(false);
    }
  };

  const handleReorder = (from: number, to: number) => {
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <AdminImageUploadField
        label="Galeri Görselleri Yükle"
        helperText="Birden fazla görsel seçebilirsiniz. İlk eklenen görsel kapak olarak ayarlanır."
        multiple
        values={images}
        onChangeMultiple={(urls) => {
          onChange(urls);
          // İlk eklenen görseli kapak yap (kapak boşsa)
          if (onSelectCover && !coverUrl && urls.length > 0) {
            onSelectCover(urls[0]);
          }
        }}
        disabled={disabled}
        folder="uploads/gallery"
      />

      {images.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-muted-foreground">
          <div className="text-center">
            <ImageOff className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Henüz resim eklenmemiş.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, idx) => (
            <div key={idx} className={`group relative rounded-lg border overflow-hidden bg-muted ${coverUrl && coverUrl === url ? 'ring-2 ring-primary' : ''}`}>
              <Image
                src={url}
                alt={`Resim ${idx + 1}`}
                width={300}
                height={200}
                className="w-full h-36 object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onSelectCover && coverUrl !== url && (
                  <button
                    type="button"
                    className="rounded-full bg-amber-500/90 px-2 py-1 text-[10px] text-white font-medium"
                    onClick={() => onSelectCover(url)}
                    disabled={disabled}
                    title="Kapak görseli yap"
                  >
                    ★ Kapak
                  </button>
                )}
                {idx > 0 && (
                  <button
                    type="button"
                    className="rounded-full bg-black/60 px-2 py-1 text-[10px] text-white"
                    onClick={() => handleReorder(idx, idx - 1)}
                    disabled={disabled}
                  >
                    ←
                  </button>
                )}
                {idx < images.length - 1 && (
                  <button
                    type="button"
                    className="rounded-full bg-black/60 px-2 py-1 text-[10px] text-white"
                    onClick={() => handleReorder(idx, idx + 1)}
                    disabled={disabled}
                  >
                    →
                  </button>
                )}
                <button
                  type="button"
                  className="rounded-full bg-red-600/80 p-1.5 text-white"
                  onClick={() => handleRemove(idx)}
                  disabled={disabled}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="px-2 py-1.5 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>{idx + 1}. resim</span>
                {coverUrl && coverUrl === url
                  ? <Badge variant="default" className="text-[9px] px-1.5">★ Kapak</Badge>
                  : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* URL ile ekleme */}
      <div className="flex items-center gap-2">
        {showUrlInput ? (
          <>
            <Input
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="https://... görsel URL'si"
              className="flex-1"
              disabled={disabled}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl(); } }}
            />
            <Button type="button" variant="default" size="sm" onClick={handleAddUrl} disabled={disabled || !urlValue.trim()}>
              Ekle
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setShowUrlInput(false); setUrlValue(''); }}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </>
        ) : (
          <Button type="button" variant="outline" size="sm" onClick={() => setShowUrlInput(true)} disabled={disabled}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            URL ile Ekle
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Save Bar (her tab altında ortak) ────────────────────────

function SaveBar({
  onBack,
  onSave,
  disabled,
  submitType = 'button',
}: {
  onBack: () => void;
  onSave?: () => void;
  disabled?: boolean;
  submitType?: 'submit' | 'button';
}) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t">
      <Button type="button" variant="outline" onClick={onBack} disabled={disabled}>
        İptal
      </Button>
      <Button
        type={submitType}
        disabled={disabled}
        onClick={submitType === 'button' ? onSave : undefined}
      >
        <Save className="h-4 w-4 mr-2" />
        Kaydet
      </Button>
    </div>
  );
}

// ─── Ana Bileşen ─────────────────────────────────────────────

export default function ProductDetailClient({ id, itemType }: Props) {
  const t = useAdminT('admin.products');
  const router = useRouter();
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const isNew = id === 'new';
  const backUrl = itemType ? `/products?type=${itemType}` : '/products';
  const isProject = false; // Bereket Fide: tüm ürünler "Ürün" olarak gösterilir

  const { localeOptions } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState<string>(adminLocale || 'tr');
  const [activeTab, setActiveTab] = React.useState<TabKey>('general');

  // ── RTK Query ──────────────────────────────────────────────

  const { data: item, isFetching, refetch } = useGetProductAdminQuery(
    { id, locale: activeLocale, item_type: itemType },
    { skip: isNew },
  );

  const { data: categories = [] } = useListProductCategoriesAdminQuery(
    { locale: activeLocale },
    { skip: !activeLocale },
  );

  const [createProduct, { isLoading: isCreating }] = useCreateProductAdminMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductAdminMutation();

  // ── Form state ─────────────────────────────────────────────

  const [formData, setFormData] = React.useState({
    locale: activeLocale,
    title: '',
    slug: '',
    price: '' as string | number,
    stock_quantity: '' as string | number,
    product_code: '',
    description: '',
    image_alt: '',
    tags: '',
    specifications: {} as Record<string, string>,
    category_id: '',
    sub_category_id: '',
    image_url: '',
    image_asset_id: '',
    images: [] as string[],
    is_active: true,
    is_featured: false,
    meta_title: '',
    meta_description: '',
  });

  const { data: subcategories = [] } = useListProductSubcategoriesAdminQuery(
    { category_id: formData.category_id, locale: activeLocale },
    { skip: !formData.category_id },
  );

  // ── Veri yüklenince formData'yı doldur ─────────────────────

  React.useEffect(() => {
    if (item && !isNew) {
      setFormData({
        locale: item.locale || activeLocale,
        title: item.title || '',
        slug: item.slug || '',
        price: item.price ?? '',
        stock_quantity: item.stock_quantity ?? '',
        product_code: item.product_code || '',
        description: item.description || '',
        image_alt: item.alt || '',
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
        specifications:
          item.specifications && typeof item.specifications === 'object'
            ? { ...item.specifications }
            : {},
        category_id: item.category_id ? String(item.category_id) : '',
        sub_category_id: item.sub_category_id ? String(item.sub_category_id) : '',
        image_url: item.image_url || '',
        image_asset_id: item.storage_asset_id || '',
        images: Array.isArray(item.images) ? [...item.images] : [],
        is_active: item.is_active === 1 || item.is_active === true,
        is_featured: item.is_featured === 1 || item.is_featured === true,
        meta_title: item.meta_title || '',
        meta_description: item.meta_description || '',
      });
    }
  }, [item, isNew, activeLocale]);

  React.useEffect(() => {
    if (!isNew && id) refetch();
  }, [activeLocale, id, isNew, refetch]);

  // ── Handler'lar ────────────────────────────────────────────

  const handleBack = () => router.push(backUrl);

  const handleLocaleChange = (next: string) => {
    setActiveLocale(next);
    setFormData((prev) => ({ ...prev, locale: next }));
  };

  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(!isNew);

  const toSlug = (str: string) =>
    str
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const handleChange = (field: string, value: unknown) => {
    if (field === 'slug') setSlugManuallyEdited(true);
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-generate slug from title (only for new items, unless manually edited)
      if (field === 'title' && !slugManuallyEdited) {
        next.slug = toSlug(String(value));
      }
      return next;
    });
  };

  const handleJsonChange = (json: Record<string, any>) =>
    setFormData((prev) => ({ ...prev, ...json }));

  const handleImageChange = (url: string) =>
    setFormData((prev) => ({ ...prev, image_url: url, image_asset_id: '' }));

  // ── AI Content Assist ──
  const { assist: aiAssist, loading: aiLoading } = useAIContentAssist();
  const [aiResults, setAiResults] = React.useState<LocaleContent[] | null>(null);

  const handleAIAssist = async () => {
    const targetLocales = localesForSelect.map((l: any) => String(l.value)).filter(Boolean);
    if (!targetLocales.length) targetLocales.push(activeLocale || 'tr');

    const specsText = Object.entries(formData.specifications)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');

    const result = await aiAssist({
      title: formData.title,
      summary: formData.description ? formData.description.replace(/<[^>]+>/g, ' ').slice(0, 300) : '',
      content: formData.description,
      tags: formData.tags + (specsText ? ` | Özellikler: ${specsText}` : ''),
      locale: activeLocale || 'tr',
      target_locales: targetLocales,
      module_key: isProject ? 'bereketfide_product' : 'product',
      action: 'full',
    });

    if (!result) return;
    setAiResults(result);

    const current = result.find((r) => r.locale === activeLocale) || result[0];
    if (current) {
      setFormData((prev) => ({
        ...prev,
        title: current.title || prev.title,
        slug: current.slug || prev.slug,
        description: current.content || prev.description,
        meta_title: current.meta_title || prev.meta_title,
        meta_description: current.meta_description || prev.meta_description,
        tags: current.tags || prev.tags,
        image_alt: current.title || prev.image_alt,
      }));
    }
  };

  const applyAILocale = (locale: string) => {
    if (!aiResults) return;
    const match = aiResults.find((r) => r.locale === locale);
    if (!match) return;
    setFormData((prev) => ({
      ...prev,
      locale,
      title: match.title || '',
      slug: match.slug || prev.slug,
      description: match.content || '',
      meta_title: match.meta_title || '',
      meta_description: match.meta_description || '',
      tags: match.tags || '',
      image_alt: match.title || '',
    }));
    setActiveLocale(locale);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Başlık zorunludur');
      setActiveTab('general');
      return;
    }

    const tagsArray = formData.tags
      ? formData.tags.toString().split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const specsToSend =
      Object.keys(formData.specifications).length > 0 ? formData.specifications : null;

    const payload = {
      locale: activeLocale,
      title: formData.title.trim(),
      slug:
        formData.slug.trim() ||
        formData.title.trim().toLowerCase().replace(/\s+/g, '-'),
      price: formData.price !== '' ? Number(formData.price) : 0,
      stock_quantity:
        formData.stock_quantity !== '' ? Number(formData.stock_quantity) : undefined,
      product_code: formData.product_code || undefined,
      description: formData.description || undefined,
      alt: formData.image_alt || undefined,
      tags: tagsArray,
      specifications: specsToSend,
      category_id: formData.category_id || undefined,
      image_url: formData.image_url || null,
      storage_asset_id: formData.image_asset_id || null,
      images: formData.images,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      meta_title: formData.meta_title || undefined,
      meta_description: formData.meta_description || undefined,
      item_type: isNew ? (itemType ?? 'product') : undefined,
    };

    try {
      if (isNew) {
        const result = await createProduct({ ...payload, category_id: formData.category_id || undefined }).unwrap();
        toast.success('Ürün oluşturuldu');
        if (result?.id) {
          const typeParam = itemType ? `?type=${itemType}` : '';
          router.push(`/products/${result.id}${typeParam}`);
        }
      } else {
        await updateProduct({ id, patch: payload }).unwrap();
        toast.success('Ürün güncellendi');
      }
    } catch (error: any) {
      const errObj = error?.data?.error;
      const msg = errObj?.detail || errObj?.message || error?.message || 'Hata oluştu';
      toast.error(`Hata: ${msg}`);
    }
  };

  const isLoading = isFetching || isCreating || isUpdating;
  const productId = isNew ? undefined : id;
  const entityLabel = 'Ürün';

  const localesForSelect = React.useMemo(
    () =>
      (localeOptions || []).map((l: any) => ({
        value: String(l.value || ''),
        label: String(l.label || l.value || ''),
      })),
    [localeOptions],
  );

  // ─── Render ────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-base">
                  {isNew ? `Yeni ${entityLabel}` : `${entityLabel} Düzenle`}
                </CardTitle>
                <CardDescription>
                  {isNew
                    ? `Yeni ${entityLabel.toLowerCase()} oluştur`
                    : item?.title || ''}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Özet bilgi chip'leri */}
              {item && !isNew && (
                <>
                  {item.category_name && (
                    <Badge variant="outline">{item.category_name}</Badge>
                  )}
                  <Badge variant={formData.is_active ? 'default' : 'secondary'}>
                    {formData.is_active ? 'Aktif' : 'Pasif'}
                  </Badge>
                </>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100"
                disabled={isLoading || aiLoading}
                onClick={handleAIAssist}
              >
                {aiLoading ? '⏳ AI...' : '✨ AI'}
              </Button>
              <AdminLocaleSelect
                options={localesForSelect}
                value={activeLocale}
                onChange={handleLocaleChange}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* ── Tabs ───────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="general">
            <FileText className="h-4 w-4 mr-1.5" />
            Genel
          </TabsTrigger>
          <TabsTrigger value="images">
            <Images className="h-4 w-4 mr-1.5" />
            Görseller
            {formData.images.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">
                {formData.images.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="specs">
            <ListChecks className="h-4 w-4 mr-1.5" />
            Özellikler
            {Object.keys(formData.specifications).length > 0 && (
              <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">
                {Object.keys(formData.specifications).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Search className="h-4 w-4 mr-1.5" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="faqs" disabled={isNew}>
            <HelpCircle className="h-4 w-4 mr-1.5" />
            SSS
          </TabsTrigger>
          <TabsTrigger value="reviews" disabled={isNew}>
            <Star className="h-4 w-4 mr-1.5" />
            Değerlendirmeler
          </TabsTrigger>
          <TabsTrigger value="json">
            <FileJson className="h-4 w-4 mr-1.5" />
            JSON
          </TabsTrigger>
        </TabsList>

        {/* ════════════════════════════════════════════════════
            TAB 1: GENEL
            ════════════════════════════════════════════════════ */}
        <TabsContent value="general">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Temel Bilgiler</CardTitle>
                <CardDescription>
                  {isProject
                    ? 'Proje adı, açıklaması, kategorisi ve durumu.'
                    : 'Ürün başlığı, açıklaması ve temel bilgileri.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Başlık + Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Başlık *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      disabled={isLoading}
                      placeholder={isProject ? 'Proje adı' : 'Ürün başlığı'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleChange('slug', e.target.value)}
                      disabled={isLoading}
                      placeholder="otomatik-olusturulur"
                    />
                  </div>
                </div>

                {/* Kod + Kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product_code">Ürün Kodu</Label>
                    <Input
                      id="product_code"
                      value={formData.product_code}
                      onChange={(e) => handleChange('product_code', e.target.value)}
                      disabled={isLoading}
                      placeholder="BF-FDE-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Select
                      value={formData.category_id || 'none'}
                      onValueChange={(v) => {
                        handleChange('category_id', v === 'none' ? '' : v);
                        handleChange('sub_category_id', '');
                      }}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seç" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">— Kategori seç —</SelectItem>
                        {categories.map((cat: any) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name || cat.slug}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Alt Kategori */}
                {formData.category_id && subcategories.length > 0 && (
                  <div className="space-y-2 sm:w-1/2">
                    <Label>Alt Kategori</Label>
                    <Select
                      value={formData.sub_category_id || 'none'}
                      onValueChange={(v) =>
                        handleChange('sub_category_id', v === 'none' ? '' : v)
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Alt kategori seç" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">— Alt kategori seç —</SelectItem>
                        {subcategories.map((sub: any) => (
                          <SelectItem key={sub.id} value={String(sub.id)}>
                            {sub.name || sub.slug}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Fiyat + Stok */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Fiyat</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Stok</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => handleChange('stock_quantity', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Açıklama */}
                <div className="space-y-2">
                  <Label>Açıklama</Label>
                  <RichContentEditor
                    value={formData.description}
                    onChange={(v) => handleChange('description', v)}
                    disabled={isLoading}
                  />
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-6 rounded-md border p-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(v) => handleChange('is_active', v)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">
                      Aktif
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(v) => handleChange('is_featured', v)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="is_featured" className="cursor-pointer">
                      Öne Çıkan
                    </Label>
                  </div>
                </div>

                {/* Meta bilgi (readonly) */}
                {item && !isNew && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-md border p-4 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium text-foreground block">Oluşturma</span>
                      {new Date(item.created_at).toLocaleDateString('tr-TR')}
                    </div>
                    <div>
                      <span className="font-medium text-foreground block">Güncelleme</span>
                      {new Date(item.updated_at).toLocaleDateString('tr-TR')}
                    </div>
                    <div>
                      <span className="font-medium text-foreground block">Puan</span>
                      {item.rating} ({item.review_count} yorum)
                    </div>
                    <div>
                      <span className="font-medium text-foreground block">Sıra</span>
                      {item.order_num}
                    </div>
                  </div>
                )}

                <SaveBar onBack={handleBack} disabled={isLoading} submitType="submit" />
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* ════════════════════════════════════════════════════
            TAB 2: GÖRSELLER
            ════════════════════════════════════════════════════ */}
        <TabsContent value="images">
          <div className="space-y-6">
            {/* Kapak Görseli */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Kapak Görseli</CardTitle>
                <CardDescription>
                  {isProject
                    ? 'Proje listesinde ve detayda ana görsel olarak kullanılır.'
                    : 'Ürün kartında görünen ana görsel.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-sm">
                  <AdminImageUploadField
                    label=""
                    value={formData.image_url}
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="mt-3 space-y-2">
                  <Label htmlFor="image_alt">Alt Text</Label>
                  <Input
                    id="image_alt"
                    value={formData.image_alt}
                    onChange={(e) => handleChange('image_alt', e.target.value)}
                    disabled={isLoading}
                    placeholder="Görsel açıklaması (SEO için önemli)"
                    className="max-w-md"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Galeri */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Galeri
                  {formData.images.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-[10px]">
                      {formData.images.length} resim
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {isProject
                    ? 'Proje detay sayfasında galeri olarak gösterilir. Sıralamayı ok tuşlarıyla değiştirebilirsiniz.'
                    : 'Ürün detay sayfasındaki ek görseller.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImagesEditor
                  images={formData.images}
                  onChange={(v) => handleChange('images', v)}
                  disabled={isLoading}
                  coverUrl={formData.image_url}
                  onSelectCover={handleImageChange}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <SaveBar
                  onBack={handleBack}
                  onSave={() => handleSubmit()}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ════════════════════════════════════════════════════
            TAB 3: ÖZELLİKLER
            ════════════════════════════════════════════════════ */}
        <TabsContent value="specs">
          <div className="space-y-6">
            {/* Inline specifications (product_i18n.specifications JSON) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Teknik Özellikler</CardTitle>
                <CardDescription>
                  Tür, çeşit, boy, dikim zamanı, toprak tipi gibi ürün özelliklerini ekleyin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SpecificationsEditor
                  value={formData.specifications}
                  onChange={(v) => handleChange('specifications', v)}
                  disabled={isLoading}
                  isProject={isProject}
                  locale={activeLocale}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <SaveBar
                  onBack={handleBack}
                  onSave={() => handleSubmit()}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ════════════════════════════════════════════════════
            TAB 4: SEO
            ════════════════════════════════════════════════════ */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">SEO & Etiketler</CardTitle>
              <CardDescription>
                Arama motorları için meta bilgiler ve etiketler.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Meta Title */}
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Başlık</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  disabled={isLoading}
                  placeholder={formData.title || 'Sayfa başlığı'}
                />
                <p className="text-[11px] text-muted-foreground">
                  {formData.meta_title.length}/60 karakter
                </p>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Açıklama</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  disabled={isLoading}
                  rows={3}
                  placeholder="Arama sonuçlarında görünecek açıklama"
                />
                <p className="text-[11px] text-muted-foreground">
                  {formData.meta_description.length}/160 karakter
                </p>
              </div>

              {/* Etiketler */}
              <div className="space-y-2">
                <Label htmlFor="tags">Etiketler</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  disabled={isLoading}
                  placeholder="virgülle ayır: domates fidesi, biber, sebze"
                />
                {formData.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.tags
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                      .map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-[11px]">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>

              {/* Arama Önizleme */}
              <div className="space-y-2 rounded-md border p-4 bg-muted/30">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Google Önizleme
                </p>
                <div>
                  <p className="text-[#1a0dab] text-base truncate">
                    {formData.meta_title || formData.title || 'Sayfa Başlığı'}
                  </p>
                  <p className="text-[#006621] text-xs truncate">
                    bereketfide.com.tr/urunler/{formData.slug || 'urun-slug'}
                  </p>
                  <p className="text-[#545454] text-xs line-clamp-2 mt-0.5">
                    {formData.meta_description || 'Meta açıklama buraya gelecek...'}
                  </p>
                </div>
              </div>

              <SaveBar
                onBack={handleBack}
                onSave={() => handleSubmit()}
                disabled={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ════════════════════════════════════════════════════
            TAB 5: SSS
            ════════════════════════════════════════════════════ */}
        <TabsContent value="faqs">
          {productId ? (
            <ProductFaqsTab
              productId={productId}
              locale={activeLocale}
              disabled={isLoading}
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground text-sm">
                SSS eklemek için önce {entityLabel.toLowerCase()}u kaydedin.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ════════════════════════════════════════════════════
            TAB 6: DEĞERLENDİRMELER
            ════════════════════════════════════════════════════ */}
        <TabsContent value="reviews">
          {productId ? (
            <ProductReviewsTab productId={productId} disabled={isLoading} />
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground text-sm">
                Değerlendirmeler için önce {entityLabel.toLowerCase()}u kaydedin.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ════════════════════════════════════════════════════
            TAB 7: JSON
            ════════════════════════════════════════════════════ */}
        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{entityLabel} Verisi (JSON)</CardTitle>
              <CardDescription>
                Tüm alanları ham JSON olarak görüntüleyip düzenleyebilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AdminJsonEditor
                value={formData}
                onChange={handleJsonChange}
                disabled={isLoading}
                height={600}
              />
              <SaveBar
                onBack={handleBack}
                onSave={() => handleSubmit()}
                disabled={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Sonuçları — Diğer Diller */}
      {aiResults && aiResults.length > 1 && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-purple-700">✨ AI — Diğer Diller</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setAiResults(null)}>
                Kapat
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {aiResults
                .filter((r) => r.locale !== activeLocale)
                .map((r) => (
                  <div key={r.locale} className="rounded-md border bg-background p-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase">{r.locale}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-5 px-2 text-[10px] text-purple-700"
                        onClick={() => applyAILocale(r.locale)}
                      >
                        Bu dile geç
                      </Button>
                    </div>
                    <p className="text-xs font-medium truncate">{r.title}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">{r.summary}</p>
                  </div>
                ))}
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Her dile geçip ayrı ayrı kaydedin.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
