import { baseApi } from '@/integrations/baseApi';

export type ExtraStatus = 'draft' | 'published' | 'reserved' | 'sold_out' | 'archived';
export type ExtraRequestStatus = 'new' | 'contacted' | 'approved' | 'rejected' | 'cancelled';

export type ExtraSeedling = {
  id: string;
  category: string;
  product_name: string;
  tray_type: number;
  quantity: number;
  available_on: string | null;
  availability_label: string | null;
  status: ExtraStatus;
  image_url: string | null;
  note: string | null;
  source_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ExtraSeedlingInput = {
  category: string;
  product_name: string;
  tray_type: number;
  quantity: number;
  available_on?: string | null;
  availability_label?: string | null;
  status: ExtraStatus;
  image_url?: string | null;
  note?: string | null;
  source_date?: string | null;
};

export type ExtraSeedlingRequest = {
  id: string;
  extra_seedling_id: string;
  dealer_user_id: string | null;
  dealer_name: string | null;
  dealer_phone: string | null;
  requested_quantity: number;
  note: string | null;
  status: ExtraRequestStatus;
  created_at: string;
  updated_at: string;
};

const B = '/admin/extras';

export const extrasAdminApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (build) => ({
    listExtrasAdmin: build.query<{ items: ExtraSeedling[]; total: number }, { search?: string; category?: string; status?: string; limit?: number; offset?: number } | undefined>({
      query: (params) => ({ url: B, params: params ?? undefined }),
      providesTags: [{ type: 'InventoryCache' as const, id: 'EXTRAS' }],
    }),

    createExtraAdmin: build.mutation<{ item: ExtraSeedling }, ExtraSeedlingInput>({
      query: (body) => ({ url: B, method: 'POST', body }),
      invalidatesTags: [{ type: 'InventoryCache' as const, id: 'EXTRAS' }],
    }),

    updateExtraAdmin: build.mutation<{ ok: true }, { id: string; body: ExtraSeedlingInput }>({
      query: ({ id, body }) => ({ url: `${B}/${encodeURIComponent(id)}`, method: 'PATCH', body }),
      invalidatesTags: [{ type: 'InventoryCache' as const, id: 'EXTRAS' }],
    }),

    deleteExtraAdmin: build.mutation<{ ok: true }, { id: string }>({
      query: ({ id }) => ({ url: `${B}/${encodeURIComponent(id)}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'InventoryCache' as const, id: 'EXTRAS' }],
    }),

    listExtraRequestsAdmin: build.query<{ items: Array<{ request: ExtraSeedlingRequest; extra: ExtraSeedling | null }> }, { status?: string; limit?: number } | undefined>({
      query: (params) => ({ url: `${B}/requests`, params: params ?? undefined }),
      providesTags: [{ type: 'InventoryCache' as const, id: 'EXTRA_REQUESTS' }],
    }),

    updateExtraRequestAdmin: build.mutation<{ ok: true }, { id: string; status: ExtraRequestStatus }>({
      query: ({ id, status }) => ({ url: `${B}/requests/${encodeURIComponent(id)}`, method: 'PATCH', body: { status } }),
      invalidatesTags: [{ type: 'InventoryCache' as const, id: 'EXTRA_REQUESTS' }],
    }),
  }),
});

export const {
  useListExtrasAdminQuery,
  useCreateExtraAdminMutation,
  useUpdateExtraAdminMutation,
  useDeleteExtraAdminMutation,
  useListExtraRequestsAdminQuery,
  useUpdateExtraRequestAdminMutation,
} = extrasAdminApi;
