'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  Bell, 
  BellOff, 
  Check, 
  CheckCheck, 
  Trash2, 
  Filter,
  Search,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

import { PageLoader } from '@/components/PageLoader';

export default function StudentNotificationsPage() {
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead,
    refresh 
  } = useNotifications();
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.is_read) ||
                         (filter === 'read' && notification.is_read);
    return matchesSearch && matchesFilter;
  });

  const getNotificationIcon = (title: string) => {
    if (title.includes('Accepted')) return CheckCircle2;
    if (title.includes('Progress')) return Clock;
    if (title.includes('Completed')) return Package;
    if (title.includes('Cancelled')) return XCircle;
    return Bell;
  };

  const getNotificationColor = (title: string) => {
    if (title.includes('Accepted')) return 'text-blue-600 bg-blue-100';
    if (title.includes('Progress')) return 'text-purple-600 bg-purple-100';
    if (title.includes('Completed')) return 'text-green-600 bg-green-100';
    if (title.includes('Cancelled')) return 'text-red-600 bg-red-100';
    return 'text-[#6200EE] bg-[#6200EE]/10';
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-3 py-4 md:px-8 md:py-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-black text-[#0B0E11] sm:text-4xl">Notifications</h1>
            <p className="text-[#6B7280] mt-2">
              Stay updated with your order status and important updates
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </motion.button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'read', label: 'Read', count: notifications.length - unreadCount },
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  filter === filterOption.key
                    ? 'bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white shadow-lg'
                    : 'bg-white/50 text-[#6B7280] border border-[#E9E4FF] hover:bg-[#F4ECFF] hover:text-[#6200EE]'
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, idx) => {
            const NotificationIcon = getNotificationIcon(notification.title);
            const colorClass = getNotificationColor(notification.title);
            
            return (
              <motion.div
                key={notification.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01, y: -2 }}
                className={`group rounded-2xl border backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                  notification.is_read 
                    ? 'border-[#E9E4FF] bg-white/30' 
                    : 'border-[#6200EE]/30 bg-white/70 shadow-[#6200EE]/10'
                }`}
                onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${colorClass} flex-shrink-0`}>
                    <NotificationIcon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-black text-[#0B0E11] group-hover:text-[#6200EE] transition-colors ${
                        !notification.is_read ? 'text-lg' : 'text-base'
                      }`}>
                        {notification.title}
                        {!notification.is_read && (
                          <span className="ml-2 w-2 h-2 bg-[#6200EE] rounded-full inline-block animate-pulse"></span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-[#6B7280]">
                          {new Date(notification.created_at).toLocaleDateString()} at{' '}
                          {new Date(notification.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {!notification.is_read && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="p-1 rounded-full bg-[#6200EE]/10 text-[#6200EE] hover:bg-[#6200EE]/20 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-[#6B7280] leading-relaxed ${
                      !notification.is_read ? 'font-medium' : ''
                    }`}>
                      {notification.message}
                    </p>
                    
                    {!notification.is_read && (
                      <div className="mt-3 pt-3 border-t border-[#E9E4FF]">
                        <p className="text-xs text-[#6200EE] font-semibold">
                          Click to mark as read
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-16 rounded-2xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl"
          >
            {searchTerm || filter !== 'all' ? (
              <>
                <Search className="w-16 h-16 text-[#6B7280] mx-auto mb-4" />
                <h3 className="text-xl font-black text-[#0B0E11] mb-2">No matching notifications</h3>
                <p className="text-[#6B7280] mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <BellOff className="w-16 h-16 text-[#6B7280] mx-auto mb-4" />
                <h3 className="text-xl font-black text-[#0B0E11] mb-2">No notifications yet</h3>
                <p className="text-[#6B7280] mb-6">
                  You'll receive notifications here when there are updates about your orders
                </p>
                <button
                  onClick={refresh}
                  className="px-6 py-3 bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Refresh
                </button>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Notification Settings */}
      {notifications.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="mt-8 rounded-2xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-black text-[#0B0E11] mb-4">Notification Preferences</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-white to-[#F4ECFF] border border-[#E9E4FF]">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#6200EE]" />
                <div>
                  <p className="font-bold text-[#0B0E11]">Order Updates</p>
                  <p className="text-xs text-[#6B7280]">Get notified about order status changes</p>
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-white to-[#F4ECFF] border border-[#E9E4FF]">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-[#6200EE]" />
                <div>
                  <p className="font-bold text-[#0B0E11]">Important Alerts</p>
                  <p className="text-xs text-[#6B7280]">System updates and announcements</p>
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}