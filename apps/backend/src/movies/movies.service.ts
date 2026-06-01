import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { toMovieCard } from '../common/movie-card';
import { VIDEO_PROVIDER } from '../video/video-provider.interface';
import type { VideoProvider } from '../video/video-provider.interface';

@Injectable()
export class MoviesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(VIDEO_PROVIDER) private readonly video: VideoProvider,
  ) {}

  /**
   * Resolve a streamable playback source for a movie the user is entitled to
   * (a COMPLETED purchase or an active, unexpired rental WatchSession).
   * The URL is produced by the configured VideoProvider (local or Bunny.net).
   */
  async getPlayback(userId: string, movieId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
      select: { id: true, title: true, published: true },
    });
    if (!movie || !movie.published) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    const owns = await this.prisma.purchase.findFirst({
      where: { userId, movieId, paymentStatus: PaymentStatus.COMPLETED },
      select: { id: true },
    });
    const rental = owns
      ? null
      : await this.prisma.watchSession.findFirst({
          where: {
            userId,
            movieId,
            active: true,
            expiresAt: { gt: new Date() },
          },
          select: { id: true },
        });
    if (!owns && !rental) {
      throw new ForbiddenException(
        'You must purchase or rent this movie to watch it',
      );
    }

    const file = await this.prisma.movieFile.findFirst({
      where: { movieId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    if (!file) {
      throw new NotFoundException('No playable file available for this movie');
    }

    const source = this.video.getPlaybackSource({
      url: file.url,
      quality: file.quality,
      storageProvider: file.storageProvider,
      storagePath: file.storagePath,
    });

    return { movieId: movie.id, title: movie.title, ...source };
  }

  async search(query: string) {
    const q = query.trim();
    if (!q) {
      return [];
    }
    const movies = await this.prisma.movie.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: { assets: true },
      take: 20,
    });
    return movies.map((m) => toMovieCard(m));
  }

  async findAll() {
    return this.prisma.movie.findMany({
      where: { published: true },
      include: {
        assets: true,
      },
    });
  }

  async findFeatured() {
    const movie = await this.prisma.movie.findFirst({
      where: { published: true, featured: true },
      include: {
        assets: true,
      },
    });
    if (!movie) {
      // Fallback to first published movie
      return this.prisma.movie.findFirst({
        where: { published: true },
        include: {
          assets: true,
        },
      });
    }
    return movie;
  }

  async findOne(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        assets: true,
        actors: {
          include: {
            actor: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        movieFiles: {
          where: { isActive: true },
        },
      },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async getCategories() {
    const categories = await this.prisma.category.findMany({
      include: {
        movies: {
          include: {
            movie: {
              include: {
                assets: true,
              },
            },
          },
        },
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      title: cat.name,
      slug: cat.slug,
      items: cat.movies
        .filter((cm) => cm.movie.published)
        .map((cm) => {
          const bannerAsset = cm.movie.assets.find((a) => a.type === 'BANNER');
          const posterAsset = cm.movie.assets.find((a) => a.type === 'POSTER');
          return {
            id: cm.movie.id,
            title: cm.movie.title,
            slug: cm.movie.slug,
            description: cm.movie.description,
            duration: `${Math.floor(cm.movie.duration / 60)}h ${cm.movie.duration % 60}m`,
            rating: cm.movie.ageRating,
            year: cm.movie.releaseDate ? new Date(cm.movie.releaseDate).getFullYear() : 2024,
            bannerUrl: bannerAsset ? bannerAsset.url : '',
            posterUrl: posterAsset ? posterAsset.url : '',
            genres: [cat.name],
          };
        }),
    }));
  }

  async create(data: any) {
    return this.prisma.movie.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.movie.update({
      where: { id },
      data,
    });
  }
}
