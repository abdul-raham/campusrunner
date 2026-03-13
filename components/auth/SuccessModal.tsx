'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface SuccessModalProps {
  title: string;
  message: string;
  userName?: string;
  redirectUrl?: string;
  redirectText?: string;
  autoRedirectDelay?: number;
}

export function SuccessModal({
  title,
  message,
  userName,
  redirectUrl,
  redirectText = 'Continue',
  autoRedirectDelay = 3000
}: SuccessModalProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const contentVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }
    }
  };

  const checkmarkVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.3,
        duration: 0.6,
        type: "spring",
        stiffness: 150
      }
    },
    animate: {
      scale: [1, 1.15, 1],
      transition: {
        delay: 1,
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const sparklesVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4 + i * 0.1,
        duration: 0.5
      }
    }),
    animate: {
      y: [0, -8, 0],
      opacity: [1, 0.6, 1],
      transition: {
        delay: 1.2 + i * 0.1,
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.4
      }
    })
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(98, 0, 238, 0.3)",
        "0 0 40px rgba(98, 0, 238, 0.6)",
        "0 0 60px rgba(98, 0, 238, 0.3)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const handleContinue = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  React.useEffect(() => {
    if (autoRedirectDelay && redirectUrl) {
      const timer = setTimeout(handleContinue, autoRedirectDelay);
      return () => clearTimeout(timer);
    }
  }, [autoRedirectDelay, redirectUrl]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4"
    >
      <motion.div
        variants={contentVariants}
        className="relative w-full max-w-md"
      >
        {/* Animated background blur */}
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#6200EE]/20 to-[#03DAC5]/20"
        />

        {/* Main card */}
        <div className="relative rounded-3xl border-2 border-[#6200EE]/30 bg-gradient-to-br from-white/98 via-white/95 to-white/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#6200EE]/5 via-transparent to-[#03DAC5]/5 pointer-events-none" />

          <div className="relative space-y-6 text-center">
            {/* Sparkles around checkmark */}
            <div className="relative flex justify-center items-center h-32">
              {/* Floating sparkles */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={sparklesVariants}
                  initial="hidden"
                  animate={["visible", "animate"]}
                  className={`absolute`}
                  style={{
                    left: ['50%', '35%', '65%', '50%'][i],
                    top: ['30%', '50%', '50%', '15%'][i]
                  }}
                >
                  <Sparkles className="h-5 w-5 text-[#6200EE]" />
                </motion.div>
              ))}

              {/* Main checkmark */}
              <motion.div
                variants={checkmarkVariants}
                initial="hidden"
                animate={["visible", "animate"]}
                className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#6200EE] via-[#5500DD] to-[#03DAC5] shadow-2xl shadow-[#6200EE]/40"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-white border-r-white/50 opacity-30"
                />
                <CheckCircle2 className="h-12 w-12 text-white drop-shadow-lg" />
              </motion.div>
            </div>

            {/* Title */}
            <motion.div custom={0} variants={textVariants} initial="hidden" animate="visible">
              <h2 className="text-3xl font-black bg-gradient-to-r from-[#6200EE] to-[#03DAC5] bg-clip-text text-transparent">
                {title}
              </h2>
            </motion.div>

            {/* Message */}
            <motion.div custom={1} variants={textVariants} initial="hidden" animate="visible">
              <p className="text-[#6B7280] font-medium text-lg">{message}</p>
              {userName && (
                <p className="text-sm text-[#9CA3AF] mt-2">
                  Welcome, <span className="font-bold text-[#6200EE]">{userName}</span>! 👋
                </p>
              )}
            </motion.div>

            {/* Features */}
            <motion.div
              custom={2}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-3 py-4"
            >
              {[
                { icon: '✓', text: 'Account Verified' },
                { icon: '🚀', text: 'Ready to Go' }
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#E5E7EB] bg-white/50 p-3 backdrop-blur"
                >
                  <div className="text-lg mb-1">{item.icon}</div>
                  <p className="text-xs font-bold text-[#374151]">{item.text}</p>
                </div>
              ))}
            </motion.div>

            {/* Button */}
            <motion.div
              custom={3}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="pt-4"
            >
              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] p-[2px] shadow-xl shadow-[#6200EE]/25 transition-all duration-300 hover:shadow-[#6200EE]/40"
              >
                <div className="relative rounded-2xl bg-gradient-to-r from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] px-6 py-3 transition-all duration-300 group-hover:from-[#4F2EE8] group-hover:to-[#03DAC5]">
                  <div className="flex items-center justify-center gap-2 text-base font-bold text-white">
                    <span>{redirectText}</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.button>
            </motion.div>

            {/* Auto redirect indicator */}
            {autoRedirectDelay && (
              <motion.p
                custom={4}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-xs text-[#9CA3AF] font-medium"
              >
                Redirecting in
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="mx-1 inline-block"
                >
                  3
                </motion.span>
                seconds...
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
