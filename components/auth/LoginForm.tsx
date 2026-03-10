'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function LoginFormComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg">
          <Image src="/logo.png" alt="CampusRunner" width={32} height={32} className="rounded-lg" />
        </div>
        <h1 className="text-2xl font-black">Welcome back</h1>
        <p className="mt-2 text-sm text-[#6B7280]">Sign in to your CampusRunner account</p>
      </div>

      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#374151]">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#374151]">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#6200EE] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#5A00D6]"
        >
          Sign In
        </button>
      </form>

      <div className="text-center text-sm text-[#6B7280]">
        Don't have an account?{' '}
        <Link href="/signup" className="font-medium text-[#6200EE] hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}