'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import PageLoader from '@/components/PageLoader';
import '../student.css';

interface Order {
  id: string;
  title: string;
  description: string;
  status: string;
  final_amount: number;
  created_at: string;
  pickup_location: string;
  delivery_location: string;
  urgency_level: string;
  runner_id: string | null;
  service_categories: { name: string; icon_name: string } | { name: string; icon_name: string }[] | null;
  runner_profile: { full_name: string } | { full_name: string }[] | null;
}

const STATUS: Record<string, { label: string; cls: string; icon: string }> = {
  pending:     { label: 'Finding Runner',  cls: 'pending',   icon: '🔍' },
  accepted:    { label: 'Runner Assigned', cls: 'active',    icon: '✅' },
  in_progress: { label: 'On the Way',      cls: 'active',    icon: '🚀' },
  completed:   { label: 'Delivered',       cls: 'delivered', icon: '📦' },
  cancelled:   { label: 'Cancelled',       cls: 'pending',   icon: '❌' },
};

const SERVICE_ICONS: Record<string, { icon: string; bg: string }> = {
  food:     { icon: '🍔', bg: 'rgba(217,119,6,.1)' },
  laundry:  { icon: '👕', bg: 'rgba(15,61,46,.1)' },
  market:   { icon: '🛒', bg: 'rgba(212,175,55,.12)' },
  delivery: { icon: '📦', bg: 'rgba(99,102,241,.1)' },
  printing: { icon: '🖨️', bg: 'rgba(236,72,153,.1)' },
  gas:      { icon: '⛽', bg: 'rgba(239,68,68,.1)' },
  pharmacy: { icon: '💊', bg: 'rgba(16,185,129,.1)' },
};

function getMeta(title: string) {
  const key = title?.toLowerCase().split(' ')[0] ?? '';
  return SERVICE_ICONS[key] ?? { icon: '📋', bg: 'rgba(107,114,128,.1)' };
}

export default function StudentOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { if (user) fetchOrders(); }, [user]);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`id, title, description, status, final_amount, created_at,
          pickup_location, delivery_location, urgency_level, runner_id,
          service_categories (name, icon_name),
          runner_profile:profiles!runner_id (full_name)`)
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders((data as unknown as Order[]) || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const filtered = orders.filter(o => {
    const matchFilter =
      filter === 'all' ? true :
      filter === 'active' ? ['accepted', 'in_progress'].includes(o.status) :
      o.status === filter;
    const matchSearch = !search || o.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return <PageLoader />;

  return (
    <div className="sd-content" style={{ animation: 'fadeIn .4s ease both' }}>

      {/* HEADER */}
      <div className="sd-section-head">
        <div>
          <div className="sd-section-title" style={{ fontSize: 20 }}>My Orders</div>
          <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>{orders.length} total orders</div>
        </div>
        <button
          onClick={fetchOrders} disabled={refreshing}
          style={{ background: 'var(--surf2)', border: '1px solid var(--bdr)', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'var(--ink2)' }}
        >
          {refreshing ? '…' : '↻ Refresh'}
        </button>
      </div>

      {/* SEARCH */}
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--ink3)' }}>🔍</span>
        <input
          type="text" placeholder="Search orders…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '11px 14px 11px 40px',
            border: '1.5px solid var(--bdr-m)', borderRadius: 12,
            background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: 'var(--ink)', fontSize: 13,
            outline: 'none', fontFamily: 'inherit',
          }}
        />
      </div>

      {/* FILTER TABS */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
        {['all', 'active', 'pending', 'completed', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px', borderRadius: 99, fontSize: 11, fontWeight: 700,
              cursor: 'pointer', border: 'none', whiteSpace: 'nowrap', transition: 'all .2s',
              background: filter === f ? 'var(--green)' : 'var(--surf2)',
              color: filter === f ? '#fff' : 'var(--ink2)',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <div className="sd-card" style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.5)' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
          <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>No orders found</div>
          <div style={{ fontSize: 13, color: 'var(--ink3)', marginBottom: 20 }}>
            {search ? 'Try a different search' : filter !== 'all' ? `No ${filter} orders` : 'Place your first order!'}
          </div>
          <Link href="/student/create-order" className="sd-wallet-btn primary" style={{ display: 'inline-flex', width: 'auto', padding: '10px 24px', textDecoration: 'none' }}>
            Create Order →
          </Link>
        </div>
      ) : (
        <div className="sd-orders-list">
          {filtered.map(o => {
            const sc = STATUS[o.status] ?? { label: o.status, cls: 'pending', icon: '📋' };
            const meta = getMeta(o.title);
            const catName = Array.isArray(o.service_categories) ? o.service_categories[0]?.name : (o.service_categories as any)?.name;
            const runnerName = Array.isArray(o.runner_profile) ? o.runner_profile[0]?.full_name : (o.runner_profile as any)?.full_name;
            return (
              <Link key={o.id} href={`/student/orders/${o.id}`} className="sd-order-row" style={{ textDecoration: 'none' }}>
                <div className="sd-order-row-icon" style={{ background: meta.bg }}>{meta.icon}</div>
                <div className="sd-order-row-info">
                  <div className="sd-order-row-title">{o.title}</div>
                  <div className="sd-order-row-sub">
                    {catName && <span>{catName} · </span>}
                    {runnerName ? `Runner: ${runnerName}` : o.pickup_location}
                  </div>
                </div>
                <div className="sd-order-row-right">
                  <div className="sd-order-row-amt">
                    {o.final_amount > 0 ? `₦${o.final_amount.toLocaleString()}` : '—'}
                  </div>
                  <span className={`sd-badge ${sc.cls}`}>{sc.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}
