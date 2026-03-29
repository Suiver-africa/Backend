import { PrismaService } from '../prisma/prisma.service';
export interface LedgerEntryDto {
    depositId: string;
    debitAccount: string;
    creditAccount: string;
    amount: number;
    metadata?: Record<string, any>;
}
export declare class LedgerService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    record(entry: LedgerEntryDto): Promise<void>;
}
