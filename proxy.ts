import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// ✅ FIX: In-memory admin role cache for the edge runtime.
// Prevents a live DB query on EVERY admin route request.
// Cache entry expires after 5 minutes.
const ADMIN_CACHE = new Map<string, { isAdmin: boolean; expiry: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCachedAdminStatus(userId: string): boolean | null {
  const entry = ADMIN_CACHE.get(userId);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    ADMIN_CACHE.delete(userId);
    return null;
  }
  return entry.isAdmin;
}

function setCachedAdminStatus(userId: string, isAdmin: boolean) {
  ADMIN_CACHE.set(userId, { isAdmin, expiry: Date.now() + CACHE_TTL_MS });
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ FIX: Fast-path for static assets — skip all logic immediately
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Security Headers — set once, efficiently
  const securityHeaders: [string, string][] = [
    ['X-Frame-Options', 'DENY'],
    ['X-Content-Type-Options', 'nosniff'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin'],
    ['Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)'],
  ];
  for (const [key, val] of securityHeaders) {
    response.headers.set(key, val);
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // ✅ FIX: getSession() reads from the cookie — no network call
  const { data: { session } } = await supabase.auth.getSession();

  // 1. Auth Page Logic: redirect logged-in users away from login/signup
  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password');

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Protected Routes: redirect unauthenticated users to login
  const PROTECTED_PREFIXES = ['/dashboard', '/admin', '/settings', '/profile', '/security'];
  const isProtectedRoute = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));

  if (isProtectedRoute && !session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // 3. Admin Routes: role-based access with caching
  const isAdminRoute =
    pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

  if (isAdminRoute && session) {
    const userId = session.user.id;

    // ✅ FIX: Check cache first — avoids DB query on every admin page navigation
    let isAdmin = getCachedAdminStatus(userId);

    if (isAdmin === null) {
      // Cache miss — query DB once and cache the result
      try {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single();

        isAdmin = profile?.role === 'admin' || profile?.role === 'SUPER_ADMIN';
        setCachedAdminStatus(userId, isAdmin ?? false);
      } catch {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
