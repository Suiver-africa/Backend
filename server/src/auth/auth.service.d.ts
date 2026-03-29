import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from '../otp/otp.service';
import { CreateUserDto, LoginDto, InitialSignupDto, CompleteSignupDto, ResetPasswordDto, InitialSignupResponseDto, CompleteSignupResponseDto, AuthResponseDto } from '../user/dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private otpService;
    private pendingSignups;
    private readonly PENDING_SIGNUP_EXPIRY;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, otpService: OtpService);
    validateUserByEmail(email: string, pass: string): Promise<{
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
    } | null>;
    initiateSignup(dto: InitialSignupDto): Promise<InitialSignupResponseDto>;
    completeSignup(dto: CompleteSignupDto): Promise<CompleteSignupResponseDto>;
    resendSignupOtp(email: string): Promise<import("../otp/otp.service").SendOtpResult>;
    signup(dto: CreateUserDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    forgotPassword(email: string): Promise<import("../otp/otp.service").SendOtpResult>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    generateTokens(userId: string, email: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshToken(userId: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    checkEmailVerification(email: string): Promise<{
        email: string;
        isVerified: boolean;
    }>;
    getCurrentUser(userId: string): Promise<{
        id: string;
        email: string | null;
        firstName: any;
        lastName: any;
        phone: string;
        tag: any;
        referralCode: string;
        kycStatus: import(".prisma/client").$Enums.KycStatus;
        biometricEnabled: any;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private processReferralReward;
    private findReferrerId;
    private generateUniqueTag;
    private generateUniqueReferralCode;
    private cleanupExpiredPendingSignups;
}
