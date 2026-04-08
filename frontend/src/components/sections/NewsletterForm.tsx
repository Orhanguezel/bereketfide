'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import api from '@/lib/axios';

const SEGMENTS = ['urunler', 'haberler', 'bilgi-bankasi'] as const;
type Segment = (typeof SEGMENTS)[number];

export function NewsletterForm({ locale }: { locale: string }) {
  const t = useTranslations('home.newsletter');
  const tCommon = useTranslations('common');
  const [sending, setSending] = useState(false);
  const [selected, setSelected] = useState<Set<Segment>>(new Set());

  function toggleSegment(seg: Segment) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(seg) ? next.delete(seg) : next.add(seg);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    try {
      await api.post('/newsletter/subscribe', {
        email: fd.get('email'),
        source: 'bereketfide',
        locale,
        segments: Array.from(selected),
      });
      toast.success(t('success'));
      (e.target as HTMLFormElement).reset();
      setSelected(new Set());
    } catch {
      toast.error(t('error'));
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Segment checkboxes */}
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          {t('segmentsLabel')}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SEGMENTS.map((seg) => (
            <label
              key={seg}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                padding: '4px 10px',
                border: `1px solid ${selected.has(seg) ? 'var(--color-brand)' : 'var(--color-border)'}`,
                borderRadius: 2,
                color: selected.has(seg) ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                background: selected.has(seg) ? 'color-mix(in srgb, var(--color-brand) 8%, transparent)' : 'transparent',
                transition: 'all .15s',
              }}
            >
              <input
                type="checkbox"
                style={{ display: 'none' }}
                checked={selected.has(seg)}
                onChange={() => toggleSegment(seg)}
              />
              {t(`seg_${seg}` as any)}
            </label>
          ))}
        </div>
      </div>

      {/* Email + submit */}
      <div className="mt-2 flex gap-2">
        <input
          name="email"
          type="email"
          placeholder={t('placeholder')}
          className="field-input flex-1 rounded-lg px-4 py-2.5 text-sm focus:border-(--color-brand) focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={sending}
          className="btn-primary rounded-lg px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {sending ? tCommon('sending') : t('subscribe')}
        </button>
      </div>
    </form>
  );
}
