// =============================================================
// CustomPageSidebarColumn — Sadece içerik içi görsel ekleme
// =============================================================

'use client';

import React from 'react';

import { AdminImageUploadField } from '@/app/(main)/admin/_components/common/AdminImageUploadField';
import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';
import type { ContentImageSize, CustomPageFormValues } from './custom-page-form';

type Props = {
  values: CustomPageFormValues;
  disabled: boolean;

  imageMetadata: Record<string, string | number | boolean>;

  contentImageSize: ContentImageSize;
  setContentImageSize: (s: ContentImageSize) => void;
  contentImagePreview: string;
  handleAddContentImage: (url: string, alt?: string) => void;

  manualImageUrl: string;
  manualImageAlt: string;
  setManualImageUrl: (v: string) => void;
  setManualImageAlt: (v: string) => void;
  handleAddManualImage: () => void;

  setValues: React.Dispatch<React.SetStateAction<CustomPageFormValues>>;
};

export const CustomPageSidebarColumn: React.FC<Props> = ({
  disabled,
  imageMetadata,
  contentImageSize,
  setContentImageSize,
  contentImagePreview,
  handleAddContentImage,
  manualImageUrl,
  manualImageAlt,
  setManualImageUrl,
  setManualImageAlt,
  handleAddManualImage,
}) => {
  const t = useAdminT();

  return (
    <div className="rounded-lg border bg-card p-3 space-y-3">
      <h3 className="text-xs font-medium">İçeriğe Görsel Ekle</h3>

      <div>
        <label className="mb-1 block text-[10px] text-muted-foreground">Boyut</label>
        <select
          className="w-full rounded-md border bg-background px-2 py-1.5 text-xs"
          value={contentImageSize}
          onChange={(e) => setContentImageSize(e.target.value as ContentImageSize)}
          disabled={disabled}
        >
          <option value="sm">Küçük</option>
          <option value="md">Orta</option>
          <option value="lg">Büyük</option>
          <option value="full">Tam Genişlik</option>
        </select>
      </div>

      <AdminImageUploadField
        label="Görsel Yükle"
        bucket="public"
        folder="custom_pages/content"
        metadata={{ ...(imageMetadata || {}), section: 'content' }}
        value={contentImagePreview}
        onChange={(url) => handleAddContentImage(url)}
        disabled={disabled}
        openLibraryHref="/admin/storage"
        previewAspect="16x9"
        previewObjectFit="cover"
      />

      <div className="space-y-1.5">
        <label className="block text-[10px] text-muted-foreground">Manuel Görsel URL</label>
        <input
          type="url"
          className="h-7 w-full rounded-md border bg-background px-2 text-xs"
          placeholder="https://..."
          value={manualImageUrl}
          onChange={(e) => setManualImageUrl(e.target.value)}
          disabled={disabled}
        />
        <input
          type="text"
          className="h-7 w-full rounded-md border bg-background px-2 text-xs"
          placeholder="Alt metin (opsiyonel)"
          value={manualImageAlt}
          onChange={(e) => setManualImageAlt(e.target.value)}
          disabled={disabled}
        />
        <button
          type="button"
          className="rounded-md border px-2 py-1 text-[10px] disabled:opacity-60"
          onClick={handleAddManualImage}
          disabled={disabled}
        >
          Serbest URL'yi İçeriğe Ekle
        </button>
      </div>
    </div>
  );
};
