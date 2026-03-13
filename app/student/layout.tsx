'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Home, Package, CreditCard, Bell, User, LogOut, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { BrandMark } from '@/components/ui/BrandMark';
import { motion } from 'framer-motion';
import NotificationBadge from '@/components/student/NotificationBadge';
import { ThemeToggle } from '@/components/ThemeToggle';

const nav = [
  { href: '/student', label: 'Home', icon: Home },
  { href: '/student/orders', label: 'My Orders', icon: Package },
  { href: '/student/wallet', label: 'Wallet', icon: CreditCard },
  { href: '/student/notifications', label: 'Notifications', icon: Bell },
  { href: '/student/profile', label: 'Profile', icon: User },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'student')) {
      router.push('/login');
    }
  }, [loading, user, profile, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F6F7FB] via-white to-[#F0EBFF]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-[#6200EE] border-t-transparent"
          />
          <p className="text-sm font-semibold text-[#6B7280]">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!user || profile?.role !== 'student') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F7FB] via-white to-[#F0EBFF]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <motion.aside 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden w-64 border-r border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-4 lg:block"
        >
          <div className="flex items-center gap-2 mb-6">
            <BrandMark className="h-8 w-8" />
            <div>
              <p className="text-sm font-black text-[#0B0E11]">CampusRunner</p>
              <p className="text-[10px] text-[#6B7280]">Student Portal</p>
            </div>
          </div>

          {/* User Info Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4 rounded-xl border border-[#E9E4FF] bg-gradient-to-br from-[#6200EE]/5 to-[#03DAC5]/5 p-3"
          >
            <p className="text-[10px] font-semibold text-[#6B7280] mb-1">Welcome back</p>
            <p className="text-xs font-black text-[#0B0E11] truncate">{profile?.full_name}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-blue-600">Active</span>
            </div>
          </motion.div>

          {/* Quick Create Order Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-4"
          >
            <Link
              href="/student/create-order"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6200EE] to-[#03DAC5] px-3 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#6200EE]/25 transition-all hover:shadow-xl hover:shadow-[#6200EE]/40"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Order
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="space-y-2">
            {nav.map((item, idx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#6200EE] to-[#4F2EE8] text-white shadow-lg shadow-[#6200EE]/25'
                        : 'text-[#6B7280] hover:bg-[#F4ECFF] hover:text-[#6200EE]'
                    }`}
                  >
                    <div className="relative">
                      <Icon className="h-4 w-4" />
                      {item.label === 'Notifications' && (
                        <div className="absolute -top-1 -right-1">
                          <NotificationBadge />
                        </div>
                      )}
                    </div>
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Theme Toggle & Logout */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-auto pt-4 space-y-2"
          >
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-[10px] font-semibold text-[#6B7280]">Theme</span>
              <ThemeToggle />
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </motion.div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 pb-24 lg:pb-0">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-[#E9E4FF] bg-white/95 backdrop-blur-xl shadow-2xl lg:hidden safe-area-bottom"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-0 px-2 py-2">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center gap-1 py-2 cursor-pointer"
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#6200EE] to-[#4F2EE8] text-white shadow-lg shadow-[#6200EE]/30'
                      : 'bg-[#F4ECFF] text-[#6B7280]'
                  }`}
                >
                  <div className="relative">
                    <Icon className="h-5 w-5" />
                    {item.label === 'Notifications' && !isActive && (
                      <div className="absolute -top-1 -right-1">
                        <NotificationBadge />
                      </div>
                    )}
                  </div>
                </motion.div>
                <span
                  className={`text-[11px] font-bold ${
                    isActive ? 'text-[#6200EE]' : 'text-[#6B7280]'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute -bottom-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#6200EE] to-[#03DAC5]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </motion.nav>

      {/* Floating Create Order Button (Mobile) */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="fixed bottom-20 right-4 z-40 lg:hidden"
      >
        <Link
          href="/student/create-order"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white shadow-2xl shadow-[#6200EE]/40 transition-all hover:scale-110"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </motion.div>
    </div>
  );
}