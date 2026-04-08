import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { fetchSetting } from '@/i18n/server';
import { fetchSeoPage } from '@/seo/server';

// Türkiye iklim bölgeleri
const REGIONS_TR = [
  { id: 'akdeniz', name: 'Akdeniz', provinces: 'Antalya, Mersin, Adana, Hatay, Osmaniye' },
  { id: 'ege', name: 'Ege', provinces: 'İzmir, Muğla, Aydın, Denizli, Manisa' },
  { id: 'marmara', name: 'Marmara', provinces: 'İstanbul, Bursa, Balıkesir, Tekirdağ, Çanakkale' },
  { id: 'ic-anadolu', name: 'İç Anadolu', provinces: 'Ankara, Konya, Eskişehir, Kayseri, Sivas' },
  { id: 'karadeniz', name: 'Karadeniz', provinces: 'Samsun, Trabzon, Zonguldak, Ordu, Giresun' },
  { id: 'dogu-anadolu', name: 'Doğu Anadolu', provinces: 'Erzurum, Van, Malatya, Elazığ, Ağrı' },
  { id: 'guneydogu', name: 'Güneydoğu', provinces: 'Gaziantep, Şanlıurfa, Diyarbakır, Mardin' },
];

const REGIONS_EN = [
  { id: 'akdeniz', name: 'Mediterranean', provinces: 'Antalya, Mersin, Adana, Hatay, Osmaniye' },
  { id: 'ege', name: 'Aegean', provinces: 'İzmir, Muğla, Aydın, Denizli, Manisa' },
  { id: 'marmara', name: 'Marmara', provinces: 'Istanbul, Bursa, Balıkesir, Tekirdağ, Çanakkale' },
  { id: 'ic-anadolu', name: 'Central Anatolia', provinces: 'Ankara, Konya, Eskişehir, Kayseri, Sivas' },
  { id: 'karadeniz', name: 'Black Sea', provinces: 'Samsun, Trabzon, Zonguldak, Ordu, Giresun' },
  { id: 'dogu-anadolu', name: 'Eastern Anatolia', provinces: 'Erzurum, Van, Malatya, Elazığ, Ağrı' },
  { id: 'guneydogu', name: 'Southeastern', provinces: 'Gaziantep, Şanlıurfa, Diyarbakır, Mardin' },
];

