// ===================================================================
// FILE: src/integrations/shared/telegram.ts
// Telegram Admin API types (Bereket Fide)
// ===================================================================

/** Telegram event types for Bereket Fide */
export type TelegramEventType =
  | 'new_contact'
  | 'new_catalog_request'
  | 'new_offer_request'
  | 'new_support_ticket';

/**
 * POST /admin/telegram/send
 * BE: TelegramSendBodySchema
 */
export type TelegramAdminSendBody = {
  title: string;
  message: string;
  type?: string;
  chat_id?: string;
  bot_token?: string;
};

/**
 * POST /admin/telegram/event
 * BE: TelegramEventBodySchema
 */
export type TelegramAdminEventBody = {
  event: string;
  chat_id?: string;
  data?: Record<string, unknown>;
};

/**
 * POST /admin/telegram/test
 * BE: TelegramTestBodySchema
 */
export type TelegramAdminTestBody = {
  chat_id?: string;
};

/**
 * Responses
 */
export type TelegramAdminTestResp = {
  ok: boolean;
  message?: string;
};

/** Generic success response */
export type SimpleSuccessResp = {
  ok: true;
};

/** Backward-compat: legacy notification body */
export type TelegramNotificationBody = Record<string, unknown>;
