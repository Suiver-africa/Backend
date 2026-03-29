import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class ReferralService {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    validateReferralCode(referralCode: string): Promise<{
        valid: boolean;
        message: string;
        referrer?: undefined;
    } | {
        valid: boolean;
        referrer: {
            firstName: any;
            lastName: any;
            email: string | null;
            memberSince: Date;
        };
        message: string;
    }>;
    getUserReferralCode(userId: string): Promise<{
        referralCode: string;
        referralLink: string;
        shareMessage: string;
    }>;
    getUserReferrals(userId: string): Promise<{
        id: string;
        email: string | null;
        firstName: any;
        lastName: any;
        createdAt: Date;
        status: import(".prisma/client").$Enums.KycStatus;
    }[]>;
    getUserReferralStats(userId: string): Promise<{
        totalReferrals: number;
        totalRewards: number;
        myReferralCode: string;
        referrals: {
            id: string;
            email: string | null;
            firstName: any;
            lastName: any;
            createdAt: Date;
            reward: number;
        }[];
    }>;
    processReferralReward(referrerId: string, refereeId: string): Promise<{
        id: string;
        createdAt: Date;
        rewardType: string;
        rewardAmount: import("@prisma/client/runtime/library").Decimal;
        rewardPaid: boolean;
        rewardPaidAt: Date | null;
        conditionMet: boolean;
        conditionMetAt: Date | null;
        referrerId: string;
        referredId: string;
    }>;
    getReferralLeaderboard(limit?: number): Promise<{
        rank: number;
        firstName: any;
        lastName: any;
        referralCode: string;
        totalReferrals: any;
        totalRewards: number;
    }[]>;
    getReferralByCode(code: string): Promise<{
        reward: number;
        inviter: {
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
        } | null;
        invitee: {
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
        } | null;
        id: string;
        createdAt: Date;
        rewardType: string;
        rewardAmount: import("@prisma/client/runtime/library").Decimal;
        rewardPaid: boolean;
        rewardPaidAt: Date | null;
        conditionMet: boolean;
        conditionMetAt: Date | null;
        referrerId: string;
        referredId: string;
    }>;
    getUserReferralHistory(userId: string): Promise<{
        sentReferrals: {
            reward: number;
            invitee: {
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
            } | null;
            id: string;
            createdAt: Date;
            rewardType: string;
            rewardAmount: import("@prisma/client/runtime/library").Decimal;
            rewardPaid: boolean;
            rewardPaidAt: Date | null;
            conditionMet: boolean;
            conditionMetAt: Date | null;
            referrerId: string;
            referredId: string;
        }[];
        receivedReferral: {
            id: string;
            createdAt: Date;
            code: string;
            inviterId: string;
            inviteeId: string | null;
            reward: number;
            inviter: {
                email: string;
                firstName: string | null;
                lastName: string | null;
            } | null;
        } | null;
    }>;
    generateNewReferralCode(userId: string): Promise<{
        referralCode: string;
        message: string;
    }>;
    private generateUniqueReferralCode;
}
