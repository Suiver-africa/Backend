import { Module } from '@nestjs/common';
import { BeneficiariesService } from './beneficiaries.service';
import { BeneficiariesController } from './beneficiaries.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BeneficiariesService],
  controllers: [BeneficiariesController],
  exports: [BeneficiariesService],
})
export class BeneficiariesModule {}