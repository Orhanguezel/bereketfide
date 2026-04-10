import { afterEach, beforeAll, describe, expect, it, mock } from 'bun:test';

// ── helpers ────────────────────────────────────────────────────
// payment-credit.service.ts tx select call order:
//   1. tx.select().from(orders)...limit(1)          → order row
//   2. tx.select({ c: count() }).from(orderItems)   → { c: N } (NO .limit())
//   3. tx.select().from(dealerProfiles)...limit(1)  → dealer row

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

let finalizeOrderPaymentWithDealerCredit: typeof import('@agro/shared-backend/modules/orders/payment-credit.service').finalizeOrderPaymentWithDealerCredit;

beforeAll(async () => {
  const mod = await import('@agro/shared-backend/modules/orders/payment-credit.service');
  finalizeOrderPaymentWithDealerCredit = mod.finalizeOrderPaymentWithDealerCredit;
});

afterEach(() => {
  txSelectResults = [];
  txUpdateSpy.mockClear();
  txInsertSpy.mockClear();
});

// ── fixtures ──────────────────────────────────────────────────
const pendingOrder = {
  id: 'order-1',
  dealer_id: 'user-1',
  status: 'pending',
  payment_status: 'unpaid',
  payment_method: null,
  total: '300.00',
};

const dealerProfile = {
  id: 'dealer-profile-1',
  user_id: 'user-1',
  current_balance: '100.00',
  credit_limit: '5000.00',
};

const itemsRow = [{ c: 2 }]; // 2 kalem

// ── tests ─────────────────────────────────────────────────────
describe('finalizeOrderPaymentWithDealerCredit', () => {
  it('order_not_found — siparis yoksa hata firlatir', async () => {
    txSelectResults = [[]];
    await expect(
      finalizeOrderPaymentWithDealerCredit({ userId: 'user-1', orderId: 'ghost' }),
    ).rejects.toMatchObject({ code: 'order_not_found' });
  });

  it('order_not_found — baska bayinin siparisi', async () => {
    txSelectResults = [[{ ...pendingOrder, dealer_id: 'other-user' }]];
    await expect(
      finalizeOrderPaymentWithDealerCredit({ userId: 'user-1', orderId: 'order-1' }),
    ).rejects.toMatchObject({ code: 'order_not_found' });
  });

  it('order_cancelled — iptal edilen siparis odenemez', async () => {
    txSelectResults = [[{ ...pendingOrder, status: 'cancelled' }]];
    await expect(
      finalizeOrderPaymentWithDealerCredit({ userId: 'user-1', orderId: 'order-1' }),
    ).rejects.toMatchObject({ code: 'order_cancelled' });
  });

  it('already_paid — odenmis siparis tekrar odenemez', async () => {
    txSelectResults = [[{ ...pendingOrder, payment_status: 'paid' }]];
    await expect(
      finalizeOrderPaymentWithDealerCredit({ userId: 'user-1', orderId: 'order-1' }),
    ).rejects.toMatchObject({ code: 'already_paid' });
  });

  it('payment_already_in_progress — bekleyen odeme varken ikinci init engellenir', async () => {
    txSelectResults = [[{ ...pendingOrder, payment_status: 'pending' }]];
    await expect(
      finalizeOrderPaymentWithDealerCredit({ userId: 'user-1', orderId: 'order-1' }),
    ).rejects.toMatchObject({ code: 'payment_already_in_progress' });
  });

  it('order_has_no_items — bos siparis odenemez', async () => {
    txSelectResults = [[pendingOrder], [{ c: 0 }]];
    await expect(
      finalizeOrderPaymentWithDealerCredit({ userId: 'user-1', orderId: 'order-1' }),
    ).rejects.toMatchObject({ code: 'order_has_no_items' });
  });

  it('dealer_not_found — bayi profili eksikse ödeme olmaz', async () => {
    txSelectResults = [[pendingOrder], itemsRow, []];
    await expect(
      finalizeOrderPaymentWithDealerCredit({ userId: 'user-1', orderId: 'order-1' }),
    ).rejects.toMatchObject({ code: 'dealer_not_found' });
  });

  it('insufficient_credit — yetersiz cari limitte odeme olmaz', async () => {
    const tightProfile = { ...dealerProfile, credit_limit: '200.00', current_balance: '100.00' };
    // available = 200 - 100 = 100 < 300 (siparis tutari)
    txSelectResults = [[pendingOrder], itemsRow, [tightProfile]];
    await expect(
      finalizeOrderPaymentWithDealerCredit({ userId: 'user-1', orderId: 'order-1' }),
    ).rejects.toMatchObject({ code: 'insufficient_credit' });
  });

  it('basarili odeme: insert + 2x update cagrilir', async () => {
    txSelectResults = [[pendingOrder], itemsRow, [dealerProfile]];
    await expect(
      finalizeOrderPaymentWithDealerCredit({ userId: 'user-1', orderId: 'order-1' }),
    ).resolves.toBeUndefined();
    expect(txInsertSpy).toHaveBeenCalledTimes(1); // dealerTransactions kaydı
    expect(txUpdateSpy).toHaveBeenCalledTimes(2); // dealerProfiles + orders
  });

  it('basarili odeme: tam sinirlimitte cari yeterli', async () => {
    // available = 5000 - 100 = 4900 >= 300
    txSelectResults = [[pendingOrder], itemsRow, [dealerProfile]];
    await expect(
      finalizeOrderPaymentWithDealerCredit({ userId: 'user-1', orderId: 'order-1' }),
    ).resolves.toBeUndefined();
  });
});
