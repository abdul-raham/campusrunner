'use client';

import { useState } from 'react';
import { ArrowRight, Star, TrendingUp } from 'lucide-react';
import { runnerJobs } from '@/src/constants/mock-data';
import { useAuth } from '@/src/hooks/useAuth';

export default function RunnerDashboard() {
  const { profile } = useAuth();
  const [available, setAvailable] = useState(true);
  return (
    <div className="px-4 py-5 md:px-8 md:py-8">
      <div className="flex items-start justify-between gap-4"><div><p className="text-sm text-white/60">Welcome back</p><h1 className="text-2xl font-black md:text-3xl">{profile?.full_name?.split(' ')[0] || 'Runner'}</h1></div><button onClick={()=>setAvailable(!available)} className={`rounded-2xl px-4 py-2 text-sm font-bold ${available?'bg-emerald-500 text-white':'bg-white/10 text-white/80'}`}>{available ? 'Available' : 'Offline'}</button></div>
      <section className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[30px] bg-[linear-gradient(135deg,#6200EE,#4F2EE8_55%,#03DAC5)] p-5 text-white shadow-xl shadow-violet-900/20"><p className="text-xs uppercase tracking-[0.16em] text-white/70">Total earnings</p><h2 className="mt-2 text-4xl font-black">₦25,000</h2><p className="mt-2 text-sm text-white/70">+ ₦2,500 this week</p><div className="mt-5 grid grid-cols-3 gap-3 text-xs md:text-sm"><div className="rounded-2xl bg-white/15 p-3">12 jobs</div><div className="rounded-2xl bg-white/15 p-3">18m avg time</div><div className="rounded-2xl bg-white/15 p-3">4.9 rating</div></div></div>
        <div className="rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-sm text-white/60">Performance</p><h3 className="text-xl font-black">This week</h3></div><TrendingUp className="h-5 w-5 text-[#03DAC5]" /></div><div className="mt-5 space-y-3 text-sm text-white/70"><div className="flex items-center justify-between rounded-2xl bg-white/5 p-3"><span>Jobs completed</span><span className="font-bold text-white">12</span></div><div className="flex items-center justify-between rounded-2xl bg-white/5 p-3"><span>Acceptance rate</span><span className="font-bold text-white">92%</span></div><div className="flex items-center justify-between rounded-2xl bg-white/5 p-3"><span>Rating</span><span className="inline-flex items-center gap-1 font-bold text-white"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />4.9</span></div></div></div>
      </section>
      <section className="mt-6 rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-black">Available jobs</h2><span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">{runnerJobs.length} open</span></div><div className="space-y-3">{runnerJobs.map((job)=> <div key={job.id} className="rounded-[24px] border border-white/10 bg-white/5 p-4"><div className="flex items-start justify-between gap-4"><div><div className="mb-1 flex items-center gap-2"><h3 className="font-black">{job.service}</h3>{job.urgent && <span className="rounded-full bg-red-500/20 px-2 py-1 text-[10px] font-bold text-red-300">URGENT</span>}</div><p className="text-sm text-white/60">{job.pickup} → {job.dropoff}</p></div><p className="text-xl font-black text-[#03DAC5]">{job.amount}</p></div><button className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-[#0B0E11]">Accept job <ArrowRight className="h-4 w-4" /></button></div>)}</div></section>
    </div>
  );
}
