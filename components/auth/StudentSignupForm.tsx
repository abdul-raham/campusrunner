'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { Mail, Phone, MapPin, Lock, User, Hash } from 'lucide-react';
import Image from 'next/image';

export function StudentSignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

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

      router.push('/student');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-lg">
          <Image src="/logo.png" alt="CampusRunner" width={28} height={28} className="rounded-lg" />
        </div>
        <div>
          <p className="text-lg font-extrabold tracking-tight">CampusRunner</p>
          <p className="-mt-1 text-xs text-[#6B7280]">Campus errands, simplified</p>
        </div>
      </div>

      <h2 className="mb-6 text-2xl font-black">Create Student Account</h2>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#0B0E11]">Full Name</label>
        <div className="relative">
          <User className="absolute left-4 top-4 h-5 w-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="John Doe"
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            className="w-full rounded-2xl border border-[#E9E4FF] bg-white/80 py-4 pl-12 pr-4 text-[#0B0E11] backdrop-blur transition focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#0B0E11]">Email</label>
        <div className="relative">
          <Mail className="absolute left-4 top-4 h-5 w-5 text-[#6B7280]" />
          <input
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full rounded-2xl border border-[#E9E4FF] bg-white/80 py-4 pl-12 pr-4 text-[#0B0E11] backdrop-blur transition focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#0B0E11]">Phone</label>
        <div className="relative">
          <Phone className="absolute left-4 top-4 h-5 w-5 text-[#6B7280]" />
          <input
            type="tel"
            placeholder="+234 80 0000 0000"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full rounded-2xl border border-[#E9E4FF] bg-white/80 py-4 pl-12 pr-4 text-[#0B0E11] backdrop-blur transition focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#0B0E11]">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-4 h-5 w-5 text-[#6B7280]" />
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full rounded-2xl border border-[#E9E4FF] bg-white/80 py-4 pl-12 pr-4 text-[#0B0E11] backdrop-blur transition focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer rounded-2xl bg-[#6200EE] py-4 font-bold text-white shadow-xl shadow-[#6200EE]/20 transition hover:translate-y-[-2px] hover:bg-[#4F2EE8] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
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