import { adminMetrics } from '@/src/constants/mock-data';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div><p className="text-sm font-semibold text-[#6200EE]">Platform overview</p><h1 className="text-3xl font-black">Admin dashboard</h1></div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{adminMetrics.map((item)=><div key={item.label} className="rounded-[28px] border border-[#E9E4FF] bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">{item.label}</p><h2 className="mt-3 text-3xl font-black">{item.value}</h2><p className="mt-2 text-xs font-semibold text-[#6200EE]">{item.delta}</p></div>)}</section>
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]"><div className="rounded-[28px] border border-[#E9E4FF] bg-white p-6 shadow-sm"><h2 className="text-xl font-black">Orders snapshot</h2><div className="mt-5 space-y-3">{['Pending verification payout','Printing surge in Hall 2','Runner response improved 11%'].map((x)=><div key={x} className="rounded-2xl bg-[#F8F9FE] p-4 text-sm text-slate-600">{x}</div>)}</div></div><div className="rounded-[28px] border border-[#E9E4FF] bg-[linear-gradient(135deg,#6200EE,#4F2EE8)] p-6 text-white shadow-sm"><p className="text-sm text-white/70">Commission summary</p><h2 className="mt-3 text-4xl font-black">₦128,450</h2><p className="mt-2 text-sm text-white/70">Platform commission this month</p></div></section>
    </div>
  );
}
