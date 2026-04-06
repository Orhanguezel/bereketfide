// src/modules/wallet/nestpay.ts
// NestPay (EstV3Pos / Asseco) — İş Bankası + Halkbank ortak altyapısı
// 3DPay Hosting modu: 3D doğrulama bankada, callback bizim sunucumuza gelir.
// Referans: https://sanalpos.isbank.com.tr / https://sanalpos.halkbank.com.tr
import { createHash } from 'crypto';

export interface NestPayConfig {
  merchantId: string;
  apiUser: string;
  apiPass: string;
  storeKey: string; // 3D Secure hash anahtarı (panel → Güvenlik Anahtarı)
  gateUrl: string; // 3D Secure gate URL (fim/est3Dgate)
}

export interface NestPayFormParams {
  orderId: string;
  /** Türk Lirası tutarı, örn: "100.00" */
  amount: string;
  /** ISO 4217 numeric: 949 = TRY, 840 = USD, 978 = EUR */
  currency?: string;
  okUrl: string;
  failUrl: string;
  lang?: string;
  /** Taksit sayısı: "" veya "1" = peşin */
  installment?: string;
}

/** 3D Secure hash — Base64(SHA1(clientId+oid+amount+okUrl+failUrl+islemtipi+taksit+storeKey)) */
function computeHash(fields: string[]): string {
  return createHash('sha1').update(fields.join('')).digest('base64');
}

/**
 * NestPay 3DPay Hosting form HTML döner.
 * Frontend bu HTML'i DOM'a enjekte edip auto-submit eder (bkz. IyzicoCheckoutHost benzeri).
 */
export function buildNestPay3DForm(cfg: NestPayConfig, params: NestPayFormParams): string {
  const taksit = params.installment ?? '';
  const currency = params.currency ?? '949';

  const hash = computeHash([
    cfg.merchantId,
    params.orderId,
    params.amount,
    params.okUrl,
    params.failUrl,
    'Auth',
    taksit,
    cfg.storeKey,
  ]);

  const fields: Record<string, string> = {
    clientid: cfg.merchantId,
    storetype: '3d_pay_hosting',
    islemtipi: 'Auth',
    amount: params.amount,
    currency,
    oid: params.orderId,
    okUrl: params.okUrl,
    failUrl: params.failUrl,
    lang: params.lang ?? 'tr',
    taksit,
    hash,
    rnd: String(Date.now()),
  };

  const inputs = Object.entries(fields)
    .map(([k, v]) => `<input type="hidden" name="${escAttr(k)}" value="${escAttr(v)}" />`)
    .join('\n  ');

  return (
    `<form id="nestpay3d" method="POST" action="${escAttr(cfg.gateUrl)}" style="display:none">\n  ` +
    inputs +
    `\n</form>\n<script>document.getElementById('nestpay3d').submit();</script>`
  );
}

function escAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * NestPay 3DPay callback hash doğrulaması.
 * Banka HASHPARAMS listesindeki alanları + storeKey ile hash gönderir.
 */
export function verifyNestPayCallback(
  params: Record<string, string>,
  storeKey: string,
): boolean {
  const hashParamsStr = params['HASHPARAMS'] ?? '';
  const receivedHash = params['HASH'] ?? '';
  if (!hashParamsStr || !receivedHash) return false;

  const keys = hashParamsStr.split(':').filter(Boolean);
  const data = keys.map((k) => params[k] ?? '').join('') + storeKey;
  const computed = createHash('sha1').update(data).digest('base64');
  return computed === receivedHash;
}

/** mdStatus: 1 = tam doğrulı, 2-6 = yarım (bankaya göre), diğerleri = hata */
export function nestPayMdStatusOk(params: Record<string, string>): boolean {
  const md = params['mdStatus'] ?? '';
  return md === '1' || md === '2' || md === '3' || md === '4';
}
