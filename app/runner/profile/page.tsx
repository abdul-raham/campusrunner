'use client';

import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Star, Award, Edit } from 'lucide-react';

export default function RunnerProfilePage() {
  const { profile } = useAuth();

  const profileFields = [
    { label: 'Full Name', value: profile?.full_name, icon: User },
    { label: 'Email', value: profile?.email, icon: Mail },
    { label: 'Phone', value: profile?.phone, icon: Phone },
    { label: 'Location', value: profile?.hostel_location, icon: MapPin },
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
        className="mb-4 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-black text-[#0B0E11] sm:text-3xl md:text-4xl">Profile</h1>
          <p className="mt-1 text-xs text-[#6B7280] sm:text-sm">Manage your account information</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-2xl border-2 border-[#E9E4FF] bg-white px-4 py-2.5 text-xs font-bold text-[#6200EE] shadow-lg transition-all hover:bg-[#F4ECFF] cursor-pointer sm:px-5 sm:py-3 sm:text-sm"
        >
          <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Edit</span>
        </motion.button>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Profile Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="rounded-3xl border-2 border-[#E9E4FF] bg-gradient-to-br from-white to-[#F4ECFF] p-5 shadow-lg sm:p-6">
            <div className="mb-5 flex flex-col items-center sm:mb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#6200EE] to-[#03DAC5] text-3xl font-black text-white shadow-xl shadow-[#6200EE]/30 sm:mb-4 sm:h-24 sm:w-24 sm:text-4xl"
              >
                {profile?.full_name?.charAt(0) || 'R'}
              </motion.div>
              <h2 className="text-center text-lg font-black text-[#0B0E11] sm:text-xl">{profile?.full_name}</h2>
              <p className="text-xs text-[#6B7280] sm:text-sm">Runner</p>
            </div>

            {/* Stats */}
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-[#E9E4FF] bg-white p-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-[#6B7280] sm:text-sm">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 sm:h-4 sm:w-4" />
                  Rating
                </span>
                <span className="text-sm font-black text-[#0B0E11] sm:text-base">4.9</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#E9E4FF] bg-white p-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-[#6B7280] sm:text-sm">
                  <Award className="h-3.5 w-3.5 text-[#6200EE] sm:h-4 sm:w-4" />
                  Jobs Completed
                </span>
                <span className="text-sm font-black text-[#0B0E11] sm:text-base">45</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="rounded-3xl border-2 border-[#E9E4FF] bg-white p-5 shadow-lg sm:p-6">
            <h3 className="mb-4 text-lg font-black text-[#0B0E11] sm:mb-6 sm:text-xl">Personal Information</h3>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {profileFields.map((field, idx) => {
                const Icon = field.icon;
                return (
                  <motion.div
                    key={field.label}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="rounded-xl border border-[#E9E4FF] bg-gradient-to-br from-[#F4ECFF] to-white p-3.5 sm:p-4"
                  >
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#6B7280] sm:text-xs">
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {field.label}
                    </div>
                    <p className="text-sm font-bold text-[#0B0E11] sm:text-base">{field.value || 'Not provided'}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Account Status */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-3.5 sm:mt-6 sm:p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-sm text-white sm:h-10 sm:w-10">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-black text-green-900 sm:text-base">Account Verified</p>
                  <p className="text-xs text-green-700 sm:text-sm">Your account is active and verified</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
