// =============================================================
// FILE: src/app/(main)/admin/(admin)/custompage/_components/CustomPageForm.tsx
// FINAL — Admin Custom Page Create/Edit Form (container)
// - ✅ Cover + Gallery (multi) + "set as cover"
// - ✅ Locale select single source: AdminLocaleSelect
// - ✅ JSON mode uses AdminJsonEditor
// - ✅ App Router paths + no inline styles
// =============================================================

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAdminT } from '@/app/(main)/(admin-pages)/_components/common/useAdminT';

import type { CustomPageDto } from '@/integrations/shared';
import { useLazyListCustomPagesAdminQuery } from '@/integrations/hooks';

import { AdminJsonEditor } from '@/app/(main)/(admin-pages)/_components/common/AdminJsonEditor';
import { AdminLocaleSelect } from '@/app/(main)/(admin-pages)/_components/common/AdminLocaleSelect';

import type { LocaleOption } from './custom-page-header';
import { CustomPageMainColumn } from './custom-page-main-column';
import { CustomPageSidebarColumn } from './custom-page-sidebar-column';
import { CustomPageFormImageColumn } from './custom-page-form-image-column';
import { useAIContentAssist, type LocaleContent } from '@/app/(main)/(admin-pages)/_components/common/useAIContentAssist';

/* ------------------------------------------------------------- */
/*  Types                                                        */
/* ------------------------------------------------------------- */

export type CustomPageFormValues = {
  id?: string;
  page_id?: string;

  locale: string;
  module_key: string;
  is_published: boolean;
  featured: boolean;
  title: string;
  slug: string;
  content: string;

  featured_image: string;
  featured_image_asset_id: string;
  featured_image_alt: string;

  summary: string;

  meta_title: string;
  meta_description: string;

  tags: string;

  images: string[];
  storage_image_ids: string[];
};

export type CustomPageFormProps = {
  mode: 'create' | 'edit';
  initialData?: CustomPageDto;
  initialModuleKey?: string;
  loading: boolean;
  saving: boolean;

  locales: LocaleOption[];
  localesLoading?: boolean;

  defaultLocale?: string;
  onLocaleChange?: (nextLocale: string) => void;

  onSubmit: (values: CustomPageFormValues) => void | Promise<void>;
  onCancel?: () => void;
};

export type ContentImageSize = 'sm' | 'md' | 'lg' | 'full';

/* ------------------------------------------------------------- */
/*  Helpers                                                      */
/* ------------------------------------------------------------- */

const norm = (v: unknown) =>
  String(v ?? '')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0]
    .trim();

const getLocaleFromDto = (dto?: CustomPageDto, fallback = 'de') => {
  const raw = dto?.locale_resolved ?? fallback;
  return norm(raw) || norm(fallback) || 'tr';
};

const buildInitialValues = (
  initial: CustomPageDto | undefined,
  fallbackLocale: string | undefined,
  initialModuleKey = '',
): CustomPageFormValues => {
  const safeLocale = norm(fallbackLocale || 'tr') || 'tr';

  if (!initial) {
    return {
      id: undefined,
      page_id: undefined,

      locale: safeLocale,
      module_key: initialModuleKey.trim(),
      is_published: false,
      featured: false,
      title: '',
      slug: '',
      content: '',

      featured_image: '',
      featured_image_asset_id: '',
      featured_image_alt: '',

      summary: '',
      meta_title: '',
      meta_description: '',

      tags: '',

      images: [],
      storage_image_ids: [],
    };
  }

  const tagsString =
    Array.isArray(initial.tags) && initial.tags.length
      ? initial.tags.join(', ')
      : (initial.tags_raw ?? '');

  const resolvedLocale = getLocaleFromDto(initial, safeLocale);

  return {
    id: initial.id,
    page_id: initial.id,

    locale: resolvedLocale,
    module_key: initial.module_key ?? '',
    is_published: !!initial.is_published,
    featured: !!initial.featured,

    title: initial.title ?? '',
    slug: initial.slug ?? '',
    content: initial.content ?? initial.content_html ?? '',

    featured_image: initial.featured_image ?? '',
    featured_image_asset_id: initial.featured_image_asset_id ?? '',
    featured_image_alt: initial.featured_image_alt ?? '',

    summary: initial.summary ?? '',
    meta_title: initial.meta_title ?? '',
    meta_description: initial.meta_description ?? '',

    tags: tagsString,

    images: Array.isArray(initial.images) ? initial.images : [],
    storage_image_ids: Array.isArray(initial.storage_image_ids)
      ? initial.storage_image_ids
      : [],
  };
};

