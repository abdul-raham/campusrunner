'use client';

import { CreditCard, LayoutDashboard, Package, Settings, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { AppShell } from '@/components/ui/AppShell';

const nav = [
  { href: '/admin', label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', shortLabel: 'Orders', icon: Package },
  { href: '/admin/runners', label: 'Runners', shortLabel: 'Runners', icon: Users },
  { href: '/admin/students', label: 'Students', shortLabel: 'Students', icon: Users },
  { href: '/admin/transactions', label: 'Transactions', shortLabel: 'Cash', icon: CreditCard },
  { href: '/admin/settings', label: 'Settings', shortLabel: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.replace('/login?logged_out=1');
    }
  }, [loading, user, profile, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="h-14 w-14 rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') return null;

  return (
    <AppShell
      pathname={pathname}
      nav={nav}
      roleLabel="Admin Control"
      profileName={profile?.full_name || 'Admin'}
      profileMeta={'Monitor operations, people, and revenue in one place.'}
      accent="amber"
      onLogout={handleLogout}
    >
      {children}
    </AppShell>
  );
}
