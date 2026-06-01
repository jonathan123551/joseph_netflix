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
}

export interface PaymentResult {
  /** Resulting status to persist on the Purchase/Donation row. */
  status: PaymentStatus;
  /** Provider-side identifier (e.g. Stripe PaymentIntent id), or null for mock. */
  reference: string | null;
  /** For client-confirmed flows (e.g. Stripe Elements). */
  clientSecret?: string | null;
}

/**
 * Abstraction over the payment gateway. The default implementation
 * (MockPaymentProvider) completes payments instantly to preserve the
 * existing MVP behavior. Swap to Stripe by setting PAYMENT_PROVIDER=stripe.
 */
export interface PaymentProvider {
  readonly name: string;
  createPayment(input: PaymentIntentInput): Promise<PaymentResult>;
}
