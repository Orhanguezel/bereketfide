// =============================================================
// FILE: src/app/(main)/admin/(admin)/categories/[id]/CategoryDetailClient.tsx
// Category Detail/Edit Form — İçerik | SEO | Görsel tabs
// Bereket Fide
// =============================================================

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { useAIContentAssist } from '@/app/(main)/admin/_components/common/useAIContentAssist';
import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';
import { usePreferencesStore } from '@/stores/preferences/preferences-provider';
import { AdminLocaleSelect } from '@/app/(main)/admin/_components/common/AdminLocaleSelect';
import { AdminJsonEditor } from '@/app/(main)/admin/_components/common/AdminJsonEditor';
import { AdminImageUploadField } from '@/app/(main)/admin/_components/common/AdminImageUploadField';
import { useAdminLocales } from '@/app/(main)/admin/_components/common/useAdminLocales';
import { toast } from 'sonner';
import {
  useGetCategoryAdminQuery,
  useCreateCategoryAdminMutation,
  useUpdateCategoryAdminMutation,
} from '@/integrations/endpoints/admin/categories_admin.endpoints';

const inputClass =
  'w-full rounded border border-[#ccc] bg-white px-4 py-3 text-sm text-[#333] placeholder-[#999] outline-none focus:border-[#946e1c] focus:ring-1 focus:ring-[#946e1c]/30';

interface Props {
  id: string;
}

