'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';

export function LoginFormComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        // Get user profile to determine role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        // Redirect based on role
        const role = profile?.role || 'student';
        if (role === 'student') {
          router.push('/student/dashboard');
        } else if (role === 'runner') {
          router.push('/runner/dashboard');
        } else {
          router.push('/admin/dashboard');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-xl border border-[#E9E4FF]"
        >
          <Image src="/logo.png" alt="CampusRunner" width={36} height={36} className="rounded-2xl" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-[#6200EE] to-[#03DAC5] bg-clip-text text-transparent mb-2">
            Welcome back
          </h1>
          <p className="text-base text-[#6B7280] font-medium">
            Sign in to continue your campus journey
          </p>
        </motion.div>
      </div>

      <motion.form 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
          >
            {error}
          </motion.div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-wider text-[#374151] flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address
          </label>
          <div className="relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-white/80 py-4 px-5 text-sm font-medium backdrop-blur transition-all duration-300 focus:border-[#6200EE] focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-[#6200EE]/10"
              placeholder="your.email@university.edu"
              required
            />
            <motion.div
              initial={false}
              animate={{
                scale: focusedField === 'email' ? 1 : 0,
                opacity: focusedField === 'email' ? 1 : 0,
              }}
              className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-gradient-to-r from-[#6200EE] to-[#03DAC5] flex items-center justify-center"
            >
              <Sparkles className="h-2 w-2 text-white" />
            </motion.div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-wider text-[#374151] flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </label>
          <div className="relative group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-white/80 py-4 px-5 pr-12 text-sm font-medium backdrop-blur transition-all duration-300 focus:border-[#6200EE] focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-[#6200EE]/10"
              placeholder="Enter your secure password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] transition-all duration-200 hover:text-[#6200EE] hover:scale-110"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            <motion.div
              initial={false}
              animate={{
                scale: focusedField === 'password' ? 1 : 0,
                opacity: focusedField === 'password' ? 1 : 0,
              }}
              className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-gradient-to-r from-[#6200EE] to-[#03DAC5] flex items-center justify-center"
            >
              <Sparkles className="h-2 w-2 text-white" />
            </motion.div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <motion.label 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative">
              <input 
                type="checkbox" 
                className="peer sr-only" 
              />
              <div className="h-5 w-5 rounded-lg border-2 border-[#E5E7EB] bg-white transition-all peer-checked:border-[#6200EE] peer-checked:bg-[#6200EE] group-hover:border-[#6200EE]/50">
                <svg className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <span className="text-sm font-medium text-[#6B7280] group-hover:text-[#374151]">Remember me</span>
          </motion.label>
          <Link 
            href="/forgot-password" 
            className="text-sm font-bold text-[#6200EE] hover:text-[#4F2EE8] transition-colors relative group"
          >
            Forgot password?
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#6200EE] transition-all group-hover:w-full"></span>
          </Link>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] p-[2px] shadow-2xl shadow-[#6200EE]/25 transition-all duration-300 hover:shadow-[#6200EE]/40 disabled:opacity-70"
        >
          <div className="relative rounded-2xl bg-gradient-to-r from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] px-6 py-4 transition-all duration-300 group-hover:from-[#4F2EE8] group-hover:to-[#03DAC5]">
            <div className="flex items-center justify-center gap-2 text-base font-black text-white">
              {isLoading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                />
              ) : (
                <>
                  <span>Sign In to CampusRunner</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </div>
          </div>
        </motion.button>
      </motion.form>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center relative"
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E7EB]" />
        </div>
        <div className="relative bg-white px-4">
          <p className="text-sm text-[#6B7280]">
            New to CampusRunner?{' '}
            <Link 
              href="/signup" 
              className="font-black text-[#6200EE] hover:text-[#4F2EE8] transition-colors relative group"
            >
              Create your account
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6200EE] to-[#03DAC5] transition-all group-hover:w-full"></span>
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}