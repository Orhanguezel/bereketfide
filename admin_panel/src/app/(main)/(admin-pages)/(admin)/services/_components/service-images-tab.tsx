'use client';

// =============================================================
// FILE: services/_components/service-images-tab.tsx
// Service Image Management — add, edit, delete images
// =============================================================

import * as React from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, ImageIcon, Save, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { AdminImageUploadField } from '@/app/(main)/(admin-pages)/_components/common/AdminImageUploadField';

import type { ServiceImageDto, ServiceImageCreatePayload, ServiceImageUpdatePayload } from '@/integrations/shared';
import {
  useListServiceImagesAdminQuery,
  useCreateServiceImageAdminMutation,
  useUpdateServiceImageAdminMutation,
  useDeleteServiceImageAdminMutation,
} from '@/integrations/hooks';

const norm = (v: unknown) => String(v ?? '').trim();

function getErrMessage(err: unknown, fallback: string): string {
  const anyErr = err as any;
  return anyErr?.data?.error?.message || anyErr?.data?.message || anyErr?.error || fallback;
}

/* ------------------------------------------------------------------ */
/* Image card                                                          */
/* ------------------------------------------------------------------ */

function ServiceImageCard({
  image, disabled, onEdit, onDelete, isCover, onSelectCover,
}: {
  image: ServiceImageDto;
  disabled: boolean;
  onEdit: (img: ServiceImageDto) => void;
  onDelete: (id: string) => void;
  isCover?: boolean;
  onSelectCover?: (url: string) => void;
}) {
  const imgUrl = (image as any).image_url_resolved || image.image_url || '';

  return (
    <div className={`flex items-start gap-3 rounded-lg border bg-card p-3 ${isCover ? 'ring-2 ring-primary' : ''}`}>
      <div className="size-20 shrink-0 overflow-hidden rounded-md border bg-muted">
        {imgUrl ? (
          <img src={imgUrl} alt={image.alt || ''} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImageIcon className="size-6 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">
            {image.alt || image.caption || `#${image.display_order}`}
          </span>
          {isCover && <Badge variant="default" className="text-xs">Kapak</Badge>}
          {!image.is_active && <Badge variant="secondary" className="text-xs">Pasif</Badge>}
        </div>
        {image.caption && <p className="truncate text-xs text-muted-foreground">{image.caption}</p>}
        <p className="text-xs text-muted-foreground">Sıra: {image.display_order}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {onSelectCover && !isCover && imgUrl && (
          <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs text-amber-600 hover:text-amber-700" onClick={() => onSelectCover(imgUrl)} disabled={disabled} title="Kapak görseli yap">
            Kapak
          </Button>
        )}
        <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => onEdit(image)} disabled={disabled}>
          <Save className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => onDelete(image.id)} disabled={disabled}>
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Edit form                                                           */
/* ------------------------------------------------------------------ */

function ImageEditForm({
  image, serviceId, disabled: parentDisabled, onClose,
}: {
  image: ServiceImageDto;
  serviceId: string;
  disabled: boolean;
  onClose: () => void;
}) {
  const [values, setValues] = React.useState({
    alt: norm(image.alt),
    caption: norm(image.caption),
    is_active: !!(image.is_active),
  });

  const [updateImage, { isLoading }] = useUpdateServiceImageAdminMutation();
  const disabled = parentDisabled || isLoading;

  async function handleSave() {
    try {
      await updateImage({
        serviceId,
        imageId: image.id,
        patch: {
          alt: values.alt || null,
          caption: values.caption || null,
          is_active: values.is_active ? 1 : 0,
        } as ServiceImageUpdatePayload,
      }).unwrap();
      toast.success('Görsel güncellendi.');
      onClose();
    } catch (err) {
      toast.error(getErrMessage(err, 'Güncelleme hatası.'));
    }
  }

  return (
    <Card className="border-primary/30">
      <CardHeader className="gap-1 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Görsel Düzenle</CardTitle>
          <Button type="button" variant="ghost" size="icon" className="size-7" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Alt Metin</Label>
            <Input value={values.alt} onChange={(e) => setValues((p) => ({ ...p, alt: e.target.value }))} disabled={disabled} placeholder="Görsel açıklaması..." />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Başlık</Label>
            <Input value={values.caption} onChange={(e) => setValues((p) => ({ ...p, caption: e.target.value }))} disabled={disabled} placeholder="Görsel başlığı..." />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id={`simg_active_${image.id}`} checked={values.is_active} onCheckedChange={(v) => setValues((p) => ({ ...p, is_active: v === true }))} disabled={disabled} />
          <Label htmlFor={`simg_active_${image.id}`} className="text-xs">Aktif</Label>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={disabled}>İptal</Button>
          <Button type="button" size="sm" onClick={handleSave} disabled={disabled}>
            <Save className="mr-1.5 size-3.5" />
            Kaydet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Main tab                                                            */
/* ------------------------------------------------------------------ */

interface ServiceImagesTabProps {
  serviceId: string;
  disabled?: boolean;
  coverUrl?: string;
  onSelectCover?: (url: string) => void;
}

export function ServiceImagesTab({ serviceId, disabled: parentDisabled = false, coverUrl, onSelectCover }: ServiceImagesTabProps) {
  const { data: images, isLoading, isFetching } = useListServiceImagesAdminQuery(serviceId, { skip: !serviceId });

  const [createImage, createState] = useCreateServiceImageAdminMutation();
  const [deleteImage, deleteState] = useDeleteServiceImageAdminMutation();

  const busy = isLoading || isFetching || createState.isLoading || deleteState.isLoading;
  const disabled = parentDisabled || busy;

  const [editingImage, setEditingImage] = React.useState<ServiceImageDto | null>(null);

  const sortedImages = React.useMemo(() => {
    const list = Array.isArray(images) ? [...images] : [];
    list.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    return list;
  }, [images]);

  async function handleAddImage(url: string) {
    if (!url) return;
    try {
      await createImage({
        serviceId,
        payload: {
          image_url: url,
          display_order: sortedImages.length,
          is_active: 1,
        } as ServiceImageCreatePayload,
      }).unwrap();
      toast.success('Görsel eklendi.');
    } catch (err) {
      toast.error(getErrMessage(err, 'Görsel eklenemedi.'));
    }
  }

  async function handleAddMultipleImages(urls: string[]) {
    let count = 0;
    for (let i = 0; i < urls.length; i++) {
      if (!urls[i]) continue;
      try {
        await createImage({
          serviceId,
          payload: {
            image_url: urls[i],
            display_order: sortedImages.length + i,
            is_active: 1,
          } as ServiceImageCreatePayload,
        }).unwrap();
        count++;
      } catch (err) {
        toast.error(getErrMessage(err, 'Görsel eklenemedi.'));
      }
    }
    if (count > 0) toast.success(`${count} görsel eklendi.`);
  }

  async function handleDelete(imageId: string) {
    if (!confirm('Bu görseli silmek istediğinize emin misiniz?')) return;
    try {
      await deleteImage({ serviceId, imageId }).unwrap();
      toast.success('Görsel silindi.');
      if (editingImage?.id === imageId) setEditingImage(null);
    } catch (err) {
      toast.error(getErrMessage(err, 'Silme hatası.'));
    }
  }

  const imageMetadata = React.useMemo(() => ({ module_key: 'services', service_id: serviceId }), [serviceId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="gap-1 pb-3">
          <CardTitle className="text-sm">Görsel Ekle</CardTitle>
          <CardDescription className="text-xs">Birden fazla görsel seçebilirsiniz.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminImageUploadField
            label=""
            bucket="public"
            folder="services"
            metadata={imageMetadata}
            multiple
            values={[]}
            onChangeMultiple={handleAddMultipleImages}
            onChange={handleAddImage}
            disabled={disabled}
          />
        </CardContent>
      </Card>

      {editingImage && (
        <ImageEditForm
          image={editingImage}
          serviceId={serviceId}
          disabled={parentDisabled}
          onClose={() => setEditingImage(null)}
        />
      )}

      <Card>
        <CardHeader className="gap-1 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Görseller</CardTitle>
            <Badge variant="secondary">{sortedImages.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {sortedImages.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
              <ImageIcon className="size-8" />
              <p className="text-sm">Henüz görsel eklenmedi.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedImages.map((img) => (
                <ServiceImageCard
                  key={img.id}
                  image={img}
                  disabled={disabled}
                  onEdit={setEditingImage}
                  onDelete={handleDelete}
                  isCover={!!(coverUrl && ((img as any).image_url_resolved === coverUrl || img.image_url === coverUrl))}
                  onSelectCover={onSelectCover}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
