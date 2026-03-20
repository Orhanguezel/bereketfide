'use client';

// =============================================================
// Admin Library (Katalog) Detail — İçerik | SEO | Görsel | Dosyalar
// =============================================================

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save, FileText, Plus, Trash2, ExternalLink, Download } from 'lucide-react';

import { useAdminT } from '@/app/(main)/(admin-pages)/_components/common/useAdminT';
import { useAdminLocales } from '@/app/(main)/(admin-pages)/_components/common/useAdminLocales';
import { AdminLocaleSelect } from '@/app/(main)/(admin-pages)/_components/common/AdminLocaleSelect';
import { AdminImageUploadField } from '@/app/(main)/(admin-pages)/_components/common/AdminImageUploadField';
import { OfferPdfPreview } from '@/app/(main)/(admin-pages)/(admin)/offer/_components/offer-pdf-preview';
import { resolveAdminApiLocale } from '@/i18n/adminLocale';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import {
  useGetLibraryAdminQuery,
  useCreateLibraryAdminMutation,
  useUpdateLibraryAdminMutation,
  useListLibraryFilesAdminQuery,
  useCreateLibraryFileAdminMutation,
  useDeleteLibraryFileAdminMutation,
  useCreateAssetAdminMutation,
} from '@/integrations/hooks';
import type { LibraryAdminDto, LibraryFileDto } from '@/integrations/endpoints/admin/library_admin.endpoints';

const cls = 'w-full rounded border border-[#ccc] bg-white px-4 py-3 text-sm text-[#333] placeholder-[#999] outline-none focus:border-[#946e1c] focus:ring-1 focus:ring-[#946e1c]/30';

