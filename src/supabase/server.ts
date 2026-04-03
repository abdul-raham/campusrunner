import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const createServerSupabaseClient = () => {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase server environment variables. Please check your .env.local file.'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey);
};
