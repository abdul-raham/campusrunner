'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, ArrowRight, Sparkles, Phone } from 'lucide-react';

export function StudentSignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
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
      {/* Header */}
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
            Join as Student
          </h1>
          <p className="text-base text-[#6B7280] font-medium">
            Start requesting campus errands today
          </p>
        </motion.div>
      </div>

      {/* Form */}
      <motion.form 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[#374151] flex items-center gap-2">
              <User className="h-3 w-3" />
              First Name
            </label>
            <div className="relative group">
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                onFocus={() => setFocusedField('firstName')}
                onBlur={() => setFocusedField(null)}
                className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-white/80 py-3 px-4 text-sm font-medium backdrop-blur transition-all duration-300 focus:border-[#6200EE] focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-[#6200EE]/10"
                placeholder="John"
                required
              />
              <motion.div
                initial={false}
                animate={{
                  scale: focusedField === 'firstName' ? 1 : 0,
                  opacity: focusedField === 'firstName' ? 1 : 0,
                }}
                className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-gradient-to-r from-[#6200EE] to-[#03DAC5] flex items-center justify-center"
              >
                <Sparkles className="h-2 w-2 text-white" />
              </motion.div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[#374151]">
              Last Name
            </label>
            <div className="relative group">
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                onFocus={() => setFocusedField('lastName')}
                onBlur={() => setFocusedField(null)}
                className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-white/80 py-3 px-4 text-sm font-medium backdrop-blur transition-all duration-300 focus:border-[#6200EE] focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-[#6200EE]/10"
                placeholder="Doe"
                required
              />
              <motion.div
                initial={false}
                animate={{
                  scale: focusedField === 'lastName' ? 1 : 0,
                  opacity: focusedField === 'lastName' ? 1 : 0,
                }}
                className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-gradient-to-r from-[#6200EE] to-[#03DAC5] flex items-center justify-center"
              >
                <Sparkles className="h-2 w-2 text-white" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-[#374151] flex items-center gap-2">
            <Mail className="h-3 w-3" />
            University Email
          </label>
          <div className="relative group">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-white/80 py-4 px-5 text-sm font-medium backdrop-blur transition-all duration-300 focus:border-[#6200EE] focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-[#6200EE]/10"
              placeholder="john.doe@university.edu"
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

        {/* Phone & University */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[#374151] flex items-center gap-2">
              <Phone className="h-3 w-3" />
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-white/80 py-3 px-4 text-sm font-medium backdrop-blur transition-all duration-300 focus:border-[#6200EE] focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-[#6200EE]/10"
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[#374151] flex items-center gap-2">
              <GraduationCap className="h-3 w-3" />
              University
            </label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) => handleInputChange('university', e.target.value)}
              className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-white/80 py-3 px-4 text-sm font-medium backdrop-blur transition-all duration-300 focus:border-[#6200EE] focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-[#6200EE]/10"
              placeholder="Your University"
              required
            />
          </div>
        </div>

        {/* Password Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[#374151] flex items-center gap-2">
              <Lock className="h-3 w-3" />
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[#374151]">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-white/80 py-4 px-5 pr-12 text-sm font-medium backdrop-blur transition-all duration-300 focus:border-[#6200EE] focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-[#6200EE]/10"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] transition-all duration-200 hover:text-[#6200EE] hover:scale-110"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <motion.label 
          whileHover={{ scale: 1.01 }}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <div className="relative mt-1">
            <input 
              type="checkbox" 
              className="peer sr-only" 
              required
            />
            <div className="h-5 w-5 rounded-lg border-2 border-[#E5E7EB] bg-white transition-all peer-checked:border-[#6200EE] peer-checked:bg-[#6200EE] group-hover:border-[#6200EE]/50">
              <svg className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <span className="text-sm text-[#6B7280] leading-relaxed">
            I agree to the{' '}
            <Link href="/terms" className="font-bold text-[#6200EE] hover:underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="font-bold text-[#6200EE] hover:underline">
              Privacy Policy
            </Link>
          </span>
        </motion.label>

        {/* Submit Button */}
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
                  <span>Create Student Account</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </div>
          </div>
        </motion.button>
      </motion.form>

      {/* Login Link */}
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