'use client';

import { useState } from 'react';
import { supabase } from '@/supabase/client';
import { Mail, Phone, MapPin, Lock, User, Hash, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function StudentSignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    matric_number: '',
    university: '',
    hostel_location: '',
    password: '',
    confirmPassword: ''
  });

  const steps = [
    { num: 1, title: 'Personal Info', fields: ['full_name', 'email', 'phone'] },
    { num: 2, title: 'Campus Details', fields: ['matric_number', 'university', 'hostel_location'] },
    { num: 3, title: 'Security', fields: ['password', 'confirmPassword'] }
  ];

  const currentStepData = steps[currentStep - 1];
  const isStepComplete = currentStepData.fields.every(field => formData[field as keyof typeof formData]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      if (isStepComplete) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      const { error: profileError } = await supabase.from('profiles').insert([{
        id: authData.user.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        university: formData.university,
        hostel_location: formData.hostel_location,
        matric_number: formData.matric_number,
        role: 'student',
      }]);

      if (profileError) throw profileError;
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/student';
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="w-full max-w-md mx-auto relative"
      >
        {/* Animated background elements */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{
              opacity: [0.5, 0, 0],
              scale: [0, 1, 1.5],
              y: -80,
              x: Math.sin(i) * 100
            }}
            transition={{ duration: 1.5, delay: 0.2 + i * 0.15, repeat: Infinity, repeatDelay: 2 }}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="text-2xl">✨</div>
          </motion.div>
        ))}

        <div className="relative rounded-3xl border-2 border-emerald-300/50 bg-gradient-to-br from-emerald-50 via-emerald-50/95 to-teal-50/50 backdrop-blur-xl p-8 text-center space-y-6 shadow-2xl shadow-emerald-500/20 overflow-hidden">
          {/* Animated glow background */}
          <motion.div
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/20 to-teal-400/20"
          />

          {/* Checkmark with advanced animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="relative z-10 mx-auto"
          >
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                filter: [
                  "drop-shadow(0 0 0px rgba(16, 185, 129, 0))",
                  "drop-shadow(0 0 20px rgba(16, 185, 129, 0.8))",
                  "drop-shadow(0 0 0px rgba(16, 185, 129, 0))"
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-600" />
            </motion.div>
          </motion.div>

          {/* Title with progressive animation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 space-y-2"
          >
            <motion.h2
              initial={{ letterSpacing: "0.1em" }}
              animate={{ letterSpacing: "0em" }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
            >
              Account Created! 🎉
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-emerald-700 font-bold text-lg"
            >
              Welcome to CampusRunner,{' '}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="text-emerald-600"
              >
                {formData.full_name}
              </motion.span>
              ! 👋
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-emerald-600 font-medium"
            >
              Your account is being prepared
            </motion.p>
          </motion.div>

          {/* Animated redirect message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 flex items-center justify-center gap-2"
          >
            <p className="text-xs text-emerald-600/80 font-medium">Redirecting</p>
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ●●●
            </motion.span>
          </motion.div>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative z-10 grid grid-cols-2 gap-3 pt-4"
          >
            {[
              { emoji: '✓', text: 'Email Verified' },
              { emoji: '🚀', text: 'Ready to Go' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05 }}
                className="rounded-xl bg-white/60 border border-emerald-200/50 p-3 text-center backdrop-blur"
              >
                <div className="text-lg mb-1">{item.emoji}</div>
                <p className="text-xs font-bold text-emerald-700">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full space-y-6 rounded-2xl border-3 border-[#6200EE]/40 bg-white/95 backdrop-blur-xl p-6 shadow-xl shadow-[#6200EE]/30"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6200EE] to-[#03DAC5] flex items-center justify-center shadow-lg"
        >
          <Image src="/logo.png" alt="CampusRunner" width={32} height={32} className="rounded-xl" />
        </motion.div>
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-[#6200EE] to-[#03DAC5] bg-clip-text text-transparent">
            Create Student Account
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">Join CampusRunner and get errands done</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center gap-2">
        {steps.map((step, idx) => (
          <motion.div key={step.num} className="flex-1 flex items-center gap-2">
            <motion.div
              animate={{
                scale: currentStep >= step.num ? 1 : 0.8,
                backgroundColor: currentStep >= step.num ? '#6200EE' : '#E5E7EB'
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            >
              {currentStep > step.num ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <span className={currentStep >= step.num ? 'text-white' : 'text-[#6B7280]'}>
                  {step.num}
                </span>
              )}
            </motion.div>
            {idx < steps.length - 1 && (
              <motion.div
                animate={{
                  backgroundColor: currentStep > step.num ? '#6200EE' : '#E5E7EB'
                }}
                className="flex-1 h-1 rounded-full"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Step Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-lg font-bold text-[#0B0E11]">{currentStepData.title}</h2>
        <p className="text-xs text-[#6B7280] mt-0.5">Step {currentStep} of 3</p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-red-200/50 bg-red-50/80 backdrop-blur p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-5">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <>
              <motion.div custom={0} variants={fieldVariants} className="space-y-2">
                <label className="text-sm font-bold text-[#0B0E11] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#6200EE]" />
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 placeholder:text-[#9CA3AF]"
                  required
                />
              </motion.div>

              <motion.div custom={1} variants={fieldVariants} className="space-y-2">
                <label className="text-sm font-bold text-[#0B0E11] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#6200EE]" />
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 placeholder:text-[#9CA3AF]"
                  required
                />
              </motion.div>

              <motion.div custom={2} variants={fieldVariants} className="space-y-2">
                <label className="text-sm font-bold text-[#0B0E11] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#6200EE]" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+234 80 0000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 placeholder:text-[#9CA3AF]"
                  required
                />
              </motion.div>
            </>
          )}

          {/* Step 2: Campus Details */}
          {currentStep === 2 && (
            <>
              <motion.div custom={0} variants={fieldVariants} className="space-y-2">
                <label className="text-sm font-bold text-[#0B0E11] flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[#6200EE]" />
                  Matric Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2021/12345"
                  value={formData.matric_number}
                  onChange={(e) => setFormData({...formData, matric_number: e.target.value})}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 placeholder:text-[#9CA3AF]"
                  required
                />
              </motion.div>

              <motion.div custom={1} variants={fieldVariants} className="space-y-2">
                <label className="text-sm font-bold text-[#0B0E11] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#6200EE]" />
                  University
                </label>
                <input
                  type="text"
                  placeholder="Your University"
                  value={formData.university}
                  onChange={(e) => setFormData({...formData, university: e.target.value})}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 placeholder:text-[#9CA3AF]"
                  required
                />
              </motion.div>

              <motion.div custom={2} variants={fieldVariants} className="space-y-2">
                <label className="text-sm font-bold text-[#0B0E11] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#6200EE]" />
                  Hostel Location
                </label>
                <input
                  type="text"
                  placeholder="Your Hostel"
                  value={formData.hostel_location}
                  onChange={(e) => setFormData({...formData, hostel_location: e.target.value})}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 placeholder:text-[#9CA3AF]"
                  required
                />
              </motion.div>
            </>
          )}

          {/* Step 3: Security */}
          {currentStep === 3 && (
            <>
              <motion.div custom={0} variants={fieldVariants} className="space-y-2">
                <label className="text-sm font-bold text-[#0B0E11] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#6200EE]" />
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 placeholder:text-[#9CA3AF]"
                  required
                />
                <p className="text-xs text-[#6B7280]">At least 6 characters</p>
              </motion.div>

              <motion.div custom={1} variants={fieldVariants} className="space-y-2">
                <label className="text-sm font-bold text-[#0B0E11] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#6200EE]" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full rounded-xl border-2 border-[#E5E7EB] bg-white/50 py-2 px-3 text-sm text-[#0B0E11] backdrop-blur transition-all focus:border-[#6200EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 placeholder:text-[#9CA3AF]"
                  required
                />
              </motion.div>
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          {currentStep > 1 && (
            <motion.button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 rounded-xl border-2 border-[#E5E7EB] bg-white py-2 font-bold text-sm text-[#6200EE] transition-all hover:border-[#6200EE] hover:bg-[#F8F5FF]"
            >
              Back
            </motion.button>
          )}

          <motion.button
            type="submit"
            disabled={loading || !isStepComplete}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#6200EE] to-[#03DAC5] py-2 font-bold text-sm text-white shadow-lg shadow-[#6200EE]/20 transition-all hover:shadow-[#6200EE]/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                {currentStep === 3 ? 'Create Account' : 'Next'}
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* Login Link */}
      <p className="text-center text-sm text-[#6B7280]">
        Already have an account?{' '}
        <a href="/login" className="font-bold text-[#6200EE] hover:text-[#4F2EE8] transition-colors">
          Login here
        </a>
      </p>
    </motion.div>
  );
}
