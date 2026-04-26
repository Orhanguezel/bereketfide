import { randomUUID } from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { and, asc, desc, eq, like, or, sql } from 'drizzle-orm';
import { getAuthUserId } from '@agro/shared-backend/modules/_shared';

import { db } from '@/db/client';
import { extraSeedlingRequests, extraSeedlings } from './schema';

const EXTRA_STATUSES = new Set(['draft', 'published', 'reserved', 'sold_out', 'archived']);
const REQUEST_STATUSES = new Set(['new', 'contacted', 'approved', 'rejected', 'cancelled']);

function str(value: unknown, max = 255) {
  const s = String(value ?? '').trim();
  return s ? s.slice(0, max) : '';
}

function nullableStr(value: unknown, max = 255) {
  return str(value, max) || null;
}

function intVal(value: unknown, fallback = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.floor(n));
}

function dateVal(value: unknown) {
  const s = str(value, 20);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}

function extraStatus(value: unknown) {
  const s = str(value, 20);
  return EXTRA_STATUSES.has(s) ? s as 'draft' | 'published' | 'reserved' | 'sold_out' | 'archived' : 'draft';
}

function requestStatus(value: unknown) {
  const s = str(value, 20);
  return REQUEST_STATUSES.has(s) ? s as 'new' | 'contacted' | 'approved' | 'rejected' | 'cancelled' : 'new';
}

function normalizeExtraBody(body: Record<string, unknown>, fallbackId?: string) {
  const category = str(body.category, 60);
  const productName = str(body.product_name, 255);
  const trayType = intVal(body.tray_type);
  const quantity = intVal(body.quantity);

  if (!category || !productName || trayType <= 0) {
    return null;
  }

  return {
    id: fallbackId ?? randomUUID(),
    category,
    product_name: productName,
    tray_type: trayType,
    quantity,
    available_on: dateVal(body.available_on),
    availability_label: nullableStr(body.availability_label, 80),
    status: extraStatus(body.status),
    image_url: nullableStr(body.image_url, 500),
    note: nullableStr(body.note, 2000),
    source_date: dateVal(body.source_date),
  };
}

export async function listExtrasAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const q = req.query as Record<string, string | undefined>;
    const search = str(q.search, 120);
    const category = str(q.category, 60);
    const status = str(q.status, 20);
    const limit = Math.min(intVal(q.limit, 100), 250);
    const offset = intVal(q.offset, 0);

    const filters = [
      search ? or(like(extraSeedlings.product_name, `%${search}%`), like(extraSeedlings.category, `%${search}%`)) : undefined,
      category ? eq(extraSeedlings.category, category) : undefined,
      status && EXTRA_STATUSES.has(status) ? eq(extraSeedlings.status, status as any) : undefined,
    ].filter(Boolean);
    const where = filters.length ? and(...filters as any[]) : undefined;

    const [items, [{ total }]] = await Promise.all([
      db.select().from(extraSeedlings)
        .where(where)
        .orderBy(asc(extraSeedlings.available_on), asc(extraSeedlings.category), asc(extraSeedlings.product_name))
        .limit(limit)
        .offset(offset),
      db.select({ total: sql<number>`COUNT(*)` }).from(extraSeedlings).where(where),
    ]);

    return reply.send({ items, total: Number(total) });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: { message: 'extras_list_failed' } });
  }
}

export async function createExtraAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const row = normalizeExtraBody(body);
    if (!row) return reply.status(400).send({ error: { message: 'invalid_extra_payload' } });

    await db.insert(extraSeedlings).values(row);
    return reply.status(201).send({ item: row });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: { message: 'extra_create_failed' } });
  }
}

export async function updateExtraAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id?: string };
    const cleanId = str(id, 36);
    const body = (req.body ?? {}) as Record<string, unknown>;
    const row = normalizeExtraBody(body, cleanId);
    if (!cleanId || !row) return reply.status(400).send({ error: { message: 'invalid_extra_payload' } });

    await db.update(extraSeedlings)
      .set({ ...row, updated_at: sql`CURRENT_TIMESTAMP` } as any)
      .where(eq(extraSeedlings.id, cleanId));

    return reply.send({ ok: true });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: { message: 'extra_update_failed' } });
  }
}

