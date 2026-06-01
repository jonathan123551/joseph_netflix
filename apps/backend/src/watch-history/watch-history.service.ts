import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toMovieCard } from '../common/movie-card';

@Injectable()
export class WatchHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const history = await this.prisma.watchHistory.findMany({
      where: { userId },
      orderBy: { lastWatched: 'desc' },
      include: { movie: { include: { assets: true } } },
    });
    return history.map((h) => ({
      ...toMovieCard(h.movie),
      progressSecs: h.progressSecs,
      lastWatched: h.lastWatched,
    }));
  }

  async upsertProgress(userId: string, movieId: string, progressSecs: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }
    return this.prisma.watchHistory.upsert({
      where: { userId_movieId: { userId, movieId } },
      create: { userId, movieId, progressSecs },
      update: { progressSecs, lastWatched: new Date() },
    });
  }
}
