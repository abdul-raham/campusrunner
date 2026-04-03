'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const router = useRouter();

  const canSubmit = useMemo(
    () => formData.email.trim().length > 0 && formData.password.trim().length > 0,
    [formData.email, formData.password]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (loginError) throw loginError;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role === 'runner') router.push('/runner');
        else if (profile?.role === 'student') router.push('/student');
        else if (profile?.role === 'admin') router.push('/admin');
        else router.push('/student');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <AuthShell>
      <div className="auth-card auth-animate">
        <div className="auth-card-header auth-animate auth-delay-1">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-sub">Sign in to continue managing your campus errands.</p>
        </div>

        {error && <div className="auth-alert error auth-animate auth-delay-2">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form auth-animate auth-delay-2">
          <div>
            <label htmlFor="email" className="auth-label">Email address</label>
            <div className="input-wrap">
              <span className="input-icon"><Mail size={15} /></span>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`input-glass${error ? ' input-error' : ''}`}
                placeholder="you@university.edu"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <div className="auth-row">
              <label htmlFor="password" className="auth-label">Password</label>
              <Link href="/forgot-password" className="auth-link" style={{ fontSize: 12 }}>
                Forgot password?
              </Link>
            </div>
            <div className="input-wrap">
              <span className="input-icon"><Lock size={15} /></span>
              <input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className={`input-glass${error ? ' input-error' : ''}`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-pw-toggle"
                onClick={() => setShowPw((v) => !v)}
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading || !canSubmit} className="primary-button">
            {isLoading ? <span className="btn-spinner" /> : null}
            {isLoading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <div className="auth-divider auth-animate auth-delay-3" style={{ marginTop: 20 }}>or</div>

        <p className="auth-muted auth-animate auth-delay-4" style={{ textAlign: 'center', marginTop: 16 }}>
          New to CampusRunner?{' '}
          <Link href="/signup" className="auth-link">Create an account</Link>
        </p>
      </div>
    </AuthShell>
  );
}
