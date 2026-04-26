import type { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@/db/client';
import { inventoryCache, inventoryImageMap, inventorySyncLog } from './schema';
import { asc, desc, eq, like, or, sql } from 'drizzle-orm';

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

    const [rows, [{ total }]] = await Promise.all([
      db.select({
        item: inventoryCache,
        image: inventoryImageMap,
      }).from(inventoryCache)
        .leftJoin(inventoryImageMap, eq(inventoryImageMap.malzeme_kodu, inventoryCache.malzeme_kodu))
        .where(where)
        .orderBy(asc(inventoryCache.malzeme_adi))
        .limit(limit)
        .offset(offset),
      db.select({ total: sql<number>`COUNT(*)` }).from(inventoryCache).where(where),
    ]);

    const items = rows.map(({ item, image }) => ({
      ...item,
      image: image
        ? {
            front_asset_id: image.front_asset_id,
            back_asset_id: image.back_asset_id,
            front_image_path: image.front_image_path,
            back_image_path: image.back_image_path,
            image_pair_no: image.image_pair_no,
            manual_price: image.manual_price,
            confidence: image.confidence,
            note: image.note,
          }
        : null,
    }));

    return reply.send({ items, total: Number(total) });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: { message: 'inventory_list_failed' } });
  }
}

const cleanText = (value: unknown, maxLength: number) => {
  const normalized = String(value ?? '').trim();
  return normalized ? normalized.slice(0, maxLength) : '';
};

const cleanNullableText = (value: unknown, maxLength: number) => {
  const normalized = cleanText(value, maxLength);
  return normalized || null;
};

const cleanPrice = (value: unknown) => {
  if (value === null || value === undefined || value === '') return null;
  const normalized = String(value).trim().replace(',', '.');
  const numeric = Number(normalized);
  if (!Number.isFinite(numeric) || numeric < 0) return undefined;
  return numeric.toFixed(2);
};

export async function updateInventoryManualAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { code } = req.params as { code?: string };
    const malzemeKodu = cleanText(code, 20);
    if (!malzemeKodu) {
      return reply.status(400).send({ error: { message: 'invalid_inventory_code' } });
    }

    const [existing] = await db.select({ malzeme_kodu: inventoryCache.malzeme_kodu })
      .from(inventoryCache)
      .where(eq(inventoryCache.malzeme_kodu, malzemeKodu))
      .limit(1);

    if (!existing) {
      return reply.status(404).send({ error: { message: 'inventory_item_not_found' } });
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const manualPrice = cleanPrice(body.manual_price);
    if (manualPrice === undefined) {
      return reply.status(400).send({ error: { message: 'invalid_manual_price' } });
    }

    const frontAssetId = cleanNullableText(body.front_asset_id, 36);
    const backAssetId = cleanNullableText(body.back_asset_id, 36);
    const frontImagePath = cleanText(body.front_image_path, 255);
    const backImagePath = cleanText(body.back_image_path, 255);
    const note = cleanNullableText(body.note, 1000);

    await db.execute(sql`
      INSERT INTO inventory_image_map (
        malzeme_kodu,
        front_asset_id,
        back_asset_id,
        front_image_path,
        back_image_path,
        image_pair_no,
        manual_price,
        confidence,
        note
      ) VALUES (
        ${malzemeKodu},
        ${frontAssetId},
        ${backAssetId},
        ${frontImagePath},
        ${backImagePath},
        'manual',
        ${manualPrice},
        'guvenli',
        ${note}
      )
      ON DUPLICATE KEY UPDATE
        front_asset_id = VALUES(front_asset_id),
        back_asset_id = VALUES(back_asset_id),
        front_image_path = VALUES(front_image_path),
        back_image_path = VALUES(back_image_path),
        manual_price = VALUES(manual_price),
        confidence = VALUES(confidence),
        note = VALUES(note)
    `);

    return reply.send({ ok: true });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: { message: 'inventory_manual_update_failed' } });
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
