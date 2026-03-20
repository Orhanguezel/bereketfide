'use client';

// =============================================================
// FILE: services/_components/admin-service-detail-client.tsx
// Service Detail — gallery-style tabs: Icerik, Gorseller, SEO, JSON
// =============================================================

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { useAIContentAssist, type LocaleContent } from '@/app/(main)/(admin-pages)/_components/common/useAIContentAssist';

import { useAdminLocales } from '@/app/(main)/(admin-pages)/_components/common/useAdminLocales';
import { resolveAdminApiLocale } from '@/i18n/adminLocale';
import { localeShortClient, localeShortClientOr } from '@/i18n/localeShortClient';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

import { AdminJsonEditor } from '@/app/(main)/(admin-pages)/_components/common/AdminJsonEditor';
import { AdminImageUploadField } from '@/app/(main)/(admin-pages)/_components/common/AdminImageUploadField';
import RichContentEditor from '@/app/(main)/(admin-pages)/_components/common/RichContentEditor';
import { ServiceImagesTab } from './service-images-tab';

import {
  useGetServiceAdminQuery,
  useCreateServiceAdminMutation,
  useUpdateServiceAdminMutation,
} from '@/integrations/hooks';

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function isUuidLike(v?: string) {
  if (!v) return false;
  return /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/i.test(v);
}

function isValidId(v?: string) {
  if (!v || v === 'new') return false;
  return v.length >= 10 && v.includes('-');
}

