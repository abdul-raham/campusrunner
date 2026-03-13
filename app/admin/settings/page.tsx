'use client';

import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Percent,
  Bell,
  Save,
  Palette,
} from 'lucide-react';

export default function AdminSettingsPage() {
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black text-[#0B0E11]">App Settings</h1>
        </div>
        <p className="text-[#6B7280]">Configure your CampusRunner platform settings</p>
        
        <div className="flex items-center gap-3 mt-4">
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6200EE] to-[#4F2EE8] px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </motion.div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <SettingsIcon className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black text-[#0B0E11]">General</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#6B7280] mb-2">App Name</label>
              <input 
                type="text" 
                defaultValue="CampusRunner"
                className="w-full rounded-xl border border-[#E9E4FF] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200EE] focus:border-transparent" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#6B7280] mb-2">Support Email</label>
              <input 
                type="email" 
                defaultValue="support@campusrunner.app"
                className="w-full rounded-xl border border-[#E9E4FF] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200EE] focus:border-transparent" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#6B7280] mb-2">Default Currency</label>
              <select className="w-full rounded-xl border border-[#E9E4FF] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200EE] focus:border-transparent">
                <option value="NGN">Nigerian Naira (₦)</option>
                <option value="GHS">Ghanaian Cedi (₵)</option>
                <option value="KES">Kenyan Shilling (KSh)</option>
              </select>
            </div>
            
            <div className="flex items-center gap-3">
              <input 
                id="maintenance" 
                type="checkbox" 
                className="h-4 w-4 rounded border-[#E9E4FF] text-[#6200EE] focus:ring-[#6200EE]" 
              />
              <label htmlFor="maintenance" className="text-sm font-semibold text-[#0B0E11]">
                Enable maintenance mode
              </label>
            </div>
          </div>
        </motion.div>

        {/* Platform Fees */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <Percent className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black text-[#0B0E11]">Platform Fees</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#6B7280] mb-2">Commission Rate (%)</label>
              <input 
                type="number" 
                defaultValue="10"
                min="0"
                max="50"
                className="w-full rounded-xl border border-[#E9E4FF] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200EE] focus:border-transparent" 
              />
              <p className="text-xs text-[#6B7280] mt-1">Percentage taken from each completed order</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#6B7280] mb-2">Service Fee (₦)</label>
              <input 
                type="number" 
                defaultValue="100"
                min="0"
                className="w-full rounded-xl border border-[#E9E4FF] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200EE] focus:border-transparent" 
              />
              <p className="text-xs text-[#6B7280] mt-1">Fixed fee added to each order</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#6B7280] mb-2">Minimum Payout (₦)</label>
              <input 
                type="number" 
                defaultValue="5000"
                min="1000"
                className="w-full rounded-xl border border-[#E9E4FF] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200EE] focus:border-transparent" 
              />
              <p className="text-xs text-[#6B7280] mt-1">Minimum amount for runner withdrawals</p>
            </div>
          </div>
        </motion.div>

        {/* App Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Palette className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black text-[#0B0E11]">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#6B7280] mb-2">Primary Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  defaultValue="#6200EE"
                  className="h-12 w-20 rounded-xl border border-[#E9E4FF] cursor-pointer" 
                />
                <input 
                  type="text" 
                  defaultValue="#6200EE"
                  className="flex-1 rounded-xl border border-[#E9E4FF] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6200EE] focus:border-transparent" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#6B7280] mb-2">App Logo</label>
              <div className="border-2 border-dashed border-[#E9E4FF] rounded-xl p-6 text-center hover:border-[#6200EE] transition-colors cursor-pointer">
                <div className="text-[#6B7280]">
                  <p className="font-semibold">Click to upload logo</p>
                  <p className="text-sm">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <input 
                id="darkMode" 
                type="checkbox" 
                className="h-4 w-4 rounded border-[#E9E4FF] text-[#6200EE] focus:ring-[#6200EE]" 
              />
              <label htmlFor="darkMode" className="text-sm font-semibold text-[#0B0E11]">
                Enable dark mode (coming soon)
              </label>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <Bell className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black text-[#0B0E11]">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 'newOrders', label: 'New order notifications', desc: 'Get notified when students place orders', defaultChecked: true },
              { id: 'runnerApprovals', label: 'Runner verification requests', desc: 'Alerts for pending runner approvals', defaultChecked: true },
              { id: 'lowBalance', label: 'Low wallet balance alerts', desc: 'Notify when user wallets are low', defaultChecked: false },
              { id: 'weeklyReports', label: 'Weekly summary reports', desc: 'Automated weekly platform reports', defaultChecked: true },
            ].map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 rounded-xl border border-[#E9E4FF] hover:bg-[#F4ECFF] transition-colors">
                <input 
                  id={notification.id}
                  type="checkbox" 
                  defaultChecked={notification.defaultChecked}
                  className="h-4 w-4 rounded border-[#E9E4FF] text-[#6200EE] focus:ring-[#6200EE] mt-1" 
                />
                <div className="flex-1">
                  <label htmlFor={notification.id} className="block text-sm font-semibold text-[#0B0E11] cursor-pointer">
                    {notification.label}
                  </label>
                  <p className="text-xs text-[#6B7280] mt-1">{notification.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}