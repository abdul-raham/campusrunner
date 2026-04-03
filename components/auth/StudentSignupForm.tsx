'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Phone, MapPin, Lock, User, Hash, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function StudentSignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    matric_number: '',
    university: '',
    hostel_location: '',
    password: '',
    confirmPassword: '',
  });

  const steps = [
    { num: 1, title: 'Personal Info', fields: ['full_name', 'email', 'phone'] },
    { num: 2, title: 'Campus Details', fields: ['matric_number', 'university', 'hostel_location'] },
    { num: 3, title: 'Security', fields: ['password', 'confirmPassword'] },
  ];

  const currentStepData = steps[currentStep - 1];
  const isStepComplete = currentStepData.fields.every((field) => formData[field as keyof typeof formData]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < 3) {
      if (isStepComplete) setCurrentStep(currentStep + 1);
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

      let avatarUrl: string | null = null;
      let uploadedPath: string | null = null;

      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop() || 'jpg';
        uploadedPath = `avatars/${authData.user.id}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(uploadedPath, avatarFile, { upsert: true, contentType: avatarFile.type });
        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(uploadedPath);
        avatarUrl = publicData.publicUrl;
      }

      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          university: formData.university,
          hostel_location: formData.hostel_location,
          matric_number: formData.matric_number,
          avatar_url: avatarUrl,
          role: 'student',
        },
      ]);

      if (profileError) {
        if (uploadedPath) {
          await supabase.storage.from('avatars').remove([uploadedPath]);
        }
        throw profileError;
      }
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/student';
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="auth-alert success">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle2 className="auth-icon" />
          <div>
            <strong>Account created.</strong> Redirecting to your student dashboard…
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 auth-animate">
      <div className="auth-card-header auth-animate auth-delay-1">
        <h1 className="auth-title">Create student account</h1>
        <p className="auth-sub">Join CampusRunner and get errands done.</p>
      </div>

      <div className="auth-stepper auth-animate auth-delay-2">
        {steps.map((step, idx) => (
          <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <div
              className={`auth-step${currentStep > step.num ? ' done' : ''}${
                currentStep === step.num ? ' active' : ''
              }`}
            >
              {currentStep > step.num ? '✓' : step.num}
            </div>
            {idx < steps.length - 1 && (
              <div className={`auth-step-line${currentStep > step.num ? ' active' : ''}`} />
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }} className="auth-animate auth-delay-2">
        <h2 style={{ fontWeight: 700 }}>{currentStepData.title}</h2>
        <p className="auth-helper">Step {currentStep} of 3</p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="auth-alert error">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle className="auth-icon" />
            <span>{error}</span>
          </div>
        </motion.div>
      )}

      <form onSubmit={onSubmit} className="auth-form auth-animate auth-delay-3">
        <div className="auth-form">
          {currentStep === 1 && (
            <>
              <motion.div>
                <label className="auth-label">
                  <User className="auth-icon" size={16} /> Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="input-glass"
                  required
                />
              </motion.div>

              <motion.div>
                <label className="auth-label">
                  <Mail className="auth-icon" size={16} /> Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-glass"
                  required
                />
              </motion.div>

              <motion.div>
                <label className="auth-label">
                  <Phone className="auth-icon" size={16} /> Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+234 80 0000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-glass"
                  required
                />
              </motion.div>

              <motion.div>
                <label className="auth-label">
                  <User className="auth-icon" size={16} /> Profile Photo (optional)
                </label>
                <div className="auth-upload">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="auth-secondary-button">
                    Choose image
                  </button>
                  <span className="auth-helper">{avatarFile ? avatarFile.name : 'No file selected'}</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                />
              </motion.div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <motion.div>
                <label className="auth-label">
                  <Hash className="auth-icon" size={16} /> Matric Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2021/12345"
                  value={formData.matric_number}
                  onChange={(e) => setFormData({ ...formData, matric_number: e.target.value })}
                  className="input-glass"
                  required
                />
              </motion.div>

              <motion.div>
                <label className="auth-label">
                  <MapPin className="auth-icon" size={16} /> University
                </label>
                <input
                  type="text"
                  placeholder="Your University"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="input-glass"
                  required
                />
              </motion.div>

              <motion.div>
                <label className="auth-label">
                  <MapPin className="auth-icon" size={16} /> Hostel Location
                </label>
                <input
                  type="text"
                  placeholder="Your Hostel"
                  value={formData.hostel_location}
                  onChange={(e) => setFormData({ ...formData, hostel_location: e.target.value })}
                  className="input-glass"
                  required
                />
              </motion.div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <motion.div>
                <label className="auth-label">
                  <Lock className="auth-icon" size={16} /> Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-glass"
                  required
                />
                <p className="auth-helper">At least 6 characters</p>
              </motion.div>

              <motion.div>
                <label className="auth-label">
                  <Lock className="auth-icon" size={16} /> Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input-glass"
                  required
                />
              </motion.div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {currentStep > 1 && (
            <motion.button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="auth-secondary-button"
            >
              Back
            </motion.button>
          )}

          <motion.button
            type="submit"
            disabled={loading || !isStepComplete}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="primary-button"
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
                <ArrowRight size={14} />
              </>
            )}
          </motion.button>
        </div>
      </form>

      <p style={{ textAlign: 'center' }} className="auth-muted auth-animate auth-delay-4">
        Already have an account?{' '}
        <Link href="/login" className="auth-link">
          Login here
        </Link>
      </p>
    </motion.div>
  );
}
