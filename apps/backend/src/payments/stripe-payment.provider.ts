import { Injectable, Logger } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';
import {
  PaymentIntentInput,
  PaymentProvider,
  PaymentResult,
} from './payment-provider.interface';

@Injectable()
export class StripePaymentProvider implements PaymentProvider {
  readonly name = 'stripe';
  private readonly logger = new Logger(StripePaymentProvider.name);
  private stripe: any | null = null;

  constructor() {
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
  }

  async createPayment(input: PaymentIntentInput): Promise<PaymentResult> {
    if (!this.stripe) {
      this.logger.warn(`STRIPE_SECRET_KEY missing; mock mode fallback`);
      return { status: PaymentStatus.PENDING, reference: null, clientSecret: null };
    }

    if (input.kind === 'DONATION') {
      const intent = await this.stripe.paymentIntents.create({
        amount: Math.round(input.amount * 100),
        currency: input.currency ?? 'usd',
        metadata: { userId: input.userId, kind: input.kind, referenceId: input.referenceId ?? '' },
      });
      return {
        status: PaymentStatus.PENDING,
        reference: intent.id,
        clientSecret: intent.client_secret,
      };
    } else {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: input.currency ?? 'usd',
              product_data: {
                name: input.description,
              },
              unit_amount: Math.round(input.amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cancel`,
        metadata: { userId: input.userId, kind: input.kind, referenceId: input.referenceId ?? '' },
      });

      return {
        status: PaymentStatus.PENDING,
        reference: session.id,
        checkoutUrl: session.url,
      };
    }
  }

  get webhookSecret(): string | undefined {
    return process.env.STRIPE_WEBHOOK_SECRET;
  }

  constructEvent(payload: Buffer, signature: string): any {
    if (!this.stripe || !this.webhookSecret) {
      throw new Error('Stripe not configured');
    }
    return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
  }
}
