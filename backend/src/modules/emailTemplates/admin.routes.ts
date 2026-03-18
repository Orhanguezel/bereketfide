import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { requireAdmin } from '@/common/middleware/roles';
import {
  adminListEmailTemplates,
  adminGetEmailTemplate,
  adminCreateEmailTemplate,
  adminUpdateEmailTemplate,
  adminDeleteEmailTemplate,
} from './admin.controller';

export async function registerEmailTemplatesAdmin(app: FastifyInstance) {
  const BASE = '/email_templates';
  const guard = { preHandler: [requireAuth, requireAdmin] };

  app.get(BASE, guard, adminListEmailTemplates);
  app.get(`${BASE}/:id`, guard, adminGetEmailTemplate);
  app.post(BASE, guard, adminCreateEmailTemplate);
  app.patch(`${BASE}/:id`, guard, adminUpdateEmailTemplate);
  app.delete(`${BASE}/:id`, guard, adminDeleteEmailTemplate);
}
