import { CryptoService } from './crypto.service';
import { RateService } from './rate.service';
import { TransactionsService } from '../transactions/transactions.service';
export declare class DepositController {
    private crypto;
    private rate;
    private transactions;
    constructor(crypto: CryptoService, rate: RateService, transactions: TransactionsService);
    webhook(body: {
        address: string;
        txHash: string;
        amount: string;
        currency: string;
    }): Promise<{
        ok: boolean;
    }>;
}
