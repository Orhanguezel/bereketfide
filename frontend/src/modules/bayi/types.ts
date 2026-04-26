export type DealerCatalogProduct = {
  id: string;
  title: string;
  slug: string;
  image_url?: string | null;
  images?: string[];
  list_price: string;
  unit_price: string;
  discount_percent: number;
  product_code?: string | null;
  category?: {
    id?: string | null;
    name?: string | null;
    slug?: string | null;
  } | null;
};

export type DealerCatalogResponse = {
  data: DealerCatalogProduct[];
  total: number;
  discount_rate: number;
};

export type OrderRow = {
  id: string;
  status: string;
  total: string;
  payment_method: string | null;
  payment_status: string;
  created_at: string;
  notes?: string | null;
};

export type OrderItemRow = {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  product_title?: string | null;
};

export type OrderDetail = OrderRow & {
  items: OrderItemRow[];
};

export type OrdersListResponse = {
  data: OrderRow[];
  total: number;
  page: number;
  limit: number;
};

export type FinanceSummary = {
  credit_limit: number;
  current_balance: number;
  available: number;
  discount_rate: number;
  transaction_count: number;
  totals_by_type: Record<string, number>;
  overdue_count: number;
  warnings: string[];
};

export type DealerTransactionRow = {
  id: string;
  type: string;
  amount: string;
  balance_after: string;
  description: string | null;
  order_id: string | null;
  due_date: string | null;
  created_at: string;
};

export type TransactionsListResponse = {
  data: DealerTransactionRow[];
  total: number;
  page: number;
  limit: number;
};

export type DealerDirectCardInitResponse =
  | { provider: 'craftgate'; pageUrl: string; checkoutId?: string }
  | { provider: 'ziraatpay'; pageUrl: string }
  | { provider: 'nestpay_isbank' | 'halkode' | 'ziraatpay'; formHtml: string }
  | { provider: 'halkode'; redirectUrl: string };

export type DealerExtraSeedling = {
  id: string;
  category: string;
  product_name: string;
  tray_type: number;
  quantity: number;
  available_on: string | null;
  availability_label: string | null;
  status: 'draft' | 'published' | 'reserved' | 'sold_out' | 'archived';
  image_url: string | null;
  note: string | null;
  source_date: string | null;
  created_at?: string;
  updated_at?: string;
};

export type DealerExtrasResponse = {
  items: DealerExtraSeedling[];
};

export type DealerExtraRequest = {
  id: string;
  extra_seedling_id: string;
  dealer_user_id: string | null;
  dealer_name: string | null;
  dealer_phone: string | null;
  requested_quantity: number;
  note: string | null;
  status: 'new' | 'contacted' | 'approved' | 'rejected' | 'cancelled';
};
