'use client';

// =============================================================
// API & 3. Taraf Servisler Tab
// Google OAuth, Cloudinary, reCAPTCHA, AI Modelleri, Analytics
// =============================================================

import * as React from 'react';
import { toast } from 'sonner';
import { RefreshCcw, Save } from 'lucide-react';

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

type FieldDef = { key: FormKey; label: string; type?: 'password' | 'text'; placeholder?: string };

const SECTIONS: { title: string; fields: FieldDef[]; testEndpoint?: string }[] = [
  {
    title: 'Google OAuth',
    testEndpoint: '/api/admin/site_settings/test/google',
    fields: [
      { key: 'google_client_id', label: 'Client ID', placeholder: '...apps.googleusercontent.com' },
      { key: 'google_client_secret', label: 'Client Secret', type: 'password' },
    ],
  },
  {
    title: 'Cloudinary',
    testEndpoint: '/api/admin/site_settings/test/cloudinary',
    fields: [
      { key: 'cloudinary_cloud_name', label: 'Cloud Name' },
      { key: 'cloudinary_api_key', label: 'API Key' },
      { key: 'cloudinary_api_secret', label: 'API Secret', type: 'password' },
      { key: 'cloudinary_folder', label: 'Klasör', placeholder: 'uploads/bereketfide' },
      { key: 'cloudinary_unsigned_preset', label: 'Unsigned Preset' },
    ],
  },
  {
    title: 'Analytics',
    fields: [
      { key: 'gtm_container_id', label: 'GTM Container ID', placeholder: 'GTM-XXXXXXX' },
      { key: 'ga4_measurement_id', label: 'GA4 Measurement ID', placeholder: 'G-XXXXXXXXXX' },
    ],
  },
  {
    title: 'Groq (Ücretsiz)',
    testEndpoint: '/api/admin/site_settings/test/groq',
    fields: [
      { key: 'groq_api_key', label: 'API Key', type: 'password' },
      { key: 'groq_model', label: 'Model', placeholder: 'llama-3.3-70b-versatile' },
    ],
  },
  {
    title: 'OpenAI',
    testEndpoint: '/api/admin/site_settings/test/openai',
    fields: [
      { key: 'openai_api_key', label: 'API Key', type: 'password' },
      { key: 'openai_model', label: 'Model', placeholder: 'gpt-4o-mini' },
    ],
  },
  {
    title: 'Anthropic (Claude)',
    testEndpoint: '/api/admin/site_settings/test/anthropic',
    fields: [
      { key: 'anthropic_api_key', label: 'API Key', type: 'password' },
      { key: 'anthropic_model', label: 'Model', placeholder: 'claude-3-5-haiku-latest' },
    ],
  },
  {
    title: 'Grok / xAI',
    testEndpoint: '/api/admin/site_settings/test/grok',
    fields: [
      { key: 'xai_api_key', label: 'API Key', type: 'password' },
      { key: 'xai_model', label: 'Model', placeholder: 'grok-2-latest' },
    ],
  },
];

/* ── component ── */

export type ApiSettingsTabProps = { locale: string };

export const ApiSettingsTab: React.FC<ApiSettingsTabProps> = () => {
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
      toast.success('API ayarları kaydedildi');
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || 'Kaydetme hatası');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">API & 3. Taraf Servisler</CardTitle>
          <div className="flex items-center gap-2">
            {busy && <Badge variant="outline">Yükleniyor</Badge>}
            <Button type="button" size="sm" onClick={handleSave} disabled={busy}>
              <Save className="mr-2 h-3.5 w-3.5" />
              Kaydet
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
          <Label className="text-xs text-muted-foreground">AI Provider Öncelik Sırası</Label>
          <Input
            value={form.ai_provider_order}
            onChange={(e) => setForm((p) => ({ ...p, ai_provider_order: e.target.value }))}
            disabled={busy}
            className="h-8"
            placeholder="groq,openai,anthropic,grok"
          />
          <p className="text-[10px] text-muted-foreground">
            Virgülle ayırın. İlk yanıt veren kullanılır.
          </p>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.title} className="space-y-3">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="text-sm font-medium">{section.title}</h3>
              {section.testEndpoint && (
                <TestButton endpoint={section.testEndpoint} label={section.title} />
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {section.fields.map((f) => (
                <div key={f.key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{f.label}</Label>
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
        ))}
      </CardContent>
    </Card>
  );
};

/* ── Test Button ── */

function TestButton({ endpoint, label }: { endpoint: string; label: string }) {
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
      setResult({ ok, message: data.message || (ok ? 'Başarılı' : 'Hata') });
      if (ok) toast.success(`${label}: ${data.message}`);
      else toast.error(`${label}: ${data.message}`);
    } catch (err: any) {
      setResult({ ok: false, message: err.message || 'Bağlantı hatası' });
      toast.error(`${label}: Bağlantı hatası`);
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
        {testing ? 'Test...' : 'Test'}
      </Button>
    </div>
  );
}
