import { datetime, decimal, int, mysqlEnum, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const inventoryCache = mysqlTable('inventory_cache', {
  malzeme_kodu:     varchar('malzeme_kodu', { length: 20 }).primaryKey(),
  malzeme_adi:      varchar('malzeme_adi', { length: 255 }).notNull().default(''),
  ozel_kodu:        varchar('ozel_kodu', { length: 100 }),
  devir:            int('devir').notNull().default(0),
  devir_tutari:     decimal('devir_tutari', { precision: 15, scale: 2 }).notNull().default('0'),
  girisler:         int('girisler').notNull().default(0),
  girisler_tutari:  decimal('girisler_tutari', { precision: 15, scale: 2 }).notNull().default('0'),
  cikislar:         int('cikislar').notNull().default(0),
  cikislar_tutari:  decimal('cikislar_tutari', { precision: 15, scale: 2 }).notNull().default('0'),
  envanter_miktari: int('envanter_miktari').notNull().default(0),
  ortalama_fiyat:   decimal('ortalama_fiyat', { precision: 15, scale: 4 }).notNull().default('0'),
  envanter_tutari:  decimal('envanter_tutari', { precision: 15, scale: 2 }).notNull().default('0'),
  synced_at:        datetime('synced_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at:       datetime('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const inventorySyncLog = mysqlTable('inventory_sync_log', {
  id:           int('id').autoincrement().primaryKey(),
  synced_at:    datetime('synced_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  total_rows:   int('total_rows').notNull().default(0),
  changed_rows: int('changed_rows').notNull().default(0),
  new_rows:     int('new_rows').notNull().default(0),
  duration_ms:  int('duration_ms').notNull().default(0),
  status:       mysqlEnum('status', ['ok', 'error']).notNull().default('ok'),
  error_msg:    text('error_msg'),
});

export type InventoryRow = typeof inventoryCache.$inferSelect;
