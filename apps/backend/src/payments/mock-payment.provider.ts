import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  PaymentIntentInput,
  PaymentProvider,
  PaymentResult,
} from './payment-provider.interface';

@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  readonly name = 'mock';

  createPayment(input: PaymentIntentInput): Promise<PaymentResult> {
    return Promise.resolve({
      status: PaymentStatus.COMPLETED, // Instantly complete in mock
      reference: `mock_${input.kind.toLowerCase()}_${randomUUID()}`,
      checkoutUrl: `http://localhost:3000/success?session_id=mock_session`,
      clientSecret: `mock_secret_${randomUUID()}`,
    });
  }
}
