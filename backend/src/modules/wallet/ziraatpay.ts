// src/modules/wallet/ziraatpay.ts
// ZiraatPay REST API v2 — Ziraat Bankası sanal POS
// Test: https://test.ziraatpay.com.tr/ziraatpay/api/v2
// Entegrasyon: https://entegrasyon.ziraatpay.com.tr/ziraatpay/api/v2
// Canlı: https://vpos.ziraatpay.com.tr/ziraatpay/api/v2
// Döküman: https://vpos.ziraatpay.com.tr/ziraatpay/api/v2/doc
import fetch from 'node-fetch';
import { env } from '@/core/env';

export interface ZiraatPaySaleResponse {
  /** "00" = başarılı, "98" = genel hata, "99" = reddedildi */
  ResponseCode?: string;
  ResponseMessage?: string;
  /** 3D Secure HTML form içeriği (SALE3D) */
  HTML?: string;
  /** 3D Secure yönlendirme URL'i (alternatif) */
  RedirectURL?: string;
  OrderID?: string;
  TransactionId?: string;
}

export interface ZiraatPayStatusResponse {
  ResponseCode?: string;
  ResponseMessage?: string;
  OrderID?: string;
  Amount?: string;
  Currency?: string;
  TransactionState?: string; // 'APPROVED' | 'DECLINED' | ...
}

/**
 * ZiraatPay 3D Secure ödeme başlat.
 * Yanıt HTML form içerir — IyzicoCheckoutHost gibi enjekte edip submit edilir.
 */
export async function ziraatPayInit3D(params: {
  orderId: string;
  /** TRY tutarı — API'ye kuruş (×100) gönderilir */
  amount: number;
  okUrl: string;
  failUrl: string;
  locale?: string;
  buyerIp?: string;
}): Promise<ZiraatPaySaleResponse> {
  const body = new URLSearchParams({
    ACTION: 'SALE3D',
    MERCHANT: env.ZIRAATPAY_MERCHANT,
    MERCHANTUSER: env.ZIRAATPAY_MERCHANT_USER,
    MERCHANTPASSWORD: env.ZIRAATPAY_MERCHANT_PASSWORD,
    AMOUNT: String(Math.round(params.amount * 100)),
    CURRENCY: '949', // TRY
    ORDERID: params.orderId,
    OKURL: params.okUrl,
    FAILURL: params.failUrl,
    TAKSIT: '1',
    RETURNTYPE: 'HTML',
    IPADDRESS: params.buyerIp ?? '0.0.0.0',
    LANGUAGE: (params.locale ?? 'tr').toUpperCase() === 'EN' ? 'EN' : 'TR',
  });

  const res = await fetch(env.ZIRAATPAY_BASE_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ziraatpay_http_${res.status}: ${text}`);
  }

  // ZiraatPay JSON veya HTML döndürebilir — content-type'a göre işle
  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) {
    return res.json() as Promise<ZiraatPaySaleResponse>;
  }
  // HTML yanıt: doğrudan 3D form
  const html = await res.text();
  return { ResponseCode: '00', HTML: html };
}

/**
 * ZiraatPay sipariş durum sorgulama (callback sonrası doğrulama).
 */
export async function ziraatPayQueryOrder(orderId: string): Promise<ZiraatPayStatusResponse> {
  const body = new URLSearchParams({
    ACTION: 'STATUS',
    MERCHANT: env.ZIRAATPAY_MERCHANT,
    MERCHANTUSER: env.ZIRAATPAY_MERCHANT_USER,
    MERCHANTPASSWORD: env.ZIRAATPAY_MERCHANT_PASSWORD,
    ORDERID: orderId,
  });

  const res = await fetch(env.ZIRAATPAY_BASE_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ziraatpay_status_http_${res.status}: ${text}`);
  }

  return res.json() as Promise<ZiraatPayStatusResponse>;
}
