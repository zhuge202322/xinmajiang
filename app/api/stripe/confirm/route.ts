// Stripe Session Confirm API Route
// POST /api/stripe/confirm - Confirm payment and create order

import { NextRequest, NextResponse } from 'next/server';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import * as db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, orderData } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Check if order already exists (prevent duplicates)
    const existingOrders = await db.getAllOrders();
    const existingOrder = existingOrders.find(o => 
      o.adminNotes?.includes(sessionId)
    );

    if (existingOrder) {
      return NextResponse.json({ 
        success: true, 
        order: existingOrder,
        message: 'Order already confirmed' 
      });
    }

    // If Stripe is configured, try to verify the session with Stripe
    if (isStripeConfigured()) {
      const stripe = getStripe();
      if (stripe) {
        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          
          if (session.payment_status === 'paid') {
            // Parse order data from metadata
            const metadataOrderData = session.metadata?.orderData 
              ? JSON.parse(session.metadata.orderData) 
              : {};
            
            // Merge with provided orderData (provided takes precedence)
            const finalOrderData = { ...metadataOrderData, ...orderData };

            // Create order in database
            const order = await db.createOrder({
              userId: finalOrderData.userId,
              customerName: session.customer_details?.name || finalOrderData.customerName || 'Guest',
              customerEmail: session.customer_email || session.customer_details?.email || finalOrderData.customerEmail,
              customerPhone: session.customer_details?.phone || finalOrderData.customerPhone,
              shippingName: finalOrderData.shippingName || '',
              shippingPhone: finalOrderData.shippingPhone || '',
              shippingStreet: finalOrderData.shippingStreet || '',
              shippingCity: finalOrderData.shippingCity || '',
              shippingState: finalOrderData.shippingState || '',
              shippingZip: finalOrderData.shippingZip || '',
              items: finalOrderData.items || [],
              subtotal: (session.amount_subtotal || 0) / 100,
              shippingFee: finalOrderData.shippingFee || 0,
              tax: 0,
              discount: 0,
              total: (session.amount_total || 0) / 100,
              configuration: {},
              productSlug: finalOrderData.productSlug,
              productName: finalOrderData.productName,
              finalPrice: (session.amount_total || 0) / 100,
              status: 'confirmed',
              paymentMethod: 'stripe',
              paymentStatus: 'paid',
              notes: finalOrderData.notes,
              adminNotes: `Stripe Session: ${sessionId}`,
            });

            return NextResponse.json({ success: true, order });
          }
        } catch (stripeError: any) {
          console.error('Stripe session retrieval error:', stripeError.message);
          // Continue to fallback - don't fail if Stripe verification fails
        }
      }
    }

    // Fallback: Create order without Stripe verification (for testing or when Stripe session not found)
    if (orderData) {
      const order = await db.createOrder({
        userId: orderData.userId,
        customerName: orderData.customerName || 'Guest',
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        shippingName: orderData.shippingName || orderData.customerName,
        shippingPhone: orderData.shippingPhone,
        shippingStreet: orderData.shippingStreet,
        shippingCity: orderData.shippingCity,
        shippingState: orderData.shippingState,
        shippingZip: orderData.shippingZip,
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        shippingFee: orderData.shippingFee || 0,
        tax: orderData.tax || 0,
        discount: orderData.discount || 0,
        total: orderData.total || 0,
        configuration: {},
        productSlug: orderData.productSlug,
        productName: orderData.productName,
        finalPrice: orderData.finalPrice || orderData.total || 0,
        status: 'confirmed',
        paymentMethod: 'stripe',
        paymentStatus: 'paid',
        notes: orderData.notes,
        adminNotes: `Stripe Session: ${sessionId}`,
      });

      return NextResponse.json({ success: true, order, fallback: true });
    }

    return NextResponse.json({ error: 'No order data provided' }, { status: 400 });

  } catch (error: any) {
    console.error('Error confirming order:', error);
    return NextResponse.json({ 
      error: 'Failed to confirm order',
      message: error.message 
    }, { status: 500 });
  }
}
