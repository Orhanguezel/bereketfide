'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Save, RotateCcw, Palette, Type, CircleDot, Sun, Moon, Monitor } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

import {
  useGetThemeAdminQuery,
  useUpdateThemeAdminMutation,
  useResetThemeAdminMutation,
} from '@/integrations/hooks';

import type { ColorTokens, ThemeConfig, ThemeUpdateInput } from '@/integrations/shared/theme.types';
import { COLOR_TOKEN_LABELS, RADIUS_OPTIONS } from '@/integrations/shared/theme.types';
import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';

/* ── Color Picker ── */

function ColorField({
  tokenKey,
  value,
  onChange,
}: {
  tokenKey: keyof ColorTokens;
  value: string;
  onChange: (key: keyof ColorTokens, val: string) => void;
}) {
  const meta = COLOR_TOKEN_LABELS[tokenKey];
  return (
    <div className="flex items-center gap-3">
      <label
        className="relative size-10 shrink-0 cursor-pointer rounded-md border overflow-hidden"
        title={meta.label}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(tokenKey, e.target.value)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
        <span className="block size-full rounded-md" style={{ backgroundColor: value }} />
      </label>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{meta.label}</div>
        <Input
          value={value}
          onChange={(e) => onChange(tokenKey, e.target.value)}
          className="h-7 mt-1 font-mono text-xs"
          maxLength={7}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

/* ── Preview Card ── */

function ThemePreview({ colors }: { colors: ColorTokens }) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Nav */}
      <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: colors.navBg, color: colors.navFg }}>
        <span className="text-sm font-bold">Bereket Fide</span>
        <div className="flex gap-2 text-xs">
          <span>Anasayfa</span>
          <span>Ürünler</span>
          <span>İletişim</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3" style={{ backgroundColor: colors.surfaceBase }}>
        <div className="rounded-md p-3" style={{ backgroundColor: colors.surfaceRaised, border: `1px solid ${colors.border}` }}>
          <div className="text-sm font-semibold" style={{ color: colors.textStrong }}>Başlık Metni</div>
          <div className="text-xs mt-1" style={{ color: colors.textBody }}>Gövde metin örneği</div>
          <div className="text-xs mt-1" style={{ color: colors.textMuted }}>Soluk metin</div>
        </div>

        <div className="flex gap-2">
          <div className="rounded-md px-3 py-1.5 text-xs text-white" style={{ backgroundColor: colors.primary }}>
            Ana Buton
          </div>
          <div className="rounded-md px-3 py-1.5 text-xs" style={{ backgroundColor: colors.accent, color: colors.textStrong }}>
            Vurgu
          </div>
        </div>

        {/* Dark section preview */}
        <div className="rounded-md p-3" style={{ backgroundColor: colors.surfaceDarkBg }}>
          <div className="text-xs font-semibold" style={{ color: colors.surfaceDarkHeading }}>Koyu Bölüm</div>
          <div className="text-xs mt-1" style={{ color: colors.surfaceDarkText }}>Koyu bölüm metin</div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 text-xs" style={{ backgroundColor: colors.footerBg, color: colors.footerFg }}>
        © Bereket Fide
      </div>
    </div>
  );
}

/* ── Main Component ── */

