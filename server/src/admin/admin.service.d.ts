import { PrismaService } from '../prisma/prisma.service';
import { PaystackService } from '../payments/providers/paystack.service';
export declare class AdminService {
    private prisma;
    private paystackService;
    constructor(prisma: PrismaService, paystackService: PaystackService);
    getStats(period: string): Promise<{
        totalUsers: number;
        totalTransactions: number;
        totalRevenue: number;
        activeWallets: number;
        userGrowth: number;
        txGrowth: number;
        revenueGrowth: number;
        walletGrowth: number;
        chartData: {
            labels: string[];
            transactions: number[];
            revenue: number[];
        };
    }>;
    getChartData(days: number): Promise<{
        labels: string[];
        transactions: number[];
        revenue: number[];
    }>;
    getUsers(search?: string): Promise<{
        id: string;
        name: string;
        email: string | null;
        kycStatus: import(".prisma/client").$Enums.KycStatus;
        walletBalance: any;
        lastActive: string;
    }[]>;
    getTransactions(period?: string): Promise<{
        id: string;
        user: any;
        type: string;
        amount: number;
        status: string;
        date: string;
    }[]>;
    getPayouts(): Promise<{
        id: string;
        user: any;
        amount: number;
        method: any;
        status: string;
        date: string;
        transactionId: string;
    }[]>;
    approvePayout(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    rejectPayout(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private formatTransactionType;
    private formatStatus;
    private getTimeAgo;
}
