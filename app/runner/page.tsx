'use client';

import { useState } from 'react';
import { Bell, MapPin, Clock, Star, Package, CreditCard, TrendingUp, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RunnerDashboard() {
  const availableJobs = [
    { id: 1, service: 'Market Run', location: 'Hostel 5', payment: '₦800', time: '30 mins', distance: '0.5km', urgent: true },
    { id: 2, service: 'Gas Refill', location: 'Block A', payment: '₦500', time: '15 mins', distance: '0.3km' },
    { id: 3, service: 'Food Pickup', location: 'Cafeteria', payment: '₦600', time: '20 mins', distance: '0.8km' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-20">
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-40 border-b border-white/30 bg-white/70 backdrop-blur-xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-black text-[#0B0E11]">Runner Dashboard 🚀</h1>
              <p className="text-sm text-[#6B7280]">Ready to earn today?</p>
            </div>
            <button className="relative rounded-2xl border border-[#E9E4FF] bg-white p-2.5 shadow-sm">
              <Bell className="h-5 w-5 text-[#6200EE]" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
            </button>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-3 rounded-2xl border border-[#E9E4FF] bg-white p-2">
            <button className="flex-1 rounded-xl bg-[#E6FFF9] py-2.5 text-sm font-bold text-[#03A894]">
              🟢 Available
            </button>
            <button className="flex-1 rounded-xl py-2.5 text-sm font-bold text-[#6B7280]">
              Offline
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Earnings Card - Fintech Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] p-6 text-white shadow-xl shadow-[#6200EE]/20"
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/70 mb-1">Total Earnings</p>
                <h2 className="text-4xl font-black">₦25,000</h2>
                <p className="text-sm text-white/80 mt-1">+₦2,500 this week</p>
              </div>
              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                <TrendingUp className="h-6 w-6" />
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
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Available', value: '12', icon: Package, color: 'bg-blue-500' },
            { label: 'Completed', value: '45', icon: CheckCircle2, color: 'bg-green-500' },
            { label: 'Rating', value: '4.9', icon: Star, color: 'bg-yellow-500' },
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

        {/* Available Jobs */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black text-[#0B0E11]">Available Jobs</h3>
            <span className="rounded-full bg-[#E6FFF9] px-3 py-1 text-xs font-bold text-[#03A894]">
              {availableJobs.length} New
            </span>
          </div>
          
          <div className="space-y-3">
            {availableJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative overflow-hidden rounded-2xl border border-[#E9E4FF] bg-white p-5 shadow-sm"
              >
                {job.urgent && (
                  <div className="absolute right-3 top-3 rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-600">
                    🔥 URGENT
                  </div>
                )}
                
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-black text-[#0B0E11]">{job.service}</h4>
                    <div className="mt-2 flex items-center gap-3 text-sm text-[#6B7280]">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{job.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#6200EE]">{job.payment}</p>
                    <span className="text-xs text-[#6B7280]">{job.distance}</span>
                  </div>
                </div>
                
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6200EE] py-3 text-sm font-bold text-white transition hover:bg-[#4F2EE8]">
                  Accept Job
                  <ArrowRight className="h-4 w-4" />
                </button>
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
            <h3 className="text-sm font-black text-[#0B0E11]">This Week's Performance</h3>
            <span className="rounded-full bg-[#F4ECFF] px-3 py-1 text-xs font-bold text-[#6200EE]">
              🏆 Top 10%
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">Jobs Completed</span>
              <span className="text-sm font-bold text-[#0B0E11]">12 jobs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">Avg. Delivery Time</span>
              <span className="text-sm font-bold text-[#0B0E11]">18 mins</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">Customer Rating</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-[#0B0E11]">4.9</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 rounded-xl bg-[#E6FFF9] p-3 text-center">
            <p className="text-xs font-bold text-[#03A894]">
              🎉 You're earning 25% more than average runners!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}