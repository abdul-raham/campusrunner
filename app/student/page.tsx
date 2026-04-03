'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { orderService, profileService, categoryService } from '@/services/api';
import { supabase } from '@/lib/supabase';
import type { Order, ServiceCategory } from '@/types';
import PageLoader from '@/components/PageLoader';
import './student.css';

const SERVICE_ICONS: Record<string, { icon: string; bg: string }> = {
  food:     { icon: '🍔', bg: 'rgba(217,119,6,.1)' },
  laundry:  { icon: '👕', bg: 'rgba(15,61,46,.1)' },
  market:   { icon: '🛒', bg: 'rgba(212,175,55,.12)' },
  delivery: { icon: '📦', bg: 'rgba(99,102,241,.1)' },
  printing: { icon: '🖨️', bg: 'rgba(236,72,153,.1)' },
  gas:      { icon: '⛽', bg: 'rgba(239,68,68,.1)' },
  pharmacy: { icon: '💊', bg: 'rgba(16,185,129,.1)' },
  errand:   { icon: '🔧', bg: 'rgba(107,114,128,.1)' },
};

function getServiceMeta(name: string) {
  const key = name?.toLowerCase().split(' ')[0] ?? '';
  return SERVICE_ICONS[key] ?? { icon: '📋', bg: 'rgba(107,114,128,.1)' };
}

function statusBadgeClass(status: string) {
  if (status === 'delivered' || status === 'completed') return 'delivered';
  if (status === 'accepted' || status === 'in_progress') return 'active';
  return 'pending';
}

function waLink(phone: string) {
  const clean = phone.replace(/\D/g, '');
  const num = clean.startsWith('0') ? '234' + clean.slice(1) : clean;
  return `https://wa.me/${num}`;
}

