# Code Reference: Key Changes

This document shows the exact code differences for critical files between current and redesign versions.

---

## 1. package.json - Dependencies Comparison

### Current (23 dependencies)
```json
{
  "dependencies": {
    "@base-ui/react": "^1.2.0",
    "@hookform/resolvers": "^5.2.2",
    "@supabase/auth-helpers-nextjs": "^0.15.0",
    "@supabase/ssr": "^0.9.0",
    "@supabase/supabase-js": "^2.99.0",
    "@tailwindcss/forms": "^0.5.11",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.35.2",
    "lucide-react": "^0.577.0",
    "next": "16.1.6",
    "prettier": "^3.8.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-hook-form": "^7.71.2",
    "shadcn": "^4.0.2",
    "tailwind-merge": "^3.5.0",
    "tw-animate-css": "^1.4.0",
    "zod": "^4.3.6",
    "zustand": "^5.0.11"
  }
}
```

### Redesign (5 dependencies - MINIMAL)
```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.468.0",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### What to Remove:
```bash
npm uninstall @base-ui/react @hookform/resolvers @supabase/auth-helpers-nextjs \
  @supabase/ssr @supabase/supabase-js @tailwindcss/forms class-variance-authority \
  clsx prettier react-hook-form shadcn tailwind-merge tw-animate-css zod zustand
```

---

## 2. tsconfig.json - Configuration Changes

### Current
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./components/*"]
    }
  }
}
```

### Redesign (Key Changes)
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": false,                    // ← CHANGED
    "jsx": "preserve",                   // ← CHANGED
    "baseUrl": ".",                      // ← NEW
    "paths": {
      "@/*": ["./*"],                    // ← CHANGED
      "@/components/*": ["components/*"], // ← CHANGED
      "@/src/*": ["src/*"]               // ← NEW
    }
  }
}
```

---

## 3. src/hooks/useAuth.ts - Complete Rewrite

### Current (Supabase-based)
```typescript
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import type { Profile, UserRole } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          setProfile(profileData);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return { user, profile, loading };
};
```

### Redesign (localStorage Demo)
```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getDemoSession, logoutDemoUser } from '@/src/lib/demo-auth';
import type { Profile } from '@/src/types';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const session = getDemoSession();
      setUser(session);
      setProfile(session);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    logoutDemoUser();
    setUser(null);
    setProfile(null);
    router.push('/login');
  };

  return { user, profile, loading };
};
```

**Key Differences:**
- ❌ Remove: `supabase` client calls, database queries
- ✅ Add: `getDemoSession()`, `logoutDemoUser()` from demo-auth
- ✅ Simplify: No async/await, no error handling for demo
- ✅ Benefit: No backend needed, instant operation

---

## 4. components/ui/BrandMark.tsx - NEW FILE

```typescript
export function BrandMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <div className={`${className} rounded-2xl bg-[linear-gradient(135deg,#6200EE,#03DAC5)] p-[1px] shadow-lg shadow-violet-500/20`}>
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
        <span className="text-lg font-black text-white">⚡</span>
      </div>
    </div>
  );
}
```

**Usage:**
```typescript
<BrandMark />                    // Default h-10 w-10
<BrandMark className="h-14 w-14" /> // Large version
```

---

## 5. src/constants/mock-data.ts - NEW FILE

```typescript
import { Bell, ClipboardList, Package, Pill, Printer, Shirt, ShoppingBasket, Truck, WalletCards, Zap } from 'lucide-react';

export const serviceCards = [
  { title: 'Gas Refill', subtitle: 'Refill and deliver cooking gas', icon: Zap, color: 'from-violet-500 to-fuchsia-500' },
  { title: 'Market Run', subtitle: 'Groceries and quick essentials', icon: ShoppingBasket, color: 'from-cyan-500 to-teal-400', popular: true },
  { title: 'Laundry Pickup', subtitle: 'Pickup, clean, and return', icon: Shirt, color: 'from-blue-500 to-indigo-500' },
  { title: 'Printing', subtitle: 'Print, photocopy, and bind fast', icon: Printer, color: 'from-amber-500 to-orange-500', popular: true },
  { title: 'Food Pickup', subtitle: 'Meals from campus vendors', icon: Package, color: 'from-emerald-500 to-lime-500', popular: true },
  { title: 'Parcel Delivery', subtitle: 'Hostel-to-hostel fast dropoff', icon: Truck, color: 'from-slate-600 to-slate-400' },
  { title: 'Pharmacy', subtitle: 'Drugs and care essentials', icon: Pill, color: 'from-pink-500 to-rose-500' },
  { title: 'Errand Assistant', subtitle: 'Custom requests around campus', icon: ClipboardList, color: 'from-violet-500 to-cyan-500' },
];

export const studentStats = [
  { label: 'Wallet Balance', value: '₦4,500', icon: WalletCards },
  { label: 'Open Orders', value: '03', icon: Package },
  { label: 'Unread Alerts', value: '07', icon: Bell },
];

