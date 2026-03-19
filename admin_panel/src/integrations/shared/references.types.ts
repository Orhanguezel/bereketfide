export interface ReferenceDto {
  id: string;
  is_published: boolean | 0 | 1;
  is_featured: boolean | 0 | 1;
  display_order: number;
  featured_image?: string | null;
  featured_image_asset_id?: string | null;
  website_url?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  category_slug?: string | null;
  title?: string | null;
  slug?: string | null;
  summary?: string | null;
  content?: string | null;
  featured_image_alt?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  locale?: string | null;
  locale_resolved?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type ReferenceListQueryParams = {
  locale?: string;
  q?: string;
  slug?: string;
  is_published?: boolean | 0 | 1;
  is_featured?: boolean | 0 | 1;
  category_id?: string;
  module_key?: string;
  has_website?: boolean | 0 | 1;
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'updated_at' | 'display_order';
  orderDir?: 'asc' | 'desc';
};

export type ReferenceUpsertPayload = {
  locale?: string;
  is_published?: boolean | 0 | 1;
  is_featured?: boolean | 0 | 1;
  display_order?: number;
  featured_image?: string | null;
  featured_image_asset_id?: string | null;
  website_url?: string | null;
  category_id?: string | null;
  title: string;
  slug: string;
  summary?: string | null;
  content?: string;
  featured_image_alt?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
};

export type ReferenceListResponse = {
  items: ReferenceDto[];
  total: number;
};

export function serializeReferenceListQuery(params?: ReferenceListQueryParams | void) {
  if (!params) return undefined;

  const query: Record<string, string | number | boolean> = {};

  if (params.locale) query.locale = params.locale;
  if (params.q) query.q = params.q;
  if (params.slug) query.slug = params.slug;
  if (typeof params.is_published !== 'undefined') query.is_published = params.is_published;
  if (typeof params.is_featured !== 'undefined') query.is_featured = params.is_featured;
  if (params.category_id) query.category_id = params.category_id;
  if (params.module_key) query.module_key = params.module_key;
  if (typeof params.has_website !== 'undefined') query.has_website = params.has_website;
  if (typeof params.limit === 'number') query.limit = params.limit;
  if (typeof params.offset === 'number') query.offset = params.offset;
  if (params.orderBy && params.orderDir) query.order = `${params.orderBy}.${params.orderDir}`;

  return query;
}
