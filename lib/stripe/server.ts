import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

export const STRIPE_PLANS = {
  BASIC: {
    priceId: process.env.STRIPE_PRICE_ID_BASIC!,
    name: 'Plan Basic',
    price: 9,
    quota: 50,
  },
  PRO: {
    priceId: process.env.STRIPE_PRICE_ID_PRO!,
    name: 'Plan Pro',
    price: 19,
    quota: 200,
  },
} as const;

export function getPlanByPriceId(priceId: string) {
  return Object.values(STRIPE_PLANS).find(plan => plan.priceId === priceId);
}
