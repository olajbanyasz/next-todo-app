import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicPaths = ['/login', '/register', '/api/auth/register', '/api/auth'];

export async function proxy(request: NextRequest) {
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith('/api/auth/')
  );

  const session = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET 
  });

  // If trying to access a protected route without session, redirect to login
  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access login/register while logged in, redirect to todos
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && session) {
    return NextResponse.redirect(new URL('/todos', request.url));
  }

  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (session?.role !== 'admin') {
      return NextResponse.redirect(new URL('/todos', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
