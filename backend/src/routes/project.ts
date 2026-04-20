import type { FastifyInstance } from 'fastify';

// Proje-spesifik public moduller
import { registerFeed } from '@/modules/feed/router';
import { registerEcosystem } from '@/modules/ecosystem/router';
import { registerWeather } from '@/modules/weather/router';

// Proje-spesifik admin moduller
import { registerDashboardAdmin } from '@/modules/dashboard/admin.routes';
import { registerInventoryAdmin } from '@/modules/inventorySync/admin.routes';

// Ortak db_admin (manifest-driven)
import { createDbAdminRoutes } from '@agro/shared-backend/modules/db_admin';
import { BEREKETFIDE_DB_MODULES } from '@/modules/db_admin/manifest';
import { requireAuth } from '@agro/shared-backend/middleware/auth';
import { requireAdmin } from '@agro/shared-backend/middleware/roles';

export async function registerProjectPublic(api: FastifyInstance) {
  await registerFeed(api);
  await registerEcosystem(api);
  await registerWeather(api);
}

export async function registerProjectAdmin(api: FastifyInstance) {
  await api.register(async (i) => registerDashboardAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerInventoryAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => {
    i.addHook('onRequest', requireAuth);
    i.addHook('onRequest', requireAdmin);
    await createDbAdminRoutes(BEREKETFIDE_DB_MODULES)(i);
  }, { prefix: '/admin' });
}
