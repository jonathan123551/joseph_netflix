import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, createReviewDto: CreateReviewDto) {
    return this.prisma.review.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId: createReviewDto.movieId,
        },
      },
      update: {
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
      },
      create: {
        userId,
        movieId: createReviewDto.movieId,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
      },
    });
  }

  findAll(movieId?: string) {
    if (movieId) {
      return this.prisma.review.findMany({
        where: { movieId },
        include: { user: { select: { id: true, name: true } } },
      });
    }
    return this.prisma.review.findMany();
  }

  findOne(id: string) {
    return this.prisma.review.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  update(id: string, updateReviewDto: UpdateReviewDto) {
    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  remove(id: string) {
    return this.prisma.review.delete({
      where: { id },
    });
  }
}

