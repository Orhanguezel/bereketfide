// =============================================================
// hero-structured-form.tsx — Anasayfa hero video ve metin ayarları
// =============================================================

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdminImageUploadField } from "@/app/(main)/admin/_components/common/AdminImageUploadField";

/* ── types ── */

type HeroData = {
  video_desktop: string;
  video_mobile: string;
  video_poster: string;
  headline_tr: string;
  headline_en: string;
  subheadline_tr: string;
  subheadline_en: string;
  cta_text_tr: string;
  cta_text_en: string;
  cta_url: string;
};

export type HeroStructuredFormProps = {
  value: any;
  onChange: (next: HeroData) => void;
  disabled?: boolean;
};

/* ── helpers ── */

function toHero(v: any): HeroData {
  const o = v && typeof v === "object" && !Array.isArray(v) ? v : {};
  return {
    video_desktop: String(o.video_desktop ?? ""),
    video_mobile: String(o.video_mobile ?? ""),
    video_poster: String(o.video_poster ?? ""),
    headline_tr: String(o.headline_tr ?? ""),
    headline_en: String(o.headline_en ?? ""),
    subheadline_tr: String(o.subheadline_tr ?? ""),
    subheadline_en: String(o.subheadline_en ?? ""),
    cta_text_tr: String(o.cta_text_tr ?? ""),
    cta_text_en: String(o.cta_text_en ?? ""),
    cta_url: String(o.cta_url ?? ""),
  };
}

export function heroObjToForm(v: any): HeroData {
  return toHero(v);
}

export function heroFormToObj(v: HeroData): HeroData {
  return v;
}

/* ── component ── */

export const HeroStructuredForm: React.FC<HeroStructuredFormProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const hero = React.useMemo(() => toHero(value), [value]);
  const set = (patch: Partial<HeroData>) => onChange({ ...hero, ...patch });

  return (
    <div className="space-y-4">
      <Alert variant="default" className="py-2">
        <AlertDescription className="text-sm">
          Anasayfa hero bölümü videoları ve üzerindeki metin/buton ayarları.
        </AlertDescription>
      </Alert>

      {/* Video section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Videolar</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <AdminImageUploadField
              label="Masaüstü Video"
              helperText="16:9 yatay video (mp4). Dosya yükle veya URL yapıştır."
              bucket="public"
              folder="uploads/video"
              value={hero.video_desktop}
              onChange={(url) => set({ video_desktop: url })}
              disabled={disabled}
            />
            {hero.video_desktop && (
              <video
                src={hero.video_desktop}
                muted
                playsInline
                loop
                autoPlay
                className="mt-2 w-full rounded-md border aspect-video object-cover"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <AdminImageUploadField
              label="Mobil Video"
              helperText="9:16 dikey video (mp4). Dosya yükle veya URL yapıştır."
              bucket="public"
              folder="uploads/video"
              value={hero.video_mobile}
              onChange={(url) => set({ video_mobile: url })}
              disabled={disabled}
            />
            {hero.video_mobile && (
              <video
                src={hero.video_mobile}
                muted
                playsInline
                loop
                autoPlay
                className="mt-2 w-full max-w-[200px] rounded-md border aspect-[9/16] object-cover"
              />
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <AdminImageUploadField
            label="Video Poster (opsiyonel)"
            helperText="Video yüklenirken gösterilecek kapak görseli."
            bucket="public"
            folder="uploads/video"
            value={hero.video_poster}
            onChange={(url) => set({ video_poster: url })}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Text section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Metin ve Buton</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Başlık (TR)</Label>
            <Input
              value={hero.headline_tr}
              onChange={(e) => set({ headline_tr: e.target.value })}
              disabled={disabled}
              className="h-8"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Başlık (EN)</Label>
            <Input
              value={hero.headline_en}
              onChange={(e) => set({ headline_en: e.target.value })}
              disabled={disabled}
              className="h-8"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Alt Başlık (TR)</Label>
            <Textarea
              value={hero.subheadline_tr}
              onChange={(e) => set({ subheadline_tr: e.target.value })}
              disabled={disabled}
              rows={2}
              className="text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Alt Başlık (EN)</Label>
            <Textarea
              value={hero.subheadline_en}
              onChange={(e) => set({ subheadline_en: e.target.value })}
              disabled={disabled}
              rows={2}
              className="text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Buton Metni (TR)</Label>
            <Input
              value={hero.cta_text_tr}
              onChange={(e) => set({ cta_text_tr: e.target.value })}
              disabled={disabled}
              className="h-8"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Buton Metni (EN)</Label>
            <Input
              value={hero.cta_text_en}
              onChange={(e) => set({ cta_text_en: e.target.value })}
              disabled={disabled}
              className="h-8"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs text-muted-foreground">Buton Linki</Label>
            <Input
              value={hero.cta_url}
              onChange={(e) => set({ cta_url: e.target.value })}
              disabled={disabled}
              className="h-8"
              placeholder="/projeler"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

HeroStructuredForm.displayName = "HeroStructuredForm";
