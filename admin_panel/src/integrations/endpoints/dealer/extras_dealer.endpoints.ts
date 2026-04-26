import { baseApi } from '@/integrations/baseApi';
import type { ExtraSeedling } from '@/integrations/endpoints/admin/extras_admin.endpoints';

export type DealerExtraRequestInput = {
  extra_seedling_id: string;
  requested_quantity: number;
  dealer_name?: string | null;
  dealer_phone?: string | null;
  note?: string | null;
};

export const extrasDealerApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (build) => ({
    listExtrasDealer: build.query<{ items: ExtraSeedling[] }, { category?: string; tray_type?: number } | undefined>({
      query: (params) => ({ url: '/dealer/extras', params: params ?? undefined }),
      providesTags: [{ type: 'InventoryCache' as const, id: 'DEALER_EXTRAS' }],
    }),

    createExtraRequestDealer: build.mutation<{ request: unknown }, DealerExtraRequestInput>({
      query: (body) => ({ url: '/dealer/extras/requests', method: 'POST', body }),
      invalidatesTags: [{ type: 'InventoryCache' as const, id: 'DEALER_EXTRAS' }],
    }),
  }),
});

export const {
  useListExtrasDealerQuery,
  useCreateExtraRequestDealerMutation,
} = extrasDealerApi;
