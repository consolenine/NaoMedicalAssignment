import { NextRequest, NextResponse } from 'next/server';
import { parseJwt } from '@/utils/parse_jwt';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token');

  const protectedRoutes = ['/dashboard', '/admin'];
  const roleBasedRoutes: Record<string, string> = { '/admin': 'admin' };

  // Check for protected routes
  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Decode the token to check role
    const payload = parseJwt(token.value);
    if (
      roleBasedRoutes[req.nextUrl.pathname] &&
      payload?.role !== roleBasedRoutes[req.nextUrl.pathname]
    ) {
      return NextResponse.redirect(new URL('/auth/unauthorized', req.url));
    }
  }

  return NextResponse.next();
}

// Specify which routes to match
export const config = {
  matcher: ['/dashboard', '/admin'],
};