export default function AdminThemeClient() {
  const t = useAdminT('admin.theme');
  const { data: theme, isLoading } = useGetThemeAdminQuery();
  const [updateTheme, { isLoading: saving }] = useUpdateThemeAdminMutation();
  const [resetTheme, { isLoading: resetting }] = useResetThemeAdminMutation();

  const [draft, setDraft] = React.useState<ThemeConfig | null>(null);

  React.useEffect(() => {
    if (theme && !draft) setDraft(theme);
  }, [theme, draft]);

  if (isLoading || !draft) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="size-8" />
      </div>
    );
  }

  const setColor = (key: keyof ColorTokens, val: string) => {
    setDraft((prev) => prev ? { ...prev, colors: { ...prev.colors, [key]: val } } : prev);
  };

  const handleSave = async () => {
    if (!draft) return;
    try {
      await updateTheme({
        colors: draft.colors,
        typography: draft.typography,
        radius: draft.radius,
        darkMode: draft.darkMode,
      }).unwrap();
      toast.success(t('saved') || 'Tema kaydedildi');
    } catch {
      toast.error(t('saveError') || 'Kayıt başarısız');
    }
  };

  const handleReset = async () => {
    try {
      const result = await resetTheme().unwrap();
      setDraft(result);
      toast.success(t('reset') || 'Varsayılana sıfırlandı');
    } catch {
      toast.error(t('resetError') || 'Sıfırlama başarısız');
    }
  };

  // Group colors by group
  const groups = new Map<string, (keyof ColorTokens)[]>();
  for (const [key, meta] of Object.entries(COLOR_TOKEN_LABELS)) {
    const group = meta.group;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(key as keyof ColorTokens);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{t('title') || 'Tema Ayarları'}</CardTitle>
              <CardDescription>{t('description') || 'Frontend renk, tipografi ve görünüm ayarlarını yönetin.'}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset} disabled={saving || resetting}>
                <RotateCcw className="mr-2 size-4" />
                {t('resetButton') || 'Sıfırla'}
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving || resetting}>
                <Save className="mr-2 size-4" />
                {saving ? (t('saving') || 'Kaydediliyor...') : (t('saveButton') || 'Kaydet')}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sol: Ayarlar */}
        <div className="xl:col-span-2 space-y-6">
          <Tabs defaultValue="colors">
            <TabsList>
              <TabsTrigger value="colors">
                <Palette className="mr-2 size-4" />
                {t('colorsTab') || 'Renkler'}
              </TabsTrigger>
              <TabsTrigger value="typography">
                <Type className="mr-2 size-4" />
                {t('typographyTab') || 'Tipografi'}
              </TabsTrigger>
              <TabsTrigger value="general">
                <CircleDot className="mr-2 size-4" />
                {t('generalTab') || 'Genel'}
              </TabsTrigger>
            </TabsList>

            {/* ── Colors Tab ── */}
            <TabsContent value="colors" className="space-y-4 mt-4">
              {Array.from(groups.entries()).map(([group, keys]) => (
                <Card key={group}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{group}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {keys.map((key) => (
                        <ColorField
                          key={key}
                          tokenKey={key}
                          value={draft.colors[key]}
                          onChange={setColor}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* ── Typography Tab ── */}
            <TabsContent value="typography" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{t('fonts') || 'Font Ailesi'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('fontHeading') || 'Başlık Fontu'}</Label>
                    <Input
                      value={draft.typography.fontHeading}
                      onChange={(e) => setDraft((p) => p ? { ...p, typography: { ...p.typography, fontHeading: e.target.value } } : p)}
                      placeholder="Syne, system-ui, sans-serif"
                    />
                    <div className="text-2xl font-bold mt-2" style={{ fontFamily: draft.typography.fontHeading }}>
                      Bereket Fide Başlık Önizleme
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>{t('fontBody') || 'Gövde Fontu'}</Label>
                    <Input
                      value={draft.typography.fontBody}
                      onChange={(e) => setDraft((p) => p ? { ...p, typography: { ...p.typography, fontBody: e.target.value } } : p)}
                      placeholder="DM Sans, system-ui, sans-serif"
                    />
                    <div className="text-sm mt-2" style={{ fontFamily: draft.typography.fontBody }}>
                      Bu bir gövde metin önizlemesidir. Bereket Fide olarak, kaliteli fide üretimi yapıyoruz.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── General Tab ── */}
            <TabsContent value="general" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{t('borderRadius') || 'Köşe Yuvarlaklığı'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={draft.radius}
                    onValueChange={(v) => setDraft((p) => p ? { ...p, radius: v } : p)}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RADIUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-3 mt-3">
                    {['sm', 'md', 'lg'].map((size, i) => (
                      <div
                        key={size}
                        className="size-16 border-2 flex items-center justify-center text-xs font-medium"
                        style={{
                          borderRadius: `calc(${draft.radius} * ${0.5 + i * 0.5})`,
                          borderColor: draft.colors.primary,
                          color: draft.colors.textBody,
                        }}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{t('darkModeLabel') || 'Tema Modu'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {([
                      { value: 'light', icon: Sun, label: 'Açık' },
                      { value: 'dark', icon: Moon, label: 'Koyu' },
                      { value: 'system', icon: Monitor, label: 'Sistem' },
                    ] as const).map(({ value, icon: Icon, label }) => (
                      <Button
                        key={value}
                        variant={draft.darkMode === value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDraft((p) => p ? { ...p, darkMode: value } : p)}
                      >
                        <Icon className="mr-2 size-4" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sağ: Canlı Önizleme */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{t('preview') || 'Canlı Önizleme'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ThemePreview colors={draft.colors} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
