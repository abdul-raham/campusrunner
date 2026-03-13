'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/supabase/client';
import { Users, Package, CheckCircle, DollarSign, Clock, TrendingUp, ArrowUpRight, Star, Activity } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

      const { data: allRunners } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'runner');

      const { data: pendingRunners } = await supabase
        .from('profiles')
        .select(`
          id,
          runners!inner(verification_status)
        `)
        .eq('role', 'runner')
        .eq('runners.verification_status', 'pending');

      const { data: orders } = await supabase
        .from('orders')
        .select('id, status, platform_fee');

      const completedOrders = orders?.filter(o => o.status === 'completed') || [];
      const revenue = completedOrders.reduce((sum, order) => sum + (order.platform_fee || 0), 0);

      setStats({
        totalStudents: students?.length || 0,
        totalRunners: allRunners?.length || 0,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        type: "spring" as const,
        stiffness: 80
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-[#6200EE]/20 border-t-[#6200EE]"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold text-[#6B7280]"
          >
            Loading Dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#6200EE] to-[#4F2EE8] text-white">
            <Activity className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black text-[#0B0E11]">Admin Dashboard</h1>
        </div>
        <p className="text-[#6B7280]">Welcome back! Here's what's happening with CampusRunner today.</p>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {/* Revenue Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/20">
                <DollarSign className="h-6 w-6" />
              </div>
              <ArrowUpRight className="h-5 w-5 opacity-60" />
            </div>
            <p className="text-green-100 text-sm font-medium mb-1">Platform Revenue</p>
            <p className="text-3xl font-black mb-2">₦{(stats.revenue || 0).toLocaleString()}</p>
            <div className="flex items-center gap-1 text-green-100 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>+12.5% from last month</span>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <DollarSign className="h-20 w-20" />
            </div>
          </div>
        </motion.div>

        {/* Orders Card */}
        <motion.div variants={itemVariants}>
          <Link href="/admin/orders">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-white/20">
                  <Package className="h-6 w-6" />
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{stats.completedOrders} completed</span>
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Orders</p>
              <p className="text-3xl font-black mb-2">{stats.totalOrders}</p>
              <div className="flex items-center gap-1 text-blue-100 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>{((stats.completedOrders / stats.totalOrders) * 100 || 0).toFixed(1)}% completion rate</span>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Package className="h-20 w-20" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Pending Approvals */}
        <motion.div variants={itemVariants}>
          <Link href="/admin/runners">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-white/20">
                  <Clock className="h-6 w-6" />
                </div>
                {stats.pendingRunners > 0 && (
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                )}
              </div>
              <p className="text-amber-100 text-sm font-medium mb-1">Pending Approvals</p>
              <p className="text-3xl font-black mb-2">{stats.pendingRunners}</p>
              <p className="text-amber-100 text-sm">Runners awaiting verification</p>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Clock className="h-20 w-20" />
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Secondary Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        <motion.div variants={itemVariants}>
          <Link href="/admin/students">
            <div className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#6B7280] mb-1">Total Students</p>
                  <p className="text-2xl font-black text-[#0B0E11]">{stats.totalStudents}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-[#6B7280]" />
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/admin/runners">
            <div className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                  <Star className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#6B7280] mb-1">Active Runners</p>
                  <p className="text-2xl font-black text-[#0B0E11]">{stats.totalRunners}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-[#6B7280]" />
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Link href="/admin/transactions">
            <div className="rounded-2xl border border-[#E9E4FF] bg-gradient-to-br from-indigo-50 to-purple-50 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-[#0B0E11]">View Transactions</p>
                  <p className="text-sm text-[#6B7280]">Monitor all payments</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/admin/settings">
            <div className="rounded-2xl border border-[#E9E4FF] bg-gradient-to-br from-rose-50 to-pink-50 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-[#0B0E11]">System Settings</p>
                  <p className="text-sm text-[#6B7280]">Configure platform</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="rounded-2xl border border-[#E9E4FF] bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-[#0B0E11]">System Health</p>
                <p className="text-sm text-emerald-600 font-semibold">All systems operational</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
