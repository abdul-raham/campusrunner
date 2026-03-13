'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/supabase/client';
import { Package, MapPin, Clock, DollarSign } from 'lucide-react';
import { PageLoader } from '@/components/PageLoader';

interface Job {
  id: string;
  title: string;
  description: string;
  budget_amount: number;
  pickup_location: string;
  delivery_location: string;
  created_at: string;
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
        .select('id, title, description, budget_amount, pickup_location, delivery_location, created_at, service_category_id')
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

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Available Jobs</h1>
          <p className="text-sm text-gray-500 mt-0.5">{jobs.length} jobs available</p>
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
                <div className="text-right">
                  <p className="text-lg font-bold text-[#6200EE]">₦{job.budget_amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Budget</p>
                </div>
              </div>

              {job.description && (
                <p className="text-sm text-gray-600 mb-3">{job.description}</p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Pickup</p>
                    <p className="text-sm text-gray-900 truncate">{job.pickup_location}</p>
                  </div>
                </div>
                {job.delivery_location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Delivery</p>
                      <p className="text-sm text-gray-900 truncate">{job.delivery_location}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
                <button
                  onClick={() => acceptJob(job.id, job.student_id)}
                  disabled={accepting === job.id}
                  className="px-6 py-2 bg-[#6200EE] text-white font-medium rounded-full disabled:opacity-50"
                >
                  {accepting === job.id ? 'Accepting...' : 'Accept Job'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No jobs available</p>
            <p className="text-sm text-gray-400 mt-1">Check back later for new orders</p>
          </div>
        )}
      </div>
    </div>
  );
}
