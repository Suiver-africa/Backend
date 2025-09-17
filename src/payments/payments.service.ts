import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  // buy airtime - deduct NGN balance and create transaction
  async buyAirtime(userId: string, phone: string, amount: number) {
    const wallet = await this.prisma.wallet.findFirst({ where: { userId, currency: 'NGN' } });
    if (!wallet) throw new NotFoundException('NGN wallet not found');
    const parsed = BigInt(Math.floor(amount));
    if (wallet.balance < parsed) throw new BadRequestException('Insufficient balance');

    const newBal = wallet.balance - parsed;
    await this.prisma.$transaction([
      this.prisma.wallet.update({ where: { id: wallet.id }, data: { balance: newBal } }),
      this.prisma.transaction.create({
        data: {
          userId,
          type: 'WITHDRAW',
          amount: parsed,
          description: `Airtime purchase to ${phone}`,
          currency: 'NGN',
          status: 'SUCCESS',
          fromWalletId: wallet.id,
          toWalletId: wallet.id,
        },
      }),
    ]);

    // In production: integrate with airtime provider API here and handle failures
    return { success: true };
  }
}