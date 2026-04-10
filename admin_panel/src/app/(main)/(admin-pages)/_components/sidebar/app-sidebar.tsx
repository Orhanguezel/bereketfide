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

  // Dynamic logo from site settings
  const BRAND_PREFIX = process.env.NEXT_PUBLIC_BRAND_PREFIX || 'bereketfide__';
  const { data: logoSetting } = useGetSiteSettingByKeyQuery(`${BRAND_PREFIX}site_logo`);
  const { data: logoSettingGlobal } = useGetSiteSettingByKeyQuery('site_logo');
  const logoVal = (logoSetting?.value || logoSettingGlobal?.value) as any;
  const rawLogoUrl: string = logoVal?.logo_url || logoVal?.url || '/admin/logo/bereket_logo_512.png';
  const logoAlt: string = logoVal?.logo_alt || logoVal?.alt || 'Logo';

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
        <Link prefetch={false} href="/dashboard" className="flex items-center gap-3 px-3 py-4 hover:bg-sidebar-accent/50 transition-colors overflow-hidden">
          <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-primary/10">
            <Image
              src={rawLogoUrl}
              alt={logoAlt}
              width={32}
              height={32}
              className="object-contain size-8"
              unoptimized
            />
          </div>
          <div className="flex flex-col gap-0.5 leading-none min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-lg tracking-tight truncate">{label || 'BEREKET FIDE'}</span>
            <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Admin Panel</span>
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
