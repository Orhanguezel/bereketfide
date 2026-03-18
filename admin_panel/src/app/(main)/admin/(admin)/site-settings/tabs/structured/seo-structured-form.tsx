// =============================================================
// FILE: seo-structured-form.tsx
// SEO Structured Form — supports both simple and advanced modes
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { useAdminTranslations } from '@/i18n';
import { usePreferencesStore } from '@/stores/preferences/preferences-provider';

import { AdminImageUploadField } from '@/app/(main)/admin/_components/common/AdminImageUploadField';
import type { SettingValue } from '@/integrations/shared';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

/* ── helpers ── */

function coerceSettingValue(input: any): any {
  if (input === null || input === undefined) return input;
  if (typeof input === 'object') return input;
  if (typeof input === 'string') {
    const s = input.trim();
    if (!s) return input;
    try { return JSON.parse(s); } catch { return input; }
  }
  return input;
}

/* ── Simple SEO (bereketfide__seo style) ── */

type SimpleSeo = {
  site_title: string;
  site_description: string;
  keywords: string;
  og_image: string;
  og_type: string;
};

function isSimpleSeo(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return false;
  return 'site_title' in obj || 'site_description' in obj || 'keywords' in obj;
}

function normalizeSimpleSeo(obj: any): SimpleSeo {
  const o = obj && typeof obj === 'object' ? obj : {};
  return {
    site_title: String(o.site_title ?? ''),
    site_description: String(o.site_description ?? ''),
    keywords: String(o.keywords ?? ''),
    og_image: String(o.og_image ?? ''),
    og_type: String(o.og_type ?? 'website'),
  };
}

/* ── Advanced SEO (global seo style) ── */

type AdvancedSeo = {
  site_name: string;
  title_default: string;
  title_template: string;
  description: string;
  og_type: string;
  og_image: string;
  twitter_card: string;
  noindex: boolean;
};

function normalizeAdvanced(obj: any): AdvancedSeo {
  const o = obj && typeof obj === 'object' ? obj : {};
  const ogImages = Array.isArray(o?.open_graph?.images) ? o.open_graph.images : [];
  return {
    site_name: String(o.site_name ?? ''),
    title_default: String(o.title_default ?? ''),
    title_template: String(o.title_template ?? ''),
    description: String(o.description ?? ''),
    og_type: String(o?.open_graph?.type ?? 'website'),
    og_image: ogImages[0] || '',
    twitter_card: String(o?.twitter?.card ?? 'summary_large_image'),
    noindex: Boolean(o?.robots?.noindex),
  };
}

function advancedToObj(v: AdvancedSeo): any {
  return {
    site_name: v.site_name,
    title_default: v.title_default,
    title_template: v.title_template,
    description: v.description,
    open_graph: {
      type: v.og_type,
      images: v.og_image ? [v.og_image] : [],
    },
    twitter: { card: v.twitter_card, site: '', creator: '' },
    robots: { noindex: v.noindex, index: !v.noindex, follow: true },
  };
}

/* ── props ── */

export type SeoStructuredFormProps = {
  settingKey: string;
  locale: string;
  value: SettingValue;
  setValue: (next: any) => void;
  disabled?: boolean;
};

/* ── component ── */

export const SeoStructuredForm: React.FC<SeoStructuredFormProps> = ({
  settingKey,
  locale,
  value,
  setValue,
  disabled,
}) => {
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);

  const raw = useMemo(() => coerceSettingValue(value) ?? {}, [value]);
  const simple = isSimpleSeo(raw);

  if (simple) {
    return (
      <SimpleSeoForm
        value={normalizeSimpleSeo(raw)}
        onChange={(next) => setValue(next)}
        disabled={disabled}
        settingKey={settingKey}
        locale={locale}
      />
    );
  }

  return (
    <AdvancedSeoForm
      value={normalizeAdvanced(raw)}
      onChange={(next) => setValue(advancedToObj(next))}
      disabled={disabled}
      settingKey={settingKey}
      locale={locale}
    />
  );
};

SeoStructuredForm.displayName = 'SeoStructuredForm';

/* ── Simple SEO Form (bereketfide__seo) ── */

