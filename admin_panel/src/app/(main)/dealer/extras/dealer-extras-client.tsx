'use client';

import * as React from 'react';
import { Send, Sprout } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateExtraRequestDealerMutation,
  useListExtrasDealerQuery,
} from '@/integrations/hooks';
import type { ExtraSeedling } from '@/integrations/endpoints/admin/extras_admin.endpoints';

function fmtDate(value: string | null | undefined) {
  if (!value) return 'Hazır';
  return new Date(value).toLocaleDateString('tr-TR');
}

function fmtNum(value: number | string) {
  return Number(value).toLocaleString('tr-TR');
}

function RequestDialog({
  item,
  open,
  onOpenChange,
}: {
  item: ExtraSeedling | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [quantity, setQuantity] = React.useState(0);
  const [dealerName, setDealerName] = React.useState('');
  const [dealerPhone, setDealerPhone] = React.useState('');
  const [note, setNote] = React.useState('');
  const [createRequest, state] = useCreateExtraRequestDealerMutation();

  React.useEffect(() => {
    setQuantity(item?.quantity ?? 0);
    setDealerName('');
    setDealerPhone('');
    setNote('');
  }, [item]);

  if (!item) return null;
  const currentItem = item;

  async function submit() {
    if (quantity <= 0) {
      toast.error('Talep adedi girin.');
      return;
    }
    try {
      await createRequest({
        extra_seedling_id: currentItem.id,
        requested_quantity: quantity,
        dealer_name: dealerName || null,
        dealer_phone: dealerPhone || null,
        note: note || null,
      }).unwrap();
      toast.success('Talebiniz alındı.');
      onOpenChange(false);
    } catch {
      toast.error('Talep gönderilemedi.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item.product_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Viol:</span> {item.tray_type}</div>
            <div><span className="text-muted-foreground">Mevcut:</span> {fmtNum(item.quantity)}</div>
          </div>
          <div className="space-y-2">
            <Label>Talep Adedi</Label>
            <Input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Bayi Adı</Label>
              <Input value={dealerName} onChange={(e) => setDealerName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input value={dealerPhone} onChange={(e) => setDealerPhone(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Not</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Vazgeç</Button>
          <Button onClick={submit} disabled={state.isLoading}>
            <Send className="mr-2 size-4" />
            Talep Et
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DealerExtrasClient() {
  const q = useListExtrasDealerQuery(undefined, { refetchOnMountOrArgChange: true });
  const [selected, setSelected] = React.useState<ExtraSeedling | null>(null);
  const rows = q.data?.items ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <div>
        <div className="flex items-center gap-2">
          <Sprout className="size-6 text-primary" />
          <h1 className="font-bold text-2xl tracking-tight">Ekstra Fideler</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Hazır veya yakında hazır olacak ekstra fide stokları. Talep gönderin, ekip sizinle iletişime geçsin.
        </p>
      </div>

      {q.isLoading ? (
        <div className="text-muted-foreground text-sm">Yükleniyor...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{item.product_name}</CardTitle>
                    <CardDescription>{item.category}</CardDescription>
                  </div>
                  <Badge>{item.availability_label || fmtDate(item.available_on)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Viol</span><div className="font-semibold">{item.tray_type}</div></div>
                  <div><span className="text-muted-foreground">Adet</span><div className="font-semibold">{fmtNum(item.quantity)}</div></div>
                </div>
                <Button className="w-full" onClick={() => setSelected(item)}>
                  <Send className="mr-2 size-4" />
                  Talep Et
                </Button>
              </CardContent>
            </Card>
          ))}
          {rows.length === 0 ? (
            <Card className="md:col-span-2 xl:col-span-3">
              <CardContent className="p-6 text-center text-muted-foreground">Yayında ekstra fide yok.</CardContent>
            </Card>
          ) : null}
        </div>
      )}

      <RequestDialog item={selected} open={!!selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
