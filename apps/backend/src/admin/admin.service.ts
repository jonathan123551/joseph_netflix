import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverviewStats() {
    const totalUsers = await this.prisma.user.count();
    const totalMovies = await this.prisma.movie.count({
      where: { published: true },
    });

    const donations = await this.prisma.donation.findMany({
      where: { status: 'COMPLETED' },
    });
    const totalDonations = donations.reduce(
      (sum, d) => sum + Number(d.amount),
      0,
    );

    const purchases = await this.prisma.purchase.findMany({
      where: { paymentStatus: 'COMPLETED' },
    });
    const totalPurchaseRevenue = purchases.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    const recentLogs = await this.prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return {
      totalUsers,
      totalMovies,
      totalDonations,
      totalPurchaseRevenue,
      totalRevenue: totalDonations + totalPurchaseRevenue,
      recentLogs: recentLogs.map((log) => ({
        id: log.id,
        action: log.action,
        date: log.createdAt,
        user: log.user ? log.user.name : 'System',
      })),
    };
  }

  async getAnalytics(filter: 'today' | 'week' | 'month' | 'all') {
    let dateFilter = {};
    if (filter !== 'all') {
      const now = new Date();
      let startDate = new Date();
      if (filter === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (filter === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (filter === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      }
      dateFilter = { gte: startDate };
    }

    const donations = await this.prisma.donation.findMany({
      where: {
        status: 'COMPLETED',
        ...(filter !== 'all' && { createdAt: dateFilter }),
      },
    });

    const purchases = await this.prisma.purchase.findMany({
      where: {
        paymentStatus: 'COMPLETED',
        ...(filter !== 'all' && { createdAt: dateFilter }),
      },
    });

    const watchHistory = await this.prisma.watchHistory.findMany({
      where: {
        ...(filter !== 'all' && { lastWatched: dateFilter }),
      },
    });

    const revenue = donations.reduce((sum, d) => sum + Number(d.amount), 0) +
                    purchases.reduce((sum, p) => sum + Number(p.amount), 0);

    const totalWatchTimeSecs = watchHistory.reduce((sum, wh) => sum + wh.progressSecs, 0);

    return {
      revenue,
      donations: donations.length,
      purchases: purchases.length,
      watchTimeHours: totalWatchTimeSecs / 3600,
    };
  }
}
