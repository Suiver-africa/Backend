export declare class DepositDto {
    amount: number;
    description?: string;
    currency?: string;
}
export declare class WithdrawDto {
    amount: number;
    currency: string;
    destinationAccount?: string;
}
export declare class SendDto {
    amount: number;
    currency: string;
    recipientId: string;
}
export declare class UpdateDto {
    currency?: string;
}
