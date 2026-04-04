'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
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
  const isLoggingOut = useRef(false);

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
    
    const initAuth = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (cancelled || isLoggingOut.current) return;
        
        if (authError || !authUser) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }
        
        setUser(authUser);
        await refreshProfile(authUser.id);
      } catch (err: any) {
        if (!cancelled && !isLoggingOut.current) {
          setError(err.message);
        }
      } finally {
        if (!cancelled && !isLoggingOut.current) {
          setLoading(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled || isLoggingOut.current) return;
      
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        setProfile(null);
        return;
      }
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        await refreshProfile(session.user.id);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user?.id || isLoggingOut.current) return;
    const handler = () => {
      refreshProfile(user.id);
    };
    window.addEventListener('profile-updated', handler);
    return () => window.removeEventListener('profile-updated', handler);
  }, [user?.id]);

  const logout = async () => {
    if (isLoggingOut.current) return;
    
    isLoggingOut.current = true;
    setLoading(true);
    
    try {
      // Clear state immediately
      setUser(null);
      setProfile(null);
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Small delay to ensure signout completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Force redirect regardless of errors
      window.location.href = '/login';
    }
  };

  return { user, profile, loading, error, logout, refreshProfile };
};
