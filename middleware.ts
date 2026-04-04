import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Allow signup pages completely - no middleware checks
  if (pathname.includes('student-signup') || pathname.includes('runner-signup')) {
    return NextResponse.next();
  }
  
  let res = NextResponse.next();
  
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            res.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            res.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    const { data: { session } } = await supabase.auth.getSession();
    
    // Protected routes - require authentication
    const protectedRoutes = ['/student', '/runner', '/admin'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
    // Redirect to login if accessing protected route without session
    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // Redirect authenticated users away from login/forgot-password/reset-password
    const allowLogin = req.nextUrl.searchParams.get('logged_out') === '1';
    if (session && !allowLogin && (pathname === '/login' || pathname === '/forgot-password' || pathname === '/reset-password')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      const role = profile?.role || 'student';
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
    
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return res;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
