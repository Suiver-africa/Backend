import { Injectable, Logger } from '@nestjs/common';
import { DepositWatcher, DepositEvent } from './deposit-watcher.interface';

/**
 * MockDepositWatcher
 * - Demonstrates how a watcher integrates with the rest of the app.
 * - In production replace with real RPC/indexer websocket or webhook handler.
 */
@Injectable()
export class MockDepositWatcherService implements DepositWatcher {
  private logger = new Logger(MockDepositWatcherService.name);
  private cb: (evt: DepositEvent) => Promise<void> = async () => {};
  private intervalRef: NodeJS.Timeout | null = null;

  onDeposit(cb: (evt: DepositEvent) => Promise<void>) {
    this.cb = cb;
  }

  async start() {
    this.logger.log('Starting mock deposit watcher (polling simulation)');
    // simulate periodic fake deposit events (disabled by default)
    this.intervalRef = setInterval(async () => {
      // NO-OP by default. Developers can enable simulation with env var if they want.
      const simulate = process.env.SIMULATE_DEPOSITS === 'true';
      if (!simulate) return;
      const fake: DepositEvent = {
        address: 'mock_address_1',
        txHash: '0xdeadbeef' + Math.floor(Math.random()*10000).toString(),
        amount: '100000000', // e.g. satoshi/wei
        symbol: 'USDT',
        confirmations: 1,
        chain: 'ETH'
      };
      this.logger.log('Simulating deposit: ' + JSON.stringify(fake));
      await this.cb(fake);
    }, 15000);
  }

  async stop() {
    if (this.intervalRef) clearInterval(this.intervalRef);
    this.logger.log('Stopped mock deposit watcher');
  }
}
