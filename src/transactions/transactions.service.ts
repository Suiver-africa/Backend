
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

<<<<<<< Updated upstream
  async deposit(userId: string, amount: number) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    const updated = await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: wallet.balance + BigInt(Math.floor(amount)) },
    });
    await this.prisma.transaction.create({
      data: {
        userId,
        type: 'DEPOSIT',
        amount: BigInt(Math.floor(amount)),
        description: 'Deposit',
        currency: updated.currency,
        status: 'PENDING',
        fromWalletId: updated.id,
        toWalletId: updated.id,
      },
    });
    return updated;
  }

  async send(userId: string, recipientTag: string, amount: number) {
    const senderWallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!senderWallet) throw new NotFoundException('Sender wallet not found');
    if (senderWallet.balance < BigInt(Math.floor(amount))) throw new BadRequestException('Insufficient balance');
=======
  private async getWallet(userId: string, currency = 'NGN') {
    const wallet = await this.prisma.wallet.findFirst({ where: { userId, currency } });
    if (!wallet) throw new NotFoundException('Wallet not found for currency ' + currency);
    return wallet;
  }

  private async getDailyOutgoingNgN(userId: string) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const txs = await this.prisma.transaction.findMany({
      where: {
        userId,
        currency: 'NGN',
        type: { in: ['SEND', 'WITHDRAW'] },
        createdAt: { gte: since },
      },
      select: { amount: true },
    });
    let sum = BigInt(0);
    for (const t of txs) sum += BigInt(t.amount as any);
    return sum;
  }

  private async userDailyLimit(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.kycStatus === 'APPROVED') return BigInt(40000000); // 40,000,000 NGN
    return BigInt(100000); // 100,000 NGN for non-KYC
  }

  async deposit(userId: string, amount: number, currency = 'NGN') {
    const parsed = BigInt(Math.floor(amount));
    // Credit user's wallet for the 'currency' (typically NGN)
    const wallet = await this.getWallet(userId, currency);
    const newBalance = wallet.balance + parsed;

    const [updated] = await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: newBalance },
      }),
      this.prisma.transaction.create({
        data: {
          userId,
          type: 'DEPOSIT',
          amount: parsed,
          description: 'Deposit',
          currency: wallet.currency,
          status: 'SUCCESS',
          fromWalletId: wallet.id,
          toWalletId: wallet.id,
        },
      }),
    ]);

    return updated;
  }

  async send(userId: string, recipientTag: string, amount: number, currency = 'NGN') {
    const parsed = BigInt(Math.floor(amount));
    const senderWallet = await this.getWallet(userId, currency);
    if (senderWallet.balance < parsed) throw new BadRequestException('Insufficient balance');

    // Enforce daily limit for NGN flows
    if (currency === 'NGN') {
      const limit = await this.userDailyLimit(userId);
      const used = await this.getDailyOutgoingNgN(userId);
      if (used + parsed > limit) throw new BadRequestException('Daily limit exceeded');
    }

>>>>>>> Stashed changes
    const recipient = await this.prisma.user.findUnique({ where: { tag: recipientTag } });
    if (!recipient) throw new NotFoundException('Recipient not found');
    const recipientWallet = await this.getWallet(recipient.id, currency);

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: senderWallet.balance - BigInt(Math.floor(amount)) },
      }),
      this.prisma.wallet.update({
        where: { id: recipientWallet.id },
        data: { balance: recipientWallet.balance + BigInt(Math.floor(amount)) },
      }),
      this.prisma.transaction.create({
        data: {
          userId,
          type: 'SEND',
          amount: BigInt(Math.floor(amount)),
          description: `Sent to ${recipient.tag}`,
          currency: senderWallet.currency,
          status: 'SUCCESS',
          fromWalletId: senderWallet.id,
          toWalletId: recipientWallet.id,
        },
      }),
      this.prisma.transaction.create({
        data: {
          userId: recipient.id,
          type: 'RECEIVE',
          amount: BigInt(Math.floor(amount)),
          description: `Received from ${userId}`,
          currency: recipientWallet.currency,
          status: 'SUCCESS',
          fromWalletId: senderWallet.id,
          toWalletId: recipientWallet.id,
        },
      }),
    ]);

    return { success: true };
  }

<<<<<<< Updated upstream
  async withdraw(userId: string, amount: number, destinationAccount: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.balance < BigInt(Math.floor(amount))) throw new BadRequestException('Insufficient balance');

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: wallet.balance - BigInt(Math.floor(amount)) },
    });
=======
  async withdraw(userId: string, amount: number, destinationAccount: string, currency = 'NGN') {
    const parsed = BigInt(Math.floor(amount));
    const wallet = await this.getWallet(userId, currency);
    if (wallet.balance < parsed) throw new BadRequestException('Insufficient balance');

    // Enforce daily limit for NGN flows
    if (currency === 'NGN') {
      const limit = await this.userDailyLimit(userId);
      const used = await this.getDailyOutgoingNgN(userId);
      if (used + parsed > limit) throw new BadRequestException('Daily limit exceeded');
    }

    const newBal = wallet.balance - parsed;
>>>>>>> Stashed changes

    await this.prisma.transaction.create({
      data: {
        userId,
        type: 'WITHDRAW',
        amount: BigInt(Math.floor(amount)),
        description: `Withdraw to ${destinationAccount}`,
        currency: wallet.currency,
        status: 'PENDING',
        fromWalletId: wallet.id,
        toWalletId: wallet.id,
      },
    });

    return { success: true };
  }
}