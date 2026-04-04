'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import StudentShell from './StudentShell';
import PageLoader from '@/components/PageLoader';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'student')) {
      router.push('/login');
    }
  }, [user, profile, loading, router]);

  if (loading && !user) return <PageLoader />;
  if (!loading && (!user || profile?.role !== 'student')) return null;

  return <StudentShell>{children}</StudentShell>;
}
