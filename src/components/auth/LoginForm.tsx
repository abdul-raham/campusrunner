'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { loginSchema } from '@/lib/schemas';
import type { LoginForm } from '@/types/index';
import { Zap, Mail, Lock } from 'lucide-react';
import Image from 'next/image';

export function LoginFormComponent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured) {
        setError('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, then redeploy.');
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: data.email,
          password: data.password,
        }
      );

      if (authError) throw authError;

      // Get user profile to determine role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      const role = profileData?.role || 'student';

      // Redirect based on role
      setTimeout(() => {
        router.push(`/${role}`);
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-lg">
          <Image src="/logo.svg" alt="CampusRunner" width={28} height={28} className="rounded-lg" />
        </div>
        <div>
          <p className="text-lg font-extrabold tracking-tight">CampusRunner</p>
          <p className="-mt-1 text-xs text-[#6B7280]">Campus errands, simplified</p>
        </div>
      </div>

      <h2 className="mb-6 text-2xl font-black">Welcome Back</h2>

      {error && (
        <div ref={errorRef} className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#0B0E11]">Email</label>
        <div className="relative">
          <Mail className="absolute left-4 top-4 h-5 w-5 text-[#6B7280]" />
          <input
            type="email"
            placeholder="your@email.com"
            {...register('email')}
            className="w-full rounded-2xl border border-[#E9E4FF] bg-white/80 py-4 pl-12 pr-4 text-[#0B0E11] backdrop-blur transition focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#0B0E11]">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-4 h-5 w-5 text-[#6B7280]" />
          <input
            type="password"
            placeholder="••••••••"
            {...register('password')}
            className="w-full rounded-2xl border border-[#E9E4FF] bg-white/80 py-4 pl-12 pr-4 text-[#0B0E11] backdrop-blur transition focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
          />
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer rounded-2xl bg-[#6200EE] py-4 font-bold text-white shadow-xl shadow-[#6200EE]/20 transition hover:translate-y-[-2px] hover:bg-[#4F2EE8] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div className="space-y-3 text-center text-sm">
        <p className="text-[#6B7280]">
          Don't have an account?{' '}
          <a href="/signup" className="font-semibold text-[#6200EE] transition hover:text-[#4F2EE8]">
            Sign up
          </a>
        </p>
        <p>
          <a href="#" className="font-semibold text-[#6200EE] transition hover:text-[#4F2EE8]">
            Forgot password?
          </a>
        </p>
      </div>
    </form>
  );
}
