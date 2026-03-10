import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client even if env vars are missing (will only throw when actually used)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({
      auth: { getSession: () => Promise.resolve({ data: { session: null } }) },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.reject(new Error('Supabase not configured'))
          })
        }),
        insert: () => Promise.reject(new Error('Supabase not configured')),
        update: () => ({
          eq: () => Promise.reject(new Error('Supabase not configured'))
        })
      })
    } as any);

// Server-side Supabase client
export const createServerSupabaseClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase server environment variables. Please check your .env.local file.'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey);
};
