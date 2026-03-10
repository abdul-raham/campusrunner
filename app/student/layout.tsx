'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, Package, CreditCard, Bell, User, Settings, LogOut, Menu, X } from 'lucide-react';
import Image from 'next/image';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#6200EE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== 'student') {
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
    const { supabase } = await import('@/supabase/client');
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white shadow-md flex items-center justify-center">
                  <Image src="/logo.png" alt="CampusRunner" width={20} height={20} className="rounded-lg" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">CampusRunner</p>
                  <p className="text-xs text-gray-500">Student Portal</p>
                </div>
              </div>
              <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
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
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-[#6200EE]/10 hover:text-[#6200EE] transition-all font-medium"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium">
              <Settings className="w-5 h-5" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 md:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <button onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white shadow-md flex items-center justify-center">
                <Image src="/logo.png" alt="CampusRunner" width={20} height={20} className="rounded-lg" />
              </div>
              <span className="font-bold text-gray-900">CampusRunner</span>
            </div>
            <div className="w-8 h-8 bg-[#6200EE] rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {profile?.full_name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
