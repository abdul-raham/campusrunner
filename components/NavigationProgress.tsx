'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function fire(name: string) {
  window.dispatchEvent(new Event(name));
}

export default function NavigationProgress() {
  useEffect(() => {
    // intercept all anchor clicks that look like internal navigation
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href) return;
      // only internal links, not anchors, not external
      if (href.startsWith('/') && !href.startsWith('//')) {
        fire('cr:nav:start');
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return null;
}
