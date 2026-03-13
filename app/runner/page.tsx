'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/supabase/client';
import { TrendingUp, Package, Clock, ChevronRight, Zap, Star, Award } from 'lucide-react';
import Link from 'next/link';
import { PageLoader } from '@/components/PageLoader';

interface Stats {
  totalEarnings: number;
  completedJobs: number;
  activeJobs: number;
  availableJobs: number;
  monthlyEarnings: number;
}

interface RecentJob {
  id: string;
  title: string;
  final_amount: number;
  status: string;
  completed_at: string;
}

interface AvailableJob {
  id: string;
  title: string;
  budget_amount: number;
  pickup_location: string;
  created_at: string;
}

export default function RunnerDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalEarnings: 0, completedJobs: 0, activeJobs: 0, availableJobs: 0, monthlyEarnings: 0 });
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [availableJobs, setAvailableJobs] = useState<AvailableJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchStats();
      fetchRecentJobs();
      fetchAvailableJobs();
    }
  }, [profile]);

  const fetchStats = async () => {
    try {
      const { data: completed } = await supabase
        .from('orders')
        .select('final_amount, completed_at')
        .eq('runner_id', profile?.id)
        .eq('status', 'completed');

      const { data: active } = await supabase
        .from('orders')
        .select('id')
        .eq('runner_id', profile?.id)
        .in('status', ['accepted', 'in_progress']);

      const { data: available } = await supabase
        .from('orders')
        .select('id')
        .eq('status', 'pending');

      const totalEarnings = (completed || []).reduce((sum, order) => sum + order.final_amount, 0);
      
      const now = new Date();
      const monthlyEarnings = (completed || [])
        .filter(order => {
          const orderDate = new Date(order.completed_at);
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, order) => sum + order.final_amount, 0);

      setStats({
        totalEarnings,
        completedJobs: completed?.length || 0,
        activeJobs: active?.length || 0,
        availableJobs: available?.length || 0,
        monthlyEarnings
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchRecentJobs = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('id, title, final_amount, status, completed_at')
        .eq('runner_id', profile?.id)
        .order('completed_at', { ascending: false })
        .limit(5);

      setRecentJobs(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAvailableJobs = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('id, title, budget_amount, pickup_location, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(3);

      setAvailableJobs(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-4">
          <p className="text-sm text-gray-500">Welcome back</p>
          <h1 className="text-2xl font-bold text-gray-900">{profile?.full_name?.split(' ')[0] || 'Runner'}</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Earnings Card */}
        <div className="bg-gradient-to-br from-[#6200EE] to-[#03DAC5] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Total Earnings</span>
          </div>
          <div className="text-4xl font-bold mb-1">₦{stats.totalEarnings.toLocaleString()}</div>
          <div className="text-sm opacity-80 mb-4">+₦{stats.monthlyEarnings.toLocaleString()} this month</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <div className="text-xl font-bold">{stats.completedJobs}</div>
              <div className="text-xs opacity-80">Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <div className="text-xl font-bold">{stats.activeJobs}</div>
              <div className="text-xs opacity-80">Active</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <div className="text-xl font-bold">{stats.availableJobs}</div>
              <div className="text-xs opacity-80">Available</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/runner/jobs"
            className="bg-white rounded-xl p-4 border active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-3">
              <Package className="w-5 h-5 text-[#6200EE]" />
            </div>
            <div className="font-semibold text-gray-900 mb-1">Browse Jobs</div>
            <div className="text-xs text-gray-500">{stats.availableJobs} available</div>
          </Link>

          <Link
            href="/runner/jobs/active"
            className="bg-white rounded-xl p-4 border active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="font-semibold text-gray-900 mb-1">Active Jobs</div>
            <div className="text-xs text-gray-500">{stats.activeJobs} in progress</div>
          </Link>
        </div>

        {/* Available Jobs Preview */}
        {availableJobs.length > 0 && (
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">New Jobs</h2>
              <Link href="/runner/jobs" className="text-sm text-[#6200EE] font-medium flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {availableJobs.map(job => (
                <Link
                  key={job.id}
                  href="/runner/jobs"
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-white rounded-xl border border-purple-100 active:scale-98 transition-transform"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate mb-1">{job.title}</p>
                    <p className="text-xs text-gray-500 truncate">{job.pickup_location}</p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="font-bold text-[#6200EE] text-base">₦{job.budget_amount.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Performance Stats */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Performance</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Completion Rate</p>
                  <p className="text-xs text-gray-500">All time</p>
                </div>
              </div>
              <p className="text-xl font-bold text-green-600">100%</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Average Rating</p>
                  <p className="text-xs text-gray-500">From students</p>
                </div>
              </div>
              <p className="text-xl font-bold text-yellow-600">5.0</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Response Time</p>
                  <p className="text-xs text-gray-500">Average</p>
                </div>
              </div>
              <p className="text-xl font-bold text-blue-600">2m</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentJobs.length > 0 && (
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Recent Earnings</h2>
              <Link href="/runner/earnings" className="text-sm text-[#6200EE] font-medium flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentJobs.slice(0, 3).map(job => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{job.title}</p>
                    <p className="text-xs text-gray-500">
                      {job.status === 'completed' && job.completed_at
                        ? new Date(job.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : job.status}
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="font-bold text-green-600 text-sm">+₦{job.final_amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
