'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CreditCard, Home, LogOut, Package, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { BrandMark } from '@/components/ui/BrandMark';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';

const nav = [
  { href: '/runner', label: 'Home', icon: Home },
  { href: '/runner/jobs', label: 'Jobs', icon: Package },
  { href: '/runner/earnings', label: 'Earnings', icon: CreditCard },
  { href: '/runner/profile', label: 'Profile', icon: User },
];

export default function RunnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'runner')) {
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

  if (!user || profile?.role !== 'runner') return null;

  // For now, let's assume all runners are approved since we don't have verification_status in Profile
  // const isPending = profile?.verification_status === 'pending';
  // const isRejected = profile?.verification_status === 'rejected';
  const isPending = false;
  const isRejected = false;

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F6F7FB] via-white to-[#F0EBFF]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md rounded-[28px] border border-[#E9E4FF] bg-white p-8 text-center shadow-lg"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF3CD] mx-auto">
            <span className="text-2xl">⏳</span>
          </div>
          <h2 className="text-2xl font-black text-[#0B0E11]">Verification Pending</h2>
          <p className="mt-3 text-[#6B7280]">Your runner account is under review. We'll notify you once it's approved.</p>
          <button
            onClick={handleLogout}
            className="mt-6 w-full rounded-2xl border border-[#E9E4FF] bg-white px-4 py-3 font-semibold text-[#6200EE] transition hover:bg-[#F8F5FF]"
          >
            Logout
          </button>
        </motion.div>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F6F7FB] via-white to-[#F0EBFF]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-lg"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 mx-auto">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-black text-red-600">Verification Rejected</h2>
          <p className="mt-3 text-[#6B7280]">Your runner application was not approved. Please contact support for more information.</p>
          <button
            onClick={handleLogout}
            className="mt-6 w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-100"
          >
            Logout
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F7FB] via-white to-[#F0EBFF]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <motion.aside 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden w-[280px] border-r border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6 lg:block"
        >
          <div className="flex items-center gap-3 mb-8">
            <BrandMark className="h-12 w-12" />
            <div>
              <p className="font-black text-[#0B0E11]">CampusRunner</p>
              <p className="text-xs text-[#6B7280]">Runner Panel</p>
            </div>
          </div>

          {/* User Info Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 rounded-2xl border border-[#E9E4FF] bg-gradient-to-br from-[#6200EE]/5 to-[#03DAC5]/5 p-4"
          >
            <p className="text-xs font-semibold text-[#6B7280] mb-1">Welcome back</p>
            <p className="text-sm font-black text-[#0B0E11]">{profile?.full_name}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-600">Online</span>
            </div>
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
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#6200EE] to-[#4F2EE8] text-white shadow-lg shadow-[#6200EE]/25'
                        : 'text-[#6B7280] hover:bg-[#F4ECFF] hover:text-[#6200EE]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
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
            className="mt-8 space-y-2 flex flex-col"
          >
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
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
        <div className="mx-auto grid max-w-md grid-cols-4 gap-0 px-2 py-2">
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
                  <Icon className="h-5 w-5" />
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
    </div>
  );
}
