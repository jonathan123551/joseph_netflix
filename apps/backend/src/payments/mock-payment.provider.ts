import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PaymentStatus } from '@prisma/client';
import {
  PaymentIntentInput,
  PaymentProvider,
  PaymentResult,
} from './payment-provider.interface';

/**
 * Default provider used until a real gateway is configured. Completes every
 * payment instantly, mirroring the original MVP behavior.
 */
@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  readonly name = 'mock';

  async createPayment(input: PaymentIntentInput): Promise<PaymentResult> {
    return {
      status: PaymentStatus.COMPLETED,
      reference: `mock_${input.kind.toLowerCase()}_${randomUUID()}`,
      clientSecret: null,
    };
  }
}
