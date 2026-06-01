import { Global, Module } from '@nestjs/common';
import { PAYMENT_PROVIDER } from './payment-provider.interface';
import { MockPaymentProvider } from './mock-payment.provider';
import { StripePaymentProvider } from './stripe-payment.provider';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController],
  providers: [
    MockPaymentProvider,
    StripePaymentProvider,
    PaymentsService,
    {
      provide: PAYMENT_PROVIDER,
      inject: [MockPaymentProvider, StripePaymentProvider],
      useFactory: (mock: MockPaymentProvider, stripe: StripePaymentProvider) =>
        process.env.PAYMENT_PROVIDER === 'stripe' ? stripe : mock,
    },
  ],
  exports: [PAYMENT_PROVIDER, PaymentsService],
})
export class PaymentsModule {}
