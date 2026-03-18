'use client';

// =============================================================
// FILE: src/app/(main)/admin/(admin)/offer/_components/admin-offer-detail-client.tsx
// Admin Offer — Create / Edit with calculations, PDF, email
// =============================================================

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  FileText,
  Mail,
  ExternalLink,
  Code,
  FormInput,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AdminJsonEditor } from '@/app/(main)/admin/_components/common/AdminJsonEditor';
import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';

import type { OfferView, OfferStatus } from '@/integrations/shared';
import { isUuidLike } from '@/integrations/shared';
import {
  useGetOfferAdminQuery,
  useCreateOfferAdminMutation,
  useUpdateOfferAdminMutation,
  useGenerateOfferPdfAdminMutation,
  useSendOfferEmailAdminMutation,
} from '@/integrations/hooks';

import { OfferPdfPreview } from './offer-pdf-preview';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type FormState = {
  id?: string;
  customer_name: string;
  company_name: string;
  email: string;
  phone: string;
  locale: string;
  country_code: string;
  subject: string;
  message: string;
  product_id: string;
  service_id: string;
  status: OfferStatus;
  currency: string;
  net_total: string;
  vat_rate: string;
  shipping_total: string;
  vat_total: string;
  gross_total: string;
  offer_no: string;
  valid_until: string;
  admin_notes: string;
  pdf_url: string;
  pdf_asset_id: string;
  email_sent_at: string;
  consent_marketing: boolean;
  consent_terms: boolean;
  form_data: Record<string, any>;
};

const EMPTY_FORM: FormState = {
  customer_name: '',
  company_name: '',
  email: '',
  phone: '',
  locale: '',
  country_code: '',
  subject: '',
  message: '',
  product_id: '',
  service_id: '',
  status: 'new',
  currency: 'TRY',
  net_total: '',
  vat_rate: '',
  shipping_total: '',
  vat_total: '',
  gross_total: '',
  offer_no: '',
  valid_until: '',
  admin_notes: '',
  pdf_url: '',
  pdf_asset_id: '',
  email_sent_at: '',
  consent_marketing: false,
  consent_terms: true,
  form_data: {},
};

function safeStr(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v);
}

function safeBool(v: unknown): boolean {
  if (v === true || v === 1 || v === '1' || v === 'true') return true;
  return false;
}

function safeJson(v: unknown): Record<string, any> {
  if (!v) return {};
  if (typeof v === 'object') return v as Record<string, any>;
  if (typeof v === 'string') {
    try {
      const p = JSON.parse(v);
      return p && typeof p === 'object' ? p : {};
    } catch {
      return {};
    }
  }
  return {};
}

function parseDecimal(s: string): number | null {
  if (!s) return null;
  const n = Number(s.replace(',', '.').trim());
  return Number.isNaN(n) ? null : n;
}

function fmt2(n: number | null): string {
  return n == null ? '' : n.toFixed(2);
}

function mapDtoToForm(v: OfferView): FormState {
  const a = v as any;
  const fd1 = safeJson(a.form_data_parsed);
  const fd2 = safeJson(a.form_data);
  return {
    id: v.id,
    customer_name: v.customer_name ?? '',
    company_name: safeStr(v.company_name),
    email: v.email ?? '',
    phone: safeStr(v.phone),
    locale: safeStr(v.locale),
    country_code: safeStr(v.country_code),
    subject: safeStr(v.subject),
    message: safeStr(v.message),
    product_id: safeStr(a.product_id),
    service_id: safeStr(a.service_id),
    status: v.status ?? 'new',
    currency: safeStr(v.currency) || 'TRY',
    net_total: safeStr(v.net_total),
    vat_rate: safeStr(v.vat_rate),
    shipping_total: safeStr(v.shipping_total),
    vat_total: safeStr(v.vat_total),
    gross_total: safeStr(v.gross_total),
    offer_no: safeStr(v.offer_no),
    valid_until: v.valid_until ? String(v.valid_until).substring(0, 10) : '',
    admin_notes: safeStr(v.admin_notes),
    pdf_url: safeStr(a.pdf_url),
    pdf_asset_id: safeStr(a.pdf_asset_id),
    email_sent_at: safeStr(v.email_sent_at),
    consent_marketing: safeBool(v.consent_marketing),
    consent_terms: safeBool(v.consent_terms),
    form_data: Object.keys(fd1).length ? fd1 : fd2,
  };
}

