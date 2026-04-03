import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const isDev = process.env.NODE_ENV !== 'production';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { success: false, error: 'Missing Supabase environment variables' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Simple query to keep database active
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Keep-alive failed:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    if (isDev) {
      console.log('Keep-alive successful');
    }
    return NextResponse.json({ 
      success: true, 
      message: 'Database is active',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Keep-alive error:', err);
    return NextResponse.json({ 
      success: false, 
      error: 'Connection failed',
      timestamp: new Date().toISOString()
    });
  }
}
