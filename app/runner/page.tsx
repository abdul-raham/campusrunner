'use client';

import { useState } from 'react';
import { ArrowRight, Star, TrendingUp, Zap, MapPin, Power } from 'lucide-react';
import { runnerJobs } from '@/constants/mock-data';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

export default function RunnerDashboard() {
  const { profile } = useAuth();
  const [available, setAvailable] = useState(true);

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

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-3 py-4 md:px-8 md:py-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-[#6B7280] sm:text-sm">Welcome back</p>
          <h1 className="text-2xl font-black text-[#0B0E11] sm:text-3xl md:text-4xl">
            {profile?.full_name?.split(' ')[0] || 'Runner'} 👋
          </h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAvailable(!available)}
          className={`flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold shadow-lg transition-all cursor-pointer ${
            available
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30'
              : 'border-2 border-[#E9E4FF] bg-white text-[#6B7280] shadow-gray-200'
          }`}
        >
          <Power className={`h-4 w-4 ${available ? 'animate-pulse' : ''}`} />
          <span>{available ? 'Available' : 'Offline'}</span>
          <div className={`h-2 w-2 rounded-full ${available ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <motion.section variants={itemVariants} className="mb-4 grid gap-3 sm:grid-cols-2">
        {/* Earnings Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="relative overflow-hidden rounded-3xl border-2 border-[#E9E4FF] bg-gradient-to-br from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] p-5 text-white shadow-2xl shadow-[#6200EE]/20 sm:p-6"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <div className="mb-1 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <p className="text-xs font-bold uppercase tracking-wider text-white/80">Total Earnings</p>
            </div>
            <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">₦25,000</h2>
            <p className="mt-1 text-xs text-white/80 sm:text-sm">+ ₦2,500 this week</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-center backdrop-blur sm:p-3">
                <p className="font-black text-sm sm:text-base">12</p>
                <p className="text-[10px] text-white/70 sm:text-xs">Jobs</p>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-center backdrop-blur sm:p-3">
                <p className="font-black text-sm sm:text-base">18m</p>
                <p className="text-[10px] text-white/70 sm:text-xs">Avg Time</p>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-center backdrop-blur sm:p-3">
                <p className="font-black text-sm sm:text-base">4.9</p>
                <p className="text-[10px] text-white/70 sm:text-xs">Rating</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="rounded-3xl border-2 border-[#E9E4FF] bg-white p-5 shadow-lg sm:p-6"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#6B7280] sm:text-sm">Performance</p>
              <h3 className="text-lg font-black text-[#0B0E11] sm:text-xl">This Week</h3>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-[#03DAC5]/10 to-[#03DAC5]/5 p-2.5 sm:p-3">
              <TrendingUp className="h-4 w-4 text-[#03DAC5] sm:h-5 sm:w-5" />
            </div>
          </div>
          <div className="space-y-2 text-xs sm:space-y-3 sm:text-sm">
            {[
              { label: 'Jobs completed', value: '12' },
              { label: 'Acceptance rate', value: '92%' },
              { label: 'Rating', value: '4.9', icon: Star },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-center justify-between rounded-xl border border-[#E9E4FF] bg-gradient-to-r from-[#F4ECFF] to-white p-2.5 sm:p-3"
              >
                <span className="font-medium text-[#6B7280]">{stat.label}</span>
                <span className="flex items-center gap-1 font-black text-[#0B0E11]">
                  {stat.icon && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 sm:h-4 sm:w-4" />}
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Available Jobs */}
      <motion.section variants={itemVariants}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black text-[#0B0E11] sm:text-xl md:text-2xl">Available Jobs</h2>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
            {runnerJobs.length} Open
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {runnerJobs.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl border-2 border-[#E9E4FF] bg-white p-4 shadow-lg transition-all hover:border-[#6200EE] hover:shadow-xl hover:shadow-[#6200EE]/10 sm:p-5"
            >
              {job.urgent && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-2.5 py-1 text-[9px] font-black text-white shadow-lg sm:text-[10px]"
                >
                  🔥 URGENT
                </motion.div>
              )}
              <div className="mb-3">
                <h3 className="mb-2 text-base font-black text-[#0B0E11] sm:text-lg">{job.service}</h3>
                <div className="space-y-1.5 text-xs text-[#6B7280] sm:text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#6200EE] sm:h-4 sm:w-4" />
                    <span className="line-clamp-1">{job.pickup} → {job.dropoff}</span>
                  </div>
                </div>
              </div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xl font-black text-[#6200EE] sm:text-2xl">{job.amount}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6200EE] to-[#4F2EE8] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#6200EE]/25 transition-all hover:shadow-xl hover:shadow-[#6200EE]/40 cursor-pointer sm:py-3 sm:text-sm"
              >
                Accept Job
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}