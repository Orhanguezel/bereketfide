import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata, localizedPath } from '@/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dealerPayment' });
  return buildPageMetadata({
    locale,
    pathname: '/bayi-odeme',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function BayiOdemePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dealerPayment' });

  const directPaymentTarget = `${localizedPath(locale, '/bayi/finans')}?focus=direct-payment`;
  const directPaymentHref = `${localizedPath(locale, '/bayi-girisi')}?next=${encodeURIComponent(
    directPaymentTarget,
  )}`;
  const financeHref = `${localizedPath(locale, '/bayi-girisi')}?next=${encodeURIComponent(
    localizedPath(locale, '/bayi/finans'),
  )}`;

  return (
    <main className="bg-(--color-bg)">
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(184,146,44,0.18), transparent 28%), linear-gradient(135deg, #111712 0%, #1b2518 48%, #233222 100%)',
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              {t('eyebrow')}
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/78 md:text-lg">
              {t('subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={directPaymentHref}
                className="rounded-xl bg-(--color-brand) px-5 py-3 text-sm font-semibold text-(--color-on-brand) transition-opacity hover:opacity-90"
              >
                {t('ctaDirect')}
              </Link>
              <Link
                href={financeHref}
                className="rounded-xl border border-white/18 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/12"
              >
                {t('ctaBalance')}
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur">
            <div className="grid gap-4">
              {['stepOne', 'stepTwo', 'stepThree'].map((key, index) => (
                <div
                  key={key}
                  className="rounded-2xl border border-white/10 bg-black/10 p-4 text-white"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-brand-light)">
                    0{index + 1}
                  </div>
                  <div className="mt-2 text-lg font-semibold">
                    {t(`${key}.title`)}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/72">
                    {t(`${key}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-[28px] border border-(--color-border) bg-(--color-bg-secondary) p-7 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-(--color-brand)">
              {t('cardDirect.eyebrow')}
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-(--color-text-primary)">
              {t('cardDirect.title')}
            </h2>
            <p className="mt-3 text-sm leading-7 text-(--color-text-secondary)">
              {t('cardDirect.desc')}
            </p>
            <ul className="mt-5 space-y-3 text-sm text-(--color-text-secondary)">
              <li>{t('cardDirect.item1')}</li>
              <li>{t('cardDirect.item2')}</li>
              <li>{t('cardDirect.item3')}</li>
            </ul>
            <Link
              href={directPaymentHref}
              className="mt-6 inline-flex rounded-xl bg-(--color-brand) px-5 py-3 text-sm font-semibold text-(--color-on-brand)"
            >
              {t('cardDirect.cta')}
            </Link>
          </article>

          <article className="rounded-[28px] border border-(--color-border) bg-(--color-bg-secondary) p-7 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-(--color-brand)">
              {t('cardBalance.eyebrow')}
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-(--color-text-primary)">
              {t('cardBalance.title')}
            </h2>
            <p className="mt-3 text-sm leading-7 text-(--color-text-secondary)">
              {t('cardBalance.desc')}
            </p>
            <ul className="mt-5 space-y-3 text-sm text-(--color-text-secondary)">
              <li>{t('cardBalance.item1')}</li>
              <li>{t('cardBalance.item2')}</li>
              <li>{t('cardBalance.item3')}</li>
            </ul>
            <Link
              href={financeHref}
              className="mt-6 inline-flex rounded-xl border border-(--color-border-strong) px-5 py-3 text-sm font-semibold text-(--color-text-primary)"
            >
              {t('cardBalance.cta')}
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
