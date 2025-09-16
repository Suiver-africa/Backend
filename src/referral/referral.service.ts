import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReferralService {
  constructor(private prisma: PrismaService) {}

  async createForInviter(inviterId: string) {
    const code = `REF-${uuidv4().slice(0,8)}`;
    return this.prisma.referral.create({
      data: { inviterId, code },
    });
  }

  async useCode(inviteeId: string, code: string) {
    const referral = await this.prisma.referral.findUnique({ where: { code } });
    if (!referral) throw new NotFoundException('Invalid referral code');
    if (referral.inviteeId) throw new BadRequestException('Code already used');

    // mark invitee and reward inviter (example: reward = 10% of first deposit - placeholder: give fixed)
    const updated = await this.prisma.referral.update({
      where: { id: referral.id },
      data: { inviteeId, reward: referral.reward + BigInt(0) },
    });

    return updated;
  }

  async listByInviter(inviterId: string) {
    return this.prisma.referral.findMany({ where: { inviterId } });
  }
}
