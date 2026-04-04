'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function LoginFormComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) { setError(authError.message); setIsLoading(false); return; }
      if (!data.user) { setError('Login failed'); setIsLoading(false); return; }

      setSuccess(true);

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const role = profile?.role || 'student';
      setTimeout(() => { window.location.replace(`/${role}`); }, 1800);
    } catch {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: 'rgba(22,163,74,0.1)', border: '1px solid var(--ok)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 32,
        }}>
          ✓
        </div>
        <h3 className="auth-title" style={{ fontSize: 18, marginBottom: 8 }}>Welcome back!</h3>
        <p className="auth-sub" style={{ marginBottom: 20 }}>Redirecting you now...</p>
        <div style={{
          width: 20, height: 20, margin: '0 auto',
          border: '2.5px solid rgba(201,149,42,0.3)',
          borderTopColor: 'var(--gold)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div>
      <div className="auth-card-header">
        <h1 className="auth-title">Sign in</h1>
        <p className="auth-sub">Access your CampusRunner account</p>
      </div>

      {error && (
        <div className="auth-alert error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label className="auth-label">Email</label>
          <div className="input-wrap">
            <Mail size={16} className="input-icon" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input-glass"
              required
            />
          </div>
        </div>

        <div>
          <div className="auth-row">
            <label className="auth-label">Password</label>
            <Link href="/forgot-password" className="auth-link" style={{ fontSize: 12 }}>
              Forgot?
            </Link>
          </div>
          <div className="input-wrap">
            <Lock size={16} className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-glass"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="input-pw-toggle"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="primary-button"
        >
          {isLoading ? (
            <div className="btn-spinner" />
          ) : (
            <>Sign In <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      <div className="auth-divider">Don't have an account?</div>
      
      <div className="auth-choice-grid">
        <Link href="/student-signup" className="auth-choice-card" style={{ textAlign: 'center', padding: 16 }}>
          <div className="auth-choice-title" style={{ fontSize: 14, marginBottom: 4 }}>As Student</div>
          <div className="auth-choice-text" style={{ fontSize: 12 }}>Order errands</div>
        </Link>
        <Link href="/runner-signup" className="auth-choice-card" style={{ textAlign: 'center', padding: 16 }}>
          <div className="auth-choice-title" style={{ fontSize: 14, marginBottom: 4, color: 'var(--gold)' }}>As Runner ⚡</div>
          <div className="auth-choice-text" style={{ fontSize: 12 }}>Earn money</div>
        </Link>
      </div>
    </div>
  );
}
