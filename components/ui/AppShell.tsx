'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogOut, LucideIcon, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BrandMark } from '@/components/ui/BrandMark';
import { useNotifications } from '@/hooks/useNotifications';

export type ShellNavItem = {
  href: string;
  label: string;
  shortLabel?: string;
  icon: LucideIcon;
  badge?: number;
};

interface AppShellProps {
  pathname: string;
  nav: ShellNavItem[];
  roleLabel: string;
  profileName?: string | null;
  profileMeta?: string | null;
  accent?: 'blue' | 'amber' | 'violet';
  onLogout: () => void | Promise<void>;
  children: React.ReactNode;
}

const accentMap = {
  blue: {
    active: 'from-sky-500 to-indigo-600',
    glow: 'shadow-indigo-500/25',
    badge: 'bg-sky-500/10 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
  amber: {
    active: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/25',
    badge: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  violet: {
    active: 'from-violet-500 to-fuchsia-600',
    glow: 'shadow-violet-500/25',
    badge: 'bg-violet-500/10 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
    dot: 'bg-violet-500',
  },
};

function SidebarContent({
  pathname,
  nav,
  roleLabel,
  profileName,
  profileMeta,
  palette,
  onLogout,
  onNavClick,
}: {
  pathname: string;
  nav: ShellNavItem[];
  roleLabel: string;
  profileName?: string | null;
  profileMeta?: string | null;
  palette: (typeof accentMap)['amber'];
  onLogout: () => void | Promise<void>;
  onNavClick?: () => void;
}) {
  const homeHref = pathname.startsWith('/admin')
    ? '/admin'
    : pathname.startsWith('/runner')
    ? '/runner'
    : '/student';

  return (
    <div className="flex h-full flex-col p-5">
      {/* Logo */}
      <Link href={homeHref} onClick={onNavClick} className="mb-7 flex items-center gap-3">
        <div className="relative">
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${palette.active} opacity-30 blur-lg`} />
          <BrandMark className="relative h-11 w-11 rounded-2xl ring-1 ring-white/20" />
        </div>
        <div>
          <p className="text-base font-black tracking-tight text-slate-900 dark:text-white">CampusRunner</p>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{roleLabel}</p>
        </div>
      </Link>

      {/* Profile card */}
      <div className="mb-5 rounded-2xl border border-white/50 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-800/50">
        <div className="mb-2 flex items-center justify-between">
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${palette.badge}`}>
            {roleLabel}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            Online
          </span>
        </div>
        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{profileName || 'Welcome'}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{profileMeta || 'Ready to go.'}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {nav.map((item, i) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 + i * 0.03 }}
            >
              <Link
                href={item.href}
                onClick={onNavClick}
                className={`group flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${palette.active} text-white shadow-lg ${palette.glow}`
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActive ? 'bg-white/15' : 'bg-slate-100/80 dark:bg-white/[0.06]'}`}>
                    <Icon className="h-[17px] w-[17px]" />
                  </span>
                  {item.label}
                </span>
                {!!item.badge && (
                  <span className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/15"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export function AppShell({
  pathname,
  nav,
  roleLabel,
  profileName,
  profileMeta,
  accent = 'blue',
  onLogout,
  children,
}: AppShellProps) {
  const palette = accentMap[accent];
  const [mobileOpen, setMobileOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <div
      className="min-h-screen text-slate-900 dark:text-slate-50"
      style={{
        background:
          'radial-gradient(ellipse 70% 40% at 8% 0%, rgba(201,149,42,.10), transparent 55%), radial-gradient(ellipse 50% 60% at 92% 100%, rgba(13,31,45,.07), transparent 55%), #f2f4f7',
      }}
    >
      <div className="dark:bg-slate-950/95 dark:min-h-screen" style={{ background: 'inherit' }}>
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">

          {/* Desktop sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block lg:w-[272px] lg:shrink-0 lg:p-4"
          >
            <div className="glass-sidebar sticky top-4 h-[calc(100vh-2rem)]">
              <SidebarContent
                pathname={pathname}
                nav={nav}
                roleLabel={roleLabel}
                profileName={profileName}
                profileMeta={profileMeta}
                palette={palette}
                onLogout={onLogout}
              />
            </div>
          </motion.aside>

          {/* Main content */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Top header */}
            <header className="sticky top-0 z-40 mx-3 mt-3 flex items-center gap-3 rounded-2xl border border-white/50 bg-white/75 px-4 py-3 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 lg:mx-4 lg:mt-4 lg:rounded-2xl">
              <button
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{roleLabel}</p>
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{profileName || 'CampusRunner'}</p>
              </div>

              <div className="flex items-center gap-2">
                <button className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300${unreadCount > 0 ? ' bell-ring' : ''}`}>
                  <Bell className="h-[17px] w-[17px]" />
                  {unreadCount > 0 && (
                    <span className="absolute right-2 top-2 min-w-4 rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <ThemeToggle />
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 px-3 pb-28 pt-4 lg:px-4 lg:pb-6 lg:pt-4">
              {children}
            </main>
          </div>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              <div className="glass-sidebar h-full rounded-r-[28px]">
                <div className="flex items-center justify-end px-5 pt-4">
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 text-slate-500 dark:border-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <SidebarContent
                  pathname={pathname}
                  nav={nav}
                  roleLabel={roleLabel}
                  profileName={profileName}
                  profileMeta={profileMeta}
                  palette={palette}
                  onLogout={onLogout}
                  onNavClick={() => setMobileOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 lg:hidden"
      >
        <div
          className="mx-auto grid max-w-lg gap-1 rounded-[24px] border border-white/50 bg-white/90 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/90"
          style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}
        >
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2"
              >
                {isActive && (
                  <motion.div
                    layoutId={`tab-${roleLabel}`}
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${palette.active}`}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  />
                )}
                <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-xl ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                  <Icon className="h-[17px] w-[17px]" />
                </span>
                <span className={`relative z-10 truncate text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                  {item.shortLabel || item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
}
