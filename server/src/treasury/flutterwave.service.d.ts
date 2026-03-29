import { FlutterwaveProvider } from '../payments/providers/flutterwave.provider';
export interface CreateRecipientDto {
    account_number: string;
    bank_code: string;
    currency: string;
    name: string;
}
export interface InitiateTransferDto {
    recipient: string;
    amount: number;
    reason?: string;
}
export declare class FlutterwaveService {
    private readonly provider;
    constructor(provider: FlutterwaveProvider);
    createRecipient(dto: CreateRecipientDto): Promise<{
        id: string;
        [key: string]: any;
    }>;
    initiateTransfer(dto: InitiateTransferDto): Promise<{
        id: string;
        [key: string]: any;
    }>;
}
