import 'server-only';

import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { OfferFormClient } from '@/components/sections/OfferForm';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';

const HERO_IMAGE = '/uploads/inventory-seeds/urun-07-on.jpg';
const PRODUCT_IMAGES = [
  '/uploads/inventory-seeds/urun-07-on.jpg',
  '/uploads/inventory-seeds/urun-42-on.jpg',
  '/uploads/inventory-seeds/urun-02-on.jpg',
  '/uploads/inventory-seeds/urun-01-on.jpg',
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale.startsWith('en');

  return buildPageMetadata({
    locale,
    pathname: '/kampanya/sebze-tohumu-biber-tohumu',
    title: isEn ? 'Vegetable and Pepper Seed Quote' : 'Sebze Tohumu ve Biber Tohumu Teklifi',
    description: isEn
      ? 'Request a quote for vegetable seed, pepper seed and seedling production needs from Bereket Fide.'
      : 'Sebze tohumu, biber tohumu ve fide üretim ihtiyaçlarınız için Bereket Fide ekibinden hızlı teklif alın.',
    ogImage: HERO_IMAGE,
  });
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isEn = locale.startsWith('en');

  const title = isEn ? 'Vegetable and pepper seed supply' : 'Sebze tohumu ve biber tohumu tedariki';
  const intro = isEn
    ? 'For growers planning pepper, tomato, cucumber and seasonal vegetable production, Bereket Fide collects your variety, quantity and timing needs in one place and routes them to the sales team.'
    : 'Biber, domates, hıyar ve sezonluk sebze üretimi planlayan üreticiler için çeşit, miktar ve teslim zamanı ihtiyacınızı tek formda alıp satış ekibine yönlendiriyoruz.';

  const highlights = isEn
    ? ['Pepper and vegetable varieties', 'Seedling production planning', 'Bulk order and season timing', 'Technical guidance before ordering']
    : ['Biber ve sebze çeşitleri', 'Fide üretim planlaması', 'Toplu alım ve sezon takvimi', 'Sipariş öncesi teknik yönlendirme'];

  const steps = isEn
    ? ['Share the variety or crop group.', 'Add quantity and target delivery date.', 'The sales team returns with current availability and next steps.']
    : ['Çeşit veya ürün grubunu paylaşın.', 'Miktar ve hedef teslim tarihini ekleyin.', 'Satış ekibi güncel uygunluk ve sonraki adımlarla dönüş yapsın.'];

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
      <JsonLd
        data={jsonld.graph([
          jsonld.collectionPage({
            name: title,
            description: intro,
            url: localizedUrl(locale, '/kampanya/sebze-tohumu-biber-tohumu'),
          }),
        ])}
      />

      <section
        style={{
          minHeight: 'min(720px, 88vh)',
          display: 'grid',
          alignItems: 'end',
          backgroundImage: `linear-gradient(90deg, rgba(18, 28, 21, .88), rgba(18, 28, 21, .5), rgba(18, 28, 21, .18)), url("${HERO_IMAGE}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: 1280, margin: '0 auto', padding: '24px 16px 56px' }}>
          <Breadcrumbs
            items={[
              { label: 'Bereket Fide', href: localizedPath(locale, '/') },
              { label: isEn ? 'Campaign' : 'Kampanya' },
            ]}
          />
          <div style={{ maxWidth: 780, paddingTop: 96 }}>
            <p style={{ color: 'var(--color-brand)', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em' }}>
              {isEn ? 'Season planning' : 'Sezon planlama'}
            </p>
            <h1 style={{ marginTop: 14, fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 1, fontWeight: 900, letterSpacing: 0, color: '#fff' }}>
              {title}
            </h1>
            <p style={{ marginTop: 22, maxWidth: 680, fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,.88)' }}>
              {intro}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32 }}>
              <Link className="btn-primary rounded-lg px-6 py-3 text-sm font-bold" href="#teklif-formu">
                {isEn ? 'Request quote' : 'Teklif al'}
              </Link>
              <Link className="rounded-lg border border-white/35 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10" href={localizedPath(locale, '/urunler')}>
                {t('nav.products')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '44px 16px 20px' }}>
        <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {highlights.map((item) => (
            <div key={item} className="surface-card rounded-lg border border-(--color-border) p-5">
              <p style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 16px 72px' }}>
        <div style={{ display: 'grid', gap: 34, gridTemplateColumns: 'minmax(0, 1fr)', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {PRODUCT_IMAGES.map((src, index) => (
              <figure key={src} style={{ margin: 0 }}>
                <img
                  src={src}
                  alt={isEn ? `Vegetable seed package ${index + 1}` : `Sebze tohumu paketi ${index + 1}`}
                  style={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', borderRadius: 8, border: '1px solid var(--color-border)' }}
                />
              </figure>
            ))}
          </div>

          <div id="teklif-formu" style={{ display: 'grid', gap: 28, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', alignItems: 'start' }}>
            <div>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 32, lineHeight: 1.15, fontWeight: 900 }}>
                {isEn ? 'Send your request to the sales team' : 'Talebinizi satış ekibine iletin'}
              </h2>
              <ol style={{ margin: '22px 0 0', paddingLeft: 22, display: 'grid', gap: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                {steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <p style={{ marginTop: 22, color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                {isEn
                  ? 'Use the product field for pepper seed, vegetable seed or the exact variety name. If the request should be fulfilled as seedling production, the team will guide you accordingly.'
                  : 'Ürün alanına biber tohumu, sebze tohumu veya aradığınız çeşit adını yazın. Talep fide üretimi olarak planlanacaksa ekip uygun şekilde yönlendirecektir.'}
              </p>
            </div>
            <div className="surface-card rounded-lg border border-(--color-border) p-5">
              <OfferFormClient locale={locale} preselectedProduct={isEn ? 'Vegetable / pepper seed' : 'Sebze tohumu / biber tohumu'} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
