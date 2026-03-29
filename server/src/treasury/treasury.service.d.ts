import { FlutterwaveService } from './flutterwave.service';
import { OtcService } from './otc.service';
import { LedgerService } from './ledger.service';
import { TreasuryRepository } from './treasury.repository';
import { FeeService } from './fee.service';
import { NotificationService } from './notification.service';
export declare class TreasuryService {
    private readonly flutterwave;
    private readonly otc;
    private readonly ledger;
    private readonly treasuryRepo;
    private readonly feeService;
    private readonly notificationService;
    constructor(flutterwave: FlutterwaveService, otc: OtcService, ledger: LedgerService, treasuryRepo: TreasuryRepository, feeService: FeeService, notificationService: NotificationService);
    processDeposit(depositId: string): Promise<{
        method: string;
        transferId: string;
        otcId?: undefined;
    } | {
        method: string;
        otcId: string;
        transferId?: undefined;
    }>;
}
