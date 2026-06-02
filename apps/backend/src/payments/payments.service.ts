import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PAYMENT_PROVIDER, PaymentProvider, PaymentKind } from './payment-provider.interface';
import { StripePaymentProvider } from './stripe-payment.provider';
import Stripe from 'stripe';

export interface IPaymentService {
  createCheckoutSession(
    userId: string,
    amount: number,
    type: 'purchase' | 'rent' | 'donation',
    movieId?: string,
  ): Promise<any>;
  verifyWebhook(payload: any, signature: string): Promise<any>;
}

@Injectable()
export class PaymentsService implements IPaymentService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(PAYMENT_PROVIDER) private readonly provider: any
  ) {}

  async createCheckoutSession(
    userId: string,
    amount: number,
    type: 'purchase' | 'rent' | 'donation',
    movieId?: string,
  ) {
    let referenceId = '';
    const kind: PaymentKind = type === 'purchase' ? 'PURCHASE' : type === 'rent' ? 'RENTAL' : 'DONATION';
    const description = kind === 'DONATION' ? 'Ministry Donation' : kind === 'RENTAL' ? 'Movie Rental' : 'Movie Purchase';

    // 1. Create DB Row
    if (type === 'purchase' || type === 'rent') {
      if (!movieId) throw new Error('Movie ID is required for movie checkouts');
      const purchase = await this.prisma.purchase.create({
        data: {
          userId,
          movieId,
          paymentStatus: 'PENDING',
          amount,
        },
      });
      referenceId = purchase.id;
    } else if (type === 'donation') {
      const donation = await this.prisma.donation.create({
        data: {
          userId,
          amount,
          status: 'PENDING',
        },
      });
      referenceId = donation.id;
    }

    // 2. Pass to Gateway
    const result = await this.provider.createPayment({
      userId,
      amount,
      kind,
      description,
      referenceId,
    });

    // 3. Return payload to client
    if (kind === 'DONATION') {
      return {
        success: true,
        clientSecret: result.clientSecret,
        referenceId,
      };
    } else {
      return {
        success: true,
        url: result.checkoutUrl,
        referenceId,
      };
    }
  }

  async verifyWebhook(payload: any, signature: string) {
    if (this.provider.name === 'stripe') {
      const stripeProvider = this.provider as StripePaymentProvider;
      let event: any;
      try {
        event = stripeProvider.constructEvent(payload, signature);
      } catch (err: any) {
        this.logger.error(`Webhook signature verification failed.`, err.message);
        throw new Error(`Webhook Error: ${err.message}`);
      }

      // Handle the event
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        await this.fulfillOrder(session.metadata);
      } else if (event.type === 'payment_intent.succeeded') {
        const intent = event.data.object as any;
        await this.fulfillOrder(intent.metadata);
      }
      return { received: true, processed: true };
    }

    // Mock provider fallback
    return { received: true, processed: false };
  }

  private async fulfillOrder(metadata: Record<string, string> | null) {
    if (!metadata) return;
    const { referenceId, kind } = metadata;
    if (!referenceId) return;

    if (kind === 'PURCHASE' || kind === 'RENTAL') {
      await this.prisma.purchase.update({
        where: { id: referenceId },
        data: {
          paymentStatus: 'COMPLETED',
          paidAt: new Date(),
        },
      });
    } else if (kind === 'DONATION') {
      await this.prisma.donation.update({
        where: { id: referenceId },
        data: {
          status: 'COMPLETED',
        },
      });
    }
  }
}
