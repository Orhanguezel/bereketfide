import { baseApi } from '@/integrations/baseApi';
import type { ThemeConfig, ThemeUpdateInput } from '@/integrations/shared/theme.types';

export const themeAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getThemeAdmin: b.query<ThemeConfig, void>({
      query: () => ({ url: '/admin/theme', method: 'GET' }),
      providesTags: [{ type: 'SiteSettings' as const, id: 'THEME' }],
      keepUnusedDataFor: 120,
    }),

    updateThemeAdmin: b.mutation<ThemeConfig, ThemeUpdateInput>({
      query: (body) => ({ url: '/admin/theme', method: 'PUT', body }),
      invalidatesTags: [{ type: 'SiteSettings' as const, id: 'THEME' }],
    }),

    resetThemeAdmin: b.mutation<ThemeConfig, void>({
      query: () => ({ url: '/admin/theme/reset', method: 'POST' }),
      invalidatesTags: [{ type: 'SiteSettings' as const, id: 'THEME' }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetThemeAdminQuery,
  useUpdateThemeAdminMutation,
  useResetThemeAdminMutation,
} = themeAdminApi;
