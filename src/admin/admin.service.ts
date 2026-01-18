// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionStatus, TransactionType } from '@prisma/client';
import { PaystackService } from '../payments/providers/paystack.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private paystackService: PaystackService
  ) { }

  // Dashboard Stats
  async getStats(period: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case '7days':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30days':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90days':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - (now.getDate() - startDate.getDate()));

    // Total Users
    const totalUsers = await this.prisma.user.count();
    const previousUsers = await this.prisma.user.count({
      where: { createdAt: { lt: startDate } }
    });
    const userGrowth = previousUsers > 0 
      ? (((totalUsers - previousUsers) / previousUsers) * 100).toFixed(1)
      : 0;

    // Total Transactions
    const totalTransactions = await this.prisma.transaction.count({
      where: { createdAt: { gte: startDate } }
    });
    const previousTransactions = await this.prisma.transaction.count({
      where: { 
        createdAt: { 
          gte: previousPeriodStart,
          lt: startDate 
        } 
      }
    });
    const txGrowth = previousTransactions > 0
      ? (((totalTransactions - previousTransactions) / previousTransactions) * 100).toFixed(1)
      : 0;

    // Total Revenue (sum of nairaAmount)
    const revenueData = await this.prisma.transaction.aggregate({
      where: {
        createdAt: { gte: startDate },
        status: TransactionStatus.COMPLETED
      },
      _sum: { nairaAmount: true }
    });
    const totalRevenue = Number(revenueData._sum.nairaAmount || 0);

    const previousRevenueData = await this.prisma.transaction.aggregate({
      where: {
        createdAt: { 
          gte: previousPeriodStart,
          lt: startDate 
        },
        status: TransactionStatus.COMPLETED
      },
      _sum: { nairaAmount: true }
    });
    const previousRevenue = Number(previousRevenueData._sum.nairaAmount || 0);
    const revenueGrowth = previousRevenue > 0
      ? (((totalRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)
      : 0;

    // Active Wallets
    const activeWallets = await this.prisma.wallet.count({
      where: { isActive: true }
    });

    // Chart Data (last 7 days)
    const chartData = await this.getChartData(7);

    return {
      totalUsers,
      totalTransactions,
      totalRevenue,
      activeWallets,
      userGrowth: Number(userGrowth),
      txGrowth: Number(txGrowth),
      revenueGrowth: Number(revenueGrowth),
      walletGrowth: 6.1, // You can calculate this similarly
      chartData
    };
  }

  // Chart Data
 async getChartData(days: number) {
  const labels: string[] = [];
  const transactions: number[] = [];
  const revenue: number[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    // Day label
    const dayLabel: string = startOfDay.toLocaleDateString('en-US', { weekday: 'short' });
    labels.push(dayLabel);

    // Count transactions
    const txCount: number = await this.prisma.transaction.count({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay }
      }
    });
    transactions.push(txCount);

    // Sum revenue
    const revenueData = await this.prisma.transaction.aggregate({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
        status: TransactionStatus.COMPLETED
      },
      _sum: { nairaAmount: true }
    });

    const revenueSum: number = Number(revenueData._sum.nairaAmount ?? 0);
    revenue.push(revenueSum);
  }

  return { labels, transactions, revenue };
}


  // Get Users with Search
  async getUsers(search?: string) {
    const users = await this.prisma.user.findMany({
      where: search ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { tag: { contains: search, mode: 'insensitive' } }
        ]
      } : {},
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        tag: true,
        kycStatus: true,
        createdAt: true,
        updatedAt: true,
        wallets: {
          where: { isActive: true },
          select: { nairaBalance: true }
        }
      },
      take: 100,
      orderBy: { createdAt: 'desc' }
    });

    return users.map(user => ({
      id: user.id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
      email: user.email,
      kycStatus: user.kycStatus || 'NOT_SUBMITTED',
      walletBalance: user.wallets.reduce((sum, w) => sum + Number(w.nairaBalance), 0),
      lastActive: this.getTimeAgo(user.updatedAt)
    }));
  }

  // Get Transactions
  async getTransactions(period?: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case '7days':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30days':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const transactions = await this.prisma.transaction.findMany({
      where: { createdAt: { gte: startDate } },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return transactions.map(tx => ({
      id: `TX${tx.id.toString().padStart(6, '0')}`,
      user: `${tx.user.firstName || ''} ${tx.user.lastName || ''}`.trim() || tx.user.email,
      type: this.formatTransactionType(tx.type),
      amount: Number(tx.nairaAmount),
      status: this.formatStatus(tx.status),
      date: tx.createdAt.toLocaleString('en-US', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
  }

  // Get Payouts (Withdrawals)
  async getPayouts() {
    const payouts = await this.prisma.transaction.findMany({
      where: { 
        type: TransactionType.WITHDRAW,
        status: { in: [TransactionStatus.PENDING, TransactionStatus.PROCESSING] }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return payouts.map(payout => ({
      id: `PO${payout.id.toString().padStart(6, '0')}`,
      user: `${payout.user.firstName || ''} ${payout.user.lastName || ''}`.trim() || payout.user.email,
      amount: Number(payout.nairaAmount),
      method: payout.metadata?.['method'] || 'Bank Transfer',
      status: this.formatStatus(payout.status),
      date: payout.createdAt.toLocaleString('en-US', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      transactionId: payout.id
    }));
  }

  // Approve Payout
  async approvePayout(id: string) {
    const payoutId = parseInt(id.replace('PO', ''));
    
    // 1. Fetch transaction details
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: payoutId },
      include: { user: true }
    });

    if (!transaction) throw new Error('Transaction not found');
    if (transaction.status !== TransactionStatus.PENDING && transaction.status !== TransactionStatus.PROCESSING) {
      throw new Error('Payout already processed or cancelled');
    }

    // 2. Trigger Real Paystack Payout
    const metadata = (transaction.metadata as any) || {};
    const payoutResult = await this.paystackService.triggerPayout({
      account_number: metadata.accountNumber,
      bank_code: metadata.bankCode,
      amount: Number(transaction.nairaAmount) * 100, // Paystack uses kobo
      account_name: metadata.accountName || `${transaction.user.firstName || ''} ${transaction.user.lastName || ''}`.trim(),
      reference: `PO-${transaction.id}-${Date.now()}`
    });

    if (!payoutResult.status) {
      throw new Error(`Paystack payout failed: ${payoutResult.message}`);
    }

    // 3. Update transaction status
    await this.prisma.transaction.update({
      where: { id: payoutId },
      data: { 
        status: TransactionStatus.COMPLETED,
        hash: payoutResult.data.reference,
        updatedAt: new Date()
      }
    });

    return { success: true, message: 'Payout approved and triggered via Paystack' };
  }

  // Reject Payout
  async rejectPayout(id: string) {
    const payoutId = parseInt(id.replace('PO', ''));
    
    await this.prisma.transaction.update({
      where: { id: payoutId },
      data: { 
        status: TransactionStatus.FAILED,
        updatedAt: new Date()
      }
    });

    return { success: true, message: 'Payout rejected' };
  }

  // Helper Functions
  private formatTransactionType(type: TransactionType): string {
    const typeMap = {
      DEPOSIT: 'Deposit',
      CRYPTO_TO_NAIRA: 'Swap',
      NAIRA_TO_CRYPTO: 'Swap',
      WITHDRAW: 'Withdrawal',
      TRANSFER: 'Transfer',
      RECEIVE: 'Receive',
      BILL_PAYMENT: 'Bill Payment',
      REQUEST: 'Request',
      PAYMENT_LINK: 'Payment Link'
    };
    return typeMap[type] || type;
  }

  private formatStatus(status: TransactionStatus): string {
    const statusMap = {
      PENDING: 'Pending',
      PROCESSING: 'Processing',
      COMPLETED: 'Completed',
      FAILED: 'Failed',
      CANCELLED: 'Cancelled'
    };
    return statusMap[status] || status;
  }

  private getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  }
}