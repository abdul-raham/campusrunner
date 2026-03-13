'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  ShoppingCart, 
  Shirt, 
  Printer, 
  UtensilsCrossed, 
  Package, 
  Pill, 
  ClipboardList 
} from 'lucide-react';

const services = [
  { id: 'gas_refill', name: 'Gas Refill', icon: Zap, color: 'from-yellow-500 to-orange-500', description: 'Get your gas cylinder refilled' },
  { id: 'market_run', name: 'Market Run', icon: ShoppingCart, color: 'from-blue-500 to-cyan-500', description: 'Shopping from local markets' },
  { id: 'laundry_pickup', name: 'Laundry', icon: Shirt, color: 'from-purple-500 to-pink-500', description: 'Laundry collection & delivery' },
  { id: 'printing_photocopy', name: 'Printing', icon: Printer, color: 'from-green-500 to-emerald-500', description: 'Document printing services' },
  { id: 'food_pickup', name: 'Food Pickup', icon: UtensilsCrossed, color: 'from-red-500 to-orange-500', description: 'Get food from restaurants' },
  { id: 'parcel_delivery', name: 'Parcel Delivery', icon: Package, color: 'from-indigo-500 to-blue-500', description: 'Send and receive parcels' },
  { id: 'pharmacy_essentials', name: 'Pharmacy', icon: Pill, color: 'from-pink-500 to-rose-500', description: 'Medicine & essentials' },
  { id: 'errand_assistant', name: 'Errand Assistant', icon: ClipboardList, color: 'from-teal-500 to-cyan-500', description: 'General errand assistance' },
];

export function ServiceGrid() {
  const router = useRouter();

  const handleServiceClick = (serviceId: string) => {
    router.push(`/student/create-order?service=${serviceId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#0B0E11] mb-2">What do you need?</h2>
        <p className="text-[#6B7280]">Select a service to get started</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service, idx) => {
          const Icon = service.icon;
          return (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleServiceClick(service.id)}
              className="group relative overflow-hidden rounded-2xl bg-white border-2 border-[#E5E7EB] p-6 shadow-lg hover:shadow-xl hover:border-[#6200EE]/50 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#6200EE]/5 to-[#03DAC5]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 text-center space-y-3">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0B0E11] group-hover:text-[#6200EE] transition-colors">{service.name}</h3>
                  <p className="text-xs text-[#6B7280] mt-1">{service.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
