'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Send, Settings, MessageSquare, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminT } from '@/app/(main)/(admin-pages)/_components/common/useAdminT';
import {
  useBulkUpsertSiteSettingsAdminMutation,
  useListSiteSettingsAdminQuery,
} from '@/integrations/hooks';
import {
  useTelegramTestMutation,
  useListTelegramInboundQuery,
  useGetTelegramAutoReplyQuery,
  useUpdateTelegramAutoReplyMutation,
} from '@/integrations/hooks';

// ─── Ayarlar Tab ──────────────────────────────────────────────────────────────

const SETTING_KEYS = [
  'telegram_notifications_enabled',
  'telegram_webhook_enabled',
  'telegram_bot_token',
  'telegram_default_chat_id',
  'telegram_event_new_contact_enabled',
  'telegram_event_new_ticket_enabled',
  'telegram_event_ticket_replied_enabled',
  'telegram_event_new_offer_request_enabled',
  'telegram_event_new_newsletter_subscription_enabled',
  'telegram_event_new_order_enabled',
];

function toBool(v: string | undefined): boolean {
  return v === 'true' || v === '1';
}

function TelegramSettingsTab() {
  const t = useAdminT('admin.telegram.settings');
  const { data: rawSettings, isLoading } = useListSiteSettingsAdminQuery({
    prefix: 'telegram_',
    limit: 50,
  });
  const [bulkUpsert, { isLoading: isSaving }] = useBulkUpsertSiteSettingsAdminMutation();
  const [telegramTest] = useTelegramTestMutation();
  const [isTesting, setIsTesting] = React.useState(false);

  const settingsMap = React.useMemo(() => {
    const m: Record<string, string> = {};
    for (const s of rawSettings ?? []) {
      if (s.locale === '*' || !s.locale) m[s.key] = String(s.value ?? '');
    }
    return m;
  }, [rawSettings]);

  const [form, setForm] = React.useState({
    enabled: false,
    webhookEnabled: true,
    botToken: '',
    chatId: '',
    evtContact: true,
    evtTicket: true,
    evtTicketReply: true,
    evtOffer: true,
    evtNewsletter: true,
    evtOrder: true,
  });

  React.useEffect(() => {
    if (!rawSettings) return;
    setForm({
      enabled: toBool(settingsMap['telegram_notifications_enabled']),
      webhookEnabled: toBool(settingsMap['telegram_webhook_enabled'] ?? 'true'),
      botToken: settingsMap['telegram_bot_token'] ?? '',
      chatId: settingsMap['telegram_default_chat_id'] ?? '',
      evtContact: toBool(settingsMap['telegram_event_new_contact_enabled'] ?? 'true'),
      evtTicket: toBool(settingsMap['telegram_event_new_ticket_enabled'] ?? 'true'),
      evtTicketReply: toBool(settingsMap['telegram_event_ticket_replied_enabled'] ?? 'true'),
      evtOffer: toBool(settingsMap['telegram_event_new_offer_request_enabled'] ?? 'true'),
      evtNewsletter: toBool(settingsMap['telegram_event_new_newsletter_subscription_enabled'] ?? 'true'),
      evtOrder: toBool(settingsMap['telegram_event_new_order_enabled'] ?? 'true'),
    });
  }, [rawSettings, settingsMap]);

  async function handleSave() {
    try {
      await bulkUpsert({
        items: [
          { key: 'telegram_notifications_enabled', value: String(form.enabled) },
          { key: 'telegram_webhook_enabled', value: String(form.webhookEnabled) },
          { key: 'telegram_bot_token', value: form.botToken.trim() },
          { key: 'telegram_default_chat_id', value: form.chatId.trim() },
          { key: 'telegram_event_new_contact_enabled', value: String(form.evtContact) },
          { key: 'telegram_event_new_ticket_enabled', value: String(form.evtTicket) },
          { key: 'telegram_event_ticket_replied_enabled', value: String(form.evtTicketReply) },
          { key: 'telegram_event_new_offer_request_enabled', value: String(form.evtOffer) },
          { key: 'telegram_event_new_newsletter_subscription_enabled', value: String(form.evtNewsletter) },
          { key: 'telegram_event_new_order_enabled', value: String(form.evtOrder) },
        ],
      }).unwrap();
      toast.success(t('saved'));
    } catch {
      toast.error(t('saveError'));
    }
  }

  async function handleTest() {
    setIsTesting(true);
    try {
      await telegramTest().unwrap();
      toast.success(t('testSent'));
    } catch {
      toast.error(t('testFailed'));
    } finally {
      setIsTesting(false);
    }
  }

  if (isLoading) return <p className="text-sm text-muted-foreground p-4">{t('loading')}</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('enableNotifications')}</Label>
                  <p className="text-xs text-muted-foreground">{t('enableNotificationsDesc')}</p>
                </div>
                <Switch
                  checked={form.enabled}
                  onCheckedChange={(v) => setForm((p) => ({ ...p, enabled: v }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('enableWebhook')}</Label>
                  <p className="text-xs text-muted-foreground">{t('enableWebhookDesc')}</p>
                </div>
                <Switch
                  checked={form.webhookEnabled}
                  onCheckedChange={(v) => setForm((p) => ({ ...p, webhookEnabled: v }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('botToken')}</Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={form.botToken}
                  onChange={(e) => setForm((p) => ({ ...p, botToken: e.target.value }))}
                  placeholder="1234567890:ABC..."
                />
              </div>
              <div className="space-y-2">
                <Label>{t('defaultChatId')}</Label>
                <Input
                  autoComplete="off"
                  value={form.chatId}
                  onChange={(e) => setForm((p) => ({ ...p, chatId: e.target.value }))}
                  placeholder="7044964180"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">{t('events.title')}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { key: 'evtContact', label: t('events.newContact') },
                { key: 'evtTicket', label: t('events.newTicket') },
                { key: 'evtTicketReply', label: t('events.ticketReplied') },
                { key: 'evtOffer', label: t('events.newOfferRequest') },
                { key: 'evtNewsletter', label: t('events.newNewsletterSubscription') },
                { key: 'evtOrder', label: t('events.newOrder') },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm">{label}</span>
                  <Switch
                    checked={form[key as keyof typeof form] as boolean}
                    onCheckedChange={(v) => setForm((p) => ({ ...p, [key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <Button variant="outline" onClick={handleTest} disabled={isTesting || !form.botToken || !form.chatId}>
              <Send className="h-4 w-4 mr-2" />
              {isTesting ? t('testSending') : t('testSend')}
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? t('saving') : t('save')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Otomatik Yanıt Tab ───────────────────────────────────────────────────────

function TelegramAutoReplyTab() {
  const t = useAdminT('admin.telegram.autoreply');
  const { data, isLoading } = useGetTelegramAutoReplyQuery();
  const [update, { isLoading: isSaving }] = useUpdateTelegramAutoReplyMutation();

  const [enabled, setEnabled] = React.useState(false);
  const [template, setTemplate] = React.useState('');

  React.useEffect(() => {
    if (!data) return;
    setEnabled(data.enabled);
    setTemplate(data.template);
  }, [data]);

  async function handleSave() {
    if (!template.trim()) {
      toast.error(t('emptyError'));
      return;
    }
    try {
      await update({ enabled, template }).unwrap();
      toast.success(t('saved'));
    } catch {
      toast.error(t('saveError'));
    }
  }

  if (isLoading) return <p className="text-sm text-muted-foreground p-4">{t('loading')}</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>{t('enable')}</Label>
            <p className="text-xs text-muted-foreground">{t('enableDesc')}</p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>{t('templateLabel')}</Label>
          <Textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={5}
            placeholder="Vielen Dank für Ihre Nachricht..."
          />
        </div>

        <div className="flex justify-end pt-2 border-t">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? t('saving') : t('save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Gelen Mesajlar Tab ───────────────────────────────────────────────────────

function TelegramInboundTab() {
  const t = useAdminT('admin.telegram.inbound');
  const [search, setSearch] = React.useState('');
  const [chatId, setChatId] = React.useState('');
  const [cursor, setCursor] = React.useState<string | undefined>(undefined);

  const { data, isLoading, isFetching, refetch } = useListTelegramInboundQuery({
    q: search || undefined,
    chat_id: chatId || undefined,
    limit: 30,
    cursor,
  });

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('tr-TR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            <Input
              className="w-64"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCursor(undefined); }}
            />
            <Input
              className="w-44"
              placeholder={t('chatIdPlaceholder')}
              value={chatId}
              onChange={(e) => { setChatId(e.target.value); setCursor(undefined); }}
            />
            <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">{t('loading')}</p>
          ) : !data?.items?.length ? (
            <p className="text-sm text-muted-foreground">{t('noRecords')}</p>
          ) : (
            <div className="space-y-2">
              {data.items.map((msg) => (
                <div key={msg.id} className="rounded-md border p-3 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground">
                        {msg.from_first_name || ''} {msg.from_last_name || ''}
                        {msg.from_username ? ` @${msg.from_username}` : ''}
                        {msg.from_is_bot ? <Badge className="ml-1 text-[10px]" variant="secondary">bot</Badge> : null}
                      </p>
                      <p className="text-sm">{msg.text ?? <span className="text-muted-foreground italic">{t('noText')}</span>}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(msg.created_at)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    chat: {msg.chat_id} · {msg.chat_type ?? ''}
                    {msg.chat_title ? ` · ${msg.chat_title}` : ''}
                  </p>
                </div>
              ))}
            </div>
          )}

          {data?.next_cursor && (
            <div className="pt-3 flex justify-center">
              <Button variant="outline" size="sm" onClick={() => setCursor(data.next_cursor ?? undefined)}>
                {t('loadMore')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────

export default function AdminTelegramClient() {
  const t = useAdminT('admin.telegram');
  const [telegramTest] = useTelegramTestMutation();
  const [isTesting, setIsTesting] = React.useState(false);

  async function handleHeaderTest() {
    setIsTesting(true);
    try {
      await telegramTest().unwrap();
      toast.success('Telegram test mesajı gönderildi.');
    } catch {
      toast.error('Test mesajı gönderilemedi. Bot token ve Chat ID ayarlarını kontrol edin.');
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Bot className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-base">{t('header.title')}</CardTitle>
                <CardDescription>{t('header.description')}</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleHeaderTest} disabled={isTesting}>
              <Send className="h-4 w-4 mr-2" />
              {isTesting ? t('settings.testSending') : t('header.test')}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            {t('tabs.settings')}
          </TabsTrigger>
          <TabsTrigger value="autoreply">
            <MessageSquare className="h-4 w-4 mr-2" />
            {t('tabs.autoreply')}
          </TabsTrigger>
          <TabsTrigger value="inbound">
            <MessageSquare className="h-4 w-4 mr-2" />
            {t('tabs.inbound')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-4">
          <TelegramSettingsTab />
        </TabsContent>

        <TabsContent value="autoreply" className="mt-4">
          <TelegramAutoReplyTab />
        </TabsContent>

        <TabsContent value="inbound" className="mt-4">
          <TelegramInboundTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
