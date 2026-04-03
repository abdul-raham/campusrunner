'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-8 gap-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(0,214,143,0.15)', border: '1px solid var(--emerald)' }}
        >
          <CheckCircle2 size={32} className="text-[var(--emerald)]" />
        </motion.div>
        <div className="text-center">
          <p className="font-display font-bold text-[var(--text-primary)] text-lg">Welcome back!</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">Redirecting you now...</p>
        </div>
        <div className="w-6 h-6 rounded-full border-2 border-[var(--blue-vivid)] border-t-transparent animate-spin" />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="logo-mark w-14 h-14 text-lg mx-auto mb-4"
        >
          CR
        </motion.div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Sign in</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Access your CampusRunner account</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="section-label block mb-2">Email</label>
          <div className="input-wrapper">
            <Mail size={16} className="input-icon" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="section-label">Password</label>
            <Link href="/forgot-password" className="text-xs hover:underline" style={{ color: 'var(--blue-vivid)' }}>
              Forgot?
            </Link>
          </div>
          <div className="input-wrapper">
            <Lock size={16} className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
              style={{ paddingRight: 44 }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="badge badge-error w-full justify-center py-3"
              style={{ borderRadius: 12 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full mt-2"
          style={{ opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <>Sign In <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-[var(--border)]">
        <p className="text-center text-sm text-[var(--text-muted)] mb-3">Don't have an account?</p>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/student-signup" className="btn-ghost text-sm text-center" style={{ justifyContent: 'center' }}>
            As Student
          </Link>
          <Link href="/runner-signup" className="btn-ghost text-sm text-center" style={{ justifyContent: 'center', color: 'var(--amber)' }}>
            As Runner ⚡
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
