import { recentOrders } from '@/src/constants/mock-data';

export default function StudentOrdersPage() {
  return <div className="px-4 py-5 md:px-8 md:py-8"><h1 className="text-2xl font-black">My orders</h1><div className="mt-5 space-y-3">{recentOrders.map((order)=><div key={order.id} className="rounded-[28px] border border-[#E9E4FF] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-400">{order.id}</p><h3 className="font-black">{order.service}</h3><p className="text-sm text-slate-500">{order.runner}</p></div><div className="text-right"><p className="font-black text-[#6200EE]">{order.amount}</p><span className="rounded-full bg-[#F4ECFF] px-3 py-1 text-xs font-bold text-[#6200EE]">{order.status}</span></div></div></div>)}</div></div>;
}
