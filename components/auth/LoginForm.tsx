'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/supabase/client';

export function LoginFormComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setError('Login failed');
        setIsLoading(false);
        return;
      }

      // Show success message
      setSuccess(true);
      
      // Get user role and redirect
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const role = profile?.role || 'student';
      
      // Redirect after showing success for 2 seconds
      setTimeout(() => {
        window.location.href = `/${role}`;
      }, 2000);
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 }
    })
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-md"
    >
      <div className="relative rounded-2xl border-3 border-[#6200EE]/40 bg-gradient-to-br from-white/95 via-white/90 to-white/85 p-6 shadow-xl shadow-[#6200EE]/30 backdrop-blur-2xl">
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-[#6200EE]/10 via-transparent to-[#03DAC5]/10 pointer-events-none" />
        
        <div className="relative space-y-6">
          {/* Header */}
          <motion.div 
            custom={0}
            variants={itemVariants}
            className="text-center space-y-4"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6200EE] to-[#03DAC5] shadow-lg"
            >
              <Image src="/logo.png" alt="CampusRunner" width={32} height={32} className="rounded-xl" />
            </motion.div>
            
            <div>
              <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#6200EE] to-[#03DAC5] bg-clip-text text-transparent mb-1">
                Welcome Back
              </h1>
              <p className="text-xs text-[#6B7280] font-medium">
                Sign in to continue your campus journey
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form 
            custom={1}
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-200/50 bg-red-50/80 backdrop-blur p-4 text-sm text-red-600 font-medium flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-red-500" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative overflow-hidden rounded-2xl border-2 border-emerald-300/50 bg-gradient-to-br from-emerald-50 via-emerald-50/90 to-emerald-100/50 backdrop-blur-xl p-5 flex items-start gap-4 shadow-lg shadow-emerald-500/20"
              >
                {/* Animated background glow */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl"
                />

                {/* Checkmark with animations */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="relative flex-shrink-0 mt-1"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      filter: ["drop-shadow(0 0 0px rgba(16, 185, 129, 0))", "drop-shadow(0 0 12px rgba(16, 185, 129, 0.8))", "drop-shadow(0 0 0px rgba(16, 185, 129, 0))"]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                    className="relative"
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </motion.div>
                </motion.div>

                {/* Text content */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 relative z-10"
                >
                  <motion.p
                    animate={{ letterSpacing: [0, 0.5, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
                    className="text-sm font-bold text-emerald-700"
                  >
                    Login successful! 🎉
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs text-emerald-600 mt-1 font-medium"
                  >
                    Redirecting to your dashboard...
                  </motion.p>
                </motion.div>

                {/* Animated checkmarks in background */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0.3, 0, 0], scale: [0, 1.2, 1.5], y: -30 }}
                    transition={{ duration: 1.2, delay: 0.1 + i * 0.1, repeat: Infinity, repeatDelay: 1.5 }}
                    className="absolute right-4 top-4 text-emerald-400/40"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Email Field */}
            <motion.div custom={2} variants={itemVariants} className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#374151] flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#6200EE]" />
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  disabled={success}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm font-medium backdrop-blur transition-all duration-300 focus:border-[#6200EE] focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-[#6200EE]/20 placeholder:text-[#9CA3AF] disabled:opacity-60 disabled:cursor-not-allowed"
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
            </motion.div>

            {/* Password Field */}
            <motion.div custom={3} variants={itemVariants} className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#374151] flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#6200EE]" />
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  disabled={success}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 pr-10 text-sm font-medium backdrop-blur transition-all duration-300 focus:border-[#6200EE] focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-[#6200EE]/20 placeholder:text-[#9CA3AF] disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                  required
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] transition-all duration-200 hover:text-[#6200EE]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </motion.button>
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
            </motion.div>

            {/* Remember & Forgot */}
            <motion.div custom={4} variants={itemVariants} className="flex items-center justify-between pt-2">
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
            </motion.div>

            {/* Submit Button */}
            <motion.button
              custom={5}
              variants={itemVariants}
              type="submit"
              disabled={isLoading || success}
              whileHover={{ scale: success ? 1 : 1.02, y: success ? 0 : -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] p-[2px] shadow-2xl shadow-[#6200EE]/25 transition-all duration-300 hover:shadow-[#6200EE]/40 disabled:opacity-70 mt-6"
            >
              <div className="relative rounded-2xl bg-gradient-to-r from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] px-6 py-4 transition-all duration-300 group-hover:from-[#4F2EE8] group-hover:to-[#03DAC5]">
                <div className="flex items-center justify-center gap-2 text-base font-black text-white">
                  {isLoading || success ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                      />
                      <span>{success ? 'Redirecting...' : 'Signing in...'}</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </div>
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div custom={6} variants={itemVariants} className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]" />
            </div>
            <div className="relative flex justify-center bg-gradient-to-br from-white/80 via-white/70 to-white/60 px-4">
              <p className="text-xs text-[#6B7280] font-medium">OR</p>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div custom={7} variants={itemVariants} className="text-center">
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
          </motion.div>

          {/* Features */}
          <motion.div custom={8} variants={itemVariants} className="grid grid-cols-2 gap-3 pt-4">
            {[
              { icon: CheckCircle2, text: 'Secure Login' },
              { icon: Sparkles, text: 'Fast Access' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#6B7280] bg-white/30 rounded-xl p-2 backdrop-blur">
                <item.icon className="h-4 w-4 text-[#6200EE]" />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