export default function CategoryDetailClient({ id }: Props) {
  const t = useAdminT('admin.categories');
  const router = useRouter();
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const isNew = id === 'new';

  // Locale management
  const { localeOptions } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState<string>(adminLocale || 'tr');
  const [activeTab, setActiveTab] = React.useState<'content' | 'seo' | 'image'>('content');

  // RTK Query
  const { data: category, isFetching, refetch } = useGetCategoryAdminQuery(
    { id, locale: activeLocale },
    { skip: isNew }
  );

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryAdminMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryAdminMutation();

  // Form state
  const [formData, setFormData] = React.useState({
    name: '',
    slug: '',
    locale: activeLocale,
    module_key: 'product' as string,
    description: '',
    alt: '',
    image_url: '',
    storage_asset_id: '',
    icon: '',
    is_active: true,
    is_featured: false,
    display_order: 0,
    meta_title: '',
    meta_description: '',
    i18n_data: {} as Record<string, any>,
  });

  // Load data when editing/locale changes
  React.useEffect(() => {
    if (category && !isNew) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        locale: category.locale || activeLocale,
        module_key: category.module_key || 'product',
        description: category.description || '',
        alt: category.alt || '',
        image_url: category.image_url || '',
        storage_asset_id: category.storage_asset_id || '',
        icon: category.icon || '',
        is_active: category.is_active ?? true,
        is_featured: category.is_featured ?? false,
        display_order: category.display_order || 0,
        meta_title: (category as any).meta_title || '',
        meta_description: (category as any).meta_description || '',
        i18n_data: (category as any).i18n_data || {},
      });
    }
  }, [category, isNew, activeLocale]);

  React.useEffect(() => {
    if (!isNew && id) {
      refetch();
    }
  }, [activeLocale, id, isNew, refetch]);

  const handleBack = () => router.push('/admin/categories');

  const handleLocaleChange = (nextLocale: string) => {
    setActiveLocale(nextLocale);
    setFormData((prev) => ({ ...prev, locale: nextLocale }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.error('Name ve Slug zorunludur');
      return;
    }

    try {
      const payload = { ...formData, locale: activeLocale };

      if (isNew) {
        await createCategory(payload).unwrap();
        toast.success('Kategori oluşturuldu');
      } else {
        await updateCategory({ id, patch: payload }).unwrap();
        toast.success('Kategori güncellendi');
      }
      router.push('/admin/categories');
    } catch (error: any) {
      const errMsg = error?.data?.error?.message || error?.message || 'Hata oluştu';
      toast.error(`Hata: ${errMsg}`);
    }
  };

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, image_url: url }));
  };

  const isLoading = isFetching || isCreating || isUpdating;

  // AI Content Assist
  const { assist: aiAssist, loading: aiLoading } = useAIContentAssist();

  const handleAIAssist = async () => {
    const targetLocales = localesForSelect.map((l: any) => l.value).filter(Boolean);
    if (!targetLocales.length) targetLocales.push(activeLocale);

    const result = await aiAssist({
      title: formData.name,
      summary: formData.description,
      content: formData.description,
      tags: '',
      locale: activeLocale,
      target_locales: targetLocales,
      module_key: formData.module_key,
      action: 'full',
    });

    if (!result) return;

    const current = result.find((r) => r.locale === activeLocale) || result[0];
    if (current) {
      setFormData((prev) => ({
        ...prev,
        name: current.title || prev.name,
        slug: current.slug || prev.slug,
        description: current.summary || current.content?.replace(/<[^>]+>/g, '').slice(0, 500) || prev.description,
        meta_title: current.meta_title || prev.meta_title,
        meta_description: current.meta_description || prev.meta_description,
      }));
    }
  };

  const localesForSelect = React.useMemo(() => {
    return (localeOptions || []).map((l: any) => ({
      value: String(l.value || ''),
      label: String(l.label || l.value || ''),
    }));
  }, [localeOptions]);

  // SEO preview URL
  const seoPreviewUrl = `bereketfide.com.tr/kategori/${formData.slug || 'kategori-slug'}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-base">
                  {isNew ? t('actions.create') : t('actions.edit')}
                </CardTitle>
                <CardDescription>
                  {isNew ? 'Yeni kategori oluştur' : `${category?.name || ''} düzenle`}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AdminLocaleSelect
                options={localesForSelect}
                value={activeLocale}
                onChange={handleLocaleChange}
                disabled={isLoading}
              />
              <Button variant="outline" onClick={handleAIAssist} disabled={isLoading || aiLoading}>
                <Sparkles className="h-4 w-4 mr-2" />
                {aiLoading ? 'AI...' : 'AI'}
              </Button>
              <Button onClick={() => handleSubmit()} disabled={isLoading || aiLoading}>
                <Save className="h-4 w-4 mr-2" />
                {t('actions.save')}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'content' | 'seo' | 'image')}>
        <TabsList>
          <TabsTrigger value="content">{t('tabs.content') || 'İçerik'}</TabsTrigger>
          <TabsTrigger value="seo">{t('tabs.seo') || 'SEO'}</TabsTrigger>
          <TabsTrigger value="image">{t('tabs.image') || 'Görsel'}</TabsTrigger>
        </TabsList>

        {/* İçerik Tab */}
        <TabsContent value="content">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{t('table.name')} *</Label>
                <input
                  id="name"
                  className={inputClass}
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={isLoading}
                  placeholder="Örn: Meyve Fideleri"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">{t('table.slug')} *</Label>
                <input
                  id="slug"
                  className={inputClass}
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  disabled={isLoading}
                  placeholder="Örn: meyve-fideleri"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <textarea
                  id="description"
                  className={`${inputClass} resize-y`}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  disabled={isLoading}
                  rows={4}
                  placeholder="Kategori açıklaması"
                />
              </div>

              {/* Module */}
              <div className="space-y-2">
                <Label htmlFor="module">{t('table.module')}</Label>
                <Select
                  value={formData.module_key}
                  onValueChange={(v) => handleChange('module_key', v)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="module">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">{t('modules.product')}</SelectItem>
                    <SelectItem value="services">{t('modules.services')}</SelectItem>
                    <SelectItem value="news">{t('modules.news')}</SelectItem>
                    <SelectItem value="library">{t('modules.library')}</SelectItem>
                    <SelectItem value="about">{t('modules.about')}</SelectItem>
                    <SelectItem value="sparepart">{t('modules.sparepart')}</SelectItem>
                    <SelectItem value="references">{t('modules.references')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Icon & Alt */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <input
                    id="icon"
                    className={inputClass}
                    value={formData.icon}
                    onChange={(e) => handleChange('icon', e.target.value)}
                    disabled={isLoading}
                    placeholder="fa-cube"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alt">Alt Text</Label>
                  <input
                    id="alt"
                    className={inputClass}
                    value={formData.alt}
                    onChange={(e) => handleChange('alt', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Display Order */}
              <div className="space-y-2">
                <Label htmlFor="display_order">Sıralama</Label>
                <input
                  id="display_order"
                  type="number"
                  className={inputClass}
                  value={formData.display_order}
                  onChange={(e) => handleChange('display_order', Number(e.target.value))}
                  disabled={isLoading}
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(v) => handleChange('is_active', v)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">
                    {t('table.active')}
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
                    {t('table.featured')}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Meta Title */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <span className={`text-xs ${(formData.meta_title?.length || 0) > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {formData.meta_title?.length || 0}/60
                  </span>
                </div>
                <input
                  id="meta_title"
                  className={inputClass}
                  value={formData.meta_title}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  disabled={isLoading}
                  placeholder="Sayfa başlığı (arama sonuçlarında görünür)"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <span className={`text-xs ${(formData.meta_description?.length || 0) > 155 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {formData.meta_description?.length || 0}/155
                  </span>
                </div>
                <textarea
                  id="meta_description"
                  className={`${inputClass} resize-y`}
                  value={formData.meta_description}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  disabled={isLoading}
                  rows={3}
                  placeholder="Sayfa açıklaması (arama sonuçlarında görünür)"
                />
              </div>

              {/* Google Search Preview */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Google Arama Önizlemesi</Label>
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-1">
                  <div className="text-xs text-green-700 truncate">{seoPreviewUrl}</div>
                  <div className="text-base text-blue-700 font-medium truncate">
                    {formData.meta_title || formData.name || 'Sayfa Başlığı'}
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {formData.meta_description || formData.description || 'Sayfa açıklaması burada görünecek...'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Görsel Tab */}
        <TabsContent value="image">
          <Card>
            <CardContent className="pt-6">
              <div className="max-w-md">
                <AdminImageUploadField
                  label="Kategori Görseli"
                  value={formData.image_url}
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
