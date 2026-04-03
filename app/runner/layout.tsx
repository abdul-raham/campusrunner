'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import RunnerShell from './RunnerShell';
import PageLoader from '@/components/PageLoader';

export default function RunnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'runner')) {
      router.push('/login');
    }
  }, [user, profile, loading, router]);

  if (loading && !user) return <PageLoader />;
  if (!loading && (!user || profile?.role !== 'runner')) return null;

  return <RunnerShell>{children}</RunnerShell>;
}
