'use client';

// =============================================================
// FILE: src/app/(main)/admin/_components/sidebar/app-sidebar.tsx
// FINAL — RTK/Redux uyumlu (zustand yok)
// - NavMain: NavGroup[] alır (senin nav-main.tsx böyle)
// =============================================================

import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { buildAdminSidebarItems } from '@/navigation/sidebar/sidebar-items';
import type { NavGroup } from '@/navigation/sidebar/sidebar-items';
import { isAdminSidebarNavItemEnabled } from '@/config/admin-features';

import { useAdminUiCopy } from '@/app/(main)/(admin-pages)/_components/common/useAdminUiCopy';
import { useAdminT } from '@/app/(main)/(admin-pages)/_components/common/useAdminT';
import type { TranslateFn } from '@/i18n';
import { useGetSiteSettingByKeyQuery, useStatusQuery, useGetMyProfileQuery } from '@/integrations/hooks';

import { useMemo } from 'react';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { useAdminSettings } from '../admin-settings-provider';

/** site_settings value alanından URL çeker — string, {url:...} veya {logo_url:...} */
function extractMediaUrl(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === 'string') return val.startsWith('http') || val.startsWith('/') ? val : null;
  if (typeof val === 'object') {
    const v = val as Record<string, unknown>;
    const u = v.logo_url ?? v.url ?? v.favicon_url ?? v.src ?? null;
    return typeof u === 'string' ? u : null;
  }
  return null;
}

type Role = 'admin' | string;

type SidebarMe = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  roles?: Role[];
};

function hasRole(me: SidebarMe, role: Role) {
  if (me.role === role) return true;
  const rs = Array.isArray(me.roles) ? me.roles : [];
  return rs.includes(role);
}

export function AppSidebar({
  me,
  appName,
  variant,
  collapsible,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  me: SidebarMe;
  appName?: string;
}) {
  const { copy } = useAdminUiCopy();
  const t = useAdminT();
  const label = (copy.app_name || appName || '').trim();

  // Dynamic logo/favicon from site settings (global keys — DB'de tanımlı olmalı)
  const { data: logoSetting }    = useGetSiteSettingByKeyQuery('site_logo');
  const { data: faviconSetting } = useGetSiteSettingByKeyQuery('site_favicon');

  const logoUrl    = extractMediaUrl(logoSetting?.value) ?? null;
  const faviconUrl = extractMediaUrl(faviconSetting?.value) ?? null;
  const logoAlt    = (label || 'Bereket Fide');

  // Admin settings override for page titles
  const { pageMeta } = useAdminSettings();

  // ✅ Get real user data
  const { data: statusData } = useStatusQuery();
  const { data: profileData } = useGetMyProfileQuery();

  const currentUser = useMemo(() => {
    const s = statusData?.user;
    return {
      id: s?.id || me?.id || 'me',
      name: profileData?.full_name || s?.email?.split('@')[0] || me?.name || 'Admin',
      email: s?.email || me?.email || 'admin',
      role: s?.role || me?.role || 'admin',
      avatar: profileData?.avatar_url || me?.avatar || '',
      roles: me?.roles || [s?.role || 'admin'],
    };
  }, [statusData, profileData, me]);

  const wrappedT: TranslateFn = (key, params, fallback) => {
    // Check pageMeta override for sidebar items: admin.dashboard.items.{key}
    if (typeof key === 'string' && key.startsWith('admin.dashboard.items.')) {
      const itemKey = key.replace('admin.dashboard.items.', '');
      // Check if pageMeta has this key and a title
      if (pageMeta?.[itemKey]?.title) {
        return pageMeta[itemKey].title;
      }
    }
    return t(key, params, fallback);
  };

  // ✅ admin ise tüm menu, değilse sadece dashboard
  const groupsForMe: NavGroup[] = hasRole(currentUser as any, 'admin')
    ? buildAdminSidebarItems(copy.nav, wrappedT, isAdminSidebarNavItemEnabled)
    : [
        {
          id: 1,
          label: '',
          items: [
            {
              title: copy.nav?.items?.dashboard || '',
              url: '/dashboard',
              icon: LayoutDashboard,
            },
          ],
        },
      ];

  return (
    <Sidebar {...props} variant={variant} collapsible={collapsible}>
      <SidebarHeader>
        <Link
          prefetch={false}
          href="/dashboard"
          className="flex flex-col items-center gap-0 px-3 py-3 hover:bg-sidebar-accent/50 transition-colors"
        >
          {/* Expanded: logo site settings'ten, yoksa site adı metni */}
          <div className="group-data-[collapsible=icon]:hidden w-full flex justify-center items-center py-2">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={logoAlt}
                width={160}
                height={52}
                className="object-contain max-h-14 w-auto"
                unoptimized
              />
            ) : (
              <span className="font-bold text-base tracking-tight text-sidebar-foreground truncate px-1">
                {label || 'Bereket Fide'}
              </span>
            )}
          </div>

          {/* Collapsed (icon mod): favicon site settings'ten, yoksa baş harfler */}
          <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center py-1">
            {faviconUrl ? (
              <Image
                src={faviconUrl}
                alt={logoAlt}
                width={28}
                height={28}
                className="object-contain size-7 rounded"
                unoptimized
              />
            ) : (
              <span className="flex size-7 items-center justify-center rounded bg-primary/15 text-xs font-bold text-primary">
                BF
              </span>
            )}
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* ✅ NavMain NavGroup[] bekliyor */}
        <NavMain items={groupsForMe} showQuickCreate={false} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{ name: currentUser.name, email: currentUser.email, avatar: currentUser.avatar }} />
      </SidebarFooter>
    </Sidebar>
  );
}
