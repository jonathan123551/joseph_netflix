import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';
import { PAYMENT_PROVIDER } from '../payments/payment-provider.interface';
import type { PaymentProvider } from '../payments/payment-provider.interface';

@Injectable()
export class PurchasesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(PAYMENT_PROVIDER) private readonly payments: PaymentProvider,
  ) {}

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

    const payment = await this.payments.createPayment({
      userId,
      amount: Number(movie.price),
      kind: 'PURCHASE',
      description: `Purchase: ${movie.title}`,
      metadata: { movieId },
    });

    return this.prisma.purchase.create({
      data: {
        userId,
        movieId,
        amount: movie.price,
        paymentStatus: payment.status,
        paidAt:
          payment.status === PaymentStatus.COMPLETED ? new Date() : null,
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

    const payment = await this.payments.createPayment({
      userId,
      amount: rentalAmount,
      kind: 'RENTAL',
      description: `Rental: ${movie.title}`,
      metadata: { movieId },
    });

    const purchase = await this.prisma.purchase.create({
      data: {
        userId,
        movieId,
        amount: rentalAmount,
        paymentStatus: payment.status,
        paidAt:
          payment.status === PaymentStatus.COMPLETED ? new Date() : null,
      },
    });

    // Grant access via a WatchSession only once the rental payment clears.
    if (payment.status === PaymentStatus.COMPLETED) {
      await this.prisma.watchSession.create({
        data: {
          userId,
          movieId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          active: true,
        },
      });
    }

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
