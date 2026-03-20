'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save, RefreshCcw } from 'lucide-react';
import { useAIContentAssist, type LocaleContent } from '@/app/(main)/(admin-pages)/_components/common/useAIContentAssist';

import { useAdminLocales } from '@/app/(main)/(admin-pages)/_components/common/useAdminLocales';
import { resolveAdminApiLocale } from '@/i18n/adminLocale';
import { localeShortClient, localeShortClientOr } from '@/i18n/localeShortClient';
import { useAdminT } from '@/app/(main)/(admin-pages)/_components/common/useAdminT';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { AdminJsonEditor } from '@/app/(main)/(admin-pages)/_components/common/AdminJsonEditor';
import { AdminImageUploadField } from '@/app/(main)/(admin-pages)/_components/common/AdminImageUploadField';
import { GalleryImagesTab } from './gallery-images-tab';

import type {
  GalleryDto,
  GalleryUpsertPayload,
} from '@/integrations/shared';
import {
  useGetGalleryAdminQuery,
  useCreateGalleryAdminMutation,
  useUpdateGalleryAdminMutation,
} from '@/integrations/hooks';

function isUuidLike(v?: string) {
  if (!v) return false;
  return /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/i.test(v);
}

const normalizeLocale = (v: unknown): string =>
  String(v ?? '')
    .trim()
    .toLowerCase();

const norm = (v: unknown) => String(v ?? '').trim();
const toNull = (v: unknown) => {
  const s = norm(v);
  return s || null;
};

const isTruthyBoolLike = (v: unknown) => v === true || v === 1 || v === '1' || v === 'true';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's')
    .replace(/[üÜ]/g, 'u')
    .replace(/[äÄ]/g, 'ae')
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function getErrMessage(err: unknown, fallback: string): string {
  const anyErr = err as any;
  return (
    anyErr?.data?.error?.message ||
    anyErr?.data?.message ||
    anyErr?.error ||
    fallback
  );
}

type FormValues = {
  id?: string;
  locale: string;
  is_active: boolean;
  is_featured: boolean;
  display_order: string;
  module_key: string;
  source_type: string;
  source_id: string;
  cover_image: string;
  cover_asset_id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_alt: string;
  meta_title: string;
  meta_description: string;
  replicate_all_locales: boolean;
  apply_all_locales: boolean;
};

const emptyForm = (locale: string): FormValues => ({
  locale,
  is_active: true,
  is_featured: false,
  display_order: '0',
  module_key: 'bereketfide',
  source_type: '',
  source_id: '',
  cover_image: '',
  cover_asset_id: '',
  title: '',
  slug: '',
  description: '',
  cover_image_alt: '',
  meta_title: '',
  meta_description: '',
  replicate_all_locales: false,
  apply_all_locales: false,
});

const dtoToForm = (dto: GalleryDto): FormValues => ({
  id: String((dto as any).id ?? ''),
  locale: normalizeLocale((dto as any).locale_resolved ?? (dto as any).locale ?? 'tr'),
  is_active: isTruthyBoolLike((dto as any).is_active),
  is_featured: isTruthyBoolLike((dto as any).is_featured),
  display_order: String((dto as any).display_order ?? 0),
  module_key: norm((dto as any).module_key),
  source_type: norm((dto as any).source_type),
  source_id: norm((dto as any).source_id),
  cover_image: norm((dto as any).cover_image),
  cover_asset_id: norm((dto as any).cover_asset_id),
  title: norm((dto as any).title),
  slug: norm((dto as any).slug),
  description: norm((dto as any).description),
  cover_image_alt: norm((dto as any).cover_image_alt),
  meta_title: norm((dto as any).meta_title),
  meta_description: norm((dto as any).meta_description),
  replicate_all_locales: false,
  apply_all_locales: false,
});

