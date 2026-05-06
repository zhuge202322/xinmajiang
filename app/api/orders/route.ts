// Orders API Route
// GET /api/orders - List user orders (authenticated)
// POST /api/orders - Create new order

import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';
import { cookies } from 'next/headers';

// Helper to get current user from session
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

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await db.getOrdersByUserId(user.id);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    // Validate required fields
    if (!body.customerName || !body.customerPhone || !body.shippingStreet) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order
    const order = await db.createOrder({
      userId: user?.id,
      customerName: body.customerName,
      customerEmail: body.customerEmail || user?.email,
      customerPhone: body.customerPhone,
      shippingName: body.shippingName || body.customerName,
      shippingPhone: body.shippingPhone || body.customerPhone,
      shippingStreet: body.shippingStreet,
      shippingCity: body.shippingCity,
      shippingState: body.shippingState,
      shippingZip: body.shippingZip,
      items: body.items || [],
      subtotal: body.subtotal || 0,
      shippingFee: body.shippingFee || 0,
      tax: body.tax || 0,
      discount: body.discount || 0,
      total: body.total || 0,
      configuration: body.configuration || {},
      productSlug: body.productSlug,
      productName: body.productName,
      finalPrice: body.finalPrice || body.total || 0,
      status: 'pending',
      paymentMethod: body.paymentMethod,
      paymentStatus: 'pending',
      notes: body.notes,
      adminNotes: '',
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
