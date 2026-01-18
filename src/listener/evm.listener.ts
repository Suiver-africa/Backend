import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionsService } from '../transactions/transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import Web3 from 'web3';
// import { ethers } from 'ethers'; // Alternative if Web3 causes issues, but sticking to Web3 as per existing deps

@Injectable()
export class EvmListener {
    private readonly logger = new Logger(EvmListener.name);
    private web3: Web3;
    private isRunning = false;
    private readonly pollInterval = 10000; // 10 seconds

    constructor(
        private readonly configService: ConfigService,
        private readonly transactionsService: TransactionsService,
        private readonly prisma: PrismaService,
    ) {
        const rpcUrl = this.configService.get('ETH_RPC_URL');
        this.web3 = new Web3(rpcUrl);
    }

    async start(chain: string) {
        if (this.isRunning) return;

        const rpcUrl = this.configService.get('ETH_RPC_URL');
        if (!rpcUrl || rpcUrl.includes('your-api-key')) {
            this.logger.warn(`Skipping EVM Listener for ${chain}: ETH_RPC_URL is not configured or still has placeholder.`);
            return;
        }

        this.isRunning = true;
        this.logger.log(`Starting EVM Listener for ${chain}...`);

        // In a real implementation we would:
        // 1. Get all "watched" addresses from DB (CryptoAddress model)
        // 2. Poll block by block or use WebSocket subscription
        // 3. Filter for transactions TO our addresses

        // For MVP/Simulation:
        this.pollBlocks();
    }

    private async pollBlocks() {
        let lastProcessedBlock = await this.web3.eth.getBlockNumber();

        setInterval(async () => {
            try {
                const currentBlock = await this.web3.eth.getBlockNumber();
                if (currentBlock > lastProcessedBlock) {
                    for (let blockNum = lastProcessedBlock + BigInt(1); blockNum <= currentBlock; blockNum++) {
                        const block = await this.web3.eth.getBlock(blockNum, true);
                        if (block && block.transactions) {
                            await this.processTransactions(block.transactions as any[]);
                        }
                    }
                    lastProcessedBlock = currentBlock;
                }
            } catch (e) {
                this.logger.error('Error polling blocks', e);
            }
        }, this.pollInterval);
    }

    private async processTransactions(transactions: any[]) {
        // 1. Get all watched addresses from DB
        const wallets = await this.prisma.wallet.findMany({
            where: { isActive: true, currency: { not: 'NGN' } },
            select: { address: true, currency: true }
        });

        const watchedAddresses = new Set(
            wallets
                .filter(w => w.address !== null)
                .map(w => w.address!.toLowerCase())
        );

        for (const tx of transactions) {
            if (tx.to && watchedAddresses.has(tx.to.toLowerCase())) {
                const wallet = wallets.find(w => w.address && w.address.toLowerCase() === tx.to.toLowerCase());

                if (!wallet) {
                    this.logger.warn(`Wallet not found for address ${tx.to} despite being in watched list`);
                    continue;
                }
                const amount = Number(this.web3.utils.fromWei(tx.value, 'ether')); // Adjust based on token decimal if not ETH

                this.logger.log(`Detected incoming transaction: ${tx.hash} for ${tx.to}`);

                await this.transactionsService.processDeposit(
                    tx.to,
                    amount,
                    wallet.currency,
                    tx.hash,
                    tx.from
                );
            }
        }
    }

    // Exposed for Manual Testing / Simulation
    async simulateDeposit(txHash: string, amount: number, token: string, from: string, to: string) {
        this.logger.log(`Simulating Deposit: ${txHash} ${amount} ${token}`);
        try {
            // Call TransactionService to process
            await this.transactionsService.processDeposit(to, amount, token, txHash, from);
        } catch (e) {
            this.logger.error(`Failed to process simulated deposit: ${e.message}`, e.stack);
        }
    }
}