export const recentOrders = [
  { id: 'CR-1102', service: 'Printing', amount: '₦1,200', status: 'In Progress', eta: '12 mins', runner: 'Ayo J.' },
  { id: 'CR-1098', service: 'Food Pickup', amount: '₦2,500', status: 'Completed', eta: 'Delivered', runner: 'Sarah K.' },
  { id: 'CR-1092', service: 'Market Run', amount: '₦3,400', status: 'Pending', eta: 'Awaiting runner', runner: '—' },
];

export const runnerJobs = [
  { id: 'JB-201', service: 'Market Run', pickup: 'Campus Mart', dropoff: 'Hall 3', amount: '₦1,200', urgent: true },
  { id: 'JB-202', service: 'Printing', pickup: 'ICT Centre', dropoff: 'LT 2', amount: '₦800' },
  { id: 'JB-203', service: 'Parcel Delivery', pickup: 'Hall 1', dropoff: 'Hostel C', amount: '₦600' },
];

export const adminMetrics = [
  { label: 'Platform Volume', value: '₦482k', delta: '+14%' },
  { label: 'Pending Orders', value: '18', delta: 'Live' },
  { label: 'Verified Runners', value: '124', delta: '+9' },
  { label: 'Disputes', value: '02', delta: 'Needs review' },
];
```

---

## 6. components/auth/RunnerSignupForm.tsx - Comparison

### Current (Supabase)
```typescript
'use client';
import { supabase } from '@/supabase/client';

export function RunnerSignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    university: '',
    hostel_location: '',
    password: '',
    confirmPassword: ''
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    if (authError) throw authError;
    
    const { error: profileError } = await supabase.from('profiles').insert([{
      id: authData.user.id,
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      university: formData.university,
      hostel_location: formData.hostel_location,
      role: 'runner',
    }]);
    
    router.push('/runner');
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Many individual input fields */}
      <input type="text" value={formData.full_name} onChange={(e) => ...} />
      <input type="email" value={formData.email} onChange={(e) => ...} />
      {/* ... 6+ more inputs ... */}
      <button>{loading ? 'Creating account...' : 'Continue as Runner'}</button>
    </form>
  );
}
```

### Redesign (Demo Auth)
```typescript
'use client';
import Link from 'next/link';
import { registerDemoUser } from '@/src/lib/demo-auth';
import { BrandMark } from '@/components/ui/BrandMark';

export function RunnerSignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ full_name:'', email:'', phone:'', university:'', hostel_location:'', password:'' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      registerDemoUser({ ...form, role: 'runner' });
      router.push('/runner');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="mb-2 text-center">
        <div className="mx-auto mb-4 w-fit"><BrandMark className="h-14 w-14" /></div>
        <h1 className="text-2xl font-black">Create runner account</h1>
        <p className="mt-2 text-sm text-slate-500">Accept jobs and earn on campus.</p>
      </div>
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      
      {/* Dynamic field rendering */}
      {[
        ['full_name','Full name',User,'Your full name'],
        ['email','Email',Mail,'runner@school.edu'],
        ['phone','Phone',Phone,'0800 000 0000'],
        ['university','University',User,'Your university'],
        ['hostel_location','Current location',MapPin,'Hall 5'],
        ['password','Password',Lock,'Choose a password']
      ].map(([key,label,Icon,placeholder]: any)=>(
        <label key={key} className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-600">{label}</span>
          <div className="relative">
            <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
            <input 
              type={key==='password'?'password':key==='email'?'email':'text'} 
              value={(form as any)[key]} 
              onChange={(e)=>setForm({...form,[key]:e.target.value})} 
              required 
              className="w-full rounded-2xl border border-[#E9E4FF] bg-white px-11 py-3.5 outline-none transition focus:border-[#6200EE]" 
              placeholder={placeholder} 
            />
          </div>
        </label>
      ))}
      
      <button disabled={loading} className="w-full rounded-2xl bg-[linear-gradient(135deg,#6200EE,#4F2EE8)] px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-500/20 disabled:opacity-60">
        {loading ? 'Creating account...' : 'Continue as Runner'}
      </button>
      <p className="text-center text-sm text-slate-500">
        Already registered? <Link href="/login" className="font-semibold text-[#6200EE]">Login</Link>
      </p>
    </form>
  );
}
```

**Key Changes:**
- ❌ Remove: `supabase.auth.signUp()`, database insert, error handling
- ✅ Add: `registerDemoUser()` call
- ✅ Add: `BrandMark` component usage
- ✅ Refactor: Dynamic form field mapping instead of individual inputs
- ✅ Result: ~40% less code, same visual result

---

## 7. app/student/page.tsx - Simplification Example

### Current (~200 lines)
```typescript
'use client';

