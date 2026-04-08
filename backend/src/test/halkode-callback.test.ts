import { afterEach, beforeAll, describe, expect, it, mock } from 'bun:test';
import { createHash } from 'crypto';
import { env } from '@/core/env';

const repoGetOrderByPaymentRef = mock(async () => null);
const repoMarkOrderPaid = mock(async () => {});
const repoMarkOrderPaymentFailed = mock(async () => {});
const repoGetDealerDirectPaymentByRef = mock(async () => null);
const repoApplyDealerDirectPaymentSuccess = mock(async () => ({ ok: true, status: 'paid' as const }));
const repoMarkDealerDirectPaymentFailed = mock(async () => {});

mock.module('@agro/shared-backend/modules/orders/payment.repository', () => ({
  repoGetOrderByPaymentRef,
  repoMarkOrderPaid,
  repoMarkOrderPaymentFailed,
}));

mock.module('@agro/shared-backend/modules/dealerFinance/direct-payment.repository', () => ({
  repoGetDealerDirectPaymentByRef,
  repoApplyDealerDirectPaymentSuccess,
  repoMarkDealerDirectPaymentFailed,
}));

let cardHalkodeCallback: typeof import('@agro/shared-backend/modules/orders/payment-card-callback.controller').cardHalkodeCallback;
let cardHalkodeWebhook: typeof import('@agro/shared-backend/modules/orders/payment-card-callback.controller').cardHalkodeWebhook;

function createReplyDouble() {
  return {
    statusCode: 200,
    payload: undefined as unknown,
    redirectUrl: undefined as string | undefined,
    code(statusCode: number) {
      this.statusCode = statusCode;
      return this;
    },
    send(payload: unknown) {
      this.payload = payload;
      return this;
    },
    redirect(url: string) {
      this.redirectUrl = url;
      return this;
    },
  };
}

function buildValidNestpayHashBody(oid: string) {
  return buildNestpayBodyWithHash({
    oid,
    Response: 'Approved',
    ProcReturnCode: '00',
    mdStatus: '1',
  });
}

function buildNestpayBodyWithHash(fields: {
  oid: string;
  Response: string;
  ProcReturnCode: string;
  mdStatus: string;
}) {
  const params = {
    ...fields,
    HASHPARAMS: 'oid:Response:ProcReturnCode:mdStatus:',
  } as Record<string, string>;

  const keys = params.HASHPARAMS.split(':').filter(Boolean);
  const data = keys.map((k) => params[k] ?? '').join('') + env.HALKODE_STORE_KEY;
  const hash = createHash('sha1').update(data).digest('base64');

  return {
    ...params,
    HASHPARAMSVAL: `${params.oid}${params.Response}${params.ProcReturnCode}${params.mdStatus}`,
    HASH: hash,
  };
}

const reqLog = {
  warn: mock(() => {}),
  error: mock(() => {}),
};

beforeAll(async () => {
  const mod = await import('@agro/shared-backend/modules/orders/payment-card-callback.controller');
  cardHalkodeCallback = mod.cardHalkodeCallback;
  cardHalkodeWebhook = mod.cardHalkodeWebhook;
});

afterEach(() => {
  reqLog.warn.mockClear();
  reqLog.error.mockClear();
  repoGetOrderByPaymentRef.mockClear();
  repoMarkOrderPaid.mockClear();
  repoMarkOrderPaymentFailed.mockClear();
  repoGetDealerDirectPaymentByRef.mockClear();
  repoApplyDealerDirectPaymentSuccess.mockClear();
  repoMarkDealerDirectPaymentFailed.mockClear();
  repoGetOrderByPaymentRef.mockImplementation(async () => null);
  repoGetDealerDirectPaymentByRef.mockImplementation(async () => null);
});

