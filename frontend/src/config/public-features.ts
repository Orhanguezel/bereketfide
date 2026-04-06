function envTruthy(v: string | undefined): boolean {
  return ['1', 'true', 'yes', 'on'].includes(String(v ?? '').trim().toLowerCase());
}

function envExplicitlyDisabled(v: string | undefined): boolean {
  const s = String(v ?? '').trim().toLowerCase();
  if (!s) return false;
  return ['0', 'false', 'no', 'off'].includes(s);
}

/**
 * Ana sayfa `/references` API cagrisi ve is ortagi bandi.
 * Varsayilan kapali (PLAN: gereksiz modul pasif); `NEXT_PUBLIC_FEATURE_HOME_REFERENCES=1` ile acilir.
 */
export const showHomeReferencesBand = envTruthy(process.env.NEXT_PUBLIC_FEATURE_HOME_REFERENCES);

/**
 * Ana sayfa katalog kartlari (`GET /library?type=catalog`).
 * Varsayilan kapali; `NEXT_PUBLIC_FEATURE_HOME_CATALOGS=1` ile acilir.
 */
export const showHomeCatalogsBand = envTruthy(process.env.NEXT_PUBLIC_FEATURE_HOME_CATALOGS);

/**
 * Ana sayfa on plan blog kartlari (`custom-pages` blog). Varsayilan acik.
 * Kapatmak icin: `NEXT_PUBLIC_FEATURE_HOME_BLOG=0` (veya `false` / `no` / `off`).
 */
export const showHomeBlogBand = !envExplicitlyDisabled(process.env.NEXT_PUBLIC_FEATURE_HOME_BLOG);

/**
 * Ana sayfa haber bandi (`custom-pages` news). Varsayilan acik.
 * Kapatmak icin: `NEXT_PUBLIC_FEATURE_HOME_NEWS=0` (veya `false` / `no` / `off`).
 */
export const showHomeNewsBand = !envExplicitlyDisabled(process.env.NEXT_PUBLIC_FEATURE_HOME_NEWS);

/**
 * Footer bulten abonelik formu (`NewsletterForm` → `POST /newsletter/subscribe`).
 * Varsayilan kapali; `NEXT_PUBLIC_FEATURE_FOOTER_NEWSLETTER=1` ile acilir.
 */
export const showFooterNewsletter = envTruthy(process.env.NEXT_PUBLIC_FEATURE_FOOTER_NEWSLETTER);

/**
 * Bayi siparis detayinda Iyzico kart odemesi. Backend `FEATURE_IYZICO_PAYMENT=1` ve anahtarlar gerekir.
 */
export const showDealerIyzicoPayment = envTruthy(process.env.NEXT_PUBLIC_FEATURE_IYZICO_PAYMENT);

/**
 * Bayi siparis detayinda banka kart odemesi (Craftgate / NestPay / ZiraatPay).
 * Backend `FEATURE_BANK_CARD_PAYMENT=1` + saglayici anahtarlari gerekir.
 * `NEXT_PUBLIC_FEATURE_BANK_CARD_PAYMENT=1` ile acilir.
 */
export const showDealerBankCardPayment = envTruthy(
  process.env.NEXT_PUBLIC_FEATURE_BANK_CARD_PAYMENT,
);
