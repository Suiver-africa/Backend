import { Module } from '@nestjs/common';
import { ListenerService } from './listener.service';
import { EvmListener } from './evm.listener';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from '../transactions/transactions.module';
import { CryptoModule } from '../crypto/crypto.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [ConfigModule, TransactionsModule, CryptoModule, PrismaModule],
    providers: [ListenerService, EvmListener],
    exports: [ListenerService],
})
export class ListenerModule { }
