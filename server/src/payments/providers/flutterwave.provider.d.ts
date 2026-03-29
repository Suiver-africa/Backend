import { ConfigService } from '@nestjs/config';
export declare class FlutterwaveProvider {
    private config;
    private logger;
    private secret;
    private base;
    constructor(config: ConfigService);
    private headers;
    createBeneficiary({ account_number, bank_code, name }: {
        account_number: string;
        bank_code: string;
        name: string;
    }): Promise<any>;
    transfer({ account_bank, account_number, amount, narration, currency, reference }: {
        account_bank: string;
        account_number: string;
        amount: number;
        narration?: string;
        currency?: string;
        reference?: string;
    }): Promise<any>;
}
