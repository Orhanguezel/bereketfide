'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import api from '@/lib/axios';

export function OfferFormClient({
  locale,
  preselectedProduct,
}: {
  locale: string;
  preselectedProduct?: string;
}) {
  const t = useTranslations('offer.form');
  const tc = useTranslations('common');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    try {
      await api.post('/offers', {
        customer_name: fd.get('name'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        company_name: fd.get('company'),
        subject: fd.get('product_interest'),
        message: fd.get('details'),
        source: 'bereketfide',
        locale,
        form_data: {
          project_type: fd.get('product_interest'),
          estimated_area: fd.get('quantity'),
          preferred_deadline: fd.get('deadline'),
        },
      });
      toast.success(t('success'));
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error(t('error'));
    } finally {
      setSending(false);
    }
  }

  const cls = 'w-full rounded border border-[#ccc] bg-white px-4 py-3 text-sm text-[#333] placeholder-[#999] outline-none focus:border-[#946e1c] focus:ring-1 focus:ring-[#946e1c]/30';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder={tc('name')} className={cls} />
        <input name="email" type="email" required placeholder={tc('email')} className={cls} />
        <input name="phone" placeholder={tc('phone')} className={cls} />
        <input name="company" placeholder={tc('company')} className={cls} />
      </div>
      <input
        name="product_interest"
        defaultValue={preselectedProduct || ''}
        placeholder={t('productInterest')}
        className={cls}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="quantity" placeholder={t('quantity')} className={cls} />
        <input name="deadline" placeholder={t('deadline')} className={cls} />
      </div>
      <textarea
        name="details"
        rows={5}
        placeholder={t('detailsPlaceholder')}
        className={cls}
        style={{ resize: 'vertical' }}
      />
      <button
        type="submit"
        disabled={sending}
        className="btn-primary w-full rounded-lg px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-50"
      >
        {sending ? tc('loading') : t('submit')}
      </button>
    </form>
  );
}
