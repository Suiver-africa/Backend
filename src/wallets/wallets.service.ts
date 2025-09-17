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
  async findByUserId(userId: string, currency: string = 'NGN') {
    const wallet = await this.prisma.wallet.findUnique({
      where: { 
        userId_currency: { 
          userId, 
          currency 
        } 
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    if (!wallet) throw new NotFoundException('Wallet not found');

    return { ...wallet, balance: Number(wallet.balance) };
  }

  async getBalance(userId: string, currency: string = 'NGN') {
    const wallet = await this.prisma.wallet.findUnique({
      where: { 
        userId_currency: { 
          userId, 
          currency 
        } 
      },
      select: { balance: true, currency: true },
    });

    if (!wallet) throw new NotFoundException('Wallet not found');

    return { balance: Number(wallet.balance), currency: wallet.currency };
  }

  // Alternative: Get all wallets for a user
  async findAllByUserId(userId: string) {
    const wallets = await this.prisma.wallet.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    if (!wallets || wallets.length === 0) {
      throw new NotFoundException('No wallets found for user');
    }

    return wallets.map(wallet => ({ ...wallet, balance: Number(wallet.balance) }));
  }

  // ─── Deposit ──────────────────────────────────
  async deposit(userId: string, dto: DepositDto) {
    // Assume currency is provided in dto, or default to NGN
    const currency = dto.currency || 'NGN';
    
    const wallet = await this.prisma.wallet.findUnique({ 
      where: { 
        userId_currency: { 
          userId, 
          currency 
        } 
      } 
    });
    
    if (!wallet) throw new NotFoundException('Wallet not found');

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { 
          userId_currency: { 
            userId, 
            currency 
          } 
        },
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
    const currency = dto.currency || 'NGN';
    
    const wallet = await this.prisma.wallet.findUnique({ 
      where: { 
        userId_currency: { 
          userId, 
          currency 
        } 
      } 
    });
    
    if (!wallet) throw new NotFoundException('Wallet not found');

    const amount = BigInt(dto.amount);
    if (wallet.balance < amount) throw new BadRequestException('Insufficient funds');

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { 
          userId_currency: { 
            userId, 
            currency 
          } 
        },
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

    const senderWallet = await this.prisma.wallet.findUnique({ 
      where: { 
        userId_currency: { 
          userId, 
          currency: dto.currency 
        } 
      } 
    });
    
    const recipientWallet = await this.prisma.wallet.findUnique({ 
      where: { 
        userId_currency: { 
          userId: dto.recipientId, 
          currency: dto.currency 
        } 
      } 
    });

    if (!senderWallet) throw new NotFoundException('Sender wallet not found');
    if (!recipientWallet) throw new NotFoundException('Recipient wallet not found');

    const amount = BigInt(dto.amount);
    if (senderWallet.balance < amount) throw new BadRequestException('Insufficient funds');

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedSender = await tx.wallet.update({
        where: { 
          userId_currency: { 
            userId, 
            currency: dto.currency 
          } 
        },
        data: { balance: { decrement: amount } },
      });

      await tx.wallet.update({
        where: { 
          userId_currency: { 
            userId: dto.recipientId, 
            currency: dto.currency 
          } 
        },
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
  async update(userId: string, currency: string, dto: UpdateDto) {
    const wallet = await this.prisma.wallet.update({
      where: { 
        userId_currency: { 
          userId, 
          currency 
        } 
      },
      data: dto,
    });

    return { ...wallet, balance: Number(wallet.balance) };
  }

  // ─── Transaction History ─────────────────────
  async getTransactionHistory(userId: string, currency?: string) {
    let walletCondition;
    
    if (currency) {
      // Get transactions for a specific currency wallet
      const wallet = await this.prisma.wallet.findUnique({ 
        where: { 
          userId_currency: { 
            userId, 
            currency 
          } 
        } 
      });
      if (!wallet) throw new NotFoundException('Wallet not found');
      
      walletCondition = {
        OR: [{ fromWalletId: wallet.id }, { toWalletId: wallet.id }],
      };
    } else {
      // Get transactions for all user's wallets
      const wallets = await this.prisma.wallet.findMany({ where: { userId } });
      if (!wallets || wallets.length === 0) {
        throw new NotFoundException('No wallets found for user');
      }
      
      const walletIds = wallets.map(w => w.id);
      walletCondition = {
        OR: [
          { fromWalletId: { in: walletIds } }, 
          { toWalletId: { in: walletIds } }
        ],
      };
    }

    const transactions = await this.prisma.transaction.findMany({
      where: walletCondition,
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

  // ─── Create Wallet for User ──────────────────
  async createWallet(userId: string, currency: string = 'NGN') {
    const existingWallet = await this.prisma.wallet.findUnique({
      where: { 
        userId_currency: { 
          userId, 
          currency 
        } 
      }
    });

    if (existingWallet) {
      throw new BadRequestException(`Wallet for ${currency} already exists`);
    }

    const wallet = await this.prisma.wallet.create({
      data: {
        userId,
        currency,
        balance: BigInt(0),
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    return { ...wallet, balance: Number(wallet.balance) };
  }
}