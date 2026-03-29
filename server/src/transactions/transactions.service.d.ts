import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
export declare class TransactionsService {
    private prisma;
    private cryptoService;
    constructor(prisma: PrismaService, cryptoService: CryptoService);
    private getWallet;
    private getDailyOutgoingNgN;
    private userDailyLimit;
    deposit(userId: string, amount: number, currency?: string): Promise<{
        id: string;
        userId: string;
        address: string;
        chain: import(".prisma/client").$Enums.Chain;
        asset: string;
        tatumAccountId: string | null;
        tatumSubId: string | null;
        autoConvert: boolean;
        autoConvertTo: import(".prisma/client").$Enums.AutoConvertTarget | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    send(userId: string, recipientTag: string, amount: number, currency?: string): Promise<{
        success: boolean;
    }>;
    withdraw(userId: string, amount: number, accountNumber: string, bankCode: string, accountName: string, currency?: string): Promise<{
        success: boolean;
    }>;
    processDeposit(toAddress: string, amount: number, currency: string, txHash: string, fromAddress: string): Promise<true | undefined>;
}
