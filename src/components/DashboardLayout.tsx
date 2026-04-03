'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { theme, cn, getCardClasses } from '@/lib/theme';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  userRole: 'student' | 'runner' | 'admin';
}

// Navigation items for different user roles
const navigationConfig = {
  student: [
    { name: 'Dashboard', href: '/student', icon: '🏠' },
    { name: 'Create Order', href: '/student/create-order', icon: '➕' },
    { name: 'My Orders', href: '/student/orders', icon: '📦' },
    { name: 'Wallet', href: '/student/wallet', icon: '💳' },
    { name: 'Notifications', href: '/student/notifications', icon: '🔔' },
    { name: 'Profile', href: '/student/profile', icon: '👤' }
  ],
  runner: [
    { name: 'Dashboard', href: '/runner', icon: '🏠' },
    { name: 'Available Jobs', href: '/runner/jobs', icon: '💼' },
    { name: 'My Jobs', href: '/runner/jobs?filter=active', icon: '🏃♂️' },
    { name: 'Earnings', href: '/runner/earnings', icon: '💰' },
    { name: 'Profile', href: '/runner/profile', icon: '👤' }
  ],
  admin: [
    { name: 'Dashboard', href: '/admin', icon: '🏠' },
    { name: 'Orders', href: '/admin/orders', icon: '📦' },
    { name: 'Students', href: '/admin/students', icon: '👥' },
    { name: 'Runners', href: '/admin/runners', icon: '🏃♂️' },
    { name: 'Transactions', href: '/admin/transactions', icon: '💳' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' }
  ]
};

export default function DashboardLayout({ children, userRole }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, profile, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = navigationConfig[userRole] || navigationConfig.student;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActiveRoute = (href: string) => {
    if (href === `/${userRole}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getUserInitial = () => {
    return profile?.full_name?.charAt(0) || userRole.charAt(0).toUpperCase();
  };

  const getUserGradient = () => {
    switch (userRole) {
      case 'student': return 'from-sky-500 to-cyan-500';
      case 'runner': return 'from-amber-500 to-orange-500';
      case 'admin': return 'from-purple-500 to-pink-500';
      default: return 'from-sky-500 to-cyan-500';
    }
  };

  const getStatusColor = () => {
    switch (userRole) {
      case 'runner': return 'bg-green-500';
      case 'admin': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusText = () => {
    switch (userRole) {
      case 'runner': return 'Online';
      case 'admin': return 'Admin';
      default: return 'Active';
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Image 
              src="/logo.png" 
              alt="CampusRunner" 
              width={28} 
              height={28}
              className="w-7 h-7"
            />
          </div>
          <div className="w-8 h-8 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-slate-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-8 border-b border-slate-800">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Image 
                src="/logo.png" 
                alt="CampusRunner" 
                width={24} 
                height={24}
                className="w-6 h-6"
              />
            </div>
            <div>
              <span className="text-xl font-bold text-white">CampusRunner</span>
              <div className="text-xs text-slate-400 capitalize">{userRole} Portal</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200 font-medium",
                    isActiveRoute(item.href) && "bg-slate-800 text-white shadow-lg"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* User Profile Card */}
          <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-lg",
                  `bg-gradient-to-br ${getUserGradient()}`
                )}>
                  {getUserInitial()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">
                    {profile?.full_name || `${userRole.charAt(0).toUpperCase()}${userRole.slice(1)}`}
                  </div>
                  <div className="text-slate-400 text-sm truncate">
                    {user?.email}
                  </div>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">Status</span>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full animate-pulse", getStatusColor())}></div>
                  <span className="text-green-400 text-sm font-medium">{getStatusText()}</span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full text-left text-slate-300 hover:text-white text-sm py-2 px-3 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-4 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                <Image 
                  src="/logo.png" 
                  alt="CampusRunner" 
                  width={20} 
                  height={20}
                  className="w-5 h-5"
                />
              </div>
              <div>
                <span className="font-semibold text-slate-900 text-sm">CampusRunner</span>
                <div className="text-xs text-slate-500 capitalize">{userRole}</div>
              </div>
            </div>

            {/* Mobile user avatar */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md",
              `bg-gradient-to-br ${getUserGradient()}`
            )}>
              {getUserInitial()}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}