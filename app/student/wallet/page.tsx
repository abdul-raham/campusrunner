'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
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

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

export default function StudentWalletPage() {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<number>(0);
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [fundOpen, setFundOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [funding, setFunding] = useState(false);

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
      const { data } = await supabase
        .from('wallet_transactions')
        .select('id, amount, type, note, created_at, order_id')
        .eq('user_id', u.id)
        .order('created_at', { ascending: false });

      if (data) {
        const txns: Transaction[] = data.map((t: any) => ({
          id: t.id,
          amount: Number(t.amount || 0),
          type: t.type === 'credit' ? 'credit' : 'debit',
          description: t.note || (t.type === 'credit' ? 'Wallet funding' : 'Order payment'),
          created_at: t.created_at,
          order_id: t.order_id || undefined,
        }));
        setTransactions(txns);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const startFunding = async () => {
    const amount = Number(fundAmount || 0);
    if (!amount || amount <= 0) return;
    setFunding(true);
    try {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) throw new Error('Not authenticated');

      const initRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, userId: u.id, email: u.email }),
      });
      const init = await initRes.json();
      if (!initRes.ok) throw new Error(init.error || 'Failed to initialize');

      // @ts-ignore
      const handler = window.PaystackPop?.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: u.email,
        amount: Math.round(amount * 100),
        ref: init.reference,
        onClose: () => setFunding(false),
        callback: async () => {
          const verifyRes = await fetch('/api/paystack/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference: init.reference, userId: u.id }),
          });
          const verify = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verify.error || 'Verification failed');
          await fetchBalance();
          await fetchTransactions();
          setFundOpen(false);
          setFundAmount('');
        },
      });
      handler?.openIframe();
    } catch (e: any) {
      console.error(e);
    } finally {
      setFunding(false);
    }
  };

  const filtered = transactions.filter(t => filter === 'all' ? true : t.type === filter);
  const credits = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const debits  = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  if (loading) return <PageLoader />;

  return (
    <div className="sd-content" style={{ animation: 'fadeIn .4s ease both' }}>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />

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
          <button className="sd-wallet-btn primary" onClick={() => setFundOpen(true)}>＋ Fund Wallet</button>
          <button className="sd-wallet-btn ghost">Transfer</button>
        </div>
      </div>

      {fundOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16,
        }} onClick={() => setFundOpen(false)}>
          <div
            style={{ width: '100%', maxWidth: 420, background: 'var(--surf)', borderRadius: 16, padding: 20, border: '1px solid var(--bdr)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, color: 'var(--ink)' }}>Fund Wallet</div>
            <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 14 }}>Enter the amount you want to add.</div>
            <input
              type="number" min={0} placeholder="Amount" value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--bdr-m)', borderRadius: 10, background: 'var(--surf2)', color: 'var(--ink)', fontSize: 13, outline: 'none', fontFamily: 'inherit', marginBottom: 12 }}
            />
            <button onClick={startFunding} disabled={funding || !fundAmount} className="sd-wallet-btn primary" style={{ width: '100%' }}>
              {funding ? 'Opening Paystack…' : 'Pay with Paystack'}
            </button>
          </div>
        </div>
      )}

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
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none', background: filter === f ? 'var(--green)' : 'var(--surf2)', color: filter === f ? '#fff' : 'var(--ink2)', transition: 'all .2s' }}>
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
