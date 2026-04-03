'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import PageLoader from '@/components/PageLoader';

interface JobSummary {
  id: string;
  title: string;
  budget_amount: number;
  created_at: string;
  status: string;
  service_categories: { name: string } | null;
}

export default function RunnerDashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [availableJobs, setAvailableJobs] = useState<JobSummary[]>([]);
  const [activeJobs, setActiveJobs] = useState<JobSummary[]>([]);
  const [todayEarnings, setTodayEarnings] = useState(0);

  useEffect(() => {
    if (!profile?.id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [available, active, completed] = await Promise.all([
          supabase
            .from('orders')
            .select('id,title,budget_amount,created_at,status,service_categories(name)')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(6),
          supabase
            .from('orders')
            .select('id,title,budget_amount,created_at,status,service_categories(name)')
            .eq('runner_id', profile.id)
            .in('status', ['accepted', 'in_progress'])
            .order('created_at', { ascending: false })
            .limit(3),
          supabase
            .from('orders')
            .select('final_amount,completed_at')
            .eq('runner_id', profile.id)
            .eq('status', 'completed')
            .order('completed_at', { ascending: false })
            .limit(12),
        ]);

        setAvailableJobs((available.data as JobSummary[]) || []);
        setActiveJobs((active.data as JobSummary[]) || []);

        const today = new Date().toDateString();
        const earned = (completed.data || [])
          .filter((o: any) => o.completed_at && new Date(o.completed_at).toDateString() === today)
          .reduce((s: number, o: any) => s + (o.final_amount || 0), 0);
        setTodayEarnings(earned);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile?.id]);

  if (loading) return <PageLoader />;

  return (
    <div className="sd-content">
      {/* HERO WALLET */}
      <div className="sd-wallet">
        <div className="sd-wallet-top">
          <div>
            <div className="sd-wallet-label">Runner Wallet</div>
            <div className="sd-wallet-amount">
              <sup>₦</sup>
              {todayEarnings.toLocaleString()}
            </div>
            <div className="sd-wallet-change">Today&apos;s earnings</div>
          </div>
          <div className="sd-wallet-badge">● Online</div>
        </div>
        <div className="sd-wallet-actions">
          <Link href="/runner/jobs" className="sd-wallet-btn primary">Find Jobs</Link>
          <Link href="/runner/earnings" className="sd-wallet-btn ghost">View Earnings →</Link>
        </div>
      </div>

      {/* ACTIVE JOBS */}
      <div className="sd-card">
        <div className="sd-section-head">
          <div className="sd-section-title">Active Jobs</div>
          <Link href="/runner/jobs/active" className="sd-section-link">View all →</Link>
        </div>
        {activeJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '18px 0', color: 'var(--ink3)', fontSize: 13 }}>
            No active jobs yet
          </div>
        ) : (
          <div className="sd-orders-list">
            {activeJobs.map(job => (
              <div key={job.id} className="sd-order-row">
                <div className="sd-order-row-icon">🏃</div>
                <div className="sd-order-row-info">
                  <div className="sd-order-row-title">{job.title}</div>
                  <div className="sd-order-row-sub">{job.service_categories?.name || 'Request'}</div>
                </div>
                <div className="sd-order-row-right">
                  <div className="sd-order-row-amt">₦{job.budget_amount?.toLocaleString()}</div>
                  <span className={`sd-badge ${job.status === 'accepted' ? 'active' : 'pending'}`}>
                    {job.status === 'accepted' ? 'Accepted' : 'In progress'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TWO COL */}
      <div className="sd-two-col">
        {/* AVAILABLE */}
        <div className="sd-card">
          <div className="sd-section-head">
            <div className="sd-section-title">Open Requests</div>
            <Link href="/runner/jobs" className="sd-section-link">Browse all →</Link>
          </div>
          {availableJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '18px 0', color: 'var(--ink3)', fontSize: 13 }}>
              No requests available right now
            </div>
          ) : (
            <div className="sd-orders-list">
              {availableJobs.map(job => (
                <div key={job.id} className="sd-order-row">
                  <div className="sd-order-row-icon">💼</div>
                  <div className="sd-order-row-info">
                    <div className="sd-order-row-title">{job.title}</div>
                    <div className="sd-order-row-sub">{job.service_categories?.name || 'Request'}</div>
                  </div>
                  <div className="sd-order-row-right">
                    <div className="sd-order-row-amt">₦{job.budget_amount?.toLocaleString()}</div>
                    <span className="sd-badge pending">Pending</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="sd-stats-col">
          {[
            { icon: '✅', value: activeJobs.length, label: 'Active jobs' },
            { icon: '💰', value: `₦${todayEarnings.toLocaleString()}`, label: 'Today earned' },
            { icon: '⚡', value: availableJobs.length, label: 'Open requests' },
          ].map((stat) => (
            <div key={stat.label} className="sd-stat-card">
              <div className="sd-stat-icon" style={{ background: 'rgba(201,149,42,.12)' }}>{stat.icon}</div>
              <div>
                <div className="sd-stat-val">{stat.value}</div>
                <div className="sd-stat-lbl">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
