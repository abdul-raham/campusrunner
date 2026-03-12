'use client';

import { useState } from 'react';
import { Bell, Search, Plus, MapPin, Clock, Star, Package, CreditCard, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const quickActions = [
    { icon: Package, label: 'Market Run', color: 'bg-blue-500', emoji: '🛒' },
    { icon: CreditCard, label: 'Gas Refill', color: 'bg-green-500', emoji: '⛽' },
    { icon: Package, label: 'Food Pickup', color: 'bg-orange-500', emoji: '🍔' },
    { icon: Package, label: 'Laundry', color: 'bg-purple-500', emoji: '👕' },
  ];

  const recentOrders = [
    { id: 1, service: 'Market Run', runner: 'John D.', status: 'In Progress', time: '15 mins ago', amount: '₦2,500' },
    { id: 2, service: 'Gas Refill', runner: 'Sarah M.', status: 'Completed', time: '2 hours ago', amount: '₦1,500' },
    { id: 3, service: 'Food Pickup', runner: 'Mike K.', status: 'Delivered', time: '1 day ago', amount: '₦3,200' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-20">
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-40 border-b border-white/30 bg-white/70 backdrop-blur-xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-black text-[#0B0E11]">Good morning! 👋</h1>
              <p className="text-sm text-[#6B7280]">What do you need today?</p>
            </div>
            <button className="relative rounded-2xl border border-[#E9E4FF] bg-white p-2.5 shadow-sm">
              <Bell className="h-5 w-5 text-[#6200EE]" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-4 h-4" />
            <input
              type="text"
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E9E4FF] bg-white/80 text-[#0B0E11] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#6200EE] focus:border-transparent backdrop-blur transition"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Wallet Card - Fintech Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] p-6 text-white shadow-xl shadow-[#6200EE]/20"
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/70 mb-1">Wallet Balance</p>
                <h2 className="text-4xl font-black">₦4,500</h2>
              </div>
              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex-1 rounded-xl bg-white/20 py-3 text-sm font-bold backdrop-blur-sm transition hover:bg-white/30">
                Add Funds
              </button>
              <button className="flex-1 rounded-xl bg-white py-3 text-sm font-bold text-[#6200EE] transition hover:bg-white/90">
                Withdraw
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Active', value: '2', icon: Package, color: 'bg-blue-500' },
            { label: 'Completed', value: '28', icon: CheckCircle2, color: 'bg-green-500' },
            { label: 'Rating', value: '4.8', icon: Star, color: 'bg-yellow-500' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-[#E9E4FF] bg-white p-4 shadow-sm"
            >
              <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl ${stat.color} text-white`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-black text-[#0B0E11]">{stat.value}</p>
              <p className="text-xs text-[#6B7280]">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black text-[#0B0E11]">Quick Actions</h3>
            <span className="rounded-full bg-[#F4ECFF] px-3 py-1 text-xs font-bold text-[#6200EE]">
              Popular
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-[#E9E4FF] bg-white p-4 shadow-sm transition hover:border-[#6200EE] hover:shadow-md"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6200EE]/5 to-[#03DAC5]/5 opacity-0 group-hover:opacity-100 transition" />
                  
                  <div className="relative">
                    <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform`}>
                      <span className="text-lg">{action.emoji}</span>
                    </div>
                    <p className="text-sm font-bold text-[#0B0E11] text-left group-hover:text-[#6200EE] transition">{action.label}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
          
          <button className="w-full mt-4 flex items-center justify-center gap-2 p-4 bg-[#6200EE] text-white rounded-2xl hover:bg-[#4F2EE8] transition font-bold shadow-lg shadow-[#6200EE]/20">
            <Plus className="w-4 h-4" />
            Create Custom Request
          </button>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black text-[#0B0E11]">Recent Orders</h3>
            <button className="text-[#6200EE] font-bold hover:underline text-sm">View all</button>
          </div>
          
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative overflow-hidden rounded-2xl border border-[#E9E4FF] bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#6200EE]/10 to-[#03DAC5]/10 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-[#6200EE]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0B0E11]">{order.service}</p>
                      <p className="text-xs text-[#6B7280]">Runner: {order.runner}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#0B0E11]">{order.amount}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold mt-1 ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Performance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#E9E4FF] bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-black text-[#0B0E11]">Your Stats</h3>
            <span className="rounded-full bg-[#E6FFF9] px-3 py-1 text-xs font-bold text-[#03A894]">
              📈 Trending up
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">Total Spent</span>
              <span className="text-sm font-bold text-[#0B0E11]">₦8,500</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">Avg. Delivery Time</span>
              <span className="text-sm font-bold text-[#0B0E11]">22 mins</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">Runner Rating</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-[#0B0E11]">4.8</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 rounded-xl bg-[#F4ECFF] p-3 text-center">
            <p className="text-xs font-bold text-[#6200EE]">
              ⭐ You're a valued customer! Enjoy 10% off your next order
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}