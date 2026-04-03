'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import PageLoader from '@/components/PageLoader';
import '../student.css';

interface Transaction {
  id: string;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  created_at: string;
  order_id?: string;
}

export default function StudentWalletPage() {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<number>(0);
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');

  useEffect(() => { if (user) { fetchBalance(); fetchTransactions(); } }, [user]);

  const fetchBalance = async () => {
    const { data } = await supabase
      .from('wallets')
      .select('balance')
      .or(`user_id.eq.${user?.id},student_id.eq.${user?.id}`)
      .maybeSingle();
    if (data) setBalance(data.balance ?? 0);
  };

  const fetchTransactions = async () => {
    try {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) return;
      const { data: orders } = await supabase
        .from('orders')
        .select('id, title, final_amount, created_at, status')
        .eq('student_id', u.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (orders) {
        const txns: Transaction[] = [
          { id: 'credit-1', amount: 5000, type: 'credit', description: 'Initial wallet funding', created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
          ...orders.map(o => ({
            id: o.id, amount: o.final_amount || 0, type: 'debit' as const,
            description: `Payment for ${o.title}`, created_at: o.created_at, order_id: o.id,
          })),
        ];
        setTransactions(txns);
        setTotalSpent(orders.reduce((s, o) => s + (o.final_amount || 0), 0));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filtered = transactions.filter(t => filter === 'all' ? true : t.type === filter);
  const credits = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const debits  = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  if (loading) return <PageLoader />;

  return (
    <div className="sd-content" style={{ animation: 'fadeIn .4s ease both' }}>

      {/* WALLET HERO */}
      <div className="sd-wallet">
        <div className="sd-wallet-top">
          <div>
            <div className="sd-wallet-label">Campus Wallet</div>
            <div className="sd-wallet-amount" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <sup>₦</sup>{showBalance ? balance.toLocaleString() : '• • • • •'}
              <button
                onClick={() => setShowBalance(v => !v)}
                style={{ background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}
                title={showBalance ? 'Hide balance' : 'Show balance'}
              >
                {showBalance ? '👁' : '🙈'}
              </button>
            </div>
            <div className="sd-wallet-change up">Available balance</div>
          </div>
          <div className="sd-wallet-badge">● Active</div>
        </div>
        <div className="sd-wallet-actions">
          <button className="sd-wallet-btn primary">＋ Fund Wallet</button>
          <button className="sd-wallet-btn ghost">Transfer</button>
        </div>
      </div>

      {/* STATS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {[
          { label: 'Total Funded', val: `₦${credits.toLocaleString()}`, icon: '↓', bg: 'rgba(22,163,74,.1)', color: 'var(--ok)' },
          { label: 'Total Spent',  val: `₦${debits.toLocaleString()}`,  icon: '↑', bg: 'rgba(212,175,55,.12)', color: 'var(--gold-d)' },
          { label: 'Transactions', val: String(transactions.length),     icon: '≡', bg: 'rgba(15,61,46,.1)',   color: 'var(--green)' },
        ].map(s => (
          <div key={s.label} className="sd-card" style={{ textAlign: 'center', padding: '16px 12px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: s.color, margin: '0 auto 8px' }}>{s.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em' }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* TRANSACTIONS */}
      <div className="sd-card">
        <div className="sd-section-head">
          <div className="sd-section-title">Transactions</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'credit', 'debit'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none',
                  background: filter === f ? 'var(--green)' : 'var(--surf2)',
                  color: filter === f ? '#fff' : 'var(--ink2)',
                  transition: 'all .2s',
                }}
              >
                {f === 'all' ? 'All' : f === 'credit' ? 'Funded' : 'Spent'}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink3)', fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💸</div>
            No transactions yet
          </div>
        ) : (
          <div className="sd-orders-list">
            {filtered.map(tx => (
              <div key={tx.id} className="sd-order-row">
                <div className="sd-order-row-icon" style={{ background: tx.type === 'credit' ? 'rgba(22,163,74,.1)' : 'rgba(212,175,55,.12)' }}>
                  {tx.type === 'credit' ? '↓' : '↑'}
                </div>
                <div className="sd-order-row-info">
                  <div className="sd-order-row-title">{tx.description}</div>
                  <div className="sd-order-row-sub">
                    {new Date(tx.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 13, color: tx.type === 'credit' ? 'var(--ok)' : 'var(--err)', flexShrink: 0 }}>
                  {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
