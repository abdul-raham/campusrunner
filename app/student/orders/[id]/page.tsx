'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import PageLoader from '@/components/PageLoader';
import '../../student.css';

interface OrderDetails {
  id: string;
  title: string;
  description: string;
  status: string;
  final_amount: number;
  budget_amount: number;
  urgency_level: string;
  created_at: string;
  accepted_at: string | null;
  completed_at: string | null;
  pickup_location: string;
  delivery_location: string;
  service_category_id: string;
  runner_id: string | null;
  order_items: { id: string; item_name: string; quantity: number }[];
  service_categories: { name: string } | null;
  runner_profile: { full_name: string; phone: string } | null;
}

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  pending:     { label: 'Finding Runner',  color: 'var(--warn)',  bg: 'var(--warn-bg)',  icon: '🔍' },
  accepted:    { label: 'Runner Assigned', color: '#3b82f6',      bg: 'rgba(59,130,246,.1)', icon: '✅' },
  in_progress: { label: 'On the Way',      color: 'var(--gold-d)', bg: 'rgba(212,175,55,.12)', icon: '🚀' },
  completed:   { label: 'Delivered',       color: 'var(--ok)',    bg: 'var(--ok-bg)',    icon: '📦' },
  cancelled:   { label: 'Cancelled',       color: 'var(--err)',   bg: 'var(--err-bg)',   icon: '✕' },
};

const TIMELINE = [
  { key: 'created',     label: 'Order Placed',    timeKey: 'created_at' },
  { key: 'accepted',    label: 'Runner Assigned',  timeKey: 'accepted_at' },
  { key: 'in_progress', label: 'In Progress',      timeKey: null },
  { key: 'completed',   label: 'Delivered',        timeKey: 'completed_at' },
];

function waLink(phone: string) {
  const clean = phone.replace(/\D/g, '');
  const num = clean.startsWith('0') ? '234' + clean.slice(1) : clean;
  return `https://wa.me/${num}`;
}

