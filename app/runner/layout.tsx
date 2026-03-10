'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, LogOut, Settings, Home, Briefcase, TrendingUp, User } from 'lucide-react';
import Image from 'next/image';

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
      <div className="min-h-screen flex items-center justify-center bg-[#F6F7FB]">
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
    <div className="flex h-screen bg-[#F6F7FB]">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-[#E9E4FF] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#E9E4FF]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6200EE] to-[#4F2EE8] shadow-lg">
                  <Image src="/logo.png" alt="CampusRunner" width={24} height={24} className="rounded-lg" />
                </div>
                <div>
                  <p className="text-sm font-extrabold tracking-tight text-[#0B0E11]">CampusRunner</p>
                  <p className="-mt-1 text-xs text-[#6B7280]">Runner</p>
                </div>
              </div>
              <button
                className="md:hidden p-2 hover:bg-[#F6F7FB] rounded-xl transition"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-5 h-5 text-[#0B0E11]" />
              </button>
            </div>

            {/* User Info */}
            {profile && (
              <div className="rounded-2xl bg-gradient-to-br from-[#6200EE]/10 to-[#4F2EE8]/5 p-4 border border-[#E9E4FF]">
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
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[#0B0E11] font-semibold transition-all duration-200 hover:bg-[#F6F7FB] active:bg-[#6200EE] active:text-white group"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 group-active:text-white transition" />
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[#E9E4FF] space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-[#0B0E11] rounded-2xl hover:bg-[#F6F7FB] font-semibold transition-all duration-200">
              <Settings className="w-5 h-5" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#EF4444] rounded-2xl hover:bg-red-50 font-semibold transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E9E4FF] px-6 py-4 flex items-center justify-between">
          <button
            className="md:hidden p-2 hover:bg-[#F6F7FB] rounded-xl transition"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-[#0B0E11]" />
          </button>
          <div className="flex-1 flex items-center justify-between ml-4 md:ml-0">
            <h1 className="text-xl font-extrabold text-[#0B0E11]">CampusRunner</h1>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block px-4 py-2 rounded-full bg-[#03DAC5]/10 text-[#03DAC5] text-sm font-bold border border-[#03DAC5]/30">
                🟢 Available
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute right-[-120px] top-[-80px] h-[320px] w-[320px] rounded-full bg-[#6200EE]/10 blur-3xl" />
            <div className="absolute left-[-100px] top-[200px] h-[300px] w-[300px] rounded-full bg-[#03DAC5]/10 blur-3xl" />
          </div>
          <div className="relative">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
