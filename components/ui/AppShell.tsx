'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, LogOut, LucideIcon, Menu, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BrandMark } from '@/components/ui/BrandMark';

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
    active: 'from-sky-600 via-blue-600 to-indigo-600',
    glow: 'shadow-blue-900/20',
    soft: 'bg-sky-500/10 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  },
  amber: {
    active: 'from-amber-500 via-orange-500 to-yellow-500',
    glow: 'shadow-orange-900/20',
    soft: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  },
  violet: {
    active: 'from-violet-600 via-fuchsia-600 to-indigo-600',
    glow: 'shadow-fuchsia-900/20',
    soft: 'bg-violet-500/10 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  },
};

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

  return (
    <div
      className="min-h-screen text-slate-900 dark:text-slate-50"
      style={{
        background:
          'radial-gradient(ellipse 70% 40% at 8% 0%, rgba(201,149,42,.12), transparent 60%), radial-gradient(ellipse 50% 60% at 90% 100%, rgba(13,31,45,.08), transparent 60%), #f2f4f7',
      }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-0 lg:px-4 lg:py-4">
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex lg:w-[290px] lg:flex-col"
        >
          <div className="m-4 flex h-[calc(100vh-2rem)] flex-col rounded-[28px] border border-white/50 bg-white/75 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 dark:shadow-black/20">
            <div className="mb-8">
              <Link href={pathname.startsWith('/admin') ? '/admin' : pathname.startsWith('/runner') ? '/runner' : '/student'} className="flex items-center gap-3">
                <div className="relative">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${palette.active} opacity-40 blur-xl`} />
                  <BrandMark className="relative h-12 w-12 rounded-2xl ring-1 ring-white/20 dark:ring-white/10" />
                </div>
                <div>
                  <p className="text-lg font-black tracking-tight">CampusRunner</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{roleLabel}</p>
                </div>
              </Link>
            </div>

            <div className="mb-6 rounded-[28px] border border-white/50 bg-white/70 p-4 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:shadow-black/20">
              <div className="mb-3 flex items-center justify-between">
                <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${palette.soft}`}>
                  {roleLabel}
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.8)]" />
                  Online
                </div>
              </div>
              <h2 className="line-clamp-1 text-lg font-bold tracking-tight">{profileName || 'Welcome back'}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{profileMeta || 'Ready to move faster today.'}</p>
            </div>

            <nav className="space-y-2">
              {nav.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.03 }}
                  >
                    <Link
                      href={item.href}
                      className={`group relative flex items-center justify-between overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${palette.active} text-white shadow-xl ${palette.glow}`
                          : 'text-slate-600 hover:bg-white/80 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white'
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isActive ? 'bg-white/15' : 'bg-slate-950/[0.04] dark:bg-white/[0.06]'}`}>
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        {item.label}
                      </span>
                      {!!item.badge && (
                        <span className={`relative z-10 min-w-6 rounded-full px-2 py-1 text-center text-[11px] font-bold ${isActive ? 'bg-white/15 text-white' : 'bg-slate-950/[0.06] text-slate-600 dark:bg-white/[0.08] dark:text-slate-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="mt-auto space-y-3 pt-8">
              <div className="rounded-[28px] border border-dashed border-slate-300/70 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Quick mode</p>
                <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">Optimized for mobile-first campus flow, with desktop polish too.</p>
              </div>
              <button
                onClick={onLogout}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </motion.aside>

        <div className="flex min-h-screen flex-1 flex-col lg:py-4">
          <header className="sticky top-0 z-40 mx-3 mt-3 flex items-center gap-3 rounded-[28px] border border-white/50 bg-white/70 px-4 py-3 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:shadow-black/20 lg:mx-0 lg:mt-0 lg:px-6">
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/70 text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{roleLabel}</p>
              <h1 className="truncate text-base font-bold tracking-tight sm:text-lg">{profileName || 'CampusRunner'}</h1>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Search orders, users, jobs..."
                  className="h-11 w-64 rounded-2xl border border-slate-200/80 bg-slate-50/80 pl-10 pr-4 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-sky-400 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white"
                />
              </div>
            </div>
            <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/70 text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
            </button>
            <ThemeToggle />
          </header>

          <main className="flex-1 px-3 pb-28 pt-4 sm:px-4 lg:px-6 lg:pb-6">
            {children}
          </main>
        </div>
      </div>

      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 lg:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-2 rounded-[28px] border border-white/50 bg-white/85 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/85 dark:shadow-black/30" style={{ ['--cols' as string]: String(nav.length) }}>
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="relative flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-2xl px-1 py-2.5">
                {isActive && (
                  <motion.div
                    layoutId={`mobile-tab-${roleLabel}`}
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${palette.active}`}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  />
                )}
                <span className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-2xl ${isActive ? 'bg-white/14 text-white' : 'bg-slate-950/[0.05] text-slate-500 dark:bg-white/[0.06] dark:text-slate-400'}`}>
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className={`relative z-10 truncate text-[10px] font-bold uppercase tracking-[0.14em] ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
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
