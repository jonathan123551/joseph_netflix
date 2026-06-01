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

  createPayment(input: PaymentIntentInput): Promise<PaymentResult> {
    return Promise.resolve({
      status: PaymentStatus.COMPLETED,
      reference: `mock_${input.kind.toLowerCase()}_${randomUUID()}`,
      clientSecret: null,
    });
  }
}
