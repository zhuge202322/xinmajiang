// User Profile API Route
// GET /api/users/profile - Get current user profile
// PUT /api/users/profile - Update current user profile

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as db from '@/lib/db';

async function getCurrentUser() {
  const cookieStore = cookies();
  const sessionData = cookieStore.get('session')?.value;
  if (!sessionData) return null;
  
  try {
    const session = JSON.parse(sessionData);
    if (session.userId) {
      return await db.getUserById(session.userId);
    }
  } catch (e) {
    console.error('Session parse error:', e);
  }
  return null;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { displayName, phone } = body;

    const updatedUser = await db.updateUser(user.id, {
      displayName,
      phone,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
