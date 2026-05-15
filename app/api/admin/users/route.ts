// Admin Users API Route
// GET /api/admin/users - List all users (admin only)
// PUT /api/admin/users - Update user (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as db from '@/lib/db';

async function isAdminRequest() {
  const cookieStore = cookies();
  const sessionData = cookieStore.get('session')?.value;
  if (!sessionData) return false;
  try {
    const session = JSON.parse(sessionData);
    return Boolean(session?.isAdmin);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const dbData = await db.getDatabase();
    const users = dbData.users.map(({ password, ...user }) => user);
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await db.updateUser(id, updates);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 400 });
  }
}
