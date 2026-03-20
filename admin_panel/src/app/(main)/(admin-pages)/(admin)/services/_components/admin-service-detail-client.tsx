'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save, FileJson } from 'lucide-react';

import { useAdminLocales } from '@/app/(main)/(admin-pages)/_components/common/useAdminLocales';
import { resolveAdminApiLocale } from '@/i18n/adminLocale';
import { localeShortClient, localeShortClientOr } from '@/i18n/localeShortClient';

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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

import { AdminJsonEditor } from '@/app/(main)/(admin-pages)/_components/common/AdminJsonEditor';
import RichContentEditor from '@/app/(main)/(admin-pages)/_components/common/RichContentEditor';
import { AdminImageUploadField } from '@/app/(main)/(admin-pages)/_components/common/AdminImageUploadField';

import {
  useGetServiceAdminQuery,
  useCreateServiceAdminMutation,
  useUpdateServiceAdminMutation,
} from '@/integrations/hooks';

function isValidId(v?: string) {
  if (!v || v === 'new') return false;
  return v.length >= 10 && v.includes('-');
}

const norm = (v: unknown) => String(v ?? '').trim();
const toNull = (v: unknown) => { const s = norm(v); return s || null; };

function slugify(text: string) {
  return text.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

type FormValues = {
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
  meta_title: string;
  meta_description: string;
  replicate_all_locales: boolean;
};

const emptyForm = (locale: string): FormValues => ({
  locale,
  title: '', slug: '', description: '', content: '',
  image_url: '', alt: '', tags: '',
  is_active: true, is_featured: false, display_order: '0',
  meta_title: '', meta_description: '',
  replicate_all_locales: false,
});

export default function AdminServiceDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  const isNew = id === 'new';

  const { localeOptions, defaultLocaleFromDb, loading: localesLoading } = useAdminLocales();
  const apiLocale = React.useMemo(() => resolveAdminApiLocale(localeOptions as any, defaultLocaleFromDb, 'tr'), [localeOptions, defaultLocaleFromDb]);
  const urlLocale = localeShortClient(sp?.get('locale')) || '';

  const [activeLocale, setActiveLocale] = React.useState('');
  const [slugTouched, setSlugTouched] = React.useState(!isNew);

  React.useEffect(() => {
    if (!localeOptions?.length) return;
    setActiveLocale((prev) => {
      const p = localeShortClient(prev);
      const u = localeShortClient(urlLocale);
      const d = localeShortClientOr(apiLocale, 'tr');
      const canUse = (l: string) => !!l && (localeOptions ?? []).some((x: any) => localeShortClient(x.value) === l);
      if (p && canUse(p)) return p;
      if (u && canUse(u)) return u;
      if (d && canUse(d)) return d;
      return localeShortClient((localeOptions as any)?.[0]?.value) || 'tr';
    });
  }, [localeOptions, urlLocale, apiLocale]);

  const queryLocale = localeShortClient(activeLocale) || apiLocale;

  const { data: service, isLoading, isFetching } = useGetServiceAdminQuery(
    { id, locale: queryLocale } as any,
    { skip: isNew || !isValidId(id) || !queryLocale } as any,
  );

  const [createService, createState] = useCreateServiceAdminMutation();
  const [updateService, updateState] = useUpdateServiceAdminMutation();

  const [values, setValues] = React.useState<FormValues>(() => emptyForm(queryLocale || 'tr'));
  const busy = isLoading || isFetching || localesLoading || createState.isLoading || updateState.isLoading;

  React.useEffect(() => {
    if (isNew) { setValues(emptyForm(queryLocale || 'tr')); return; }
    if (!service) return;
    const s = service as any;
    setValues({
      locale: queryLocale || 'tr',
      title: norm(s.title || s.name),
      slug: norm(s.slug),
      description: norm(s.description || s.summary),
      content: norm(s.content),
      image_url: norm(s.image_url || s.featured_image || s.cover_url),
      alt: norm(s.alt || s.image_alt),
      tags: Array.isArray(s.tags) ? s.tags.join(', ') : norm(s.tags),
      is_active: s.is_active === 1 || s.is_active === true,
      is_featured: s.is_featured === 1 || s.is_featured === true || s.featured === true,
      display_order: String(s.display_order ?? 0),
      meta_title: norm(s.meta_title),
      meta_description: norm(s.meta_description),
      replicate_all_locales: false,
    });
    setSlugTouched(false);
  }, [service, isNew, queryLocale]);

  const handleChange = (field: string, value: unknown) => {
    if (field === 'slug') setSlugTouched(true);
    setValues((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
  };

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (busy) return;
    if (!values.title.trim()) { toast.error('Başlık zorunlu'); return; }

    const tagsArray = values.tags ? values.tags.split(',').map((s) => s.trim()).filter(Boolean) : [];
    const payload: any = {
      locale: queryLocale,
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
      module_key: 'bereketfide',
    };

    try {
      if (isNew) {
        payload.replicate_all_locales = values.replicate_all_locales;
        const result = await createService(payload).unwrap();
        const newId = String((result as any)?.id ?? '');
        toast.success('Hizmet oluşturuldu');
        if (isValidId(newId)) router.replace(`/services/${newId}?locale=${queryLocale}`);
      } else {
        await updateService({ id, patch: payload } as any).unwrap();
        toast.success('Hizmet güncellendi');
      }
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.error?.detail || 'Hata oluştu');
    }
  }

  const pageTitle = isNew ? 'Yeni Hizmet' : (values.title || 'Hizmet Düzenle');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => router.back()} disabled={busy}><ArrowLeft className="mr-2 size-4" />Geri</Button>
          <h1 className="text-lg font-semibold">{pageTitle}</h1>
          <Badge variant="secondary">{queryLocale}</Badge>
          {isNew ? <Badge>YENİ</Badge> : <Badge variant="secondary">DÜZENLE</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/services?locale=${queryLocale}`)} disabled={busy}>İptal</Button>
          <Button onClick={() => handleSubmit()} disabled={busy}><Save className="mr-2 size-4" />Kaydet</Button>
        </div>
      </div>

      <Tabs defaultValue="form">
        <TabsList>
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="json"><FileJson className="h-4 w-4 mr-1.5" />JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-4">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Hizmet Bilgileri</CardTitle>
                <CardDescription>Hizmet başlığı, açıklaması, içeriği ve görseli.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-12">
                  <div className="space-y-4 lg:col-span-8">
                    {/* Locale */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Dil</Label>
                        <Select value={activeLocale || ''} onValueChange={(v) => setActiveLocale(v)} disabled={busy || !localeOptions?.length}>
                          <SelectTrigger><SelectValue placeholder="Dil seç" /></SelectTrigger>
                          <SelectContent>
                            {(localeOptions ?? []).map((l: any) => (<SelectItem key={l.value} value={String(l.value)}>{String(l.label ?? l.value)}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end gap-4 md:col-span-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="svc_active" checked={values.is_active} onCheckedChange={(v) => handleChange('is_active', v === true)} disabled={busy} />
                          <Label htmlFor="svc_active">Aktif</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="svc_featured" checked={values.is_featured} onCheckedChange={(v) => handleChange('is_featured', v === true)} disabled={busy} />
                          <Label htmlFor="svc_featured">Öne Çıkan</Label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Title + Slug */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Başlık *</Label>
                        <Input value={values.title} onChange={(e) => handleChange('title', e.target.value)} disabled={busy} placeholder="Hizmet adı" />
                      </div>
                      <div className="space-y-2">
                        <Label>Slug</Label>
                        <Input value={values.slug} onFocus={() => setSlugTouched(true)} onChange={(e) => handleChange('slug', e.target.value)} disabled={busy} placeholder="otomatik-olusturulur" />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label>Kısa Açıklama</Label>
                      <Textarea rows={2} value={values.description} onChange={(e) => handleChange('description', e.target.value)} disabled={busy} placeholder="Hizmet özeti..." />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <Label>İçerik</Label>
                      <RichContentEditor label="" value={values.content} onChange={(v) => handleChange('content', v)} disabled={busy} height="280px" />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label>Etiketler</Label>
                      <Input value={values.tags} onChange={(e) => handleChange('tags', e.target.value)} disabled={busy} placeholder="etiket1, etiket2, ..." />
                    </div>

                    <Separator />

                    {/* SEO */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Meta Başlık</Label>
                        <Input value={values.meta_title} onChange={(e) => handleChange('meta_title', e.target.value)} disabled={busy} />
                      </div>
                      <div className="space-y-2">
                        <Label>Alt Text</Label>
                        <Input value={values.alt} onChange={(e) => handleChange('alt', e.target.value)} disabled={busy} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Meta Açıklama</Label>
                      <Textarea rows={2} value={values.meta_description} onChange={(e) => handleChange('meta_description', e.target.value)} disabled={busy} />
                    </div>
                  </div>

                  {/* Right sidebar */}
                  <div className="space-y-4 lg:col-span-4">
                    <div className="space-y-2">
                      <Label>Sıralama</Label>
                      <Input type="number" min={0} value={values.display_order} onChange={(e) => handleChange('display_order', e.target.value)} disabled={busy} />
                    </div>

                    <AdminImageUploadField label="Görsel" bucket="public" folder="services" value={norm(values.image_url)} onChange={(url) => handleChange('image_url', norm(url))} disabled={busy} />

                    {isNew && (
                      <>
                        <Separator />
                        <div className="flex items-start gap-2">
                          <Checkbox id="svc_replicate" checked={values.replicate_all_locales} onCheckedChange={(v) => handleChange('replicate_all_locales', v === true)} disabled={busy} />
                          <Label htmlFor="svc_replicate" className="leading-none">Tüm dillere kopyala</Label>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => router.back()} disabled={busy}>İptal</Button>
                  <Button type="submit" disabled={busy}><Save className="mr-2 size-4" />Kaydet</Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="json" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">JSON Veri</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <AdminJsonEditor value={values} onChange={(next) => setValues(next as FormValues)} disabled={busy} height={500} />
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={busy}>İptal</Button>
                <Button onClick={() => handleSubmit()} disabled={busy}><Save className="mr-2 size-4" />Kaydet</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
