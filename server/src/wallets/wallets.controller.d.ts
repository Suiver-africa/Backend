import { WalletService } from './wallets.service';
import { DepositDto, WithdrawDto, SendDto } from '../user/dto/wallet.dto';
import { Request } from 'express';
export declare class WalletController {
    private walletService;
    constructor(walletService: WalletService);
    getMyBalance(req: Request & {
        user: {
            id: string;
        };
    }): Promise<{
        balance: number;
        currency: any;
    }>;
    deposit(req: Request & {
        user: {
            id: string;
        };
    }, dto: DepositDto): Promise<{
        balance: number;
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
    withdraw(req: Request & {
        user: {
            id: string;
        };
    }, dto: WithdrawDto): Promise<{
        balance: number;
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
    send(req: Request & {
        user: {
            id: string;
        };
    }, dto: SendDto): Promise<{
        balance: number;
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
    getBalance(userId: string): Promise<{
        balance: number;
        currency: any;
    }>;
}
