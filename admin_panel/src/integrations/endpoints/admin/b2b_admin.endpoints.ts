import { baseApi } from '@/integrations/baseApi';

const ORDERS = '/admin/orders';
const DEALERS = '/admin/dealers';

export type AdminOrderRow = {
  id: string;
  dealer_id: string;
  dealer_name: string | null;
  seller_id: string | null;
  seller_name: string | null;
  status: string;
  total: string;
  notes: string | null;
  payment_method: string | null;
  payment_status: string;
  payment_ref: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminOrderItemRow = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  created_at: string;
  product_title?: string | null;
};

export type AdminOrderDetail = AdminOrderRow & { items: AdminOrderItemRow[] };

export type AdminPaymentAttemptRow = {
  id: string;
  order_id: string;
  payment_ref: string;
  provider: string;
  status: 'pending' | 'succeeded' | 'failed' | 'expired';
  amount: string;
  request_payload: string | null;
  response_payload: string | null;
  callback_payload: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
  order_status: string;
  order_payment_status: string;
  order_payment_method: string | null;
};

export type AdminPaymentAttemptDetail = AdminPaymentAttemptRow & {
  order_total: string;
  dealer_id: string;
};

export type AdminPaymentAttemptsListResponse = {
  data: AdminPaymentAttemptRow[];
  total: number;
  page: number;
  limit: number;
};

export type AdminOrdersListResponse = {
  data: AdminOrderRow[];
  total: number;
  page: number;
  limit: number;
};

export type AdminDealerProfileRow = {
  id: string;
  user_id: string;
  company_name: string | null;
  city: string | null;
  region: string | null;
  tax_number: string | null;
  tax_office: string | null;
  credit_limit: string;
  risk_limit: string;
  current_balance: string;
  discount_rate: string;
  ecosystem_id: string | null;
  is_approved: number;
  list_public: number;
  created_at: string;
  updated_at: string;
};

export type AdminDealersListResponse = {
  data: AdminDealerProfileRow[];
  total: number;
  page: number;
  limit: number;
};

export type AdminFinanceSummary = {
  credit_limit: number;
  current_balance: number;
  available: number;
  discount_rate: number;
  transaction_count: number;
  totals_by_type: Record<string, number>;
  overdue_count: number;
  warnings: string[];
};

export type AdminDealerTxRow = {
  id: string;
  dealer_id: string;
  order_id: string | null;
  type: string;
  amount: string;
  balance_after: string;
  description: string | null;
  due_date: string | null;
  created_at: string;
};

export type AdminDealerTxListResponse = {
  data: AdminDealerTxRow[];
  total: number;
  page: number;
  limit: number;
};