const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Bölgeye göre statik ekim takvimi verisi
// Her bitki için dikim ayları (1-12)
const CALENDAR: Record<string, Record<string, number[]>> = {
  akdeniz: {
    'Domates Fidesi':     [1, 2, 8, 9, 10],
    'Biber Fidesi':       [1, 2, 8, 9],
    'Patlıcan Fidesi':    [1, 2, 8, 9],
    'Hıyar Fidesi':       [2, 3, 8, 9],
    'Kavun Fidesi':       [2, 3, 4],
    'Karpuz Fidesi':      [3, 4, 5],
    'Kabak Fidesi':       [2, 3, 9, 10],
    'Marul Fidesi':       [9, 10, 11],
    'Brokoli Fidesi':     [8, 9, 10],
    'Karnabahar Fidesi':  [8, 9, 10],
  },
  ege: {
    'Domates Fidesi':     [2, 3, 8, 9],
    'Biber Fidesi':       [2, 3, 8, 9],
    'Patlıcan Fidesi':    [2, 3, 8, 9],
    'Hıyar Fidesi':       [3, 4, 8, 9],
    'Kavun Fidesi':       [3, 4, 5],
    'Karpuz Fidesi':      [4, 5],
    'Kabak Fidesi':       [3, 4, 9],
    'Marul Fidesi':       [2, 3, 9, 10],
    'Brokoli Fidesi':     [8, 9, 10],
    'Karnabahar Fidesi':  [8, 9, 10],
  },
  marmara: {
    'Domates Fidesi':     [3, 4, 8],
    'Biber Fidesi':       [3, 4],
    'Patlıcan Fidesi':    [3, 4],
    'Hıyar Fidesi':       [4, 5],
    'Kavun Fidesi':       [4, 5],
    'Karpuz Fidesi':      [5],
    'Kabak Fidesi':       [4, 5],
    'Marul Fidesi':       [3, 4, 9, 10],
    'Brokoli Fidesi':     [8, 9, 10],
    'Karnabahar Fidesi':  [8, 9, 10],
  },
  'ic-anadolu': {
    'Domates Fidesi':     [4, 5],
    'Biber Fidesi':       [4, 5],
    'Patlıcan Fidesi':    [4, 5],
    'Hıyar Fidesi':       [5, 6],
    'Kavun Fidesi':       [5, 6],
    'Karpuz Fidesi':      [5, 6],
    'Kabak Fidesi':       [5, 6],
    'Marul Fidesi':       [4, 5, 9],
    'Brokoli Fidesi':     [7, 8, 9],
    'Karnabahar Fidesi':  [7, 8, 9],
  },
  karadeniz: {
    'Domates Fidesi':     [4, 5],
    'Biber Fidesi':       [4, 5],
    'Patlıcan Fidesi':    [4, 5],
    'Hıyar Fidesi':       [5],
    'Kavun Fidesi':       [5, 6],
    'Karpuz Fidesi':      [5, 6],
    'Kabak Fidesi':       [5],
    'Marul Fidesi':       [4, 5, 9],
    'Brokoli Fidesi':     [7, 8, 9],
    'Karnabahar Fidesi':  [7, 8, 9],
  },
  'dogu-anadolu': {
    'Domates Fidesi':     [5, 6],
    'Biber Fidesi':       [5, 6],
    'Patlıcan Fidesi':    [5, 6],
    'Hıyar Fidesi':       [6],
    'Kavun Fidesi':       [6],
    'Karpuz Fidesi':      [6],
    'Kabak Fidesi':       [6],
    'Marul Fidesi':       [5, 9],
    'Brokoli Fidesi':     [7, 8],
    'Karnabahar Fidesi':  [7, 8],
  },
  guneydogu: {
    'Domates Fidesi':     [1, 2, 9, 10],
    'Biber Fidesi':       [1, 2, 9],
    'Patlıcan Fidesi':    [1, 2, 9],
    'Hıyar Fidesi':       [2, 3, 9],
    'Kavun Fidesi':       [3, 4],
    'Karpuz Fidesi':      [3, 4],
    'Kabak Fidesi':       [2, 3, 9],
    'Marul Fidesi':       [10, 11, 12],
    'Brokoli Fidesi':     [9, 10, 11],
    'Karnabahar Fidesi':  [9, 10, 11],
  },
};

