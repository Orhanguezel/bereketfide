
// =============================================================
// FILE: contact-info-structured-form.tsx
// Bereket Fide — contact_info structured editor
// =============================================================

"use client";

import React from "react";
import { z } from "zod";
import { useAdminTranslations } from "@/i18n";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const contactInfoSchema = z
  .object({
    company_name: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    phone_2: z.string().trim().optional(),
    email: z.string().trim().optional(),
    email_2: z.string().trim().optional(),
    address: z.string().trim().optional(),
    city: z.string().trim().optional(),
    country: z.string().trim().optional(),
    working_hours: z.string().trim().optional(),
    maps_embed_url: z.string().trim().optional(),
    maps_lat: z.string().trim().optional(),
    maps_lng: z.string().trim().optional(),
  })
  .passthrough();

export type ContactInfoFormState = z.infer<typeof contactInfoSchema>;

export type ContactInfoStructuredFormProps = {
  value: any;
  onChange: (next: ContactInfoFormState) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
  seed?: ContactInfoFormState;
};

const safeObj = (v: any) => (v && typeof v === "object" && !Array.isArray(v) ? v : null);

const EMPTY_SEED: ContactInfoFormState = {
  company_name: "",
  phone: "",
  phone_2: "",
  email: "",
  email_2: "",
  address: "",
  city: "",
  country: "",
  working_hours: "",
  maps_embed_url: "",
  maps_lat: "",
  maps_lng: "",
};

export function contactObjToForm(v: any, seed: ContactInfoFormState): ContactInfoFormState {
  const base = safeObj(v) || seed;
  const parsed = contactInfoSchema.safeParse(base);
  return parsed.success ? parsed.data : seed;
}

export function contactFormToObj(s: ContactInfoFormState) {
  return contactInfoSchema.parse({
    company_name: s.company_name?.trim() || "",
    phone: s.phone?.trim() || "",
    phone_2: s.phone_2?.trim() || "",
    email: s.email?.trim() || "",
    email_2: s.email_2?.trim() || "",
    address: s.address?.trim() || "",
    city: s.city?.trim() || "",
    country: s.country?.trim() || "",
    working_hours: s.working_hours?.trim() || "",
    maps_embed_url: s.maps_embed_url?.trim() || "",
    maps_lat: s.maps_lat?.trim() || "",
    maps_lng: s.maps_lng?.trim() || "",
  });
}

export const ContactInfoStructuredForm: React.FC<ContactInfoStructuredFormProps> = ({
  value,
  onChange,
  errors,
  disabled,
  seed,
}) => {
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const t = useAdminTranslations(adminLocale || undefined);

  const s = (seed || EMPTY_SEED) as ContactInfoFormState;
  const form = contactObjToForm(value, s);

  const field = (key: keyof ContactInfoFormState, label: string, opts?: { colSpan2?: boolean; textarea?: boolean }) => (
    <div className={`space-y-2 ${opts?.colSpan2 ? 'md:col-span-2' : ''}`} key={key}>
      <Label htmlFor={`contact-${key}`} className="text-sm">{label}</Label>
      {opts?.textarea ? (
        <Textarea
          id={`contact-${key}`}
          rows={3}
          value={(form[key] as string) || ""}
          onChange={(e) => onChange({ ...form, [key]: e.target.value })}
          disabled={disabled}
          className="text-sm"
        />
      ) : (
        <Input
          id={`contact-${key}`}
          className="h-8"
          value={(form[key] as string) || ""}
          onChange={(e) => onChange({ ...form, [key]: e.target.value })}
          disabled={disabled}
        />
      )}
      {errors?.[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="space-y-4">
      <Alert variant="default" className="py-2">
        <AlertDescription className="text-sm">
          {t("admin.siteSettings.structured.contact.description")}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {field("company_name", t("admin.siteSettings.structured.contact.labels.companyName"), { colSpan2: true })}
        {field("phone", t("admin.siteSettings.structured.contact.labels.phone"))}
        {field("phone_2", t("admin.siteSettings.structured.contact.labels.phone2"))}
        {field("email", t("admin.siteSettings.structured.contact.labels.email"))}
        {field("email_2", t("admin.siteSettings.structured.contact.labels.email2"))}
        {field("address", t("admin.siteSettings.structured.contact.labels.address"), { colSpan2: true, textarea: true })}
        {field("city", t("admin.siteSettings.structured.contact.labels.city"))}
        {field("country", t("admin.siteSettings.structured.contact.labels.country"))}
        {field("working_hours", t("admin.siteSettings.structured.contact.labels.workingHours"), { colSpan2: true })}
        {field("maps_embed_url", t("admin.siteSettings.structured.contact.labels.mapsEmbedUrl"), { colSpan2: true })}
        {field("maps_lat", t("admin.siteSettings.structured.contact.labels.mapsLat"))}
        {field("maps_lng", t("admin.siteSettings.structured.contact.labels.mapsLng"))}
      </div>
    </div>
  );
};

ContactInfoStructuredForm.displayName = "ContactInfoStructuredForm";
