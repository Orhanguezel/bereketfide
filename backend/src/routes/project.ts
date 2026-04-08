import type { FastifyInstance } from 'fastify';

// Proje-spesifik public moduller
import { registerFeed } from '@/modules/feed/router';
import { registerEcosystem } from '@/modules/ecosystem/router';

// Proje-spesifik admin moduller
import { registerDashboardAdmin } from '@/modules/dashboard/admin.routes';

export async function registerProjectPublic(api: FastifyInstance) {
  await registerFeed(api);
  await registerEcosystem(api);
}

export async function registerProjectAdmin(api: FastifyInstance) {
  await api.register(async (i) => registerDashboardAdmin(i), { prefix: '/admin' });
}
