'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import PageLoader from '@/components/PageLoader';
import '../runner.css';

async function notifyStudent(orderId: string, status: string) {
  try {
    await fetch('/api/runner/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
  } catch (e) { console.error('Notify failed:', e); }
}

interface Job {
  id: string;
  title: string;
  description: string;
  budget_amount: number;
  final_amount: number;
  pickup_location: string;
  delivery_location: string;
  urgency_level: string;
  status: string;
  created_at: string;
  student_id: string;
  service_categories: { name: string } | null;
}

const URGENCY_META: Record<string, { icon: string; color: string; bg: string }> = {
  urgent: { icon: '⚡', color: 'var(--warn)', bg: 'var(--warn-bg)' },
  normal: { icon: '🕐', color: 'var(--ink3)', bg: 'var(--surf2)' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function RunnerJobsPage() {
  const { user, profile } = useAuth();
  const [available, setAvailable] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [tab, setTab] = useState<'available' | 'mine'>('available');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { if (user) fetchAll(); }, [user]);

  const fetchAll = async () => {
    setRefreshing(true);
    try {
      const [avail, mine] = await Promise.all([
        supabase
          .from('orders')
          .select('id,title,description,budget_amount,final_amount,pickup_location,delivery_location,urgency_level,status,created_at,student_id,service_categories(name)')
          .eq('status', 'pending')
          .is('runner_id', null)
          .order('urgency_level', { ascending: false })
          .order('created_at', { ascending: false }),
        supabase
          .from('orders')
          .select('id,title,description,budget_amount,final_amount,pickup_location,delivery_location,urgency_level,status,created_at,student_id,service_categories(name)')
          .eq('runner_id', user?.id)
          .in('status', ['accepted', 'in_progress'])
          .order('created_at', { ascending: false }),
      ]);
      setAvailable((avail.data as Job[]) || []);
      setMyJobs((mine.data as Job[]) || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const acceptJob = async (job: Job) => {
    if (!profile) return;
    setAccepting(job.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/runner/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({ orderId: job.id }),
      });

      const result = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          alert('This job was just taken by another runner.');
          await fetchAll();
        } else {
          alert(`Failed to accept: ${result.error}`);
        }
        return;
      }

      setAvailable(prev => prev.filter(j => j.id !== job.id));
      setMyJobs(prev => [{ ...job, status: 'accepted' } as any, ...prev]);
      setTab('mine');
      setExpandedId(null);
    } catch (e: any) {
      console.error('Accept error:', e);
      alert(`Error: ${e.message}`);
    } finally { setAccepting(null); }
  };

  if (loading) return <PageLoader />;

  const list = tab === 'available' ? available : myJobs;

  return (
    <div className="sd-content" style={{ animation: 'fadeIn .4s ease both' }}>

      {/* HEADER */}
      <div className="sd-section-head">
        <div>
          <div className="sd-section-title" style={{ fontSize: 20 }}>Jobs</div>
          <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>
            {tab === 'available' ? `${available.length} open requests` : `${myJobs.length} active jobs`}
          </div>
        </div>
        <button
          onClick={fetchAll} disabled={refreshing}
          style={{ background: 'var(--surf2)', border: '1px solid var(--bdr)', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'var(--ink2)', fontFamily: 'inherit' }}
        >
          {refreshing ? '…' : '↻ Refresh'}
        </button>
      </div>

      {/* TABS */}
      <div className="rd-tabs">
        <button className={`rd-tab${tab === 'available' ? ' active' : ''}`} onClick={() => setTab('available')}>
          Available
          {available.length > 0 && <span className="sd-badge active" style={{ marginLeft: 6 }}>{available.length}</span>}
        </button>
        <button className={`rd-tab${tab === 'mine' ? ' active' : ''}`} onClick={() => setTab('mine')}>
          My Jobs
          {myJobs.length > 0 && <span className="sd-badge pending" style={{ marginLeft: 6 }}>{myJobs.length}</span>}
        </button>
      </div>

      {/* LIST */}
      {list.length === 0 ? (
        <div className="sd-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{tab === 'available' ? '🔍' : '✅'}</div>
          <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
            {tab === 'available' ? 'No open jobs right now' : 'No active jobs'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink3)' }}>
            {tab === 'available' ? 'Check back soon — new requests come in often' : 'Accept a job from the Available tab'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map(job => {
            const urg = URGENCY_META[job.urgency_level] ?? URGENCY_META.normal;
            const expanded = expandedId === job.id;
            const amount = job.final_amount || job.budget_amount || 0;
            return (
              <div key={job.id} className="sd-card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Main row */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', cursor: 'pointer' }}
                  onClick={() => setExpandedId(expanded ? null : job.id)}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: urg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {urg.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', marginBottom: 3 }}>{job.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink3)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span>{job.service_categories?.name || 'General'}</span>
                      <span>·</span>
                      <span>{timeAgo(job.created_at)}</span>
                      {job.urgency_level === 'urgent' && (
                        <span style={{ color: 'var(--warn)', fontWeight: 700 }}>· Urgent</span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>₦{amount.toLocaleString()}</div>
                    {tab === 'mine' && (
                      <span className={`sd-badge ${job.status === 'in_progress' ? 'active' : 'pending'}`} style={{ marginTop: 4 }}>
                        {job.status === 'in_progress' ? 'In Progress' : 'Accepted'}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink3)', marginLeft: 4 }}>{expanded ? '▲' : '▼'}</div>
                </div>

                {/* Expanded details */}
                {expanded && (
                  <div style={{ borderTop: '1px solid var(--bdr)', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {job.description && (
                      <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.6 }}>{job.description}</div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[
                        { icon: '📍', label: 'Pickup', val: job.pickup_location },
                        { icon: '🏠', label: 'Delivery', val: job.delivery_location },
                      ].map(loc => (
                        <div key={loc.label} style={{ background: 'var(--surf2)', borderRadius: 12, padding: '10px 12px' }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{loc.icon} {loc.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{loc.val || '—'}</div>
                        </div>
                      ))}
                    </div>

                    {tab === 'available' ? (
                      <button
                        onClick={() => acceptJob(job)}
                        disabled={accepting === job.id}
                        style={{
                          width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                          background: 'linear-gradient(135deg,var(--green),var(--green-s))',
                          color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer',
                          fontFamily: 'inherit', transition: 'all .2s',
                          boxShadow: '0 4px 16px rgba(15,61,46,.25)',
                          opacity: accepting === job.id ? .6 : 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}
                      >
                        {accepting === job.id ? (
                          <><span className="co-spinner" />Accepting…</>
                        ) : (
                          '✓ Accept This Job'
                        )}
                      </button>
                    ) : (
                      <Link
                        href="/runner/jobs/active"
                        style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 12, background: 'var(--surf2)', color: 'var(--ink)', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
                      >
                        Manage Job →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
