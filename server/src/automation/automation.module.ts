import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { MockDepositWatcherService } from './mock-deposit-watcher.service';
import { MoralisWatcherService } from './moralis-watcher.service';
import { HeliusWatcherService } from './helius-watcher.service';
import { BlockstreamWatcherService } from './blockstream-watcher.service';
import { PaymentsAutomationService } from './payments-automation.service';
import { CustodialWalletsService } from './custodial-wallets.service';
import { PaystackProvider } from '../payments/providers/paystack.provider';
import { FlutterwaveProvider } from '../payments/providers/flutterwave.provider';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [
    PrismaService,
    MockDepositWatcherService,
    MoralisWatcherService,
    HeliusWatcherService,
    BlockstreamWatcherService,
    CustodialWalletsService,
    PaystackProvider,
    FlutterwaveProvider,
    PaymentsAutomationService,
  ],
  exports: [PaymentsAutomationService],
})
export class AutomationModule {}
