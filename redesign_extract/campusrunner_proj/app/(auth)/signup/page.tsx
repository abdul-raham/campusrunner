'use client';

import Link from 'next/link';
import { Zap, Users, Truck, BarChart3 } from 'lucide-react';
import Image from 'next/image';

export default function SignupChoicePage() {
  return (
    <main className="min-h-screen bg-[#F6F7FB] text-[#0B0E11]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-80px] h-[320px] w-[320px] rounded-full bg-[#6200EE]/20 blur-3xl" />
        <div className="absolute right-[-100px] top-[120px] h-[300px] w-[300px] rounded-full bg-[#03DAC5]/20 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[25%] h-[280px] w-[280px] rounded-full bg-[#4F2EE8]/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-lg">
                <Image src="/logo.png" alt="CampusRunner" width={28} height={28} className="rounded-lg" />
              </div>
              <div>
                <p className="text-lg font-extrabold tracking-tight">CampusRunner</p>
                <p className="-mt-1 text-xs text-[#6B7280]">Campus errands, simplified</p>
              </div>
            </div>
            <p className="text-lg text-[#6B7280]">
              Campus logistics and errand marketplace
            </p>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <Link href="/student-signup">
              <div className="group cursor-pointer rounded-[28px] border border-[#E9E4FF] bg-white/70 p-8 shadow-lg backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF8FF]">
                  <Users className="h-8 w-8 text-[#2563EB]" />
                </div>
                <h2 className="mb-2 text-2xl font-black">I'm a Student</h2>
                <p className="mb-6 text-[#6B7280]">
                  Request errands from nearby student runners
                </p>
                <ul className="space-y-2 text-sm text-[#6B7280]">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00C853]"></div>
                    Request campus errands
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00C853]"></div>
                    Track orders in real-time
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00C853]"></div>
                    Rate your runners
                  </li>
                </ul>
              </div>
            </Link>

            <Link href="/runner-signup">
              <div className="group cursor-pointer rounded-[28px] border border-[#E9E4FF] bg-white/70 p-8 shadow-lg backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4ECFF]">
                  <Truck className="h-8 w-8 text-[#6200EE]" />
                </div>
                <h2 className="mb-2 text-2xl font-black">I'm a Runner</h2>
                <p className="mb-6 text-[#6B7280]">
                  Accept tasks and earn money on campus
                </p>
                <ul className="space-y-2 text-sm text-[#6B7280]">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00C853]"></div>
                    Accept available tasks
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00C853]"></div>
                    Earn money instantly
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00C853]"></div>
                    Build your reputation
                  </li>
                </ul>
              </div>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-[#6B7280]">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[#6200EE] transition hover:text-[#4F2EE8]">
                Login here
              </Link>
            </p>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 rounded-[28px] border border-white/60 bg-white/70 p-6 text-center shadow-lg backdrop-blur">
            <div>
              <p className="text-2xl font-black text-[#6200EE]">500+</p>
              <p className="text-sm text-[#6B7280]">Active Users</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#6200EE]">2000+</p>
              <p className="text-sm text-[#6B7280]">Tasks Completed</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#6200EE]">4.8★</p>
              <p className="text-sm text-[#6B7280]">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
