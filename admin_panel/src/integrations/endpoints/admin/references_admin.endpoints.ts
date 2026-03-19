import { baseApi } from '@/integrations/baseApi';
import type {
  ReferenceDto,
  ReferenceListQueryParams,
  ReferenceListResponse,
  ReferenceUpsertPayload,
} from '@/integrations/shared';
import { serializeReferenceListQuery } from '@/integrations/shared';

const BASE = '/admin/references';

export const referencesAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listReferencesAdmin: build.query<ReferenceListResponse, ReferenceListQueryParams | void>({
      query: (params) => ({
        url: BASE,
        method: 'GET',
        params: serializeReferenceListQuery(params),
      }),
      transformResponse: (response: ReferenceDto[], meta): ReferenceListResponse => {
        const totalHeader = meta?.response?.headers?.get('x-total-count') ?? '0';
        const total = Number(totalHeader) || 0;
        return {
          items: Array.isArray(response) ? response : [],
          total,
        };
      },
      providesTags: (result) =>
        result?.items?.length
          ? [
              { type: 'Brand' as const, id: 'REFERENCES_LIST' },
              ...result.items.map((item) => ({ type: 'Brand' as const, id: item.id })),
            ]
          : [{ type: 'Brand' as const, id: 'REFERENCES_LIST' }],
    }),

    getReferenceAdmin: build.query<ReferenceDto, { id: string; locale?: string }>({
      query: ({ id, locale }) => ({
        url: `${BASE}/${encodeURIComponent(id)}`,
        method: 'GET',
        params: locale ? { locale } : undefined,
      }),
      providesTags: (_res, _err, arg) => [{ type: 'Brand' as const, id: arg.id }],
    }),

    createReferenceAdmin: build.mutation<ReferenceDto, ReferenceUpsertPayload>({
      query: (payload) => ({
        url: BASE,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Brand' as const, id: 'REFERENCES_LIST' }],
    }),

    updateReferenceAdmin: build.mutation<
      ReferenceDto,
      { id: string; patch: Partial<ReferenceUpsertPayload> }
    >({
      query: ({ id, patch }) => ({
        url: `${BASE}/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Brand' as const, id: 'REFERENCES_LIST' },
        { type: 'Brand' as const, id: arg.id },
      ],
    }),

    deleteReferenceAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `${BASE}/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Brand' as const, id: 'REFERENCES_LIST' },
        { type: 'Brand' as const, id },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListReferencesAdminQuery,
  useGetReferenceAdminQuery,
  useCreateReferenceAdminMutation,
  useUpdateReferenceAdminMutation,
  useDeleteReferenceAdminMutation,
} = referencesAdminApi;
