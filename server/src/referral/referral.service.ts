import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

@Injectable()
export class ReferralService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  // ─── Public Methods ─────────────────────────────────────────────

  async validateReferralCode(referralCode: string) {
    const referrer = await this.prisma.user.findUnique({
      where: { referralCode },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    if (!referrer) {
      return {
        valid: false,
        message: 'Invalid referral code',
      };
    }

    return {
      valid: true,
      referrer: {
        firstName: referrer.firstName ?? undefined,
        lastName: referrer.lastName ?? undefined,
        email: referrer.email,
        memberSince: referrer.createdAt,
      },
      message: 'Valid referral code',
    };
  }

  // ─── User Referral Management ──────────────────────────────────

  async getUserReferralCode(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true },
    });

    if (!user || !user.referralCode) {
      throw new NotFoundException('User or referral code not found');
    }

    const baseUrl = this.configService.get(
      'APP_BASE_URL',
      'https://yourapp.com',
    );
    const referralLink = `${baseUrl}/signup?ref=${user.referralCode}`;

    return {
      referralCode: user.referralCode,
      referralLink,
      shareMessage: `Join me on our platform! Use my referral code: ${user.referralCode} or click: ${referralLink}`,
    };
  }

  async getUserReferrals(userId: string) {
    const referrals = await this.prisma.user.findMany({
      where: { referredById: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        kycStatus: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return referrals.map((referral) => ({
      id: referral.id,
      email: referral.email,
      firstName: referral.firstName ?? undefined,
      lastName: referral.lastName ?? undefined,
      createdAt: referral.createdAt,
      status: referral.kycStatus || 'PENDING',
    }));
  }

  async getUserReferralStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true },
    });

    if (!user || !user.referralCode) {
      throw new NotFoundException('User not found');
    }

    // Get referral count
    const totalReferrals = await this.prisma.user.count({
      where: { referredById: userId },
    });

    // Get referral rewards (from Referral table)
    const referralRewards = await this.prisma.referral.findMany({
      where: { inviterId: userId },
      select: { reward: true },
    });

    const totalRewards = referralRewards.reduce(
      (sum, ref) => sum + Number(ref.reward),
      0,
    );

    // Get recent referrals with details
    const recentReferrals = await this.prisma.user.findMany({
      where: { referredById: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      totalReferrals,
      totalRewards,
      myReferralCode: user.referralCode,
      referrals: recentReferrals.map((ref) => ({
        id: ref.id,
        email: ref.email,
        firstName: ref.firstName ?? undefined,
        lastName: ref.lastName ?? undefined,
        createdAt: ref.createdAt,
        reward: 0, // You can implement reward calculation per referral
      })),
    };
  }

  // ─── Referral Processing ───────────────────────────────────────

  async processReferralReward(referrerId: string, refereeId: string) {
    const rewardAmount = this.configService.get(
      'REFERRAL_REWARD_AMOUNT',
      '1000',
    ); // Default 1000 NGN

    try {
      return await this.prisma.$transaction(async (tx) => {
        // Create referral record
        const referral = await tx.referral.create({
          data: {
            code: await this.generateUniqueReferralCode(), // Generate tracking code
            inviterId: referrerId,
            inviteeId: refereeId,
            reward: BigInt(rewardAmount),
          },
        });

        // Find referrer's NGN wallet
        const referrerWallet = await tx.wallet.findUnique({
          where: {
            userId_currency: {
              userId: referrerId,
              currency: 'NGN',
            },
          },
        });

        if (referrerWallet) {
          // Add reward to referrer's wallet
          await tx.wallet.update({
            where: { id: referrerWallet.id },
            data: {
              balance: {
                increment: rewardAmount,
              },
            },
          });

          // Create transaction record
          await tx.transaction.create({
            data: {
              userId: referrerId,
              fromWalletId: referrerWallet.id,
              toWalletId: referrerWallet.id,
              type: 'DEPOSIT',
              amount: BigInt(rewardAmount),
              nairaAmount: rewardAmount,
              currency: 'NGN',
              description: `Referral reward for inviting user`,
              status: 'COMPLETED',
            },
          });
        }

        return referral;
      });
    } catch (error) {
      console.error('Error processing referral reward:', error);
      throw error;
    }
  }

  // ─── Leaderboard & Statistics ──────────────────────────────────

  async getReferralLeaderboard(limit: number = 10) {
    const topReferrers = await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        referralCode: true,
        _count: {
          select: {
            referrals: true, // Count of referred users
          },
        },
      },
      orderBy: {
        referrals: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    // Get rewards for each user
    const leaderboard = await Promise.all(
      topReferrers.map(async (user, index) => {
        const rewards = await this.prisma.referral.aggregate({
          where: { inviterId: user.id },
          _sum: { reward: true },
        });

        return {
          rank: index + 1,
          firstName: user.firstName ?? 'Anonymous',
          lastName: user.lastName ?? '',
          referralCode: user.referralCode,
          totalReferrals: user._count.referrals,
          totalRewards: Number(rewards._sum.reward || 0),
        };
      }),
    );

    return leaderboard;
  }

  // ─── Admin Methods ─────────────────────────────────────────────

  async getReferralByCode(code: string) {
    const referral = await this.prisma.referral.findUnique({
      where: { code },
    });

    if (!referral) {
      throw new NotFoundException('Referral not found');
    }

    // Get inviter and invitee separately
    const [inviter, invitee] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: referral.inviterId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      }),
      referral.inviteeId
        ? this.prisma.user.findUnique({
            where: { id: referral.inviteeId },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          })
        : null,
    ]);

    return {
      ...referral,
      reward: Number(referral.reward),
      inviter,
      invitee,
    };
  }

  async getUserReferralHistory(userId: string) {
    // Get referrals sent by this user
    const sentReferrals = await this.prisma.referral.findMany({
      where: { inviterId: userId },
      orderBy: { createdAt: 'desc' },
    });

    // Get referral received by this user
    const receivedReferral = await this.prisma.referral.findFirst({
      where: { inviteeId: userId },
    });

    // Get user details for sent referrals
    const sentReferralsWithDetails = await Promise.all(
      sentReferrals.map(async (ref) => {
        const invitee = ref.inviteeId
          ? await this.prisma.user.findUnique({
              where: { id: ref.inviteeId },
              select: { email: true, firstName: true, lastName: true },
            })
          : null;

        return {
          ...ref,
          reward: Number(ref.reward),
          invitee,
        };
      }),
    );

    // Get user details for received referral
    let receivedReferralWithDetails: {
      id: string;
      createdAt: Date;
      code: string | null;
      inviterId: string;
      inviteeId: string | null;
      reward: number;
      inviter: {
        email: string;
        firstName: string | null;
        lastName: string | null;
      } | null;
    } | null = null;
    if (receivedReferral) {
      const inviter = await this.prisma.user.findUnique({
        where: { id: receivedReferral.inviterId },
        select: { email: true, firstName: true, lastName: true },
      });

      receivedReferralWithDetails = {
        ...receivedReferral,
        reward: Number(receivedReferral.reward),
        inviter,
      };
    }

    return {
      sentReferrals: sentReferralsWithDetails,
      receivedReferral: receivedReferralWithDetails,
    };
  }

  async generateNewReferralCode(userId: string) {
    // Check if user can generate new code (implement your business logic)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true, createdAt: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Example: Allow new code generation only if account is older than 30 days
    const accountAge = Date.now() - user.createdAt.getTime();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    if (accountAge < thirtyDays) {
      throw new BadRequestException(
        'Account must be at least 30 days old to generate new referral code',
      );
    }

    const newReferralCode = await this.generateUniqueReferralCode();

    await this.prisma.user.update({
      where: { id: userId },
      data: { referralCode: newReferralCode },
    });

    return {
      referralCode: newReferralCode,
      message: 'New referral code generated successfully',
    };
  }

  // ─── Helper Methods ─────────────────────────────────────────────

  private async generateUniqueReferralCode(): Promise<string> {
    let referralCode: string;
    let exists = true;

    do {
      // Generate 8-character alphanumeric code
      referralCode = randomBytes(4).toString('hex').toUpperCase();

      const existingCode = await this.prisma.user.findUnique({
        where: { referralCode },
      });

      exists = !!existingCode;
    } while (exists);

    return referralCode;
  }
}
