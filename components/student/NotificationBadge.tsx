'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { Bell } from 'lucide-react';

export default function NotificationBadge() {
  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <Bell className="w-4 h-4" />
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-bold">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
}
