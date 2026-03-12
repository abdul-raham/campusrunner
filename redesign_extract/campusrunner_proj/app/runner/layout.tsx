'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CreditCard, Home, LogOut, Package, User } from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';
import { BrandMark } from '@/components/ui/BrandMark';

const nav = [
  { href: '/runner', label: 'Home', icon: Home },
  { href: '/runner/jobs', label: 'Jobs', icon: Package },
  { href: '/runner/earnings', label: 'Earnings', icon: CreditCard },
  { href: '/runner/profile', label: 'Profile', icon: User },
];

export default function RunnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, logout } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#0B0E11] text-white">Loading...</div>;
  if (!user || profile?.role !== 'runner') { router.push('/login'); return null; }
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="hidden w-[260px] border-r border-white/10 bg-white/5 p-6 backdrop-blur lg:block">
          <div className="flex items-center gap-3"><BrandMark /><div><p className="font-black">CampusRunner</p><p className="text-xs text-white/60">Runner panel</p></div></div>
          <div className="mt-8 space-y-2">{nav.map(({href,label,icon:Icon}) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${pathname===href?'bg-white/10 text-white':'text-white/70 hover:bg-white/5'}`}><Icon className="h-4 w-4"/>{label}</Link>)}</div>
          <button onClick={logout} className="mt-10 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/10"><LogOut className="h-4 w-4" />Logout</button>
        </aside>
        <div className="flex-1 pb-24 lg:pb-0">{children}</div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#11151B]/90 px-3 py-2 backdrop-blur lg:hidden">
        <div className="grid grid-cols-4 gap-1">{nav.map(({href,label,icon:Icon}) => <Link key={href} href={href} className={`rounded-2xl px-2 py-2 text-center text-[11px] font-semibold ${pathname===href?'bg-white/10 text-white':'text-white/60'}`}><Icon className="mx-auto mb-1 h-4 w-4" />{label}</Link>)}</div>
      </nav>
    </div>
  );
}
