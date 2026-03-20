'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { RefreshCcw } from 'lucide-react';

import { normLocaleTag } from '@/i18n';
import {
  useListSiteSettingsAdminQuery,
  useUpdateSiteSettingAdminMutation,
} from '@/integrations/hooks';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

type LocaleRow = { code: string; label: string; is_active: boolean };

function normalizeRows(raw: unknown): LocaleRow[] {
  const arr = Array.isArray(raw) ? raw : [];
  const seen = new Set<string>();
  const out: LocaleRow[] = [];

  for (const item of arr as any[]) {
    const code = normLocaleTag(item?.code ?? item);
    if (!code || seen.has(code)) continue;
    seen.add(code);
    out.push({
      code,
      label: String(item?.label || '').trim() || code.toUpperCase(),
      is_active: item?.is_active === undefined ? true : Boolean(item?.is_active),
    });
  }
  return out.sort((a, b) => {
    if (a.is_active !== b.is_active) return a.is_active ? -1 : 1;
    return a.code.localeCompare(b.code);
  });
}

export function LocalesSettingsTab({ settingPrefix }: { settingPrefix?: string }) {
  const appLocalesKey = `${settingPrefix || ''}app_locales`;

  const localesQ = useListSiteSettingsAdminQuery({
    locale: '*',
    keys: [appLocalesKey],
    limit: 20,
    offset: 0,
    sort: 'key',
    order: 'asc',
  });

  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();
  const [rows, setRows] = React.useState<LocaleRow[]>([]);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (touched) return;
    const row = (localesQ.data ?? []).find((r) => r.key === appLocalesKey);
    setRows(normalizeRows(row?.value));
  }, [localesQ.data, appLocalesKey, touched]);

  const busy = isSaving || localesQ.isFetching || localesQ.isLoading;

  const persist = async (nextRows: LocaleRow[]) => {
    const payload = nextRows.map((r, i) => ({
      code: r.code,
      label: r.label,
      is_default: i === 0 && r.is_active,
      is_active: r.is_active,
    }));
    try {
      await updateSetting({ key: appLocalesKey, locale: '*', value: payload }).unwrap();
      toast.success('Dil ayarları kaydedildi');
    } catch (err: any) {
      toast.error(err?.data?.error?.message || 'Kaydetme hatası');
      throw err;
    }
  };

  const onToggleActive = async (code: string, val: boolean) => {
    const prev = rows;
    setTouched(true);
    const next = rows.map((r) => (r.code === code ? { ...r, is_active: val } : r));
    setRows(next);
    try { await persist(next); } catch { setRows(prev); setTouched(false); }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Diller</CardTitle>
          <div className="flex items-center gap-2">
            {busy && <Badge variant="outline">Yükleniyor</Badge>}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={busy}
              onClick={() => localesQ.refetch()}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz dil tanımı yok.</p>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => (
              <div
                key={r.code}
                className="flex items-center justify-between rounded-md border px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center font-mono text-sm font-medium uppercase">{r.code}</span>
                  <span className="text-sm">{r.label}</span>
                </div>
                <Switch
                  checked={r.is_active}
                  onCheckedChange={(v) => onToggleActive(r.code, Boolean(v))}
                  disabled={busy}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
