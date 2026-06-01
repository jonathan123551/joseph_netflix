import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';

interface JwtUser {
  sub: string;
  email: string;
  role: string;
}

@ApiTags('favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'List the current user favorite movies' })
  list(@CurrentUser() user: JwtUser) {
    return this.favoritesService.list(user.sub);
  }

  @Post(':movieId')
  @ApiOperation({ summary: 'Add a movie to favorites' })
  add(@CurrentUser() user: JwtUser, @Param('movieId') movieId: string) {
    return this.favoritesService.add(user.sub, movieId);
  }

  @Delete(':movieId')
  @ApiOperation({ summary: 'Remove a movie from favorites' })
  remove(@CurrentUser() user: JwtUser, @Param('movieId') movieId: string) {
    return this.favoritesService.remove(user.sub, movieId);
  }
}
