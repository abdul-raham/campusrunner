'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/supabase/client';
import { Package, MapPin, Clock, Zap } from 'lucide-react';
import { PageLoader } from '@/components/PageLoader';

interface Job {
  id: string;
  title: string;
  description: string;
  budget_amount: number;
  pickup_location: string;
  delivery_location: string;
  created_at: string;
  student_id: string;
  service_categories: { name: string } | null;
}

export default function RunnerJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, title, description, budget_amount, pickup_location, delivery_location, created_at, student_id, service_category_id')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const jobsWithCategories = await Promise.all(
        (data || []).map(async (job) => {
          if (job.service_category_id) {
            const { data: cat } = await supabase
              .from('service_categories')
              .select('name')
              .eq('id', job.service_category_id)
              .single();
            return { ...job, service_categories: cat };
          }
          return { ...job, service_categories: null };
        })
      );

      setJobs(jobsWithCategories);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptJob = async (jobId: string, studentId: string) => {
    if (!user) return;
    setAccepting(jobId);

    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          runner_id: user.id,
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (updateError) throw updateError;

      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: studentId,
          type: 'order_accepted',
          title: 'Order Accepted',
          message: 'A runner has accepted your order',
          order_id: jobId
        });

      if (notifError) console.error('Notification error:', notifError);

      fetchJobs();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to accept job');
    } finally {
      setAccepting(null);
    }
  };

  const getTimeAgo = (date: string) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Available Jobs</h1>
          <p className="text-sm text-gray-500 mt-0.5">{jobs.length} jobs waiting</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {/* Top Section */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6200EE] to-[#03DAC5] flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{job.title}</h3>
                    <span className="inline-block px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full">
                      {job.service_categories?.name || 'Service'}
                    </span>
                  </div>
                </div>

                {job.description && (
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{job.description}</p>
                )}

                {/* Locations */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 mb-1">PICKUP</p>
                      <p className="text-sm text-gray-900 font-medium">{job.pickup_location}</p>
                    </div>
                  </div>

                  {job.delivery_location && (
                    <>
                      <div className="ml-4 w-0.5 h-4 bg-gray-200" />
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 mb-1">DELIVERY</p>
                          <p className="text-sm text-gray-900 font-medium">{job.delivery_location}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Section */}
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-t flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">You'll earn</p>
                    <p className="text-2xl font-black text-[#6200EE]">₦{job.budget_amount.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-px bg-gray-200" />
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{getTimeAgo(job.created_at)}</span>
                  </div>
                </div>
                <button
                  onClick={() => acceptJob(job.id, job.student_id)}
                  disabled={accepting === job.id}
                  className="px-6 py-3 bg-[#6200EE] text-white font-bold rounded-xl disabled:opacity-50 active:scale-95 transition-all shadow-lg shadow-[#6200EE]/20"
                >
                  {accepting === job.id ? 'Accepting...' : 'Accept'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No jobs available</h3>
            <p className="text-sm text-gray-500">New orders will appear here automatically</p>
          </div>
        )}
      </div>
    </div>
  );
}
