import { NextRequest, NextResponse } from 'next/server';
import { parseJwt } from '@/utils/parse_jwt';
import constants from "@/utils/constants";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(constants.AUTH_COOKIE);

  const protectedRoutes = ['/room', '/admin'];
  const roleBasedRoutes: Record<string, string> = { '/admin': 'admin' };

  // Check for protected routes
  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    console.log(req.nextUrl.pathname);
    if (!token) {
      return NextResponse.redirect(new URL(`/auth/login?redirect=${req.nextUrl.pathname}`, req.url));
    }

    // Decode the token to check role
    const payload = parseJwt(token.value);
    if (
      roleBasedRoutes[req.nextUrl.pathname] &&
      payload?.role !== roleBasedRoutes[req.nextUrl.pathname]
    ) {
      return NextResponse.redirect(new URL('/auth/login?redirect=/admin', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/room/:path*', '/admin/:path*'],
};