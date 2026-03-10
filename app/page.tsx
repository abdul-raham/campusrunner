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
import AnimatedLoader from '@/components/AnimatedLoader';
import WelcomeLoader from '@/components/WelcomeLoader';

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
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <WelcomeLoader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      
      {!isLoading && (
    <main className="min-h-screen overflow-x-hidden bg-[#F6F7FB] text-[#0B0E11]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-80px] h-[320px] w-[320px] rounded-full bg-[#6200EE]/20 blur-3xl" />
        <div className="absolute right-[-100px] top-[120px] h-[300px] w-[300px] rounded-full bg-[#03DAC5]/20 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[25%] h-[280px] w-[280px] rounded-full bg-[#4F2EE8]/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/30 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-lg">
              <Image src="/logo.png" alt="CampusRunner" width={28} height={28} className="rounded-lg" />
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight">CampusRunner</p>
              <p className="-mt-1 text-xs text-[#6B7280]">Campus errands, simplified</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-[#6B7280] transition hover:text-[#0B0E11]">
              Features
            </a>
            <a href="#services" className="text-sm font-medium text-[#6B7280] transition hover:text-[#0B0E11]">
              Services
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-[#6B7280] transition hover:text-[#0B0E11]">
              How it works
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-xl border border-[#E9E4FF] bg-white px-5 py-2.5 text-sm font-semibold text-[#6200EE] transition hover:border-[#6200EE]/40 hover:bg-[#F8F5FF]"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-[#6200EE] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6200EE]/20 transition hover:translate-y-[-1px] hover:bg-[#4F2EE8]"
            >
              Get Started
            </Link>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-[#E9E4FF] bg-white p-2.5 shadow-sm hover:shadow-md transition"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-[#6200EE]" />
              ) : (
                <Menu className="h-5 w-5 text-[#6200EE]" />
              )}
            </motion.div>
          </button>
        </div>

        {/* Mobile Menu - Glassmorphic */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 top-[68px] z-40 bg-black/20 backdrop-blur-sm md:hidden"
              />

              {/* Menu */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="absolute left-0 right-0 top-[68px] z-50 border-b border-white/30 bg-white/80 backdrop-blur-2xl md:hidden"
              >
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                  {/* Navigation Links */}
                  <div className="mb-6 space-y-2">
                    <motion.a 
                      href="#features"
                      onClick={() => setMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 }}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#0B0E11] transition hover:bg-[#F4ECFF] hover:text-[#6200EE]"
                    >
                      <Lightbulb className="h-5 w-5" />
                      <span>Features</span>
                    </motion.a>

                    <motion.a 
                      href="#services"
                      onClick={() => setMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#0B0E11] transition hover:bg-[#F4ECFF] hover:text-[#6200EE]"
                    >
                      <Sparkles className="h-5 w-5" />
                      <span>Services</span>
                    </motion.a>

                    <motion.a 
                      href="#how-it-works"
                      onClick={() => setMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#0B0E11] transition hover:bg-[#F4ECFF] hover:text-[#6200EE]"
                    >
                      <Cog className="h-5 w-5" />
                      <span>How it works</span>
                    </motion.a>
                  </div>

                  {/* Divider */}
                  <div className="my-4 h-px bg-gradient-to-r from-[#E9E4FF]/0 via-[#E9E4FF] to-[#E9E4FF]/0" />

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-[#E9E4FF] bg-white px-5 py-3 text-sm font-semibold text-[#6200EE] transition hover:bg-[#F8F5FF] hover:border-[#6200EE]/40 hover:shadow-lg"
                      >
                        <LogIn className="h-4 w-4" />
                        Login
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <Link
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6200EE] to-[#4F2EE8] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#6200EE]/20 transition hover:shadow-xl hover:shadow-[#6200EE]/30"
                      >
                        <Sparkles className="h-4 w-4" />
                        Get Started
                      </Link>
                    </motion.div>
                  </div>

                  {/* Info Message */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 rounded-2xl border border-[#E9E4FF] bg-white/50 p-3 text-center text-xs text-[#6B7280]"
                  >
                    ✨ Campus errands, beautifully simple
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-12 md:px-6 md:pb-28 md:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E9E4FF] bg-white/80 px-4 py-2 text-sm font-semibold text-[#4F2EE8] shadow-sm backdrop-blur"
            >
              <Sparkles className="h-4 w-4 text-[#03DAC5]" />
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
              <span className="bg-gradient-to-r from-[#6200EE] to-[#03DAC5] bg-clip-text text-transparent">
                fast, safely, and beautifully
              </span>
              .
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="mt-6 max-w-2xl text-sm sm:text-base md:text-lg leading-7 sm:leading-8 md:leading-8 text-[#6B7280]"
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
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6200EE] px-5 sm:px-7 py-3 sm:py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-[#6200EE]/20 transition hover:translate-y-[-2px] hover:bg-[#4F2EE8]"
              >
                Create Account
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E9E4FF] bg-white px-5 sm:px-7 py-3 sm:py-4 text-sm sm:text-base font-bold text-[#0B0E11] transition hover:border-[#6200EE]/40 hover:bg-[#F8F5FF]"
              >
                Explore Services
              </a>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={5}
              className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[#6B7280]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#00C853]" />
                Verified runners
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-[#03DAC5]" />
                Transparent pricing
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#6200EE]" />
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
            <div className="absolute -left-8 top-14 hidden rounded-2xl border border-white/50 bg-white/70 p-4 shadow-xl backdrop-blur md:block">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#E6FFF9] p-2">
                  <Bell className="h-5 w-5 text-[#03DAC5]" />
                </div>
                <div>
                  <p className="text-sm font-bold">Order accepted</p>
                  <p className="text-xs text-[#6B7280]">Your runner is on the move</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-10 hidden rounded-2xl border border-white/50 bg-white/70 p-4 shadow-xl backdrop-blur md:block">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#F4ECFF] p-2">
                  <Star className="h-5 w-5 text-[#6200EE]" />
                </div>
                <div>
                  <p className="text-sm font-bold">Campus Hero</p>
                  <p className="text-xs text-[#6B7280]">Top-rated runner nearby</p>
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[430px] rounded-[32px] border border-white/60 bg-white/70 p-3 shadow-2xl shadow-[#6200EE]/10 backdrop-blur-xl">
              <div className="rounded-[26px] border border-[#E9E4FF] bg-[#F9FAFD] p-4">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-lg">
                      <Image src="/logo.png" alt="CampusRunner" width={28} height={28} className="rounded-lg" />
                    </div>
                    <div>
                      <p className="font-extrabold">CampusRunner</p>
                      <p className="text-xs text-[#6B7280]">Student Dashboard</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-2 shadow-sm">
                    <Bell className="h-4 w-4 text-[#6200EE]" />
                  </div>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] p-5 text-white shadow-xl shadow-[#6200EE]/20">
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
                    <p className="text-sm font-extrabold tracking-wide text-[#0B0E11]">
                      Campus Services
                    </p>
                    <span className="rounded-full bg-[#E6FFF9] px-3 py-1 text-xs font-bold text-[#03A894]">
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
                          className="rounded-2xl border border-[#E9E4FF] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                          <div className="mb-3 flex items-start justify-between">
                            <div className="rounded-xl bg-[#F4ECFF] p-2">
                              <Icon className="h-5 w-5 text-[#6200EE]" />
                            </div>
                            {item.popular && (
                              <span className="rounded-full bg-[#E6FFF9] px-2 py-1 text-[10px] font-bold text-[#03A894]">
                                POPULAR
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-bold text-[#0B0E11]">{item.title}</p>
                          <p className="mt-1 text-xs text-[#6B7280]">Fast campus help</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#E9E4FF] bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#6200EE] to-[#03DAC5]" />
                    <div className="flex-1">
                      <p className="text-sm font-bold">Runner of the Week</p>
                      <p className="text-xs text-[#6B7280]">Campus Hero • 4.9 rating</p>
                    </div>
                    <div className="rounded-xl bg-[#F4ECFF] px-3 py-2 text-sm font-bold text-[#6200EE]">
                      ⭐ 4.9
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2 rounded-2xl border border-[#E9E4FF] bg-white p-2 shadow-sm">
                  {['Home', 'Orders', 'Activity', 'Profile'].map((tab, i) => (
                    <div
                      key={tab}
                      className={`rounded-xl px-2 py-3 text-center text-xs font-semibold ${
                        i === 0
                          ? 'bg-[#F4ECFF] text-[#6200EE]'
                          : 'text-[#6B7280]'
                      }`}
                    >
                      {tab}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="grid gap-4 rounded-[32px] border border-white/60 bg-white/70 p-5 shadow-lg backdrop-blur md:grid-cols-3 md:p-6">
          {[
            {
              title: 'Fast requests',
              value: '8 services',
              subtitle: 'Everything students need most',
            },
            {
              title: 'Built for trust',
              value: 'Verified runners',
              subtitle: 'Safer campus transactions',
            },
            {
              title: 'Campus-first UX',
              value: 'Mobile ready',
              subtitle: 'Feels like a native app',
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={index + 1}
              className="rounded-2xl border border-[#E9E4FF] bg-white p-5"
            >
              <p className="text-sm font-semibold text-[#6B7280]">{item.title}</p>
              <h3 className="mt-2 text-2xl font-black text-[#0B0E11]">{item.value}</h3>
              <p className="mt-1 text-sm text-[#6B7280]">{item.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex rounded-full border border-[#E9E4FF] bg-white px-4 py-2 text-sm font-semibold text-[#6200EE]">
            Why students will love it
          </div>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl">
            A smoother way to handle campus errands
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            Every part of CampusRunner is designed to feel fast, trusted, and easy
            to use.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'For Students',
              icon: UserCheck,
              color: 'bg-[#EEF8FF] text-[#2563EB]',
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
              color: 'bg-[#F4ECFF] text-[#6200EE]',
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
              color: 'bg-[#E6FFF9] text-[#03A894]',
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
                className="group rounded-[28px] border border-[#E9E4FF] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black">{feature.title}</h3>
                <ul className="mt-5 space-y-3 text-[#6B7280]">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#00C853]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section
        id="services"
        className="mx-auto max-w-7xl px-4 py-24 md:px-6"
      >
        <div className="mb-14 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex rounded-full border border-[#E9E4FF] bg-white px-4 py-2 text-sm font-semibold text-[#6200EE]">
            Campus services
          </div>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl">
            Everything students need, all in one place
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-[#6B7280]">
            The service grid is built around real campus behavior, so the app feels
            instantly useful from day one.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeUp}
                custom={index + 1}
                className="group rounded-[28px] border border-[#E9E4FF] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#6200EE]/30 hover:shadow-xl"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F4ECFF] to-[#E6FFF9]">
                    <Icon className="h-7 w-7 text-[#6200EE]" />
                  </div>
                  {service.popular && (
                    <span className="rounded-full bg-[#E6FFF9] px-3 py-1 text-[11px] font-bold tracking-wide text-[#03A894]">
                      POPULAR
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  {service.subtitle}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-4 py-24 md:px-6"
      >
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex rounded-full border border-[#E9E4FF] bg-white px-4 py-2 text-sm font-semibold text-[#6200EE]">
            How it works
          </div>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl">
            Three simple steps
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Choose a service',
              text: 'Select market run, printing, food pickup, parcel delivery, laundry, pharmacy, gas refill, or a custom errand.',
            },
            {
              step: '02',
              title: 'Post your request',
              text: 'Add your details, location, budget, and any notes so a nearby runner can quickly understand the task.',
            },
            {
              step: '03',
              title: 'Track and receive',
              text: 'Watch the order progress, receive updates, and confirm completion once your errand is delivered.',
            },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              custom={index + 1}
              className="rounded-[28px] border border-[#E9E4FF] bg-white p-7 shadow-sm"
            >
              <div className="mb-6 inline-flex rounded-2xl bg-[#F4ECFF] px-4 py-2 text-sm font-black text-[#6200EE]">
                Step {item.step}
              </div>
              <h3 className="text-2xl font-black">{item.title}</h3>
              <p className="mt-4 leading-7 text-[#6B7280]">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-6">
        <div className="relative overflow-hidden rounded-[36px] border border-white/50 bg-gradient-to-br from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] px-6 py-14 text-center text-white shadow-2xl shadow-[#6200EE]/20 md:px-12">
          <div className="absolute left-[-60px] top-[-60px] h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-[-60px] right-[-60px] h-40 w-40 rounded-full bg-white/10 blur-2xl" />

          <h2 className="relative text-4xl font-black tracking-tight md:text-5xl">
            Ready to simplify campus life?
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-lg text-white/85">
            Join CampusRunner and start handling errands faster with a smarter,
            more reliable campus workflow.
          </p>

          <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-black text-[#6200EE] transition hover:translate-y-[-2px]"
            >
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/15"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E9E4FF] bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-lg">
                <Image src="/logo.png" alt="CampusRunner" width={24} height={24} className="rounded-lg" />
              </div>
              <div>
                <p className="font-extrabold">CampusRunner</p>
                <p className="text-sm text-[#6B7280]">Campus errands, simplified</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm font-medium text-[#6B7280]">
            <a href="#features" className="transition hover:text-[#6200EE]">Features</a>
            <a href="#services" className="transition hover:text-[#6200EE]">Services</a>
            <a href="#how-it-works" className="transition hover:text-[#6200EE]">How it works</a>
          </div>

          <p className="text-sm text-[#6B7280]">
            © 2026 CampusRunner. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
      )}
    </>
  );
}