import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isDev = process.env.NODE_ENV !== 'production';

if (!supabaseUrl || !supabaseAnonKey) {
  if (isDev) {
    console.error('Missing Supabase environment variables');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  }
  throw new Error('Missing Supabase environment variables.');
}

// Use cookie-based auth so middleware can read the session.
export const supabase = createBrowserClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'X-Client-Info': 'campusrunner-web'
      }
    }
  }
);

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    if (isDev) {
      console.log('Testing Supabase connection to:', supabaseUrl);
    }
    
    // Simple health check
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey || '',
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    
    if (isDev) {
      console.log('Health check response:', response.status, response.statusText);
    }
    
    if (!response.ok) {
      console.error('Health check failed:', response.status, response.statusText);
      return false;
    }
    
    if (isDev) {
      console.log('Supabase connection successful');
    }
    return true;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return false;
  }
};
