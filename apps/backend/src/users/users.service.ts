import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfileStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const purchasesCount = await this.prisma.purchase.count({
      where: { userId, paymentStatus: 'COMPLETED' },
    });

    const donations = await this.prisma.donation.findMany({
      where: { userId, status: 'COMPLETED' },
    });

    const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount), 0);

    return {
      name: user.name,
      email: user.email,
      role: user.role,
      purchasedCount: purchasesCount,
      totalDonations: totalDonations,
    };
  }
}
