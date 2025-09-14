import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

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
    const recipient = await this.prisma.user.findUnique({ where: { tag: recipientTag } });
    if (!recipient) throw new NotFoundException('Recipient not found');
    const recipientWallet = await this.prisma.wallet.findUnique({ where: { userId: recipient.id } });
    if (!recipientWallet) throw new NotFoundException('Recipient wallet not found');

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
          status: 'PENDING',
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
          status: 'PENDING',
          fromWalletId: senderWallet.id,
          toWalletId: recipientWallet.id,
        },
      }),
    ]);

    return { success: true };
  }

  async withdraw(userId: string, amount: number, destinationAccount: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.balance < BigInt(Math.floor(amount))) throw new BadRequestException('Insufficient balance');

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: wallet.balance - BigInt(Math.floor(amount)) },
    });

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