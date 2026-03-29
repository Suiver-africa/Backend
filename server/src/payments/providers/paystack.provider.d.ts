import { ConfigService } from '@nestjs/config';
export declare class PaystackProvider {
    private config;
    private logger;
    private secret;
    private base;
    constructor(config: ConfigService);
    private headers;
    createRecipient({ name, account_number, bank_code }: {
        name: string;
        account_number: string;
        bank_code: string;
    }): Promise<any>;
    initiateTransfer({ recipient, amount, reference }: {
        recipient: string;
        amount: number;
        reference?: string;
    }): Promise<any>;
}
