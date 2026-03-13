'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import type { Profile } from '@/types/index';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get authenticated user (secure)
    supabase.auth.getUser().then(({ data: { user: authUser }, error: authError }) => {
      if (authError || !authUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      
      setUser(authUser);
      // Fetch profile
      supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()
        .then(({ data, error: profileError }) => {
          if (profileError) {
            console.error('Profile fetch error:', profileError);
            setError(profileError.message);
          } else {
            setProfile(data);
          }
          setLoading(false);
        });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setProfile(data);
          });
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push('/login');
  };

  return { user, profile, loading, error, logout };
};
