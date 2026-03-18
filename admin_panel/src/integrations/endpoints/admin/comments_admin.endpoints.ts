// =============================================================
// FILE: src/integrations/endpoints/admin/comments_admin.endpoints.ts
// Admin Comments (LIST + CRUD)
// =============================================================

import { baseApi } from '@/integrations/baseApi';
import type {
  AdminCommentDto,
  AdminCommentListParams,
  AdminCommentUpdatePayload,
} from '@/integrations/shared/comment_admin.types';

export const commentsAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // -------- LIST (admin) --------
    listCommentsAdmin: build.query<AdminCommentDto[], AdminCommentListParams | void>({
      query: (params) => ({
        url: '/admin/comments',
        method: 'GET',
        params: params || undefined,
      }),
    }),

    // -------- DETAIL (admin) --------
    getCommentAdmin: build.query<AdminCommentDto, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/comments/${encodeURIComponent(id)}`,
        method: 'GET',
      }),
    }),

    // -------- UPDATE (admin) --------
    updateCommentAdmin: build.mutation<
      AdminCommentDto,
      { id: string; patch: AdminCommentUpdatePayload }
    >({
      query: ({ id, patch }) => ({
        url: `/admin/comments/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
      }),
    }),

    // -------- DELETE (admin) --------
    deleteCommentAdmin: build.mutation<{ ok?: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/comments/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useListCommentsAdminQuery,
  useGetCommentAdminQuery,
  useUpdateCommentAdminMutation,
  useDeleteCommentAdminMutation,
} = commentsAdminApi;
