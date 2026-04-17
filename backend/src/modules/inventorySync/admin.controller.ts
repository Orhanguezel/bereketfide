import type { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@/db/client';
import { inventoryCache, inventorySyncLog } from './schema';
import { asc, desc, like, or, sql } from 'drizzle-orm';

export async function listInventoryAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const q = req.query as Record<string, string>;
    const limit  = Math.min(parseInt(q.limit  ?? '50'), 200);
    const offset = parseInt(q.offset ?? '0');
    const search = q.search?.trim() ?? '';

    const where = search
      ? or(
          like(inventoryCache.malzeme_kodu, `%${search}%`),
          like(inventoryCache.malzeme_adi,  `%${search}%`),
        )
      : undefined;

    const [items, [{ total }]] = await Promise.all([
      db.select().from(inventoryCache)
        .where(where)
        .orderBy(asc(inventoryCache.malzeme_adi))
        .limit(limit)
        .offset(offset),
      db.select({ total: sql<number>`COUNT(*)` }).from(inventoryCache).where(where),
    ]);

    return reply.send({ items, total: Number(total) });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: { message: 'inventory_list_failed' } });
  }
}

export async function listInventorySyncLogsAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const q = req.query as Record<string, string>;
    const limit  = Math.min(parseInt(q.limit ?? '20'), 100);
    const offset = parseInt(q.offset ?? '0');

    const items = await db.select().from(inventorySyncLog)
      .orderBy(desc(inventorySyncLog.synced_at))
      .limit(limit)
      .offset(offset);

    return reply.send({ items });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: { message: 'sync_logs_failed' } });
  }
}

export async function getInventoryStatsAdmin(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const [totals] = await db.select({
      total_products:    sql<number>`COUNT(*)`,
      total_stock:       sql<number>`SUM(envanter_miktari)`,
      last_synced_at:    sql<string>`MAX(synced_at)`,
    }).from(inventoryCache);

    const [lastLog] = await db.select().from(inventorySyncLog)
      .orderBy(desc(inventorySyncLog.synced_at))
      .limit(1);

    return reply.send({
      total_products: Number(totals?.total_products ?? 0),
      total_stock:    Number(totals?.total_stock ?? 0),
      last_synced_at: totals?.last_synced_at ?? null,
      last_sync:      lastLog ?? null,
    });
  } catch (err) {
    _req.log.error(err);
    return reply.status(500).send({ error: { message: 'inventory_stats_failed' } });
  }
}
