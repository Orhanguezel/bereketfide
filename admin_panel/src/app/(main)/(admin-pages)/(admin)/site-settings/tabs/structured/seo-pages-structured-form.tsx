// =============================================================
// FILE: seo-pages-structured-form.tsx
// Bereket Fide — Sayfa bazlı SEO yönetimi (seo_pages)
// =============================================================

"use client";

import React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ── types ── */

type PageSeo = {
  title: string;
  description: string;
  og_image: string;
  no_index: boolean;
};

type SeoPages = Record<string, PageSeo>;

export type SeoPagesStructuredFormProps = {
  value: any;
  onChange: (next: SeoPages) => void;
  disabled?: boolean;
};

/* ── page config ── */

const PAGE_CONFIG: { key: string; label: string; path: string }[] = [
  { key: "home", label: "Anasayfa", path: "/" },
  { key: "projeler", label: "Projeler", path: "/projeler" },
  { key: "hizmetler", label: "Hizmetler", path: "/hizmetler" },
  { key: "galeri", label: "Galeri", path: "/galeri" },
  { key: "haberler", label: "Haberler", path: "/haberler" },
  { key: "hakkimizda", label: "Hakkımızda", path: "/hakkimizda" },
  { key: "iletisim", label: "İletişim", path: "/iletisim" },
  { key: "teklif", label: "Teklif", path: "/teklif" },
  { key: "legal_privacy", label: "Gizlilik Politikası", path: "/legal/privacy" },
  { key: "legal_terms", label: "Kullanım Koşulları", path: "/legal/terms" },
];

/* ── helpers ── */

function toSeoPages(v: any): SeoPages {
  if (!v || typeof v !== "object" || Array.isArray(v)) return {};
  const result: SeoPages = {};
  for (const cfg of PAGE_CONFIG) {
    const page = v[cfg.key];
    result[cfg.key] = {
      title: String(page?.title ?? ""),
      description: String(page?.description ?? ""),
      og_image: String(page?.og_image ?? ""),
      no_index: Boolean(page?.no_index),
    };
  }
  return result;
}

export function seoPagesObjToForm(v: any): SeoPages {
  return toSeoPages(v);
}

export function seoPagesFormToObj(v: SeoPages): SeoPages {
  return v;
}

/* ── component ── */

export const SeoPagesStructuredForm: React.FC<SeoPagesStructuredFormProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const pages = React.useMemo(() => toSeoPages(value), [value]);

  const updatePage = (key: string, patch: Partial<PageSeo>) => {
    const next = { ...pages };
    next[key] = { ...next[key], ...patch };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <Alert variant="default" className="py-2">
        <AlertDescription className="text-sm">
          Her sayfanın SEO başlığı, açıklaması ve OG görseli. Bu bilgiler Google arama sonuçlarında ve sosyal medya paylaşımlarında görünür.
        </AlertDescription>
      </Alert>

      <Accordion type="multiple" className="w-full" defaultValue={["home"]}>
        {PAGE_CONFIG.map((cfg) => {
          const page = pages[cfg.key] || { title: "", description: "", og_image: "", no_index: false };

          return (
            <AccordionItem key={cfg.key} value={cfg.key}>
              <AccordionTrigger className="text-sm hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{cfg.label}</span>
                  <span className="text-xs text-muted-foreground">{cfg.path}</span>
                  {page.no_index && (
                    <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] text-destructive">
                      noindex
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs text-muted-foreground">Başlık (title)</Label>
                    <Input
                      value={page.title}
                      onChange={(e) => updatePage(cfg.key, { title: e.target.value })}
                      disabled={disabled}
                      className="h-8"
                      placeholder="Sayfa başlığı"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs text-muted-foreground">Açıklama (description)</Label>
                    <Textarea
                      value={page.description}
                      onChange={(e) => updatePage(cfg.key, { description: e.target.value })}
                      disabled={disabled}
                      rows={2}
                      className="text-sm"
                      placeholder="Sayfa açıklaması (max 155 karakter)"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      {page.description.length}/155 karakter
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">OG Image URL</Label>
                    <Input
                      value={page.og_image}
                      onChange={(e) => updatePage(cfg.key, { og_image: e.target.value })}
                      disabled={disabled}
                      className="h-8"
                      placeholder="/logo/bereket_logo_512.png"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Switch
                      checked={page.no_index}
                      onCheckedChange={(v) => updatePage(cfg.key, { no_index: v })}
                      disabled={disabled}
                    />
                    <Label className="text-xs">noindex (arama motorlarından gizle)</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

SeoPagesStructuredForm.displayName = "SeoPagesStructuredForm";
