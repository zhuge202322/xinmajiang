// Admin Users API Route
// GET /api/admin/users - List all users (admin only)
// PUT /api/admin/users - Update user (admin only)

import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
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
