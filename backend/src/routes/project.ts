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

export async function registerProjectPublic(api: FastifyInstance) {
  await registerFeed(api);
  await registerEcosystem(api);
  await registerWeather(api);
}

export async function registerProjectAdmin(api: FastifyInstance) {
  await api.register(async (i) => registerDashboardAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerInventoryAdmin(i), { prefix: '/admin' });
  await api.register(createDbAdminRoutes(BEREKETFIDE_DB_MODULES), { prefix: '/admin' });
}
