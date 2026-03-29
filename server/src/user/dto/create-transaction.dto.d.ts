export declare class CreateTransactionDto {
    amount: number;
    type: 'deposit' | 'withdraw' | 'send' | 'request';
    reference?: string;
    recipientId?: string;
}
