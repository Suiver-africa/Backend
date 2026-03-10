import { Module } from '@nestjs/common';
import { TreasuryService } from './treasury.service';
import { FlutterwaveService } from './flutterwave.service';
import { OtcService } from './otc.service';
import { LedgerService } from './ledger.service';
import { TreasuryRepository } from './treasury.repository';
import { FeeService } from './fee.service';
import { NotificationService } from './notification.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FlutterwaveProvider } from '../payments/providers/flutterwave.provider';

@Module({
    imports: [PrismaModule],
    providers: [
        TreasuryService,
        FlutterwaveService,
        FlutterwaveProvider,
        OtcService,
        LedgerService,
        TreasuryRepository,
        FeeService,
        NotificationService,
    ],
    exports: [TreasuryService],
})
export class TreasuryModule { }
