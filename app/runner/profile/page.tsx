import { Metadata } from 'next';
import { Star, User, Mail, Phone, MapPin, Edit2, Camera, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Profile - CampusRunner',
  description: 'View and update your runner profile',
};

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-[#0B0E11] mb-2">
          Your Profile
        </h1>
        <p className="text-[#6B7280] text-lg">
          Manage your runner account
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-[28px] border border-[#E9E4FF] bg-white/70 p-8 backdrop-blur">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#6200EE] to-[#4F2EE8] flex items-center justify-center text-5xl shadow-lg">
                👤
              </div>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-white border border-[#E9E4FF] shadow-lg hover:shadow-xl transition">
                <Camera className="w-5 h-5 text-[#6200EE]" />
              </button>
            </div>
            <h2 className="text-2xl font-black text-[#0B0E11]">Chukwu David</h2>
            <p className="text-[#6B7280] font-semibold mt-1">Campus Hero Tier</p>
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div className="border-l-4 border-[#6200EE] pl-4">
              <p className="text-[#6B7280] text-sm font-semibold mb-1">Rating</p>
              <p className="text-3xl font-black text-[#0B0E11]">4.9</p>
              <p className="text-xs text-[#6B7280] mt-1">45 reviews</p>
            </div>
            <div className="border-l-4 border-[#03DAC5] pl-4">
              <p className="text-[#6B7280] text-sm font-semibold mb-1">Completed</p>
              <p className="text-3xl font-black text-[#0B0E11]">127</p>
              <p className="text-xs text-[#6B7280] mt-1">Total jobs</p>
            </div>
            <div className="border-l-4 border-[#00C853] pl-4">
              <p className="text-[#6B7280] text-sm font-semibold mb-1">Earnings</p>
              <p className="text-3xl font-black text-[#0B0E11]">₦125K</p>
              <p className="text-xs text-[#6B7280] mt-1">All-time</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-t border-[#E9E4FF]">
          <div>
            <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <p className="text-[#0B0E11] font-bold">chukwu.david@email.com</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2">
              <Phone className="w-4 h-4" />
              Phone
            </label>
            <p className="text-[#0B0E11] font-bold">+234 (0) 800 123 4567</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2">
              <MapPin className="w-4 h-4" />
              Campus Location
            </label>
            <p className="text-[#0B0E11] font-bold">Hostel A, Block 2</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2">
              <Award className="w-4 h-4" />
              Student ID
            </label>
            <p className="text-[#0B0E11] font-bold">STU/2023/00456</p>
          </div>
        </div>

        {/* Edit Button */}
        <button className="w-full mt-8 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#6200EE] to-[#4F2EE8] text-white font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
          <Edit2 className="w-5 h-5" />
          Edit Profile
        </button>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-2xl font-black text-[#0B0E11] mb-6">
          Your Badges 🌟
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: '100 Jobs', icon: '🏆', color: 'from-[#FFC107]' },
            { name: 'Perfect Rating', icon: '⭐', color: 'from-[#00C853]' },
            { name: 'Fast Runner', icon: '⚡', color: 'from-[#6200EE]' },
            { name: 'Campus Hero', icon: '👑', color: 'from-[#03DAC5]' },
          ].map((badge) => (
            <div
              key={badge.name}
              className={`rounded-[28px] bg-gradient-to-br ${badge.color}/20 border border-[#E9E4FF] p-6 text-center`}
            >
              <p className="text-3xl mb-2">{badge.icon}</p>
              <p className="font-bold text-[#0B0E11] text-sm">{badge.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div>
        <h3 className="text-2xl font-black text-[#0B0E11] mb-6">
          Account Settings
        </h3>
        <div className="space-y-3">
          <button className="w-full text-left px-6 py-4 rounded-2xl border border-[#E9E4FF] bg-white/70 backdrop-blur text-[#0B0E11] font-bold hover:shadow-lg transition-all">
            Change Password
          </button>
          <button className="w-full text-left px-6 py-4 rounded-2xl border border-[#E9E4FF] bg-white/70 backdrop-blur text-[#0B0E11] font-bold hover:shadow-lg transition-all">
            Privacy Settings
          </button>
          <button className="w-full text-left px-6 py-4 rounded-2xl border border-[#E9E4FF] bg-white/70 backdrop-blur text-[#0B0E11] font-bold hover:shadow-lg transition-all">
            Notification Preferences
          </button>
          <button className="w-full text-left px-6 py-4 rounded-2xl border border-[#E9E4FF] bg-white/70 backdrop-blur text-red-600 font-bold hover:bg-red-50 transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
