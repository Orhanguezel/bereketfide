import { afterEach, beforeAll, describe, expect, it, mock } from 'bun:test';

// ── helpers ────────────────────────────────────────────────────
let txSelectResults: unknown[][] = [];
let txSelectIdx = 0;
const txUpdateSpy = mock(async () => {});
const txInsertSpy = mock(async () => {});

function makeChainResult(rows: unknown[]) {
  const p = Promise.resolve(rows) as Promise<unknown[]> & { limit: () => Promise<unknown[]> };
  p.limit = () => Promise.resolve(rows);
  return p;
}

function makeSequentialTx() {
  txSelectIdx = 0;
  return {
    select: () => ({
      from: () => ({
        where: () => makeChainResult(txSelectResults[txSelectIdx++] ?? []),
      }),
    }),
    update: () => ({
      set: () => ({ where: () => txUpdateSpy() }),
    }),
    insert: () => ({
      values: () => txInsertSpy(),
    }),
  };
}

mock.module('@agro/shared-backend/db/client', () => ({
  db: {
    transaction: mock(async (fn: (tx: ReturnType<typeof makeSequentialTx>) => Promise<void>) =>
      fn(makeSequentialTx()),
    ),
  },
  pool: {},
}));

// ── lazily imported after mocks are hoisted ───────────────────
let refundDealerCreditOrder: typeof import('@agro/shared-backend/modules/orders/refund.service').refundDealerCreditOrder;

beforeAll(async () => {
  const mod = await import('@agro/shared-backend/modules/orders/refund.service');
  refundDealerCreditOrder = mod.refundDealerCreditOrder;
});

afterEach(() => {
  txSelectResults = [];
  txUpdateSpy.mockClear();
  txInsertSpy.mockClear();
});

// ── fixtures ──────────────────────────────────────────────────
const paidCreditOrder = {
  id: 'order-1',
  dealer_id: 'user-1',
  status: 'confirmed',
  payment_status: 'paid',
  payment_method: 'dealer_credit',
  total: '500.00',
};

const dealerProfile = {
  id: 'dealer-profile-1',
  user_id: 'user-1',
  current_balance: '500.00',
  credit_limit: '10000.00',
};

// ── tests ─────────────────────────────────────────────────────
describe('refundDealerCreditOrder', () => {
  it('order_not_found — siparis yoksa hata firlatir', async () => {
    txSelectResults = [[]];
    await expect(
      refundDealerCreditOrder({ orderId: 'ghost', adminUserId: 'admin-1' }),
    ).rejects.toMatchObject({ code: 'order_not_found' });
  });

  it('already_refunded — iki kez iade engellenebilir', async () => {
    txSelectResults = [[{ ...paidCreditOrder, payment_status: 'refunded' }]];
    await expect(
      refundDealerCreditOrder({ orderId: 'order-1', adminUserId: 'admin-1' }),
    ).rejects.toMatchObject({ code: 'already_refunded' });
  });

  it('order_not_paid — odenmemis sipariste iade olmaz', async () => {
    txSelectResults = [[{ ...paidCreditOrder, payment_status: 'unpaid' }]];
    await expect(
      refundDealerCreditOrder({ orderId: 'order-1', adminUserId: 'admin-1' }),
    ).rejects.toMatchObject({ code: 'order_not_paid' });
  });

  it('order_not_paid — basarisiz odemede iade olmaz', async () => {
    txSelectResults = [[{ ...paidCreditOrder, payment_status: 'failed' }]];
    await expect(
      refundDealerCreditOrder({ orderId: 'order-1', adminUserId: 'admin-1' }),
    ).rejects.toMatchObject({ code: 'order_not_paid' });
  });

  it('refund_not_supported — banka havalesi icin otomatik iade yok', async () => {
    txSelectResults = [[{ ...paidCreditOrder, payment_method: 'bank_transfer' }]];
    await expect(
      refundDealerCreditOrder({ orderId: 'order-1', adminUserId: 'admin-1' }),
    ).rejects.toMatchObject({ code: 'refund_not_supported_for_payment_method' });
  });

  it('refund_not_supported — kart odemelerinde otomatik iade yok', async () => {
    for (const method of ['iyzico', 'craftgate', 'halkode', 'ziraatpay', 'nestpay_isbank']) {
      txSelectResults = [[{ ...paidCreditOrder, payment_method: method }]];
      // biome-ignore lint/nursery/noAwaitInLoop: sequential by design
      await expect(
        refundDealerCreditOrder({ orderId: 'order-1', adminUserId: 'admin-1' }),
      ).rejects.toMatchObject({ code: 'refund_not_supported_for_payment_method' });
    }
  });

  it('dealer_not_found — bayi profili eksikse iade olmaz', async () => {
    txSelectResults = [[paidCreditOrder], []];
    await expect(
      refundDealerCreditOrder({ orderId: 'order-1', adminUserId: 'admin-1' }),
    ).rejects.toMatchObject({ code: 'dealer_not_found' });
  });

  it('basarili iade: insert + 2x update, iade nedeni aktarilir', async () => {
    txSelectResults = [[paidCreditOrder], [dealerProfile]];
    await expect(
      refundDealerCreditOrder({ orderId: 'order-1', adminUserId: 'admin-1', reason: 'musteri_talebi' }),
    ).resolves.toBeUndefined();
    expect(txInsertSpy).toHaveBeenCalledTimes(1); // dealerTransactions kaydı
    expect(txUpdateSpy).toHaveBeenCalledTimes(2); // dealerProfiles + orders
  });

  it('basarili iade: neden verilmezse varsayilan kullanilir', async () => {
    txSelectResults = [[paidCreditOrder], [dealerProfile]];
    await expect(
      refundDealerCreditOrder({ orderId: 'order-1', adminUserId: null }),
    ).resolves.toBeUndefined();
    expect(txInsertSpy).toHaveBeenCalledTimes(1);
  });
});
