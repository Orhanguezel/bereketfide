// src/modules/orders/payment-card.controller.ts
// Banka kart ödemesi başlatma — Craftgate | NestPay İş Bank | NestPay Halkbank | ZiraatPay
import type { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import {
  getAuthUserId,
  handleRouteError,
  sendNotFound,
  sendValidationError,
} from '@agro/shared-backend/modules/_shared';
import { env } from '@/core/env';
import { craftgateInitCheckout } from '@/modules/wallet/craftgate';
import { buildNestPay3DForm } from '@/modules/wallet/nestpay';
import { ziraatPayInit3D } from '@/modules/wallet/ziraatpay';
import {
  repoGetOrderRowById,
  repoListOrderItemsForIyzico,
  repoSetOrderPaymentPending,
  repoFailOrderPaymentInit,
} from './payment.repository';
import { orderPaymentLocaleQuerySchema } from './payment.validation';

type Provider = 'craftgate' | 'nestpay_isbank' | 'nestpay_halkbank' | 'ziraatpay';

function getProvider(): Provider {
  const p = env.PAYMENT_CARD_PROVIDER as Provider;
  const allowed: Provider[] = ['craftgate', 'nestpay_isbank', 'nestpay_halkbank', 'ziraatpay'];
  return allowed.includes(p) ? p : 'craftgate';
}

function cardCallbackUrl(provider: string): string {
  const base = env.PUBLIC_URL.replace(/\/$/, '');
  return `${base}/api/v1/orders/payment/card/${provider}/callback`;
}

export async function initiateOrderCardPayment(req: FastifyRequest, reply: FastifyReply) {
  try {
    if (!env.FEATURE_BANK_CARD_PAYMENT) {
      return reply.code(503).send({ error: { message: 'bank_card_feature_disabled' } });
    }

    const dealerId = getAuthUserId(req);
    const { id: orderId } = req.params as { id: string };

    const parsedQ = orderPaymentLocaleQuerySchema.safeParse(req.query ?? {});
    if (!parsedQ.success) return sendValidationError(reply, parsedQ.error.issues);
    const locale = parsedQ.data.locale ?? 'tr';

    const order = await repoGetOrderRowById(orderId);
    if (!order || order.dealer_id !== dealerId) return sendNotFound(reply);

    if (order.status === 'cancelled') {
      return reply.code(400).send({ error: { message: 'order_cancelled' } });
    }
    if (order.payment_status === 'paid') {
      return reply.code(400).send({ error: { message: 'already_paid' } });
    }

    const provider = getProvider();
    const paymentRef = randomUUID();
    const amount = parseFloat(String(order.total));
    const lines = await repoListOrderItemsForIyzico(orderId, locale);

    if (lines.length === 0) {
      return reply.code(400).send({ error: { message: 'order_has_no_items' } });
    }

    await repoSetOrderPaymentPending(orderId, paymentRef, provider);

    const rawIp =
      (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
      req.ip ??
      '127.0.0.1';
    const buyerIp = rawIp === '::1' || rawIp === '::ffff:127.0.0.1' ? '127.0.0.1' : rawIp;

    // --- Craftgate hosted checkout ---
    if (provider === 'craftgate') {
      const items = lines.map((l) => ({
        id: l.product_id,
        name: l.title ?? l.product_id,
        price: parseFloat(String(l.total_price)),
      }));

      const cgRes = await craftgateInitCheckout({
        orderId: paymentRef,
        amount,
        callbackUrl: cardCallbackUrl('craftgate'),
        items,
        locale,
      });

      if (!cgRes.url) {
        await repoFailOrderPaymentInit(orderId);
        const errMsg = cgRes.errors?.[0]?.errorDescription ?? 'craftgate_init_failed';
        return reply.code(502).send({ error: { message: errMsg } });
      }

      return reply.send({ provider: 'craftgate', pageUrl: cgRes.url, checkoutId: cgRes.id });
    }

    // --- NestPay (İş Bank veya Halkbank) ---
    if (provider === 'nestpay_isbank' || provider === 'nestpay_halkbank') {
      const isIsbank = provider === 'nestpay_isbank';
      const nestCfg = {
        merchantId: isIsbank ? env.NESTPAY_ISBANK_MERCHANT_ID : env.NESTPAY_HALKBANK_MERCHANT_ID,
        apiUser: isIsbank ? env.NESTPAY_ISBANK_API_USER : env.NESTPAY_HALKBANK_API_USER,
        apiPass: isIsbank ? env.NESTPAY_ISBANK_API_PASS : env.NESTPAY_HALKBANK_API_PASS,
        storeKey: isIsbank ? env.NESTPAY_ISBANK_STORE_KEY : env.NESTPAY_HALKBANK_STORE_KEY,
        gateUrl: isIsbank ? env.NESTPAY_ISBANK_3D_URL : env.NESTPAY_HALKBANK_3D_URL,
      };

      if (!nestCfg.merchantId || !nestCfg.storeKey) {
        await repoFailOrderPaymentInit(orderId);
        return reply.code(503).send({ error: { message: 'nestpay_not_configured' } });
      }

      const okUrl = cardCallbackUrl(`${provider}/ok`);
      const failUrl = cardCallbackUrl(`${provider}/fail`);

      const formHtml = buildNestPay3DForm(nestCfg, {
        orderId: paymentRef,
        amount: amount.toFixed(2),
        okUrl,
        failUrl,
        lang: locale === 'en' ? 'en' : 'tr',
      });

      return reply.send({ provider, formHtml });
    }

    // --- ZiraatPay ---
    if (provider === 'ziraatpay') {
      if (!env.ZIRAATPAY_MERCHANT || !env.ZIRAATPAY_MERCHANT_USER) {
        await repoFailOrderPaymentInit(orderId);
        return reply.code(503).send({ error: { message: 'ziraatpay_not_configured' } });
      }

      const zpRes = await ziraatPayInit3D({
        orderId: paymentRef,
        amount,
        okUrl: cardCallbackUrl('ziraatpay/ok'),
        failUrl: cardCallbackUrl('ziraatpay/fail'),
        locale,
        buyerIp,
      });

      if (zpRes.ResponseCode !== '00' && !zpRes.HTML && !zpRes.RedirectURL) {
        await repoFailOrderPaymentInit(orderId);
        return reply.code(502).send({
          error: { message: zpRes.ResponseMessage ?? 'ziraatpay_init_failed' },
        });
      }

      if (zpRes.RedirectURL) {
        return reply.send({ provider: 'ziraatpay', pageUrl: zpRes.RedirectURL });
      }

      return reply.send({ provider: 'ziraatpay', formHtml: zpRes.HTML });
    }

    return reply.code(500).send({ error: { message: 'unknown_card_provider' } });
  } catch (e) {
    return handleRouteError(reply, req, e, 'order_card_payment_init');
  }
}
