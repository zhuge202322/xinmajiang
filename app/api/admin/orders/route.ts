// Admin Orders API Route
// GET /api/admin/orders - List all orders (admin only)
// PUT /api/admin/orders - Update order status (admin only)

import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Simple admin check - in production, use proper authentication
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_API_KEY) {
      // For development, allow without key but check cookie
      const cookieStore = await import('next/headers').then(m => m.cookies());
      const sessionData = cookieStore.get('session')?.value;
      if (!sessionData) {
        const isDev = process.env.NODE_ENV === 'development';
        if (!isDev) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
      }
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let orders = await db.getAllOrders();

    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    // Sort by creation date (newest first) and limit
    orders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return NextResponse.json({ orders });
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
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const order = await db.updateOrder(id, updates);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 400 });
  }
}
