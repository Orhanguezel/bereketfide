// src/modules/orders/payment-card-callback.controller.ts
// Craftgate, NestPay (İş Bank / Halkbank), ZiraatPay callback işleyicileri
import type { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '@/core/env';
import { craftgateRetrieveCheckout } from '@/modules/wallet/craftgate';
import { verifyNestPayCallback, nestPayMdStatusOk } from '@/modules/wallet/nestpay';
import { ziraatPayQueryOrder } from '@/modules/wallet/ziraatpay';
import {
  repoGetOrderByPaymentRef,
  repoMarkOrderIyzicoPaid,
  repoMarkOrderPaymentFailed,
} from './payment.repository';

function panelOrdersUrl(status: 'success' | 'fail', extra = '') {
  const loc = env.FRONTEND_DEFAULT_LOCALE;
  const base = env.FRONTEND_URL.replace(/\/$/, '');
  return `${base}/${loc}/panel/siparisler?payment=${status}${extra}`;
}

// ─── Craftgate ────────────────────────────────────────────────────────────────

/** POST /orders/payment/card/craftgate/callback */
export async function cardCraftgateCallback(req: FastifyRequest, reply: FastifyReply) {
  const failUrl = panelOrdersUrl('fail');
  try {
    const body = req.body as Record<string, string>;
    // Craftgate: { checkoutFormId, merchantPaymentId, status }
    const checkoutId = body?.checkoutFormId ?? body?.id;
    const merchantPaymentId = body?.merchantPaymentId; // = paymentRef (orderId olarak gönderdik)

    if (!checkoutId && !merchantPaymentId) {
      return reply.redirect(`${failUrl}&reason=no_checkout_id`);
    }

    const order = await repoGetOrderByPaymentRef(merchantPaymentId ?? checkoutId ?? '');
    if (!order) {
      req.log.warn({ merchantPaymentId, checkoutId }, 'craftgate_callback: order not found');
      return reply.redirect(`${failUrl}&reason=order_not_found`);
    }

    if (order.payment_status === 'paid') {
      return reply.redirect(panelOrdersUrl('success', `&order=${encodeURIComponent(order.id)}`));
    }

    const detail = await craftgateRetrieveCheckout(checkoutId ?? '');
    const payment = detail.payment;
    const paid = payment?.status === 'SUCCESS' && (payment?.fraudStatus ?? 0) !== -1;

    if (!paid) {
      await repoMarkOrderPaymentFailed(order.id);
      req.log.warn({ detail, orderId: order.id }, 'craftgate_callback: verification failed');
      return reply.redirect(`${failUrl}&reason=payment_failed`);
    }

    await repoMarkOrderIyzicoPaid(order.id); // aynı DB işlemi — paid + confirmed
    return reply.redirect(panelOrdersUrl('success', `&order=${encodeURIComponent(order.id)}`));
  } catch (e) {
    req.log.error(e, 'craftgate_callback');
    return reply.redirect(`${failUrl}&reason=server_error`);
  }
}

// ─── NestPay ortak ───────────────────────────────────────────────────────────

async function handleNestPayCallback(
  req: FastifyRequest,
  reply: FastifyReply,
  storeKey: string,
  provider: string,
) {
  const failUrl = panelOrdersUrl('fail');
  try {
    const body = req.body as Record<string, string>;
    const paymentRef = body['oid'] ?? '';

    if (!verifyNestPayCallback(body, storeKey)) {
      req.log.warn({ provider, oid: paymentRef }, 'nestpay_callback: hash mismatch');
      return reply.redirect(`${failUrl}&reason=hash_mismatch`);
    }

    const order = await repoGetOrderByPaymentRef(paymentRef);
    if (!order) {
      req.log.warn({ provider, paymentRef }, 'nestpay_callback: order not found');
      return reply.redirect(`${failUrl}&reason=order_not_found`);
    }

    if (order.payment_status === 'paid') {
      return reply.redirect(panelOrdersUrl('success', `&order=${encodeURIComponent(order.id)}`));
    }

    const procCode = body['ProcReturnCode'] ?? '';
    const mdStatus = body['mdStatus'] ?? '';
    const approved =
      (procCode === '00' || body['Response'] === 'Approved') && nestPayMdStatusOk({ mdStatus });

    if (!approved) {
      await repoMarkOrderPaymentFailed(order.id);
      req.log.warn({ body, orderId: order.id }, 'nestpay_callback: payment not approved');
      return reply.redirect(`${failUrl}&reason=payment_failed`);
    }

    await repoMarkOrderIyzicoPaid(order.id);
    return reply.redirect(panelOrdersUrl('success', `&order=${encodeURIComponent(order.id)}`));
  } catch (e) {
    req.log.error(e, `nestpay_callback_${provider}`);
    return reply.redirect(`${failUrl}&reason=server_error`);
  }
}

/** POST /orders/payment/card/nestpay_isbank/ok  (ve /fail — ikisi aynı handler) */
export async function cardNestpayIsbankCallback(req: FastifyRequest, reply: FastifyReply) {
  return handleNestPayCallback(req, reply, env.NESTPAY_ISBANK_STORE_KEY, 'nestpay_isbank');
}

/** POST /orders/payment/card/nestpay_halkbank/ok */
export async function cardNestpayHalkbankCallback(req: FastifyRequest, reply: FastifyReply) {
  return handleNestPayCallback(req, reply, env.NESTPAY_HALKBANK_STORE_KEY, 'nestpay_halkbank');
}

// ─── ZiraatPay ────────────────────────────────────────────────────────────────

/** POST /orders/payment/card/ziraatpay/ok (ve /fail) */
export async function cardZiraatpayCallback(req: FastifyRequest, reply: FastifyReply) {
  const failUrl = panelOrdersUrl('fail');
  try {
    const body = req.body as Record<string, string>;
    const paymentRef = body['ORDERID'] ?? body['OrderID'] ?? '';

    const order = await repoGetOrderByPaymentRef(paymentRef);
    if (!order) {
      req.log.warn({ paymentRef }, 'ziraatpay_callback: order not found');
      return reply.redirect(`${failUrl}&reason=order_not_found`);
    }

    if (order.payment_status === 'paid') {
      return reply.redirect(panelOrdersUrl('success', `&order=${encodeURIComponent(order.id)}`));
    }

    // Sunucu tarafı doğrulama — callback parametrelerine güvenmiyoruz
    const statusRes = await ziraatPayQueryOrder(paymentRef);
    const approved = statusRes.TransactionState === 'APPROVED' && statusRes.ResponseCode === '00';

    if (!approved) {
      await repoMarkOrderPaymentFailed(order.id);
      req.log.warn({ statusRes, orderId: order.id }, 'ziraatpay_callback: not approved');
      return reply.redirect(`${failUrl}&reason=payment_failed`);
    }

    await repoMarkOrderIyzicoPaid(order.id);
    return reply.redirect(panelOrdersUrl('success', `&order=${encodeURIComponent(order.id)}`));
  } catch (e) {
    req.log.error(e, 'ziraatpay_callback');
    return reply.redirect(`${failUrl}&reason=server_error`);
  }
}
