import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { requireAdmin } from '@/common/middleware/roles';
import {
  adminListNewsletter,
  adminGetNewsletterSubscriber,
  adminDeleteNewsletterSubscriber,
} from './admin.controller';

export async function registerNewsletterAdmin(app: FastifyInstance) {
  const BASE = '/newsletter';
  const guard = { preHandler: [requireAuth, requireAdmin] };

  app.get(BASE, guard, adminListNewsletter);
  app.get(`${BASE}/:id`, guard, adminGetNewsletterSubscriber);
  app.delete(`${BASE}/:id`, guard, adminDeleteNewsletterSubscriber);
}
