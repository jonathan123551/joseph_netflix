import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toMovieCard } from '../common/movie-card';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { movie: { include: { assets: true } } },
    });
    return favorites.map((f) => toMovieCard(f.movie));
  }

  async add(userId: string, movieId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }
    await this.prisma.favorite.upsert({
      where: { userId_movieId: { userId, movieId } },
      create: { userId, movieId },
      update: {},
    });
    return { movieId, favorited: true };
  }

  async remove(userId: string, movieId: string) {
    await this.prisma.favorite.deleteMany({ where: { userId, movieId } });
    return { movieId, favorited: false };
  }
}
