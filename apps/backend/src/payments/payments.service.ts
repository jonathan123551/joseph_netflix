import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
  constructor(private readonly prisma: PrismaService) {}

  async createCheckoutSession(
    userId: string,
    amount: number,
    type: 'purchase' | 'rent' | 'donation',
    movieId?: string,
  ) {
    const sessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;
    let referenceId = '';

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

    return {
      sessionId,
      url: `https://checkout.stripe.com/pay/${sessionId}?ref=${referenceId}&type=${type}`,
      success: true,
    };
  }

  async verifyWebhook(payload: any, signature: string) {
    const eventType = payload.type;
    const session = payload.data?.object;

    if (eventType === 'checkout.session.completed' && session) {
      const referenceId = session.metadata?.referenceId;
      const type = session.metadata?.type;

      if (type === 'purchase' || type === 'rent') {
        await this.prisma.purchase.update({
          where: { id: referenceId },
          data: {
            paymentStatus: 'COMPLETED',
            paidAt: new Date(),
          },
        });
      } else if (type === 'donation') {
        await this.prisma.donation.update({
          where: { id: referenceId },
          data: {
            status: 'COMPLETED',
          },
        });
      }
      return { received: true, processed: true };
    }

    return { received: true, processed: false };
  }
}