const buildContentImageHtml = (url: string, alt = '', size: ContentImageSize = 'lg'): string => {
  const safeAlt = alt.replace(/"/g, '&quot;');
  return `
<figure class="content-image-block content-image-${size}">
  <img src="${url}" alt="${safeAlt}" loading="lazy" />
</figure>
`.trim();
};

/* ------------------------------------------------------------- */
/*  Component                                                    */
/* ------------------------------------------------------------- */

export const CustomPageForm: React.FC<CustomPageFormProps> = ({
  mode,
  initialData,
  initialModuleKey,
  loading,
  saving,
  locales,
  localesLoading,
  defaultLocale,
  onLocaleChange,
  onSubmit,
  onCancel,
}) => {
  const t = useAdminT();
  const safeDefaultLocale = norm(defaultLocale || 'tr') || 'tr';

  const [values, setValues] = useState<CustomPageFormValues>(
    buildInitialValues(initialData, safeDefaultLocale, initialModuleKey),
  );

  const [slugTouched, setSlugTouched] = useState(false);
  const [activeMode, setActiveMode] = useState<'form' | 'json'>('form');

  const [contentImagePreview, setContentImagePreview] = useState<string>('');
  const [contentImageSize, setContentImageSize] = useState<ContentImageSize>('lg');
  const [manualImageUrl, setManualImageUrl] = useState<string>('');
  const [manualImageAlt, setManualImageAlt] = useState<string>('');

  const [triggerListPages, { isLoading: isLocaleSwitchLoading }] =
    useLazyListCustomPagesAdminQuery();

  const localeReqSeq = useRef(0);
  const pendingLocaleRef = useRef<string>('');

  useEffect(() => {
    if (!initialData) {
      setValues(buildInitialValues(undefined, safeDefaultLocale, initialModuleKey));
      setSlugTouched(false);
      pendingLocaleRef.current = '';
      return;
    }

    const incomingLocale = getLocaleFromDto(initialData, safeDefaultLocale);
    const wantedLocale = norm(pendingLocaleRef.current || '');

    if (mode === 'edit' && wantedLocale && incomingLocale !== wantedLocale) return;

    pendingLocaleRef.current = '';
    setValues(buildInitialValues(initialData, safeDefaultLocale, initialModuleKey));
    setSlugTouched(false);
  }, [initialData, initialModuleKey, safeDefaultLocale, mode]);

  useEffect(() => {
    if (!values.locale) {
      setValues((p) => ({ ...p, locale: safeDefaultLocale }));
    }
  }, [values.locale, safeDefaultLocale]);

  const disabled = loading || saving;

  const handleChange =
    (field: keyof CustomPageFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      setValues((prev) => ({ ...prev, [field]: val }) as CustomPageFormValues);
    };

  const handleCheckboxChange =
    (field: keyof CustomPageFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setValues((prev) => ({ ...prev, [field]: checked }) as CustomPageFormValues);
    };

  const handleLocaleChange = async (nextLocaleRaw: string) => {
    const nextLocale = norm(nextLocaleRaw || safeDefaultLocale) || safeDefaultLocale;

    if (norm(values.locale) === nextLocale) {
      onLocaleChange?.(nextLocale);
      return;
    }

    onLocaleChange?.(nextLocale);

    if (mode === 'create' || !initialData) {
      setValues((prev) => ({ ...prev, locale: nextLocale }));
      return;
    }

    const baseId = initialData.id;
    if (!baseId) {
      setValues((prev) => ({ ...prev, locale: nextLocale }));
      return;
    }

    pendingLocaleRef.current = nextLocale;
    const mySeq = ++localeReqSeq.current;

    setValues((prev) => ({ ...prev, locale: nextLocale }));

    try {
      const res = await triggerListPages({
        locale: nextLocale || undefined,
        limit: 200,
        offset: 0,
      } as any).unwrap();

      if (mySeq !== localeReqSeq.current) return;

      const items: CustomPageDto[] = res?.items ?? [];
      const match = items.find((item) => String(item?.id || '') === String(baseId));

      if (match) {
        const nextValues = buildInitialValues(match, safeDefaultLocale);
        nextValues.locale = nextLocale;
        setValues(nextValues);
        setSlugTouched(false);
        pendingLocaleRef.current = '';
      } else {
        toast.info(t('admin.customPage.form.localeRecordNotFound'));
      }
    } catch (err: any) {
      if (mySeq !== localeReqSeq.current) return;
      const status = err?.status ?? err?.originalStatus;
      if (status === 400) {
        toast.info(
          t('admin.customPage.form.localeRecordNotFound'),
        );
      } else {
        toast.error(t('admin.customPage.form.localeLoadFailed'));
      }
    }
  };

  // ── AI Content Assist ──
  const { assist: aiAssist, loading: aiLoading } = useAIContentAssist();
  const [aiResults, setAiResults] = React.useState<LocaleContent[] | null>(null);

  const handleAIAssist = async () => {
    const targetLocales = (locales ?? []).map((l: any) => String(l.value ?? '')).filter(Boolean);
    if (!targetLocales.length) targetLocales.push(values.locale || 'tr');

    const result = await aiAssist({
      title: values.title,
      summary: values.summary,
      content: values.content,
      tags: values.tags,
      locale: values.locale || 'tr',
      target_locales: targetLocales,
      module_key: values.module_key,
      action: 'full',
    });

    if (!result) return;
    setAiResults(result);

    // Mevcut dildeki sonucu forma uygula
    const current = result.find((r) => r.locale === values.locale) || result[0];
    if (current) {
      setValues((prev) => ({
        ...prev,
        title: current.title || prev.title,
        slug: current.slug || prev.slug,
        summary: current.summary || prev.summary,
        content: current.content || prev.content,
        meta_title: current.meta_title || prev.meta_title,
        meta_description: current.meta_description || prev.meta_description,
        tags: current.tags || prev.tags,
      }));
    }
  };

  // AI sonucundan başka dile geçince o dilin verisini yükle
  const applyAILocale = React.useCallback((locale: string) => {
    if (!aiResults) return false;
    const match = aiResults.find((r) => r.locale === locale);
    if (!match) return false;

    setValues((prev) => ({
      ...prev,
      locale,
      title: match.title || '',
      slug: match.slug || prev.slug,
      summary: match.summary || '',
      content: match.content || '',
      meta_title: match.meta_title || '',
      meta_description: match.meta_description || '',
      tags: match.tags || '',
    }));
    return true;
  }, [aiResults, setValues]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;

    if (!values.title.trim() || !values.slug.trim()) {
      toast.error(t('admin.customPage.form.titleSlugRequired'));
      return;
    }

    void onSubmit({
      ...values,
      page_id: values.page_id ?? initialData?.id ?? undefined,

      locale: norm(values.locale || safeDefaultLocale) || safeDefaultLocale,
      title: values.title.trim(),
      slug: values.slug.trim(),
      summary: values.summary.trim(),
      meta_title: values.meta_title.trim(),
      meta_description: values.meta_description.trim(),
      tags: values.tags.trim(),
    });
  };

  const localeSelectOptions = useMemo(
    () => (locales ?? []).map((x) => ({ value: norm(x.value), label: x.label })),
    [locales],
  );

  const imageMetadata = useMemo<Record<string, string | number | boolean>>(
    () => ({
      module_key: 'custom_pages',
      locale: values.locale || safeDefaultLocale,
      page_slug: values.slug || values.title || '',
      ...(values.page_id || initialData?.id
        ? { page_id: values.page_id ?? (initialData?.id as string) }
        : {}),
    }),
    [values.locale, values.slug, values.title, values.page_id, safeDefaultLocale, initialData?.id],
  );

  const handleAddContentImage = (url: string, alt?: string) => {
    if (!url) return;
    const htmlBlock = buildContentImageHtml(url, alt ?? '', contentImageSize);

    setContentImagePreview(url);
    setValues((prev) => ({
      ...prev,
      content: (prev.content || '') + '\n\n' + htmlBlock + '\n\n',
    }));
    toast.success(t('admin.customPage.form.imageAddedToContent'));
  };

  const handleAddManualImage = () => {
    const url = manualImageUrl.trim();
    if (!url) {
      toast.error(t('admin.customPage.form.invalidImageUrl'));
      return;
    }
    handleAddContentImage(url, manualImageAlt.trim());
    setManualImageUrl('');
    setManualImageAlt('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border bg-card">
        <div className="border-b p-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="text-sm font-semibold">
                {mode === 'create' ? t('admin.customPage.form.createTitle') : t('admin.customPage.form.editTitle')}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('admin.customPage.form.formDescription')}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex overflow-hidden rounded-md border">
                <button
                  type="button"
                  className={[
                    'px-3 py-1 text-xs',
                    activeMode === 'form' ? 'bg-muted font-semibold' : 'bg-background',
                  ].join(' ')}
                  onClick={() => setActiveMode('form')}
                  disabled={disabled}
                >
                  Form
                </button>
                <button
                  type="button"
                  className={[
                    'px-3 py-1 text-xs',
                    activeMode === 'json' ? 'bg-muted font-semibold' : 'bg-background',
                  ].join(' ')}
                  onClick={() => setActiveMode('json')}
                  disabled={disabled}
                >
                  JSON
                </button>
              </div>

              {onCancel ? (
                <button
                  type="button"
                  className="rounded-md border px-3 py-1 text-xs"
                  onClick={onCancel}
                  disabled={disabled}
                >
                  {t('admin.customPage.form.back')}
                </button>
              ) : null}

              <button
                type="button"
                className="rounded-md border border-purple-300 bg-purple-50 px-3 py-1 text-xs text-purple-700 hover:bg-purple-100 disabled:opacity-60"
                disabled={disabled || aiLoading}
                onClick={handleAIAssist}
              >
                {aiLoading ? '⏳ AI çalışıyor...' : '✨ AI ile İçerik Oluştur'}
              </button>

              <button
                type="submit"
                className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground disabled:opacity-60"
                disabled={disabled}
              >
                {saving
                  ? mode === 'create'
                    ? t('admin.customPage.form.creating')
                    : t('admin.customPage.form.saving')
                  : mode === 'create'
                    ? t('admin.customPage.form.createBtn')
                    : t('admin.customPage.form.saveBtn')}
              </button>

              {loading || isLocaleSwitchLoading ? (
                <span className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                  {isLocaleSwitchLoading ? t('admin.customPage.form.switchingLocale') : t('admin.common.loading')}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="p-3">
          {activeMode === 'json' ? (
            <AdminJsonEditor
              value={values}
              disabled={disabled}
              onChange={(next) => setValues(next as CustomPageFormValues)}
              label="Custom Page JSON"
              helperText={t('admin.customPage.form.jsonHelperText')}
            />
          ) : (
            <>
              {/* Dil seçici */}
              <div className="mb-4">
                <AdminLocaleSelect
                  value={values.locale}
                  onChange={handleLocaleChange}
                  options={localeSelectOptions as any}
                  loading={!!localesLoading}
                  disabled={
                    disabled ||
                    (!!localesLoading && !localeSelectOptions.length) ||
                    isLocaleSwitchLoading
                  }
                  label={t('admin.customPage.form.localeLabel')}
                />
              </div>

              {/* Tab yapısı */}
              <FormTabs
                values={values}
                setValues={setValues}
                disabled={disabled}
                slugTouched={slugTouched}
                setSlugTouched={setSlugTouched}
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
                imageMetadata={imageMetadata}
                contentImageSize={contentImageSize}
                setContentImageSize={setContentImageSize}
                contentImagePreview={contentImagePreview}
                handleAddContentImage={handleAddContentImage}
                manualImageUrl={manualImageUrl}
                manualImageAlt={manualImageAlt}
                setManualImageUrl={setManualImageUrl}
                setManualImageAlt={setManualImageAlt}
                handleAddManualImage={handleAddManualImage}
              />
            </>
          )}
        </div>
      </div>
      {/* AI Sonuçları — Diğer Diller */}
      {aiResults && aiResults.length > 1 && (
        <div className="rounded-lg border bg-purple-50/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-purple-700">✨ AI — Diğer Diller</span>
            <button
              type="button"
              className="text-[10px] text-muted-foreground hover:underline"
              onClick={() => setAiResults(null)}
            >
              Kapat
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {aiResults
              .filter((r) => r.locale !== values.locale)
              .map((r) => (
                <div key={r.locale} className="rounded-md border bg-background p-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase">{r.locale}</span>
                    <button
                      type="button"
                      className="rounded border px-2 py-0.5 text-[10px] text-purple-700 hover:bg-purple-100"
                      onClick={() => {
                        applyAILocale(r.locale);
                        if (onLocaleChange) onLocaleChange(r.locale);
                      }}
                    >
                      Bu dile geç & uygula
                    </button>
                  </div>
                  <p className="text-xs font-medium truncate">{r.title}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">{r.summary}</p>
                </div>
              ))}
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">
            Her dile geçip ayrı ayrı kaydedin. AI içeriği otomatik kaydetmez.
          </p>
        </div>
      )}
    </form>
  );
};

/* ── Form Tabs Component ── */

function FormTabs({
  values,
  setValues,
  disabled,
  slugTouched,
  setSlugTouched,
  handleChange,
  handleCheckboxChange,
  imageMetadata,
  contentImageSize,
  setContentImageSize,
  contentImagePreview,
  handleAddContentImage,
  manualImageUrl,
  manualImageAlt,
  setManualImageUrl,
  setManualImageAlt,
  handleAddManualImage,
}: {
  values: CustomPageFormValues;
  setValues: React.Dispatch<React.SetStateAction<CustomPageFormValues>>;
  disabled: boolean;
  slugTouched: boolean;
  setSlugTouched: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (field: keyof CustomPageFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: any;
  imageMetadata: Record<string, any>;
  contentImageSize: any;
  setContentImageSize: any;
  contentImagePreview: any;
  handleAddContentImage: any;
  manualImageUrl: string;
  manualImageAlt: string;
  setManualImageUrl: any;
  setManualImageAlt: any;
  handleAddManualImage: any;
}) {
  const [tab, setTab] = React.useState<'content' | 'images' | 'seo'>('content');

  return (
    <div className="space-y-3">
      {/* Tab buttons */}
      <div className="flex gap-1 border-b pb-2">
        {([
          { key: 'content' as const, label: 'İçerik' },
          { key: 'images' as const, label: 'Görseller' },
          { key: 'seo' as const, label: 'SEO' },
        ]).map((t) => (
          <button
            key={t.key}
            type="button"
            className={[
              'rounded-t-md px-4 py-1.5 text-xs font-medium transition-colors',
              tab === t.key
                ? 'border border-b-0 bg-background text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* İçerik tab */}
      {tab === 'content' && (
        <CustomPageMainColumn
          values={values}
          disabled={disabled}
          slugTouched={slugTouched}
          setSlugTouched={setSlugTouched}
          setValues={setValues}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange}
        />
      )}

      {/* Görseller tab */}
      {tab === 'images' && (
        <div className="space-y-4">
          <CustomPageFormImageColumn
            metadata={imageMetadata}
            disabled={disabled}
            featuredImageValue={values.featured_image}
            onFeaturedImageChange={(url) =>
              setValues((prev) => ({ ...prev, featured_image: url }))
            }
            galleryUrls={values.images}
            onGalleryUrlsChange={(urls) => setValues((prev) => ({ ...prev, images: urls }))}
            onSelectAsCover={(url) =>
              setValues((prev) => ({ ...prev, featured_image: url }))
            }
          />

          {/* İçerik içi görsel ekleme */}
          <CustomPageSidebarColumn
            values={values}
            disabled={disabled}
            imageMetadata={imageMetadata}
            contentImageSize={contentImageSize}
            setContentImageSize={setContentImageSize}
            contentImagePreview={contentImagePreview}
            handleAddContentImage={handleAddContentImage}
            manualImageUrl={manualImageUrl}
            manualImageAlt={manualImageAlt}
            setManualImageUrl={setManualImageUrl}
            setManualImageAlt={setManualImageAlt}
            handleAddManualImage={handleAddManualImage}
            setValues={setValues}
          />
        </div>
      )}

      {/* SEO tab */}
      {tab === 'seo' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Meta Başlık</label>
              <input
                type="text"
                className="h-8 w-full rounded-md border bg-background px-3 text-sm"
                value={values.meta_title}
                onChange={handleChange('meta_title')}
                disabled={disabled}
                placeholder="Sayfa başlığı (SEO)"
              />
              <p className="text-[10px] text-muted-foreground">{values.meta_title.length}/60</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Etiketler</label>
              <input
                type="text"
                className="h-8 w-full rounded-md border bg-background px-3 text-sm"
                value={values.tags}
                onChange={handleChange('tags')}
                disabled={disabled}
                placeholder="etiket1, etiket2, etiket3"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Meta Açıklama</label>
            <textarea
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              rows={3}
              value={values.meta_description}
              onChange={handleChange('meta_description')}
              disabled={disabled}
              placeholder="Sayfa açıklaması (SEO, max 155 karakter)"
            />
            <p className="text-[10px] text-muted-foreground">{values.meta_description.length}/155</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Kapak Görseli Alt Metni</label>
            <input
              type="text"
              className="h-8 w-full rounded-md border bg-background px-3 text-sm"
              value={values.featured_image_alt}
              onChange={handleChange('featured_image_alt')}
              disabled={disabled}
              placeholder="Görsel açıklaması (erişilebilirlik)"
            />
          </div>

          {/* Google önizleme */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Google Arama Önizlemesi</label>
            <div className="rounded-md border bg-background p-4">
              <p className="text-xs text-muted-foreground">www.bereketfide.com.tr</p>
              <p className="text-sm font-medium text-[#1a0dab] truncate">
                {values.meta_title || values.title || 'Sayfa Başlığı'} | Bereket Fide
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {values.meta_description || values.summary || 'Sayfa açıklaması'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
