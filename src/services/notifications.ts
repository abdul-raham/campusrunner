'use client';

import { supabase } from '@/lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export class NotificationService {
  // Create notification for student
  static async createNotification(userId: string, title: string, message: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  // Get notifications for user
  static async getNotifications(userId: string, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Mark all notifications as read for user
  static async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  // Get unread count
  static async getUnreadCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Subscribe to real-time notifications (for free plan)
  static subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    const subscription = supabase
      .channel(`notifications-${userId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return subscription;
  }
}

// Order status change notification triggers
export class OrderNotifications {
  // Notify when runner accepts order
  static async notifyOrderAccepted(studentId: string, orderId: string, runnerName: string) {
    return NotificationService.createNotification(
      studentId,
      'Order Accepted!',
      `${runnerName} has accepted your order #${orderId.slice(-8)}. They will start working on it soon.`
    );
  }

  // Notify when order status changes to in_progress
  static async notifyOrderInProgress(studentId: string, orderId: string, runnerName: string) {
    return NotificationService.createNotification(
      studentId,
      'Order In Progress',
      `${runnerName} has started working on your order #${orderId.slice(-8)}.`
    );
  }

  // Notify when order is completed
  static async notifyOrderCompleted(studentId: string, orderId: string, runnerName: string) {
    return NotificationService.createNotification(
      studentId,
      'Order Completed!',
      `Your order #${orderId.slice(-8)} has been completed by ${runnerName}. Please check and confirm.`
    );
  }

  // Notify when order is cancelled
  static async notifyOrderCancelled(studentId: string, orderId: string, reason?: string) {
    return NotificationService.createNotification(
      studentId,
      'Order Cancelled',
      `Your order #${orderId.slice(-8)} has been cancelled. ${reason ? `Reason: ${reason}` : ''}`
    );
  }
}
