export declare class ValidateReferralCodeDto {
    referralCode: string;
}
export declare class ReferralStatsResponseDto {
    totalReferrals: number;
    totalRewards: number;
    myReferralCode: string;
    referrals: Array<{
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        createdAt: Date;
        reward: number;
    }>;
}
