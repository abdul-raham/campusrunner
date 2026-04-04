'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  Menu,
  Package,
  Pill,
  Printer,
  Shirt,
  ShoppingBasket,
  Sparkles,
  Star,
  Truck,
  UserCheck,
  Wallet,
  Zap,
  Flame,
  ShieldCheck,
  X,
  Lightbulb,
  Cog,
  LogIn,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { ThemeToggle } from './components/theme-toggle';

const services = [
  {
    title: 'Gas Refill',
    subtitle: 'Quick gas pickup and delivery',
    icon: Zap,
  },
  {
    title: 'Market Run',
    subtitle: 'Groceries and essentials from nearby shops',
    icon: ShoppingBasket,
    popular: true,
  },
  {
    title: 'Laundry Pickup',
    subtitle: 'Pickup, clean, and return',
    icon: Shirt,
  },
  {
    title: 'Printing',
    subtitle: 'Assignments, photocopy, binding',
    icon: Printer,
    popular: true,
  },
  {
    title: 'Food Pickup',
    subtitle: 'Meals from cafeterias and restaurants',
    icon: Package,
    popular: true,
  },
  {
    title: 'Parcel Delivery',
    subtitle: 'Fast hostel-to-hostel delivery',
    icon: Truck,
  },
  {
    title: 'Pharmacy',
    subtitle: 'Medicine and personal care essentials',
    icon: Pill,
  },
  {
    title: 'Errand Assistant',
    subtitle: 'Custom requests around campus',
    icon: ClipboardList,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-80px] h-[320px] w-[320px] rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 dark:from-purple-600/10 dark:to-blue-800/10 blur-3xl transition-all duration-500" />
        <div className="absolute right-[-100px] top-[120px] h-[300px] w-[300px] rounded-full bg-gradient-to-l from-blue-400/20 to-cyan-500/20 dark:from-cyan-600/10 dark:to-blue-800/10 blur-3xl transition-all duration-500" />
        <div className="absolute bottom-[-80px] left-[25%] h-[280px] w-[280px] rounded-full bg-gradient-to-t from-purple-400/10 to-pink-500/10 dark:from-pink-600/5 dark:to-purple-800/5 blur-3xl transition-all duration-500" />
      </div>

      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300">
              <Image src="/logo.svg" alt="CampusRunner" width={28} height={28} className="rounded-lg" />
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">CampusRunner</p>
              <p className="-mt-1 text-xs text-gray-600 dark:text-gray-400">Campus errands, simplified</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 transition hover:text-gray-900 dark:hover:text-white">
              Features
            </a>
            <a href="#services" className="text-sm font-medium text-gray-600 dark:text-gray-300 transition hover:text-gray-900 dark:hover:text-white">
              Services
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 transition hover:text-gray-900 dark:hover:text-white">
              How it works
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 transition hover:border-blue-400/40 dark:hover:border-blue-400/40 hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-600/20 transition hover:translate-y-[-1px] hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <a href="#features" className="font-medium text-gray-600 dark:text-gray-300">
                Features
              </a>
              <a href="#services" className="font-medium text-gray-600 dark:text-gray-300">
                Services
              </a>
              <a href="#how-it-works" className="font-medium text-gray-600 dark:text-gray-300">
                How it works
              </a>
              <div className="flex gap-3 pt-4">
                <Link
                  href="/login"
                  className="flex-1 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-center font-medium text-gray-900 dark:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 text-center font-bold text-white"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-12 md:px-6 md:pb-28 md:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 shadow-sm backdrop-blur transition-colors duration-300"
            >
              <Sparkles className="h-4 w-4 text-cyan-500" />
              Campus life just got easier
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="max-w-3xl text-3xl font-black leading-[1.1] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight"
            >
              Get campus errands done{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                fast, safely, and beautifully
              </span>
              .
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="mt-6 max-w-2xl text-sm sm:text-base md:text-lg leading-7 sm:leading-8 md:leading-8 text-gray-600 dark:text-gray-400"
            >
              CampusRunner connects students with trusted runners for market runs,
              food pickup, laundry, printing, pharmacy errands, parcel delivery,
              and custom campus tasks — all in one modern platform.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={4}
              className="mt-8 flex flex-col gap-3 sm:gap-4 sm:flex-row"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 dark:bg-blue-600 px-5 sm:px-7 py-3 sm:py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-blue-600/20 dark:shadow-blue-600/20 transition hover:translate-y-[-2px] hover:bg-blue-700 dark:hover:bg-blue-700"
              >
                Create Account
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-5 sm:px-7 py-3 sm:py-4 text-sm sm:text-base font-bold text-gray-900 dark:text-white transition hover:border-blue-600/40 dark:hover:border-blue-400/40 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Explore Services
              </a>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={5}
              className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Verified runners
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-cyan-500" />
                Transparent pricing
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                Built for campus life
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative"
          >
            <div className="mx-auto w-full max-w-[430px] rounded-[32px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-2xl shadow-blue-600/10 backdrop-blur-xl">
              <div className="rounded-[26px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
                      <Image src="/logo.svg" alt="CampusRunner" width={28} height={28} className="rounded-lg" />
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900 dark:text-white">CampusRunner</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Student Dashboard</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-gray-800 p-2 shadow-sm">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-500 p-5 text-white shadow-xl shadow-blue-600/20">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/75">
                    Wallet balance
                  </p>
                  <p className="mt-2 text-4xl font-black">₦4,500</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-white/80">Ready for your next errand</p>
                    <button className="rounded-xl bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/30">
                      Top Up
                    </button>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-extrabold tracking-wide text-gray-900 dark:text-white">
                      Campus Services
                    </p>
                    <span className="rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-xs font-bold text-green-700 dark:text-green-300">
                      Popular on Campus
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { title: 'Gas Refill', icon: Zap },
                      { title: 'Market Run', icon: ShoppingBasket, popular: true },
                      { title: 'Laundry', icon: Shirt },
                      { title: 'Printing', icon: Printer, popular: true },
                      { title: 'Food Pickup', icon: Package, popular: true },
                      { title: 'Errand', icon: ClipboardList },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.title}
                          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                          <div className="mb-3 flex items-start justify-between">
                            <div className="rounded-xl bg-blue-50 dark:bg-blue-900 p-2">
                              <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            {item.popular && (
                              <span className="rounded-full bg-green-100 dark:bg-green-900 px-2 py-1 text-[10px] font-bold text-green-700 dark:text-green-300">
                                POPULAR
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</p>
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Fast campus help</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rest of sections with dark mode support... */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
            Why students will love it
          </div>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl">
            A smoother way to handle campus errands
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Every part of CampusRunner is designed to feel fast, trusted, and easy
            to use.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'For Students',
              icon: UserCheck,
              color: 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
              points: [
                'Post an errand in seconds',
                'Track progress from request to delivery',
                'Use trusted campus runners',
                'Get cleaner, more organized task flow',
              ],
            },
            {
              title: 'For Runners',
              icon: Truck,
              color: 'bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
              points: [
                'Find available jobs nearby',
                'Accept tasks and earn quickly',
                'Build ratings and reputation',
                'Use a dashboard built for speed',
              ],
            },
            {
              title: 'Why It Wins',
              icon: Flame,
              color: 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400',
              points: [
                'Campus-specific use cases',
                'Beautiful mobile-first interface',
                'Stronger trust and social proof',
                'Designed to scale beyond one campus',
              ],
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={index + 1}
                className="group rounded-[28px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black">{feature.title}</h3>
                <ul className="mt-5 space-y-3 text-gray-600 dark:text-gray-400">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
                <Image src="/logo.svg" alt="CampusRunner" width={24} height={24} className="rounded-lg" />
              </div>
              <div>
                <p className="font-extrabold">CampusRunner</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Campus errands, simplified</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
            <a href="#features" className="transition hover:text-blue-600 dark:hover:text-blue-400">Features</a>
            <a href="#services" className="transition hover:text-blue-600 dark:hover:text-blue-400">Services</a>
            <a href="#how-it-works" className="transition hover:text-blue-600 dark:hover:text-blue-400">How it works</a>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2026 CampusRunner. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
