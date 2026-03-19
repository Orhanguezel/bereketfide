'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import api from '@/lib/axios';

export function ContactFormClient({ locale }: { locale: string }) {
  const t = useTranslations('contact.form');
  const tc = useTranslations('common');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    try {
      await api.post('/contacts', {
        name: fd.get('name'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        company: fd.get('company'),
        subject: fd.get('subject'),
        message: fd.get('message'),
        source: 'bereketfide',
        locale,
      });
      toast.success(t('success'));
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error(t('error'));
    } finally {
      setSending(false);
    }
  }

  const cls = 'w-full rounded-xl border border-(--color-border) bg-(--color-bg-muted)/50 px-4 py-3.5 text-sm text-(--color-text-primary) placeholder-(--color-text-muted) outline-none transition-all duration-300 focus:border-(--color-brand) focus:bg-(--color-surface) focus:shadow-lg focus:shadow-(--color-brand)/5';

  return (
    <form onSubmit={handleSubmit} className="surface-card space-y-6 rounded-2xl p-8 border border-(--color-border) shadow-sm">
      <h2 className="text-2xl font-bold font-heading text-(--color-text-primary)">{t('title')}</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <input name="name" required placeholder={t('namePlaceholder')} className={cls} />
        <input name="email" type="email" required placeholder={t('emailPlaceholder')} className={cls} />
        <input name="phone" placeholder={t('phonePlaceholder')} className={cls} />
        <input name="company" placeholder={t('companyPlaceholder')} className={cls} />
      </div>
      <input name="subject" placeholder={t('subjectPlaceholder')} className={cls} />
      <textarea
        name="message"
        required
        rows={6}
        placeholder={t('messagePlaceholder')}
        className={cls}
        style={{ resize: 'vertical' }}
      />
      <div className="pt-4">
        <button
          type="submit"
          disabled={sending}
          className="btn-primary w-full rounded-xl px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-(--color-brand)/10"
        >
          {sending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {tc('loading')}
            </>
          ) : t('submit')}
        </button>
      </div>
    </form>
  );
}