async function fetchProducts(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products?item_type=bereketfide&is_active=1&locale=${locale}&limit=20`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await fetchSeoPage(locale, 'ekim-takvimi');
  const isEn = locale.startsWith('en');

  return buildPageMetadata({
    locale,
    pathname: '/ekim-takvimi',
    title: seo?.title || (isEn ? 'Planting Calendar' : 'Ekim Takvimi'),
    description:
      seo?.description ||
      (isEn
        ? 'Regional seedling planting calendar for Turkey. Find the best months to plant by region and vegetable type.'
        : 'Türkiye için bölgesel fide dikim takvimi. Bölgeye ve sebze türüne göre en uygun dikim aylarını bulun.'),
    ogImage: seo?.og_image || undefined,
  });
}

export default async function PlantingCalendarPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ bolge?: string }>;
}) {
  const { locale } = await params;
  const { bolge } = await searchParams;
  const t = await getTranslations({ locale });
  const isEn = locale.startsWith('en');

  const [profile, products] = await Promise.all([
    fetchSetting('company_profile', locale),
    fetchProducts(locale),
  ]);

  const regions = isEn ? REGIONS_EN : REGIONS_TR;
  const months = isEn ? MONTHS_EN : MONTHS_TR;
  const companyName = (profile?.value as any)?.company_name || 'Bereket Fide';
  const pageTitle = isEn ? 'Planting Calendar' : 'Ekim Takvimi';

  const activeRegion = regions.find((r) => r.id === bolge) || regions[0];
  const calendarData = CALENDAR[activeRegion.id] || {};

  // Current month (1-based)
  const currentMonth = new Date().getMonth() + 1;

  // Build product slug map for linking
  const productSlugMap: Record<string, string> = {};
  for (const p of products) {
    if (p.title && p.slug) {
      productSlugMap[p.title] = p.slug;
    }
  }

  return (
    <>
      <style>{`
        .ec-title{font-family:var(--font-heading);font-size:28px;font-weight:800;color:var(--color-text-primary);line-height:1.2;margin:0 0 8px}
        .ec-desc{font-size:15px;color:var(--color-text-secondary);line-height:1.6;margin-bottom:20px;max-width:680px}
        .ec-regions{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}
        .ec-region{display:inline-block;padding:8px 16px;border:1px solid var(--color-border);font-size:13px;font-weight:600;color:var(--color-text-primary);text-decoration:none;border-radius:2px;transition:all .15s;background:var(--color-bg-secondary)}
        .ec-region:hover{border-color:var(--color-brand);color:var(--color-brand)}
        .ec-region-active{border-color:var(--color-brand);background:var(--color-brand);color:var(--color-on-brand)}
        .ec-region-active:hover{background:var(--color-brand);color:var(--color-on-brand)}
        .ec-region-info{font-size:13px;color:var(--color-text-muted);margin-bottom:20px;padding:10px 14px;background:var(--color-bg-secondary);border-left:3px solid var(--color-brand)}
        .ec-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
        .ec-table{width:100%;border-collapse:collapse;min-width:700px}
        .ec-table th{padding:10px 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--color-text-muted);text-align:center;background:var(--color-bg-secondary);border-bottom:2px solid var(--color-border)}
        .ec-table th.ec-th-plant{text-align:left;min-width:160px}
        .ec-table td{padding:10px 8px;border-bottom:1px solid var(--color-border);font-size:13px;text-align:center;vertical-align:middle}
        .ec-table tr:hover td{background:var(--color-bg-secondary)}
        .ec-plant-name{font-weight:600;color:var(--color-text-primary);text-decoration:none;transition:color .15s;font-size:14px}
        .ec-plant-name:hover{color:var(--color-brand)}
        .ec-dot{width:28px;height:28px;border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;font-size:16px}
        .ec-dot-active{background:var(--color-brand)}
        .ec-dot-current{background:var(--color-brand);box-shadow:0 0 0 3px color-mix(in srgb,var(--color-brand) 30%,transparent)}
        .ec-month-current{background:color-mix(in srgb,var(--color-brand) 6%,transparent)}
        .ec-legend{display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-top:20px;font-size:13px;color:var(--color-text-muted)}
        .ec-legend-dot{width:16px;height:16px;border-radius:50%;flex-shrink:0}
        @media(min-width:1024px){.ec-layout{display:grid;grid-template-columns:1fr 260px;gap:40px}}
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>
        <JsonLd
          data={jsonld.graph([
            jsonld.collectionPage({
              name: pageTitle,
              description: isEn
                ? 'Regional seedling planting calendar for Turkey'
                : 'Türkiye bölgesel fide dikim takvimi',
              url: localizedUrl(locale, '/ekim-takvimi'),
            }),
            jsonld.dataset({
              name: isEn ? 'Turkey Seedling Planting Calendar' : 'Türkiye Fide Dikim Takvimi',
              description: isEn
                ? 'Monthly planting windows for vegetable seedlings across 7 climate regions of Turkey.'
                : 'Türkiye\'nin 7 iklim bölgesinde sebze fideleri için aylık dikim pencereleri.',
              url: localizedUrl(locale, '/ekim-takvimi'),
              temporalCoverage: String(new Date().getFullYear()),
              spatialCoverage: 'Turkey',
              keywords: Object.keys(CALENDAR.akdeniz),
              creator: 'Bereket Fide',
              variableMeasured: isEn ? 'Optimal seedling planting months by region' : 'Bölgeye göre optimum fide dikim ayları',
            }),
          ])}
        />

        <Breadcrumbs items={[
          { label: companyName, href: localizedPath(locale, '/') },
          { label: pageTitle },
        ]} />

        <h1 className="ec-title">{pageTitle}</h1>
        <p className="ec-desc">
          {isEn
            ? 'Select your region to see optimal planting months for each seedling type. Click a product to view details and request a quote.'
            : 'Bölgenizi seçerek her fide türü için en uygun dikim aylarını görün. Ürüne tıklayarak detay ve teklif sayfasına ulaşabilirsiniz.'}
        </p>

        {/* Region selector */}
        <div className="ec-regions">
          {regions.map((r) => (
            <Link
              key={r.id}
              href={localizedPath(locale, `/ekim-takvimi?bolge=${r.id}`)}
              className={`ec-region${activeRegion.id === r.id ? ' ec-region-active' : ''}`}
            >
              {r.name}
            </Link>
          ))}
        </div>

        <p className="ec-region-info">
          <b>{activeRegion.name}</b> — {activeRegion.provinces}
        </p>

        <div className="ec-layout">
          <div>
            <div className="ec-table-wrap">
              <table className="ec-table">
                <thead>
                  <tr>
                    <th className="ec-th-plant">{isEn ? 'Seedling' : 'Fide'}</th>
                    {months.map((m, i) => (
                      <th key={i} className={i + 1 === currentMonth ? 'ec-month-current' : ''}>
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(calendarData).map(([plantName, plantMonths]) => {
                    const slug = productSlugMap[plantName];
                    return (
                      <tr key={plantName}>
                        <td style={{ textAlign: 'left' }}>
                          {slug ? (
                            <Link
                              href={localizedPath(locale, `/urunler/${slug}`)}
                              className="ec-plant-name"
                            >
                              {plantName}
                            </Link>
                          ) : (
                            <span className="ec-plant-name">{plantName}</span>
                          )}
                        </td>
                        {months.map((_, i) => {
                          const month = i + 1;
                          const isPlanting = plantMonths.includes(month);
                          const isCurrent = month === currentMonth;
                          return (
                            <td key={i} className={isCurrent ? 'ec-month-current' : ''}>
                              {isPlanting && (
                                <div className={`ec-dot${isCurrent ? ' ec-dot-current' : ' ec-dot-active'}`}>
                                  ✓
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="ec-legend">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className="ec-legend-dot" style={{ background: 'var(--color-brand)' }} />
                {isEn ? 'Planting month' : 'Dikim ayı'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className="ec-legend-dot" style={{ background: 'color-mix(in srgb,var(--color-brand) 6%,transparent)', border: '1px solid var(--color-border)' }} />
                {isEn ? 'Current month' : 'Mevcut ay'}
              </div>
            </div>

            {/* Info box */}
            <div style={{ marginTop: 32, padding: '20px 24px', background: 'var(--color-bg-secondary)', borderLeft: '3px solid var(--color-brand)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
                {isEn ? 'Important Notes' : 'Önemli Notlar'}
              </h3>
              <ul style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                <li>{isEn ? 'Dates are for open-field planting. Greenhouse cultivation allows year-round production.' : 'Tarihler açık alan dikimi içindir. Sera yetiştiriciliği yıl boyu üretim imkânı sağlar.'}</li>
                <li>{isEn ? 'Local microclimates may differ from regional averages.' : 'Yerel mikro iklim koşulları bölge ortalamasından farklı olabilir.'}</li>
                <li>{isEn ? 'Grafted seedlings offer wider planting windows and higher disease resistance.' : 'Aşılı fideler daha geniş dikim pencereleri ve yüksek hastalık dayanımı sağlar.'}</li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div style={{ border: '1px solid var(--color-border)', padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 12px' }}>
                {isEn ? 'Our Products' : 'Ürünlerimiz'}
              </h3>
              {products.slice(0, 8).map((p: any) => (
                <Link
                  key={p.id}
                  href={localizedPath(locale, `/urunler/${p.slug}`)}
                  style={{ display: 'block', padding: '8px 0', fontSize: 14, color: 'var(--color-text-secondary)', textDecoration: 'none', borderBottom: '1px solid var(--color-border)' }}
                >
                  {p.title}
                </Link>
              ))}
              <Link
                href={localizedPath(locale, '/urunler')}
                style={{ display: 'block', marginTop: 12, fontSize: 13, fontWeight: 600, color: 'var(--color-brand)', textDecoration: 'none' }}
              >
                {isEn ? 'All Products →' : 'Tüm Ürünler →'}
              </Link>
            </div>

            <div style={{ border: '1px solid var(--color-brand)', padding: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
                {isEn ? 'Request Seedlings' : 'Fide Siparişi Ver'}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {t('common.offerCtaDescription')}
              </p>
              <Link
                href={localizedPath(locale, '/teklif')}
                style={{ display: 'block', marginTop: 12, padding: '9px 0', background: 'var(--color-brand)', color: 'var(--color-on-brand)', fontWeight: 700, fontSize: 14, textDecoration: 'none', borderRadius: 2, textAlign: 'center' }}
              >
                {isEn ? 'Get a Quote →' : 'Teklif Al →'}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
