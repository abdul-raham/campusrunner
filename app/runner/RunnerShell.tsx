'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import './runner.css';

const navItems = [
  { name: 'Dashboard', href: '/runner', icon: '⊞' },
  { name: 'Jobs', href: '/runner/jobs', icon: '💼' },
  { name: 'Active Jobs', href: '/runner/jobs/active', icon: '🏃' },
  { name: 'Earnings', href: '/runner/earnings', icon: '💰' },
  { name: 'Profile', href: '/runner/profile', icon: '👤' },
];

export default function RunnerShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, profile, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const notifRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  const initials =
    profile?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'RN';
  const avatarUrl = (profile as any)?.avatar_url as string | undefined;

  function getHour() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = async () => {
    try { await logout(); router.push('/login'); } catch {}
  };

  const pageTitle = navItems.find(n => n.href === pathname)?.name || 'Dashboard';

  return (
    <div className="sd-shell">
      <div className={`sd-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sd-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sd-logo">
          <div className="sd-logo-img">
            <Image src="/Gemini_Generated_Image_a835kka835kka835.png" alt="CampusRunner" width={38} height={38} style={{ objectFit: 'cover', borderRadius: 12 }} />
          </div>
          <div>
            <div className="sd-logo-word">Campus<b>Runner</b></div>
            <div className="sd-logo-sub">Runner Portal</div>
          </div>
        </div>

        <nav className="sd-nav">
          <div className="sd-nav-section">Runner</div>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`sd-nav-item${active ? ' active' : ''}`} onClick={() => setSidebarOpen(false)}>
                <div className="sd-nav-icon">{item.icon}</div>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="sd-user">
          <div className="sd-user-card" onClick={handleLogout} title="Sign out">
            <div className="sd-avatar" style={{ overflow: 'hidden' }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials}
            </div>
            <div>
              <div className="sd-user-name">{profile?.full_name || 'Runner'}</div>
              <div className="sd-user-role">Sign out</div>
            </div>
            <div className="sd-user-arrow">↗</div>
          </div>
        </div>
      </aside>

      <main className="sd-main">
        <header className="sd-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="sd-hamburger" onClick={() => setSidebarOpen(true)}>
              <span /><span /><span />
            </div>
            <div className="sd-header-left">
              <div className="sd-greeting">
                {pathname === '/runner' ? `${getHour()}, ${firstName} 👋` : pageTitle}
              </div>
              <div className="sd-greeting-sub">
                {(profile as any)?.university || 'Campus'} · Runner
              </div>
            </div>
          </div>
          <div className="sd-header-right">
            <button className="sd-theme-btn" onClick={() => setDark(d => !d)} title="Toggle theme">
              {dark ? '☀️' : '🌙'}
            </button>
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button className="sd-icon-btn" onClick={() => setNotifOpen(v => !v)}>
                🔔
                {unreadCount > 0 && (
                  <div style={{ position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, padding: '0 4px', background: 'var(--gold)', borderRadius: 99, fontSize: 9, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surf)' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </button>
              {notifOpen && (
                <div className="sd-notif-modal">
                  <div className="sd-notif-modal-head">
                    <span className="sd-section-title">Notifications</span>
                    {unreadCount > 0 && (
                      <button className="sd-section-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => markAllAsRead()}>Mark all read</button>
                    )}
                  </div>
                  <div className="sd-notif-list">
                    {notifications.length === 0 ? (
                      <div className="sd-notif-empty"><div style={{ fontSize: 28, marginBottom: 8 }}>🔔</div><div>No notifications yet</div></div>
                    ) : notifications.slice(0, 8).map(n => (
                      <div key={n.id} className={`sd-notif-item${n.is_read ? '' : ' unread'}`} onClick={() => !n.is_read && markAsRead(n.id)}>
                        <div className="sd-notif-item-dot" />
                        <div className="sd-notif-item-body">
                          <div className="sd-notif-item-title">{n.title}</div>
                          <div className="sd-notif-item-msg">{n.message}</div>
                          <div className="sd-notif-item-time">{new Date(n.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="sd-notif-modal-footer">You’re all caught up</div>
                </div>
              )}
            </div>
            <div className="sd-header-avatar" style={{ overflow: 'hidden' }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials}
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