export default function AdminGalleryDetailClient({ id }: { id: string }) {
  const t = useAdminT();
  const router = useRouter();
  const sp = useSearchParams();

  const isCreateMode = String(id) === 'new';

  const {
    localeOptions,
    defaultLocaleFromDb,
    loading: localesLoading,
    fetching: localesFetching,
  } = useAdminLocales();

  const apiLocaleFromDb = React.useMemo(() => {
    return resolveAdminApiLocale(localeOptions as any, defaultLocaleFromDb, 'tr');
  }, [localeOptions, defaultLocaleFromDb]);

  const localeSet = React.useMemo(() => {
    return new Set(
      (localeOptions ?? []).map((x: any) => localeShortClient(x.value)).filter(Boolean),
    );
  }, [localeOptions]);

  const urlLocale = React.useMemo(() => {
    const q = sp?.get('locale');
    return localeShortClient(q) || '';
  }, [sp]);

  const [activeLocale, setActiveLocale] = React.useState<string>('');

  React.useEffect(() => {
    if (!localeOptions || localeOptions.length === 0) return;

    setActiveLocale((prev) => {
      const p = localeShortClient(prev);
      const u = localeShortClient(urlLocale);
      const def = localeShortClientOr(apiLocaleFromDb, 'tr');

      const canUse = (l: string) => !!l && (localeSet.size === 0 || localeSet.has(l));

      if (p && canUse(p)) return p;
      if (u && canUse(u)) return u;
      if (def && canUse(def)) return def;

      const first = localeShortClient((localeOptions as any)?.[0]?.value);
      return first || 'tr';
    });
  }, [localeOptions, localeSet, urlLocale, apiLocaleFromDb]);

  const queryLocale = React.useMemo(() => {
    const l = localeShortClient(activeLocale);
    if (l && (localeSet.size === 0 || localeSet.has(l))) return l;
    return localeShortClientOr(apiLocaleFromDb, 'tr');
  }, [activeLocale, localeSet, apiLocaleFromDb]);

  React.useEffect(() => {
    const l = localeShortClient(activeLocale);
    if (!l) return;
    if (l === urlLocale) return;

    const params = new URLSearchParams(sp?.toString() || '');
    params.set('locale', l);

    if (isCreateMode) {
      router.replace(`/gallery/new?${params.toString()}`);
    } else {
      router.replace(`/gallery/${encodeURIComponent(String(id))}?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLocale]);

  const localesReady = !localesLoading && !localesFetching;
  const hasLocales = (localeOptions?.length ?? 0) > 0;

  const shouldSkipDetail = isCreateMode || !isUuidLike(String(id || '')) || !queryLocale;

  const {
    data: gallery,
    isLoading: isLoadingRef,
    isFetching: isFetchingRef,
    error: refError,
    refetch,
  } = useGetGalleryAdminQuery(
    { id: String(id), locale: queryLocale } as any,
    { skip: shouldSkipDetail } as any,
  );

  const [createGallery, createState] = useCreateGalleryAdminMutation();
  const [updateGallery, updateState] = useUpdateGalleryAdminMutation();

  const loading = localesLoading || localesFetching || isLoadingRef || isFetchingRef;
  const saving = createState.isLoading || updateState.isLoading;
  const busy = loading || saving;

  const [values, setValues] = React.useState<FormValues>(() =>
    emptyForm(queryLocale || 'tr'),
  );
  const [slugTouched, setSlugTouched] = React.useState(false);

  React.useEffect(() => {
    if (isCreateMode) {
      setValues(emptyForm(queryLocale || 'tr'));
      return;
    }
    if (gallery) {
      setValues(dtoToForm(gallery));
      setSlugTouched(false);
    }
  }, [gallery, isCreateMode, queryLocale]);

  const disabled = loading || saving;

  const localeDisabled = disabled || localesLoading || (localeOptions ?? []).length === 0;

  const handleLocaleChange = (nextLocaleRaw: string) => {
    const next = normalizeLocale(nextLocaleRaw);
    const list = (localeOptions ?? []).map((x: any) => localeShortClient(x.value));
    const resolved = next && list.includes(next) ? next : localeShortClientOr(queryLocale, 'tr');

    if (!resolved) {
      toast.error(t('admin.gallery.form.localeRequired'));
      return;
    }

    setValues((prev) => ({ ...prev, locale: resolved }));
    setActiveLocale(resolved);
  };

  function onCancel() {
    router.push(`/gallery?locale=${encodeURIComponent(queryLocale || 'tr')}`);
  }

  // ── AI Content Assist ──
  const { assist: aiAssist, loading: aiLoading } = useAIContentAssist();
  const [aiResults, setAiResults] = React.useState<LocaleContent[] | null>(null);

  const handleAIAssist = async () => {
    const targetLocales = (localeOptions ?? []).map((l: any) => String(l.value)).filter(Boolean);
    if (!targetLocales.length) targetLocales.push(queryLocale || 'tr');

    const result = await aiAssist({
      title: values.title,
      summary: values.description,
      locale: queryLocale || 'tr',
      target_locales: targetLocales,
      module_key: 'gallery',
      action: 'full',
    });

    if (!result) return;
    setAiResults(result);

    const current = result.find((r) => r.locale === queryLocale) || result[0];
    if (current) {
      setValues((prev) => ({
        ...prev,
        title: current.title || prev.title,
        slug: current.slug || prev.slug,
        description: current.summary || prev.description,
        meta_title: current.meta_title || prev.meta_title,
        meta_description: current.meta_description || prev.meta_description,
        cover_image_alt: current.title || prev.cover_image_alt,
      }));
    }
  };

  const applyAILocale = (locale: string) => {
    if (!aiResults) return;
    const match = aiResults.find((r) => r.locale === locale);
    if (!match) return;
    setValues((prev) => ({
      ...prev,
      locale,
      title: match.title || '',
      slug: match.slug || prev.slug,
      description: match.summary || '',
      meta_title: match.meta_title || '',
      meta_description: match.meta_description || '',
      cover_image_alt: match.title || '',
    }));
    setActiveLocale(locale);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;

    const loc = normalizeLocale(values.locale || queryLocale || apiLocaleFromDb);
    if (!loc || (localeSet.size > 0 && !localeSet.has(localeShortClient(loc)))) {
      toast.error(t('admin.gallery.formHeader.localeError'));
      return;
    }

    if (!values.title.trim() || !values.slug.trim()) {
      toast.error(t('admin.gallery.formHeader.titleSlugRequired'));
      return;
    }

    const common: GalleryUpsertPayload = {
      locale: loc,
      is_active: values.is_active ? 1 : 0,
      is_featured: values.is_featured ? 1 : 0,
      display_order: Number(values.display_order) || 0,
      module_key: toNull(values.module_key),
      source_type: toNull(values.source_type),
      source_id: toNull(values.source_id),
      cover_image: toNull(values.cover_image),
      cover_asset_id: toNull(values.cover_asset_id),
      title: values.title.trim(),
      slug: values.slug.trim(),
      description: toNull(values.description),
      cover_image_alt: toNull(values.cover_image_alt),
      meta_title: toNull(values.meta_title),
      meta_description: toNull(values.meta_description),
    };

    try {
      if (isCreateMode) {
        const payload = { ...common, replicate_all_locales: values.replicate_all_locales };
        const created = await createGallery(payload as any).unwrap();
        const nextId = String((created as any)?.id ?? '').trim();

        if (!isUuidLike(nextId)) {
          toast.error(t('admin.gallery.formHeader.createdNoId'));
          return;
        }

        toast.success(t('admin.gallery.formHeader.created'));
        router.replace(
          `/gallery/${encodeURIComponent(nextId)}?locale=${encodeURIComponent(loc)}`,
        );
        router.refresh();
        return;
      }

      const currentId = String((gallery as any)?.id ?? id);
      if (!isUuidLike(currentId)) {
        toast.error(t('admin.gallery.formHeader.idNotFound'));
        return;
      }

      const patch = { ...common, apply_all_locales: values.apply_all_locales };
      await updateGallery({ id: currentId, patch } as any).unwrap();
      toast.success(t('admin.gallery.formHeader.updated'));

      const short = localeShortClient(loc);
      if (short && short !== queryLocale) setActiveLocale(short);
    } catch (err) {
      toast.error(getErrMessage(err, t('admin.gallery.formHeader.defaultError')));
    }
  }

  const imageMetadata = React.useMemo(
    () => ({
      module_key: 'gallery',
      locale: queryLocale,
      gallery_slug: values.slug || values.title || '',
      ...(values.id ? { gallery_id: values.id } : {}),
    }),
    [queryLocale, values.slug, values.title, values.id],
  );

  // Guards
  if (localesReady && !hasLocales) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{t('admin.gallery.formHeader.noLocalesTitle')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('admin.gallery.formHeader.noLocalesDescription')}
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <Button variant="outline" onClick={() => router.push('/site-settings')}>
              {t('admin.gallery.formHeader.goToSettings')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isCreateMode && !isUuidLike(String(id || ''))) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{t('admin.gallery.formHeader.invalidIdTitle')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('admin.gallery.formHeader.invalidIdDescription')}{' '}
            <code>{String(id || '-')}</code>
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="mr-2 size-4" />
              {t('admin.gallery.formHeader.backToList')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isCreateMode && !loading && !gallery && refError) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{t('admin.gallery.formHeader.notFoundTitle')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('admin.gallery.formHeader.notFoundDescription')}{' '}
            <code>{String(id)}</code>
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="mr-2 size-4" />
              {t('admin.gallery.formHeader.backToList')}
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCcw className="mr-2 size-4" />
              {t('admin.gallery.formHeader.retryButton')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pageTitle = isCreateMode
    ? t('admin.gallery.formHeader.createTitle')
    : (gallery as any)?.title || t('admin.gallery.formHeader.editTitle');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} disabled={busy}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold truncate">{pageTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100"
            disabled={busy || aiLoading}
            onClick={handleAIAssist}
          >
            {aiLoading ? '⏳ AI...' : '✨ AI'}
          </Button>
          <Select
            value={normalizeLocale(values.locale) || ''}
            onValueChange={handleLocaleChange}
            disabled={localeDisabled}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Dil" />
            </SelectTrigger>
            <SelectContent>
              {(localeOptions ?? []).map((opt: any) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {String(opt.label ?? opt.value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button form="gallery-form" type="submit" size="sm" disabled={busy}>
            <Save className="mr-2 h-3.5 w-3.5" />
            Kaydet
          </Button>
        </div>
      </div>

      <form id="gallery-form" onSubmit={onSubmit} className="space-y-4">
        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">İçerik</TabsTrigger>
            {!isCreateMode && <TabsTrigger value="images">Görseller</TabsTrigger>}
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>

          {/* İçerik Tab */}
          <TabsContent value="content" className="mt-3">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="gal_active"
                      checked={!!values.is_active}
                      onCheckedChange={(v) => setValues((p) => ({ ...p, is_active: v === true }))}
                      disabled={disabled}
                    />
                    <Label htmlFor="gal_active" className="text-xs">Aktif</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="gal_featured"
                      checked={!!values.is_featured}
                      onCheckedChange={(v) => setValues((p) => ({ ...p, is_featured: v === true }))}
                      disabled={disabled}
                    />
                    <Label htmlFor="gal_featured" className="text-xs">Öne Çıkan</Label>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Başlık *</Label>
                    <Input
                      value={values.title}
                      onChange={(e) => {
                        const v = e.target.value;
                        setValues((p) => ({ ...p, title: v, ...(slugTouched ? {} : { slug: slugify(v) }) }));
                      }}
                      disabled={disabled}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Slug</Label>
                    <Input
                      value={values.slug}
                      onFocus={() => setSlugTouched(true)}
                      onChange={(e) => { setSlugTouched(true); setValues((p) => ({ ...p, slug: e.target.value })); }}
                      disabled={disabled}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Açıklama</Label>
                  <Textarea
                    rows={3}
                    value={values.description}
                    onChange={(e) => setValues((p) => ({ ...p, description: e.target.value }))}
                    disabled={disabled}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Modül</Label>
                    <Input value={values.module_key} onChange={(e) => setValues((p) => ({ ...p, module_key: e.target.value }))} disabled={disabled} placeholder="bereketfide" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Sıra</Label>
                    <Input type="number" min={0} value={values.display_order} onChange={(e) => setValues((p) => ({ ...p, display_order: e.target.value }))} disabled={disabled} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Kapak Görseli</Label>
                    <AdminImageUploadField
                      label=""
                      bucket="public"
                      folder="gallery"
                      metadata={imageMetadata}
                      value={norm(values.cover_image)}
                      onChange={(url) => setValues((p) => ({ ...p, cover_image: norm(url) }))}
                      disabled={disabled}
                      openLibraryHref="/storage"
                      previewAspect="16x9"
                      previewObjectFit="cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Görseller Tab */}
          {!isCreateMode && (
            <TabsContent value="images" className="mt-3">
              <GalleryImagesTab
                galleryId={String((gallery as any)?.id ?? id)}
                locale={queryLocale || 'tr'}
                disabled={disabled}
                coverUrl={norm(values.cover_image)}
                onSelectCover={(url) => setValues((p) => ({ ...p, cover_image: norm(url) }))}
              />
            </TabsContent>
          )}

          {/* SEO Tab */}
          <TabsContent value="seo" className="mt-3">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Meta Başlık</Label>
                    <Input value={values.meta_title} onChange={(e) => setValues((p) => ({ ...p, meta_title: e.target.value }))} disabled={disabled} />
                    <p className="text-[10px] text-muted-foreground">{values.meta_title.length}/60</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Kapak Alt Metni</Label>
                    <Input value={values.cover_image_alt} onChange={(e) => setValues((p) => ({ ...p, cover_image_alt: e.target.value }))} disabled={disabled} placeholder={values.slug ? `${values.slug}-1` : ''} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Meta Açıklama</Label>
                  <Textarea rows={2} value={values.meta_description} onChange={(e) => setValues((p) => ({ ...p, meta_description: e.target.value }))} disabled={disabled} />
                  <p className="text-[10px] text-muted-foreground">{values.meta_description.length}/155</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Google Önizleme</Label>
                  <div className="rounded-md border bg-background p-3">
                    <p className="text-xs text-muted-foreground">www.bereketfide.com.tr</p>
                    <p className="text-sm font-medium text-[#1a0dab] truncate">{values.meta_title || values.title || 'Galeri'} | Bereket Fide</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{values.meta_description || values.description || ''}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* JSON Tab */}
          <TabsContent value="json" className="mt-3">
            <Card>
              <CardContent className="pt-6">
                <AdminJsonEditor
                  value={values}
                  disabled={disabled}
                  onChange={(next) => setValues(next as FormValues)}
                  height={500}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>

      {/* AI Sonuçları */}
      {aiResults && aiResults.length > 1 && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-purple-700">✨ AI — Diğer Diller</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setAiResults(null)}>Kapat</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {aiResults.filter((r) => r.locale !== queryLocale).map((r) => (
                <div key={r.locale} className="rounded-md border bg-background p-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase">{r.locale}</span>
                    <Button variant="outline" size="sm" className="h-5 px-2 text-[10px] text-purple-700" onClick={() => applyAILocale(r.locale)}>Bu dile geç</Button>
                  </div>
                  <p className="text-xs font-medium truncate">{r.title}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">{r.summary}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
