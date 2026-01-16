import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionsService } from '../transactions/transactions.service';
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
    ) {
        // Initialize with a default provider, will be overridden in start()
        this.web3 = new Web3(this.configService.get('ETH_RPC_URL') || 'https://eth-sepolia.g.alchemy.com/v2/WHiSvVgg27GtWI0jWvAzk');
    }

    async start(chain: string) {
        if (this.isRunning) return;
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
        // Mock simulation loop for MVP
        // effectively "listening"
        setInterval(async () => {
            try {
                // Logic to fetch latest block and process txs
                // const block = await this.web3.eth.getBlock('latest', true);
                // this.processBlock(block);
            } catch (e) {
                this.logger.error('Error polling blocks', e);
            }
        }, this.pollInterval);
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
