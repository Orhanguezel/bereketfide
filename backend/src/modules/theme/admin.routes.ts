import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { requireAdmin } from '@/common/middleware/roles';
import { adminGetTheme, adminUpdateTheme, adminResetTheme } from './admin.controller';

export async function registerThemeAdmin(app: FastifyInstance) {
  const guard = { preHandler: [requireAuth, requireAdmin] };

  app.get('/theme', guard, adminGetTheme);
  app.put('/theme', guard, adminUpdateTheme);
  app.post('/theme/reset', guard, adminResetTheme);
}
