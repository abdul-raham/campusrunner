'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Calendar, Download, ArrowUpRight, ArrowDownRight, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function RunnerEarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const earningsData = [
    { period: 'Today', amount: '2,500', color: 'from-blue-500 to-blue-600', icon: Clock, change: '+12%' },
    { period: 'This Week', amount: '8,600', color: 'from-purple-500 to-purple-600', icon: Calendar, change: '+8%' },
    { period: 'This Month', amount: '25,000', color: 'from-pink-500 to-pink-600', icon: TrendingUp, change: '+18%' },
  ];

  const recentTransactions = [
    { id: 1, service: 'Market Run', amount: '800', time: '2 hours ago', status: 'completed', customer: 'Sarah M.' },
    { id: 2, service: 'Gas Refill', amount: '500', time: '5 hours ago', status: 'completed', customer: 'John D.' },
    { id: 3, service: 'Food Pickup', amount: '700', time: '1 day ago', status: 'completed', customer: 'Mike K.' },
    { id: 4, service: 'Laundry Pickup', amount: '1,200', time: '1 day ago', status: 'completed', customer: 'Emma L.' },
    { id: 5, service: 'Printing', amount: '300', time: '2 days ago', status: 'completed', customer: 'David P.' },
  ];

  const stats = [
    { label: 'Total Jobs', value: '45', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Avg. Earning', value: '₦556', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'This Week', value: '12', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-3 py-4 md:px-8 md:py-8"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-4"
      >
        <h1 className="text-2xl font-black text-[#0B0E11] sm:text-3xl md:text-4xl">Earnings 💰</h1>
        <p className="mt-1 text-xs text-[#6B7280] sm:text-sm">Track your income and performance</p>
      </motion.div>

      {/* Main Balance Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative mb-4 overflow-hidden rounded-3xl border-2 border-[#E9E4FF] bg-gradient-to-br from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] p-5 text-white shadow-2xl shadow-[#6200EE]/30 sm:p-6 md:p-8"
      >
        {/* Animated Background Blobs */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-white/20 p-2 backdrop-blur">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/90">Available Balance</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
              <ArrowUpRight className="h-3 w-3" />
              +18%
            </div>
          </div>
          
          <h2 className="mb-1 text-4xl font-black sm:text-5xl md:text-6xl">₦12,300</h2>
          <p className="mb-4 text-xs text-white/80 sm:mb-6 sm:text-sm">From 45 completed jobs</p>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#6200EE] shadow-lg transition-all hover:shadow-xl cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Withdraw
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/20 px-5 py-3 text-sm font-bold backdrop-blur-sm transition-all hover:bg-white/30 cursor-pointer"
            >
              <TrendingUp className="h-4 w-4" />
              View Report
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4 grid grid-cols-3 gap-2 sm:gap-3"
      >
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border-2 border-[#E9E4FF] bg-white p-3 shadow-lg sm:p-4"
            >
              <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg} sm:h-10 sm:w-10`}>
                <Icon className={`h-4 w-4 ${stat.color} sm:h-5 sm:w-5`} />
              </div>
              <p className="text-lg font-black text-[#0B0E11] sm:text-2xl">{stat.value}</p>
              <p className="text-[10px] font-semibold text-[#6B7280] sm:text-xs">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Earnings Breakdown */}
      <div className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-black text-[#0B0E11] sm:text-xl">Earnings Breakdown</h3>
          <div className="flex gap-1 rounded-xl border border-[#E9E4FF] bg-white p-1">
            {['day', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer sm:px-3 sm:text-xs ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-[#6200EE] to-[#4F2EE8] text-white shadow-md'
                    : 'text-[#6B7280] hover:bg-[#F4ECFF]'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {earningsData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.period}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border-2 border-[#E9E4FF] bg-white p-3.5 shadow-lg transition-all hover:shadow-xl sm:rounded-3xl sm:p-5"
              >
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-bold text-green-600 sm:text-[10px]">
                  <ArrowUpRight className="h-2.5 w-2.5" />
                  {item.change}
                </div>
                
                <div className={`mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg sm:mb-3 sm:h-11 sm:w-11`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <p className="mb-0.5 text-[10px] font-semibold text-[#6B7280] sm:mb-1 sm:text-xs">{item.period}</p>
                <p className="text-xl font-black text-[#0B0E11] sm:text-2xl">₦{item.amount}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="rounded-3xl border-2 border-[#E9E4FF] bg-white p-4 shadow-lg sm:p-6"
      >
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <h3 className="text-lg font-black text-[#0B0E11] sm:text-xl">Recent Transactions</h3>
          <button className="text-xs font-bold text-[#6200EE] hover:underline cursor-pointer sm:text-sm">View All</button>
        </div>
        
        <div className="space-y-2 sm:space-y-2.5">
          {recentTransactions.map((transaction, idx) => (
            <motion.div
              key={transaction.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 + idx * 0.05 }}
              whileHover={{ x: 5 }}
              className="group flex items-center justify-between rounded-2xl border border-[#E9E4FF] bg-gradient-to-r from-[#F4ECFF] to-white p-3 transition-all hover:shadow-md cursor-pointer sm:p-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6200EE]/10 to-[#03DAC5]/10">
                  <CheckCircle2 className="h-5 w-5 text-[#6200EE]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0B0E11] sm:text-base">{transaction.service}</p>
                  <p className="text-[10px] text-[#6B7280] sm:text-xs">{transaction.customer} • {transaction.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-[#6200EE] sm:text-lg">₦{transaction.amount}</p>
                <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-bold text-green-600 sm:text-[10px]">
                  Paid
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
