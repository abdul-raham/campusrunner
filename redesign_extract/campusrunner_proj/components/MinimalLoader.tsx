'use client';

import { motion } from 'framer-motion';
import { BrandMark } from '@/components/ui/BrandMark';

export default function MinimalLoader({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onAnimationComplete={() => setTimeout(onComplete, 900)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F6F7FB]"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <BrandMark className="h-16 w-16" />
        </motion.div>
        <div className="h-1 w-24 overflow-hidden rounded-full bg-[#E9E4FF]">
          <motion.div className="h-full rounded-full bg-[linear-gradient(90deg,#6200EE,#03DAC5)]" initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
      </div>
    </motion.div>
  );
}
