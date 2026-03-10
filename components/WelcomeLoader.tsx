'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function WelcomeLoader({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  
  // Predefined positions to avoid hydration mismatch
  const starPositions = [
    { left: 15, top: 25 }, { left: 85, top: 15 }, { left: 75, top: 80 },
    { left: 25, top: 70 }, { left: 90, top: 45 }, { left: 10, top: 60 },
    { left: 60, top: 20 }, { left: 40, top: 85 }, { left: 95, top: 75 },
    { left: 5, top: 40 }, { left: 70, top: 55 }, { left: 30, top: 10 },
    { left: 80, top: 65 }, { left: 20, top: 90 }, { left: 65, top: 35 },
    { left: 45, top: 5 }, { left: 35, top: 50 }, { left: 55, top: 75 },
    { left: 12, top: 30 }, { left: 88, top: 85 }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 800);
    const timer2 = setTimeout(() => setStage(2), 1600);
    const timer3 = setTimeout(() => setStage(3), 2400);
    const timer4 = setTimeout(() => onComplete(), 3200);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#6200EE] via-[#4F2EE8] to-[#03DAC5]"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: stage >= 1 ? [0, 0.1, 0] : 0,
              scale: stage >= 1 ? [0, 1, 1.5] : 0,
            }}
            transition={{
              duration: 3,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="absolute h-2 w-2 rounded-full bg-white"
            style={{
              left: `${starPositions[i].left}%`,
              top: `${starPositions[i].top}%`,
            }}
          />
        ))}
      </div>

      <div className="relative text-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -360 }}
          animate={{ 
            scale: stage >= 0 ? 1 : 0,
            rotate: stage >= 0 ? 0 : -360,
          }}
          transition={{ 
            duration: 1.2,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Image 
              src="/logo.png" 
              alt="CampusRunner" 
              width={56} 
              height={56} 
              className="rounded-2xl"
            />
          </motion.div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: stage >= 1 ? 1 : 0,
            y: stage >= 1 ? 0 : 30,
          }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            stiffness: 120
          }}
          className="mb-6"
        >
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
            CampusRunner
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: stage >= 1 ? "100%" : 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mx-auto h-1 bg-gradient-to-r from-transparent via-white to-transparent"
          />
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: stage >= 2 ? 1 : 0,
            y: stage >= 2 ? 0 : 20,
          }}
          transition={{ 
            duration: 0.6,
            delay: 0.2
          }}
          className="mb-8"
        >
          <p className="text-xl text-white/90 font-medium mb-2">
            Welcome to the future of campus errands
          </p>
          <p className="text-white/70">
            Connecting students • Simplifying tasks • Building community
          </p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: stage >= 3 ? 1 : 0,
          }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="h-3 w-3 rounded-full bg-white"
            />
          ))}
        </motion.div>

        {/* Progress Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: stage >= 3 ? 0.8 : 0,
          }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 text-sm text-white/80 font-medium"
        >
          Preparing your campus experience...
        </motion.p>
      </div>

      {/* Corner Decorations */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-10 left-10 h-20 w-20 rounded-full border-2 border-white/20"
      />
      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-10 right-10 h-16 w-16 rounded-full border-2 border-white/20"
      />
    </motion.div>
  );
}