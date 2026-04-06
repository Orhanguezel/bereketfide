import api from '@/lib/axios';

export type DealerBalanceDto = {
  credit_limit: number;
  current_balance: number;
  available: number;
  discount_rate: number;
};

export async function fetchDealerBalance(): Promise<DealerBalanceDto | null> {
  try {
    const res = await api.get<DealerBalanceDto>('/dealer/balance');
    return res.data ?? null;
  } catch {
    return null;
  }
}

/** Onaylı bayi: profil OK. Onaysız: `dealer_not_approved` fırlatır (axios interceptor mesajı). */
export async function assertApprovedDealerProfile(): Promise<void> {
  await api.get('/dealer/profile');
}
