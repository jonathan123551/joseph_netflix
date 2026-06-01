import { Global, Module } from '@nestjs/common';
import { PAYMENT_PROVIDER } from './payment-provider.interface';
import { MockPaymentProvider } from './mock-payment.provider';
import { StripePaymentProvider } from './stripe-payment.provider';

@Global()
@Module({
  providers: [
    MockPaymentProvider,
    StripePaymentProvider,
    {
      provide: PAYMENT_PROVIDER,
      inject: [MockPaymentProvider, StripePaymentProvider],
      useFactory: (mock: MockPaymentProvider, stripe: StripePaymentProvider) =>
        process.env.PAYMENT_PROVIDER === 'stripe' ? stripe : mock,
    },
  ],
  exports: [PAYMENT_PROVIDER],
})
export class PaymentsModule {}
