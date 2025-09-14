import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DepositDto, WithdrawDto, SendDto, UpdateDto } from '../user/dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  // ─── Get Wallet ────────────────────────────────
  async findByUserId(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    if (!wallet) throw new NotFoundException('Wallet not found');

    return { ...wallet, balance: Number(wallet.balance) };
  }

  async getBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: { balance: true, currency: true },
    });

    if (!wallet) throw new NotFoundException('Wallet not found');

    return { balance: Number(wallet.balance), currency: wallet.currency };
  }

  // ─── Deposit ──────────────────────────────────
  async deposit(userId: string, dto: DepositDto) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: { balance: { increment: BigInt(dto.amount) } },
      });

      await tx.transaction.create({
        data: {
          userId,
          fromWalletId: wallet.id,
          toWalletId: wallet.id,
          type: 'DEPOSIT',
          amount: BigInt(dto.amount),
          currency: wallet.currency,
          description: dto.description || 'Wallet deposit',
          status: 'COMPLETED',
        },
      });

      return updatedWallet;
    });

    return { ...result, balance: Number(result.balance) };
  }

  // ─── Withdraw ────────────────────────────────
  async withdraw(userId: string, dto: WithdrawDto) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const amount = BigInt(dto.amount);
    if (wallet.balance < amount) throw new BadRequestException('Insufficient funds');

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: { balance: { decrement: amount } },
      });

      await tx.transaction.create({
        data: {
          userId,
          fromWalletId: wallet.id,
          toWalletId: wallet.id,
          type: 'WITHDRAW',
          amount,
          currency: dto.currency || wallet.currency,
          description: dto.destinationAccount || 'Wallet withdrawal',
          status: 'COMPLETED',
        },
      });

      return updatedWallet;
    });

    return { ...result, balance: Number(result.balance) };
  }

  // ─── Send Money (P2P) ────────────────────────
  async send(userId: string, dto: SendDto) {
    if (userId === dto.recipientId) {
      throw new BadRequestException('Cannot send money to yourself');
    }

    const senderWallet = await this.prisma.wallet.findUnique({ where: { userId } });
    const recipientWallet = await this.prisma.wallet.findUnique({ where: { userId: dto.recipientId } });

    if (!senderWallet) throw new NotFoundException('Sender wallet not found');
    if (!recipientWallet) throw new NotFoundException('Recipient wallet not found');

    const amount = BigInt(dto.amount);
    if (senderWallet.balance < amount) throw new BadRequestException('Insufficient funds');

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedSender = await tx.wallet.update({
        where: { userId },
        data: { balance: { decrement: amount } },
      });

      await tx.wallet.update({
        where: { userId: dto.recipientId },
        data: { balance: { increment: amount } },
      });

      await tx.transaction.create({
        data: {
          userId,
          fromWalletId: senderWallet.id,
          toWalletId: recipientWallet.id,
          type: 'SEND',
          amount,
          currency: dto.currency,
          description: `Transfer to ${dto.recipientId}`,
          status: 'COMPLETED',
        },
      });

      return updatedSender;
    });

    return { ...result, balance: Number(result.balance) };
  }

  // ─── Update Wallet ───────────────────────────
  async update(userId: string, dto: UpdateDto) {
    const wallet = await this.prisma.wallet.update({
      where: { userId },
      data: dto,
    });

    return { ...wallet, balance: Number(wallet.balance) };
  }

  // ─── Transaction History ─────────────────────
  async getTransactionHistory(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const transactions = await this.prisma.transaction.findMany({
      where: {
        OR: [{ fromWalletId: wallet.id }, { toWalletId: wallet.id }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        fromWallet: {
          include: { user: { select: { firstName: true, lastName: true, tag: true } } },
        },
        toWallet: {
          include: { user: { select: { firstName: true, lastName: true, tag: true } } },
        },
      },
    });

    return transactions.map((tx) => ({ ...tx, amount: Number(tx.amount) }));
  }
}
