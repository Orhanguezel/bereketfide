'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ALLOWED_PREFIXES = [
  '/dashboard',
  '/products',
  '/categories',
  '/subcategories',
  '/gallery',
  '/offer',
  '/custompage',
  '/reviews',
  '/site-settings',
  '/contacts',
  '/menuitem',
  '/library',
  '/references',
  '/users',
  '/notifications',
  '/storage',
  '/audit',
  '/profile',
] as const;

function isAllowed(pathname: string | null): boolean {
  if (!pathname) return true;
  return ALLOWED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function KompozitAdminRouteGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isAllowed(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl items-center justify-center">
      <Card className="w-full border-orange-200 bg-orange-50/60">
        <CardHeader>
          <CardTitle>Bu ekran Bereket Fide panelinde aktif değil</CardTitle>
          <CardDescription>
            Bu admin panel Bereket Fide operasyonları için özelleştirildi. Bu route mevcut panelde aktif değil.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/site-settings">Site Settings</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
