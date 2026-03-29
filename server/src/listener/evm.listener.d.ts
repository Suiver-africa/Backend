import { ConfigService } from '@nestjs/config';
import { TransactionsService } from '../transactions/transactions.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class EvmListener {
    private readonly configService;
    private readonly transactionsService;
    private readonly prisma;
    private readonly logger;
    private web3;
    private isRunning;
    private readonly pollInterval;
    constructor(configService: ConfigService, transactionsService: TransactionsService, prisma: PrismaService);
    start(chain: string): Promise<void>;
    private pollBlocks;
    private processTransactions;
    simulateDeposit(txHash: string, amount: number, token: string, from: string, to: string): Promise<void>;
}
