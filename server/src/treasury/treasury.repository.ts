import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class TreasuryRepository {
    private readonly logger = new Logger(TreasuryRepository.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Get treasury balance for a given currency.
     * Uses the aggregate NGN nairaBalance across all treasury wallets.
     */
    async get(currency: string): Promise<TreasuryBalance> {
        const agg = await this.prisma.wallet.aggregate({
            where: { currency, isActive: true },
            _sum: { nairaBalance: true },
        });

        return {
            currency,
            availableBalance: agg._sum.nairaBalance?.toNumber() ?? 0,
        };
    }

    /**
     * Debit (reduce) the treasury balance for a given currency.
     */
    async debit(currency: string, amount: number): Promise<void> {
        // Decrement the first active treasury wallet for this currency
        const wallet = await this.prisma.wallet.findFirst({
            where: { currency, isActive: true },
        });

        if (!wallet) {
            this.logger.warn(`No active treasury wallet found for currency: ${currency}`);
            return;
        }

        await this.prisma.wallet.update({
            where: { id: wallet.id },
            data: { nairaBalance: { decrement: amount } },
        });
    }

    /**
     * Find a CryptoDeposit by its ID and map it to DepositRecord.
     */
    async findDepositById(depositId: string): Promise<DepositRecord | null> {
        const deposit = await this.prisma.cryptoDeposit.findUnique({
            where: { id: depositId },
            include: { user: true },
        });

        if (!deposit) return null;

        return {
            id: deposit.id,
            userId: deposit.userId,
            txHash: deposit.txHash,
            amountCrypto: Number(deposit.amount),
            amountNgnExpected: Number(deposit.ngnAmount),
            chain: deposit.currency, // currency field doubles as chain identifier
            userBankAccount: '', // TODO: pull from user profile / KYC data
            userBankCode: '',    // TODO: pull from user profile / KYC data
            userName: `${deposit.user.firstName ?? ''} ${deposit.user.lastName ?? ''}`.trim(),
            status: deposit.status,
        };
    }

    /**
     * Update the status of a CryptoDeposit.
     */
    async updateDepositStatus(depositId: string, status: string): Promise<void> {
        await this.prisma.cryptoDeposit.update({
            where: { id: depositId },
            data: { status },
        });
    }
}