export async function deleteExtraAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id?: string };
    const cleanId = str(id, 36);
    if (!cleanId) return reply.status(400).send({ error: { message: 'invalid_extra_id' } });

    await db.update(extraSeedlings)
      .set({ status: 'archived', updated_at: sql`CURRENT_TIMESTAMP` } as any)
      .where(eq(extraSeedlings.id, cleanId));
    return reply.send({ ok: true });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: { message: 'extra_archive_failed' } });
  }
}

export async function listExtraRequestsAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const q = req.query as Record<string, string | undefined>;
    const status = str(q.status, 20);
    const where = status && REQUEST_STATUSES.has(status) ? eq(extraSeedlingRequests.status, status as any) : undefined;

    const items = await db.select({
      request: extraSeedlingRequests,
      extra: extraSeedlings,
    }).from(extraSeedlingRequests)
      .leftJoin(extraSeedlings, eq(extraSeedlings.id, extraSeedlingRequests.extra_seedling_id))
      .where(where)
      .orderBy(desc(extraSeedlingRequests.created_at))
      .limit(Math.min(intVal(q.limit, 100), 250));

    return reply.send({ items });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: { message: 'extra_requests_list_failed' } });
  }
}

export async function updateExtraRequestAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id?: string };
    const cleanId = str(id, 36);
    const body = (req.body ?? {}) as Record<string, unknown>;
    const status = requestStatus(body.status);
    if (!cleanId) return reply.status(400).send({ error: { message: 'invalid_request_id' } });

    await db.update(extraSeedlingRequests)
      .set({ status, updated_at: sql`CURRENT_TIMESTAMP` } as any)
      .where(eq(extraSeedlingRequests.id, cleanId));

    return reply.send({ ok: true });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: { message: 'extra_request_update_failed' } });
  }
}

export async function listExtrasDealer(req: FastifyRequest, reply: FastifyReply) {
  try {
    const q = req.query as Record<string, string | undefined>;
    const category = str(q.category, 60);
    const trayType = intVal(q.tray_type, 0);
    const filters = [
      eq(extraSeedlings.status, 'published'),
      category ? eq(extraSeedlings.category, category) : undefined,
      trayType > 0 ? eq(extraSeedlings.tray_type, trayType) : undefined,
    ].filter(Boolean);

    const items = await db.select().from(extraSeedlings)
      .where(and(...filters as any[]))
      .orderBy(asc(extraSeedlings.available_on), asc(extraSeedlings.category), asc(extraSeedlings.product_name))
      .limit(250);

    return reply.send({ items });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: { message: 'dealer_extras_list_failed' } });
  }
}

export async function createExtraRequestDealer(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const extraId = str(body.extra_seedling_id, 36);
    const requestedQuantity = intVal(body.requested_quantity);
    if (!extraId || requestedQuantity <= 0) {
      return reply.status(400).send({ error: { message: 'invalid_extra_request_payload' } });
    }

    const [extra] = await db.select({ id: extraSeedlings.id, status: extraSeedlings.status })
      .from(extraSeedlings)
      .where(and(eq(extraSeedlings.id, extraId), eq(extraSeedlings.status, 'published')))
      .limit(1);
    if (!extra) return reply.status(404).send({ error: { message: 'extra_not_found' } });

    const row = {
      id: randomUUID(),
      extra_seedling_id: extraId,
      dealer_user_id: nullableStr(getAuthUserId(req), 36),
      dealer_name: nullableStr(body.dealer_name, 255),
      dealer_phone: nullableStr(body.dealer_phone, 50),
      requested_quantity: requestedQuantity,
      note: nullableStr(body.note, 2000),
      status: 'new' as const,
    };

    await db.insert(extraSeedlingRequests).values(row);
    return reply.status(201).send({ request: row });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: { message: 'extra_request_create_failed' } });
  }
}
