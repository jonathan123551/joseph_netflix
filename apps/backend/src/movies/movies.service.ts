import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

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
