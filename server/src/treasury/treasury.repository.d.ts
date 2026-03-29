import { PrismaService } from '../prisma/prisma.service';
export interface TreasuryBalance {
    currency: string;
    availableBalance: number;
}
export interface DepositRecord {
    id: string;
    userId: string;
    txHash: string;
    amountCrypto: number;
    amountNgnExpected: number;
    chain: string;
    userBankAccount: string;
    userBankCode: string;
    userName: string;
    status: string;
}
export declare class TreasuryRepository {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    get(currency: string): Promise<TreasuryBalance>;
    debit(currency: string, amount: number): Promise<void>;
    findDepositById(depositId: string): Promise<DepositRecord | null>;
    updateDepositStatus(depositId: string, status: string): Promise<void>;
}