export const b2bAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    adminB2bOrdersList: b.query<
      AdminOrdersListResponse,
      { page?: number; limit?: number; status?: string } | void
    >({
      query: (params) => ({
        url: ORDERS,
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 30,
          status: params?.status || undefined,
        },
      }),
      providesTags: (res) =>
        res?.data?.length
          ? [
              ...res.data.map((o) => ({ type: 'Orders' as const, id: o.id })),
              { type: 'Orders' as const, id: 'B2B_LIST' },
            ]
          : [{ type: 'Orders' as const, id: 'B2B_LIST' }],
    }),

    adminB2bOrderDetail: b.query<AdminOrderDetail, string>({
      query: (id) => ({ url: `${ORDERS}/${encodeURIComponent(id)}`, method: 'GET' }),
      providesTags: (_r, _e, id) => [{ type: 'Orders' as const, id }],
    }),

    adminB2bOrderStatus: b.mutation<AdminOrderDetail, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `${ORDERS}/${encodeURIComponent(id)}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: 'Orders' as const, id: arg.id },
        { type: 'Orders' as const, id: 'B2B_LIST' },
      ],
    }),

    adminB2bOrderSeller: b.mutation<AdminOrderDetail, { id: string; seller_id: string | null }>({
      query: ({ id, seller_id }) => ({
        url: `${ORDERS}/${encodeURIComponent(id)}/seller`,
        method: 'PATCH',
        body: { seller_id },
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: 'Orders' as const, id: arg.id },
        { type: 'Orders' as const, id: 'B2B_LIST' },
      ],
    }),

    adminB2bOrderDelete: b.mutation<void, string>({
      query: (id) => ({ url: `${ORDERS}/${encodeURIComponent(id)}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Orders' as const, id },
        { type: 'Orders' as const, id: 'B2B_LIST' },
      ],
    }),

    adminB2bOrderRefund: b.mutation<AdminOrderDetail, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `${ORDERS}/${encodeURIComponent(id)}/refund`,
        method: 'POST',
        body: reason?.trim() ? { reason: reason.trim() } : {},
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: 'Orders' as const, id: arg.id },
        { type: 'Orders' as const, id: 'B2B_LIST' },
        { type: 'Payment' as const, id: 'ATTEMPTS_LIST' },
      ],
    }),

    adminB2bPaymentAttemptsList: b.query<
      AdminPaymentAttemptsListResponse,
      {
        page?: number;
        limit?: number;
        order_id?: string;
        provider?: string;
        status?: string;
      } | void
    >({
      query: (params) => ({
        url: `${ORDERS}/payment-attempts`,
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 50,
          order_id: params?.order_id || undefined,
          provider: params?.provider || undefined,
          status: params?.status || undefined,
        },
      }),
      providesTags: (res) =>
        res?.data?.length
          ? [
              ...res.data.map((a) => ({ type: 'Payment' as const, id: a.payment_ref })),
              { type: 'Payment' as const, id: 'ATTEMPTS_LIST' },
            ]
          : [{ type: 'Payment' as const, id: 'ATTEMPTS_LIST' }],
    }),

    adminB2bPaymentAttemptDetail: b.query<AdminPaymentAttemptDetail, string>({
      query: (paymentRef) => ({
        url: `${ORDERS}/payment-attempts/${encodeURIComponent(paymentRef)}`,
        method: 'GET',
      }),
      providesTags: (_r, _e, paymentRef) => [{ type: 'Payment' as const, id: paymentRef }],
    }),

    adminB2bDealersList: b.query<
      AdminDealersListResponse,
      { page?: number; limit?: number; search?: string; is_approved?: number } | void
    >({
      query: (params) => ({
        url: DEALERS,
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 30,
          search: params?.search?.trim() || undefined,
          is_approved:
            params?.is_approved === undefined || Number.isNaN(params.is_approved)
              ? undefined
              : params.is_approved,
        },
      }),
      providesTags: (res) =>
        res?.data?.length
          ? [
              ...res.data.map((d) => ({ type: 'User' as const, id: `dealer-${d.id}` })),
              { type: 'Users' as const, id: 'DEALERS_LIST' },
            ]
          : [{ type: 'Users' as const, id: 'DEALERS_LIST' }],
    }),

    adminB2bDealerDetail: b.query<AdminDealerProfileRow, string>({
      query: (id) => ({ url: `${DEALERS}/${encodeURIComponent(id)}`, method: 'GET' }),
      providesTags: (_r, _e, id) => [{ type: 'User' as const, id: `dealer-${id}` }],
    }),

    adminB2bDealerSummary: b.query<AdminFinanceSummary, string>({
      query: (id) => ({
        url: `${DEALERS}/${encodeURIComponent(id)}/finance/summary`,
        method: 'GET',
      }),
      providesTags: (_r, _e, id) => [{ type: 'User' as const, id: `dealer-sum-${id}` }],
    }),

    adminB2bDealerTransactions: b.query<
      AdminDealerTxListResponse,
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 40 }) => ({
        url: `${DEALERS}/${encodeURIComponent(id)}/transactions`,
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: (_r, _e, arg) => [{ type: 'User' as const, id: `dealer-tx-${arg.id}` }],
    }),

    adminB2bDealerUpdate: b.mutation<
      AdminDealerProfileRow,
      {
        id: string;
        body: Partial<{
          company_name: string;
          tax_number: string;
          tax_office: string;
          credit_limit: string;
          risk_limit: string;
          discount_rate: string;
          ecosystem_id: string | null;
          is_approved: 0 | 1;
        }>;
      }
    >({
      query: ({ id, body }) => ({
        url: `${DEALERS}/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: 'User' as const, id: `dealer-${arg.id}` },
        { type: 'User' as const, id: `dealer-sum-${arg.id}` },
        { type: 'Users' as const, id: 'DEALERS_LIST' },
      ],
    }),

    adminB2bDealerCreateTx: b.mutation<
      { id: string; balance_after: number },
      {
        id: string;
        body: {
          type: 'order' | 'payment' | 'adjustment' | 'refund';
          amount: string;
          description?: string;
          order_id?: string;
          due_date?: string;
        };
      }
    >({
      query: ({ id, body }) => ({
        url: `${DEALERS}/${encodeURIComponent(id)}/transactions`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: 'User' as const, id: `dealer-${arg.id}` },
        { type: 'User' as const, id: `dealer-sum-${arg.id}` },
        { type: 'User' as const, id: `dealer-tx-${arg.id}` },
        { type: 'Users' as const, id: 'DEALERS_LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAdminB2bOrdersListQuery,
  useAdminB2bOrderDetailQuery,
  useAdminB2bOrderStatusMutation,
  useAdminB2bOrderSellerMutation,
  useAdminB2bOrderDeleteMutation,
  useAdminB2bOrderRefundMutation,
  useAdminB2bPaymentAttemptsListQuery,
  useAdminB2bPaymentAttemptDetailQuery,
  useAdminB2bDealersListQuery,
  useAdminB2bDealerDetailQuery,
  useAdminB2bDealerSummaryQuery,
  useAdminB2bDealerTransactionsQuery,
  useAdminB2bDealerUpdateMutation,
  useAdminB2bDealerCreateTxMutation,
} = b2bAdminApi;
