import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

function readSession(req: NextRequest): { userId?: string; isAdmin?: boolean } | null {
  const raw = req.cookies.get('session')?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const session = readSession(req);

  if (pathname.startsWith('/api/admin')) {
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!session?.userId) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(loginUrl);
    }
    if (!session.isAdmin) {
      const denyUrl = req.nextUrl.clone();
      denyUrl.pathname = '/login';
      denyUrl.search = `?next=${encodeURIComponent(pathname + search)}&denied=1`;
      return NextResponse.redirect(denyUrl);
    }
  }

  return NextResponse.next();
}
