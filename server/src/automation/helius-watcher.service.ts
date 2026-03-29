import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { DepositWatcher, DepositEvent } from './deposit-watcher.interface';
import { ConfigService } from '@nestjs/config';

/**
 * HeliusWatcherService (Solana)
 * - Simple polling approach for demo; in production use Helius websockets or webhook notifications.
 */
@Injectable()
export class HeliusWatcherService implements DepositWatcher {
  private logger = new Logger(HeliusWatcherService.name);
  private cb: (evt: DepositEvent) => Promise<void> = async () => {};
  private interval: NodeJS.Timeout | null = null;
  private apiKey: string;
  constructor(private config: ConfigService) {
    this.apiKey =
      this.config.get<string>('HELIUS_API_KEY') ||
      process.env.HELIUS_API_KEY ||
      '';
    if (!this.apiKey)
      this.logger.warn('Helius API key not configured; HeliusWatcher disabled');
  }
  onDeposit(cb: (evt: DepositEvent) => Promise<void>) {
    this.cb = cb;
  }
  async start() {
    if (!this.apiKey) return;
    this.logger.log('Starting Helius watcher (polling every 20s)');
    this.interval = setInterval(() => void this.poll(), 20000);
  }
  async stop() {
    if (this.interval) clearInterval(this.interval);
    this.logger.log('Stopped Helius watcher');
  }

  async poll() {
    try {
      const watched = (process.env.WATCH_ADDRESSES || '')
        .split(',')
        .filter(Boolean);
      for (const address of watched) {
        const url = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${this.apiKey}`;
        const res = await axios.get(url);
        const items = res.data || [];
        for (const tx of items) {
          const txHash = tx || tx.signature || tx.txHash || tx.transactionHash;
          const evt: DepositEvent = {
            address,
            txHash: String(txHash),
            amount: '0',
            symbol: 'SOL',
            confirmations: 1,
            chain: 'SOL',
          };
          await this.cb(evt);
        }
      }
    } catch (err) {
      this.logger.warn('Helius poll error: ' + (err?.message || err));
    }
  }
}
