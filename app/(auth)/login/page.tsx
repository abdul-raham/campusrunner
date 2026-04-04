'use client';

import { LoginFormComponent } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="auth-shell">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-mark">
              <img src="/favicon.svg" alt="CR" width={24} height={24} style={{ borderRadius: 8 }} />
            </div>
            <div className="auth-logo-word">
              Campus<b>Runner</b>
            </div>
          </div>
          
          <div className="auth-eyebrow">Campus delivery network</div>
          
          <h1 className="auth-hero-title">
            Your campus errands,<br />
            done <em>while you study.</em>
          </h1>
          
          <p className="auth-hero-sub">
            CampusRunner connects students who need errands done with fellow students who earn completing them. Fast, trusted, always on campus.
          </p>
          
          <div className="auth-left-stats">
            <div className="auth-stat">
              <div className="auth-stat-value">4.2k+</div>
              <div className="auth-stat-label">Students</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-value">850+</div>
              <div className="auth-stat-label">Runners</div>
            </div>
          </div>
          
          <div className="auth-left-points">
            <div className="auth-left-point">
              <span></span>
              Fast delivery across campus
            </div>
            <div className="auth-left-point">
              <span></span>
              Verified student runners
            </div>
            <div className="auth-left-point">
              <span></span>
              Secure payments & tracking
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel */}
      <div className="auth-right">
        <button className="auth-theme-btn" onClick={() => {
          const html = document.documentElement;
          const isDark = html.dataset.theme === 'dark';
          html.dataset.theme = isDark ? 'light' : 'dark';
        }}>
          🌙
        </button>
        
        <div className="auth-mobile-logo">
          <div className="auth-logo-mark">
            <img src="/favicon.svg" alt="CR" width={24} height={24} style={{ borderRadius: 8 }} />
          </div>
          <div className="auth-logo-word">
            Campus<b>Runner</b>
          </div>
        </div>
        
        <div className="auth-right-inner">
          <div className="auth-card">
            <LoginFormComponent />
          </div>
        </div>
      </div>
    </div>
  );
}