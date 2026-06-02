import { PaymentStatus } from '@prisma/client';

export const PAYMENT_PROVIDER = 'PAYMENT_PROVIDER';

export type PaymentKind = 'PURCHASE' | 'RENTAL' | 'DONATION';

export interface PaymentIntentInput {
  userId: string;
  amount: number;
  currency?: string;
  kind: PaymentKind;
  description: string;
  metadata?: Record<string, string>;
  referenceId?: string; // DB reference ID (e.g. Purchase ID or Donation ID)
}

export interface PaymentResult {
  /** Resulting status to persist on the Purchase/Donation row. */
  status: PaymentStatus;
  /** Provider-side identifier (e.g. Stripe PaymentIntent id), or null for mock. */
  reference: string | null;
  /** For client-confirmed flows (e.g. Stripe Elements). */
  clientSecret?: string | null;
  /** For redirect flows (e.g. Stripe Checkout Sessions). */
  checkoutUrl?: string | null;
}

export interface PaymentProvider {
  readonly name: string;
  createPayment(input: PaymentIntentInput): Promise<PaymentResult>;
}
