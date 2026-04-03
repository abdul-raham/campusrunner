'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { runnerSignupSchema } from '@/lib/schemas';
import type { RunnerSignupForm } from '@/types/index';
import { UNIVERSITIES } from '@/constants/index';
import { Zap, Mail, Phone, MapPin, Lock, User, Hash } from 'lucide-react';
import Image from 'next/image';

export function RunnerSignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RunnerSignupForm>({
    resolver: zodResolver(runnerSignupSchema),
  });

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  const onSubmit = async (data: RunnerSignupForm) => {
    try {
      setLoading(true);
      setError(null);

      // Sign up with Supabase Auth (no email confirmation)
      const { data: authData, error: authError } = await supabase.auth.signUp(
        {
          email: data.email,
          password: data.password,
        }
      );

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

      // Create user profile
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          university: data.university,
          hostel_location: data.hostel_location,
          matric_number: data.matric_number,
          avatar_url: avatarUrl,
          role: 'runner',
        },
      ]);

      if (profileError) {
        if (uploadedPath) {
          await supabase.storage.from('avatars').remove([uploadedPath]);
        }
        throw profileError;
      }

      // Create runner record
      const { error: runnerError } = await supabase
        .from('runners')
        .insert([
          {
            profile_id: authData.user.id,
            student_id_number: data.matric_number,
            verification_status: 'pending',
          },
        ]);

      if (runnerError) {
        if (uploadedPath) {
          await supabase.storage.from('avatars').remove([uploadedPath]);
        }
        throw runnerError;
      }

      // Notify admins about the new runner signup (email + in-app)
      try {
        await fetch('/api/admin/notify-runner-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileId: authData.user.id,
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            university: data.university,
            hostel_location: data.hostel_location,
            matric_number: data.matric_number,
          }),
        });
      } catch (notifyError) {
        console.error('Admin notification error:', notifyError);
      }

      // Redirect to runner dashboard
      setTimeout(() => {
        router.push('/runner');
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-lg">
          <Image src="/logo.png" alt="CampusRunner" width={28} height={28} className="rounded-lg" />
        </div>
        <div>
          <p className="text-lg font-extrabold tracking-tight">CampusRunner</p>
          <p className="-mt-1 text-xs text-[#6B7280]">Campus errands, simplified</p>
        </div>
      </div>

      <h2 className="mb-6 text-2xl font-black">Become a Runner</h2>

      {error && (
        <div ref={errorRef} className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#0B0E11]">Full Name</label>
        <div className="relative">
          <User className="absolute left-4 top-4 h-5 w-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="John Doe"
            {...register('full_name')}
            className="w-full rounded-2xl border border-[#E9E4FF] bg-white/80 py-4 pl-12 pr-4 text-[#0B0E11] backdrop-blur transition focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
          />
        </div>
        {errors.full_name && (
          <p className="mt-2 text-sm text-red-500">{errors.full_name.message}</p>
        )}
      </div>

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

      {/* Phone */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#0B0E11]">Phone</label>
        <div className="relative">
          <Phone className="absolute left-4 top-4 h-5 w-5 text-[#6B7280]" />
          <input
            type="tel"
            placeholder="+234 80 0000 0000"
            {...register('phone')}
            className="w-full rounded-2xl border border-[#E9E4FF] bg-white/80 py-4 pl-12 pr-4 text-[#0B0E11] backdrop-blur transition focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
          />
        </div>
        {errors.phone && (
          <p className="mt-2 text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Profile Photo */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#0B0E11]">
          Profile Photo (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          className="w-full rounded-2xl border border-[#E9E4FF] bg-white/80 py-3 px-4 text-sm text-[#0B0E11] backdrop-blur transition focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
        />
        {avatarFile && (
          <p className="mt-2 text-xs text-[#6B7280] truncate">
            Selected: {avatarFile.name}
          </p>
        )}
      </div>

      {/* Matric Number */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#0B0E11]">Matric Number</label>
        <div className="relative">
          <Hash className="absolute left-4 top-4 h-5 w-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="CSC/2021/001"
            {...register('matric_number')}
            className="w-full rounded-2xl border border-[#E9E4FF] bg-white/80 py-4 pl-12 pr-4 text-[#0B0E11] backdrop-blur transition focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
          />
        </div>
        {errors.matric_number && (
          <p className="mt-2 text-sm text-red-500">{errors.matric_number.message}</p>
        )}
      </div>

      {/* University */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#0B0E11]">University</label>
        <select
          {...register('university')}
          className="w-full rounded-2xl border border-[#E9E4FF] bg-white/80 py-4 px-4 text-[#0B0E11] backdrop-blur transition focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
        >
          <option value="">Select University</option>
          {UNIVERSITIES.map((uni) => (
            <option key={uni} value={uni}>
              {uni}
            </option>
          ))}
        </select>
        {errors.university && (
          <p className="mt-2 text-sm text-red-500">{errors.university.message}</p>
        )}
      </div>

      {/* Hostel Location */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#0B0E11]">
          Hostel / Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-4 h-5 w-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Block A, Hostel 5"
            {...register('hostel_location')}
            className="w-full rounded-2xl border border-[#E9E4FF] bg-white/80 py-4 pl-12 pr-4 text-[#0B0E11] backdrop-blur transition focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
          />
        </div>
        {errors.hostel_location && (
          <p className="mt-2 text-sm text-red-500">
            {errors.hostel_location.message}
          </p>
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

      {/* Confirm Password */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#0B0E11]">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-4 h-5 w-5 text-[#6B7280]" />
          <input
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            className="w-full rounded-2xl border border-[#E9E4FF] bg-white/80 py-4 pl-12 pr-4 text-[#0B0E11] backdrop-blur transition focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-2 text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer rounded-2xl bg-[#6200EE] py-4 font-bold text-white shadow-xl shadow-[#6200EE]/20 transition hover:translate-y-[-2px] hover:bg-[#4F2EE8] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading ? 'Creating Account...' : 'Become a Runner'}
      </button>

      <p className="text-center text-sm text-[#6B7280]">
        Already have an account?{' '}
        <a href="/login" className="font-semibold text-[#6200EE] transition hover:text-[#4F2EE8]">
          Login
        </a>
      </p>
    </form>
  );
}
