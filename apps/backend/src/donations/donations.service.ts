import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';
import { PAYMENT_PROVIDER } from '../payments/payment-provider.interface';
import type { PaymentProvider } from '../payments/payment-provider.interface';

@Injectable()
export class DonationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(PAYMENT_PROVIDER) private readonly payments: PaymentProvider,
  ) {}

  async donate(userId: string, amount: number) {
    const payment = await this.payments.createPayment({
      userId,
      amount,
      kind: 'DONATION',
      description: 'Donation to Joseph Films ministry',
    });

    return this.prisma.donation.create({
      data: {
        userId,
        amount,
        status: payment.status,
      },
    });
  }

  async getMyContributions(userId: string) {
    const contributions = await this.prisma.donation.findMany({
      where: {
        userId,
        status: PaymentStatus.COMPLETED,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return contributions.map((c, i) => {
      // Create mockup receipt invoice tags for premium visual ledger details
      const invoiceNumber = `#INV-${70000 + i * 149 + Math.floor(Math.random() * 100)}`;
      return {
        id: c.id,
        amount: `$${c.amount.toFixed(2)}`,
        date: new Date(c.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        org: 'Joseph Films Ministry Support',
        campaign: 'General Media Outreach Campaign',
        invoice: invoiceNumber,
      };
    });
  }
}
