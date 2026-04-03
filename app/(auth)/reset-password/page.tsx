'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { AuthShell } from '@/components/auth/AuthShell';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      } else {
        setError('Invalid or expired reset link. Please request a new one.');
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="auth-card">
        {!isValidSession && !error ? (
          <div style={{ textAlign: 'center' }} className="auth-muted">
            Verifying reset link…
          </div>
        ) : (
          <>
            <div className="auth-card-header">
              <h2 className="auth-title">Reset password</h2>
              <p className="auth-sub">Enter your new password below.</p>
            </div>

            {error && <div className="auth-alert error">{error}</div>}
            {success && <div className="auth-alert success">Password updated. Redirecting…</div>}

            {!success && (
              <form onSubmit={handleSubmit} className="auth-form">
                <div>
                  <label className="auth-label">New password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`input-glass${error ? ' input-error' : ''}`}
                    required
                  />
                </div>

                <div>
                  <label className="auth-label">Confirm password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`input-glass${error ? ' input-error' : ''}`}
                    required
                  />
                </div>

                <button type="submit" disabled={loading} className="primary-button">
                  {loading ? 'Resetting…' : 'Reset password'}
                </button>
              </form>
            )}

            <div style={{ marginTop: 18, textAlign: 'center' }} className="auth-muted">
              <Link href="/login" className="auth-link">
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthShell>
  );
}
