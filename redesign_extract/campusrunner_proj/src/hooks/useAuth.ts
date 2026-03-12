'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getDemoSession, logoutDemoUser } from '@/src/lib/demo-auth';
import type { Profile } from '@/src/types';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const session = getDemoSession();
      setUser(session);
      setProfile(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Auth failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    logoutDemoUser();
    setUser(null);
    setProfile(null);
    router.push('/login');
  };

  return { user, profile, loading, error, logout };
};
