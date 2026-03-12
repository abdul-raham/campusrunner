'use client';

import { runnerJobs } from '@/constants/mock-data';
import { motion } from 'framer-motion';
import { MapPin, Filter } from 'lucide-react';

export default function RunnerJobsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-3 py-4 md:px-8 md:py-8"
    >
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0B0E11] sm:text-3xl md:text-4xl">Job Feed</h1>
          <p className="mt-1 text-xs text-[#6B7280] sm:text-sm">{runnerJobs.length} jobs available near you</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-[#E9E4FF] bg-white px-5 py-3 text-sm font-bold text-[#6B7280] shadow-lg transition-all hover:border-[#6200EE] hover:text-[#6200EE] cursor-pointer"
        >
          <Filter className="h-4 w-4" />
          Filter Jobs
        </motion.button>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {runnerJobs.map((job, idx) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group relative overflow-hidden rounded-3xl border-2 border-[#E9E4FF] bg-white p-4 shadow-lg transition-all hover:border-[#6200EE] hover:shadow-xl hover:shadow-[#6200EE]/10 sm:p-6"
          >
            {job.urgent && (
              <div className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-2.5 py-1 text-[9px] font-black text-white shadow-lg sm:text-xs">
                🔥 URGENT
              </div>
            )}
            
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-black text-[#0B0E11] sm:mb-3 sm:text-xl">{job.service}</h3>
                <div className="space-y-1.5 text-xs text-[#6B7280] sm:space-y-2 sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-[#F4ECFF] p-2">
                      <MapPin className="h-3.5 w-3.5 text-[#6200EE] sm:h-4 sm:w-4" />
                    </div>
                    <span className="font-medium">
                      <span className="font-bold text-[#0B0E11]">{job.pickup}</span> → <span className="font-bold text-[#0B0E11]">{job.dropoff}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                <div className="flex-1 sm:text-right">
                  <p className="text-xs font-semibold text-[#6B7280]">Payment</p>
                  <p className="text-2xl font-black text-[#6200EE] sm:text-3xl">{job.amount}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl bg-gradient-to-r from-[#6200EE] to-[#4F2EE8] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#6200EE]/25 transition-all hover:shadow-xl hover:shadow-[#6200EE]/40 cursor-pointer sm:px-6 sm:py-3 sm:text-sm"
                >
                  Accept
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
