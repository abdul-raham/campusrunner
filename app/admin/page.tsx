'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowRight, Clock3, CreditCard, Package, ShieldCheck, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

interface Stats {
  totalStudents: number;
  totalRunners: number;
  pendingRunners: number;
  totalOrders: number;
  completedOrders: number;
  revenue: number;
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalStudents: 0, totalRunners: 0, pendingRunners: 0, totalOrders: 0, completedOrders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = res.ok ? await res.json() : {};
        setStats({
          totalStudents: data.totalStudents || 0,
          totalRunners: data.totalRunners || 0,
          pendingRunners: data.pendingRunners || 0,
          totalOrders: data.totalOrders || 0,
          completedOrders: data.completedOrders || 0,
          revenue: data.revenue || 0,
        });
        setLastUpdated(new Date());
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 25000);
    return () => clearInterval(interval);
  }, [profile?.role]);

  const cards = [
    { label: 'Revenue', value: `₦${stats.revenue.toLocaleString()}`, icon: CreditCard, tone: 'from-emerald-500 to-teal-600' },
    { label: 'Orders', value: stats.totalOrders.toString(), icon: Package, tone: 'from-sky-500 to-indigo-600' },
    { label: 'Pending runners', value: stats.pendingRunners.toString(), icon: Clock3, tone: 'from-amber-400 to-orange-500' },
    { label: 'Students', value: stats.totalStudents.toString(), icon: Users, tone: 'from-fuchsia-500 to-violet-600' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="glass-card overflow-hidden p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
              <Activity className="h-4 w-4" /> Admin command center
            </div>
            <h1 className="dashboard-title mt-4">Run the whole platform from one clean control surface.</h1>
            <p className="dashboard-subtitle max-w-2xl">See growth, review runner approvals, and stay ahead of order operations with a sharper dashboard experience.</p>
          </div>
          <div className="rounded-[24px] border border-white/60 bg-white/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-900/60">
            <p className="metric-label">Last updated</p>
            <p className="mt-1 font-semibold">{lastUpdated ? lastUpdated.toLocaleTimeString() : 'Loading...'}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="stat-card">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone} text-white shadow-lg shadow-slate-900/15`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="metric-label mt-4">{card.label}</p>
              <p className="metric-value mt-2">{loading ? '...' : card.value}</p>
            </motion.div>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="section-shell">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="metric-label">Operations</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight">Priority actions</h2>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { title: 'Review orders', copy: 'Assign runners and monitor task flow.', href: '/admin/orders' },
              { title: 'Approve runners', copy: 'Process pending accounts quickly.', href: '/admin/runners' },
              { title: 'Manage students', copy: 'Inspect profiles and activity.', href: '/admin/students' },
              { title: 'Track payouts', copy: 'Keep the money side visible.', href: '/admin/transactions' },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="rounded-[26px] border border-slate-200/80 bg-slate-50/70 p-5 hover:-translate-y-1 hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900">
                <h3 className="text-lg font-bold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.copy}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-300">Open <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        </div>

        <div className="section-shell">
          <p className="metric-label">Health snapshot</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight">Platform status</h2>
          <div className="mt-5 space-y-3">
            {[
              { label: 'Completed orders', value: stats.completedOrders, hint: 'Successfully delivered tasks', icon: ShieldCheck },
              { label: 'Active runners', value: stats.totalRunners - stats.pendingRunners, hint: 'Verified and ready to work', icon: Users },
              { label: 'Conversion view', value: stats.totalOrders ? `${Math.round((stats.completedOrders / stats.totalOrders) * 100)}%` : '0%', hint: 'Completed vs total orders', icon: Package },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-[24px] border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/55">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold tracking-tight">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.hint}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300"><Icon className="h-5 w-5" /></div>
                  </div>
                  <p className="mt-4 text-3xl font-black tracking-tight">{loading ? '...' : item.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