describe('Halk Ode callbacks', () => {
  it('webhook returns 400 json on hash mismatch', async () => {
    const reply = createReplyDouble();

    await cardHalkodeWebhook(
      {
        body: {},
        log: reqLog,
      } as any,
      reply as any,
    );

    expect(reply.statusCode).toBe(400);
    expect(reply.payload).toEqual({ ok: false, reason: 'hash_mismatch' });
    expect(reply.redirectUrl).toBeUndefined();
  });

  it('ok callback redirects with hash_mismatch on invalid form post', async () => {
    const reply = createReplyDouble();

    await cardHalkodeCallback(
      {
        body: {
          oid: 'test-order-1',
          Response: 'Approved',
          ProcReturnCode: '00',
          mdStatus: '1',
          HASHPARAMS: 'oid:Response:ProcReturnCode:mdStatus:',
          HASHPARAMSVAL: 'test-order-1Approved001',
          HASH: 'fake',
        },
        log: reqLog,
      } as any,
      reply as any,
    );

    expect(reply.statusCode).toBe(200);
    expect(reply.redirectUrl).toContain('payment=fail');
    expect(reply.redirectUrl).toContain('reason=hash_mismatch');
  });

  it('webhook returns 404 when hash is valid but payment target is missing', async () => {
    const reply = createReplyDouble();

    await cardHalkodeWebhook(
      {
        body: buildValidNestpayHashBody('missing-order-ref'),
        log: reqLog,
      } as any,
      reply as any,
    );

    expect(repoGetOrderByPaymentRef).toHaveBeenCalledWith('missing-order-ref');
    expect(repoGetDealerDirectPaymentByRef).toHaveBeenCalledWith('missing-order-ref');
    expect(reply.statusCode).toBe(404);
    expect(reply.payload).toEqual({ ok: false, reason: 'payment_not_found' });
  });

  it('webhook marks order paid when hash is valid and order exists', async () => {
    const reply = createReplyDouble();
    repoGetOrderByPaymentRef.mockImplementationOnce(async () => ({
      id: 'order-123',
      payment_status: 'pending',
    }));

    await cardHalkodeWebhook(
      {
        body: buildValidNestpayHashBody('payment-ref-success'),
        log: reqLog,
      } as any,
      reply as any,
    );

    expect(repoGetOrderByPaymentRef).toHaveBeenCalledWith('payment-ref-success');
    expect(repoMarkOrderPaid).toHaveBeenCalledWith(
      'order-123',
      'halkode',
      'payment-ref-success',
      expect.objectContaining({
        oid: 'payment-ref-success',
        Response: 'Approved',
        ProcReturnCode: '00',
        mdStatus: '1',
      }),
    );
    expect(reply.statusCode).toBe(200);
    expect(reply.payload).toEqual({ ok: true, status: 'paid', orderId: 'order-123' });
  });

  it('ok callback redirects to success page when hash is valid and order exists', async () => {
    const reply = createReplyDouble();
    repoGetOrderByPaymentRef.mockImplementationOnce(async () => ({
      id: 'order-redirect-1',
      payment_status: 'pending',
    }));

    await cardHalkodeCallback(
      {
        body: buildValidNestpayHashBody('payment-ref-redirect'),
        log: reqLog,
      } as any,
      reply as any,
    );

    expect(repoMarkOrderPaid).toHaveBeenCalledWith(
      'order-redirect-1',
      'halkode',
      'payment-ref-redirect',
      expect.objectContaining({
        oid: 'payment-ref-redirect',
        Response: 'Approved',
        ProcReturnCode: '00',
        mdStatus: '1',
      }),
    );
    expect(reply.redirectUrl).toContain('payment=success');
    expect(reply.redirectUrl).toContain('order=order-redirect-1');
  });

  it('fail callback marks payment failed and redirects to fail page when bank rejects', async () => {
    const reply = createReplyDouble();
    repoGetOrderByPaymentRef.mockImplementationOnce(async () => ({
      id: 'order-fail-1',
      payment_status: 'pending',
    }));

    await cardHalkodeCallback(
      {
        body: buildNestpayBodyWithHash({
          oid: 'payment-ref-fail',
          Response: 'Declined',
          ProcReturnCode: '05',
          mdStatus: '0',
        }),
        log: reqLog,
      } as any,
      reply as any,
    );

    expect(repoMarkOrderPaymentFailed).toHaveBeenCalledWith(
      'order-fail-1',
      'payment-ref-fail',
      expect.objectContaining({
        oid: 'payment-ref-fail',
        Response: 'Declined',
        ProcReturnCode: '05',
        mdStatus: '0',
      }),
      'payment_failed',
    );
    expect(reply.redirectUrl).toContain('payment=fail');
    expect(reply.redirectUrl).toContain('reason=payment_failed');
  });
});
