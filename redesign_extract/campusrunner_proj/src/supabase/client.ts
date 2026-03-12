import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create browser client with cookie storage for Next.js
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client
export const createServerSupabaseClient = () => {
  const { createClient } = require('@supabase/supabase-js');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase server environment variables. Please check your .env.local file.'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey);
};
