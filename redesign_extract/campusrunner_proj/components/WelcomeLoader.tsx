'use client';

import { useEffect } from 'react';
import MinimalLoader from '@/components/MinimalLoader';

export default function WelcomeLoader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 1100);
    return () => clearTimeout(t);
  }, [onComplete]);

  return <MinimalLoader onComplete={onComplete} />;
}