function fmt(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function stepDone(order: OrderDetails, key: string) {
  const order_statuses = ['pending', 'accepted', 'in_progress', 'completed'];
  const cur = order_statuses.indexOf(order.status);
  const tgt = order_statuses.indexOf(key);
  if (key === 'created') return true;
  return cur >= tgt;
}

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch();
    const t = setInterval(fetch, 20000);
    return () => clearInterval(t);
  }, [id]);

  async function fetch() {
    try {
      const { data: o, error } = await supabase.from('orders').select('*').eq('id', id).single();
      if (error || !o) { setOrder(null); return; }

      const [{ data: cat }, { data: runner }, { data: items }] = await Promise.all([
        o.service_category_id
          ? supabase.from('service_categories').select('name').eq('id', o.service_category_id).single()
          : Promise.resolve({ data: null }),
        o.runner_id
          ? supabase.from('profiles').select('full_name, phone').eq('id', o.runner_id).single()
          : Promise.resolve({ data: null }),
        supabase.from('order_items').select('id, item_name, quantity').eq('order_id', id),
      ]);

      setOrder({ ...o, service_categories: cat, runner_profile: runner, order_items: items || [] });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  if (loading) return <PageLoader />;

  if (!order) return (
    <div className="sd-content" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
      <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>Order not found</div>
      <Link href="/student/orders" className="sd-section-link">← Back to Orders</Link>
    </div>
  );

  const meta = STATUS_META[order.status] ?? STATUS_META.pending;
  const runnerInitials = order.runner_profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'RN';

  return (
    <div className="sd-content" style={{ animation: 'fadeIn .4s ease both' }}>

      {/* BACK + TITLE */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <Link href="/student/orders" style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, textDecoration: 'none', color: 'var(--ink)', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
          ←
        </Link>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em', lineHeight: 1.2 }}>{order.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: meta.bg, color: meta.color }}>
              {meta.icon} {meta.label}
            </span>
            {order.service_categories?.name && (
              <span style={{ fontSize: 11, color: 'var(--ink3)', fontWeight: 600 }}>· {order.service_categories.name}</span>
            )}
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div style={{ background: 'rgba(255,255,255,.65)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', border: '1px solid rgba(255,255,255,.55)', borderRadius: 20, padding: 22, boxShadow: '0 4px 16px rgba(0,0,0,.06)' }}>
        <div className="sd-section-title" style={{ marginBottom: 20 }}>Order Status</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {TIMELINE.map((step, i) => {
            const done = stepDone(order, step.key);
            const active = order.status === step.key;
            const time = step.timeKey ? fmt((order as any)[step.timeKey]) : null;
            return (
              <div key={step.key} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                {/* dot + line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, flexShrink: 0, transition: 'all .3s',
                    background: done ? (active ? 'var(--gold)' : 'var(--green)') : 'var(--surf3)',
                    color: done ? '#fff' : 'var(--ink3)',
                    boxShadow: active ? '0 0 0 5px rgba(212,175,55,.2)' : 'none',
                  }}>
                    {done && !active ? '✓' : i + 1}
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 28, background: done ? 'var(--green)' : 'var(--surf3)', margin: '3px 0', borderRadius: 2, transition: 'background .3s' }} />
                  )}
                </div>
                {/* label */}
                <div style={{ paddingBottom: i < TIMELINE.length - 1 ? 20 : 0, paddingTop: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: active ? 800 : done ? 700 : 500, color: done ? 'var(--ink)' : 'var(--ink3)', transition: 'all .3s' }}>
                    {step.label}
                    {active && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: 'var(--gold-d)', background: 'rgba(212,175,55,.12)', padding: '2px 8px', borderRadius: 99 }}>Current</span>}
                  </div>
                  {time && <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>{time}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ITEMS */}
      {order.order_items.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,.65)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', border: '1px solid rgba(255,255,255,.55)', borderRadius: 20, padding: 22, boxShadow: '0 4px 16px rgba(0,0,0,.06)' }}>
          <div className="sd-section-title" style={{ marginBottom: 14 }}>Items</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {order.order_items.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--surf2)', borderRadius: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(212,175,55,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'var(--gold-d)', flexShrink: 0 }}>
                  ×{item.quantity}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{item.item_name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOCATIONS */}
      <div style={{ background: 'rgba(255,255,255,.65)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', border: '1px solid rgba(255,255,255,.55)', borderRadius: 20, padding: 22, boxShadow: '0 4px 16px rgba(0,0,0,.06)' }}>
        <div className="sd-section-title" style={{ marginBottom: 16 }}>Locations</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: '📍', label: 'Pickup', val: order.pickup_location },
            { icon: '🏠', label: 'Delivery', val: order.delivery_location },
          ].map(loc => (
            <div key={loc.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--surf2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{loc.icon}</div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{loc.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{loc.val || '—'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RUNNER */}
      <div style={{ background: 'rgba(255,255,255,.65)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', border: '1px solid rgba(255,255,255,.55)', borderRadius: 20, padding: 22, boxShadow: '0 4px 16px rgba(0,0,0,.06)' }}>
        <div className="sd-section-title" style={{ marginBottom: 14 }}>Runner</div>
        {order.runner_profile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,var(--green),var(--green-s))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
              {runnerInitials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>{order.runner_profile.full_name}</div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>Campus Runner</div>
            </div>
            <a
              href={waLink(order.runner_profile.phone)}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 12, background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}
            >
              💬 WhatsApp
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', background: 'var(--warn-bg)', border: '1px solid rgba(217,119,6,.2)', borderRadius: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(217,119,6,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🔍</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--warn)' }}>Looking for a runner</div>
              <div style={{ fontSize: 12, color: 'var(--warn)', opacity: .8, marginTop: 2 }}>A runner will be assigned shortly</div>
            </div>
          </div>
        )}
      </div>

      {/* AMOUNT */}
      <div style={{ background: 'linear-gradient(135deg,var(--green) 0%,var(--green-s) 60%,var(--green-t) 100%)', borderRadius: 20, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 8px 32px rgba(15,61,46,.25)' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Total Amount</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-.03em', lineHeight: 1 }}>
            ₦{(order.final_amount || order.budget_amount || 0).toLocaleString()}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Urgency</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: order.urgency_level === 'urgent' ? 'var(--gold-l)' : 'rgba(255,255,255,.8)', textTransform: 'capitalize' }}>
            {order.urgency_level === 'urgent' ? '⚡ Urgent' : '🕐 Normal'}
          </div>
        </div>
      </div>

      {/* DESCRIPTION / NOTES */}
      {order.description && (
        <div style={{ background: 'rgba(255,255,255,.65)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', border: '1px solid rgba(255,255,255,.55)', borderRadius: 20, padding: 22, boxShadow: '0 4px 16px rgba(0,0,0,.06)' }}>
          <div className="sd-section-title" style={{ marginBottom: 10 }}>Description</div>
          <div style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.6 }}>{order.description}</div>
        </div>
      )}

    </div>
  );
}
