import { date, datetime, int, mysqlEnum, mysqlTable, smallint, text, varchar } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const extraSeedlings = mysqlTable('extra_seedlings', {
  id:                 varchar('id', { length: 36 }).primaryKey(),
  category:           varchar('category', { length: 60 }).notNull(),
  product_name:       varchar('product_name', { length: 255 }).notNull(),
  tray_type:          smallint('tray_type', { unsigned: true }).notNull(),
  quantity:           int('quantity', { unsigned: true }).notNull().default(0),
  available_on:       date('available_on', { mode: 'string' }),
  availability_label: varchar('availability_label', { length: 80 }),
  status:             mysqlEnum('status', ['draft', 'published', 'reserved', 'sold_out', 'archived']).notNull().default('draft'),
  image_url:          varchar('image_url', { length: 500 }),
  note:               text('note'),
  source_date:        date('source_date', { mode: 'string' }),
  created_at:         datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at:         datetime('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const extraSeedlingRequests = mysqlTable('extra_seedling_requests', {
  id:                 varchar('id', { length: 36 }).primaryKey(),
  extra_seedling_id:  varchar('extra_seedling_id', { length: 36 }).notNull(),
  dealer_user_id:     varchar('dealer_user_id', { length: 36 }),
  dealer_name:        varchar('dealer_name', { length: 255 }),
  dealer_phone:       varchar('dealer_phone', { length: 50 }),
  requested_quantity: int('requested_quantity', { unsigned: true }).notNull(),
  note:               text('note'),
  status:             mysqlEnum('status', ['new', 'contacted', 'approved', 'rejected', 'cancelled']).notNull().default('new'),
  created_at:         datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at:         datetime('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type ExtraSeedlingRow = typeof extraSeedlings.$inferSelect;
export type ExtraSeedlingRequestRow = typeof extraSeedlingRequests.$inferSelect;
