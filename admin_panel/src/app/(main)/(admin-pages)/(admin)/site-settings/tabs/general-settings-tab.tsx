'use client';

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { RefreshCcw, Plus, ChevronRight } from 'lucide-react';
import { useAdminTranslations } from '@/i18n';
import { usePreferencesStore } from '@/stores/preferences/preferences-provider';

import {
  useListSiteSettingsAdminQuery,
  useUpdateSiteSettingAdminMutation,
} from '@/integrations/hooks';

import type { SiteSetting, SettingValue } from '@/integrations/shared';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/* ----------------------------- config ----------------------------- */

const GENERAL_KEYS = [
  'app_locales',
  'hero',
  'hero_video',
  'hero_config',
  'home_backgrounds',
  'seo_pages',
  'contact_info',
  'socials',
  'businessHours',
  'company_profile',
  'ui_header',
] as const;

type GeneralKey = (typeof GENERAL_KEYS)[number];


const DEFAULTS_BY_KEY: Record<GeneralKey, SettingValue> = {
  app_locales: [
    { code: 'tr', label: 'Türkçe', is_default: true, is_active: true },
    { code: 'en', label: 'English', is_default: false, is_active: true },
  ],
  hero: { video_desktop: '', video_mobile: '', headline_tr: '', headline_en: '' },
  hero_video: { desktop: '', mobile: '' },
  hero_config: { headline: '', sub_headline: '', button_text: '', button_link: '' },
  seo_pages: {},
  contact_info: { phone: '', email: '', address: '', company_name: '' },
  socials: { instagram: '', facebook: '', linkedin: '', youtube: '', x: '' },
  businessHours: [
    { day: 'mon', open: '09:00', close: '18:00', closed: false },
    { day: 'tue', open: '09:00', close: '18:00', closed: false },
    { day: 'wed', open: '09:00', close: '18:00', closed: false },
    { day: 'thu', open: '09:00', close: '18:00', closed: false },
    { day: 'fri', open: '09:00', close: '18:00', closed: false },
    { day: 'sat', open: '10:00', close: '14:00', closed: false },
    { day: 'sun', open: '00:00', close: '00:00', closed: true },
  ],
  company_profile: { company_name: '', slogan: '', about: '' },
  ui_header: {
    nav_home: 'Home',
    nav_products: 'Products',
    nav_services: 'Services',
    nav_contact: 'Contact',
    cta_label: 'Get Offer',
  },
  home_backgrounds: [],
};

function isGeneralKey(k: string): k is GeneralKey {
  return (GENERAL_KEYS as readonly string[]).includes(k);
}

/** Summarise a JSON value as a short human-readable string */
function summariseValue(v: SettingValue | undefined, recordCountLabel: string): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) {
    return recordCountLabel.replace('{count}', String(v.length));
  }
  if (typeof v === 'object') {
    const entries = Object.entries(v as Record<string, unknown>);
    const filled = entries.filter(([, val]) => val !== '' && val !== null && val !== undefined);
    if (filled.length === 0) return '';
    const strs = filled.slice(0, 2).map(([key, val]) => {
      if (val && typeof val === 'object') return key;
      return String(val);
    });
    return strs.join(', ') + (filled.length > 2 ? ` +${filled.length - 2}` : '');
  }
  return '';
}

type RowData = {
  key: GeneralKey;
  hasValue: boolean;
  editLocale: string;
  value: SettingValue | undefined;
};

function buildRows(rows: any[], locale: string): RowData[] {
  const only = rows.filter((r: any) => r && isGeneralKey(r.key));
  const byKey = new Map<GeneralKey, { global?: SiteSetting; local?: SiteSetting }>();

  for (const r of only) {
    const key = r.key as GeneralKey;
    const entry = byKey.get(key) || {};
    if (r.locale === '*') entry.global = r;
    if (r.locale === locale) entry.local = r;
    byKey.set(key, entry);
  }

  return GENERAL_KEYS.map((k) => {
    const entry = byKey.get(k) || {};
    const hasLocal = Boolean(entry.local);
    const hasGlobal = Boolean(entry.global);
    const value = hasLocal ? entry.local?.value : hasGlobal ? entry.global?.value : undefined;
    const editLocale = hasLocal ? locale : '*';

    return { key: k, hasValue: hasLocal || hasGlobal, editLocale, value };
  });
}

function editHref(key: string, locale: string) {
  return `/site-settings/${encodeURIComponent(key)}?locale=${encodeURIComponent(locale)}`;
}

