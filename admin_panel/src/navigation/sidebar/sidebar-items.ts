// =============================================================
// FILE: src/navigation/sidebar/sidebar-items.ts
// FINAL — GuezelWebDesign — Sidebar items (labels are dynamic via site_settings.ui_admin)
// - Dashboard base: /admin/dashboard
// - Admin pages: /admin/...  (route group "(admin)" URL'e dahil olmaz)
// =============================================================

import {
  BarChart,
  Bell,
  Palette,
  PackageSearch,
  Sprout,
  BookOpen,
  Bot,
  Briefcase,
  RefreshCcw,

  ClipboardList,
  Cog,
  DollarSign,
  Contact2,
  Database,
  FileSearch,
  FileText,
  FolderOpen,
  Folders,
  HardDrive,
  Headphones,
  HelpCircle,
  Images,
  Layers,
  LayoutDashboard,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  Newspaper,
  Package,
  Send,
  Settings,
  ShoppingBag,
  Store,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { TranslateFn } from '@/i18n';

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export type AdminNavItemKey =
  | 'dashboard'
  | 'site_settings'
  | 'custom_pages'
  | 'categories'
  | 'subcategories'
  | 'products'
  | 'sparepart'
  | 'services'
  | 'sliders'
  | 'menu_items'
  | 'footer_sections'
  | 'faqs'
  | 'contacts'
  | 'b2b_orders'
  | 'b2b_payment_attempts'
  | 'b2b_dealers'
  | 'reviews'
  | 'mail'
  | 'users'
  | 'email_templates'
  | 'notifications'
  | 'storage'
  | 'db'
  | 'audit'

  | 'reports'
  | 'offers'
  | 'catalog_requests'
  | 'support'
  | 'telegram'
  | 'chat'
  | 'theme'
  | 'bereket_projects'
  | 'bereket_categories'
  | 'references'
  | 'bereket_gallery'
  | 'bereket_offers'
  | 'bereket_blog'
  | 'bereket_news'
  | 'bereket_blog_comments'
  | 'bereket_corporate'
  | 'bereket_legal'
  | 'bereket_settings'
  | 'library'
  | 'newsletter'
  | 'email_templates'
  | 'cache'
  | 'inventory'
  | 'extras';

export type AdminNavGroupKey = 'general' | 'content' | 'bereket_fide' | 'bereket_content' | 'marketing' | 'communication' | 'system';

export type AdminNavConfigItem = {
  key: AdminNavItemKey;
  url: string;
  icon?: LucideIcon;
};

export type AdminNavConfigGroup = {
  id: number;
  key: AdminNavGroupKey;
  items: AdminNavConfigItem[];
};

export const adminNavConfig: AdminNavConfigGroup[] = [
  {
    id: 1,
    key: 'general',
    items: [{ key: 'dashboard', url: '/dashboard', icon: LayoutDashboard }],
  },
  {
    id: 2,
    key: 'bereket_fide',
    items: [
      { key: 'bereket_projects', url: '/products?type=bereketfide', icon: Layers },
      { key: 'bereket_categories', url: '/categories?module=bereketfide', icon: Folders },
      { key: 'references', url: '/references', icon: BookOpen },
      { key: 'bereket_gallery', url: '/gallery', icon: Images },
      { key: 'services', url: '/services', icon: Briefcase },
      { key: 'bereket_offers', url: '/offer?module=bereketfide', icon: DollarSign },
      { key: 'contacts', url: '/contacts', icon: Contact2 },
      { key: 'inventory', url: '/inventory', icon: PackageSearch },
      { key: 'extras', url: '/extras', icon: Sprout },
      { key: 'b2b_orders', url: '/orders', icon: ShoppingBag },
      { key: 'b2b_payment_attempts', url: '/orders/payment-attempts', icon: ClipboardList },
      { key: 'b2b_dealers', url: '/dealers', icon: Store },
    ],
  },
  {
    id: 4,
    key: 'bereket_content',
    items: [
      { key: 'bereket_blog', url: '/custompage?module=news', icon: Newspaper },
      { key: 'bereket_news', url: '/custompage?module=blog', icon: Newspaper },
      { key: 'bereket_blog_comments', url: '/comments', icon: MessageSquare },
      { key: 'bereket_corporate', url: '/custompage?module=bereketfide_about', icon: FileText },
      { key: 'bereket_legal', url: '/custompage?module=bereketfide_legal', icon: FileSearch },
      { key: 'library', url: '/library', icon: BookOpen },
    ],
  },
  {
    id: 3,
    key: 'system',
    items: [
      { key: 'users', url: '/users', icon: Users },
      { key: 'email_templates', url: '/email-templates', icon: Mail },
      { key: 'notifications', url: '/notifications', icon: Bell },
      { key: 'storage', url: '/storage', icon: HardDrive },
      { key: 'db', url: '/db-admin', icon: Database },
      { key: 'audit', url: '/audit', icon: FileSearch },
      { key: 'cache', url: '/cache', icon: RefreshCcw },
      { key: 'theme', url: '/theme', icon: Palette },
      { key: 'bereket_settings', url: '/site-settings', icon: Settings },
    ],
  },
  {
    id: 5,
    key: 'marketing',
    items: [
      { key: 'newsletter', url: '/newsletter', icon: Mail },
    ],
  },
  {
    id: 6,
    key: 'communication',
    items: [
      { key: 'telegram', url: '/telegram', icon: Send },
    ],
  },
];

export type AdminNavCopy = {
  labels: Record<AdminNavGroupKey, string>;
  items: Record<AdminNavItemKey, string>;
};

// Fallback titles for when translations are missing
const FALLBACK_TITLES: Record<AdminNavItemKey, string> = {
  dashboard: 'Dashboard',
  site_settings: 'Site Settings',
  custom_pages: 'Custom Pages',
  categories: 'Categories',
  subcategories: 'Subcategories',
  products: 'Products',
  sparepart: 'Spare Parts',
  services: 'Services',
  sliders: 'Sliders',
  menu_items: 'Menu Items',
  footer_sections: 'Footer Sections',
  faqs: 'FAQs',
  offers: 'Offers',
  catalog_requests: 'Catalog Requests',
  contacts: 'Contacts',
  b2b_orders: 'B2B Orders',
  b2b_payment_attempts: 'Payment Attempts',
  b2b_dealers: 'Dealers',
  reviews: 'Reviews',
  mail: 'Mail',
  users: 'Users',
  email_templates: 'E-posta Şablonları',
  notifications: 'Notifications',
  support: 'Support Tickets',
  storage: 'Storage',
  db: 'Veritabanı Yönetimi',
  audit: 'Audit',

  reports: 'Reports',
  telegram: 'Telegram',
  chat: 'Chat & AI',
  theme: 'Tema Ayarları',
  bereket_projects: 'Ürünler',
  bereket_categories: 'Kategoriler',
  references: 'İş Birliği Firmaları',
  bereket_gallery: 'Galeri',
  bereket_offers: 'Teklifler',
  bereket_blog: 'Haberler',
  bereket_news: 'Bilgi Bankası',
  bereket_blog_comments: 'Haber Yorumları',
  bereket_corporate: 'Kurumsal Sayfalar',
  bereket_legal: 'Yasal Sayfalar',
  bereket_settings: 'Site Ayarları',
  library: 'Kataloglar',
  newsletter: 'Bülten Aboneleri',
  cache: 'Cache Yönetimi',
  inventory: 'Envanter İzleme',
  extras: 'Ekstra Fideler',
};

export function buildAdminSidebarItems(
  copy?: Partial<AdminNavCopy> | null,
  t?: TranslateFn,
  itemEnabled: (key: AdminNavItemKey) => boolean = () => true,
): NavGroup[] {
  const labels = copy?.labels ?? ({} as AdminNavCopy['labels']);
  const items = copy?.items ?? ({} as AdminNavCopy['items']);

  return adminNavConfig
    .map((group) => {
      const label =
        labels[group.key] || (t ? t(`admin.sidebar.groups.${group.key}` as any) : '') || '';

      const visibleItems = group.items.filter((item) => itemEnabled(item.key));

      return {
        id: group.id,
        label,
        items: visibleItems.map((item) => {
          const title =
            items[item.key] ||
            (t ? t(`admin.dashboard.items.${item.key}` as any) : '') ||
            FALLBACK_TITLES[item.key] ||
            item.key;

          return {
            title,
            url: item.url,
            icon: item.icon,
          };
        }),
      };
    })
    .filter((group) => group.items.length > 0);
}
