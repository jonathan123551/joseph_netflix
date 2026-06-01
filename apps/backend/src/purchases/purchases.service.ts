import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  async buyMovie(userId: string, movieId: string) {
    // Check if already purchased
    const existing = await this.prisma.purchase.findFirst({
      where: {
        userId,
        movieId,
        paymentStatus: PaymentStatus.COMPLETED,
      },
    });

    if (existing) {
      return existing;
    }

    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    return this.prisma.purchase.create({
      data: {
        userId,
        movieId,
        amount: movie.price,
        paymentStatus: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
    });
  }

  async rentMovie(userId: string, movieId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    // Rental cost is typically 4.99
    const rentalAmount = 4.99;

    const purchase = await this.prisma.purchase.create({
      data: {
        userId,
        movieId,
        amount: rentalAmount,
        paymentStatus: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
    });

    // Create a WatchSession for rentals (active for 30 days)
    await this.prisma.watchSession.create({
      data: {
        userId,
        movieId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        active: true,
      },
    });

    return purchase;
  }

  async getMyLibrary(userId: string) {
    const purchases = await this.prisma.purchase.findMany({
      where: {
        userId,
        paymentStatus: PaymentStatus.COMPLETED,
      },
      include: {
        movie: {
          include: {
            assets: true,
          },
        },
      },
    });

    return purchases.map((p) => {
      const bannerAsset = p.movie.assets.find((a) => a.type === 'BANNER');
      const posterAsset = p.movie.assets.find((a) => a.type === 'POSTER');
      return {
        id: p.movie.id,
        title: p.movie.title,
        slug: p.movie.slug,
        description: p.movie.description,
        duration: `${Math.floor(p.movie.duration / 60)}h ${p.movie.duration % 60}m`,
        rating: p.movie.ageRating,
        year: p.movie.releaseDate ? new Date(p.movie.releaseDate).getFullYear() : 2024,
        bannerUrl: bannerAsset ? bannerAsset.url : '',
        posterUrl: posterAsset ? posterAsset.url : '',
        genres: ['Purchased'],
      };
    });
  }
}
