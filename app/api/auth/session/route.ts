// Session API Route
// GET /api/auth/session - Get current session

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as db from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionData = cookieStore.get('session')?.value;
    
    if (!sessionData) {
      return NextResponse.json({ user: null, session: null });
    }

    const session = JSON.parse(sessionData);
    if (!session.userId) {
      return NextResponse.json({ user: null, session: null });
    }

    const user = await db.getUserById(session.userId);
    if (!user) {
      // Invalid session, clear it
      cookieStore.delete('session');
      return NextResponse.json({ user: null, session: null });
    }

    return NextResponse.json({
      user,
      session,
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null, session: null });
  }
}
