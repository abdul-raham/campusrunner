'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { NotificationService, type Notification } from '@/services/notifications';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
      
      // Subscribe to real-time notifications
      const subscription = NotificationService.subscribeToNotifications(
        user.id,
        (newNotification) => {
          setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Keep only 20 most recent
          setUnreadCount(prev => prev + 1);
          
          // Optional: Show browser notification (if permission granted)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.svg'
            });
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const data = await NotificationService.getNotifications(user.id, 20);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!user) return;
    
    const count = await NotificationService.getUnreadCount(user.id);
    setUnreadCount(count);
  };

  const markAsRead = async (notificationId: string) => {
    const success = await NotificationService.markAsRead(notificationId);
    if (success) {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    return success;
  };

  const markAllAsRead = async () => {
    if (!user) return false;
    
    const success = await NotificationService.markAllAsRead(user.id);
    if (success) {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    }
    return success;
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    requestNotificationPermission,
    refresh: fetchNotifications
  };
}