export default function StudentDashboard() {
  const [showBalance, setShowBalance] = useState(true);

  const quickActions = [
    { label: 'Market Run', emoji: '🛒', color: 'from-blue-500 to-blue-600' },
    // ...
  ];

  const recentOrders = [
    { id: 1, service: 'Market Run', runner: 'John D.', status: 'In Progress', amount: '₦2,500', time: '15 mins ago' },
    // ...
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F7FB] via-white to-[#F0EBFF] pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Extensive inline JSX */}
        <motion.div>
          {/* Wallet card with lots of styling and animation */}
        </motion.div>
        {/* Multiple grid sections with detailed components */}
      </div>
    </div>
  );
}
```

### Redesign (~50 lines)
```typescript
'use client';

import { useMemo, useState } from 'react';
import { Bell, ChevronRight, Plus, Search } from 'lucide-react';
import { recentOrders, serviceCards } from '@/src/constants/mock-data';
import { useAuth } from '@/src/hooks/useAuth';

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [query, setQuery] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const services = useMemo(() => 
    serviceCards.filter((s) => s.title.toLowerCase().includes(query.toLowerCase())), 
    [query]
  );

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
        {/* ... more sections ... */}
      </section>

      <section className="mt-6">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-black">Campus services</h2><span className="rounded-full bg-[#E6FFF9] px-3 py-1 text-xs font-bold text-[#03A894]">Mobile first</span></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((item)=>{
            const Icon=item.icon; 
            return <button key={item.title} className="rounded-[28px] border border-[#E9E4FF] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                {item.popular && <span className="rounded-full bg-[#F4ECFF] px-3 py-1 text-[10px] font-bold text-[#6200EE]">POPULAR</span>}
              </div>
              <h3 className="font-black">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.subtitle}</p>
            </button>
          })}
        </div>
      </section>

      <section className="mt-6 rounded-[30px] border border-[#E9E4FF] bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-black">Recent orders</h2><button className="text-sm font-semibold text-[#6200EE]">See all</button></div>
        <div className="space-y-3">
          {recentOrders.map((order)=> 
            <div key={order.id} className="flex items-center justify-between rounded-2xl border border-[#F0EEFF] p-4">
              <div><p className="text-xs text-slate-400">{order.id}</p><h3 className="font-bold">{order.service}</h3><p className="text-sm text-slate-500">Runner: {order.runner}</p></div>
              <div className="text-right"><p className="font-black text-[#6200EE]">{order.amount}</p><p className="text-xs text-slate-500">{order.status}</p></div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
```

**Key Differences:**
- ❌ Remove: Inline data arrays, complex animations, verbose styling
- ✅ Add: Import mock data from constants
- ✅ Add: Filter logic for service search
- ✅ Add: Profile name in greeting using `useAuth()`
- ✅ Result: 75% less code, data is now reusable

---

## 8. src/lib/demo-auth.ts - NEW FILE (excerpt)

```typescript
'use client';

import type { Profile, UserRole } from '@/src/types';

const USERS_KEY = 'campusrunner_demo_users';
const SESSION_KEY = 'campusrunner_demo_session';

export type DemoUserRecord = Profile & { password: string };

const now = () => new Date().toISOString();
const id = () => Math.random().toString(36).slice(2, 10);

function seedUsers() {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return;
  
  const admin: DemoUserRecord = {
    id: 'admin-demo-1',
    full_name: 'Campus Admin',
    email: 'admin@campusrunner.app',
    phone: '+2348000000000',
    role: 'admin',
    university: 'CampusRunner University',
    hostel_location: 'Admin Block',
    avatar_url: null,
    created_at: now(),
    password: 'admin123',
  };
  localStorage.setItem(USERS_KEY, JSON.stringify([admin]));
}

export function registerDemoUser(input: {
  full_name: string;
  email: string;
  phone: string;
  university: string;
  hostel_location: string;
  password: string;
  role: UserRole;
}) {
  const users = getUsers();
  users.push({
    ...input,
    id: id(),
    avatar_url: null,
    created_at: now(),
  });
  saveUsers(users);
  setDemoSession({ ...input, id: users[users.length - 1].id });
}

export function getDemoSession(): Profile | null {
  if (typeof window === 'undefined') return null;
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}

export function setDemoSession(user: Profile) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function logoutDemoUser() {
  localStorage.removeItem(SESSION_KEY);
}
```

---

## Summary Table

| Aspect | Current Approach | Redesign Approach |
|--------|------------------|-------------------|
| **Auth** | Supabase Cloud | localStorage Demo |
| **Database** | Remote Postgres | In-memory objects |
| **Form Validation** | Zod schemas | None (browser validates) |
| **UI Components** | Custom + Shadcn | Custom only |
| **Dependencies** | 23 packages | 5 packages |
| **Build Config** | Custom files | Next.js defaults |
| **Page Component Size** | 150-200 lines | 40-50 lines |
| **Data Definition** | Inline in components | Centralized constants |
| **TypeScript** | Strict mode | Loose mode |
| **Purpose** | Production-ready | Rapid prototyping/demo |

