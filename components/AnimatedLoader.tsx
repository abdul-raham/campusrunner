'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function AnimatedLoader({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 600);
    const timer2 = setTimeout(() => setStage(2), 1200);
    const timer3 = setTimeout(() => setStage(3), 1800);
    const timer4 = setTimeout(() => onComplete(), 2800);
    
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
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#6200EE] via-[#4F2EE8] to-[#03DAC5]"
    >
      <div className="relative">
        {/* Particle System */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              scale: 0,
              x: 0,
              y: 0,
              opacity: 0
            }}
            animate={{
              scale: stage >= 1 ? 0.8 : 0,
              x: stage >= 1 ? Math.cos((i * 30 * Math.PI) / 180) * 200 : 0,
              y: stage >= 1 ? Math.sin((i * 30 * Math.PI) / 180) * 200 : 0,
              opacity: stage >= 1 ? 0.4 : 0,
            }}
            transition={{
              duration: 2,
              delay: i * 0.05,
              ease: "easeOut"
            }}
            className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          />
        ))}

        {/* Logo Container */}
        <div className="relative h-20 w-20">
          {/* Background Morphing Shape */}
          <motion.div
            initial={{ 
              scale: 0,
              borderRadius: "50%",
              rotate: 0
            }}
            animate={{
              scale: stage >= 0 ? 1 : 0,
              borderRadius: stage === 1 ? "20%" : "50%",
              rotate: stage >= 1 ? 360 : 0,
            }}
            transition={{
              scale: { duration: 0.6, type: "spring", stiffness: 200 },
              borderRadius: { duration: 1.2, ease: "easeInOut" },
              rotate: { duration: 1.5, ease: "easeInOut" }
            }}
            className="absolute inset-0 bg-white shadow-2xl"
          />

          {/* Logo Image with Effects */}
          <motion.div
            initial={{ 
              scale: 0,
              rotate: -180,
              filter: "blur(10px)"
            }}
            animate={{
              scale: stage >= 0 ? 1 : 0,
              rotate: stage >= 1 ? 360 : 0,
              filter: stage >= 0 ? "blur(0px)" : "blur(10px)",
              x: stage === 2 ? 3 : 0,
              y: stage === 2 ? -3 : 0,
            }}
            transition={{
              scale: { duration: 0.8, type: "spring", stiffness: 150 },
              rotate: { duration: 2, ease: "easeInOut" },
              filter: { duration: 0.6 },
              x: { duration: 0.6, ease: "easeInOut" },
              y: { duration: 0.6, ease: "easeInOut" }
            }}
            className="absolute inset-2 flex items-center justify-center"
          >
            <Image 
              src="/logo.png" 
              alt="CampusRunner" 
              width={48} 
              height={48} 
              className="rounded-lg"
            />
          </motion.div>

          {/* Energy Rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              initial={{ 
                scale: 0,
                opacity: 0,
                rotate: 0
              }}
              animate={{
                scale: stage >= 1 ? 2 + ring * 0.5 : 0,
                opacity: stage >= 1 ? 0 : 0,
                rotate: stage >= 1 ? 360 * ring : 0,
              }}
              transition={{
                duration: 1.5,
                delay: ring * 0.1,
                repeat: stage >= 1 ? Infinity : 0,
                repeatDelay: 0.5,
                ease: "easeOut"
              }}
              className="absolute inset-0 rounded-full border-2 border-white/30"
            />
          ))}
        </div>

        {/* Dynamic Text */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ 
            opacity: stage >= 3 ? 1 : 0,
            y: stage >= 3 ? 0 : 30,
            scale: stage >= 3 ? 1 : 0.8,
          }}
          transition={{ 
            duration: 0.8, 
            type: "spring",
            stiffness: 150,
            damping: 12
          }}
          className="mt-8 text-center"
        >
          <motion.h1
            initial={{ 
              letterSpacing: "0.8em",
              opacity: 0
            }}
            animate={{ 
              letterSpacing: stage >= 3 ? "0.05em" : "0.8em",
              opacity: stage >= 3 ? 1 : 0,
            }}
            transition={{ 
              duration: 1.2,
              ease: "easeOut"
            }}
            className="text-2xl font-black text-white"
          >
            CampusRunner
          </motion.h1>
          
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: stage >= 3 ? "100%" : 0,
              opacity: stage >= 3 ? 1 : 0,
            }}
            transition={{ 
              duration: 0.8,
              delay: 0.3,
              ease: "easeOut"
            }}
            className="mx-auto mt-2 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
          />
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: stage >= 3 ? 0.9 : 0,
              y: stage >= 3 ? 0 : 10,
            }}
            transition={{ 
              delay: 0.6, 
              duration: 0.6,
              ease: "easeOut"
            }}
            className="mt-3 text-sm font-medium text-white/90"
          >
            Initializing your campus experience
          </motion.p>
        </motion.div>

        {/* Ambient Glow */}
        <motion.div
          animate={{
            scale: [1, 1.3],
            opacity: [0.1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute inset-0 -m-10 rounded-full bg-white blur-xl"
        />
      </div>
    </motion.div>
  );
}