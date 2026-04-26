'use client';

import * as React from 'react';
import { CalendarDays, Edit, Plus, RefreshCcw, Send, Sprout, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import { AdminImageUploadField } from '@/app/(main)/(admin-pages)/_components/common/AdminImageUploadField';
import {
  useCreateExtraAdminMutation,
  useDeleteExtraAdminMutation,
  useListExtraRequestsAdminQuery,
  useListExtrasAdminQuery,
  useUpdateExtraAdminMutation,
  useUpdateExtraRequestAdminMutation,
} from '@/integrations/hooks';
import type {
  ExtraRequestStatus,
  ExtraSeedling,
  ExtraSeedlingInput,
  ExtraStatus,
} from '@/integrations/endpoints/admin/extras_admin.endpoints';

const STATUSES: ExtraStatus[] = ['draft', 'published', 'reserved', 'sold_out', 'archived'];
const REQUEST_STATUSES: ExtraRequestStatus[] = ['new', 'contacted', 'approved', 'rejected', 'cancelled'];

const statusLabel: Record<ExtraStatus, string> = {
  draft: 'Taslak',
  published: 'Yayında',
  reserved: 'Rezerve',
  sold_out: 'Tükendi',
  archived: 'Arşiv',
};

const requestStatusLabel: Record<ExtraRequestStatus, string> = {
  new: 'Yeni',
  contacted: 'Arandı',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
  cancelled: 'İptal',
};

const emptyForm: ExtraSeedlingInput = {
  category: 'Biber',
  product_name: '',
  tray_type: 171,
  quantity: 0,
  available_on: '',
  availability_label: '',
  status: 'published',
  image_url: '',
  note: '',
  source_date: '',
};

function fmtDate(value: string | null | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('tr-TR');
}

function fmtNum(value: number | string | null | undefined) {
  if (value == null || value === '') return '—';
  return Number(value).toLocaleString('tr-TR');
}

function toInput(row: ExtraSeedling): ExtraSeedlingInput {
  return {
    category: row.category,
    product_name: row.product_name,
    tray_type: row.tray_type,
    quantity: row.quantity,
    available_on: row.available_on ?? '',
    availability_label: row.availability_label ?? '',
    status: row.status,
    image_url: row.image_url ?? '',
    note: row.note ?? '',
    source_date: row.source_date ?? '',
  };
}

function cleanPayload(form: ExtraSeedlingInput): ExtraSeedlingInput {
  return {
    ...form,
    category: form.category.trim(),
    product_name: form.product_name.trim(),
    tray_type: Number(form.tray_type),
    quantity: Number(form.quantity),
    available_on: form.available_on || null,
    availability_label: form.availability_label?.trim() || null,
    image_url: form.image_url?.trim() || null,
    note: form.note?.trim() || null,
    source_date: form.source_date || null,
  };
}

function ExtraFormDialog({
  row,
  open,
  onOpenChange,
}: {
  row: ExtraSeedling | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = React.useState<ExtraSeedlingInput>(emptyForm);
  const [createExtra, createState] = useCreateExtraAdminMutation();
  const [updateExtra, updateState] = useUpdateExtraAdminMutation();

  React.useEffect(() => {
    setForm(row ? toInput(row) : emptyForm);
  }, [row]);

  const busy = createState.isLoading || updateState.isLoading;

  async function save() {
    const payload = cleanPayload(form);
    if (!payload.category || !payload.product_name || payload.tray_type <= 0) {
      toast.error('Kategori, ürün adı ve viol tipi zorunlu.');
      return;
    }

    try {
      if (row) {
        await updateExtra({ id: row.id, body: payload }).unwrap();
      } else {
        await createExtra(payload).unwrap();
      }
      toast.success('Ekstra kaydedildi.');
      onOpenChange(false);
    } catch {
      toast.error('Ekstra kaydedilemedi.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{row ? 'Ekstra Düzenle' : 'Yeni Ekstra'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Durum</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as ExtraStatus }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Ürün Adı</Label>
              <Input value={form.product_name} onChange={(e) => setForm((p) => ({ ...p, product_name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Viol Tipi</Label>
              <Input type="number" value={form.tray_type} onChange={(e) => setForm((p) => ({ ...p, tray_type: Number(e.target.value) }))} />
            </div>
            <div className="space-y-2">
              <Label>Adet</Label>
              <Input type="number" value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: Number(e.target.value) }))} />
            </div>
            <div className="space-y-2">
              <Label>Hazır Tarihi</Label>
              <Input type="date" value={form.available_on ?? ''} onChange={(e) => setForm((p) => ({ ...p, available_on: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Hazır Durumu</Label>
              <Input placeholder="HAZIR / BOYLU" value={form.availability_label ?? ''} onChange={(e) => setForm((p) => ({ ...p, availability_label: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Liste Tarihi</Label>
              <Input type="date" value={form.source_date ?? ''} onChange={(e) => setForm((p) => ({ ...p, source_date: e.target.value }))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Not</Label>
              <Textarea value={form.note ?? ''} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} />
            </div>
          </div>

          <AdminImageUploadField
            label="Görsel"
            bucket="public"
            folder="extras"
            metadata={{ module: 'extras', product: form.product_name }}
            value={form.image_url ?? ''}
            onChange={(url) => setForm((p) => ({ ...p, image_url: url }))}
            disabled={busy}
            openLibraryHref="/storage"
            previewAspect="4x3"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Vazgeç</Button>
          <Button onClick={save} disabled={busy}>Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ExtrasTab() {
  const [status, setStatus] = React.useState('published');
  const [editing, setEditing] = React.useState<ExtraSeedling | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const q = useListExtrasAdminQuery({ status: status === 'all' ? undefined : status, limit: 200 });
  const [archiveExtra] = useDeleteExtraAdminMutation();

  async function archive(row: ExtraSeedling) {
    try {
      await archiveExtra({ id: row.id }).unwrap();
      toast.success('Ekstra arşivlendi.');
    } catch {
      toast.error('Ekstra arşivlenemedi.');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => q.refetch()} disabled={q.isFetching}>
            <RefreshCcw className="mr-2 size-4" />
            Yenile
          </Button>
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-2 size-4" />
            Yeni Ekstra
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ürün</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Viol</TableHead>
                <TableHead className="text-right">Adet</TableHead>
                <TableHead>Hazır</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(q.data?.items ?? []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-[320px] truncate font-medium">{row.product_name}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.tray_type}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmtNum(row.quantity)}</TableCell>
                  <TableCell>{row.availability_label || fmtDate(row.available_on)}</TableCell>
                  <TableCell><Badge variant={row.status === 'published' ? 'default' : 'secondary'}>{statusLabel[row.status]}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(row); setDialogOpen(true); }}>
                      <Edit className="size-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => archive(row)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!q.isLoading && (q.data?.items ?? []).length === 0 ? (
                <TableRow><TableCell colSpan={7} className="p-6 text-center text-muted-foreground">Kayıt yok.</TableCell></TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ExtraFormDialog row={editing} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

function RequestsTab() {
  const q = useListExtraRequestsAdminQuery({ limit: 100 });
  const [updateRequest] = useUpdateExtraRequestAdminMutation();

  async function setStatus(id: string, status: ExtraRequestStatus) {
    try {
      await updateRequest({ id, status }).unwrap();
      toast.success('Talep güncellendi.');
    } catch {
      toast.error('Talep güncellenemedi.');
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarih</TableHead>
              <TableHead>Ürün</TableHead>
              <TableHead>Bayi</TableHead>
              <TableHead className="text-right">Talep</TableHead>
              <TableHead>Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(q.data?.items ?? []).map(({ request, extra }) => (
              <TableRow key={request.id}>
                <TableCell>{fmtDate(request.created_at)}</TableCell>
                <TableCell className="max-w-[260px] truncate">{extra?.product_name ?? request.extra_seedling_id}</TableCell>
                <TableCell>{request.dealer_name || request.dealer_phone || request.dealer_user_id || '—'}</TableCell>
                <TableCell className="text-right tabular-nums">{fmtNum(request.requested_quantity)}</TableCell>
                <TableCell>
                  <Select value={request.status} onValueChange={(v) => setStatus(request.id, v as ExtraRequestStatus)}>
                    <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {REQUEST_STATUSES.map((s) => <SelectItem key={s} value={s}>{requestStatusLabel[s]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {!q.isLoading && (q.data?.items ?? []).length === 0 ? (
              <TableRow><TableCell colSpan={5} className="p-6 text-center text-muted-foreground">Talep yok.</TableCell></TableRow>
            ) : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function AdminExtrasClient() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sprout className="size-5 text-primary" />
            <h1 className="font-bold text-2xl tracking-tight">Ekstra Fideler</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Sipariş dışı hazır olacak fide fırsatlarını ve bayi taleplerini yönetin.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="size-4" />
            İş Akışı
          </CardTitle>
          <CardDescription>
            Yayındaki kayıtlar bayilere görünür. Bayiler doğrudan satın almaz; talep gönderir, ekip arayıp netleştirir.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="extras">
        <TabsList>
          <TabsTrigger value="extras"><Sprout className="mr-2 size-4" />Ekstralar</TabsTrigger>
          <TabsTrigger value="requests"><Send className="mr-2 size-4" />Talepler</TabsTrigger>
        </TabsList>
        <TabsContent value="extras" className="mt-4"><ExtrasTab /></TabsContent>
        <TabsContent value="requests" className="mt-4"><RequestsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
