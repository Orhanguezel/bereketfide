// =============================================================
// FILE: src/integrations/shared/comment_admin.types.ts
// Admin Comments
// =============================================================

export interface AdminCommentDto {
  id: string;
  target_type: string;
  target_id: string;
  parent_id: string | null;
  author_name: string;
  author_email: string | null;
  content: string;
  image_url: string | null;
  is_approved: boolean;
  is_active: boolean;
  ip_address: string | null;
  user_agent: string | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminCommentListParams {
  target_type?: string;
  target_id?: string;
  is_approved?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sort?: 'created_at' | 'updated_at' | 'likes_count';
  order?: 'asc' | 'desc';
}

export interface AdminCommentUpdatePayload {
  author_name?: string;
  author_email?: string | null;
  content?: string;
  image_url?: string | null;
  is_approved?: boolean;
  is_active?: boolean;
}
