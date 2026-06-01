import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('donations')
@Controller('donations')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a tax-deductible ministry donation' })
  donate(@CurrentUser() user: any, @Body('amount') amount: number) {
    return this.donationsService.donate(user.sub, amount);
  }

  @Get('my-contributions')
  @ApiOperation({ summary: 'Get user donation history' })
  getMyContributions(@CurrentUser() user: any) {
    return this.donationsService.getMyContributions(user.sub);
  }
}
