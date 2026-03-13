'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { DollarSign, TrendingUp, TrendingDown, Filter, Search, Calendar, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Transaction {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  order_id: string;
  student_id: string;
  runner_id: string;
  order: {
    title: string;
    service_categories: {
      name: string;
    } | null;
  } | null;
  student_profile: {
    full_name: string;
  } | null;
  runner_profile: {
    full_name: string;
  } | null;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [statusFilter, searchTerm, transactions]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          status,
          created_at,
          order_id,
          student_id,
          runner_id
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match interface
      const transformedData = (data || []).map(transaction => ({
        ...transaction,
        order: {
          title: 'Order #' + transaction.order_id?.slice(-6),
          service_categories: {
            name: 'General Service'
          }
        },
        student_profile: {
          full_name: 'Student User'
        },
        runner_profile: {
          full_name: 'Runner User'
        }
      }));
      
      setTransactions(transformedData);
      calculateStats(transformedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Transaction[]) => {
    const completed = data.filter(t => t.status === 'completed');
    const pending = data.filter(t => t.status === 'pending');
    const totalRevenue = completed.reduce((sum, t) => sum + t.amount, 0);

    // Calculate monthly growth (mock calculation)
    const thisMonth = new Date();
    const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1, 1);
    
    const thisMonthRevenue = completed
      .filter(t => new Date(t.created_at) >= lastMonth)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyGrowth = 12.5; // Mock growth percentage

    setStats({
      totalRevenue,
      completedTransactions: completed.length,
      pendingTransactions: pending.length,
      monthlyGrowth
    });
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.student_profile?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.runner_profile?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.order?.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'pending': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'failed': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
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
            Loading Transactions...
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <DollarSign className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black text-[#0B0E11]">Transaction Management</h1>
        </div>
        <p className="text-[#6B7280]">Monitor all financial transactions and revenue</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={itemVariants} className="relative overflow-hidden">
          <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/20">
                <DollarSign className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-5 w-5 opacity-60" />
            </div>
            <p className="text-green-100 text-sm font-medium mb-1">Total Revenue</p>
            <p className="text-2xl font-black">₦{stats.totalRevenue.toLocaleString()}</p>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <DollarSign className="h-20 w-20" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative overflow-hidden">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/20">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">+{stats.monthlyGrowth}%</span>
            </div>
            <p className="text-blue-100 text-sm font-medium mb-1">Completed</p>
            <p className="text-2xl font-black">{stats.completedTransactions}</p>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <TrendingUp className="h-20 w-20" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative overflow-hidden">
          <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/20">
                <Calendar className="h-5 w-5" />
              </div>
              <ArrowDownLeft className="h-5 w-5 opacity-60" />
            </div>
            <p className="text-amber-100 text-sm font-medium mb-1">Pending</p>
            <p className="text-2xl font-black">{stats.pendingTransactions}</p>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Calendar className="h-20 w-20" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative overflow-hidden">
          <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/20">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Growth</span>
            </div>
            <p className="text-purple-100 text-sm font-medium mb-1">Monthly Growth</p>
            <p className="text-2xl font-black">+{stats.monthlyGrowth}%</p>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <TrendingUp className="h-20 w-20" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mb-6"
      >
        <div className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#E9E4FF] rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6200EE] focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'completed', 'pending', 'failed'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-gradient-to-r from-[#6200EE] to-[#4F2EE8] text-white shadow-lg'
                      : 'bg-white/50 border border-[#E9E4FF] text-[#6B7280] hover:bg-[#F4ECFF]'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-[#6B7280] text-lg">No transactions found</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E9E4FF]">
              <AnimatePresence>
                {filteredTransactions.map((transaction, idx) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.08, duration: 0.6 }}
                    className="p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          transaction.status === 'completed' 
                            ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                            : transaction.status === 'pending'
                            ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                            : 'bg-gradient-to-br from-red-500 to-pink-500'
                        } text-white`}>
                          <DollarSign className="h-5 w-5" />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-[#0B0E11] mb-1">
                            {transaction.order?.title || 'Order Transaction'}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                            <span>👤 {transaction.student_profile?.full_name}</span>
                            {transaction.runner_profile && (
                              <span>🏃 {transaction.runner_profile.full_name}</span>
                            )}
                            <span>📦 {transaction.order?.service_categories?.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-black text-[#0B0E11]">
                            ₦{transaction.amount.toLocaleString()}
                          </span>
                          <span className={`px-3 py-1 rounded-lg border font-semibold text-sm ${getStatusColor(transaction.status)}`}>
                            {transaction.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-[#6B7280]">
                          {new Date(transaction.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}