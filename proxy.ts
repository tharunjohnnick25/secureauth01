import { NextResponse, type NextRequest } from 'next/server';

// Minimal proxy handler to satisfy App Router expectation for a proxy route file.
// This is intentionally a no-op that allows the Next.js server to load the proxy route
// without performing any proxying. Replace with real proxy logic if needed.

export default function proxy(request: NextRequest) {
  // Fast-path static assets
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // For now, just continue the normal Next response flow. This prevents runtime
  // errors where the server expects a proxy function to be exported from /proxy.
  return NextResponse.next();
}
