import { Module } from '@nestjs/common';
import { ListenerService } from './listener.service';
import { EvmListener } from './evm.listener';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from '../transactions/transactions.module';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
    imports: [ConfigModule, TransactionsModule, CryptoModule],
    providers: [ListenerService, EvmListener],
    exports: [ListenerService],
})
export class ListenerModule { }
