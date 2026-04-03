'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { AuthShell } from '@/components/auth/AuthShell';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="auth-card">
        {!success ? (
          <>
            <div className="auth-card-header">
              <h2 className="auth-title">Forgot password?</h2>
              <p className="auth-sub">Enter your email and we will send a reset link.</p>
            </div>

            {error && <div className="auth-alert error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div>
                <label className="auth-label">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`input-glass${error ? ' input-error' : ''}`}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="primary-button">
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>

            <div style={{ marginTop: 18, textAlign: 'center' }} className="auth-muted">
              <Link href="/login" className="auth-link">
                Back to sign in
              </Link>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div className="auth-alert success">Check your email for the reset link.</div>
            <p className="auth-sub" style={{ marginTop: 12 }}>
              We sent a password reset link to <strong>{email}</strong>.
            </p>
            <div style={{ marginTop: 18 }}>
              <Link href="/login" className="auth-link">
                Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
