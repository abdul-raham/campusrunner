'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/supabase/client';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  School, 
  Edit3, 
  Save, 
  X,
  Camera,
  Shield,
  Star,
  Package,
  Clock
} from 'lucide-react';

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  university: string;
  hostel_location: string;
  avatar_url?: string;
}

interface ProfileStats {
  totalOrders: number;
  completedOrders: number;
  avgRating: number;
  memberSince: string;
}

export default function StudentProfilePage() {
  const { user, profile, loading } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone: '',
    university: '',
    hostel_location: '',
    avatar_url: ''
  });
  const [stats, setStats] = useState<ProfileStats>({
    totalOrders: 0,
    completedOrders: 0,
    avgRating: 0,
    memberSince: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        university: profile.university || '',
        hostel_location: profile.hostel_location || '',
        avatar_url: profile.avatar_url || ''
      });
      fetchStats();
    }
  }, [profile]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Fetch order statistics
      const { data: orders } = await supabase
        .from('orders')
        .select('status, created_at')
        .eq('student_id', user.id);

      if (orders) {
        const totalOrders = orders.length;
        const completedOrders = orders.filter(order => order.status === 'completed').length;
        const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '';

        setStats({
          totalOrders,
          completedOrders,
          avgRating: 4.8, // Mock rating for now
          memberSince
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          university: profileData.university,
          hostel_location: profileData.hostel_location,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setIsEditing(false);
      // Refresh the auth context
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        university: profile.university || '',
        hostel_location: profile.hostel_location || '',
        avatar_url: profile.avatar_url || ''
      });
    }
    setIsEditing(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen px-3 py-4 md:px-8 md:py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-3 py-4 md:px-8 md:py-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0B0E11] sm:text-4xl">My Profile</h1>
            <p className="text-[#6B7280] mt-2">Manage your account information and preferences</p>
          </div>
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </motion.button>
          ) : (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-red-200 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all"
              >
                <X className="w-4 h-4" />
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl p-6 shadow-lg"
          >
            <div className="flex items-start gap-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#6200EE] to-[#03DAC5] flex items-center justify-center text-white text-2xl font-black">
                  {profileData.full_name.charAt(0).toUpperCase() || 'S'}
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#6200EE] text-white rounded-full flex items-center justify-center hover:bg-[#4F2EE8] transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-[#0B0E11] mb-2">{profileData.full_name}</h2>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-green-600">Verified Student</span>
                </div>
                <p className="text-[#6B7280]">Member since {stats.memberSince}</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#0B0E11] mb-2">
                    <User className="w-4 h-4 text-[#6200EE]" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 transition-all"
                    />
                  ) : (
                    <p className="px-4 py-3 rounded-xl bg-[#F4ECFF] text-[#0B0E11] font-medium">{profileData.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#0B0E11] mb-2">
                    <Phone className="w-4 h-4 text-[#6200EE]" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 transition-all"
                    />
                  ) : (
                    <p className="px-4 py-3 rounded-xl bg-[#F4ECFF] text-[#0B0E11] font-medium">{profileData.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#0B0E11] mb-2">
                    <Mail className="w-4 h-4 text-[#6200EE]" />
                    Email Address
                  </label>
                  <p className="px-4 py-3 rounded-xl bg-gray-100 text-[#6B7280] font-medium">{profileData.email}</p>
                  <p className="text-xs text-[#6B7280] mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#0B0E11] mb-2">
                    <School className="w-4 h-4 text-[#6200EE]" />
                    University
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.university}
                      onChange={(e) => setProfileData({...profileData, university: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 transition-all"
                    />
                  ) : (
                    <p className="px-4 py-3 rounded-xl bg-[#F4ECFF] text-[#0B0E11] font-medium">{profileData.university}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center gap-2 text-sm font-bold text-[#0B0E11] mb-2">
                <MapPin className="w-4 h-4 text-[#6200EE]" />
                Hostel Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.hostel_location}
                  onChange={(e) => setProfileData({...profileData, hostel_location: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 transition-all"
                />
              ) : (
                <p className="px-4 py-3 rounded-xl bg-[#F4ECFF] text-[#0B0E11] font-medium">{profileData.hostel_location}</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Profile Stats */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-black text-[#0B0E11] mb-6">Profile Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'Total Orders', value: stats.totalOrders.toString(), icon: Package, color: 'from-blue-500 to-blue-600' },
                { label: 'Completed', value: stats.completedOrders.toString(), icon: Clock, color: 'from-green-500 to-green-600' },
                { label: 'Rating', value: stats.avgRating.toString(), icon: Star, color: 'from-yellow-500 to-yellow-600' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-white to-[#F4ECFF] border border-[#E9E4FF]"
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[#0B0E11]">{stat.value}</p>
                      <p className="text-sm text-[#6B7280]">{stat.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Account Security */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-black text-[#0B0E11] mb-4">Account Security</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Email Verified</span>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Profile Complete</span>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}