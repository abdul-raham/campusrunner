'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedLoader({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 800);
    const timer2 = setTimeout(() => setStage(2), 1600);
    const timer3 = setTimeout(() => onComplete(), 2400);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#6200EE] via-[#4F2EE8] to-[#03DAC5]"
    >
      <div className="relative">
        {/* Logo Parts */}
        <div className="relative h-24 w-24">
          {/* Main Circle */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: stage >= 0 ? 1 : 0,
              rotate: stage >= 1 ? 0 : -180,
            }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
            className="absolute inset-0 rounded-full bg-white shadow-2xl"
          />
          
          {/* Inner Elements - Split and Morph */}
          <motion.div
            initial={{ x: 0, y: 0, scale: 0 }}
            animate={{
              x: stage === 1 ? [-20, 20, 0] : 0,
              y: stage === 1 ? [20, -20, 0] : 0,
              scale: stage >= 0 ? 1 : 0,
              rotate: stage === 1 ? [0, 360, 0] : 0,
            }}
            transition={{
              duration: stage === 1 ? 0.8 : 0.6,
              type: "spring",
              stiffness: 120,
              damping: 8
            }}
            className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6200EE]"
          />
          
          {/* Orbiting Elements */}
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              initial={{ 
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                scale: stage >= 0 ? 1 : 0,
                x: stage >= 1 ? Math.cos((angle * Math.PI) / 180) * 30 : 0,
                y: stage >= 1 ? Math.sin((angle * Math.PI) / 180) * 30 : 0,
                rotate: stage >= 1 ? 360 : 0,
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
              className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#03DAC5]"
            />
          ))}
        </div>

        {/* Text Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: stage >= 2 ? 1 : 0,
            y: stage >= 2 ? 0 : 20,
          }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mt-6 text-center"
        >
          <motion.h1
            initial={{ letterSpacing: "0.5em" }}
            animate={{ letterSpacing: stage >= 2 ? "0.1em" : "0.5em" }}
            transition={{ duration: 0.8 }}
            className="text-2xl font-black text-white"
          >
            CampusRunner
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 2 ? 0.8 : 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-1 text-sm text-white/80"
          >
            Loading your campus experience...
          </motion.p>
        </motion.div>

        {/* Pulse Effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full bg-white"
        />
      </div>
    </motion.div>
  );
}