const normalizeLocale = (v: unknown): string => String(v ?? '').trim().toLowerCase();
const norm = (v: unknown) => String(v ?? '').trim();
const toNull = (v: unknown) => { const s = norm(v); return s || null; };
const isTruthyBoolLike = (v: unknown) => v === true || v === 1 || v === '1' || v === 'true';

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[çÇ]/g, 'c').replace(/[ğĞ]/g, 'g').replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o').replace(/[şŞ]/g, 's').replace(/[üÜ]/g, 'u')
    .replace(/[äÄ]/g, 'ae').replace(/[ß]/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function getErrMessage(err: unknown, fallback: string): string {
  const anyErr = err as any;
  return anyErr?.data?.error?.message || anyErr?.data?.message || anyErr?.error || fallback;
}

/* ------------------------------------------------------------------ */
/* Form type                                                           */
/* ------------------------------------------------------------------ */

type FormValues = {
  id?: string;
  locale: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image_url: string;
  alt: string;
  tags: string;
  is_active: boolean;
  is_featured: boolean;
  display_order: string;
  module_key: string;
  meta_title: string;
  meta_description: string;
  replicate_all_locales: boolean;
};

const emptyForm = (locale: string): FormValues => ({
  locale,
  title: '', slug: '', description: '', content: '',
  image_url: '', alt: '', tags: '',
  is_active: true, is_featured: false, display_order: '0',
  module_key: 'bereketfide',
  meta_title: '', meta_description: '',
  replicate_all_locales: false,
});

const dtoToForm = (dto: any, locale: string): FormValues => ({
  id: String(dto.id ?? ''),
  locale,
  title: norm(dto.title || dto.name),
  slug: norm(dto.slug),
  description: norm(dto.description || dto.summary),
  content: norm(dto.content),
  image_url: norm(dto.image_url || dto.featured_image || dto.cover_url),
  alt: norm(dto.alt || dto.image_alt),
  tags: Array.isArray(dto.tags) ? dto.tags.join(', ') : norm(dto.tags),
  is_active: isTruthyBoolLike(dto.is_active),
  is_featured: isTruthyBoolLike(dto.is_featured || dto.featured),
  display_order: String(dto.display_order ?? 0),
  module_key: norm(dto.module_key) || 'bereketfide',
  meta_title: norm(dto.meta_title),
  meta_description: norm(dto.meta_description),
  replicate_all_locales: false,
});

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function AdminServiceDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  const isCreateMode = id === 'new';

  // Locales
  const { localeOptions, defaultLocaleFromDb, loading: localesLoading, fetching: localesFetching } = useAdminLocales();
  const apiLocaleFromDb = React.useMemo(() => resolveAdminApiLocale(localeOptions as any, defaultLocaleFromDb, 'tr'), [localeOptions, defaultLocaleFromDb]);

  const localeSet = React.useMemo(() => new Set((localeOptions ?? []).map((x: any) => localeShortClient(x.value)).filter(Boolean)), [localeOptions]);
  const urlLocale = React.useMemo(() => localeShortClient(sp?.get('locale')) || '', [sp]);

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
      return localeShortClient((localeOptions as any)?.[0]?.value) || 'tr';
    });
  }, [localeOptions, localeSet, urlLocale, apiLocaleFromDb]);

  const queryLocale = React.useMemo(() => {
    const l = localeShortClient(activeLocale);
    if (l && (localeSet.size === 0 || localeSet.has(l))) return l;
    return localeShortClientOr(apiLocaleFromDb, 'tr');
  }, [activeLocale, localeSet, apiLocaleFromDb]);

  React.useEffect(() => {
    const l = localeShortClient(activeLocale);
    if (!l || l === urlLocale) return;
    const params = new URLSearchParams(sp?.toString() || '');
    params.set('locale', l);
    const path = isCreateMode ? '/services/new' : `/services/${encodeURIComponent(id)}`;
    router.replace(`${path}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLocale]);

  // Data
  const shouldSkipDetail = isCreateMode || !isValidId(id) || !queryLocale;
  const { data: service, isLoading, isFetching, error: refError, refetch } = useGetServiceAdminQuery(
    { id, locale: queryLocale } as any,
    { skip: shouldSkipDetail } as any,
  );

  const [createService, createState] = useCreateServiceAdminMutation();
  const [updateService, updateState] = useUpdateServiceAdminMutation();

  const loading = localesLoading || localesFetching || isLoading || isFetching;
  const saving = createState.isLoading || updateState.isLoading;
  const busy = loading || saving;
  const disabled = loading || saving;

  // Form
  const [values, setValues] = React.useState<FormValues>(() => emptyForm(queryLocale || 'tr'));
  const [slugTouched, setSlugTouched] = React.useState(false);

  React.useEffect(() => {
    if (isCreateMode) { setValues(emptyForm(queryLocale || 'tr')); return; }
    if (service) { setValues(dtoToForm(service, queryLocale || 'tr')); setSlugTouched(false); }
  }, [service, isCreateMode, queryLocale]);

  const handleLocaleChange = (nextRaw: string) => {
    const next = normalizeLocale(nextRaw);
    const list = (localeOptions ?? []).map((x: any) => localeShortClient(x.value));
    const resolved = next && list.includes(next) ? next : localeShortClientOr(queryLocale, 'tr');
    if (!resolved) { toast.error('Geçersiz dil seçimi.'); return; }
    setValues((prev) => ({ ...prev, locale: resolved }));
    setActiveLocale(resolved);
  };

  // AI
  const { assist: aiAssist, loading: aiLoading } = useAIContentAssist();
  const [aiResults, setAiResults] = React.useState<LocaleContent[] | null>(null);

  const handleAIAssist = async () => {
    const targetLocales = (localeOptions ?? []).map((l: any) => String(l.value)).filter(Boolean);
    if (!targetLocales.length) targetLocales.push(queryLocale || 'tr');

    const result = await aiAssist({
      title: values.title,
      summary: values.description,
      content: values.content,
      tags: values.tags,
      locale: queryLocale || 'tr',
      target_locales: targetLocales,
      module_key: 'services',
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
        content: current.content || prev.content,
        tags: current.tags || prev.tags,
        meta_title: current.meta_title || prev.meta_title,
        meta_description: current.meta_description || prev.meta_description,
        alt: current.title || prev.alt,
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
      content: match.content || prev.content,
      tags: match.tags || prev.tags,
      meta_title: match.meta_title || '',
      meta_description: match.meta_description || '',
      alt: match.title || '',
    }));
    setActiveLocale(locale);
  };

  // Submit
  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (disabled) return;

    const loc = normalizeLocale(values.locale || queryLocale || apiLocaleFromDb);
    if (!loc) { toast.error('Dil seçimi zorunlu.'); return; }
    if (!values.title.trim()) { toast.error('Başlık zorunlu.'); return; }

    const tagsArray = values.tags ? values.tags.split(',').map((s) => s.trim()).filter(Boolean) : [];
    const payload: any = {
      locale: loc,
      title: values.title.trim(),
      slug: values.slug.trim() || slugify(values.title),
      description: toNull(values.description),
      content: toNull(values.content),
      image_url: toNull(values.image_url),
      alt: toNull(values.alt),
      tags: tagsArray,
      is_active: values.is_active,
      is_featured: values.is_featured,
      display_order: Number(values.display_order) || 0,
      meta_title: toNull(values.meta_title),
      meta_description: toNull(values.meta_description),
      module_key: toNull(values.module_key) || 'bereketfide',
    };

    try {
      if (isCreateMode) {
        payload.replicate_all_locales = values.replicate_all_locales;
        const result = await createService(payload).unwrap();
        const newId = String((result as any)?.id ?? '');
        toast.success('Hizmet oluşturuldu.');
        if (isValidId(newId)) router.replace(`/services/${newId}?locale=${loc}`);
      } else {
        await updateService({ id, patch: payload } as any).unwrap();
        toast.success('Hizmet güncellendi.');
      }
    } catch (err) {
      toast.error(getErrMessage(err, 'Hata oluştu.'));
    }
  }

  const imageMetadata = React.useMemo(() => ({
    module_key: 'services',
    locale: queryLocale,
    service_slug: values.slug || values.title || '',
    ...(values.id ? { service_id: values.id } : {}),
  }), [queryLocale, values.slug, values.title, values.id]);

  // Guards
  if (!localesLoading && !localesFetching && (localeOptions?.length ?? 0) === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-lg font-semibold">Dil tanımı bulunamadı</h1>
        <Card>
          <CardContent className="pt-6">
            <Button variant="outline" onClick={() => router.push('/site-settings')}>Site Ayarları</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isCreateMode && !loading && !service && refError) {
    return (
      <div className="space-y-6">
        <h1 className="text-lg font-semibold">Hizmet bulunamadı</h1>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Button variant="outline" onClick={() => router.push(`/services?locale=${queryLocale}`)}>
              <ArrowLeft className="mr-2 size-4" />Listeye Dön
            </Button>
            <Button variant="outline" onClick={() => refetch()}>Tekrar Dene</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pageTitle = isCreateMode ? 'Yeni Hizmet' : (values.title || 'Hizmet Düzenle');

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
            {aiLoading ? '... AI' : '✨ AI'}
          </Button>
          <Select
            value={normalizeLocale(values.locale) || ''}
            onValueChange={handleLocaleChange}
            disabled={disabled || !localeOptions?.length}
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
          <Button form="service-form" type="submit" size="sm" disabled={busy}>
            <Save className="mr-2 h-3.5 w-3.5" />
            Kaydet
          </Button>
        </div>
      </div>

      <form id="service-form" onSubmit={onSubmit} className="space-y-4">
        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">İçerik</TabsTrigger>
            {!isCreateMode && <TabsTrigger value="images">Görseller</TabsTrigger>}
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>

          {/* ── İçerik Tab ── */}
          <TabsContent value="content" className="mt-3">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox id="svc_active" checked={!!values.is_active} onCheckedChange={(v) => setValues((p) => ({ ...p, is_active: v === true }))} disabled={disabled} />
                    <Label htmlFor="svc_active" className="text-xs">Aktif</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="svc_featured" checked={!!values.is_featured} onCheckedChange={(v) => setValues((p) => ({ ...p, is_featured: v === true }))} disabled={disabled} />
                    <Label htmlFor="svc_featured" className="text-xs">Öne Çıkan</Label>
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

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">İçerik</Label>
                  <RichContentEditor
                    label=""
                    value={values.content}
                    onChange={(v) => setValues((p) => ({ ...p, content: v }))}
                    disabled={disabled}
                    height="280px"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Etiketler</Label>
                  <Input
                    value={values.tags}
                    onChange={(e) => setValues((p) => ({ ...p, tags: e.target.value }))}
                    disabled={disabled}
                    placeholder="etiket1, etiket2, ..."
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
                      folder="services"
                      metadata={imageMetadata}
                      value={norm(values.image_url)}
                      onChange={(url) => setValues((p) => ({ ...p, image_url: norm(url) }))}
                      disabled={disabled}
                      openLibraryHref="/storage"
                      previewAspect="16x9"
                      previewObjectFit="cover"
                    />
                  </div>
                </div>

                {isCreateMode && (
                  <div className="flex items-start gap-2 pt-2">
                    <Checkbox id="svc_replicate" checked={values.replicate_all_locales} onCheckedChange={(v) => setValues((p) => ({ ...p, replicate_all_locales: v === true }))} disabled={disabled} />
                    <Label htmlFor="svc_replicate" className="leading-none text-xs">Tüm dillere kopyala</Label>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Görseller Tab ── */}
          {!isCreateMode && (
            <TabsContent value="images" className="mt-3">
              <ServiceImagesTab
                serviceId={String((service as any)?.id ?? id)}
                disabled={disabled}
                coverUrl={norm(values.image_url)}
                onSelectCover={(url) => setValues((p) => ({ ...p, image_url: norm(url) }))}
              />
            </TabsContent>
          )}

          {/* ── SEO Tab ── */}
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
                    <Label className="text-xs text-muted-foreground">Alt Metin (Görsel)</Label>
                    <Input value={values.alt} onChange={(e) => setValues((p) => ({ ...p, alt: e.target.value }))} disabled={disabled} placeholder={values.slug ? `${values.slug}-1` : ''} />
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
                    <p className="text-sm font-medium text-[#1a0dab] truncate">{values.meta_title || values.title || 'Hizmet'} | Bereket Fide</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{values.meta_description || values.description || ''}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── JSON Tab ── */}
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

      {/* AI Results */}
      {aiResults && aiResults.length > 1 && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-purple-700">AI — Diğer Diller</CardTitle>
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
