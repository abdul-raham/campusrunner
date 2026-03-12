'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, CreditCard, Home, LogOut, Package, User } from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';
import { BrandMark } from '@/components/ui/BrandMark';

const nav = [
  { href: '/student', label: 'Home', icon: Home },
  { href: '/student/orders', label: 'Orders', icon: Package },
  { href: '/student/wallet', label: 'Wallet', icon: CreditCard },
  { href: '/student/notifications', label: 'Alerts', icon: Bell },
  { href: '/student/profile', label: 'Profile', icon: User },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, logout } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (!user || profile?.role !== 'student') { router.push('/login'); return null; }
  return (
    <div className="min-h-screen bg-[#F6F7FB] text-[#0B0E11]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="hidden w-[260px] border-r border-white/70 bg-white/70 p-6 backdrop-blur lg:block">
          <div className="flex items-center gap-3"><BrandMark /><div><p className="font-black">CampusRunner</p><p className="text-xs text-slate-500">Student panel</p></div></div>
          <div className="mt-8 space-y-2">{nav.map(({href,label,icon:Icon}) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${pathname===href?'bg-[#F4ECFF] text-[#6200EE]':'text-slate-600 hover:bg-white'}`}><Icon className="h-4 w-4"/>{label}</Link>)}</div>
          <button onClick={logout} className="mt-10 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"><LogOut className="h-4 w-4" />Logout</button>
        </aside>
        <div className="flex-1 pb-24 lg:pb-0">{children}</div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-white/90 px-3 py-2 backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-1">{nav.map(({href,label,icon:Icon}) => <Link key={href} href={href} className={`rounded-2xl px-2 py-2 text-center text-[11px] font-semibold ${pathname===href?'bg-[#F4ECFF] text-[#6200EE]':'text-slate-500'}`}><Icon className="mx-auto mb-1 h-4 w-4" />{label}</Link>)}</div>
      </nav>
    </div>
  );
}
