import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/profile')
  @ApiOperation({ summary: 'Get current user profile metrics' })
  getProfileStats(@CurrentUser() user: any) {
    return this.usersService.getProfileStats(user.sub);
  }
}
