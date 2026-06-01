import { PrismaClient, Role, AssetType, PaymentStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as argon2 from 'argon2';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seeding database...');

  // Clean existing data
  await prisma.refreshToken.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.watchHistory.deleteMany();
  await prisma.watchSession.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.movieCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.movieActor.deleteMany();
  await prisma.actor.deleteMany();
  await prisma.movieAsset.deleteMany();
  await prisma.movieFile.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database cleaned.');

  // Create Users
  const adminPassword = await argon2.hash('admin123');
  const userPassword = await argon2.hash('password123');

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@josephfilms.com',
      password: adminPassword,
      name: 'Admin Moderator',
      role: Role.ADMIN,
    },
  });

  const guestUser = await prisma.user.create({
    data: {
      email: 'guest@josephfilms.com',
      password: userPassword,
      name: 'Guest Patron',
      role: Role.USER,
    },
  });

  console.log('Users seeded: admin and guest.');

  // Create Categories
  const catTrending = await prisma.category.create({
    data: { name: 'Trending Now', slug: 'trending' },
  });
  const catBiblical = await prisma.category.create({
    data: { name: 'Biblical Epics', slug: 'biblical' },
  });
  const catRecent = await prisma.category.create({
    data: { name: 'Recently Added', slug: 'recently_added' },
  });
  const catDrama = await prisma.category.create({
    data: { name: 'Inspirational Drama', slug: 'drama' },
  });

  console.log('Categories seeded.');

  // Movie Data list
  const moviesToSeed = [
    {
      id: "1",
      title: "The Chosen",
      slug: "the-chosen",
      description: "A charismatic fisherman drowning in debt. A troubled woman wrestling with real demons. A gifted publican ostracized by his family and his people. A religious leader struggling with his beliefs. See Jesus through the eyes of those that met him.",
      duration: 360, // series approximation
      ageRating: "TV-PG",
      year: 2017,
      releaseDate: new Date('2017-12-24'),
      director: "Dallas Jenkins",
      price: 19.99,
      featured: true,
      published: true,
      bannerUrl: "https://images.unsplash.com/photo-1548625361-ecacbd7f465a?q=80&w=2000&auto=format&fit=crop",
      posterUrl: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop",
      genres: ['biblical', 'trending', 'drama'],
      cast: ["Jonathan Roumie", "Shahar Isaac", "Elizabeth Tabish"],
    },
    {
      id: "2",
      title: "Sound of Freedom",
      slug: "sound-of-freedom",
      description: "The incredible true story of a former government agent turned vigilante who embarks on a dangerous mission to rescue hundreds of children from sex traffickers.",
      duration: 131,
      ageRating: "PG-13",
      year: 2023,
      releaseDate: new Date('2023-07-04'),
      director: "Alejandro Monteverde",
      price: 14.99,
      featured: false,
      published: true,
      bannerUrl: "https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?q=80&w=2000&auto=format&fit=crop",
      posterUrl: "https://images.unsplash.com/photo-1534430480872-3498384e54e6?q=80&w=800&auto=format&fit=crop",
      genres: ['trending', 'recent', 'drama'],
      cast: ["Jim Caviezel", "Mira Sorvino", "Bill Camp"],
    },
    {
      id: "3",
      title: "The Passion of the Christ",
      slug: "the-passion-of-the-christ",
      description: "Depicts the final twelve hours in the life of Jesus of Nazareth, on the day of his crucifixion in Jerusalem.",
      duration: 127,
      ageRating: "R",
      year: 2004,
      releaseDate: new Date('2004-02-25'),
      director: "Mel Gibson",
      price: 19.99,
      featured: false,
      published: true,
      bannerUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop",
      posterUrl: "https://images.unsplash.com/photo-1437604620023-e1f13b63198c?q=80&w=800&auto=format&fit=crop",
      genres: ['biblical', 'drama'],
      cast: ["Jim Caviezel", "Monica Bellucci", "Maia Morgenstern"],
    },
    {
      id: "4",
      title: "War Room",
      slug: "war-room",
      description: "A seemingly perfect family looks to fix their problems with the help of Miss Clara, an older, wiser woman.",
      duration: 120,
      ageRating: "PG",
      year: 2015,
      releaseDate: new Date('2015-08-28'),
      director: "Alex Kendrick",
      price: 9.99,
      featured: false,
      published: true,
      bannerUrl: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=2000&auto=format&fit=crop",
      posterUrl: "https://images.unsplash.com/photo-1469048386129-9e8cbb6a6409?q=80&w=800&auto=format&fit=crop",
      genres: ['recent', 'drama'],
      cast: ["Priscilla Shirer", "T.C. Stallings", "Karen Abercrombie"],
    },
    {
      id: "5",
      title: "I Can Only Imagine",
      slug: "i-can-only-imagine",
      description: "The inspiring and unknown true story behind MercyMe's beloved, chart topping song that brings ultimate hope to so many.",
      duration: 110,
      ageRating: "PG",
      year: 2018,
      releaseDate: new Date('2018-03-16'),
      director: "The Erwin Brothers",
      price: 12.99,
      featured: false,
      published: true,
      bannerUrl: "https://images.unsplash.com/photo-1516280440502-6c367831f2dc?q=80&w=2000&auto=format&fit=crop",
      posterUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
      genres: ['drama'],
      cast: ["J. Michael Finley", "Dennis Quaid", "Cloris Leachman"],
    },
    {
      id: "6",
      title: "Jesus Revolution",
      slug: "jesus-revolution",
      description: "The true story of a national spiritual awakening in the early 1970s and its origins within a community of teenage hippies in Southern California.",
      duration: 120,
      ageRating: "PG-13",
      year: 2023,
      releaseDate: new Date('2023-02-24'),
      director: "Jon Erwin",
      price: 14.99,
      featured: false,
      published: true,
      bannerUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
      posterUrl: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=800&auto=format&fit=crop",
      genres: ['trending', 'drama'],
      cast: ["Joel Courtney", "Jonathan Roumie", "Kelsey Grammer"],
    },
    {
      id: "7",
      title: "Paul, Apostle of Christ",
      slug: "paul-apostle-of-christ",
      description: "The story of Paul, who goes from the most infamous persecutor of Christians to Christ's most influential apostle.",
      duration: 108,
      ageRating: "PG-13",
      year: 2018,
      releaseDate: new Date('2018-03-23'),
      director: "Andrew Hyatt",
      price: 9.99,
      featured: false,
      published: true,
      bannerUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=2000&auto=format&fit=crop",
      posterUrl: "https://images.unsplash.com/photo-1533423996375-f914ab1844b2?q=80&w=800&auto=format&fit=crop",
      genres: ['biblical', 'drama'],
      cast: ["Jim Caviezel", "James Faulkner", "Olivier Martinez"],
    }
  ];

  for (const movieData of moviesToSeed) {
    const movie = await prisma.movie.create({
      data: {
        id: movieData.id,
        title: movieData.title,
        slug: movieData.slug,
        description: movieData.description,
        duration: movieData.duration,
        ageRating: movieData.ageRating,
        releaseDate: movieData.releaseDate,
        price: movieData.price,
        featured: movieData.featured,
        published: movieData.published,
        trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    });

    // Create assets (BANNER & POSTER)
    await prisma.movieAsset.create({
      data: {
        movieId: movie.id,
        type: AssetType.BANNER,
        url: movieData.bannerUrl,
      },
    });

    await prisma.movieAsset.create({
      data: {
        movieId: movie.id,
        type: AssetType.POSTER,
        url: movieData.posterUrl,
      },
    });

    // Add MovieFiles (1080p, 4K)
    await prisma.movieFile.create({
      data: {
        movieId: movie.id,
        quality: "1080p",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        isActive: true,
      },
    });

    // Add to categories
    for (const genre of movieData.genres) {
      let catId = '';
      if (genre === 'trending') catId = catTrending.id;
      else if (genre === 'biblical') catId = catBiblical.id;
      else if (genre === 'recent') catId = catRecent.id;
      else if (genre === 'drama') catId = catDrama.id;

      if (catId) {
        await prisma.movieCategory.create({
          data: {
            movieId: movie.id,
            categoryId: catId,
          },
        });
      }
    }

    // Add Actors
    for (const actorName of movieData.cast) {
      // Find or create actor
      let actor = await prisma.actor.findFirst({
        where: { name: actorName },
      });

      if (!actor) {
        actor = await prisma.actor.create({
          data: { name: actorName, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000" },
        });
      }

      await prisma.movieActor.create({
        data: {
          movieId: movie.id,
          actorId: actor.id,
        },
      });
    }
  }

  console.log('Movies, Assets, Files, Actors, and Category connections seeded.');

  // Create Mock Purchases for Guest User (Seeding continuous dashboard state)
  const chosenMovie = await prisma.movie.findFirst({ where: { slug: 'the-chosen' } });
  const freedomMovie = await prisma.movie.findFirst({ where: { slug: 'sound-of-freedom' } });

  if (chosenMovie && guestUser) {
    await prisma.purchase.create({
      data: {
        userId: guestUser.id,
        movieId: chosenMovie.id,
        amount: chosenMovie.price,
        paymentStatus: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
    });
  }

  if (freedomMovie && guestUser) {
    await prisma.purchase.create({
      data: {
        userId: guestUser.id,
        movieId: freedomMovie.id,
        amount: freedomMovie.price,
        paymentStatus: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
    });
  }

  // Create Mock Donations for Guest User
  if (guestUser) {
    await prisma.donation.create({
      data: {
        userId: guestUser.id,
        amount: 50.00,
        status: PaymentStatus.COMPLETED,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    });

    await prisma.donation.create({
      data: {
        userId: guestUser.id,
        amount: 100.00,
        status: PaymentStatus.COMPLETED,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
    });
  }

  console.log('Mock Purchases and Donations seeded.');
  console.log('Seeding process complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
