import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private tx;
    constructor(tx: TransactionsService);
    deposit(req: any, dto: any): Promise<{
        id: string;
        userId: string;
        address: string;
        chain: import(".prisma/client").$Enums.Chain;
        asset: string;
        tatumAccountId: string | null;
        tatumSubId: string | null;
        autoConvert: boolean;
        autoConvertTo: import(".prisma/client").$Enums.AutoConvertTarget | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    send(req: any, dto: any): Promise<{
        success: boolean;
    }>;
    withdraw(req: any, dto: any): Promise<{
        success: boolean;
    }>;
}
