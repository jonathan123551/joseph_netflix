import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

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

  @Get(':id')
  @ApiOperation({ summary: 'Get movie details by ID' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create movie (Admin only mock)' })
  create(@Body() data: any) {
    return this.moviesService.create(data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update movie (Admin only mock)' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.moviesService.update(id, data);
  }
}
