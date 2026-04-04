'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ClientErrorReporter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    const sendError = async (message: string, stack?: string) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await fetch('/api/logs/client-error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token ?? ''}`,
          },
          body: JSON.stringify({
            message,
            stack: stack || '',
            url: window.location.href,
          }),
        });
      } catch {
        // swallow
      }
    };

    const onError = (event: ErrorEvent) => {
      const message = event.message || 'Unknown error';
      const stack = event.error?.stack || '';
      sendError(message, stack);
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = reason?.message || String(reason || 'Unhandled rejection');
      const stack = reason?.stack || '';
      sendError(message, stack);
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}
