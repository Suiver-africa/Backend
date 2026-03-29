import { Module } from '@nestjs/common';
import { WalletService } from './wallets.service';
import { WalletController } from './wallets.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletsModule {}
