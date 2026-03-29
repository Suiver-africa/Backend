import { ReferralService } from './referral.service';
import { ValidateReferralCodeDto } from './referral.dto';
export declare class ReferralController {
    private readonly referralService;
    constructor(referralService: ReferralService);
    validateReferralCode(dto: ValidateReferralCodeDto): Promise<{
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
    getMyReferralStats(req: any): Promise<{
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
    getMyReferralCode(req: any): Promise<{
        referralCode: string;
        referralLink: string;
        shareMessage: string;
    }>;
    getMyReferrals(req: any): Promise<{
        id: string;
        email: string | null;
        firstName: any;
        lastName: any;
        createdAt: Date;
        status: import(".prisma/client").$Enums.KycStatus;
    }[]>;
    getReferralLeaderboard(): Promise<{
        rank: number;
        firstName: any;
        lastName: any;
        referralCode: string;
        totalReferrals: any;
        totalRewards: number;
    }[]>;
    generateNewReferralCode(req: any): Promise<{
        referralCode: string;
        message: string;
    }>;
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
}
