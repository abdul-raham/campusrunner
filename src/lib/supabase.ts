import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl));

export const supabase = createBrowserClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: { 'X-Client-Info': 'campusrunner-web' }
  }
});

export const testSupabaseConnection = async () => {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
    });
    return response.ok;
  } catch {
    return false;
  }
};
