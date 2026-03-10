'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/supabase/client';

interface SignupFormProps {
  userType: 'student' | 'runner';
}

export function SignupForm({ userType }: SignupFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
  });
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
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            role: userType,
          }
        }
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: formData.email,
            full_name: formData.fullName,
            phone: formData.phone,
            role: userType,
          });

        if (profileError) {
          setError('Failed to create profile');
          return;
        }

        // Redirect to appropriate dashboard
        router.push(`/${userType}/dashboard`);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            Join as {userType === 'student' ? 'Student' : 'Runner'}
          </h1>
          <p className="text-base text-[#6B7280] font-medium">
            {userType === 'student' 
              ? 'Request errands from trusted campus runners'
              : 'Earn money by helping fellow students'
            }
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
            <User className="h-4 w-4" />
            Full Name
          </label>
          <div className="relative group">
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              onFocus={() => setFocusedField('fullName')}
              onBlur={() => setFocusedField(null)}
              className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-white/80 py-4 px-5 text-sm font-medium backdrop-blur transition-all duration-300 focus:border-[#6200EE] focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-[#6200EE]/10"
              placeholder="Enter your full name"
              required
            />
            <motion.div
              initial={false}
              animate={{
                scale: focusedField === 'fullName' ? 1 : 0,
                opacity: focusedField === 'fullName' ? 1 : 0,
              }}
              className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-gradient-to-r from-[#6200EE] to-[#03DAC5] flex items-center justify-center"
            >
              <Sparkles className="h-2 w-2 text-white" />
            </motion.div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-wider text-[#374151] flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address
          </label>
          <div className="relative group">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
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
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-white/80 py-4 px-5 pr-12 text-sm font-medium backdrop-blur transition-all duration-300 focus:border-[#6200EE] focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-[#6200EE]/10"
              placeholder="Create a secure password"
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
                  <span>Create {userType === 'student' ? 'Student' : 'Runner'} Account</span>
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
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-black text-[#6200EE] hover:text-[#4F2EE8] transition-colors relative group"
            >
              Sign in here
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6200EE] to-[#03DAC5] transition-all group-hover:w-full"></span>
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}