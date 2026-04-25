'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { RefreshCcw, Save } from 'lucide-react';
import { useAdminTranslations } from '@/i18n';
import { usePreferencesStore } from '@/stores/preferences/preferences-provider';

import {
  useListSiteSettingsAdminQuery,
  useUpdateSiteSettingAdminMutation,
} from '@/integrations/hooks';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const SETTING_KEY = 'bereketfide__hal_ticker_slugs';

const EMOJI: Record<string, string> = {
  domates: '🍅', biber: '🫑', patlican: '🍆', salatalik: '🥒',
  kabak: '🥒', havuc: '🥕', sogan: '🧅', marul: '🥬',
  brokoli: '🥦', kavun: '🍈', karpuz: '🍉', karnabahar: '🥦',
  ispanak: '🥬', fasulye: '🫛', sarimsak: '🧄', misir: '🌽',
};

interface HalProduct {
  slug: string;
  nameTr: string;
  categorySlug: string;
}

export type HalTickerSettingsTabProps = { locale: string };

export const HalTickerSettingsTab: React.FC<HalTickerSettingsTabProps> = () => {
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);

  const { data: settings, isLoading, isFetching, refetch } = useListSiteSettingsAdminQuery({
    keys: [SETTING_KEY],
    locale: '*',
  } as any);

  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();

  const [products, setProducts] = React.useState<HalProduct[]>([]);
  const [productsLoading, setProductsLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<string[]>([]);

  // Load saved slugs from siteSettings
  React.useEffect(() => {
    if (!settings) return;
    const row = (settings as any[]).find((s) => s.key === SETTING_KEY);
    const val = row?.value;
    if (Array.isArray(val)) {
      setSelected(val);
    } else if (typeof val === 'string' && val.trim()) {
      setSelected(val.split(',').map((s: string) => s.trim()).filter(Boolean));
    }
  }, [settings]);

  // Fetch available products via widget endpoint (has CORS: Access-Control-Allow-Origin: *)
  // /prices/products does not set CORS headers, so we use the widget with limit=50
  React.useEffect(() => {
    let cancelled = false;
    setProductsLoading(true);
    fetch('https://haldefiyat.com/api/v1/prices/widget?limit=50')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const raw = Array.isArray(data?.items) ? data.items : [];
        const seen = new Set<string>();
        const items: HalProduct[] = [];
        for (const item of raw) {
          if (!item?.productSlug || seen.has(item.productSlug)) continue;
          seen.add(item.productSlug);
          items.push({ slug: item.productSlug, nameTr: item.productName, categorySlug: item.categorySlug ?? '' });
        }
        setProducts(items);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setProductsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const busy = isLoading || isFetching || isSaving || productsLoading;

  const toggle = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const handleSave = async () => {
    try {
      await updateSetting({
        key: SETTING_KEY,
        value: selected as any,
        locale: '*',
      }).unwrap();
      toast.success(t('admin.siteSettings.halTicker.saved'));
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || t('admin.siteSettings.halTicker.saveError'));
    }
  };

  const emoji = (slug: string) => {
    const s = slug.toLowerCase();
    if (EMOJI[s]) return EMOJI[s];
    for (const key of Object.keys(EMOJI)) {
      if (s.startsWith(key)) return EMOJI[key];
    }
    return '🌿';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base">{t('admin.siteSettings.halTicker.title')}</CardTitle>
            <CardDescription className="mt-1 text-xs">
              {t('admin.siteSettings.halTicker.description')}
            </CardDescription>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {busy && <Badge variant="outline">{t('admin.siteSettings.halTicker.loading')}</Badge>}
            <Button type="button" size="sm" onClick={handleSave} disabled={busy}>
              <Save className="mr-2 h-3.5 w-3.5" />
              {t('admin.siteSettings.halTicker.save')}
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => refetch()} disabled={busy}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Selected count */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{t('admin.siteSettings.halTicker.selectedCount', { count: selected.length })}</span>
          {selected.length > 0 && (
            <button
              type="button"
              className="text-destructive hover:underline"
              onClick={() => setSelected([])}
            >
              {t('admin.siteSettings.halTicker.clearAll')}
            </button>
          )}
        </div>

        {/* Product grid */}
        {productsLoading ? (
          <div className="text-sm text-muted-foreground">{t('admin.siteSettings.halTicker.loadingProducts')}</div>
        ) : products.length === 0 ? (
          <div className="text-sm text-muted-foreground">{t('admin.siteSettings.halTicker.noProducts')}</div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => {
              const checked = selected.includes(p.slug);
              return (
                <label
                  key={p.slug}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2.5 text-sm transition-colors ${
                    checked
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggle(p.slug)}
                    disabled={busy}
                    id={`hal-slug-${p.slug}`}
                  />
                  <span className="text-base leading-none" aria-hidden>{emoji(p.slug)}</span>
                  <Label htmlFor={`hal-slug-${p.slug}`} className="cursor-pointer text-xs font-medium">
                    {p.nameTr}
                  </Label>
                </label>
              );
            })}
          </div>
        )}

        {/* Preview of selected slugs */}
        {selected.length > 0 && (
          <div className="rounded-md border bg-muted/30 p-3">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              {t('admin.siteSettings.halTicker.previewLabel')}
            </p>
            <p className="font-mono text-xs break-all">{selected.join(', ')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