function slugify(text: string): string {
  return text.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

type FormData = {
  name: string;
  slug: string;
  type: string;
  locale: string;
  description: string;
  tags: string;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
  featured: boolean;
  image_url: string;
};

const emptyForm = (locale: string): FormData => ({
  name: '', slug: '', type: 'catalog', locale, description: '', tags: '',
  meta_title: '', meta_description: '', is_published: false, featured: false, image_url: '',
});

function isUuidLike(v?: string) {
  return !!v && /^[0-9a-f-]{20,}$/i.test(v);
}

export default function AdminLibraryDetailClient({ id }: { id: string }) {
  const t = useAdminT('admin.library');
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = id === 'new';

  const { localeOptions, defaultLocaleFromDb, loading: localesLoading, fetching: localesFetching } = useAdminLocales();
  const apiLocale = React.useMemo(() => resolveAdminApiLocale(localeOptions as any, defaultLocaleFromDb, 'tr'), [localeOptions, defaultLocaleFromDb]);

  const initialLocale = searchParams.get('locale') || apiLocale || 'tr';
  const [activeLocale, setActiveLocale] = React.useState(initialLocale);
  const [activeTab, setActiveTab] = React.useState('content');
  const [autoSlug, setAutoSlug] = React.useState(true);

  const effectiveLocale = activeLocale || apiLocale || 'tr';

  // Fetch
  const getQ = useGetLibraryAdminQuery({ id, locale: effectiveLocale }, { skip: isNew || !isUuidLike(id) });
  const [formData, setFormData] = React.useState<FormData>(emptyForm(effectiveLocale));

  React.useEffect(() => {
    if (isNew || !getQ.data) return;
    const d = getQ.data;
    setFormData({
      name: d.name || '', slug: d.slug || '', type: d.type || 'catalog', locale: d.locale || effectiveLocale,
      description: d.description || '', tags: d.tags || '', meta_title: d.meta_title || '',
      meta_description: d.meta_description || '', is_published: !!d.is_published, featured: !!d.featured,
      image_url: d.image_url || d.featured_image || '',
    });
    setAutoSlug(false);
  }, [getQ.data, isNew, effectiveLocale]);

  // Mutations
  const [createLibrary, createState] = useCreateLibraryAdminMutation();
  const [updateLibrary, updateState] = useUpdateLibraryAdminMutation();
  const saving = createState.isLoading || updateState.isLoading;
  const loading = localesLoading || localesFetching || getQ.isLoading || getQ.isFetching;
  const busy = loading || saving;

  const handleChange = (field: keyof FormData, value: unknown) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'name' && autoSlug) next.slug = slugify(String(value));
      return next;
    });
    if (field === 'slug') setAutoSlug(false);
  };

  async function handleSubmit() {
    try {
      const payload: Partial<LibraryAdminDto> = {
        name: formData.name.trim(), slug: formData.slug.trim(), type: formData.type,
        locale: formData.locale || effectiveLocale, description: formData.description.trim() || undefined,
        tags: formData.tags.trim() || undefined, meta_title: formData.meta_title.trim() || undefined,
        meta_description: formData.meta_description.trim() || undefined, is_published: formData.is_published,
        featured: formData.featured, image_url: formData.image_url.trim() || undefined,
        featured_image: formData.image_url.trim() || undefined,
      };
      if (isNew) {
        const created = await createLibrary(payload).unwrap();
        toast.success(t('messages.created'));
        if (created?.id) router.replace(`/library/${created.id}?locale=${effectiveLocale}`);
      } else {
        await updateLibrary({ id, patch: payload }).unwrap();
        toast.success(t('messages.updated'));
      }
    } catch { toast.error(t('messages.error')); }
  }

  // Files
  const filesQ = useListLibraryFilesAdminQuery({ id }, { skip: isNew || !isUuidLike(id) });
  const files: LibraryFileDto[] = filesQ.data ?? [];
  const [createFile] = useCreateLibraryFileAdminMutation();
  const [deleteFile] = useDeleteLibraryFileAdminMutation();
  const [createAsset, { isLoading: isUploading }] = useCreateAssetAdminMutation();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    e.target.value = '';
    if (!selected) return;

    try {
      const res = await createAsset({
        file: selected,
        bucket: 'public',
        folder: 'uploads/library',
      } as any).unwrap();
      const url = (res as any)?.url;
      if (!url) throw new Error('URL alınamadı');

      await createFile({
        id,
        body: {
          file_url: url,
          name: selected.name,
          mime_type: selected.type || 'application/octet-stream',
          size_bytes: selected.size,
          display_order: files.length,
          is_active: true,
        } as any,
      }).unwrap();
      filesQ.refetch();
      toast.success(`${selected.name} yüklendi.`);
    } catch {
      toast.error(t('messages.error'));
    }
  }

  async function handleDeleteFile(fileId: string) {
    try { await deleteFile({ id, fileId }).unwrap(); filesQ.refetch(); } catch { toast.error(t('messages.error')); }
  }

  function formatBytes(bytes: number | null): string {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/library')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-base">{isNew ? t('detail.createTitle') : t('detail.editTitle')}</CardTitle>
              {busy && <Badge variant="outline">...</Badge>}
            </div>
            <div className="flex items-center gap-3">
              <AdminLocaleSelect
                options={(localeOptions as any) ?? []}
                value={activeLocale || effectiveLocale}
                onChange={(l) => { setActiveLocale(l); setFormData((prev) => ({ ...prev, locale: l })); }}
                loading={localesLoading || localesFetching}
                disabled={busy}
              />
              <Button onClick={handleSubmit} disabled={busy}>
                <Save className="h-4 w-4 mr-2" />{t('actions.save')}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">{t('detail.tabs.content') || 'İçerik'}</TabsTrigger>
          <TabsTrigger value="seo">{t('detail.tabs.seo') || 'SEO'}</TabsTrigger>
          <TabsTrigger value="image">{t('detail.tabs.image') || 'Görsel'}</TabsTrigger>
          {!isNew && <TabsTrigger value="files">{t('detail.tabs.files')}</TabsTrigger>}
        </TabsList>

        {/* ── İçerik Tab ── */}
        <TabsContent value="content">
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div>
                <Label className="mb-1 block text-sm font-medium">{t('detail.fields.name')}</Label>
                <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className={cls} disabled={busy} />
              </div>
              <div>
                <Label className="mb-1 block text-sm font-medium">{t('detail.fields.slug')}</Label>
                <input type="text" value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} className={cls} disabled={busy} />
              </div>
              <div>
                <Label className="mb-1 block text-sm font-medium">{t('detail.fields.description')}</Label>
                <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={5} className={cls} disabled={busy} />
              </div>
              <div>
                <Label className="mb-1 block text-sm font-medium">{t('detail.fields.tags')}</Label>
                <input type="text" value={formData.tags} onChange={(e) => handleChange('tags', e.target.value)} className={cls} disabled={busy} placeholder="katalog, sebze fideleri" />
              </div>
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Switch id="is_published" checked={formData.is_published} onCheckedChange={(v) => handleChange('is_published', v)} disabled={busy} />
                  <Label htmlFor="is_published">{t('detail.fields.published')}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="featured" checked={formData.featured} onCheckedChange={(v) => handleChange('featured', v)} disabled={busy} />
                  <Label htmlFor="featured">{t('detail.fields.featured')}</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── SEO Tab ── */}
        <TabsContent value="seo">
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div>
                <Label className="mb-1 block text-sm font-medium">{t('detail.fields.metaTitle')}</Label>
                <input type="text" value={formData.meta_title} onChange={(e) => handleChange('meta_title', e.target.value)} className={cls} disabled={busy} />
                <p className="mt-1 text-xs text-muted-foreground">{formData.meta_title.length}/60</p>
              </div>
              <div>
                <Label className="mb-1 block text-sm font-medium">{t('detail.fields.metaDescription')}</Label>
                <textarea value={formData.meta_description} onChange={(e) => handleChange('meta_description', e.target.value)} rows={3} className={cls} disabled={busy} />
                <p className="mt-1 text-xs text-muted-foreground">{formData.meta_description.length}/155</p>
              </div>

              {/* Google Preview */}
              <div className="rounded-md border bg-background p-4 space-y-1">
                <p className="text-xs text-muted-foreground">www.bereketfide.com.tr › {effectiveLocale}/kataloglar/{formData.slug || '...'}</p>
                <p className="text-sm font-medium text-[#1a0dab] truncate">{formData.meta_title || formData.name || 'Katalog'}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{formData.meta_description || formData.description || ''}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Görsel Tab ── */}
        <TabsContent value="image">
          <Card>
            <CardContent className="pt-6">
              <div className="max-w-md">
                <AdminImageUploadField
                  label={t('detail.fields.image')}
                  value={formData.image_url}
                  onChange={(url) => handleChange('image_url', url)}
                  disabled={busy}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Dosyalar Tab ── */}
        {!isNew && (
          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('detail.files.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add file — dosya seçerek yükle */}
                <div className="flex flex-wrap gap-3 items-center p-4 rounded-lg border bg-muted/30">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || busy}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isUploading ? 'Yükleniyor...' : (t('detail.files.add') || 'Dosya Ekle')}
                  </Button>
                  <p className="text-xs text-muted-foreground">PDF, DOC, XLS, ZIP dosyalarını yükleyebilirsiniz.</p>
                </div>

                {files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">{t('detail.files.noFiles')}</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('detail.files.name')}</TableHead>
                        <TableHead>{t('detail.files.url')}</TableHead>
                        <TableHead>{t('detail.files.size')}</TableHead>
                        <TableHead>{t('detail.files.type')}</TableHead>
                        <TableHead className="text-right">{t('columns.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {files.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium">{file.name || '-'}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[300px] truncate">
                            <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1">
                              {file.file_url} <ExternalLink className="h-3 w-3" />
                            </a>
                          </TableCell>
                          <TableCell>{formatBytes(file.size_bytes)}</TableCell>
                          <TableCell><Badge variant="outline">{file.mime_type || '-'}</Badge></TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteFile(file.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {/* PDF Önizleme */}
                {files.filter((f) => f.mime_type?.includes('pdf') || f.file_url?.endsWith('.pdf')).map((pdfFile) => (
                  <div key={pdfFile.id} className="space-y-2 pt-4 border-t">
                    <Label className="text-sm font-medium">{pdfFile.name || 'PDF'} — Önizleme</Label>
                    <OfferPdfPreview
                      pdfUrl={pdfFile.file_url}
                      emptyMessage="PDF yüklenemedi."
                      fallbackLabel="PDF görüntülenemiyorsa"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
