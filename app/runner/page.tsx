'use client';

import { useState } from 'react';
import { Bell, MapPin, Clock, Star, Package, CreditCard, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RunnerDashboard() {
  const availableJobs = [
    { id: 1, service: 'Market Run', location: 'Hostel 5', payment: '₦800', time: '30 mins', distance: '0.5km', urgent: true },
    { id: 2, service: 'Gas Refill', location: 'Block A', payment: '₦500', time: '15 mins', distance: '0.3km' },
    { id: 3, service: 'Food Pickup', location: 'Cafeteria', payment: '₦600', time: '20 mins', distance: '0.8km' },
    { id: 4, service: 'Laundry Pickup', location: 'Hostel 3', payment: '₦1,200', time: '45 mins', distance: '1.2km' },
  ];

  const completedJobs = [
    { id: 1, service: 'Market Run', client: 'Sarah M.', payment: '₦800', rating: 5, time: '2 hours ago' },
    { id: 2, service: 'Gas Refill', client: 'John D.', payment: '₦500', rating: 4, time: '5 hours ago' },
    { id: 3, service: 'Food Pickup', client: 'Mike K.', payment: '₦700', rating: 5, time: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F7FB] via-white to-[#F0EBFF] pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#0B0E11] mb-2">Ready to earn? 🚀</h1>
          <p className="text-[#6B7280] text-lg">12 new jobs available in your area</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Earnings & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Earnings Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] p-8 text-white shadow-2xl shadow-[#6200EE]/30"
            >
              {/* Animated Background */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2">Total Earnings</p>
                    <h2 className="text-5xl font-black">₦25,000</h2>
                    <p className="text-white/80 text-sm mt-2">+₦2,500 this week</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 mb-4">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-bold">+12%</span>
                    </div>
                    <p className="text-white/70 text-sm">vs last week</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex-1 rounded-xl bg-white/20 py-3 text-sm font-bold backdrop-blur-sm transition hover:bg-white/30">
                    Withdraw
                  </button>
                  <button className="flex-1 rounded-xl bg-white py-3 text-sm font-bold text-[#6200EE] transition hover:bg-white/90">
                    View History
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Available Jobs', value: '12', icon: Package, color: 'from-blue-500 to-blue-600' },
                { label: 'Completed', value: '45', icon: CheckCircle2, color: 'from-green-500 to-green-600' },
                { label: 'Rating', value: '4.9', icon: Star, color: 'from-yellow-500 to-yellow-600' },
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

            {/* Available Jobs */}
            <div>
              <h3 className="text-xl font-black text-[#0B0E11] mb-4">Available Jobs</h3>
              <div className="grid grid-cols-2 gap-4">
                {availableJobs.map((job, idx) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/50 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all group"
                  >
                    {job.urgent && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        🔥 URGENT
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <h4 className="text-lg font-black text-[#0B0E11] mb-2">{job.service}</h4>
                      <div className="space-y-2 text-sm text-[#6B7280]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{job.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-[#6200EE]">{job.payment}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-[#6B7280]">{job.distance}</span>
                    </div>
                    
                    <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white font-bold py-3 rounded-xl group-hover:shadow-lg transition-all">
                      Accept
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Activity */}
          <div className="space-y-6">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/50 bg-white/50 backdrop-blur-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-black text-[#0B0E11] mb-4">Your Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">Status</span>
                  <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">Response Rate</span>
                  <span className="font-bold text-[#0B0E11]">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">Acceptance Rate</span>
                  <span className="font-bold text-[#0B0E11]">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">Cancellation Rate</span>
                  <span className="font-bold text-[#0B0E11]">2%</span>
                </div>
              </div>
              
              <button className="w-full mt-4 px-4 py-3 bg-[#6200EE] text-white font-bold rounded-xl hover:bg-[#4F2EE8] transition-all">
                Go Offline
              </button>
            </motion.div>

            {/* Completed Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/50 bg-white/50 backdrop-blur-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-[#0B0E11]">Recent Completed</h3>
                <button className="text-[#6200EE] font-bold text-sm hover:underline">View all</button>
              </div>
              <div className="space-y-3">
                {completedJobs.map((job) => (
                  <div key={job.id} className="rounded-xl border border-[#E9E4FF] bg-gradient-to-br from-white to-[#F4ECFF] p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-[#0B0E11]">{job.service}</p>
                        <p className="text-xs text-[#6B7280]">{job.client}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(job.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#6B7280]">{job.time}</p>
                      <p className="font-bold text-[#6200EE]">{job.payment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tier Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/50 bg-gradient-to-br from-[#6200EE]/10 to-[#03DAC5]/10 backdrop-blur-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-black text-[#0B0E11]">Your Tier</h3>
                <span className="text-2xl">🏆</span>
              </div>
              <p className="text-sm text-[#6B7280] mb-3">Campus Hero</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-[#6200EE] to-[#03DAC5] h-2 rounded-full" style={{ width: '75%' }} />
              </div>
              <p className="text-xs text-[#6B7280]">25 more jobs to reach Elite</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
