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
      // Use window.location.href for immediate redirect
      window.location.href = '/login';
    }
  }, [user, profile, loading]);

  // Show loader while auth is loading or user is being redirected
  if (loading || !user || profile?.role !== 'student') {
    return <PageLoader />;
  }

  return <StudentShell>{children}</StudentShell>;
}
