'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Lock, Mail, MapPin, Phone, User } from 'lucide-react';
import { registerDemoUser } from '@/src/lib/demo-auth';
import { BrandMark } from '@/components/ui/BrandMark';

export function StudentSignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ full_name:'', email:'', phone:'', university:'', hostel_location:'', password:'' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      registerDemoUser({ ...form, role: 'student' });
      router.push('/student');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="mb-2 text-center"><div className="mx-auto mb-4 w-fit"><BrandMark className="h-14 w-14" /></div><h1 className="text-2xl font-black">Create student account</h1><p className="mt-2 text-sm text-slate-500">Request campus errands in minutes.</p></div>
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      {[
        ['full_name','Full name',User,'Your full name'],
        ['email','Email',Mail,'student@school.edu'],
        ['phone','Phone',Phone,'0800 000 0000'],
        ['university','University',User,'Your university'],
        ['hostel_location','Hostel / location',MapPin,'Hall 2, Room 14'],
        ['password','Password',Lock,'Choose a password']
      ].map(([key,label,Icon,placeholder]: any)=>(
        <label key={key} className="block"><span className="mb-2 block text-sm font-semibold text-slate-600">{label}</span><div className="relative"><Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input type={key==='password'?'password':key==='email'?'email':'text'} value={(form as any)[key]} onChange={(e)=>setForm({...form,[key]:e.target.value})} required className="w-full rounded-2xl border border-[#E9E4FF] bg-white px-11 py-3.5 outline-none transition focus:border-[#6200EE]" placeholder={placeholder} /></div></label>
      ))}
      <button disabled={loading} className="w-full rounded-2xl bg-[linear-gradient(135deg,#6200EE,#4F2EE8)] px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-500/20 disabled:opacity-60">{loading ? 'Creating account...' : 'Continue as Student'}</button>
      <p className="text-center text-sm text-slate-500">Already registered? <Link href="/login" className="font-semibold text-[#6200EE]">Login</Link></p>
    </form>
  );
}
