// src/modules/wallet/craftgate.ts
// Craftgate Hosted Checkout — REST API + HMAC-SHA256 auth
// Sandbox: https://sandbox-api.craftgate.io
// Production: https://api.craftgate.io
import { createHmac, randomUUID } from 'crypto';
import fetch from 'node-fetch';
import { env } from '@/core/env';

function buildHeaders(path: string, body: string): Record<string, string> {
  const rndKey = randomUUID();
  const ts = String(Math.floor(Date.now() / 1000));
  const raw = env.CRAFTGATE_API_KEY + rndKey + ts + path + body;
  const sig = createHmac('sha256', env.CRAFTGATE_SECRET_KEY).update(raw).digest('base64');
  return {
    'x-api-key': env.CRAFTGATE_API_KEY,
    'x-rnd-key': rndKey,
    'x-auth-version': '1',
    'x-signature': sig,
    'content-type': 'application/json',
    accept: 'application/json',
  };
}

async function cgPost<T>(path: string, body: unknown): Promise<T> {
  const base = env.CRAFTGATE_BASE_URL.replace(/\/$/, '');
  const json = JSON.stringify(body);
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: buildHeaders(path, json),
    body: json,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`craftgate_http_${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

async function cgGet<T>(path: string): Promise<T> {
  const base = env.CRAFTGATE_BASE_URL.replace(/\/$/, '');
  const res = await fetch(`${base}${path}`, {
    method: 'GET',
    headers: buildHeaders(path, ''),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`craftgate_http_${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export interface CraftgateItem {
  id: string;
  name: string;
  price: number;
}

export interface CraftgateInitResponse {
  // Success
  id?: string;
  url?: string;
  expiresAt?: string;
  // Error
  errors?: { errorCode?: string; errorDescription?: string }[];
}

export interface CraftgateRetrieveResponse {
  payment?: {
    id: number;
    status: string; // 'SUCCESS' | 'FAILURE' | 'INIT_THREEDS' | ...
    orderId?: string;
    merchantPaymentId?: string;
    price?: number;
    paidPrice?: number;
    currency?: string;
    fraudStatus?: number;
  };
  errors?: { errorCode?: string; errorDescription?: string }[];
}

export async function craftgateInitCheckout(params: {
  orderId: string;
  amount: number;
  callbackUrl: string;
  items: CraftgateItem[];
  locale?: string;
}): Promise<CraftgateInitResponse> {
  return cgPost<CraftgateInitResponse>('/payment/v1/checkout-payments/init', {
    price: params.amount,
    paidPrice: params.amount,
    currency: 'TRY',
    paymentGroup: 'PRODUCT',
    callbackUrl: params.callbackUrl,
    merchantPaymentId: params.orderId,
    locale: (params.locale ?? 'tr').toUpperCase(),
    items: params.items,
  });
}

export async function craftgateRetrieveCheckout(
  checkoutId: string,
): Promise<CraftgateRetrieveResponse> {
  return cgGet<CraftgateRetrieveResponse>(`/payment/v1/checkout-payments/${checkoutId}`);
}
