'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, User, Package, Bell, Settings, LogOut, Zap } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface MobileNavbarProps {
  userRole?: 'student' | 'runner' | 'admin';
  userName?: string;
  userAvatar?: string;
}

export function MobileNavbar({ userRole = 'student', userName = 'User', userAvatar }: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = {
    student: [
      { icon: Home, label: 'Dashboard', href: '/student/dashboard' },
      { icon: Package, label: 'Orders', href: '/student/orders' },
      { icon: Bell, label: 'Notifications', href: '/student/notifications' },
      { icon: User, label: 'Profile', href: '/student/profile' },
    ],
    runner: [
      { icon: Home, label: 'Dashboard', href: '/runner/home' },
      { icon: Package, label: 'Jobs', href: '/runner/jobs' },
      { icon: Zap, label: 'Earnings', href: '/runner/earnings' },
      { icon: User, label: 'Profile', href: '/runner/profile' },
    ],
    admin: [
      { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
      { icon: Package, label: 'Orders', href: '/admin/orders' },
      { icon: User, label: 'Users', href: '/admin/users' },
      { icon: Settings, label: 'Settings', href: '/admin/settings' },
    ]
  };

  const currentNavItems = navItems[userRole];

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#6200EE] to-[#03DAC5] shadow-lg">
              <Image src="/logo.png" alt="CampusRunner" width={20} height={20} className="rounded-lg" />
            </div>
            <div>
              <h1 className="text-sm font-black text-[#0B0E11]">CampusRunner</h1>
              <p className="text-xs text-[#6B7280] capitalize">{userRole} Portal</p>
            </div>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-[#6200EE]/10 to-[#03DAC5]/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5 text-[#6200EE]" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5 text-[#6200EE]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white/95 backdrop-blur-2xl border-r border-white/20 shadow-2xl md:hidden"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#6200EE] to-[#03DAC5] p-0.5">
                      <div className="h-full w-full rounded-2xl bg-white flex items-center justify-center">
                        {userAvatar ? (
                          <Image src={userAvatar} alt={userName} width={40} height={40} className="rounded-2xl" />
                        ) : (
                          <User className="h-6 w-6 text-[#6200EE]" />
                        )}
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-[#6200EE] to-[#03DAC5] flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0B0E11]">{userName}</h3>
                    <p className="text-sm text-[#6B7280] capitalize">{userRole}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 p-4 space-y-2">
                {currentNavItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`group flex items-center gap-4 rounded-2xl p-4 transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#6200EE]/10 to-[#03DAC5]/10 border border-[#6200EE]/20'
                            : 'hover:bg-white/50 hover:backdrop-blur-sm'
                        }`}
                      >
                        <div className={`rounded-xl p-2 transition-all ${
                          isActive 
                            ? 'bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white shadow-lg' 
                            : 'bg-gray-100 text-[#6B7280] group-hover:bg-[#6200EE]/10 group-hover:text-[#6200EE]'
                        }`}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className={`font-semibold ${
                          isActive ? 'text-[#6200EE]' : 'text-[#374151] group-hover:text-[#6200EE]'
                        }`}>
                          {item.label}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-[#6200EE] to-[#03DAC5]"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-white/10">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Handle logout
                    router.push('/login');
                  }}
                  className="group flex w-full items-center gap-4 rounded-2xl p-4 text-red-500 hover:bg-red-50 transition-all duration-200"
                >
                  <div className="rounded-xl p-2 bg-red-100 group-hover:bg-red-200 transition-all">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16 md:hidden" />
    </>
  );
}
