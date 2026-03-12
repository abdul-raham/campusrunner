'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Bell, CheckCircle2, Menu, ShieldCheck, Sparkles, WalletCards, X } from 'lucide-react';
import WelcomeLoader from '@/components/WelcomeLoader';
import { BrandMark } from '@/components/ui/BrandMark';
import { serviceCards } from '@/src/constants/mock-data';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>{loading && <WelcomeLoader onComplete={() => setLoading(false)} />}</AnimatePresence>
      {!loading && (
        <main className="min-h-screen bg-[#F6F7FB] text-[#0B0E11]">
          <div className="fixed inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top_left,rgba(98,0,238,0.12),transparent_35%),radial-gradient(circle_at_top_right,rgba(3,218,197,0.12),transparent_35%)]" />

          <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
              <Link href="/" className="flex items-center gap-3"><BrandMark /><div><p className="font-black">CampusRunner</p><p className="text-xs text-slate-500">Campus errands, simplified</p></div></Link>
              <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
                <a href="#services">Services</a><a href="#flow">How it works</a><a href="#dashboards">Dashboards</a>
              </nav>
              <div className="hidden items-center gap-3 md:flex">
                <Link href="/login" className="rounded-2xl border border-[#E9E4FF] px-4 py-2.5 font-semibold text-[#6200EE]">Login</Link>
                <Link href="/signup" className="rounded-2xl bg-[#6200EE] px-4 py-2.5 font-semibold text-white shadow-lg shadow-violet-500/20">Get started</Link>
              </div>
              <button onClick={() => setOpen(true)} className="md:hidden rounded-2xl border border-[#E9E4FF] p-2.5"><Menu className="h-5 w-5 text-[#6200EE]" /></button>
            </div>
          </header>

          <AnimatePresence>
            {open && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/25 backdrop-blur-sm md:hidden">
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="ml-auto h-full w-[82%] bg-white p-6 shadow-2xl">
                  <div className="mb-8 flex items-center justify-between"><BrandMark /><button onClick={() => setOpen(false)}><X className="h-6 w-6" /></button></div>
                  <div className="space-y-4 text-base font-semibold text-slate-700"><a href="#services" onClick={()=>setOpen(false)} className="block">Services</a><a href="#flow" onClick={()=>setOpen(false)} className="block">How it works</a><a href="#dashboards" onClick={()=>setOpen(false)} className="block">Dashboards</a></div>
                  <div className="mt-8 space-y-3"><Link href="/login" className="block rounded-2xl border border-[#E9E4FF] px-4 py-3 text-center font-semibold text-[#6200EE]">Login</Link><Link href="/signup" className="block rounded-2xl bg-[#6200EE] px-4 py-3 text-center font-semibold text-white">Get started</Link></div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E9E4FF] bg-white px-4 py-2 text-sm font-semibold text-[#6200EE]"><Sparkles className="h-4 w-4 text-[#03DAC5]" />Fintech-grade campus UX</div>
              <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight md:text-6xl">Campus errands with a <span className="bg-[linear-gradient(90deg,#6200EE,#03DAC5)] bg-clip-text text-transparent">premium dashboard feel</span>.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Students request tasks. Runners earn. Admins track the whole flow. Built mobile-first with a clean, non-overlapping layout and fast visual hierarchy.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6200EE] px-6 py-4 font-bold text-white shadow-lg shadow-violet-500/20">Create account <ArrowRight className="h-4 w-4" /></Link><Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-[#E9E4FF] bg-white px-6 py-4 font-bold text-slate-800">View dashboards</Link></div>
              <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-600"><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#00C853]" /> Verified users</span><span className="inline-flex items-center gap-2"><WalletCards className="h-4 w-4 text-[#6200EE]" /> Wallet-first UI</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#03DAC5]" /> Fast order flow</span></div>
            </div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] border border-white/60 bg-white/80 p-3 shadow-2xl shadow-violet-500/10 backdrop-blur-xl">
              <div className="rounded-[28px] border border-[#E9E4FF] bg-[#FBFBFE] p-4">
                <div className="flex items-center justify-between"><div className="flex items-center gap-3"><BrandMark className="h-11 w-11" /><div><p className="font-black">Student Dashboard</p><p className="text-xs text-slate-500">Mobile-first wallet experience</p></div></div><div className="rounded-2xl bg-white p-2 shadow-sm"><Bell className="h-4 w-4 text-[#6200EE]" /></div></div>
                <div className="mt-4 rounded-[28px] bg-[linear-gradient(135deg,#6200EE,#4F2EE8_55%,#03DAC5)] p-5 text-white shadow-lg shadow-violet-500/25">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/70">Available balance</p>
                  <p className="mt-2 text-4xl font-black">₦4,500</p>
                  <div className="mt-4 flex items-center justify-between"><span className="text-sm text-white/80">Top up before your next task</span><button className="rounded-2xl bg-white px-4 py-2 text-sm font-bold text-[#6200EE]">Top up</button></div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {serviceCards.slice(0,6).map((item) => {
                    const Icon = item.icon;
                    return <div key={item.title} className="rounded-3xl border border-[#E9E4FF] bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}><Icon className="h-5 w-5 text-white" /></div>{item.popular && <span className="rounded-full bg-[#E6FFF9] px-2.5 py-1 text-[10px] font-bold text-[#03A894]">POPULAR</span>}</div><p className="font-bold">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.subtitle}</p></div>
                  })}
                </div>
              </div>
            </motion.div>
          </section>

          <section id="services" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <div className="mb-10 max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#6200EE]">Service grid</p><h2 className="mt-3 text-3xl font-black md:text-4xl">The most relatable campus errands, beautifully packaged.</h2></div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{serviceCards.map((item)=>{const Icon=item.icon; return <div key={item.title} className="rounded-[28px] border border-[#E9E4FF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="mb-4 flex items-center justify-between"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}><Icon className="h-5 w-5 text-white" /></div>{item.popular && <span className="rounded-full bg-[#F4ECFF] px-3 py-1 text-[11px] font-bold text-[#6200EE]">Hot</span>}</div><h3 className="text-lg font-black">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{item.subtitle}</p></div>})}</div>
          </section>

          <section id="flow" className="mx-auto max-w-7xl px-4 py-12 md:px-6"><div className="grid gap-4 md:grid-cols-3">{['Choose a service','Post request details','Track from request to completion'].map((step, i)=><div key={step} className="rounded-[28px] border border-[#E9E4FF] bg-white p-6 shadow-sm"><span className="rounded-full bg-[#F4ECFF] px-3 py-1 text-xs font-black text-[#6200EE]">STEP 0{i+1}</span><h3 className="mt-5 text-2xl font-black">{step}</h3><p className="mt-3 text-sm leading-7 text-slate-500">Clean flow, fast response, and a dashboard experience that feels modern on both mobile and desktop.</p></div>)}</div></section>

          <section id="dashboards" className="mx-auto max-w-7xl px-4 py-20 md:px-6"><div className="rounded-[36px] bg-[linear-gradient(135deg,#0B0E11,#161B22)] p-7 text-white md:p-10"><div className="grid gap-6 lg:grid-cols-3"><div className="rounded-[28px] border border-white/10 bg-white/5 p-6"><p className="text-sm text-white/70">Student</p><h3 className="mt-3 text-2xl font-black">ATM-card inspired wallet</h3><p className="mt-3 text-sm leading-7 text-white/70">Large balance card on mobile, tighter summary card on desktop, and instant order shortcuts.</p></div><div className="rounded-[28px] border border-white/10 bg-white/5 p-6"><p className="text-sm text-white/70">Runner</p><h3 className="mt-3 text-2xl font-black">Live jobs and earnings</h3><p className="mt-3 text-sm leading-7 text-white/70">Night-friendly dashboard with earnings emphasis, accept buttons, and compact performance stats.</p></div><div className="rounded-[28px] border border-white/10 bg-white/5 p-6"><p className="text-sm text-white/70">Admin</p><h3 className="mt-3 text-2xl font-black">Control centre</h3><p className="mt-3 text-sm leading-7 text-white/70">Monitor transactions, verify runners, and see order volume without layout clutter.</p></div></div></div></section>
        </main>
      )}
    </>
  );
}
