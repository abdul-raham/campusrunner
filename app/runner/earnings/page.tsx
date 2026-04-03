'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import PageLoader from '@/components/PageLoader';
import '../runner.css';

interface CompletedJob {
  id: string;
  title: string;
  final_amount: number;
  platform_fee: number;
  completed_at: string;
}

type Period = 'week' | 'month' | 'all';

export default function RunnerEarningsPage() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<CompletedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('month');
  const [balance, setBalance] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => { if (profile?.id) fetchJobs(); }, [profile]);

  const fetchJobs = async () => {
    try {
      const [{ data }, { data: w }, { data: wd }] = await Promise.all([
        supabase
          .from('orders')
          .select('id,title,final_amount,platform_fee,completed_at')
          .eq('runner_id', profile?.id)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false }),
        supabase
          .from('wallets')
          .select('balance')
          .eq('user_id', profile?.id)
          .maybeSingle(),
        supabase
          .from('withdrawal_requests')
          .select('id')
          .eq('user_id', profile?.id)
          .eq('status', 'pending'),
      ]);

      setJobs((data as CompletedJob[]) || []);
      setBalance(Number(w?.balance || 0));
      setPendingWithdrawals((wd || []).length);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const now = new Date();
  const filtered = jobs.filter(j => {
    if (period === 'all') return true;
    const d = new Date(j.completed_at);
    if (period === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return d >= new Date(now.getTime() - 7 * 86400000);
  });

  const gross   = filtered.reduce((s, j) => s + (j.final_amount || 0), 0);
  const fees    = filtered.reduce((s, j) => s + (j.platform_fee || 0), 0);
  const net     = gross - fees;
  const allNet  = jobs.reduce((s, j) => s + ((j.final_amount || 0) - (j.platform_fee || 0)), 0);

  const requestWithdrawal = async () => {
    const amt = Number(withdrawAmount || 0);
    if (!amt || amt <= 0) return;
    if (amt > balance) return;
    setWithdrawing(true);
    try {
      const res = await fetch('/api/runner/withdraw-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt }),
      });
      if (res.ok) {
        setWithdrawAmount('');
        await fetchJobs();
      }
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="sd-content" style={{ animation: 'fadeIn .4s ease both' }}>

      {/* HERO */}
      <div className="sd-wallet">
        <div className="sd-wallet-top">
          <div>
            <div className="sd-wallet-label">
              {period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'All Time'} · Net Earnings
            </div>
            <div className="sd-wallet-amount"><sup>₦</sup>{net.toLocaleString()}</div>
            <div className="sd-wallet-change">All-time net: ₦{allNet.toLocaleString()}</div>
          </div>
          <div className="sd-wallet-badge">● {filtered.length} jobs</div>
        </div>
        <div className="sd-wallet-actions">
          {(['week', 'month', 'all'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`sd-wallet-btn ${period === p ? 'primary' : 'ghost'}`}
              style={{ flex: 'none', padding: '9px 18px' }}
            >
              {p === 'week' ? 'Week' : p === 'month' ? 'Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* WITHDRAW */}
      <div className="sd-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="sd-section-head">
          <div className="sd-section-title">Withdraw Earnings</div>
          {pendingWithdrawals > 0 && (
            <span className="sd-badge pending">{pendingWithdrawals} pending</span>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink3)' }}>
          Available balance: <strong style={{ color: 'var(--ink)' }}>â‚¦{balance.toLocaleString()}</strong>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="number"
            min={0}
            placeholder="Amount to withdraw"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            style={{
              maxWidth: 220,
              padding: '9px 12px',
              border: '1.5px solid var(--bdr-m)',
              borderRadius: 10,
              background: 'var(--surf)',
              color: 'var(--ink)',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={requestWithdrawal}
            disabled={withdrawing || !withdrawAmount || Number(withdrawAmount) > balance}
            className="sd-wallet-btn primary"
            style={{ flex: 'none', padding: '10px 16px' }}
          >
            {withdrawing ? 'Requestingâ€¦' : 'Request Withdrawal'}
          </button>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {[
          { icon: '💰', label: 'Gross',      val: `₦${gross.toLocaleString()}`,  bg: 'rgba(212,175,55,.12)', color: 'var(--gold-d)' },
          { icon: '📉', label: 'Fees',       val: `₦${fees.toLocaleString()}`,   bg: 'rgba(220,38,38,.08)',  color: 'var(--err)' },
          { icon: '✅', label: 'Deliveries', val: String(filtered.length),       bg: 'rgba(22,163,74,.1)',   color: 'var(--ok)' },
        ].map(s => (
          <div key={s.label} className="sd-card" style={{ padding: '16px 14px', textAlign: 'center' }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, margin: '0 auto 8px' }}>{s.icon}</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: s.color, letterSpacing: '-.02em' }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* HISTORY */}
      <div className="sd-card">
        <div className="sd-section-head">
          <div className="sd-section-title">Transaction History</div>
          <span className="sd-badge delivered">{filtered.length} records</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--ink3)', fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💸</div>
            No earnings in this period
          </div>
        ) : (
          <div className="sd-orders-list">
            {filtered.map(job => {
              const jobNet = (job.final_amount || 0) - (job.platform_fee || 0);
              return (
                <div key={job.id} className="sd-order-row">
                  <div className="sd-order-row-icon" style={{ background: 'rgba(22,163,74,.1)', color: 'var(--ok)', fontSize: 18 }}>₦</div>
                  <div className="sd-order-row-info">
                    <div className="sd-order-row-title">{job.title}</div>
                    <div className="sd-order-row-sub">
                      {job.completed_at
                        ? new Date(job.completed_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                      {job.platform_fee > 0 && ` · Fee ₦${job.platform_fee.toLocaleString()}`}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--ok)', flexShrink: 0 }}>
                    +₦{jobNet.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
