'use client';

import { motion } from 'framer-motion';

export default function MinimalLoader({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => setTimeout(onComplete, 800)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="h-6 w-6 rounded-full border-2 border-[#E5E7EB] border-t-[#6200EE]"
      />
    </motion.div>
  );
}