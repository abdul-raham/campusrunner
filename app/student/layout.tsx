'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, Package, CreditCard, Bell, User, Settings, LogOut, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { MobileNavbar } from '@/components/MobileNavbar';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'student')) {
      router.push('/login');
    }
  }, [user, profile, loading, router]);

  // Show layout immediately if user exists, even if profile is still loading
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#6200EE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!loading && (!user || profile?.role !== 'student')) {
    return null;
  }

  const navItems = [
    { label: 'Dashboard', href: '/student', icon: Home },
    { label: 'My Orders', href: '/student/orders', icon: Package },
    { label: 'Wallet', href: '/student/wallet', icon: CreditCard },
    { label: 'Notifications', href: '/student/notifications', icon: Bell },
    { label: 'Profile', href: '/student/profile', icon: User },
  ];

  const handleLogout = async () => {
    try {
      const { supabase } = await import('@/supabase/client');
      await supabase.auth.signOut();
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Navbar */}
      <MobileNavbar 
        userRole="student" 
        userName={profile?.full_name || 'Student'}
      />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 glass border-r border-white/20 shadow-2xl">
        <div className="h-full flex flex-col w-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6200EE] to-[#03DAC5] p-0.5 shadow-lg">
                <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                  <Image src="/logo.png" alt="CampusRunner" width={24} height={24} className="rounded-lg" />
                </div>
              </div>
              <div>
                <p className="font-black text-[#0B0E11]">CampusRunner</p>
                <p className="text-xs text-[#6B7280]">Student Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-[#374151] hover:bg-white/50 hover:text-[#6200EE] transition-all font-semibold backdrop-blur-sm"
                >
                  <div className="p-2 rounded-xl bg-gray-100 group-hover:bg-[#6200EE]/10 group-hover:text-[#6200EE] transition-all">
                    <Icon className="w-4 h-4" />
                  </div>
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-[#374151] rounded-2xl hover:bg-white/50 transition-all font-semibold">
              <div className="p-2 rounded-xl bg-gray-100">
                <Settings className="w-4 h-4" />
              </div>
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 rounded-2xl hover:bg-red-50 transition-all font-semibold"
            >
              <div className="p-2 rounded-xl bg-red-100">
                <LogOut className="w-4 h-4" />
              </div>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
