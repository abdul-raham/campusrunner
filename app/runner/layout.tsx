'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, LogOut, Settings, Home, Briefcase, TrendingUp, User } from 'lucide-react';
import Image from 'next/image';
import { MobileNavbar } from '@/components/MobileNavbar';

export default function RunnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'runner')) {
      router.push('/login');
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#6200EE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#0B0E11] font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== 'runner') {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/runner', icon: Home },
    { label: 'Available Jobs', href: '/runner/jobs', icon: Briefcase },
    { label: 'Earnings', href: '/runner/earnings', icon: TrendingUp },
    { label: 'Profile', href: '/runner/profile', icon: User },
  ];

  const handleLogout = async () => {
    const { supabase } = await import('@/supabase/client');
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Navbar */}
      <MobileNavbar 
        userRole="runner" 
        userName={profile?.full_name || 'Runner'}
      />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 glass border-r border-white/20 shadow-2xl">
        <div className="h-full flex flex-col w-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6200EE] to-[#4F2EE8] shadow-lg">
                <Image src="/logo.png" alt="CampusRunner" width={24} height={24} className="rounded-lg" />
              </div>
              <div>
                <p className="text-sm font-extrabold tracking-tight text-[#0B0E11]">CampusRunner</p>
                <p className="-mt-1 text-xs text-[#6B7280]">Runner</p>
              </div>
            </div>

            {/* User Info */}
            {profile && (
              <div className="rounded-2xl bg-gradient-to-br from-[#6200EE]/10 to-[#4F2EE8]/5 p-4 border border-white/20 backdrop-blur-sm">
                <p className="text-xs text-[#6B7280] font-semibold mb-1">Welcome back</p>
                <p className="text-sm font-extrabold text-[#0B0E11]">{profile.full_name}</p>
                <p className="text-xs text-[#6B7280] mt-2">👤 Tier: Campus Hero</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-[#0B0E11] font-semibold transition-all duration-200 hover:bg-white/50 backdrop-blur-sm"
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
            <button className="w-full flex items-center gap-3 px-4 py-3 text-[#0B0E11] rounded-2xl hover:bg-white/50 font-semibold transition-all duration-200">
              <div className="p-2 rounded-xl bg-gray-100">
                <Settings className="w-4 h-4" />
              </div>
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#EF4444] rounded-2xl hover:bg-red-50 font-semibold transition-all duration-200"
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
