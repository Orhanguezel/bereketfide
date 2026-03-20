'use client';

// =============================================================
// API & 3. Taraf Servisler Tab
// Google OAuth, Cloudinary, reCAPTCHA, AI Modelleri, Analytics
// =============================================================

import * as React from 'react';
import { toast } from 'sonner';
import { RefreshCcw, Save } from 'lucide-react';
import { useAdminTranslations } from '@/i18n';
import { usePreferencesStore } from '@/stores/preferences/preferences-provider';

import {
  useListSiteSettingsAdminQuery,
  useUpdateSiteSettingAdminMutation,
} from '@/integrations/hooks';

import type { SettingValue } from '@/integrations/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/* ── config ── */

const ALL_KEYS = [
  'google_client_id', 'google_client_secret',
  'cloudinary_cloud_name', 'cloudinary_api_key', 'cloudinary_api_secret', 'cloudinary_folder', 'cloudinary_unsigned_preset',
  'gtm_container_id', 'ga4_measurement_id',
  'ai_provider_order',
  'groq_api_key', 'groq_model',
  'openai_api_key', 'openai_model',
  'anthropic_api_key', 'anthropic_model',
  'xai_api_key', 'xai_model',
] as const;

type FormKey = (typeof ALL_KEYS)[number];
type FormData = Record<FormKey, string>;

const EMPTY: FormData = Object.fromEntries(ALL_KEYS.map((k) => [k, ''])) as FormData;

function valStr(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v);
}

/* ── sections ── */

type FieldDef = { key: FormKey; labelKey: string; type?: 'password' | 'text'; placeholder?: string };

type SectionDef = { titleKey: string; fields: FieldDef[]; testEndpoint?: string };

const SECTIONS: SectionDef[] = [
  {
    titleKey: 'googleOAuth',
    testEndpoint: '/api/admin/site_settings/test/google',
    fields: [
      { key: 'google_client_id', labelKey: 'clientId', placeholder: '...apps.googleusercontent.com' },
      { key: 'google_client_secret', labelKey: 'clientSecret', type: 'password' },
    ],
  },
  {
    titleKey: 'cloudinary',
    testEndpoint: '/api/admin/site_settings/test/cloudinary',
    fields: [
      { key: 'cloudinary_cloud_name', labelKey: 'cloudName' },
      { key: 'cloudinary_api_key', labelKey: 'apiKey' },
      { key: 'cloudinary_api_secret', labelKey: 'apiSecret', type: 'password' },
      { key: 'cloudinary_folder', labelKey: 'folder', placeholder: 'uploads/bereketfide' },
      { key: 'cloudinary_unsigned_preset', labelKey: 'unsignedPreset' },
    ],
  },
  {
    titleKey: 'analytics',
    fields: [
      { key: 'gtm_container_id', labelKey: 'gtmContainerId', placeholder: 'GTM-XXXXXXX' },
      { key: 'ga4_measurement_id', labelKey: 'ga4MeasurementId', placeholder: 'G-XXXXXXXXXX' },
    ],
  },
  {
    titleKey: 'groq',
    testEndpoint: '/api/admin/site_settings/test/groq',
    fields: [
      { key: 'groq_api_key', labelKey: 'apiKey', type: 'password' },
      { key: 'groq_model', labelKey: 'model', placeholder: 'llama-3.3-70b-versatile' },
    ],
  },
  {
    titleKey: 'openai',
    testEndpoint: '/api/admin/site_settings/test/openai',
    fields: [
      { key: 'openai_api_key', labelKey: 'apiKey', type: 'password' },
      { key: 'openai_model', labelKey: 'model', placeholder: 'gpt-4o-mini' },
    ],
  },
  {
    titleKey: 'anthropic',
    testEndpoint: '/api/admin/site_settings/test/anthropic',
    fields: [
      { key: 'anthropic_api_key', labelKey: 'apiKey', type: 'password' },
      { key: 'anthropic_model', labelKey: 'model', placeholder: 'claude-3-5-haiku-latest' },
    ],
  },
  {
    titleKey: 'grok',
    testEndpoint: '/api/admin/site_settings/test/grok',
    fields: [
      { key: 'xai_api_key', labelKey: 'apiKey', type: 'password' },
      { key: 'xai_model', labelKey: 'model', placeholder: 'grok-2-latest' },
    ],
  },
];

