import type { AdminNavItemKey } from '@/navigation/sidebar/sidebar-items';

function envTruthy(v: string | undefined): boolean {
  return ['1', 'true', 'yes', 'on'].includes(String(v ?? '').trim().toLowerCase());
}

/**
 * Sidebar’da gosterilmesi istege bagli moduller (PLAN: gereksiz admin girisleri pasif).
 * Varsayilan: kapali. Acmak icin ilgili NEXT_PUBLIC_ADMIN_NAV_*=1.
 */
const OPTIONAL_ADMIN_NAV_ENV: Partial<Record<AdminNavItemKey, string>> = {
  references: 'NEXT_PUBLIC_ADMIN_NAV_REFERENCES',
  bereket_gallery: 'NEXT_PUBLIC_ADMIN_NAV_GALLERY',
  newsletter: 'NEXT_PUBLIC_ADMIN_NAV_NEWSLETTER',
  bereket_blog_comments: 'NEXT_PUBLIC_ADMIN_NAV_COMMENTS',
  notifications: 'NEXT_PUBLIC_ADMIN_NAV_NOTIFICATIONS',
};

export function isAdminSidebarNavItemEnabled(key: AdminNavItemKey): boolean {
  const envName = OPTIONAL_ADMIN_NAV_ENV[key];
  if (!envName) return true;
  return envTruthy(process.env[envName]);
}
