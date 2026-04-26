import type { FastifyInstance } from 'fastify';

import { requireAuth } from '@/common/middleware/auth';
import { requireApprovedDealer } from '@/common/middleware/approved-dealer';
import { createExtraRequestDealer, listExtrasDealer } from './controller';

export async function registerExtrasDealer(app: FastifyInstance) {
  app.addHook('onRequest', requireAuth);
  app.addHook('onRequest', requireApprovedDealer);

  app.get('/dealer/extras', listExtrasDealer);
  app.post('/dealer/extras/requests', createExtraRequestDealer);
}
