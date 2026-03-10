import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { DepositWatcher, DepositEvent } from './deposit-watcher.interface';
import { ConfigService } from '@nestjs/config';

/**
 * BlockstreamWatcherService (Bitcoin)
 * - Polls Blockstream API for address txs. In production consider webhooks or running your own node.
 */
@Injectable()
export class BlockstreamWatcherService implements DepositWatcher {
  private logger = new Logger(BlockstreamWatcherService.name);
  private cb: (evt: DepositEvent) => Promise<void> = async () => {};
  private interval: NodeJS.Timeout | null = null;
  private base: string;
  constructor(private config: ConfigService) {
    this.base = this.config.get<string>('BLOCKSTREAM_API') || process.env.BLOCKSTREAM_API || 'https://blockstream.info/api';
    this.logger.log('Blockstream base: ' + this.base);
  }
  onDeposit(cb: (evt: DepositEvent) => Promise<void>) { this.cb = cb; }
  async start() {
    this.logger.log('Starting Blockstream watcher (polling every 30s)');
    this.interval = setInterval(() => this.poll(), 30000);
  }
  async stop() { if (this.interval) clearInterval(this.interval); this.logger.log('Stopped Blockstream watcher'); }

  async poll() {
    try {
      const watched = (process.env.WATCH_ADDRESSES || '').split(',').filter(Boolean);
      for (const address of watched) {
        const url = `${this.base}/address/${address}/txs`;
        const res = await axios.get(url);
        const txs = res.data || [];
        for (const tx of txs) {
          const txHash = tx.txid || tx.hash;
          const evt: DepositEvent = { address, txHash: String(txHash), amount: '0', symbol: 'BTC', confirmations: tx.status?.confirmations || 0, chain: 'BTC' };
          await this.cb(evt);
        }
      }
    } catch (err) {
      this.logger.warn('Blockstream poll error: ' + (err?.message || err));
    }
  }
}
