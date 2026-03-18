import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { requireAdmin } from '@/common/middleware/roles';
import {
  adminListComments,
  adminGetComment,
  adminUpdateComment,
  adminDeleteComment,
} from './admin.controller';

export async function registerCommentsAdmin(app: FastifyInstance) {
  const BASE = '/comments';
  const guard = { preHandler: [requireAuth, requireAdmin] };

  app.get(BASE, guard, adminListComments);
  app.get(`${BASE}/:id`, guard, adminGetComment);
  app.patch(`${BASE}/:id`, guard, adminUpdateComment);
  app.delete(`${BASE}/:id`, guard, adminDeleteComment);
}