function SimpleSeoForm({
  value: v,
  onChange,
  disabled,
  settingKey,
  locale,
}: {
  value: SimpleSeo;
  onChange: (next: SimpleSeo) => void;
  disabled?: boolean;
  settingKey: string;
  locale: string;
}) {
  const set = (patch: Partial<SimpleSeo>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-4">
      <Alert variant="default" className="py-2">
        <AlertDescription className="text-sm">
          Arama motoru optimizasyonu ayarları. Bu bilgiler Google ve sosyal medya paylaşımlarında görünür.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="seo-title" className="text-sm">Site Başlığı</Label>
          <Input
            id="seo-title"
            value={v.site_title}
            onChange={(e) => set({ site_title: e.target.value })}
            disabled={disabled}
            placeholder="Bereket Fide | Kaliteli Fide Çeşitleri"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="seo-desc" className="text-sm">Site Açıklaması</Label>
          <Textarea
            id="seo-desc"
            rows={3}
            value={v.site_description}
            onChange={(e) => set({ site_description: e.target.value })}
            disabled={disabled}
            className="text-sm"
            placeholder="Kaliteli fide ve bitki çeşitleri ile doğaya değer katıyoruz."
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="seo-keywords" className="text-sm">Anahtar Kelimeler</Label>
          <Input
            id="seo-keywords"
            value={v.keywords}
            onChange={(e) => set({ keywords: e.target.value })}
            disabled={disabled}
            placeholder="fide, bitki, tohum, sera, tarım"
          />
          <p className="text-xs text-muted-foreground">Virgülle ayırın</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="seo-og-type" className="text-sm">OG Type</Label>
          <Select
            value={v.og_type || 'website'}
            onValueChange={(val) => set({ og_type: val })}
            disabled={disabled}
          >
            <SelectTrigger id="seo-og-type" className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">website</SelectItem>
              <SelectItem value="article">article</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="seo-og-image" className="text-sm">OG Image URL</Label>
          <Input
            id="seo-og-image"
            value={v.og_image}
            onChange={(e) => set({ og_image: e.target.value })}
            disabled={disabled}
            placeholder="/logo/png/bereket_logo_512.png"
          />
        </div>
      </div>
    </div>
  );
}

/* ── Advanced SEO Form (global seo/site_seo) ── */

function AdvancedSeoForm({
  value: v,
  onChange,
  disabled,
  settingKey,
  locale,
}: {
  value: AdvancedSeo;
  onChange: (next: AdvancedSeo) => void;
  disabled?: boolean;
  settingKey: string;
  locale: string;
}) {
  const set = (patch: Partial<AdvancedSeo>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-4">
      <Alert variant="default" className="py-2">
        <AlertDescription className="text-sm">
          SEO ve sosyal medya meta tag ayarları. Open Graph ve Twitter Card bilgileri.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="seo-site-name" className="text-sm">Site Adı</Label>
          <Input
            id="seo-site-name"
            value={v.site_name}
            onChange={(e) => set({ site_name: e.target.value })}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seo-title-default" className="text-sm">Varsayılan Başlık</Label>
          <Input
            id="seo-title-default"
            value={v.title_default}
            onChange={(e) => set({ title_default: e.target.value })}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seo-title-template" className="text-sm">Başlık Şablonu</Label>
          <Input
            id="seo-title-template"
            value={v.title_template}
            onChange={(e) => set({ title_template: e.target.value })}
            disabled={disabled}
            placeholder="%s – Bereket Fide"
          />
          <p className="text-xs text-muted-foreground">%s sayfa başlığı ile değiştirilir</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="seo-og-type" className="text-sm">OG Type</Label>
          <Select
            value={v.og_type || 'website'}
            onValueChange={(val) => set({ og_type: val })}
            disabled={disabled}
          >
            <SelectTrigger id="seo-og-type" className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">website</SelectItem>
              <SelectItem value="article">article</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="seo-description" className="text-sm">Açıklama</Label>
          <Textarea
            id="seo-description"
            rows={3}
            value={v.description}
            onChange={(e) => set({ description: e.target.value })}
            disabled={disabled}
            className="text-sm"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <AdminImageUploadField
            label="OG Image"
            folder="seo"
            bucket="public"
            metadata={{ module_key: 'seo', locale, key: settingKey }}
            value={v.og_image}
            onChange={(url) => set({ og_image: url })}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seo-twitter-card" className="text-sm">Twitter Card</Label>
          <Select
            value={v.twitter_card || 'summary_large_image'}
            onValueChange={(val) => set({ twitter_card: val })}
            disabled={disabled}
          >
            <SelectTrigger id="seo-twitter-card" className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary_large_image">summary_large_image</SelectItem>
              <SelectItem value="summary">summary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 pt-6">
          <Switch
            id="seo-noindex"
            checked={v.noindex}
            onCheckedChange={(checked) => set({ noindex: checked })}
            disabled={disabled}
          />
          <Label htmlFor="seo-noindex" className="text-sm">noindex (arama motorlarından gizle)</Label>
        </div>
      </div>
    </div>
  );
}
