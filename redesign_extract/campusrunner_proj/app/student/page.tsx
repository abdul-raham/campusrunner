'use client';

import { useMemo, useState } from 'react';
import { Bell, ChevronRight, Plus, Search } from 'lucide-react';
import { recentOrders, serviceCards } from '@/src/constants/mock-data';
import { useAuth } from '@/src/hooks/useAuth';

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [query, setQuery] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const services = useMemo(() => serviceCards.filter((s) => s.title.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div className="px-4 py-5 md:px-8 md:py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Good morning</p>
          <h1 className="text-2xl font-black md:text-3xl">{profile?.full_name?.split(' ')[0] || 'Student'}</h1>
        </div>
        <button className="rounded-2xl border border-[#E9E4FF] bg-white p-3 shadow-sm"><Bell className="h-4 w-4 text-[#6200EE]" /></button>
      </div>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[30px] bg-[linear-gradient(135deg,#6200EE,#4F2EE8_55%,#03DAC5)] p-5 text-white shadow-xl shadow-violet-500/20 md:p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-white/70">Balance</p>
          <div className="mt-3 flex items-end justify-between gap-4"><h2 className="text-4xl font-black md:text-5xl">₦4,500</h2><button className="rounded-2xl bg-white px-4 py-2 text-sm font-bold text-[#6200EE]">Top up</button></div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-xs md:text-sm"><div className="rounded-2xl bg-white/15 p-3">03 open orders</div><div className="rounded-2xl bg-white/15 p-3">07 alerts</div><div className="rounded-2xl bg-white/15 p-3">4.8 avg rating</div></div>
        </div>
        <div className="rounded-[30px] border border-[#E9E4FF] bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Quick action</p><h3 className="text-xl font-black">Create new errand</h3></div><button onClick={() => setShowComposer(!showComposer)} className="rounded-2xl bg-[#6200EE] p-3 text-white"><Plus className="h-4 w-4" /></button></div>
          <div className="mt-4 rounded-2xl border border-[#E9E4FF] bg-[#F8F9FE] p-3"><div className="relative"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search service" className="w-full rounded-2xl bg-white px-11 py-3 outline-none" /></div></div>
          {showComposer && <div className="mt-4 rounded-2xl border border-dashed border-[#6200EE]/30 bg-[#F8F5FF] p-4 text-sm text-slate-600">Use the service grid below to start a request. In the full app, this opens a request sheet with order details and pricing.</div>}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-black">Campus services</h2><span className="rounded-full bg-[#E6FFF9] px-3 py-1 text-xs font-bold text-[#03A894]">Mobile first</span></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{services.map((item)=>{const Icon=item.icon; return <button key={item.title} className="rounded-[28px] border border-[#E9E4FF] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="mb-4 flex items-center justify-between"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}><Icon className="h-5 w-5 text-white" /></div>{item.popular && <span className="rounded-full bg-[#F4ECFF] px-3 py-1 text-[10px] font-bold text-[#6200EE]">POPULAR</span>}</div><h3 className="font-black">{item.title}</h3><p className="mt-2 text-sm text-slate-500">{item.subtitle}</p></button>})}</div>
      </section>

      <section className="mt-6 rounded-[30px] border border-[#E9E4FF] bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-black">Recent orders</h2><button className="text-sm font-semibold text-[#6200EE]">See all</button></div>
        <div className="space-y-3">{recentOrders.map((order)=> <div key={order.id} className="flex items-center justify-between rounded-2xl border border-[#F0EEFF] p-4"><div><p className="text-xs text-slate-400">{order.id}</p><h3 className="font-bold">{order.service}</h3><p className="text-sm text-slate-500">Runner: {order.runner}</p></div><div className="text-right"><p className="font-black text-[#6200EE]">{order.amount}</p><p className="text-xs text-slate-500">{order.status}</p></div><ChevronRight className="h-4 w-4 text-slate-400" /></div>)}</div>
      </section>
    </div>
  );
}
