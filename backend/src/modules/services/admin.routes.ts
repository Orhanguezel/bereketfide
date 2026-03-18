import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { requireAdmin } from '@/common/middleware/roles';
import {
  adminListServices,
  adminGetService,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
} from './admin.controller';

export async function registerServicesAdmin(app: FastifyInstance) {
  const BASE = '/services';
  const guard = { preHandler: [requireAuth, requireAdmin] };

  app.get(BASE, guard, adminListServices);
  app.get(`${BASE}/:id`, guard, adminGetService);
  app.post(BASE, guard, adminCreateService);
  app.patch(`${BASE}/:id`, guard, adminUpdateService);
  app.delete(`${BASE}/:id`, guard, adminDeleteService);
}
