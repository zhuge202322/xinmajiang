// Register API Route
// POST /api/auth/register

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, displayName, phone } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Create user
    const user = await db.createUser({
      email,
      password,
      displayName: displayName || email.split('@')[0],
      phone,
    });

    // Create session
    const sessionData = {
      userId: user.id,
      isAdmin: user.isAdmin,
      createdAt: new Date().toISOString(),
    };

    const cookieStore = cookies();
    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      user,
      message: 'Registration successful',
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
}
