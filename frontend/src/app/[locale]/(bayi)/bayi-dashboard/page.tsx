import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { localizedPath } from '@/seo/helpers';

export default async function BayiDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.panel.dashboard' });
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-2xl font-semibold text-(--color-text-primary)">{t('title')}</h1>
        <p className="text-(--color-text-secondary)">{t('lead')}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { href: '/panel/siparisler', title: t('cards.orders.title'), body: t('cards.orders.body'), cta: t('cards.orders.cta') },
          { href: '/panel/ekstralar', title: t('cards.extras.title'), body: t('cards.extras.body'), cta: t('cards.extras.cta') },
          { href: '/bayi/finans', title: t('cards.finance.title'), body: t('cards.finance.body'), cta: t('cards.finance.cta') },
        ].map((card) => (
          <Link
            key={card.href}
            href={localizedPath(locale, card.href)}
            className="rounded-2xl border p-5 transition-colors hover:border-(--color-brand)"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
          >
            <h2 className="text-base font-semibold text-(--color-text-primary)">{card.title}</h2>
            <p className="mt-2 min-h-14 text-sm leading-6 text-(--color-text-secondary)">{card.body}</p>
            <div className="mt-5 text-sm font-semibold text-(--color-brand)">{card.cta}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
