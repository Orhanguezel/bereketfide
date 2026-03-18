// =============================================================
// FILE: ui-header-structured-form.tsx
// Menü başlıkları ve buton etiketleri
// =============================================================

'use client';

import React from 'react';
import { z } from 'zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const uiHeaderSchema = z
  .object({
    nav_home: z.string().trim().optional(),
    nav_products: z.string().trim().optional(),
    nav_services: z.string().trim().optional(),
    nav_gallery: z.string().trim().optional(),
    nav_news: z.string().trim().optional(),
    nav_about: z.string().trim().optional(),
    nav_contact: z.string().trim().optional(),
    cta_label: z.string().trim().optional(),
  })
  .passthrough();

export type UiHeaderFormState = z.infer<typeof uiHeaderSchema>;

export type UiHeaderStructuredFormProps = {
  value: any;
  onChange: (next: UiHeaderFormState) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
  seed?: UiHeaderFormState;
};

const safeObj = (v: any) => (v && typeof v === 'object' && !Array.isArray(v) ? v : null);

const EMPTY_SEED: UiHeaderFormState = {
  nav_home: '',
  nav_products: '',
  nav_services: '',
  nav_gallery: '',
  nav_news: '',
  nav_about: '',
  nav_contact: '',
  cta_label: '',
};

export function uiHeaderObjToForm(v: any, seed: UiHeaderFormState): UiHeaderFormState {
  const base = safeObj(v) || seed;
  const parsed = uiHeaderSchema.safeParse(base);
  return parsed.success ? parsed.data : seed;
}

export function uiHeaderFormToObj(s: UiHeaderFormState) {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(s)) {
    result[k] = typeof v === 'string' ? v.trim() : '';
  }
  return result;
}

const FIELDS: { key: keyof UiHeaderFormState; label: string }[] = [
  { key: 'nav_home', label: 'Ana Sayfa' },
  { key: 'nav_products', label: 'Projeler' },
  { key: 'nav_services', label: 'Hizmetler' },
  { key: 'nav_gallery', label: 'Galeri' },
  { key: 'nav_news', label: 'Haberler' },
  { key: 'nav_about', label: 'Hakkımızda' },
  { key: 'nav_contact', label: 'İletişim' },
  { key: 'cta_label', label: 'CTA Butonu' },
];

export const UiHeaderStructuredForm: React.FC<UiHeaderStructuredFormProps> = ({
  value,
  onChange,
  errors,
  disabled,
  seed,
}) => {
  const s = (seed || EMPTY_SEED) as UiHeaderFormState;
  const form = uiHeaderObjToForm(value, s);

  return (
    <div className="space-y-4">
      <Alert variant="default" className="py-2">
        <AlertDescription className="text-sm">
          Navigasyon menüsü etiketleri ve CTA buton metni. Seçili dile göre düzenlenir.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {FIELDS.map((f) => (
          <div className="space-y-1" key={f.key}>
            <Label htmlFor={`ui-header-${f.key}`} className="text-xs text-muted-foreground">{f.label}</Label>
            <Input
              id={`ui-header-${f.key}`}
              className="h-8"
              value={(form[f.key] as string) || ''}
              onChange={(e) => onChange({ ...form, [f.key]: e.target.value })}
              disabled={disabled}
            />
            {errors?.[f.key] && <p className="text-xs text-destructive">{errors[f.key]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

UiHeaderStructuredForm.displayName = 'UiHeaderStructuredForm';
