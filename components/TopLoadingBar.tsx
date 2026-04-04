'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function TopLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);
  const prevPath = useRef(pathname + searchParams.toString());

  useEffect(() => {
    const current = pathname + searchParams.toString();
    if (current === prevPath.current) return;
    prevPath.current = current;
    setProgress(100);
    timerRef.current = setTimeout(() => setVisible(false), 400);
  }, [pathname, searchParams]);

  useEffect(() => {
    const start = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setVisible(true);
      setProgress(0);
      let p = 0;
      const tick = () => {
        p = p < 70 ? p + Math.random() * 12 : p < 90 ? p + 1.5 : p;
        if (p > 92) p = 92;
        setProgress(p);
        rafRef.current = requestAnimationFrame(tick);
      };
      timerRef.current = setTimeout(() => { rafRef.current = requestAnimationFrame(tick); }, 80);
    };
    const stop = () => {
      cancelAnimationFrame(rafRef.current);
      setProgress(100);
      timerRef.current = setTimeout(() => setVisible(false), 350);
    };
    window.addEventListener('cr:nav:start', start);
    window.addEventListener('cr:nav:stop', stop);
    return () => {
      window.removeEventListener('cr:nav:start', start);
      window.removeEventListener('cr:nav:stop', stop);
      cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Top progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99999, height: 3, pointerEvents: 'none' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
          borderRadius: '0 2px 2px 0',
          transition: progress === 100 ? 'width 0.2s ease' : 'width 0.4s ease',
          boxShadow: '0 0 10px rgba(245,158,11,0.6)',
        }} />
      </div>

      {/* Logo spinner overlay */}
      <div style={{
        position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)',
        zIndex: 99998, pointerEvents: 'none',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 999,
        padding: '4px 12px 4px 4px',
        boxShadow: '0 4px 20px rgba(15,23,42,0.12)',
        border: '1px solid rgba(245,158,11,0.2)',
      }}>
        <Image src="/favicon.svg" alt="CampusRunner" width={24} height={24} style={{ borderRadius: '50%' }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#d97706', letterSpacing: '-0.01em' }}>Loading…</span>
      </div>
    </>
  );
}
