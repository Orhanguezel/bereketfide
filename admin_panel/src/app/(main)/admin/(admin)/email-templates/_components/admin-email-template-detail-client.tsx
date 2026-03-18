'use client';

// =============================================================
// FILE: src/app/(main)/admin/(admin)/email-templates/_components/admin-email-template-detail-client.tsx
// FINAL — Admin Email Template Detail (App Router + RichText)
// =============================================================

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save, Info, Tag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';
import RichContentEditor from '@/app/(main)/admin/_components/common/RichContentEditor';

import {
  useGetEmailTemplateAdminQuery,
  useCreateEmailTemplateAdminMutation,
  useUpdateEmailTemplateAdminMutation,
} from '@/integrations/hooks';

export default function AdminEmailTemplateDetailClient({ id }: { id: string }) {
  const t = useAdminT('admin.email_templates');
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = id === 'new';

  const [activeLocale, setActiveLocale] = React.useState(searchParams.get('locale') || 'tr');

  const getQ = useGetEmailTemplateAdminQuery({ id }, { skip: isNew });
  const [createTemplate, createState] = useCreateEmailTemplateAdminMutation();
  const [updateTemplate, updateState] = useUpdateEmailTemplateAdminMutation();

  const [form, setForm] = React.useState({
    template_key: '',
    is_active: true,
    template_name: '',
    subject: '',
    content: '',
    variables: '',
  });

  const parentData = getQ.data;
  const translation = React.useMemo(() => {
    return parentData?.translations?.find((tr: any) => tr.locale === activeLocale);
  }, [parentData, activeLocale]);

  React.useEffect(() => {
    if (parentData && !isNew) {
      setForm((prev) => ({
        ...prev,
        template_key: parentData.template_key || '',
        is_active: !!parentData.is_active,
        variables: parentData.variables ? JSON.stringify(parentData.variables) : '',
        template_name: translation?.template_name || '',
        subject: translation?.subject || '',
        content: translation?.content || '',
      }));
    }
  }, [parentData, translation, isNew]);

  const busy = getQ.isLoading || createState.isLoading || updateState.isLoading;

  async function onSave() {
    try {
      if (!form.template_key.trim()) {
        toast.error('Şablon anahtarı boş olamaz.');
        return;
      }

      let parsedVariables = null;
      if (form.variables.trim()) {
        try {
          parsedVariables = JSON.parse(form.variables);
        } catch {
          toast.error(t('messages.invalidJson'));
          return;
        }
      }

      if (isNew) {
        const res = await createTemplate({
          template_key: form.template_key,
          is_active: form.is_active,
          locale: activeLocale,
          template_name: form.template_name,
          subject: form.subject,
          content: form.content,
          variables: parsedVariables,
        }).unwrap();
        toast.success(t('messages.saved'));
        router.push(`/admin/email-templates/${res.id}?locale=${activeLocale}`);
      } else {
        await updateTemplate({
          id,
          body: {
            template_key: form.template_key,
            is_active: form.is_active,
            locale: activeLocale,
            template_name: form.template_name,
            subject: form.subject,
            content: form.content,
            variables: parsedVariables,
          },
        }).unwrap();
        toast.success(t('messages.saved'));
        getQ.refetch();
      }
    } catch (err: any) {
      if (err?.status === 409) {
        toast.error(t('messages.keyExists'));
      } else {
        toast.error(err?.data?.error?.message || err?.message || t('messages.saveError'));
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()} disabled={busy}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">
              {isNew ? t('detail.createTitle') : t('detail.title')}
            </h1>
            <p className="text-sm text-muted-foreground">{t('detail.description')}</p>
          </div>
        </div>

        <Button onClick={onSave} disabled={busy}>
          <Save className="mr-2 size-4" />
          {t('admin.common.save') || 'Kaydet'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('detail.basicInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t('detail.keys.key')}</Label>
                  <Input
                    value={form.template_key}
                    onChange={(e) => setForm((p) => ({ ...p, template_key: e.target.value }))}
                    placeholder="password_reset"
                    disabled={busy || (!isNew && activeLocale !== 'tr')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('detail.keys.name')}</Label>
                  <Input
                    value={form.template_name}
                    onChange={(e) => setForm((p) => ({ ...p, template_name: e.target.value }))}
                    placeholder="Şifre Sıfırlama E-postası"
                    disabled={busy}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('detail.keys.subject')}</Label>
                <Input
                  value={form.subject}
                  onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                  placeholder="Şifrenizi Sıfırlayın"
                  disabled={busy}
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="space-y-2">
                  <Label>{t('detail.keys.locale')}</Label>
                  <Select value={activeLocale} onValueChange={setActiveLocale} disabled={busy}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(['tr', 'en', 'de'] as const).map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    id="active-switch"
                    checked={form.is_active}
                    onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))}
                    disabled={busy}
                  />
                  <Label htmlFor="active-switch">{t('detail.keys.active')}</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{t('detail.content')}</CardTitle>
                <Badge variant="outline" className="uppercase">
                  {activeLocale}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <RichContentEditor
                value={form.content}
                onChange={(v) => setForm((p) => ({ ...p, content: v }))}
                label={t('detail.content')}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="size-4" />
                {t('detail.variables')}
              </CardTitle>
              <CardDescription>{t('detail.variablesHelp')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={form.variables}
                onChange={(e) => setForm((p) => ({ ...p, variables: e.target.value }))}
                className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder='["user_name", "reset_link"]'
                disabled={busy}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="size-4" />
                {t('detail.detectedVariables')}
              </CardTitle>
              <CardDescription>{t('detail.detectedHelp')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(translation?.detected_variables || []).length > 0 ? (
                  translation!.detected_variables.map((v: string) => (
                    <Badge key={v} variant="secondary">
                      {v}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Değişken bulunamadı.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
