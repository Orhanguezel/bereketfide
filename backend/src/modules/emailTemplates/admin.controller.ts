import type { RouteHandler } from 'fastify';
import { randomUUID } from 'crypto';
import { asc, eq, like, sql } from 'drizzle-orm';
import { db } from '@/db/client';
import { emailTemplates } from './schema';

export const adminListEmailTemplates: RouteHandler = async (req, reply) => {
  const q = (req.query || {}) as Record<string, string | undefined>;
  const limit = Math.min(parseInt(q.limit || '200', 10) || 200, 500);
  const offset = Math.max(parseInt(q.offset || '0', 10) || 0, 0);

  let qb = db.select().from(emailTemplates).$dynamic();
  if (q.q) qb = qb.where(like(emailTemplates.template_key, `%${q.q}%`));

  const [{ total }] = await db.select({ total: sql<number>`COUNT(*)` }).from(emailTemplates);
  const rows = await qb.orderBy(asc(emailTemplates.template_key)).limit(limit).offset(offset);

  reply.header('x-total-count', String(Number(total || 0)));
  return reply.send(rows);
};

export const adminGetEmailTemplate: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  const [row] = await db.select().from(emailTemplates).where(eq(emailTemplates.id, id)).limit(1);
  if (!row) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.send(row);
};

export const adminCreateEmailTemplate: RouteHandler = async (req, reply) => {
  const body = (req.body || {}) as any;
  const id = randomUUID();
  await db.insert(emailTemplates).values({
    id,
    template_key: body.template_key || '',
    variables: body.variables ? JSON.stringify(body.variables) : null,
    is_active: body.is_active ?? true,
  });
  return reply.code(201).send({ id });
};

export const adminUpdateEmailTemplate: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  const body = (req.body || {}) as any;
  const fields: any = {};
  if ('template_key' in body) fields.template_key = body.template_key;
  if ('variables' in body) fields.variables = typeof body.variables === 'string' ? body.variables : JSON.stringify(body.variables);
  if ('is_active' in body) fields.is_active = body.is_active;

  if (Object.keys(fields).length) {
    await db.update(emailTemplates).set(fields).where(eq(emailTemplates.id, id));
  }
  return reply.send({ ok: true });
};

export const adminDeleteEmailTemplate: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  await db.delete(emailTemplates).where(eq(emailTemplates.id, id));
  return reply.code(204).send();
};
