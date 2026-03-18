import type { FastifyInstance, RouteHandler } from 'fastify';
import { db } from '@/db/client';
import { sql } from 'drizzle-orm';

import { products } from '@/modules/products/schema';
import { categories } from '@/modules/categories/schema';
import { subCategories } from '@/modules/subcategories/schema';
import { contact_messages } from '@/modules/contact/schema';
import { customPages } from '@/modules/customPages/schema';
import { menuItems } from '@/modules/menuItems/schema';
import { galleries } from '@/modules/gallery/schema';
import { siteSettings } from '@/modules/siteSettings/schema';
import { users } from '@/modules/auth/schema';
import { storageAssets } from '@/modules/storage/schema';
import { notifications } from '@/modules/notifications/schema';
import { auditRequestLogs } from '@/modules/audit/schema';
import { offersTable } from '@/modules/offer/schema';
import { library } from '@/modules/library/schema';

async function countTable(table: any): Promise<number> {
  try {
    const [row] = await db.select({ c: sql<number>`count(*)` }).from(table);
    return Number(row?.c ?? 0);
  } catch {
    return 0;
  }
}

const getDashboardSummary: RouteHandler = async (_req, reply) => {
  const [
    productsTotal,
    categoriesTotal,
    subcategoriesTotal,
    contactsTotal,
    customPagesTotal,
    menuItemsTotal,
    galleryTotal,
    siteSettingsTotal,
    usersTotal,
    storageTotal,
    notificationsTotal,
    auditTotal,
    offersTotal,
    libraryTotal,
  ] = await Promise.all([
    countTable(products),
    countTable(categories),
    countTable(subCategories),
    countTable(contact_messages),
    countTable(customPages),
    countTable(menuItems),
    countTable(galleries),
    countTable(siteSettings),
    countTable(users),
    countTable(storageAssets),
    countTable(notifications),
    countTable(auditRequestLogs),
    countTable(offersTable),
    countTable(library),
  ]);

  return reply.send({
    totals: {
      products_total: productsTotal,
      categories_total: categoriesTotal,
      subcategories_total: subcategoriesTotal,
      contact_messages_total: contactsTotal,
      custom_pages_total: customPagesTotal,
      menu_items_total: menuItemsTotal,
      gallery_total: galleryTotal,
      site_settings_total: siteSettingsTotal,
      users_total: usersTotal,
      storage_assets_total: storageTotal,
      notifications_total: notificationsTotal,
      audit_logs_total: auditTotal,
      offers_total: offersTotal,
      library_total: libraryTotal,
    },
  });
};

export async function registerDashboardAdmin(app: FastifyInstance) {
  app.get('/dashboard/summary', { config: { auth: true } }, getDashboardSummary);
}