function resolvePdfUrl(pdfUrl: string | null): string | null {
  if (!pdfUrl) return null;
  if (/^https?:\/\//i.test(pdfUrl)) return pdfUrl;
  const s = pdfUrl.trim();
  if (s.startsWith('/uploads/') || s === '/uploads') return s;
  const idx = s.indexOf('/uploads/');
  if (idx >= 0) return s.substring(idx);
  return `/uploads/${s}`.replace(/^\/uploads\/uploads(\/|$)/, '/uploads$1');
}

/* ------------------------------------------------------------------ */
/* form_data display defs                                              */
/* ------------------------------------------------------------------ */

type FieldDef = { key: string; labelKey: string };

const FIELD_DEFS: FieldDef[] = [
  { key: 'project_type', labelKey: 'Proje Tipi' },
  { key: 'estimated_area', labelKey: 'Tahmini Alan' },
  { key: 'location', labelKey: 'Konum' },
  { key: 'preferred_deadline', labelKey: 'Tercih Edilen Tarih' },
  { key: 'notes', labelKey: 'Notlar' },
  { key: 'contact_role', labelKey: 'İletişim Rolü' },
  { key: 'referral_source', labelKey: 'Referans Kaynağı' },
];

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.length ? v.map(String).join(', ') : '';
  try {
    return JSON.stringify(v);
  } catch {
    return '[object]';
  }
}

/* ================================================================== */
/* Component                                                           */
/* ================================================================== */

