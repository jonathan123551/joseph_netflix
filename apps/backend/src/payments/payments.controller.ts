import { Controller, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout-session')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Create Stripe checkout session (Mock URL token returned)',
  })
  createCheckoutSession(
    @CurrentUser() user: any,
    @Body('amount') amount: number,
    @Body('type') type: 'purchase' | 'rent' | 'donation',
    @Body('movieId') movieId?: string,
  ) {
    return this.paymentsService.createCheckoutSession(
      user.sub,
      amount,
      type,
      movieId,
    );
  }

  @Post('webhook')
  @ApiOperation({
    summary: 'Stripe webhook (Mocks database updates on success callbacks)',
  })
  handleWebhook(
    @Body() payload: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.verifyWebhook(payload, signature);
  }
}
