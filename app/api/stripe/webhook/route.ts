// Stripe Webhook API Route
// POST /api/stripe/webhook - Handle Stripe webhook events

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import * as db from '@/lib/db';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Stripe not configured');
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not initialized' }, { status: 500 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log('Payment successful for session:', session.id);
      
      // Parse order data from metadata
      const orderData = session.metadata?.orderData 
        ? JSON.parse(session.metadata.orderData) 
        : {};

      // Create the order in database
      try {
        const order = await db.createOrder({
          userId: orderData.userId,
          customerName: session.customer_details?.name || orderData.customerName || 'Guest',
          customerEmail: session.customer_email || session.customer_details?.email || orderData.customerEmail,
          customerPhone: session.customer_details?.phone || orderData.customerPhone,
          shippingName: orderData.shippingName || '',
          shippingPhone: orderData.shippingPhone || '',
          shippingStreet: orderData.shippingStreet || '',
          shippingCity: orderData.shippingCity || '',
          shippingState: orderData.shippingState || '',
          shippingZip: orderData.shippingZip || '',
          items: orderData.items || [],
          subtotal: (session.amount_subtotal || 0) / 100,
          shippingFee: orderData.shippingFee || 0,
          tax: 0,
          discount: 0,
          total: (session.amount_total || 0) / 100,
          configuration: {},
          productSlug: orderData.productSlug,
          productName: orderData.productName,
          finalPrice: (session.amount_total || 0) / 100,
          status: 'confirmed',
          paymentMethod: 'stripe',
          paymentStatus: 'paid',
          notes: orderData.notes,
          adminNotes: `Stripe Session: ${session.id}`,
        });

        console.log('Order created:', order.orderNumber);
      } catch (err) {
        console.error('Failed to create order:', err);
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('Payment intent succeeded:', paymentIntent.id);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.log('Payment failed:', paymentIntent.id);
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object;
      console.log('Refund processed:', charge.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
