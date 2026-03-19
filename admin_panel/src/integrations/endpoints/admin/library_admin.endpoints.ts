// =============================================================
// FILE: src/integrations/endpoints/admin/library_admin.endpoints.ts
// Bereket Fide – Admin Library (Katalog) RTK Endpoints
// Base URL: /api (baseApi)
// Backend: /admin/library
// =============================================================

import { baseApi } from '@/integrations/baseApi';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface LibraryAdminDto {
  id: string;
  type: string;
  category_id: string | null;
  sub_category_id: string | null;
  featured: boolean;
  is_published: boolean;
  is_active: boolean;
  display_order: number;
  featured_image: string | null;
  image_url: string | null;
  image_asset_id: string | null;
  views: number;
  download_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // i18n fields
  locale?: string;
  slug?: string;
  name?: string;
  description?: string;
  image_alt?: string;
  tags?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  // files
  files?: LibraryFileDto[];
}

export interface LibraryFileDto {
  id: string;
  library_id: string;
  asset_id: string | null;
  file_url: string;
  name: string;
  size_bytes: number | null;
  mime_type: string;
  tags_json: string;
  display_order: number;
  is_active: boolean;
}

export interface LibraryListParams {
  locale?: string;
  type?: string;
  q?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: string;
  is_published?: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const cleanParams = (
  params?: Record<string, unknown>,
): Record<string, string | number | boolean> | undefined => {
  if (!params) return undefined;
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '' || (typeof v === 'number' && Number.isNaN(v)))
      continue;
    if (typeof v === 'boolean' || typeof v === 'number' || typeof v === 'string') out[k] = v;
    else out[k] = String(v);
  }
  return Object.keys(out).length ? out : undefined;
};

const getTotalFromHeaders = (headers: Headers | undefined, fallbackLength: number): number => {
  const headerValue = headers?.get('x-total-count') ?? headers?.get('X-Total-Count');
  if (!headerValue) return fallbackLength;
  const n = Number(headerValue);
  return Number.isFinite(n) && n >= 0 ? n : fallbackLength;
};

const normalizeList = (raw: unknown): LibraryAdminDto[] => {
  if (Array.isArray(raw)) return raw as LibraryAdminDto[];
  const anyRaw = raw as any;
  if (anyRaw && Array.isArray(anyRaw.items)) return anyRaw.items as LibraryAdminDto[];
  return [];
};

const BASE = '/admin/library';

/* ------------------------------------------------------------------ */
/*  Endpoints                                                          */
/* ------------------------------------------------------------------ */

export const libraryAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* ── List ─────────────────────────────────────────────── */
    listLibraryAdmin: build.query<
      { items: LibraryAdminDto[]; total: number },
      LibraryListParams | void
    >({
      query: (params) => ({
        url: BASE,
        method: 'GET',
        params: cleanParams(params as any),
      }),
      transformResponse: (response: unknown, meta) => {
        const rows = normalizeList(response);
        const total = getTotalFromHeaders(meta?.response?.headers, rows.length);
        return { items: rows, total };
      },
      providesTags: (result) =>
        result?.items?.length
          ? [
              ...result.items.map((p) => ({ type: 'AdminLibrary' as const, id: p.id })),
              { type: 'AdminLibrary' as const, id: 'LIST' },
            ]
          : [{ type: 'AdminLibrary' as const, id: 'LIST' }],
    }),

    /* ── Get by ID ────────────────────────────────────────── */
    getLibraryAdmin: build.query<
      LibraryAdminDto,
      { id: string; locale?: string }
    >({
      query: ({ id, locale }) => ({
        url: `${BASE}/${encodeURIComponent(id)}`,
        method: 'GET',
        params: cleanParams({ locale }),
      }),
      providesTags: (_result, _error, { id }) => [{ type: 'AdminLibrary' as const, id }],
    }),

    /* ── Create ───────────────────────────────────────────── */
    createLibraryAdmin: build.mutation<LibraryAdminDto, Partial<LibraryAdminDto>>({
      query: (body) => ({
        url: BASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AdminLibrary' as const, id: 'LIST' }],
    }),

    /* ── Update ───────────────────────────────────────────── */
    updateLibraryAdmin: build.mutation<
      LibraryAdminDto,
      { id: string; patch: Partial<LibraryAdminDto> }
    >({
      query: ({ id, patch }) => ({
        url: `${BASE}/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'AdminLibrary' as const, id },
        { type: 'AdminLibrary' as const, id: 'LIST' },
      ],
    }),

    /* ── Delete ───────────────────────────────────────────── */
    deleteLibraryAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `${BASE}/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'AdminLibrary' as const, id },
        { type: 'AdminLibrary' as const, id: 'LIST' },
      ],
    }),

    /* ── Reorder ──────────────────────────────────────────── */
    reorderLibraryAdmin: build.mutation<
      { ok: boolean },
      { items: { id: string; display_order: number }[] }
    >({
      query: (payload) => ({
        url: `${BASE}/reorder`,
        method: 'POST',
        body: payload,
      }),
      transformResponse: () => ({ ok: true }),
      invalidatesTags: [{ type: 'AdminLibrary' as const, id: 'LIST' }],
    }),

    /* ── List Files ───────────────────────────────────────── */
    listLibraryFilesAdmin: build.query<
      LibraryFileDto[],
      { id: string }
    >({
      query: ({ id }) => ({
        url: `${BASE}/${encodeURIComponent(id)}/files`,
        method: 'GET',
      }),
      transformResponse: (response: unknown) => {
        if (Array.isArray(response)) return response as LibraryFileDto[];
        const anyRaw = response as any;
        if (anyRaw && Array.isArray(anyRaw.items)) return anyRaw.items as LibraryFileDto[];
        return [];
      },
      providesTags: (_result, _error, { id }) => [
        { type: 'AdminLibraryFiles' as const, id },
      ],
    }),

    /* ── Create File ──────────────────────────────────────── */
    createLibraryFileAdmin: build.mutation<
      LibraryFileDto,
      { id: string; body: Partial<LibraryFileDto> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE}/${encodeURIComponent(id)}/files`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'AdminLibraryFiles' as const, id },
        { type: 'AdminLibrary' as const, id },
      ],
    }),

    /* ── Delete File ──────────────────────────────────────── */
    deleteLibraryFileAdmin: build.mutation<void, { id: string; fileId: string }>({
      query: ({ id, fileId }) => ({
        url: `${BASE}/${encodeURIComponent(id)}/files/${encodeURIComponent(fileId)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'AdminLibraryFiles' as const, id },
        { type: 'AdminLibrary' as const, id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListLibraryAdminQuery,
  useLazyListLibraryAdminQuery,
  useGetLibraryAdminQuery,
  useLazyGetLibraryAdminQuery,
  useCreateLibraryAdminMutation,
  useUpdateLibraryAdminMutation,
  useDeleteLibraryAdminMutation,
  useReorderLibraryAdminMutation,
  useListLibraryFilesAdminQuery,
  useCreateLibraryFileAdminMutation,
  useDeleteLibraryFileAdminMutation,
} = libraryAdminApi;
