'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginDemoUser } from '@/src/lib/demo-auth';
import { BrandMark } from '@/components/ui/BrandMark';

export function LoginFormComponent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = loginDemoUser(email, password);
      router.push(`/${user.role}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      <div className="text-center">
        <div className="mx-auto mb-4 w-fit"><BrandMark className="h-14 w-14" /></div>
        <h1 className="text-3xl font-black tracking-tight text-[#0B0E11]">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Login to your CampusRunner account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-600">Email</span>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required className="w-full rounded-2xl border border-[#E9E4FF] bg-white px-11 py-3.5 outline-none ring-0 transition focus:border-[#6200EE]" placeholder="student@school.edu" />
          </div>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-600">Password</span>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type={showPassword ? 'text':'password'} required className="w-full rounded-2xl border border-[#E9E4FF] bg-white px-11 py-3.5 pr-12 outline-none transition focus:border-[#6200EE]" placeholder="Enter password" />
            <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
            </button>
          </div>
        </label>

        <motion.button whileTap={{scale:0.98}} whileHover={{scale:1.01}} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#6200EE,#4F2EE8)] px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-500/20 disabled:opacity-60">
          {loading ? 'Signing in...' : 'Login'} <ArrowRight className="h-4 w-4" />
        </motion.button>
      </form>

      <div className="rounded-2xl border border-[#E9E4FF] bg-[#F8F9FE] p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Demo admin access</p>
        <p className="mt-1">admin@campusrunner.app / admin123</p>
      </div>

      <p className="text-center text-sm text-slate-500">
        Need an account? <Link href="/signup" className="font-semibold text-[#6200EE]">Choose signup type</Link>
      </p>
    </div>
  );
}
