import type { FastifyInstance } from 'fastify';

// Proje-spesifik public moduller
import { registerMenuItems } from '@/modules/menuItems/router';
import { registerOffer } from '@/modules/offer/router';
import { registerServices } from '@/modules/services/router';

// Proje-spesifik admin moduller
import { registerMenuItemsAdmin } from '@/modules/menuItems/admin.routes';
import { registerOfferAdmin } from '@/modules/offer/admin.routes';
import { registerDashboardAdmin } from '@/modules/dashboard/admin.routes';
import { registerServicesAdmin } from '@/modules/services/admin.routes';
import { registerCommentsAdmin } from '@/modules/comments/admin.routes';
import { registerCommentsPublic } from '@/modules/comments/public.routes';
import { registerOrders } from '@/modules/orders/router';
import { registerOrdersAdmin } from '@/modules/orders/admin.routes';
import { registerDealerFinance } from '@/modules/dealerFinance/router';
import { registerDealerFinanceAdmin } from '@/modules/dealerFinance/admin.routes';

export async function registerProjectPublic(api: FastifyInstance) {
  await registerMenuItems(api);
  await registerOffer(api);
  await registerServices(api);
  await registerOrders(api);
  await registerDealerFinance(api);
  await registerCommentsPublic(api);
}

export async function registerProjectAdmin(api: FastifyInstance) {
  await api.register(async (i) => registerMenuItemsAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerOfferAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerDashboardAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerServicesAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerCommentsAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerOrdersAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerDealerFinanceAdmin(i), { prefix: '/admin' });
}
