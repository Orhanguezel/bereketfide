// src/modules/orders/router.ts
import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@agro/shared-backend/middleware/auth';
import { requireDealer } from '@agro/shared-backend/middleware/roles';
import { requireApprovedDealer } from '@/common/middleware/approved-dealer';
import {
  dealerListOrders,
  dealerGetOrder,
  dealerCreateOrder,
  dealerCancelOrder,
} from './controller';
import {
  initiateOrderBankTransfer,
  initiateOrderCreditPayment,
  initiateOrderIyzicoPayment,
} from './payment.controller';
import { orderIyzicoCallback } from './payment-callback.controller';
import { initiateOrderCardPayment } from './payment-card.controller';
import {
  cardCraftgateCallback,
  cardNestpayIsbankCallback,
  cardNestpayHalkbankCallback,
  cardZiraatpayCallback,
} from './payment-card-callback.controller';

const dealerOrder = { preHandler: [requireAuth, requireDealer, requireApprovedDealer] };

export async function registerOrders(app: FastifyInstance) {
  const B = '/orders';

  // Public callbacks (provider → bizim sunucu)
  app.post(`${B}/payment/iyzico/callback`, orderIyzicoCallback);
  app.post(`${B}/payment/card/craftgate/callback`, cardCraftgateCallback);
  app.post(`${B}/payment/card/nestpay_isbank/ok`, cardNestpayIsbankCallback);
  app.post(`${B}/payment/card/nestpay_isbank/fail`, cardNestpayIsbankCallback);
  app.post(`${B}/payment/card/nestpay_halkbank/ok`, cardNestpayHalkbankCallback);
  app.post(`${B}/payment/card/nestpay_halkbank/fail`, cardNestpayHalkbankCallback);
  app.post(`${B}/payment/card/ziraatpay/ok`, cardZiraatpayCallback);
  app.post(`${B}/payment/card/ziraatpay/fail`, cardZiraatpayCallback);

  // Bayi korumalı route'lar
  app.get(B, dealerOrder, dealerListOrders);
  app.get(`${B}/:id`, dealerOrder, dealerGetOrder);
  app.post(B, dealerOrder, dealerCreateOrder);
  app.patch(`${B}/:id/cancel`, dealerOrder, dealerCancelOrder);
  app.post(`${B}/:id/payment/bank-transfer`, dealerOrder, initiateOrderBankTransfer);
  app.post(`${B}/:id/payment/credit`, dealerOrder, initiateOrderCreditPayment);
  app.post(`${B}/:id/payment/iyzico/initiate`, dealerOrder, initiateOrderIyzicoPayment);
  app.post(`${B}/:id/payment/card/initiate`, dealerOrder, initiateOrderCardPayment);
}
