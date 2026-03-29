import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { DepositWatcher, DepositEvent } from './deposit-watcher.interface';
import { ConfigService } from '@nestjs/config';

/**
 * MoralisWatcherService
 * - Polls Moralis REST endpoints for address transactions (simple demo).
 * - Recommended: use Moralis Webhooks (faster & reliable). This service can be used when you only have API key.
 */
@Injectable()
export class MoralisWatcherService implements DepositWatcher {
  private logger = new Logger(MoralisWatcherService.name);
  private cb: (evt: DepositEvent) => Promise<void> = async () => {};
  private interval: NodeJS.Timeout | null = null;
  private lastSeen: Record<string, number> = {};
  private apiKey: string;

  constructor(private config: ConfigService) {
    this.apiKey =
      this.config.get<string>('MORALIS_API_KEY') ||
      process.env.MORALIS_API_KEY ||
      '';
    if (!this.apiKey)
      this.logger.warn(
        'Moralis API key not configured; MoralisWatcher disabled',
      );
  }

  onDeposit(cb: (evt: DepositEvent) => Promise<void>) {
    this.cb = cb;
  }

  async start() {
    if (!this.apiKey) return;
    this.logger.log('Starting Moralis watcher (polling every 20s)');
    this.interval = setInterval(() => void this.poll(), 20000);
  }

  async stop() {
    if (this.interval) clearInterval(this.interval);
    this.logger.log('Stopped Moralis watcher');
  }

  async poll() {
    try {
      // For demo: scan addresses listed in env or DB; here we use SIMULATED list from env for simplicity
      const watched = (process.env.WATCH_ADDRESSES || '')
        .split(',')
        .filter(Boolean);
      for (const address of watched) {
        const url = `https://deep-index.moralis.io/api/v2/${address}/erc20/transfers`;
        const res = await axios.get(url, {
          headers: { 'X-API-Key': this.apiKey },
        });
        const items = Array.isArray(res.data)
          ? res.data
          : res.data.result || [];
        for (const it of items) {
          // simple uniqueness via token_hash + transaction_hash
          const tx = it.transaction_hash || it.transactionHash || it.hash;
          const amount = it.value || it.amount || it.value;
          const symbol = it.symbol || it.token_symbol || 'UNKNOWN';
          const chain = it.chain || 'ETH';
          const evt = {
            address,
            txHash: tx,
            amount: String(amount || '0'),
            symbol,
            confirmations: 1,
            chain,
          };
          await this.cb(evt);
        }
      }
    } catch (err) {
      this.logger.warn('Moralis poll error: ' + (err?.message || err));
    }
  }
}
