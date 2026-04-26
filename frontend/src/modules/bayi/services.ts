import api from '@/lib/axios';
import type {
  DealerCatalogResponse,
  DealerDirectCardInitResponse,
  DealerExtraRequest,
  DealerExtrasResponse,
  FinanceSummary,
  OrderDetail,
  OrdersListResponse,
  TransactionsListResponse,
} from './types';

export async function fetchDealerCatalog(params: {
  locale: string;
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<DealerCatalogResponse> {
  const res = await api.get<DealerCatalogResponse>('/dealer/products', {
    params: {
      locale: params.locale,
      limit: params.limit ?? 24,
      offset: params.offset ?? 0,
      q: params.q?.trim() || undefined,
    },
  });
  return res.data;
}

export async function fetchOrdersList(params: {
  page?: number;
  limit?: number;
}): Promise<OrdersListResponse> {
  const res = await api.get<OrdersListResponse>('/orders', {
    params: { page: params.page ?? 1, limit: params.limit ?? 20 },
  });
  return res.data;
}

export async function fetchOrderById(id: string): Promise<OrderDetail> {
  const res = await api.get<OrderDetail>(`/orders/${id}`);
  return res.data;
}

export async function createOrder(body: {
  items: { product_id: string; quantity: number }[];
  notes?: string | null;
}): Promise<OrderDetail> {
  const res = await api.post<OrderDetail>('/orders', body);
  return res.data;
}

export async function cancelOrder(id: string): Promise<OrderDetail> {
  const res = await api.patch<OrderDetail>(`/orders/${id}/cancel`);
  return res.data;
}

export async function postOrderBankTransfer(id: string): Promise<void> {
  await api.post(`/orders/${id}/payment/bank-transfer`);
}

export async function postOrderCreditPayment(id: string): Promise<void> {
  await api.post(`/orders/${id}/payment/credit`);
}

export type OrderIyzicoInitResponse = {
  provider: 'iyzico';
  checkoutFormContent: string;
  token?: string;
  conversationId?: string;
  amount: number;
};

export async function postOrderIyzicoInitiate(
  id: string,
  locale: string,
  installment = 1,
): Promise<OrderIyzicoInitResponse> {
  const res = await api.post<OrderIyzicoInitResponse>(
    `/orders/${id}/payment/iyzico/initiate`,
    undefined,
    { params: { locale, installment } },
  );
  return res.data;
}

export type OrderCardInitResponse = DealerDirectCardInitResponse;

export async function postOrderCardInitiate(
  id: string,
  locale: string,
  installment = 1,
): Promise<OrderCardInitResponse> {
  const res = await api.post<OrderCardInitResponse>(
    `/orders/${id}/payment/card/initiate`,
    undefined,
    { params: { locale, installment } },
  );
  return res.data;
}

export async function fetchFinanceSummary(): Promise<FinanceSummary> {
  const res = await api.get<FinanceSummary>('/dealer/finance/summary');
  return res.data;
}

export async function postDealerDirectCardInitiate(body: {
  amount: number;
  locale: string;
  cc_holder_name?: string;
  cc_no?: string;
  exp_month?: string;
  exp_year?: string;
  cvv?: string;
}): Promise<DealerDirectCardInitResponse> {
  const res = await api.post<DealerDirectCardInitResponse>(
    '/dealer/finance/direct-payment/card/initiate',
    body,
  );
  return res.data;
}

export async function fetchTransactions(params: {
  page?: number;
  limit?: number;
}): Promise<TransactionsListResponse> {
  const res = await api.get<TransactionsListResponse>('/dealer/transactions', {
    params: { page: params.page ?? 1, limit: params.limit ?? 25 },
  });
  return res.data;
}

export async function downloadFinanceStatementPdf(): Promise<void> {
  const res = await api.get<Blob>('/dealer/finance/statement.pdf', {
    responseType: 'blob',
  });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cari-ekstre.pdf';
  a.click();
  URL.revokeObjectURL(url);
}

export async function fetchDealerExtras(params?: {
  category?: string;
  tray_type?: number;
}): Promise<DealerExtrasResponse> {
  const res = await api.get<DealerExtrasResponse>('/dealer/extras', {
    params: {
      category: params?.category || undefined,
      tray_type: params?.tray_type || undefined,
    },
  });
  return res.data;
}

export async function createDealerExtraRequest(body: {
  extra_seedling_id: string;
  requested_quantity: number;
  note?: string | null;
}): Promise<{ request: DealerExtraRequest }> {
  const res = await api.post<{ request: DealerExtraRequest }>('/dealer/extras/requests', body);
  return res.data;
}
