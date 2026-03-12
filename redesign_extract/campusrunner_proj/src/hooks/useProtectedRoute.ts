import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './useAuth';

type AllowedRole = 'student' | 'runner' | 'admin';

export const useProtectedRoute = (allowedRoles?: AllowedRole[]) => {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    if (!loading && profile && allowedRoles) {
      if (!allowedRoles.includes(profile.role as AllowedRole)) {
        router.push('/');
      }
    }
  }, [user, profile, loading, allowedRoles, router]);

  return { user, profile, loading };
};