/* ── component ── */

export type ApiSettingsTabProps = { locale: string };

export const ApiSettingsTab: React.FC<ApiSettingsTabProps> = () => {
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);

  const { data: settings, isLoading, isFetching, refetch } = useListSiteSettingsAdminQuery({
    keys: ALL_KEYS as unknown as string[],
    locale: '*',
  } as any);

  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();
  const [form, setForm] = React.useState<FormData>(EMPTY);

  React.useEffect(() => {
    if (!settings) return;
    const map = new Map<string, any>();
    for (const s of settings as any[]) map.set(s.key, s);
    const next = { ...EMPTY };
    for (const k of ALL_KEYS) next[k] = valStr(map.get(k)?.value);
    setForm(next);
  }, [settings]);

  const busy = isLoading || isFetching || isSaving;

  const handleSave = async () => {
    try {
      for (const k of ALL_KEYS) {
        await updateSetting({ key: k, value: form[k].trim() as SettingValue, locale: '*' }).unwrap();
      }
      toast.success(t('admin.siteSettings.api.inline.saved'));
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || t('admin.siteSettings.api.inline.saveError'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">{t('admin.siteSettings.api.inline.title')}</CardTitle>
          <div className="flex items-center gap-2">
            {busy && <Badge variant="outline">{t('admin.siteSettings.api.inline.loading')}</Badge>}
            <Button type="button" size="sm" onClick={handleSave} disabled={busy}>
              <Save className="mr-2 h-3.5 w-3.5" />
              {t('admin.siteSettings.api.inline.save')}
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => refetch()} disabled={busy}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Provider sırası — AI bölümünden önce */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">{t('admin.siteSettings.api.inline.providerOrderLabel')}</Label>
          <Input
            value={form.ai_provider_order}
            onChange={(e) => setForm((p) => ({ ...p, ai_provider_order: e.target.value }))}
            disabled={busy}
            className="h-8"
            placeholder="groq,openai,anthropic,grok"
          />
          <p className="text-[10px] text-muted-foreground">
            {t('admin.siteSettings.api.inline.providerOrderHelp')}
          </p>
        </div>

        {SECTIONS.map((section) => {
          const sectionTitle = t(`admin.siteSettings.api.inline.sections.${section.titleKey}`);
          return (
            <div key={section.titleKey} className="space-y-3">
              <div className="flex items-center justify-between border-b pb-1">
                <h3 className="text-sm font-medium">{sectionTitle}</h3>
                {section.testEndpoint && (
                  <TestButton endpoint={section.testEndpoint} label={sectionTitle} t={t} />
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {section.fields.map((f) => (
                  <div key={f.key} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{t(`admin.siteSettings.api.inline.fields.${f.labelKey}`)}</Label>
                    <Input
                      type={f.type || 'text'}
                      value={form[f.key]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      disabled={busy}
                      className="h-8"
                      placeholder={f.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

/* ── Test Button ── */

function TestButton({ endpoint, label, t }: { endpoint: string; label: string; t: (key: string, params?: any, fallback?: string) => string }) {
  const [testing, setTesting] = React.useState(false);
  const [result, setResult] = React.useState<{ ok: boolean; message: string } | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setResult(null);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: '{}',
      });
      const data = await res.json();
      const ok = data.ok === true;
      setResult({ ok, message: data.message || (ok ? t('admin.siteSettings.api.inline.testSuccess') : t('admin.siteSettings.api.inline.testError')) });
      if (ok) toast.success(`${label}: ${data.message}`);
      else toast.error(`${label}: ${data.message}`);
    } catch (err: any) {
      setResult({ ok: false, message: err.message || t('admin.siteSettings.api.inline.connectionError') });
      toast.error(`${label}: ${t('admin.siteSettings.api.inline.connectionError')}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {result && (
        <span className={`text-[10px] ${result.ok ? 'text-green-600' : 'text-destructive'}`}>
          {result.ok ? '✓' : '✗'} {result.message.slice(0, 50)}
        </span>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-6 px-2 text-[10px]"
        onClick={handleTest}
        disabled={testing}
      >
        {testing ? t('admin.siteSettings.api.inline.testBusy') : t('admin.siteSettings.api.inline.test')}
      </Button>
    </div>
  );
}
