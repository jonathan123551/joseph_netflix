import { Injectable, Logger } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import {
  PaymentIntentInput,
  PaymentProvider,
  PaymentResult,
} from './payment-provider.interface';

/**
 * Stripe-ready provider. This is intentionally a thin, dependency-free
 * scaffold: when STRIPE_SECRET_KEY is set the implementation below should
 * create a PaymentIntent via the Stripe SDK and return its id + client_secret,
 * leaving the row PENDING until a webhook confirms it. Until the SDK is wired,
 * selecting this provider returns PENDING so nothing is silently marked paid.
 *
 * To finish wiring:
 *   1. `pnpm --filter backend add stripe`
 *   2. const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
 *   3. const intent = await stripe.paymentIntents.create({
 *        amount: Math.round(input.amount * 100),
 *        currency: input.currency ?? 'usd',
 *        metadata: { userId: input.userId, kind: input.kind, ...input.metadata },
 *      })
 *   4. return { status: PENDING, reference: intent.id, clientSecret: intent.client_secret }
 *   5. Add a webhook controller that flips the row to COMPLETED/FAILED.
 */
@Injectable()
export class StripePaymentProvider implements PaymentProvider {
  readonly name = 'stripe';
  private readonly logger = new Logger(StripePaymentProvider.name);

  async createPayment(input: PaymentIntentInput): Promise<PaymentResult> {
    if (!process.env.STRIPE_SECRET_KEY) {
      this.logger.warn(
        'PAYMENT_PROVIDER=stripe but STRIPE_SECRET_KEY is not set; returning PENDING.',
      );
    }
    return {
      status: PaymentStatus.PENDING,
      reference: null,
      clientSecret: null,
    };
  }
}
