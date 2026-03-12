'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, CreditCard, LogOut, Package, Settings, Users } from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';
import { BrandMark } from '@/components/ui/BrandMark';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: Activity },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/runners', label: 'Runners', icon: Users },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, logout } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (!user || profile?.role !== 'admin') { router.push('/login'); return null; }
  return (
    <div className="min-h-screen bg-[#F6F7FB] text-[#0B0E11]">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-[280px] border-r border-white/70 bg-white/80 p-6 backdrop-blur md:block">
          <div className="flex items-center gap-3"><BrandMark /><div><p className="font-black">CampusRunner</p><p className="text-xs text-slate-500">Admin console</p></div></div>
          <div className="mt-8 space-y-2">{nav.map(({href,label,icon:Icon}) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${pathname===href?'bg-[#F4ECFF] text-[#6200EE]':'text-slate-600 hover:bg-white'}`}><Icon className="h-4 w-4"/>{label}</Link>)}</div>
          <button onClick={logout} className="mt-10 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"><LogOut className="h-4 w-4" />Logout</button>
        </aside>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
