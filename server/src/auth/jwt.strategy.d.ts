import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    validate(payload: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        email: string | null;
        username: string | null;
        passwordHash: string;
        transactionPinHash: string | null;
        fullName: string;
        avatarInitials: string | null;
        kycStatus: import(".prisma/client").$Enums.KycStatus;
        kycProvider: import(".prisma/client").$Enums.KycProvider | null;
        kycSmileRef: string | null;
        kycQoreRef: string | null;
        bvnHash: string | null;
        autoConvertGlobal: boolean;
        autoTransferBank: boolean;
        defaultBankId: string | null;
        dailySellLimitUsd: import("@prisma/client/runtime/library").Decimal;
        dailySoldUsd: import("@prisma/client/runtime/library").Decimal;
        limitResetAt: Date | null;
        referralCode: string;
        referredById: string | null;
        isDeleted: boolean;
    }>;
}
export {};
