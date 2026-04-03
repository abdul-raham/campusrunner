'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import PageLoader from '@/components/PageLoader';
import '../../runner.css';

interface ActiveJob {
  id: string;
  title: string;
  status: string;
  final_amount: number;
  budget_amount: number;
  pickup_location: string;
  delivery_location: string;
  urgency_level: string;
  student_id: string;
  created_at: string;
  service_categories: { name: string } | null;
  student_profile: { full_name: string; phone: string } | null;
}

function waLink(phone: string) {
  const clean = phone.replace(/\D/g, '');
  const num = clean.startsWith('0') ? '234' + clean.slice(1) : clean;
  return `https://wa.me/${num}`;
}

const STATUS_FLOW: Record<string, { next: string; label: string; nextLabel: string; color: string; bg: string }> = {
  accepted:    { next: 'in_progress', label: 'Accepted',    nextLabel: '🚀 Start Job',      color: '#3b82f6', bg: 'rgba(59,130,246,.1)' },
  in_progress: { next: 'completed',   label: 'In Progress', nextLabel: '✓ Mark Delivered',  color: 'var(--warn)', bg: 'var(--warn-bg)' },
};

export default function RunnerActiveJobsPage() {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState<ActiveJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [justCompleted, setJustCompleted] = useState<string | null>(null);

  useEffect(() => { if (user) fetchJobs(); }, [user]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id,title,status,final_amount,budget_amount,pickup_location,delivery_location,urgency_level,student_id,created_at,service_category_id')
        .eq('runner_id', user?.id)
        .in('status', ['accepted', 'in_progress'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enriched = await Promise.all((data || []).map(async job => {
        const [{ data: cat }, { data: student }] = await Promise.all([
          job.service_category_id
            ? supabase.from('service_categories').select('name').eq('id', job.service_category_id).single()
            : Promise.resolve({ data: null }),
          supabase.from('profiles').select('full_name, phone').eq('id', job.student_id).single(),
        ]);
        return { ...job, service_categories: cat, student_profile: student };
      }));

      setJobs(enriched as ActiveJob[]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (job: ActiveJob) => {
    const flow = STATUS_FLOW[job.status];
    if (!flow || !profile) return;
    setUpdating(job.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/runner/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({ orderId: job.id }),
      });

      const result = await res.json();
      if (!res.ok) {
        alert(`Failed to update: ${result.error}`);
        return;
      }

      if (result.newStatus === 'completed') {
        setJustCompleted(job.id);
        setTimeout(() => setJustCompleted(null), 3000);
      }
      await fetchJobs();
    } catch (e: any) {
      console.error('Update error:', e);
      alert(`Error: ${e.message}`);
    } finally { setUpdating(null); }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="sd-content" style={{ animation: 'fadeIn .4s ease both' }}>

      <div className="sd-section-head">
        <div>
          <div className="sd-section-title" style={{ fontSize: 20 }}>Active Jobs</div>
          <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>{jobs.length} job{jobs.length !== 1 ? 's' : ''} in progress</div>
        </div>
        <button
          onClick={fetchJobs}
          style={{ background: 'var(--surf2)', border: '1px solid var(--bdr)', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'var(--ink2)', fontFamily: 'inherit' }}
        >
          ↻ Refresh
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="sd-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏃</div>
          <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>No active jobs</div>
          <div style={{ fontSize: 13, color: 'var(--ink3)', marginBottom: 20 }}>Accept a job to see it here</div>
          <Link href="/runner/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg,var(--green),var(--green-s))', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
            Browse Jobs →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {jobs.map(job => {
            const flow = STATUS_FLOW[job.status];
            const amount = job.final_amount || job.budget_amount || 0;
            const isUpdating = updating === job.id;
            const isDone = justCompleted === job.id;

            return (
              <div key={job.id} className="sd-card" style={{ padding: 0, overflow: 'hidden' }}>

                {/* Status bar */}
                <div style={{ height: 4, background: `linear-gradient(90deg, ${flow?.color ?? 'var(--ok)'}, var(--gold))` }} />

                <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Title row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)', marginBottom: 4 }}>{job.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink3)' }}>{job.service_categories?.name || 'General'}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>₦{amount.toLocaleString()}</div>
                      <span style={{ display: 'inline-block', marginTop: 4, padding: '3px 10px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: flow?.bg, color: flow?.color }}>
                        {flow?.label}
                      </span>
                    </div>
                  </div>

                  {/* Locations */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { icon: '📍', label: 'Pickup', val: job.pickup_location },
                      { icon: '🏠', label: 'Deliver to', val: job.delivery_location },
                    ].map(loc => (
                      <div key={loc.label} style={{ background: 'var(--surf2)', borderRadius: 10, padding: '10px 12px' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{loc.icon} {loc.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{loc.val || '—'}</div>
                      </div>
                    ))}
                  </div>

                  {/* Student contact */}
                  {job.student_profile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--surf2)', borderRadius: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--green),var(--green-s))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                        {job.student_profile.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{job.student_profile.full_name}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink3)' }}>Student</div>
                      </div>
                      <a
                        href={waLink(job.student_profile.phone)}
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 10, background: '#25D366', color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}
                      >
                        💬 WhatsApp
                      </a>
                    </div>
                  )}

                  {/* Action button */}
                  {flow && (
                    <button
                      onClick={() => updateStatus(job)}
                      disabled={isUpdating || isDone}
                      style={{
                        width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                        background: isDone
                          ? 'var(--ok-bg)'
                          : job.status === 'in_progress'
                            ? 'linear-gradient(135deg,var(--gold-d),var(--gold))'
                            : 'linear-gradient(135deg,var(--green),var(--green-s))',
                        color: isDone ? 'var(--ok)' : '#fff',
                        fontSize: 14, fontWeight: 800, cursor: isUpdating ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit', transition: 'all .2s',
                        boxShadow: isDone ? 'none' : '0 4px 16px rgba(15,61,46,.2)',
                        opacity: isUpdating ? .7 : 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      {isUpdating
                        ? <><span className="co-spinner" />Updating…</>
                        : isDone
                          ? '✓ Completed!'
                          : flow.nextLabel}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
