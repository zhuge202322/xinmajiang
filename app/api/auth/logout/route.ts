// Logout API Route
// POST /api/auth/logout

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete('session');

  return NextResponse.json({ message: 'Logout successful' });
}
