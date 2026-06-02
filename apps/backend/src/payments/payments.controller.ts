import { Controller, Post, Body, UseGuards, Headers, Req, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
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
    summary: 'Create Stripe checkout session or Payment Intent for donations',
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
    summary: 'Stripe webhook listener to finalize purchases and donations',
  })
  handleWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
  ) {
    // Pass the raw buffer down to the service for signature verification
    return this.paymentsService.verifyWebhook(req.rawBody, signature);
  }
}
