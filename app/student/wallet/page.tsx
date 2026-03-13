'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/supabase/client';
import { 
  CreditCard, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye, 
  EyeOff,
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter
} from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  created_at: string;
  order_id?: string;
}

export default function StudentWalletPage() {
  const { profile } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(5000); // Mock balance
  const [totalSpent, setTotalSpent] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch completed orders as transactions
      const { data: orders } = await supabase
        .from('orders')
        .select('id, title, final_amount, created_at, status')
        .eq('student_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (orders) {
        const mockTransactions: Transaction[] = [
          // Add some mock credit transactions
          {
            id: 'credit-1',
            amount: 5000,
            type: 'credit',
            description: 'Initial wallet funding',
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          // Convert orders to debit transactions
          ...orders.map(order => ({
            id: order.id,
            amount: order.final_amount || 0,
            type: 'debit' as const,
            description: `Payment for ${order.title}`,
            created_at: order.created_at,
            order_id: order.id
          }))
        ];

        setTransactions(mockTransactions);
        
        const spent = orders.reduce((sum, order) => sum + (order.final_amount || 0), 0);
        setTotalSpent(spent);
        setBalance(5000 - spent);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const thisMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.created_at);
    const now = new Date();
    return transactionDate.getMonth() === now.getMonth() && 
           transactionDate.getFullYear() === now.getFullYear();
  });

  const thisMonthSpent = thisMonthTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen px-3 py-4 md:px-8 md:py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded-3xl"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-3 py-4 md:px-8 md:py-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-black text-[#0B0E11] sm:text-4xl mb-2">My Wallet</h1>
        <p className="text-[#6B7280]">Manage your balance and view transaction history</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Wallet Card */}
        <div className="lg:col-span-2">
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] p-6 sm:p-8 text-white shadow-2xl shadow-[#6200EE]/30"
          >
            {/* Animated Background Elements */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2">Available Balance</p>
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-4xl sm:text-5xl font-black">
                      {showBalance ? `₦${balance.toLocaleString()}` : '••••••'}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                    >
                      {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm mb-2">This Month</p>
                  <p className="text-2xl font-bold">₦{thisMonthSpent.toLocaleString()}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm font-bold"
                >
                  <Plus className="w-4 h-4" />
                  Add Money
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm font-bold"
                >
                  <CreditCard className="w-4 h-4" />
                  Cards
                </motion.button>
              </div>

              {/* Card Details */}
              <div className="flex items-end justify-between mt-8">
                <div>
                  <p className="text-white/70 text-xs mb-1">CARDHOLDER</p>
                  <p className="text-lg font-semibold">{profile?.full_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-xs mb-1">VALID THRU</p>
                  <p className="text-lg font-semibold">12/26</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-red-100">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Total Spent</p>
                <p className="text-2xl font-black text-[#0B0E11]">₦{totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-blue-100">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">This Month</p>
                <p className="text-2xl font-black text-[#0B0E11]">₦{thisMonthSpent.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-green-100">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Transactions</p>
                <p className="text-2xl font-black text-[#0B0E11]">{transactions.length}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Transaction History */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-[#0B0E11]">Transaction History</h3>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#6B7280]" />
            <select className="px-3 py-2 rounded-lg border border-[#E9E4FF] bg-white/50 text-sm font-medium focus:border-[#6200EE] focus:outline-none">
              <option>All Transactions</option>
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {transactions.length > 0 ? (
            transactions.map((transaction, idx) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-white to-[#F4ECFF] border border-[#E9E4FF] hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    transaction.type === 'debit' ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {transaction.type === 'debit' ? (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#0B0E11]">{transaction.description}</p>
                    <p className="text-sm text-[#6B7280]">
                      {new Date(transaction.created_at).toLocaleDateString()} at{' '}
                      {new Date(transaction.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black ${
                    transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'debit' ? '-' : '+'}₦{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#6B7280] capitalize">{transaction.type}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-lg font-black text-[#0B0E11] mb-2">No transactions yet</h3>
              <p className="text-[#6B7280]">Your transaction history will appear here</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}