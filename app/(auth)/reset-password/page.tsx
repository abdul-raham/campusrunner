'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
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
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!isValidSession && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F6F7FB] via-white to-[#F0EBFF] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin h-12 w-12 border-4 border-[#6200EE] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[#6B7280]">Verifying reset link...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F7FB] via-white to-[#F0EBFF] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-[28px] border border-[#E9E4FF] bg-white p-8 shadow-lg">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-lg">
              <Image src="/logo.png" alt="CampusRunner" width={28} height={28} className="rounded-lg" />
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight">CampusRunner</p>
              <p className="-mt-1 text-xs text-[#6B7280]">Campus errands, simplified</p>
            </div>
          </div>

          {!success ? (
            <>
              <h1 className="text-2xl font-black text-[#0B0E11] mb-2">Reset Password</h1>
              <p className="text-sm text-[#6B7280] mb-6">
                Enter your new password below.
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0B0E11]">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-[#6B7280]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-[#E9E4FF] bg-white/80 py-4 pl-12 pr-12 text-[#0B0E11] backdrop-blur transition focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-[#6B7280] hover:text-[#6200EE]"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0B0E11]">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-[#6B7280]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-2xl border border-[#E9E4FF] bg-white/80 py-4 pl-12 pr-4 text-[#0B0E11] backdrop-blur transition focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#6200EE] py-4 font-bold text-white shadow-xl shadow-[#6200EE]/20 transition hover:translate-y-[-2px] hover:bg-[#4F2EE8] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Resetting...' : (
                    <>
                      Reset Password
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <Link
                href="/login"
                className="mt-6 block text-center text-sm font-semibold text-[#6200EE] transition hover:text-[#4F2EE8]"
              >
                Back to Login
              </Link>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 mx-auto">
                <span className="text-2xl">✓</span>
              </div>
              <h2 className="text-2xl font-black text-[#0B0E11] mb-2">Password Reset!</h2>
              <p className="text-sm text-[#6B7280] mb-6">
                Your password has been successfully reset. Redirecting to login...
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
