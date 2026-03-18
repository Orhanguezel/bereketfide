'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useGetUnreadCountQuery, useListNotificationsQuery } from '@/integrations/hooks';
import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';

export function NotificationBell() {
  const t = useAdminT('notifications');
  const tc = useAdminT('common');
  
  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000, // 30 seconds
  });
  
  const { data: notifications = [] } = useListNotificationsQuery(
    { limit: 5 }, 
    { skip: !unreadData || unreadData.count === 0 }
  );

  const count = unreadData?.count ?? 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {count > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -right-1 -top-1 px-1.5 py-0.5 text-[10px] min-w-[18px] flex items-center justify-center h-[18px] rounded-full"
            >
              {count > 99 ? '99+' : count}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[300px] p-0">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h4 className="text-sm font-semibold">{t('title')}</h4>
          <Link 
            href="/admin/notifications" 
            className="text-xs text-primary hover:underline"
          >
            {t('actions.viewAll') || 'Tümünü Gör'}
          </Link>
        </div>
        <div className="max-h-[300px] overflow-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-xs text-muted-foreground">
              {t('list.empty') || tc('noRecords')}
            </p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href="/admin/notifications"
                className="flex flex-col gap-1 border-b p-3 hover:bg-muted last:border-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold truncate">{n.title}</span>
                  {!n.is_read && <div className="size-2 rounded-full bg-primary" />}
                </div>
                <p className="line-clamp-2 text-[11px] text-muted-foreground">
                  {n.message}
                </p>
              </Link>
            ))
          )}
        </div>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
            <Link href="/admin/notifications">
              {t('actions.viewAll') || 'Tümünü Gör'}
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
