import {
  mysqlTable,
  char,
  varchar,
  text,
  datetime,
  index,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const comments = mysqlTable(
  'comments',
  {
    id: char('id', { length: 36 }).primaryKey().notNull(),
    entity_type: varchar('entity_type', { length: 50 }).notNull().default('product'),
    entity_id: char('entity_id', { length: 36 }).notNull(),
    user_id: char('user_id', { length: 36 }),
    author_name: varchar('author_name', { length: 255 }),
    author_email: varchar('author_email', { length: 255 }),
    content: text('content').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    parent_id: char('parent_id', { length: 36 }),
    locale: varchar('locale', { length: 10 }).default('tr'),
    created_at: datetime('created_at', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime('updated_at', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`).$onUpdateFn(() => new Date()),
  },
  (t) => [
    index('comments_entity_idx').on(t.entity_type, t.entity_id),
    index('comments_status_idx').on(t.status),
    index('comments_user_idx').on(t.user_id),
    index('comments_parent_idx').on(t.parent_id),
    index('comments_created_idx').on(t.created_at),
  ],
);
