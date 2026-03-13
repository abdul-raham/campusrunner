'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/supabase/client';
import { Package, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { PageLoader } from '@/components/PageLoader';

interface ActiveJob {
  id: string;
  title: string;
  status: string;
  final_amount: number;
  pickup_location: string;
  delivery_location: string;
  student_id: string;
  service_categories: { name: string } | null;
  profiles: { full_name: string; phone: string } | null;
}

export default function RunnerActiveJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<ActiveJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchActiveJobs();
  }, [user]);

  const fetchActiveJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, title, status, final_amount, pickup_location, delivery_location, student_id, service_category_id')
        .eq('runner_id', user?.id)
        .in('status', ['accepted', 'in_progress'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      const jobsWithDetails = await Promise.all(
        (data || []).map(async (job) => {
          let serviceCategory = null;
          let studentProfile = null;

          if (job.service_category_id) {
            const { data: cat } = await supabase
              .from('service_categories')
              .select('name')
              .eq('id', job.service_category_id)
              .single();
            serviceCategory = cat;
          }

          if (job.student_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, phone')
              .eq('id', job.student_id)
              .single();
            studentProfile = profile;
          }

          return { ...job, service_categories: serviceCategory, profiles: studentProfile };
        })
      );

      setJobs(jobsWithDetails);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (jobId: string, newStatus: string, studentId: string) => {
    setUpdating(jobId);

    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', jobId);

      if (updateError) throw updateError;

      const notifMessage = newStatus === 'in_progress' 
        ? 'Your order is now in progress'
        : 'Your order has been completed';

      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: studentId,
          type: `order_${newStatus}`,
          title: `Order ${newStatus === 'in_progress' ? 'In Progress' : 'Completed'}`,
          message: notifMessage,
          order_id: jobId
        });

      if (notifError) console.error('Notification error:', notifError);

      fetchActiveJobs();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'accepted' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700';
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Active Jobs</h1>
          <p className="text-sm text-gray-500 mt-0.5">{jobs.length} active jobs</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job.id} className="bg-white rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{job.service_categories?.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                  {job.status === 'in_progress' ? 'In Progress' : 'Accepted'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Pickup</p>
                    <p className="text-sm text-gray-900">{job.pickup_location}</p>
                  </div>
                </div>
                {job.delivery_location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Delivery</p>
                      <p className="text-sm text-gray-900">{job.delivery_location}</p>
                    </div>
                  </div>
                )}
              </div>

              {job.profiles && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{job.profiles.full_name}</p>
                    <p className="text-xs text-gray-500">Student</p>
                  </div>
                  <a
                    href={`tel:${job.profiles.phone}`}
                    className="w-9 h-9 rounded-full bg-[#6200EE] flex items-center justify-center"
                  >
                    <Phone className="w-4 h-4 text-white" />
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-lg font-bold text-[#6200EE]">₦{job.final_amount.toLocaleString()}</span>
                {job.status === 'accepted' ? (
                  <button
                    onClick={() => updateStatus(job.id, 'in_progress', job.student_id)}
                    disabled={updating === job.id}
                    className="px-6 py-2 bg-[#6200EE] text-white font-medium rounded-full disabled:opacity-50"
                  >
                    {updating === job.id ? 'Starting...' : 'Start Task'}
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(job.id, 'completed', job.student_id)}
                    disabled={updating === job.id}
                    className="px-6 py-2 bg-green-600 text-white font-medium rounded-full disabled:opacity-50"
                  >
                    {updating === job.id ? 'Completing...' : 'Complete Task'}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No active jobs</p>
            <Link href="/runner/jobs" className="text-[#6200EE] font-medium mt-2 inline-block">
              Browse Available Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
