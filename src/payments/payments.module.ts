import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CryptoModule } from '../crypto/crypto.module';
import { VTPassService } from './providers/vtpass.service';
import { PaystackService } from './providers/paystack.service';

@Module({
  imports: [PrismaModule, CryptoModule],
  providers: [PaymentsService, VTPassService, PaystackService],
  controllers: [PaymentsController],
  exports: [PaymentsService, VTPassService, PaystackService],
})
export class PaymentsModule { }