import { ConfigService } from '@nestjs/config';
export declare class PaystackService {
    private config;
    private logger;
    private secret;
    constructor(config: ConfigService);
    verifyAccount(account_number: string, bank_code: string): Promise<any>;
    triggerPayout({ account_number, bank_code, amount, currency, reference, account_name }: {
        account_number: string;
        bank_code: string;
        amount: number;
        currency?: string;
        reference?: string;
        account_name: string;
    }): Promise<any>;
}
