'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useEffect } from 'react';

type AuthShellProps = {
  children: ReactNode;
  wide?: boolean;
};

export function AuthShell({ children, wide = false }: AuthShellProps) {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.dataset.theme) html.dataset.theme = 'light';

    const btn = document.getElementById('authThemeBtn');
    const toggle = () => {
      const dark = html.dataset.theme === 'dark';
      html.dataset.theme = dark ? 'light' : 'dark';
      if (btn) btn.textContent = dark ? '🌙' : '☀️';
    };
    btn?.addEventListener('click', toggle);
    return () => btn?.removeEventListener('click', toggle);
  }, []);

  return (
    <div className="auth-shell">
      {/* LEFT */}
      <div className="auth-left">
        <div className="auth-left-content">
          <Link href="/" className="auth-logo">
            <div className="auth-logo-mark">
              <Image src="/Gemini_Generated_Image_a835kka835kka835.png" alt="CampusRunner" width={28} height={28} style={{ borderRadius: 8, objectFit: 'cover' }} />
            </div>
            <span className="auth-logo-word">Campus<b>Runner</b></span>
          </Link>

          <div className="auth-eyebrow">Campus delivery network</div>
          <h1 className="auth-hero-title">
            Your campus errands,<br />
            done <em>while you study.</em>
          </h1>
          <p className="auth-hero-sub">
            CampusRunner connects students who need errands done with fellow students
            who earn completing them. Fast, trusted, always on campus.
          </p>

          <div className="auth-left-stats">
            <div className="auth-stat">
              <div className="auth-stat-value">4,200+</div>
              <div className="auth-stat-label">Active students</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-value">4.9★</div>
              <div className="auth-stat-label">Average rating</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-value">850+</div>
              <div className="auth-stat-label">Campus runners</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-value">8 min</div>
              <div className="auth-stat-label">Avg delivery</div>
            </div>
          </div>

          <div className="auth-left-points">
            <div className="auth-left-point"><span></span>Real-time order tracking</div>
            <div className="auth-left-point"><span></span>Verified student runners</div>
            <div className="auth-left-point"><span></span>Secure wallet payments</div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <button className="auth-theme-btn" id="authThemeBtn" title="Toggle theme">🌙</button>
        <div className={`auth-right-inner${wide ? ' auth-right-wide' : ''}`}>
          <div className="auth-mobile-logo">
            <div className="auth-logo-mark" style={{ background: 'var(--navy)' }}>
              <Image src="/Gemini_Generated_Image_a835kka835kka835.png" alt="CampusRunner" width={22} height={22} style={{ borderRadius: 6, objectFit: 'cover' }} />
            </div>
            <span className="auth-logo-word" style={{ color: 'var(--ink)' }}>
              Campus<b>Runner</b>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