export default function AdminOfferDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const t = useAdminT('admin.offer');

  const isCreate = id === 'new';
  const canLoad = !isCreate && isUuidLike(id);

  const offerQ = useGetOfferAdminQuery(
    { id },
    { skip: !canLoad, refetchOnMountOrArgChange: true },
  );

  const [createOffer, createState] = useCreateOfferAdminMutation();
  const [updateOffer, updateState] = useUpdateOfferAdminMutation();
  const [generatePdf, pdfState] = useGenerateOfferPdfAdminMutation();
  const [sendEmail, emailState] = useSendOfferEmailAdminMutation();

  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [editTab, setEditTab] = React.useState<string>('form');
  const [pdfCacheBust, setPdfCacheBust] = React.useState(() => Date.now());

  const saving = createState.isLoading || updateState.isLoading;
  const loading = offerQ.isFetching || saving;
  const busy = loading || pdfState.isLoading || emailState.isLoading;

  // Populate form
  React.useEffect(() => {
    if (offerQ.data) {
      setForm(mapDtoToForm(offerQ.data as OfferView));
    } else if (isCreate) {
      setForm({ ...EMPTY_FORM });
    }
  }, [offerQ.data, isCreate]);

  // Computed totals (VAT + Gross)
  const computed = React.useMemo(() => {
    const net = parseDecimal(form.net_total);
    const vatRate = parseDecimal(form.vat_rate);

    let vatTotal: number | null = null;
    let grossTotal: number | null = null;

    if (net != null) {
      if (vatRate != null) vatTotal = Number((net * (vatRate / 100)).toFixed(2));
      grossTotal = Number((net + (vatTotal ?? 0)).toFixed(2));
    }

    return { vatTotal, grossTotal };
  }, [form.net_total, form.vat_rate]);

  // Sync computed totals
  React.useEffect(() => {
    setForm((prev) => {
      const nextVat = fmt2(computed.vatTotal);
      const nextGross = fmt2(computed.grossTotal);
      if (prev.vat_total === nextVat && prev.gross_total === nextGross) return prev;
      return { ...prev, vat_total: nextVat, gross_total: nextGross };
    });
  }, [computed.vatTotal, computed.grossTotal]);

  // form_data display
  const { pairs, extras } = React.useMemo(() => {
    const fd = form.form_data ?? {};
    const ps = FIELD_DEFS.map((f) => ({
      key: f.key,
      label: f.labelKey,
      value: formatValue(fd[f.key]),
    })).filter((p) => p.value);

    const known = new Set(FIELD_DEFS.map((x) => x.key));
    const ex = Object.keys(fd)
      .filter((k) => !known.has(k))
      .map((k) => ({ key: k, label: k, value: formatValue(fd[k]) }))
      .filter((p) => p.value);

    return { pairs: ps, extras: ex };
  }, [form.form_data, t]);

  const pdfHref = React.useMemo(() => resolvePdfUrl(form.pdf_url || null), [form.pdf_url]);

  /* ---- Handlers ---- */

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSave() {
    if (!form.customer_name.trim() || !form.email.trim()) {
      toast.error(t('messages.requiredError'));
      return;
    }

    const net = parseDecimal(form.net_total);
    const vatRate = parseDecimal(form.vat_rate);
    const shipping = parseDecimal(form.shipping_total);

    const payload = {
      locale: form.locale || undefined,
      country_code: form.country_code || undefined,
      customer_name: form.customer_name.trim(),
      company_name: form.company_name.trim() || null,
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      subject: form.subject.trim() || null,
      message: form.message.trim() || null,
      product_id: form.product_id.trim() || null,
      service_id: form.service_id.trim() || null,
      form_data: form.form_data ?? {},
      consent_marketing: form.consent_marketing,
      consent_terms: form.consent_terms,
      status: form.status,
      currency: form.currency.trim() || undefined,
      net_total: net ?? undefined,
      vat_rate: vatRate ?? undefined,
      shipping_total: shipping ?? undefined,
      vat_total: computed.vatTotal ?? undefined,
      gross_total: computed.grossTotal ?? undefined,
      valid_until: form.valid_until || null,
      offer_no: form.offer_no.trim() || null,
      admin_notes: form.admin_notes.trim() || null,
      pdf_url: form.pdf_url.trim() || null,
      pdf_asset_id: form.pdf_asset_id.trim() || null,
      email_sent_at: null,
    };

    try {
      if (isCreate) {
        const res = await createOffer(payload).unwrap();
        toast.success(t('messages.created'));
        if (res?.id) router.replace(`/admin/offer/${encodeURIComponent(res.id)}`);
      } else if (form.id) {
        const res = await updateOffer({ id: form.id, body: payload }).unwrap();
        setForm(mapDtoToForm(res as OfferView));
        toast.success(t('messages.saved'));
      }
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || t('messages.saveError'));
    }
  }

  async function onGeneratePdf() {
    if (!form.id) return;
    try {
      const res = await generatePdf({ id: form.id, force: true }).unwrap();
      setForm(mapDtoToForm(res as OfferView));
      setPdfCacheBust(Date.now());
      toast.success(form.pdf_url ? t('messages.pdfRegenerated') : t('messages.pdfGenerated'));
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || t('messages.pdfError'));
    }
  }

  async function onSendEmail() {
    if (!form.id) return;
    if (!form.pdf_url) {
      toast.error(t('messages.pdfRequired'));
      return;
    }
    try {
      const res = await sendEmail({ id: form.id }).unwrap();
      setForm(mapDtoToForm(res as OfferView));
      toast.success(t('messages.emailSent'));
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || t('messages.emailError'));
    }
  }

  /* ---- Not found ---- */
  if (!isCreate && !offerQ.isFetching && offerQ.error && !offerQ.data) {
    return (
      <div className="space-y-4">
        <h1 className="text-lg font-semibold">{t('detail.notFoundTitle')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('detail.notFoundDescription')} <code className="ml-1">{id}</code>
        </p>
        <Button variant="outline" onClick={() => router.push('/admin/offer')}>
          <ArrowLeft className="mr-2 size-4" />
          {t('actions.backToList')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">
            {isCreate ? t('detail.createTitle') : t('detail.editTitle')}
          </h1>
          <p className="text-sm text-muted-foreground">{t('detail.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/offer')}>
            <ArrowLeft className="mr-2 size-4" />
            {t('actions.backToList')}
          </Button>
          <Button size="sm" onClick={onSave} disabled={busy}>
            <Save className="mr-2 size-4" />
            {saving ? t('actions.saving') : t('actions.save')}
          </Button>
        </div>
      </div>

      {/* FORM DATA (edit only) */}
      {!isCreate && (pairs.length > 0 || extras.length > 0) && (
        <Card>
          <CardHeader className="gap-2">
            <CardTitle className="text-base">
              {t('detail.formDataTitle')}{' '}
              <Badge variant="outline" className="ml-2">
                {Object.keys(form.form_data ?? {}).length} {t('detail.formDataFields')}
              </Badge>
            </CardTitle>
            <CardDescription>{t('detail.formDataDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {pairs.map((p) => (
                <div key={p.key}>
                  <div className="text-xs text-muted-foreground">{p.label}</div>
                  <div className="text-sm font-medium">{p.value}</div>
                </div>
              ))}
            </div>
            {extras.length > 0 && (
              <>
                <hr className="my-3" />
                <div className="text-xs text-muted-foreground mb-2">{t('detail.extraFields')}</div>
                <div className="grid gap-3 md:grid-cols-2">
                  {extras.map((p) => (
                    <div key={p.key}>
                      <div className="text-xs text-muted-foreground">{p.label}</div>
                      <div className="font-mono text-xs">{p.value}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* PDF SECTION (edit only) */}
      {!isCreate && form.id && (
        <Card>
          <CardHeader className="gap-2">
            <CardTitle className="text-base">{t('detail.pdfTitle')}</CardTitle>
            <CardDescription>{t('detail.pdfDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <OfferPdfPreview
              pdfUrl={pdfHref}
              cacheBust={pdfCacheBust}
              emptyMessage={t('detail.pdfEmpty')}
              fallbackLabel={t('detail.pdfFallback')}
            />

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onGeneratePdf}
                disabled={pdfState.isLoading || saving}
              >
                <FileText className="mr-2 size-4" />
                {pdfState.isLoading
                  ? t('actions.generatingPdf')
                  : form.pdf_url
                    ? t('actions.regeneratePdf')
                    : t('actions.generatePdf')}
              </Button>

              <Button
                size="sm"
                onClick={onSendEmail}
                disabled={emailState.isLoading || saving || !form.pdf_url}
                title={!form.pdf_url ? 'Önce PDF oluşturun' : undefined}
              >
                <Mail className="mr-2 size-4" />
                {emailState.isLoading ? 'Gönderiliyor...' : 'PDF ile Gönder'}
              </Button>

              <DirectEmailButton offerId={form.id} email={form.email} disabled={saving} />

              {pdfHref && (
                <Button variant="secondary" size="sm" asChild>
                  <a href={pdfHref} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-2 size-4" />
                    {t('actions.openPdf')}
                  </a>
                </Button>
              )}
            </div>

            {form.email_sent_at && (
              <p className="text-xs text-muted-foreground">
                {t('detail.lastSent')}: <code>{form.email_sent_at}</code>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* TABS */}
      <Tabs value={editTab} onValueChange={setEditTab}>
        <TabsList>
          <TabsTrigger value="form">Teklif Bilgisi</TabsTrigger>
          <TabsTrigger value="pricing">Fiyatlandırma</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>

        {/* TAB: Teklif Bilgisi */}
        <TabsContent value="form" className="mt-3">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Durum</Label>
                  <Select value={form.status} onValueChange={(v) => setField('status', v as OfferStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Yeni</SelectItem>
                      <SelectItem value="in_review">İnceleniyor</SelectItem>
                      <SelectItem value="quoted">Fiyatlandırıldı</SelectItem>
                      <SelectItem value="sent">Gönderildi</SelectItem>
                      <SelectItem value="accepted">Kabul Edildi</SelectItem>
                      <SelectItem value="site_survey">Keşif</SelectItem>
                      <SelectItem value="contract_signed">Sözleşme İmzalandı</SelectItem>
                      <SelectItem value="construction_started">İnşaat Başladı</SelectItem>
                      <SelectItem value="construction_completed">Tamamlandı</SelectItem>
                      <SelectItem value="rejected">Reddedildi</SelectItem>
                      <SelectItem value="cancelled">İptal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Müşteri Adı *</Label>
                  <Input value={form.customer_name} onChange={(e) => setField('customer_name', e.target.value)} disabled={busy} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Firma</Label>
                  <Input value={form.company_name} onChange={(e) => setField('company_name', e.target.value)} disabled={busy} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">E-posta *</Label>
                  <Input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} disabled={busy} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Telefon</Label>
                  <Input value={form.phone} onChange={(e) => setField('phone', e.target.value)} disabled={busy} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Ülke</Label>
                  <Input value={form.country_code} onChange={(e) => setField('country_code', e.target.value)} disabled={busy} placeholder="Türkiye" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Dil</Label>
                  <Input value={form.locale} onChange={(e) => setField('locale', e.target.value)} disabled={busy} placeholder="tr" />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Konu</Label>
                  <Input value={form.subject} onChange={(e) => setField('subject', e.target.value)} disabled={busy} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Mesaj</Label>
                  <Textarea value={form.message} onChange={(e) => setField('message', e.target.value)} rows={3} disabled={busy} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Dahili Notlar</Label>
                  <Textarea value={form.admin_notes} onChange={(e) => setField('admin_notes', e.target.value)} rows={2} disabled={busy} placeholder="Sadece yöneticiler görür" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Fiyatlandırma */}
        <TabsContent value="pricing" className="mt-3">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Teklif No</Label>
                  <Input value={form.offer_no} onChange={(e) => setField('offer_no', e.target.value)} disabled={busy} placeholder="VIS-2026-0001" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Para Birimi</Label>
                  <Input value={form.currency} onChange={(e) => setField('currency', e.target.value || 'TRY')} disabled={busy} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Geçerlilik</Label>
                  <Input type="date" value={form.valid_until} onChange={(e) => setField('valid_until', e.target.value)} disabled={busy} />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Net Tutar</Label>
                  <Input inputMode="decimal" value={form.net_total} onChange={(e) => setField('net_total', e.target.value)} disabled={busy} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">KDV Oranı (%)</Label>
                  <Input inputMode="decimal" value={form.vat_rate} onChange={(e) => setField('vat_rate', e.target.value)} disabled={busy} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">KDV Tutarı</Label>
                  <Input value={form.vat_total} readOnly className="bg-muted" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Brüt Toplam</Label>
                  <Input value={form.gross_total} readOnly className="bg-muted font-semibold" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">PDF URL</Label>
                  <Input value={form.pdf_url} onChange={(e) => setField('pdf_url', e.target.value)} disabled={busy} />
                </div>
                <div className="flex items-center gap-4 pt-5">
                  <div className="flex items-center gap-2">
                    <Switch checked={form.consent_marketing} onCheckedChange={(v) => setField('consent_marketing', v)} />
                    <Label className="text-xs">Pazarlama</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={form.consent_terms} onCheckedChange={(v) => setField('consent_terms', v)} />
                    <Label className="text-xs">Koşullar</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json" className="mt-4">
          <Card>
            <CardHeader className="gap-2">
              <CardTitle className="text-base">{t('detail.jsonTitle')}</CardTitle>
              <CardDescription>{t('detail.jsonDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminJsonEditor
                label={t('detail.jsonLabel')}
                value={form.form_data ?? {}}
                onChange={(next) => setField('form_data', next)}
                onErrorChange={() => toast.error(t('messages.invalidJson'))}
                disabled={busy}
                height={420}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Direct Email Button ── */

function DirectEmailButton({ offerId, email, disabled }: { offerId: string; email: string; disabled: boolean }) {
  const [sending, setSending] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleSend = async () => {
    if (!offerId || !email) {
      toast.error('Müşteri e-postası gerekli');
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`/api/admin/offers/${encodeURIComponent(offerId)}/direct-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: message.trim() || undefined }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(data.message || 'E-posta gönderildi');
        setShowModal(false);
        setMessage('');
      } else {
        toast.error(data?.error?.message || 'Gönderim hatası');
      }
    } catch (err: any) {
      toast.error(err.message || 'Bağlantı hatası');
    } finally {
      setSending(false);
    }
  };

  if (!showModal) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setShowModal(true)}
        disabled={disabled || !email}
      >
        <Mail className="mr-2 size-4" />
        Doğrudan E-posta
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border bg-background p-4 shadow-lg space-y-3">
        <h3 className="text-sm font-medium">Müşteriye E-posta Gönder</h3>
        <p className="text-xs text-muted-foreground">Alıcı: {email}</p>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Ek Mesaj (opsiyonel)</label>
          <textarea
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Teklif ile birlikte iletmek istediğiniz mesaj..."
            disabled={sending}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowModal(false)} disabled={sending}>
            İptal
          </Button>
          <Button size="sm" onClick={handleSend} disabled={sending}>
            {sending ? 'Gönderiliyor...' : 'Gönder'}
          </Button>
        </div>
      </div>
    </div>
  );
}
