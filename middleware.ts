import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
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
    const { pathname } = req.nextUrl;
    
    const protectedRoutes = ['/student', '/runner', '/admin'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
    const authRoutes = ['/login', '/signup', '/student-signup', '/runner-signup'];
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
    
    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    if (isAuthRoute && session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      const role = profile?.role || 'student';
      return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
    }
    
    return res;
  } catch (error) {
    return res;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};