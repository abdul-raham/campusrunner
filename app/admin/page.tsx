'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/supabase/client';
import { Users, Package, CheckCircle, DollarSign, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { PageLoader } from '@/components/PageLoader';

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
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalRunners: 0,
    pendingRunners: 0,
    totalOrders: 0,
    completedOrders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: students } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'student');

      const { data: runners } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'runner');

      const { data: pendingRunners } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'runner')
        .eq('verification_status', 'pending');

      const { data: orders } = await supabase
        .from('orders')
        .select('id, status, platform_fee');

      const completedOrders = orders?.filter(o => o.status === 'completed') || [];
      const revenue = completedOrders.reduce((sum, order) => sum + (order.platform_fee || 0), 0);

      setStats({
        totalStudents: students?.length || 0,
        totalRunners: runners?.length || 0,
        pendingRunners: pendingRunners?.length || 0,
        totalOrders: orders?.length || 0,
        completedOrders: completedOrders.length,
        revenue
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'bg-blue-50 text-blue-600', iconBg: 'bg-blue-100' },
    { label: 'Total Runners', value: stats.totalRunners, icon: Users, color: 'bg-purple-50 text-purple-600', iconBg: 'bg-purple-100' },
    { label: 'Pending Approvals', value: stats.pendingRunners, icon: Clock, color: 'bg-amber-50 text-amber-600', iconBg: 'bg-amber-100', link: '/admin/runners' },
    { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'bg-green-50 text-green-600', iconBg: 'bg-green-100', link: '/admin/orders' },
    { label: 'Completed Orders', value: stats.completedOrders, icon: CheckCircle, color: 'bg-teal-50 text-teal-600', iconBg: 'bg-teal-100' },
    { label: 'Platform Revenue', value: `₦${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-50 text-emerald-600', iconBg: 'bg-emerald-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">System overview and monitoring</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            const content = (
              <div className={`bg-white rounded-xl p-4 border ${stat.link ? 'active:scale-95 transition-transform' : ''}`}>
                <div className={`w-10 h-10 rounded-full ${stat.iconBg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.color.split(' ')[1]}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            );

            return stat.link ? (
              <Link key={idx} href={stat.link}>
                {content}
              </Link>
            ) : (
              <div key={idx}>{content}</div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/runners"
              className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100 active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Runner Approvals</p>
                  <p className="text-xs text-gray-500">{stats.pendingRunners} pending</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100 active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Manage Orders</p>
                  <p className="text-xs text-gray-500">{stats.totalOrders} total orders</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-[#6200EE] to-[#03DAC5] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Platform Revenue</span>
          </div>
          <div className="text-4xl font-bold mb-1">₦{stats.revenue.toLocaleString()}</div>
          <div className="text-sm opacity-80">From {stats.completedOrders} completed orders</div>
        </div>
      </div>
    </div>
  );
}
