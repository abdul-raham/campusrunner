'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, ClipboardList, Package, Pill, Printer, Shirt, ShoppingCart, UtensilsCrossed, Zap } from 'lucide-react';

const services = [
  { id: 'gas_refill', name: 'Gas Refill', icon: Zap, tone: 'from-amber-400 to-orange-500', description: 'Fast gas pickup and refill for hostel cooking.' },
  { id: 'market_run', name: 'Market Run', icon: ShoppingCart, tone: 'from-sky-500 to-indigo-600', description: 'Groceries, toiletries, and essentials from local stores.' },
  { id: 'laundry_pickup', name: 'Laundry', icon: Shirt, tone: 'from-violet-500 to-fuchsia-600', description: 'Pickup, clean, and return without stress.' },
  { id: 'printing_photocopy', name: 'Printing', icon: Printer, tone: 'from-emerald-500 to-teal-600', description: 'Assignments, photocopy, spiral binding, and more.' },
  { id: 'food_pickup', name: 'Food Pickup', icon: UtensilsCrossed, tone: 'from-rose-500 to-orange-500', description: 'Pick meals from cafeterias and nearby spots.' },
  { id: 'parcel_delivery', name: 'Parcel Delivery', icon: Package, tone: 'from-cyan-500 to-blue-600', description: 'Hostel-to-hostel or department delivery flow.' },
  { id: 'pharmacy_essentials', name: 'Pharmacy', icon: Pill, tone: 'from-pink-500 to-rose-600', description: 'Medication and emergency essentials around campus.' },
  { id: 'errand_assistant', name: 'Errand Assistant', icon: ClipboardList, tone: 'from-slate-700 to-slate-900 dark:from-slate-300 dark:to-white', description: 'Flexible custom requests for anything else.' },
];

export function ServiceGrid() {
  const router = useRouter();

  return (
    <section className="section-shell">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="metric-label">Service hub</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Pick what you need in seconds</h2>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service, idx) => {
          const Icon = service.icon;
          return (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/student/create-order?service=${service.id}`)}
              className="group rounded-2xl sm:rounded-[28px] border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5 text-left shadow-sm shadow-slate-900/5 hover:bg-white dark:border-slate-800 dark:bg-slate-900/55 dark:hover:bg-slate-900"
            >
              <div className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.tone} text-white shadow-lg shadow-slate-900/15`}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-bold tracking-tight">{service.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400 hidden sm:block">{service.description}</p>
              <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-300">
                Start request
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
