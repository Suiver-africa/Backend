import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CryptoService } from './crypto.service';
import { DepositController } from './deposit.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { RateService } from './rate.service';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    PrismaModule,
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
    }),
    ConfigModule,
    TransactionsModule,
  ],
  providers: [CryptoService, RateService],
  controllers: [DepositController],
  exports: [CryptoService, RateService],
})
export class CryptoModule { }