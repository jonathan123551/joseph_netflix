import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiCookieAuth,
} from '@nestjs/swagger';

interface JwtUser {
  sub: string;
  email: string;
  role: string;
}

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published movies' })
  findAll() {
    return this.moviesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search published movies by title/description' })
  @ApiQuery({ name: 'q', required: false })
  search(@Query('q') q = '') {
    return this.moviesService.search(q);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get the featured movie' })
  findFeatured() {
    return this.moviesService.findFeatured();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get categorized movie rows' })
  getCategories() {
    return this.moviesService.getCategories();
  }

  @Get(':id/playback')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get a playback source (requires purchase/rental)' })
  getPlayback(@CurrentUser() user: JwtUser, @Param('id') id: string, @Req() req: any) {
    const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;
    return this.moviesService.getPlayback(user.sub, id, clientIp);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie details by ID' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create movie (Admin only)' })
  create(@Body() data: any) {
    return this.moviesService.create(data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update movie (Admin only)' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.moviesService.update(id, data);
  }
}
