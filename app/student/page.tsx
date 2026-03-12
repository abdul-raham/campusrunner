'use client';

import { useState } from 'react';
import { Bell, Search, Plus, TrendingUp, ArrowUpRight, ArrowDownLeft, Eye, EyeOff, Send, Package, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const [showBalance, setShowBalance] = useState(true);

  const quickActions = [
    { label: 'Market Run', emoji: '🛒', color: 'from-blue-500 to-blue-600' },
    { label: 'Gas Refill', emoji: '⛽', color: 'from-green-500 to-green-600' },
    { label: 'Food Pickup', emoji: '🍔', color: 'from-orange-500 to-orange-600' },
    { label: 'Laundry', emoji: '👕', color: 'from-purple-500 to-purple-600' },
  ];

  const recentOrders = [
    { id: 1, service: 'Market Run', runner: 'John D.', status: 'In Progress', amount: '₦2,500', time: '15 mins ago' },
    { id: 2, service: 'Gas Refill', runner: 'Sarah M.', status: 'Completed', amount: '₦1,500', time: '2 hours ago' },
    { id: 3, service: 'Food Pickup', runner: 'Mike K.', status: 'Delivered', amount: '₦3,200', time: '1 day ago' },
  ];

  const transactions = [
    { type: 'sent', label: 'Market Run', runner: 'John D.', amount: '-₦2,500', time: '15 mins ago' },
    { type: 'received', label: 'Refund', runner: 'System', amount: '+₦500', time: '2 hours ago' },
    { type: 'sent', label: 'Gas Refill', runner: 'Sarah M.', amount: '-₦1,500', time: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F7FB] via-white to-[#F0EBFF] pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#0B0E11] mb-2">Welcome back! 👋</h1>
          <p className="text-[#6B7280] text-lg">Here's what's happening with your orders today</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Wallet & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] p-8 text-white shadow-2xl shadow-[#6200EE]/30"
            >
              {/* Animated Background Elements */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2">Wallet Balance</p>
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-5xl font-black">
                        {showBalance ? '₦4,500' : '••••••'}
                      </h2>
                      <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                      >
                        {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-sm mb-2">Card Number</p>
                    <p className="text-2xl font-mono font-bold">•••• •••• •••• 4500</p>
                  </div>
                </div>

                {/* Card Details */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/70 text-xs mb-1">CARDHOLDER</p>
                    <p className="text-lg font-semibold">Abdul Rahman</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs mb-1">VALID THRU</p>
                    <p className="text-lg font-semibold">12/26</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Active Orders', value: '2', icon: Package, color: 'from-blue-500 to-blue-600' },
                { label: 'Completed', value: '28', icon: CheckCircle2, color: 'from-green-500 to-green-600' },
                { label: 'Avg Rating', value: '4.8', icon: Star, color: 'from-yellow-500 to-yellow-600' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="rounded-2xl border border-white/20 bg-white/50 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white mb-3`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-3xl font-black text-[#0B0E11] mb-1">{stat.value}</p>
                    <p className="text-sm text-[#6B7280]">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-xl font-black text-[#0B0E11] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-4 gap-4">
                {quickActions.map((action, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg hover:shadow-xl transition-all border border-white/50 hover:border-[#6200EE]/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6200EE]/5 to-[#03DAC5]/5 opacity-0 group-hover:opacity-100 transition" />
                    <div className="relative z-10 text-center">
                      <div className="text-4xl mb-3">{action.emoji}</div>
                      <p className="font-bold text-[#0B0E11] group-hover:text-[#6200EE] transition">{action.label}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-6">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/50 bg-white/50 backdrop-blur-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-[#0B0E11]">Recent Orders</h3>
                <button className="text-[#6200EE] font-bold text-sm hover:underline">View all</button>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-[#E9E4FF] bg-gradient-to-br from-white to-[#F4ECFF] p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-[#0B0E11]">{order.service}</p>
                        <p className="text-xs text-[#6B7280]">{order.runner}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#6B7280]">{order.time}</p>
                      <p className="font-bold text-[#6200EE]">{order.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Transaction History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/50 bg-white/50 backdrop-blur-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-black text-[#0B0E11] mb-4">Transactions</h3>
              <div className="space-y-3">
                {transactions.map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        tx.type === 'sent' ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        {tx.type === 'sent' ? (
                          <ArrowUpRight className={`w-4 h-4 ${
                            tx.type === 'sent' ? 'text-red-600' : 'text-green-600'
                          }`} />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0B0E11]">{tx.label}</p>
                        <p className="text-xs text-[#6B7280]">{tx.time}</p>
                      </div>
                    </div>
                    <p className={`font-bold ${
                      tx.type === 'sent' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {tx.amount}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section - Promotional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/50 bg-gradient-to-r from-[#6200EE]/10 via-[#03DAC5]/10 to-[#6200EE]/10 backdrop-blur-xl p-8 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-[#0B0E11] mb-2">⭐ You're a VIP Member!</h3>
              <p className="text-[#6B7280] mb-4">Enjoy 10% off on your next 5 orders</p>
              <button className="px-6 py-3 bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white font-bold rounded-xl hover:shadow-lg transition-all">
                Claim Reward
              </button>
            </div>
            <div className="text-6xl">🎉</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}