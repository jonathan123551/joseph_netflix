import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './movies/movies.module';
import { PurchasesModule } from './purchases/purchases.module';
import { DonationsModule } from './donations/donations.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { FavoritesModule } from './favorites/favorites.module';
import { WatchHistoryModule } from './watch-history/watch-history.module';
import { PaymentsModule } from './payments/payments.module';
import { VideoModule } from './video/video.module';
import { MinistriesModule } from './ministries/ministries.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    MoviesModule,
    PurchasesModule,
    DonationsModule,
    UsersModule,
    AdminModule,
    FavoritesModule,
    WatchHistoryModule,
    PaymentsModule,
    VideoModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100, // Increase limits for demo dashboard loads
      },
    ]),
    MinistriesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
