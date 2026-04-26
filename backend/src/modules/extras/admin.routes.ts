import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@agro/shared-backend/middleware/auth';
import { requireAdmin } from '@agro/shared-backend/middleware/roles';

import {
  createExtraAdmin,
  deleteExtraAdmin,
  listExtraRequestsAdmin,
  listExtrasAdmin,
  updateExtraAdmin,
  updateExtraRequestAdmin,
} from './controller';

export async function registerExtrasAdmin(app: FastifyInstance) {
  app.addHook('onRequest', requireAuth);
  app.addHook('onRequest', requireAdmin);

  app.get('/extras', listExtrasAdmin);
  app.post('/extras', createExtraAdmin);
  app.get('/extras/requests', listExtraRequestsAdmin);
  app.patch('/extras/requests/:id', updateExtraRequestAdmin);
  app.patch('/extras/:id', updateExtraAdmin);
  app.delete('/extras/:id', deleteExtraAdmin);
}
