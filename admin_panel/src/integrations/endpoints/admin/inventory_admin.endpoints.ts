// =============================================================
// FILE: src/integrations/endpoints/admin/inventory_admin.endpoints.ts
// Bereket Fide – Admin Inventory Cache (RTK Query)
// =============================================================

import { baseApi } from '@/integrations/baseApi';

export type InventoryItem = {
  malzeme_kodu:     string;
  malzeme_adi:      string;
  ozel_kodu:        string | null;
  devir:            number;
  devir_tutari:     string;
  girisler:         number;
  girisler_tutari:  string;
  cikislar:         number;
  cikislar_tutari:  string;
  envanter_miktari: number;
  ortalama_fiyat:   string;
  envanter_tutari:  string;
  synced_at:        string;
  updated_at:       string;
};

export type InventorySyncLog = {
  id:           number;
  synced_at:    string;
  total_rows:   number;
  changed_rows: number;
  new_rows:     number;
  duration_ms:  number;
  status:       'ok' | 'error';
  error_msg:    string | null;
};

export type InventoryStats = {
  total_products: number;
  total_stock:    number;
  last_synced_at: string | null;
  last_sync:      InventorySyncLog | null;
};

export type InventoryListParams = {
  search?: string;
  limit?:  number;
  offset?: number;
};

const B = '/admin/inventory';

export const inventoryAdminApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (build) => ({

    getInventoryStatsAdmin: build.query<InventoryStats, void>({
      query: () => ({ url: `${B}/stats` }),
      providesTags: [{ type: 'InventoryCache' as const, id: 'STATS' }],
    }),

    listInventoryAdmin: build.query<{ items: InventoryItem[]; total: number }, InventoryListParams | void>({
      query: (params) => ({ url: B, params: params ?? undefined }),
      providesTags: [{ type: 'InventoryCache' as const, id: 'LIST' }],
    }),

    listInventorySyncLogsAdmin: build.query<{ items: InventorySyncLog[] }, { limit?: number; offset?: number } | void>({
      query: (params) => ({ url: `${B}/sync-logs`, params: params ?? undefined }),
      providesTags: [{ type: 'InventorySyncLog' as const, id: 'LIST' }],
    }),

  }),
});

export const {
  useGetInventoryStatsAdminQuery,
  useListInventoryAdminQuery,
  useListInventorySyncLogsAdminQuery,
} = inventoryAdminApi;
