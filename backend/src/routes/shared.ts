import type { FastifyInstance } from 'fastify';

// Ortak public moduller
import { registerAuth } from '@agro/shared-backend/modules/auth/router';
import { registerStorage } from '@agro/shared-backend/modules/storage/router';
import { registerCustomPages } from '@agro/shared-backend/modules/customPages/router';
import { registerSiteSettings } from '@agro/shared-backend/modules/siteSettings/router';
import { registerCategories } from '@agro/shared-backend/modules/categories/router';
import { registerSubCategories } from '@agro/shared-backend/modules/subcategories/router';
import { registerContacts } from '@agro/shared-backend/modules/contact/router';
import { registerLibrary } from '@agro/shared-backend/modules/library/router';
import { registerMenuItems } from '@agro/shared-backend/modules/menuItems/router';
import { registerNewsletter } from '@agro/shared-backend/modules/newsletter/router';
import { registerProducts } from '@agro/shared-backend/modules/products/router';
import { registerGallery } from '@agro/shared-backend/modules/gallery/router';
import { registerNotifications } from '@agro/shared-backend/modules/notifications/router';
import { registerReferences } from '@agro/shared-backend/modules/references/router';
import { registerTheme } from '@agro/shared-backend/modules/theme/router';
import { registerCommentsPublic } from '@agro/shared-backend/modules/comments/public.routes';
import { registerOffer } from '@agro/shared-backend/modules/offer/router';
import { registerOrders } from '@agro/shared-backend/modules/orders/router';
import { registerDealerFinance } from '@agro/shared-backend/modules/dealerFinance/router';
import { registerServices } from '@agro/shared-backend/modules/services/router';

// Ortak admin moduller
import { registerAudit } from '@agro/shared-backend/modules/audit/router';
import { registerAuditAdmin } from '@agro/shared-backend/modules/audit/admin.routes';
import { registerCustomPagesAdmin } from '@agro/shared-backend/modules/customPages/admin.routes';
import { registerSiteSettingsAdmin } from '@agro/shared-backend/modules/siteSettings/admin.routes';
import { registerUserAdmin } from '@agro/shared-backend/modules/auth/admin.routes';
import { registerStorageAdmin } from '@agro/shared-backend/modules/storage/admin.routes';
import { registerCategoriesAdmin } from '@agro/shared-backend/modules/categories/admin.routes';
import { registerSubCategoriesAdmin } from '@agro/shared-backend/modules/subcategories/admin.routes';
import { registerContactsAdmin } from '@agro/shared-backend/modules/contact/admin.routes';
import { registerLibraryAdmin } from '@agro/shared-backend/modules/library/admin.routes';
import { registerMenuItemsAdmin } from '@agro/shared-backend/modules/menuItems/admin.routes';
import { registerProductsAdmin } from '@agro/shared-backend/modules/products/admin.routes';
import { registerGalleryAdmin } from '@agro/shared-backend/modules/gallery/admin.routes';
import { registerEmailTemplatesAdmin } from '@agro/shared-backend/modules/emailTemplates/admin.routes';
import { registerNewsletterAdmin } from '@agro/shared-backend/modules/newsletter/admin.routes';
import { registerThemeAdmin } from '@agro/shared-backend/modules/theme/admin.routes';
import { registerReferencesAdmin } from '@agro/shared-backend/modules/references/admin.routes';
import { registerCommentsAdmin } from '@agro/shared-backend/modules/comments/admin.routes';
import { registerOfferAdmin } from '@agro/shared-backend/modules/offer/admin.routes';
import { registerOrdersAdmin } from '@agro/shared-backend/modules/orders/admin.routes';
import { registerDealerFinanceAdmin } from '@agro/shared-backend/modules/dealerFinance/admin.routes';
import { registerServicesAdmin } from '@agro/shared-backend/modules/services/admin.routes';
import { registerTelegram } from '@agro/shared-backend/modules/telegram/router';
import { registerTelegramAdmin } from '@agro/shared-backend/modules/telegram/admin.routes';

const sharedPublicRegistrars = [
  registerAuth,
  registerStorage,
  registerCustomPages,
  registerSiteSettings,
  registerCategories,
  registerSubCategories,
  registerContacts,
  registerLibrary,
  registerMenuItems,
  registerNewsletter,
  registerNotifications,
  registerProducts,
  registerGallery,
  registerReferences,
  registerTheme,
  registerCommentsPublic,
  registerOffer,
  registerOrders,
  registerDealerFinance,
  registerServices,
  registerTelegram,
] as const;

const sharedAdminRegistrars = [
  registerAudit,
  registerAuditAdmin,
  registerCustomPagesAdmin,
  registerSiteSettingsAdmin,
  registerUserAdmin,
  registerStorageAdmin,
  registerCategoriesAdmin,
  registerSubCategoriesAdmin,
  registerContactsAdmin,
  registerLibraryAdmin,
  registerMenuItemsAdmin,
  registerProductsAdmin,
  registerGalleryAdmin,
  registerReferencesAdmin,
  registerEmailTemplatesAdmin,
  registerNewsletterAdmin,
  registerThemeAdmin,
  registerCommentsAdmin,
  registerOfferAdmin,
  registerOrdersAdmin,
  registerDealerFinanceAdmin,
  registerServicesAdmin,
  registerTelegramAdmin,
] as const;

export async function registerSharedPublic(api: FastifyInstance) {
  for (const registerModule of sharedPublicRegistrars) {
    await registerModule(api);
  }
}

export async function registerSharedAdmin(api: FastifyInstance) {
  for (const registerModule of sharedAdminRegistrars) {
    await api.register(async (i) => registerModule(i), { prefix: '/admin' });
  }

  const { aiContentAssist } = await import('@agro/shared-backend/modules/ai/content');
  api.post('/admin/ai/content', aiContentAssist);
}

export { shouldSkipAuditLog, writeRequestAuditLog, startRetentionJob } from '@agro/shared-backend/modules/audit/service';
