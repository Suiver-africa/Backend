import { OnModuleInit } from '@nestjs/common';
import { DepositEvent } from './deposit-watcher.interface';
import { MockDepositWatcherService } from './mock-deposit-watcher.service';
import { MoralisWatcherService } from './moralis-watcher.service';
import { HeliusWatcherService } from './helius-watcher.service';
import { BlockstreamWatcherService } from './blockstream-watcher.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PaystackProvider } from '../payments/providers/paystack.provider';
import { FlutterwaveProvider } from '../payments/providers/flutterwave.provider';
import { CustodialWalletsService } from './custodial-wallets.service';
export declare class PaymentsAutomationService implements OnModuleInit {
    private mock;
    private moralis;
    private helius;
    private blockstream;
    private prisma;
    private config;
    private custodial;
    private paystackProvider;
    private flutterProvider;
    private logger;
    private watcher;
    private paystack;
    private flutterwave;
    constructor(mock: MockDepositWatcherService, moralis: MoralisWatcherService, helius: HeliusWatcherService, blockstream: BlockstreamWatcherService, prisma: PrismaService, config: ConfigService, custodial: CustodialWalletsService, paystackProvider: PaystackProvider, flutterProvider: FlutterwaveProvider);
    onModuleInit(): Promise<void>;
    handleDeposit(evt: DepositEvent): Promise<void>;
}
