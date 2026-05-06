// Order Lookup API Route
// GET /api/orders/lookup?orderNumber=xxx - Lookup order by order number
// GET /api/orders/lookup?email=xxx - Lookup orders by email

import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderNumber = searchParams.get('orderNumber');
  const email = searchParams.get('email');

  if (!orderNumber && !email) {
    return NextResponse.json({ error: 'Order number or email required' }, { status: 400 });
  }

  try {
    let orders: any[] = [];

    if (orderNumber) {
      const order = await db.getOrderByNumber(orderNumber);
      if (order) {
        orders = [order];
      }
    } else if (email) {
      const allOrders = await db.getAllOrders();
      orders = allOrders.filter(
        o => o.customerEmail?.toLowerCase() === email.toLowerCase()
      );
    }

    // Remove sensitive data
    const sanitizedOrders = orders.map(({ adminNotes, ...rest }: any) => rest);

    return NextResponse.json({ orders: sanitizedOrders });
  } catch (error) {
    console.error('Lookup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
