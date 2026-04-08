import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { API_BASE_URL, absoluteAssetUrl } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { buildMediaAlt } from '@/lib/media-seo';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { fetchSetting } from '@/i18n/server';
import { fetchSeoPage } from '@/seo/server';

async function fetchProducts(locale: string, categoryId?: string) {
  try {
    let url = `${API_BASE_URL}/products?item_type=bereketfide&is_active=1&locale=${locale}&limit=100&sort=display_order&order=asc`;
    if (categoryId) url += `&category_id=${encodeURIComponent(categoryId)}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchCategories(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/categories?module_key=bereketfide&is_active=1&locale=${locale}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchPriceNote(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/site-settings/fiyat_listesi_notu?locale=${locale}&prefix=bereketfide__`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.value as string) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations({ locale });
  const seo = await fetchSeoPage(locale, 'fiyat-listesi');
  const isEn = locale.startsWith('en');

  return buildPageMetadata({
    locale,
    pathname: '/fiyat-listesi',
    title: seo?.title || (isEn ? 'Price List' : 'Fiyat Listesi'),
    description:
      seo?.description ||
      (isEn
        ? 'Bereket Fide seedling price list by category. Request a bulk order quote.'
        : 'Bereket Fide fide fiyat listesi kategorilere göre. Toplu sipariş teklifi alın.'),
    ogImage: seo?.og_image || undefined,
    noIndex: seo?.no_index || Boolean(category),
  });
}

