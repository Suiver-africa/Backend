import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface LedgerEntryDto {
    depositId: string;
    debitAccount: string;
    creditAccount: string;
    amount: number;
    metadata?: Record<string, any>;
}

@Injectable()
export class LedgerService {
    private readonly logger = new Logger(LedgerService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Record a double-entry ledger movement.
     * Persisted as a Transaction row for auditability.
     */
    async record(entry: LedgerEntryDto): Promise<void> {
        this.logger.log(
            `Ledger: debit ${entry.debitAccount} → credit ${entry.creditAccount} | amount ${entry.amount} | deposit ${entry.depositId}`,
        );

        await this.prisma.transaction.create({
            data: {
                userId: entry.creditAccount.startsWith('USER_')
                    ? entry.creditAccount.replace('USER_', '')
                    : entry.depositId,
                type: 'CRYPTO_TO_NAIRA',
                amount: BigInt(Math.round(entry.amount * 100)),
                currency: 'NGN',
                nairaAmount: entry.amount,
                status: 'COMPLETED',
                description: `Ledger: ${entry.debitAccount} → ${entry.creditAccount}`,
                metadata: {
                    depositId: entry.depositId,
                    debitAccount: entry.debitAccount,
                    creditAccount: entry.creditAccount,
                    ...entry.metadata,
                },
            },
        });
    }
}
