// Stripe Integration Helper
// Uses Stripe SDK with the existing JSON database

import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your_stripe_secret_key') {
    return null;
  }
  
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  
  return stripeInstance;
}

export const isStripeConfigured = (): boolean => {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key');
};
