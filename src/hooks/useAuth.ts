'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const refreshProfile = async (userId?: string) => {
    const id = userId ?? user?.id;
    if (!id) return null;
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (profileError) {
      setError(profileError.message);
      return null;
    }
    setProfile(data);
    return data;
  };

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(async ({ data: { user: authUser }, error: authError }) => {
      if (cancelled) return;
      if (authError || !authUser) {
        // Clear invalid or missing refresh token without spamming console
        if (authError?.message?.toLowerCase().includes('refresh token')) {
          await supabase.auth.signOut();
        }
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      
      setUser(authUser);
      refreshProfile(authUser.id).finally(() => setLoading(false));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        refreshProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const handler = () => {
      refreshProfile(user.id);
    };
    window.addEventListener('profile-updated', handler);
    return () => window.removeEventListener('profile-updated', handler);
  }, [user?.id]);

  const logout = async () => {
    // Clear state immediately to prevent UI flicker
    setUser(null);
    setProfile(null);
    setLoading(true);
    
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
      // Force redirect to login
      window.location.href = '/login';
    }
  };

  return { user, profile, loading, error, logout, refreshProfile };
};
