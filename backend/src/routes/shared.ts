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
import { registerProducts } from '@agro/shared-backend/modules/products/router';
import { registerGallery } from '@agro/shared-backend/modules/gallery/router';
import { registerNotifications } from '@agro/shared-backend/modules/notifications/router';
import { registerReferences } from '@agro/shared-backend/modules/references/router';
import { registerTheme } from '@agro/shared-backend/modules/theme/router';

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
import { registerProductsAdmin } from '@agro/shared-backend/modules/products/admin.routes';
import { registerGalleryAdmin } from '@agro/shared-backend/modules/gallery/admin.routes';
import { registerEmailTemplatesAdmin } from '@agro/shared-backend/modules/emailTemplates/admin.routes';
import { registerNewsletterAdmin } from '@agro/shared-backend/modules/newsletter/admin.routes';
import { registerThemeAdmin } from '@agro/shared-backend/modules/theme/admin.routes';
import { registerReferencesAdmin } from '@agro/shared-backend/modules/references/admin.routes';

export async function registerSharedPublic(api: FastifyInstance) {
  await registerAuth(api);
  await registerStorage(api);
  await registerCustomPages(api);
  await registerSiteSettings(api);
  await registerCategories(api);
  await registerSubCategories(api);
  await registerContacts(api);
  await registerLibrary(api);
  await registerNotifications(api);
  await registerProducts(api);
  await registerGallery(api);
  await registerReferences(api);
  await registerTheme(api);
}

export async function registerSharedAdmin(api: FastifyInstance) {
  await api.register(async (i) => registerAudit(i), { prefix: '/admin' });
  await api.register(async (i) => registerAuditAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerCustomPagesAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerSiteSettingsAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerUserAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerStorageAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerCategoriesAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerSubCategoriesAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerContactsAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerLibraryAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerProductsAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerGalleryAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerReferencesAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerEmailTemplatesAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerNewsletterAdmin(i), { prefix: '/admin' });
  await api.register(async (i) => registerThemeAdmin(i), { prefix: '/admin' });

  const { aiContentAssist } = await import('@agro/shared-backend/modules/ai/content');
  api.post('/admin/ai/content', aiContentAssist);
}

export { shouldSkipAuditLog, writeRequestAuditLog, startRetentionJob } from '@agro/shared-backend/modules/audit/service';
