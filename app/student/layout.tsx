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
    // Only redirect if we're sure the user is not authenticated
    if (!loading && !user) {
      window.location.href = '/login';
      return;
    }
    
    // Only redirect if we have a user but wrong role
    if (!loading && user && profile && profile.role !== 'student') {
      window.location.href = '/login';
      return;
    }
  }, [user, profile, loading]);

  // Show loader while auth is loading or during redirects
  if (loading || !user || (user && profile && profile.role !== 'student')) {
    return <PageLoader />;
  }

  // Show loader if we have user but no profile yet
  if (user && !profile) {
    return <PageLoader />;
  }

  return <StudentShell>{children}</StudentShell>;
}
