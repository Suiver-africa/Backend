import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  // deposit: read-modify-write using a transaction for atomicity
  async deposit(userId: string, amount: number) {
    const parsed = BigInt(Math.floor(amount));
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

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
          status: 'PENDING',
          fromWalletId: wallet.id,
          toWalletId: wallet.id,
        },
      }),
    ]);

    return updated;
  }

  async send(userId: string, recipientTag: string, amount: number) {
    const parsed = BigInt(Math.floor(amount));
    const senderWallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!senderWallet) throw new NotFoundException('Sender wallet not found');
    if (senderWallet.balance < parsed) throw new BadRequestException('Insufficient balance');
    const recipient = await this.prisma.user.findUnique({ where: { tag: recipientTag } });
    if (!recipient) throw new NotFoundException('Recipient not found');
    const recipientWallet = await this.prisma.wallet.findUnique({ where: { userId: recipient.id } });
    if (!recipientWallet) throw new NotFoundException('Recipient wallet not found');

    const senderNew = senderWallet.balance - parsed;
    const recipientNew = recipientWallet.balance + parsed;

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: senderNew },
      }),
      this.prisma.wallet.update({
        where: { id: recipientWallet.id },
        data: { balance: recipientNew },
      }),
      this.prisma.transaction.create({
        data: {
          userId,
          type: 'SEND',
          amount: parsed,
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
          amount: parsed,
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
    const parsed = BigInt(Math.floor(amount));
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.balance < parsed) throw new BadRequestException('Insufficient balance');

    const newBal = wallet.balance - parsed;

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: newBal },
      }),
      this.prisma.transaction.create({
        data: {
          userId,
          type: 'WITHDRAW',
          amount: parsed,
          description: `Withdraw to ${destinationAccount}`,
          currency: wallet.currency,
          status: 'PENDING',
          fromWalletId: wallet.id,
          toWalletId: wallet.id,
        },
      }),
    ]);

    return { success: true };
  }
}
