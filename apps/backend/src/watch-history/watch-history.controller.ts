import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';

interface JwtUser {
  sub: string;
  email: string;
  role: string;
}

@ApiTags('watch-history')
@Controller('watch-history')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
export class WatchHistoryController {
  constructor(private readonly watchHistoryService: WatchHistoryService) {}

  @Get()
  @ApiOperation({
    summary: 'Get the current user watch history (continue watching)',
  })
  list(@CurrentUser() user: JwtUser) {
    return this.watchHistoryService.list(user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Record/update watch progress for a movie' })
  update(@CurrentUser() user: JwtUser, @Body() dto: UpdateProgressDto) {
    return this.watchHistoryService.upsertProgress(
      user.sub,
      dto.movieId,
      dto.progressSecs,
    );
  }
}