function errMsg(err: any, fallback: string): string {
  return err?.data?.error?.message || err?.data?.message || err?.message || fallback;
}

/* ----------------------------- component ----------------------------- */

export type GeneralSettingsTabProps = {
  locale: string;
  settingPrefix?: string;
};

export const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({ locale, settingPrefix }) => {
  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();

  const adminLocale = usePreferencesStore((s) => s.adminLocale) || 'tr';
  const t = useAdminTranslations(adminLocale || undefined);

  const withPrefix = React.useCallback((key: string) => `${settingPrefix || ''}${key}`, [settingPrefix]);
  const stripPrefix = React.useCallback(
    (key: string) => (settingPrefix && key.startsWith(settingPrefix) ? key.slice(settingPrefix.length) : key),
    [settingPrefix],
  );

  const listArgsGlobal = React.useMemo(
    () => ({ locale: '*', keys: GENERAL_KEYS.map((key) => withPrefix(key)) as unknown as string[] }),
    [withPrefix],
  );
  const listArgsLocale = React.useMemo(
    () => ({ locale, keys: GENERAL_KEYS.map((key) => withPrefix(key)) as unknown as string[] }),
    [locale, withPrefix],
  );

  const qGlobal = useListSiteSettingsAdminQuery(listArgsGlobal, { skip: !locale });
  const qLocale = useListSiteSettingsAdminQuery(listArgsLocale, { skip: !locale });

  const rowsMerged = React.useMemo(() => {
    const g = Array.isArray(qGlobal.data) ? qGlobal.data : [];
    const l = Array.isArray(qLocale.data) ? qLocale.data : [];
    return [...g, ...l].map((row) => ({ ...row, key: stripPrefix(String(row.key || '')) }));
  }, [qGlobal.data, qLocale.data, stripPrefix]);

  const rows = React.useMemo(
    () => buildRows(rowsMerged as any[], locale),
    [rowsMerged, locale],
  );

  const busy = qGlobal.isLoading || qLocale.isLoading || qGlobal.isFetching || qLocale.isFetching || isSaving;

  const refetchAll = async () => {
    await Promise.all([qGlobal.refetch(), qLocale.refetch()]);
  };

  const hasAnyMissing = rows.some((r) => !r.hasValue);

  const createMissing = async () => {
    try {
      for (const r of rows) {
        if (r.hasValue) continue;
        await updateSetting({ key: withPrefix(r.key), locale: '*', value: DEFAULTS_BY_KEY[r.key] as any }).unwrap();
      }
      toast.success(t('admin.siteSettings.general.globalBootstrapSuccess'));
      await refetchAll();
    } catch (err: any) {
      toast.error(errMsg(err, t('admin.siteSettings.messages.error')));
    }
  };

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t('admin.siteSettings.general.description', { locale })}
        </p>
        <Button type="button" variant="ghost" size="icon" onClick={refetchAll} disabled={busy} title={t('admin.siteSettings.filters.refreshButton')}>
          <RefreshCcw className="size-4" />
        </Button>
      </div>

      {/* Settings list */}
      <div className="space-y-2">
        {rows.map((r) => {
          const summary = summariseValue(r.value, t('admin.siteSettings.general.recordCount'));

          return (
            <Link
              key={r.key}
              href={r.hasValue ? editHref(withPrefix(r.key), r.editLocale) : '#'}
              prefetch={false}
              className={`group flex items-center gap-3 rounded-lg border p-3 transition-colors sm:p-4 ${
                r.hasValue ? 'hover:bg-muted/50 cursor-pointer' : 'opacity-60'
              }`}
              onClick={r.hasValue ? undefined : (e) => e.preventDefault()}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{t(`admin.siteSettings.general.keyLabels.${r.key}`)}</span>
                  {!r.hasValue ? (
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      {t('admin.siteSettings.general.sourceNone')}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{t(`admin.siteSettings.general.keyDescriptions.${r.key}`)}</p>
                {summary ? (
                  <p className="mt-1 truncate text-xs text-foreground/70">{summary}</p>
                ) : null}
              </div>

              {r.hasValue ? (
                <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              ) : null}
            </Link>
          );
        })}
      </div>

      {/* Create missing button */}
      {hasAnyMissing ? (
        <Button type="button" variant="outline" size="sm" onClick={createMissing} disabled={busy} className="w-full sm:w-auto">
          <Plus className="mr-1.5 size-3.5" />
          {t('admin.siteSettings.general.globalBootstrap')}
        </Button>
      ) : null}
    </div>
  );
};

GeneralSettingsTab.displayName = 'GeneralSettingsTab';