export default async function PriceListPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations({ locale });
  const isEn = locale.startsWith('en');

  const [categories, profile, priceNote] = await Promise.all([
    fetchCategories(locale),
    fetchSetting('company_profile', locale),
    fetchPriceNote(locale),
  ]);

  const activeCategory = category
    ? categories.find((c: any) => c.slug === category)
    : undefined;

  const products = await fetchProducts(locale, activeCategory?.id);

  const companyName = (profile?.value as any)?.company_name || 'Bereket Fide';
  const pageTitle = isEn ? 'Price List' : 'Fiyat Listesi';

  // Group products by category for full-list view
  type CategoryGroup = { id: string; name: string; items: any[] };
  const grouped: CategoryGroup[] = activeCategory
    ? [{ id: activeCategory.id, name: activeCategory.name, items: products }]
    : categories.reduce((acc: CategoryGroup[], cat: any) => {
        const catProducts = products.filter(
          (p: any) => p.category_id === cat.id || p.category_name === cat.name,
        );
        if (catProducts.length > 0) acc.push({ id: cat.id, name: cat.name, items: catProducts });
        return acc;
      }, []);

  // Products without category
  const uncategorized = activeCategory
    ? []
    : products.filter(
        (p: any) =>
          !categories.some((c: any) => c.id === p.category_id || c.name === p.category_name),
      );
  if (uncategorized.length > 0) {
    grouped.push({ id: 'other', name: isEn ? 'Other' : 'Diğer', items: uncategorized });
  }

  return (
    <>
      <style>{`
        .pl-title{font-family:var(--font-heading);font-size:28px;font-weight:800;color:var(--color-text-primary);line-height:1.2;margin:0 0 8px}
        .pl-desc{font-size:15px;color:var(--color-text-secondary);line-height:1.6;margin-bottom:20px;max-width:680px}
        .pl-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
        .pl-chip{display:inline-block;padding:6px 16px;border:1px solid var(--color-border);font-size:13px;font-weight:600;color:var(--color-text-primary);text-decoration:none;border-radius:2px;transition:all .15s;background:var(--color-bg-secondary)}
        .pl-chip:hover,.pl-chip-active{border-color:var(--color-brand);color:var(--color-brand)}
        .pl-chip-active{background:var(--color-brand);color:var(--color-on-brand)}
        .pl-chip-active:hover{background:var(--color-brand)}
        .pl-section-title{font-family:var(--font-heading);font-size:20px;font-weight:700;color:var(--color-text-primary);margin:36px 0 12px;padding-bottom:8px;border-bottom:2px solid var(--color-brand)}
        .pl-table{width:100%;border-collapse:collapse;margin-bottom:8px}
        .pl-table th{text-align:left;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--color-text-muted);padding:10px 14px;background:var(--color-bg-secondary);border-bottom:2px solid var(--color-border)}
        .pl-table td{padding:12px 14px;border-bottom:1px solid var(--color-border);font-size:14px;color:var(--color-text-secondary);vertical-align:middle}
        .pl-table tr:hover td{background:var(--color-bg-secondary)}
        .pl-product-name{font-weight:600;color:var(--color-text-primary);text-decoration:none;transition:color .15s}
        .pl-product-name:hover{color:var(--color-brand)}
        .pl-product-img{position:relative;width:48px;height:36px;overflow:hidden;background:var(--color-bg-muted);flex-shrink:0;border-radius:2px}
        .pl-price{font-weight:700;color:var(--color-brand);font-size:15px;white-space:nowrap}
        .pl-price-na{color:var(--color-text-muted);font-style:italic;font-size:13px}
        .pl-note{font-size:13px;color:var(--color-text-muted);margin:12px 0 24px;padding:12px 16px;background:var(--color-bg-secondary);border-left:3px solid var(--color-border)}
        .pl-cta{margin-top:48px;padding:32px;background:var(--color-bg-dark);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
        @media(min-width:1024px){.pl-layout{display:grid;grid-template-columns:1fr 280px;gap:40px}}
        @media(max-width:640px){.pl-table th:nth-child(3),.pl-table td:nth-child(3){display:none}}
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>
        <JsonLd
          data={jsonld.graph([
            jsonld.collectionPage({
              name: pageTitle,
              description: isEn ? 'Bereket Fide seedling price list' : 'Bereket Fide fide fiyat listesi',
              url: localizedUrl(locale, '/fiyat-listesi'),
            }),
          ])}
        />

        <Breadcrumbs items={[
          { label: companyName, href: localizedPath(locale, '/') },
          { label: pageTitle },
        ]} />

        <h1 className="pl-title">{pageTitle}</h1>
        <p className="pl-desc">
          {isEn
            ? 'Current season seedling prices by category. Prices may vary based on order quantity and season. Contact us for bulk orders.'
            : 'Güncel sezon fide fiyatları kategorilere göre. Fiyatlar sipariş miktarına ve sezona göre değişebilir. Toplu siparişler için bizimle iletişime geçin.'}
        </p>

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="pl-chips">
            <Link
              href={localizedPath(locale, '/fiyat-listesi')}
              className={`pl-chip${!activeCategory ? ' pl-chip-active' : ''}`}
            >
              {isEn ? 'All' : 'Tümü'}
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={localizedPath(locale, `/fiyat-listesi?category=${cat.slug}`)}
                className={`pl-chip${activeCategory?.id === cat.id ? ' pl-chip-active' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {priceNote && <p className="pl-note">{priceNote}</p>}

        <div className="pl-layout">
          <div>
            {products.length === 0 && (
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 24 }}>
                {isEn ? 'No products found.' : 'Ürün bulunamadı.'}
              </p>
            )}

            {grouped.map((group) => (
              <div key={group.id}>
                {!activeCategory && <h2 className="pl-section-title">{group.name}</h2>}

                <table className="pl-table">
                  <thead>
                    <tr>
                      <th style={{ width: 48 }}></th>
                      <th>{isEn ? 'Product' : 'Ürün'}</th>
                      <th>{isEn ? 'Code' : 'Kod'}</th>
                      <th>{isEn ? 'Unit Price' : 'Birim Fiyat'}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((product: any) => {
                      const img = absoluteAssetUrl(product.image_url);
                      const hasPrice = product.price != null && product.price !== '';
                      return (
                        <tr key={product.id ?? product.slug}>
                          <td>
                            {img && (
                              <div className="pl-product-img">
                                <OptimizedImage
                                  src={img}
                                  alt={buildMediaAlt({ locale, kind: 'product', title: product.title, alt: product.alt })}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            )}
                          </td>
                          <td>
                            <Link
                              href={product.slug ? localizedPath(locale, `/urunler/${product.slug}`) : '#'}
                              className="pl-product-name"
                            >
                              {product.title}
                            </Link>
                          </td>
                          <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                            {product.product_code || '—'}
                          </td>
                          <td>
                            {hasPrice ? (
                              <span className="pl-price">
                                {Number(product.price).toLocaleString(isEn ? 'en-US' : 'tr-TR', { minimumFractionDigits: 2 })} ₺
                              </span>
                            ) : (
                              <span className="pl-price-na">{isEn ? 'On request' : 'Teklife göre'}</span>
                            )}
                          </td>
                          <td>
                            <Link
                              href={`${localizedPath(locale, '/teklif')}?project=${encodeURIComponent(product.title)}`}
                              style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-brand)', textDecoration: 'none', whiteSpace: 'nowrap' }}
                            >
                              {isEn ? 'Quote' : 'Teklif Al'}
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}

            {/* CTA */}
            <div className="pl-cta">
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-on-dark)', margin: 0 }}>
                  {isEn ? 'Bulk Order? Get a Quote.' : 'Toplu Sipariş İçin Teklif Alın'}
                </h3>
                <p style={{ fontSize: 14, marginTop: 4, color: 'color-mix(in srgb, var(--section-bg-white) 70%, transparent)' }}>
                  {t('common.offerCtaDescription')}
                </p>
              </div>
              <Link
                href={localizedPath(locale, '/teklif')}
                style={{ padding: '10px 24px', background: 'var(--color-brand)', color: 'var(--color-on-brand)', fontWeight: 600, fontSize: 14, textDecoration: 'none', borderRadius: 2, whiteSpace: 'nowrap' }}
              >
                {t('nav.offer')}
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div style={{ border: '1px solid var(--color-brand)', padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 10px' }}>
                {isEn ? 'Request a Quote' : 'Teklif İste'}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 14 }}>
                {isEn
                  ? 'Get competitive pricing for large volumes and seasonal orders.'
                  : 'Büyük hacimli ve mevsimsel siparişler için rekabetçi fiyat alın.'}
              </p>
              <Link
                href={localizedPath(locale, '/teklif')}
                style={{ display: 'block', padding: '10px 0', background: 'var(--color-brand)', color: 'var(--color-on-brand)', fontWeight: 700, fontSize: 14, textDecoration: 'none', borderRadius: 2, textAlign: 'center' }}
              >
                {isEn ? 'Get a Quote →' : 'Teklif Al →'}
              </Link>
            </div>

            <div style={{ border: '1px solid var(--color-border)', padding: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 10px' }}>
                {isEn ? 'Price Notes' : 'Fiyat Notları'}
              </h3>
              <ul style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.7, paddingLeft: 18, margin: 0 }}>
                <li>{isEn ? 'Prices are per seedling, excl. VAT.' : 'Fiyatlar adet başına, KDV hariçtir.'}</li>
                <li>{isEn ? 'Minimum order quantities apply.' : 'Minimum sipariş miktarları geçerlidir.'}</li>
                <li>{isEn ? 'Bulk discounts available.' : 'Toplu alımlarda indirim uygulanır.'}</li>
                <li>{isEn ? 'Prices valid for current season.' : 'Fiyatlar mevcut sezon için geçerlidir.'}</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
