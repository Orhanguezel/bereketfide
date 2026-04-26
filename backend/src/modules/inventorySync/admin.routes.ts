import type { FastifyInstance } from 'fastify';
import {
  getInventoryStatsAdmin,
  listInventoryAdmin,
  listInventorySyncLogsAdmin,
  updateInventoryManualAdmin,
} from './admin.controller';

const B = '/inventory';

export async function registerInventoryAdmin(app: FastifyInstance) {
  app.get(`${B}/stats`,     getInventoryStatsAdmin);
  app.get(`${B}`,           listInventoryAdmin);
  app.patch(`${B}/:code/manual`, updateInventoryManualAdmin);
  app.get(`${B}/sync-logs`, listInventorySyncLogsAdmin);
}
