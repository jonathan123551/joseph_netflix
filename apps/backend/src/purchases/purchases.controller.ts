import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('purchases')
@Controller('purchases')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post('buy')
  @ApiOperation({ summary: 'Purchase a movie permanently' })
  buyMovie(@CurrentUser() user: any, @Body('movieId') movieId: string) {
    return this.purchasesService.buyMovie(user.sub, movieId);
  }

  @Post('rent')
  @ApiOperation({ summary: 'Rent a movie for 30 days' })
  rentMovie(@CurrentUser() user: any, @Body('movieId') movieId: string) {
    return this.purchasesService.rentMovie(user.sub, movieId);
  }

  @Get('my-library')
  @ApiOperation({ summary: 'Get user purchased movies' })
  getMyLibrary(@CurrentUser() user: any) {
    return this.purchasesService.getMyLibrary(user.sub);
  }
}
