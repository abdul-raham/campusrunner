'use client';

import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import PageLoader from '@/components/PageLoader';
import '../runner.css';

export default function RunnerNotificationsPage() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filtered = notifications.filter(n =>
    filter === 'all' ? true : filter === 'unread' ? !n.is_read : n.is_read
  );

  function getIcon(title: string) {
    if (title.includes('Approved') || title.includes('approved')) return '✅';
    if (title.includes('Suspended') || title.includes('suspended')) return '⏸️';
    if (title.includes('Rejected') || title.includes('rejected')) return '❌';
    if (title.includes('Job') || title.includes('order')) return '💼';
    return '🔔';
  }

  function getIconBg(title: string) {
    if (title.includes('Approved')) return 'rgba(22,163,74,.1)';
    if (title.includes('Suspended')) return 'rgba(217,119,6,.1)';
    if (title.includes('Rejected')) return 'rgba(220,38,38,.08)';
    return 'rgba(212,175,55,.12)';
  }

  if (loading) return <PageLoader />;

  return (
    <div className="sd-content" style={{ animation: 'fadeIn .4s ease both' }}>

      <div className="sd-section-head">
        <div>
          <div className="sd-section-title" style={{ fontSize: 20 }}>Notifications</div>
          {unreadCount > 0 && (
            <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>{unreadCount} unread</div>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', background: 'var(--ok-bg)', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer' }}
          >
            Mark all read
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {(['all', 'unread', 'read'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: 99, fontSize: 12, fontWeight: 700,
            cursor: 'pointer', border: 'none', transition: 'all .2s',
            background: filter === f ? 'var(--green)' : 'var(--surf2)',
            color: filter === f ? '#fff' : 'var(--ink2)',
          }}>
            {f === 'all' ? `All (${notifications.length})` : f === 'unread' ? `Unread (${unreadCount})` : `Read (${notifications.length - unreadCount})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="sd-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔕</div>
          <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
            {filter === 'unread' ? 'All caught up!' : 'No notifications'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink3)' }}>
            {filter === 'unread' ? 'No unread notifications' : "You'll be notified about job updates here"}
          </div>
        </div>
      ) : (
        <div className="sd-card" style={{ padding: 0, overflow: 'hidden' }}>
          {filtered.map((n, i) => (
            <div key={n.id} onClick={() => !n.is_read && markAsRead(n.id)} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '14px 18px',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--bdr)' : 'none',
              background: n.is_read ? 'transparent' : 'rgba(212,175,55,.04)',
              cursor: n.is_read ? 'default' : 'pointer',
              transition: 'background .15s',
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: getIconBg(n.title), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {getIcon(n.title)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <div style={{ fontSize: 13, fontWeight: n.is_read ? 600 : 800, color: 'var(--ink)' }}>{n.title}</div>
                  {!n.is_read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.5, marginBottom: 4 }}>{n.message}</div>
                <div style={{ fontSize: 10, color: 'var(--ink3)' }}>
                  {new Date(n.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })} ·{' '}
                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {!n.is_read && <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold-d)', flexShrink: 0, marginTop: 2 }}>Tap to read</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
