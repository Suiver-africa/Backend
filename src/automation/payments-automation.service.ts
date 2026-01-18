import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DepositWatcher, DepositEvent } from './deposit-watcher.interface';
import { MockDepositWatcherService } from './mock-deposit-watcher.service';
import { MoralisWatcherService } from './moralis-watcher.service';
import { HeliusWatcherService } from './helius-watcher.service';
import { BlockstreamWatcherService } from './blockstream-watcher.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PaystackProvider } from '../payments/providers/paystack.provider';
import { FlutterwaveProvider } from '../payments/providers/flutterwave.provider';
import { CustodialWalletsService } from './custodial-wallets.service';

@Injectable()
export class PaymentsAutomationService implements OnModuleInit {
  private logger = new Logger(PaymentsAutomationService.name);
  private watcher: DepositWatcher;
  private paystack: PaystackProvider | null = null;
  private flutterwave: FlutterwaveProvider | null = null;

  constructor(
    private mock: MockDepositWatcherService,
    private moralis: MoralisWatcherService,
    private helius: HeliusWatcherService,
    private blockstream: BlockstreamWatcherService,
    private prisma: PrismaService,
    private config: ConfigService,
    private custodial: CustodialWalletsService,
    private paystackProvider: PaystackProvider,
    private flutterProvider: FlutterwaveProvider
  ) {
    // choose watcher by priority of configured keys
    const hasMoralis = !!(process.env.MORALIS_API_KEY || this.config.get('MORALIS_API_KEY'));
    const hasHelius = !!(process.env.HELIUS_API_KEY || this.config.get('HELIUS_API_KEY'));
    const hasBlock = !!(process.env.BLOCKSTREAM_API || this.config.get('BLOCKSTREAM_API'));
    const simulate = process.env.SIMULATE_DEPOSITS === 'true';

    if (hasMoralis) this.watcher = this.moralis;
    else if (hasHelius) this.watcher = this.helius;
    else if (hasBlock) this.watcher = this.blockstream;
    else if (simulate) this.watcher = this.mock;
    else this.watcher = this.mock; // default to mock but disabled unless SIMULATE_DEPOSITS

    // choose payout providers if keys present
    if (process.env.PAYSTACK_SECRET || this.config.get('PAYSTACK_SECRET')) this.paystack = paystackProvider;
    if (process.env.FLUTTERWAVE_SECRET || this.config.get('FLUTTERWAVE_SECRET')) this.flutterwave = flutterProvider;

    // register handler
    this.watcher.onDeposit(this.handleDeposit.bind(this));
  }

  async onModuleInit() {
    await this.watcher.start();
    this.logger.log('PaymentsAutomationService initialized with watcher: ' + this.watcher.constructor.name);
  }

  async handleDeposit(evt: DepositEvent) {
    this.logger.log('Automation received deposit: ' + JSON.stringify(evt));

    // idempotency: txHash check
    const existing = await this.prisma.transaction.findFirst({ where: { txHash: evt.txHash } });
    if (existing) {
      this.logger.log('Duplicate tx ignored: ' + evt.txHash);
      return;
    }

    // find owning user by custodial address
    const owner = await this.custodial.getByAddress(evt.address);
    const userId = owner?.userId || null;

    // create transaction
    const tx = await this.prisma.transaction.create({
      data: {
        amount: BigInt(evt.amount || '0'),
        currency: evt.symbol,
        txHash: evt.txHash,
        status: 'PENDING',
        type: 'DEPOSIT',
        fromWalletId: null,
        toWalletId: null,
        userId: userId
      }
    });

    // confirmations handling
    const required = evt.chain === 'BTC' ? 6 : (evt.chain === 'SOL' ? 1 : 1);
    if (evt.confirmations < required) {
      this.logger.log(`Tx ${evt.txHash} has ${evt.confirmations} confirmations; waiting for ${required}`);
      // real system: schedule re-check or wait for webhook update
      return;
    }

    // Convert amount to NGN: use placeholder oracle (CoinGecko recommended)
    const oracleRate = Number(process.env.MOCK_ORACLE_RATE || 1500); // NGN per USD
    // naive amount parsing: assume evt.amount is in smallest unit; callers must ensure proper units
    const humanAmount = Number(evt.amount) / (evt.symbol === 'BTC' ? 1e8 : evt.symbol === 'SOL' ? 1e9 : 1e6);
    const payoutNgn = Math.floor(humanAmount * oracleRate);

    // choose payout provider preference: Paystack else Flutterwave
    try {
      if (this.paystack) {
        this.logger.log('Triggering Paystack payout for tx ' + tx.id);
        // In production: you must create recipient first. Here we assume recipient code is provided in env for demo
        const recipient = process.env.PAYSTACK_RECIPIENT_CODE || null;
        if (!recipient) throw new Error('PAYSTACK_RECIPIENT_CODE not configured; cannot transfer');
        const resp = await this.paystack.initiateTransfer({ recipient, amount: payoutNgn * 100, reference: 'swap_' + tx.id });
        await this.prisma.transaction.update({ where: { id: tx.id }, data: { status: 'PROCESSING', meta: { payout: resp } } });
        this.logger.log('Paystack transfer response: ' + JSON.stringify(resp));
      } else if (this.flutterwave) {
        this.logger.log('Triggering Flutterwave payout for tx ' + tx.id);
        // requires account_bank (bank code) and account_number stored in DB for user; demo uses env
        const acct = process.env.DUMMY_ACCOUNT || '0000000000';
        const bank = process.env.DUMMY_BANK_CODE || '000';
        const resp = await this.flutterwave.transfer({ account_bank: bank, account_number: acct, amount: payoutNgn, narration: 'deposit payment', reference: 'swap_' + tx.id });
        await this.prisma.transaction.update({ where: { id: tx.id }, data: { status: 'PROCESSING', meta: { payout: resp } } });
        this.logger.log('Flutterwave transfer response: ' + JSON.stringify(resp));
      } else {
        this.logger.log('No payout provider configured; marking transaction for manual processing');
        await this.prisma.transaction.update({ where: { id: tx.id }, data: { status: 'PROCESSING', meta: { note: 'Awaiting payout provider' } } });
      }
    } catch (err) {
      this.logger.error('Error during payout: ' + (err?.message || err));
      await this.prisma.transaction.update({ where: { id: tx.id }, data: { status: 'FAILED', meta: { error: '' + err } } });
    }
  }
}
