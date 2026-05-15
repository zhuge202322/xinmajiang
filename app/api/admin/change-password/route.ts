import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as db from '@/lib/db';

async function getCurrentSession() {
  const cookieStore = cookies();
  const sessionData = cookieStore.get('session')?.value;
  if (!sessionData) return null;
  try {
    return JSON.parse(sessionData) as { userId?: string; isAdmin?: boolean };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session?.userId || !session.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { currentPassword, newPassword, confirmPassword } = body || {};
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: '请填写当前密码和新密码' }, { status: 400 });
  }
  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    return NextResponse.json({ error: '新密码至少 6 位' }, { status: 400 });
  }
  if (confirmPassword !== undefined && confirmPassword !== newPassword) {
    return NextResponse.json({ error: '两次输入的新密码不一致' }, { status: 400 });
  }

  const result = await db.changeUserPassword(session.userId, currentPassword, newPassword);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ message: '密码已更新' });
}
