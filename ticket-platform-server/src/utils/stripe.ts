
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from './../config/index';

const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-09-30.acacia" as any, // Using type assertion to avoid type error if version doesn't strictly match library
  typescript: true,
});

export default stripe;