const progressMap: Record<string, number> = {
  pending: 20, accepted: 50, in_progress: 75, delivered: 100, completed: 100,
};

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [runnerPhones, setRunnerPhones] = useState<Record<string, string>>({});
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      orderService.getOrdersByStudent(user.id),
      categoryService.getCategories(),
    ]).then(async ([fetchedOrders, fetchedCats]) => {
      setOrders(fetchedOrders);
      setCategories(fetchedCats || []);
      const runnerIds = [...new Set(fetchedOrders.filter(o => o.runner_id).map(o => o.runner_id as string))];
      const phones: Record<string, string> = {};
      await Promise.all(runnerIds.map(async (rid) => {
        const p = await profileService.getProfile(rid);
        if (p?.phone) phones[rid] = p.phone;
      }));
      setRunnerPhones(phones);
    }).finally(() => setPageLoading(false));
  }, [user]);

  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [showWallet, setShowWallet] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('wallets').select('balance').or(`user_id.eq.${user.id},student_id.eq.${user.id}`).maybeSingle()
      .then(({ data }) => { setWalletBalance(data?.balance ?? 0); });
  }, [user]);

  const activeOrders  = orders.filter(o => ['pending','accepted','in_progress'].includes(o.status));
  const recentOrders  = orders.slice(0, 5);
  const totalSpent    = orders.filter(o => ['delivered','completed'].includes(o.status)).reduce((s, o) => s + (o.final_amount || 0), 0);
  const trackedOrder  = activeOrders[0] ?? null;

  if (pageLoading) return <PageLoader />;

  return (
    <div className="sd-content">

      {/* WALLET CARD */}
      <div className="sd-wallet">
        <div className="sd-wallet-top">
          <div>
            <div className="sd-wallet-label">Campus Wallet</div>
            <div className="sd-wallet-amount" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <sup>₦</sup>{showWallet ? (walletBalance !== null ? walletBalance.toLocaleString() : '—') : '• • • • •'}
              <button
                onClick={() => setShowWallet(v => !v)}
                style={{ background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', fontSize: 15, flexShrink: 0 }}
              >
                {showWallet ? '👁' : '🙈'}
              </button>
            </div>
            <div className="sd-wallet-change">Manage your balance</div>
          </div>
          <div className="sd-wallet-badge">● Active</div>
        </div>
        <div className="sd-wallet-actions">
          <Link href="/student/wallet" className="sd-wallet-btn primary">＋ Fund Wallet</Link>
          <Link href="/student/create-order" className="sd-wallet-btn ghost">New Order →</Link>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <div className="sd-section-head">
          <div className="sd-section-title">Quick Order</div>
          <Link href="/student/create-order" className="sd-section-link">See all →</Link>
        </div>
        <div className="sd-quick-grid">
          {categories.map((cat) => {
            const meta = getServiceMeta(cat.name);
            return (
              <Link key={cat.id} href={`/student/create-order?category=${cat.id}`} className="sd-quick-card">
                <div className="sd-quick-icon" style={{ background: meta.bg }}>{meta.icon}</div>
                <div className="sd-quick-name">{cat.name}</div>
                <div className="sd-quick-sub">₦{cat.base_price}+</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* TWO COL */}
      <div className="sd-two-col">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ACTIVE ORDER TRACKER */}
          {trackedOrder ? (
            <div className="sd-card">
              <div className="sd-section-head">
                <div className="sd-section-title">Active Order</div>
                <Link href="/student/orders" className="sd-section-link">View all →</Link>
              </div>
              <div className="sd-order-header">
                <div className="sd-order-icon">{getServiceMeta(trackedOrder.title).icon}</div>
                <div>
                  <div className="sd-order-title">{trackedOrder.title}</div>
                  <div className="sd-order-eta">
                    {trackedOrder.status === 'pending' ? 'Finding runner…'
                      : trackedOrder.status === 'accepted' ? 'Runner assigned'
                      : 'In progress'}
                  </div>
                </div>
              </div>
              <div className="sd-progress-track">
                <div className="sd-progress-fill" style={{ '--progress': `${progressMap[trackedOrder.status] ?? 20}%` } as React.CSSProperties} />
              </div>
              <div className="sd-steps">
                {[
                  { label: 'Order placed',    done: true },
                  { label: 'Runner assigned', done: ['accepted','in_progress','delivered','completed'].includes(trackedOrder.status), active: trackedOrder.status === 'accepted' },
                  { label: 'In progress',     done: ['in_progress','delivered','completed'].includes(trackedOrder.status), active: trackedOrder.status === 'in_progress' },
                  { label: 'Delivered',       done: ['delivered','completed'].includes(trackedOrder.status) },
                ].map((step) => {
                  const state = step.done ? 'done' : step.active ? 'active' : 'pending';
                  return (
                    <div key={step.label} className="sd-step">
                      <div className={`sd-step-dot ${state}`}>{state === 'done' ? '✓' : state === 'active' ? '→' : '○'}</div>
                      <span className={`sd-step-label ${state}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>
              {trackedOrder.runner_id && runnerPhones[trackedOrder.runner_id] && (
                <div className="sd-runner-chip">
                  <div className="sd-runner-av">RN</div>
                  <div>
                    <div className="sd-runner-name">Your Runner</div>
                    <div className="sd-runner-rating">Tap to message on WhatsApp</div>
                  </div>
                  <a href={waLink(runnerPhones[trackedOrder.runner_id])} target="_blank" rel="noopener noreferrer" className="sd-runner-msg">
                    WhatsApp
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="sd-card" style={{ textAlign: 'center', padding: '32px 22px' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
              <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>No active orders</div>
              <div style={{ fontSize: 13, color: 'var(--ink3)', marginBottom: 18 }}>Place an order and track it live here</div>
              <Link href="/student/create-order" className="sd-wallet-btn primary" style={{ display: 'inline-flex', width: 'auto', padding: '10px 24px' }}>
                Create Order →
              </Link>
            </div>
          )}

          {/* RECENT ORDERS */}
          <div className="sd-card">
            <div className="sd-section-head">
              <div className="sd-section-title">Recent Orders</div>
              <Link href="/student/orders" className="sd-section-link">View all →</Link>
            </div>
            {recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--ink3)', fontSize: 13 }}>No orders yet</div>
            ) : (
              <div className="sd-orders-list">
                {recentOrders.map((o) => {
                  const meta = getServiceMeta(o.title);
                  return (
                    <Link key={o.id} href={`/student/orders/${o.id}`} className="sd-order-row">
                      <div className="sd-order-row-icon" style={{ background: meta.bg }}>{meta.icon}</div>
                      <div className="sd-order-row-info">
                        <div className="sd-order-row-title">{o.title}</div>
                        <div className="sd-order-row-sub">{o.pickup_location} → {o.delivery_location}</div>
                      </div>
                      <div className="sd-order-row-right">
                        <div className="sd-order-row-amt">₦{o.final_amount?.toLocaleString() ?? '—'}</div>
                        <span className={`sd-badge ${statusBadgeClass(o.status)}`}>{o.status.replace('_', ' ')}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="sd-stats-col">
          {[
            { icon: '📦', bg: 'rgba(15,61,46,.1)',    val: String(orders.length),       lbl: 'Total orders' },
            { icon: '⚡', bg: 'rgba(217,119,6,.1)',   val: String(activeOrders.length), lbl: 'Active orders' },
            { icon: '💸', bg: 'rgba(212,175,55,.12)', val: `₦${totalSpent.toLocaleString()}`, lbl: 'Total spent' },
            { icon: '✅', bg: 'rgba(16,185,129,.1)',  val: String(orders.filter(o => ['delivered','completed'].includes(o.status)).length), lbl: 'Completed' },
          ].map((s) => (
            <div key={s.lbl} className="sd-stat-card">
              <div className="sd-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div>
                <div className="sd-stat-val">{s.val}</div>
                <div className="sd-stat-lbl">{s.lbl}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
