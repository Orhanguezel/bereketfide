export type DealerCatalogProduct = {
  id: string;
  title: string;
  slug: string;
  images?: string[];
  list_price: string;
  unit_price: string;
  discount_percent: number;
  product_code?: string | null;
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
  | { provider: 'nestpay_isbank' | 'halkode' | 'ziraatpay'; formHtml: string };
