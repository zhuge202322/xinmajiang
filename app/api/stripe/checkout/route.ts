// Stripe Checkout API Route
// POST /api/stripe/checkout - Create Stripe checkout session

import { NextRequest, NextResponse } from 'next/server';
import { getStripe, isStripeConfigured } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerEmail, orderData } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const stripe = getStripe();
    if (!stripe || !isStripeConfigured()) {
      return NextResponse.json({ 
        error: 'Stripe not configured',
        message: 'Please set STRIPE_SECRET_KEY in your environment' 
      }, { status: 503 });
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      // Filter and validate image URLs - only use valid absolute URLs with ASCII characters
      let validImages: string[] = [];
      if (item.image) {
        const imgUrl = item.image.trim();
        // Only use URLs that are absolute (start with http/https) and don't contain non-ASCII characters
        if (
          (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) &&
          /^[\x00-\x7F]*$/.test(imgUrl) // ASCII only
        ) {
          validImages = [imgUrl];
        }
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name || item.productName || 'Product',
            description: item.description || `Order item`,
            images: validImages,
          },
          unit_amount: Math.round((item.price || 0) * 100),
        },
        quantity: item.quantity || 1,
      };
    });

    // Add shipping as a line item if applicable
    if (orderData?.shippingFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard Shipping',
          },
          unit_amount: Math.round(orderData.shippingFee * 100),
        },
        quantity: 1,
      });
    }

    // Get the base URL from the request or environment
    const origin = request.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Store minimal order data in metadata (Stripe has 500 char limit)
    const minimalOrderData = orderData ? {
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      shippingStreet: orderData.shippingStreet,
      shippingCity: orderData.shippingCity,
      shippingState: orderData.shippingState,
      shippingZip: orderData.shippingZip,
      shippingMethod: orderData.shippingMethod,
      shippingFee: orderData.shippingFee,
      notes: orderData.notes,
      items: orderData.items?.map((item: any) => ({
        name: item.name || item.productName,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: orderData.subtotal,
      total: orderData.total,
      discount: orderData.discount,
    } : {};

    // Serialize and check length (Stripe metadata limit is 500 chars)
    const orderDataJson = JSON.stringify(minimalOrderData);
    let metadata: Record<string, string> = {};
    
    if (orderDataJson.length <= 500) {
      metadata = { orderData: orderDataJson };
    } else {
      // If too large, just store a flag - order data will come from localStorage
      metadata = { hasOrderData: 'true' };
    }

    // Create Stripe checkout session with order data in metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'CN'],
      },
      metadata,
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    }, { status: 500 });
  }
}
